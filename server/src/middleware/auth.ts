import { NextFunction, Request, Response } from 'express';

export function attachMockAuth(req: Request, _res: Response, next: NextFunction): void {
  req.userId = req.header('x-user-id') || 'anonymous-user';
  next();
}
