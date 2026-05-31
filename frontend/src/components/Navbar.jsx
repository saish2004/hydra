import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, LogOut, User as UserIcon, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, readStatus: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const unreadCount = notifications.filter(n => !n.readStatus).length;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 px-4 py-3 flex items-center justify-between text-slate-100">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-slate-400 hover:text-slate-200">
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl font-heading text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          <span className="text-2xl">💧</span>
          HYDRA
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Button */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 transition duration-200 relative text-slate-300 hover:text-blue-400"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-80 glass-panel border border-slate-800 rounded-2xl shadow-2xl p-4 overflow-hidden z-50">
              <h3 className="font-bold text-sm text-slate-400 mb-3 border-b border-slate-800 pb-2">Recent Notifications</h3>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No notifications yet.</p>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => !notif.readStatus && handleMarkAsRead(notif.id)}
                      className={`p-2.5 rounded-xl border transition cursor-pointer text-left ${
                        notif.readStatus 
                          ? 'bg-slate-950/40 border-slate-900/60 text-slate-400' 
                          : 'bg-blue-950/20 border-blue-900/30 hover:bg-blue-950/30 text-slate-200'
                      }`}
                    >
                      <h4 className="font-semibold text-xs text-blue-400 flex items-center justify-between">
                        {notif.title}
                        {!notif.readStatus && <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                      </h4>
                      <p className="text-[11px] leading-relaxed mt-0.5">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Info & Logout */}
        {user && (
          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <Link to="/profile" className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-200">{user.fullName}</span>
              <span className="text-[10px] text-slate-500">{user.email}</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 hover:border-red-500/50 text-red-400 transition duration-200"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
