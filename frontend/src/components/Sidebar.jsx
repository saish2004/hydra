import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Droplet, 
  BarChart3, 
  Bell, 
  User, 
  Trophy, 
  Settings,
  X
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/checkin', label: 'Daily Check-In', icon: ClipboardCheck },
    { to: '/water-tracker', label: 'Water Tracker', icon: Droplet },
    { to: '/analytics', label: 'Analytics & Trends', icon: BarChart3 },
    { to: '/reminders', label: 'Alarms & Reminders', icon: Bell },
    { to: '/achievements', label: 'Achievements', icon: Trophy },
    { to: '/profile', label: 'User Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Navigation Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 glass-panel border-r border-slate-900 flex flex-col transition-all duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header (Mobile Close Button) */}
        <div className="p-4 flex items-center justify-between border-b border-slate-900/60 lg:hidden">
          <span className="font-bold text-lg text-blue-400">💧 HYDRA NAV</span>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition duration-200
                  ${isActive 
                    ? 'bg-blue-600/10 border-blue-500/20 text-blue-400' 
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 hover:border-slate-800/40'}
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Accent */}
        <div className="p-4 border-t border-slate-900/60 text-center">
          <p className="text-[10px] text-slate-600">HYDRA v1.0.0 © 2026</p>
        </div>
      </aside>
    </>
  );
}
