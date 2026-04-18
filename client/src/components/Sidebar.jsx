import React from 'react';
import { FileUp, Search, BarChart3, Users, Plus, ShieldCheck } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Text } from './ui/Typography';

const Sidebar = () => {
  const navItems = [
    { icon: <FileUp size={22} />, label: 'Upload', path: '/' },
    { icon: <Search size={22} />, label: 'Analysis', path: '/analysis' },
    { icon: <BarChart3 size={22} />, label: 'Benchmarks', path: '/benchmarks' },
    { icon: <Users size={22} />, label: 'Marketplace', path: '/marketplace' },
  ];

  return (
    <aside className="w-80 bg-white border-r border-surface-container-high flex flex-col py-12 px-8 gap-2 relative z-50">
      <div className="mb-16 px-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <ShieldCheck size={20} />
          </div>
          <div className="text-2xl font-black text-on-surface tracking-tighter">Stitch AI</div>
        </div>
        <Text variant="label" className="opacity-50">Intelligent Legal OS</Text>
      </div>

      <nav className="flex flex-col gap-3">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-6 py-5 rounded-[1.5rem] transition-all duration-500 group
              ${isActive 
                ? 'bg-primary text-white shadow-2xl shadow-primary/20 scale-[1.02] active' 
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary hover:translate-x-2'}
            `}
          >
            <div className={`transition-transform duration-500 group-hover:scale-110`}>
              {item.icon}
            </div>
            <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="bg-surface-container-low/50 rounded-3xl p-6 border border-surface-container-high mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <Text variant="label" className="text-on-surface opacity-80">System Status</Text>
          </div>
          <Text variant="detail" className="font-bold">Jurist Core 4.0 Online</Text>
        </div>
        
        <button className="w-full py-5 bg-linear-to-br from-primary to-primary-dim text-white rounded-[2rem] font-black text-xs tracking-[0.2em] uppercase shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 hover:opacity-90 transition-all active:scale-95 group">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
          New Case
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
