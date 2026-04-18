import { createClerkClient, verifyToken } from '@clerk/backend';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';
import config from '../config/index.js';

const clerkClient = createClerkClient({ secretKey: config.clerkSecretKey });

export interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: any;
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. No token provided.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the Clerk JWT
    const decoded = await verifyToken(token, {
      secretKey: config.clerkSecretKey,
    });
    const clerkId = decoded.sub;

    if (!clerkId) {
      throw new Error('Invalid token payload: missing sub claim');
    }

    // Check if user exists in MongoDB, if not create them
    let user = await User.findOne({ clerkId });

    if (!user) {
      // Fetch user details from Clerk to get email
      const clerkUser = await clerkClient.users.getUser(clerkId);
      const email = clerkUser.emailAddresses[0]?.emailAddress || 'no-email@provided.com';

      user = await User.create({
        clerkId,
        email,
      });
      console.log(`Created new user record for clerkId: ${clerkId}`);
    }

    // Attach userId and user object to request
    req.userId = clerkId;
    req.user = user;

    next();
  } catch (error: any) {
    console.error('Authentication error:', error.message);
    
    const status = error.message.includes('expired') ? 401 : 401;
    return res.status(status).json({
      success: false,
      message: 'Invalid or expired token.',
      error: config.isDevelopment ? error.message : undefined,
    });
  }
};
