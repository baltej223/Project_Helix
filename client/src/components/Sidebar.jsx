import React from 'react';
import { FileUp, Search, BarChart3, Users, Plus, ShieldCheck } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Text } from './ui/Typography';

const Sidebar = () => {
  const navItems = [
    { icon: <FileUp size={22} />, label: 'Upload', path: '/upload' },
    { icon: <Search size={22} />, label: 'Analysis', path: '/analysis' },
    { icon: <BarChart3 size={22} />, label: 'Benchmarks', path: '/benchmarks' },
    { icon: <Users size={22} />, label: 'Marketplace', path: '/marketplace' },
  ];

  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col py-12 px-8 gap-2 relative z-50">
      <div className="mb-16 px-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
            <ShieldCheck size={20} />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tighter">LegalLens AI</div>
        </div>
        <Text variant="label" className="opacity-50 text-slate-500">Intelligent Legal OS</Text>
      </div>

      <nav className="flex flex-col gap-3">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-6 py-5 rounded-[1.5rem] transition-all duration-500 group
              ${isActive 
                ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl shadow-slate-900/25 scale-[1.02] active' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-2'}
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
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <Text variant="label" className="text-slate-500 opacity-80">System Status</Text>
          </div>
          <Text variant="detail" className="font-bold text-slate-900">Jurist Core 4.0 Online</Text>
        </div>
        
        <button className="w-full py-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2rem] font-black text-xs tracking-[0.2em] uppercase shadow-2xl shadow-slate-900/25 flex items-center justify-center gap-3 hover:opacity-90 transition-all active:scale-95 group">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
          New Case
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
