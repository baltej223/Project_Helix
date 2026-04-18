import React from 'react';
import { Bell, Settings, Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-surface-container-high px-8 py-4 flex justify-between items-center z-50">
      <div className="flex items-center gap-6">
        <div className="text-xl font-bold text-primary tracking-tighter">Digital Jurist</div>
        <div className="hidden md:flex items-center gap-4 bg-surface-container-low px-3 py-1.5 rounded-full border border-surface-container-high">
          <Search size={16} className="text-on-surface-variant" />
          <input 
            type="text" 
            placeholder="Search contracts..." 
            className="bg-transparent border-none outline-none text-sm w-64"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-surface-container-high transition-all rounded-full text-on-surface-variant">
          <Bell size={20} />
        </button>
        <button className="p-2 hover:bg-surface-container-high transition-all rounded-full text-on-surface-variant">
          <Settings size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-surface-container-high">
          <img 
            alt="Profile" 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" 
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
