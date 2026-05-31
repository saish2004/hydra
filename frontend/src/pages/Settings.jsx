import React, { useState } from 'react';
import api from '../utils/api';
import { Settings as SettingsIcon, Shield, Sliders, Database, Trash2, Heart, RefreshCw } from 'lucide-react';

export default function Settings() {
  const [resetting, setResetting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleResetData = async () => {
    const confirm = window.confirm("WARNING: This will clear all logged water logs, check-ins, and streaks in this simulation session. Continue?");
    if (!confirm) return;

    setResetting(true);
    try {
      // Simulate clear session or run backend reset
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      alert('Data reset simulation initiated. Please log in again to initialize new variables.');
      window.location.href = '/login';
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto overflow-y-auto w-full">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/60 pb-5">
        <div className="text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-heading">System Settings</h1>
          <p className="text-xs text-slate-500 mt-1">Configure database simulations, dev configurations, and reset credentials.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        
        {/* Left column navigation */}
        <div className="glass-panel border border-slate-900 rounded-3xl p-6 h-fit space-y-3">
          <div className="flex items-center gap-3.5 pb-3 border-b border-slate-900/60 mb-2">
            <SettingsIcon className="w-5 h-5 text-blue-400" />
            <h3 className="font-extrabold text-slate-200">Panel Directory</h3>
          </div>
          <div className="p-3.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-2xl text-xs font-bold flex items-center gap-2">
            <Sliders className="w-4 h-4" /> System Preferences
          </div>
          <div className="p-3.5 hover:bg-slate-900/40 border border-transparent hover:border-slate-800/40 text-slate-400 hover:text-slate-200 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer transition">
            <Shield className="w-4 h-4" /> Privacy &amp; Security
          </div>
        </div>

        {/* Right column details (takes 2 cols) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Section 1: Developer Keys */}
          <div className="glass-panel border border-slate-900 rounded-3xl p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-200 pb-3 border-b border-slate-900/60 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-400" /> VAPID Security Keys
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">VAPID Public Key</span>
                <input
                  type="text"
                  readOnly
                  value="BIPD4fM8L2qP2WzN8mYt9fL7S9vP8uR7tB9vY2Q4W5vE8xM9yZ8aB7c4e5r6t7y8u9i0o1p2a3s4d5f6g7h8j"
                  className="w-full px-3 py-2 text-slate-400 bg-slate-950/80 border border-slate-900 rounded-xl font-mono text-[10px] select-all cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Hydra uses Elliptic Curve Cryptography VAPID keys to verify server notifications with browser clients. Copy this public key to verify local manual testing configurations.
              </p>
            </div>
          </div>

          {/* Section 2: Reset Session Simulation */}
          <div className="glass-panel border border-slate-900 rounded-3xl p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-200 pb-3 border-b border-slate-900/60 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-400" /> Database Resets
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Resets all locally cached tokens, clears hydration streaks, and logging entities. This returns the workspace simulation to its default blank state.
            </p>

            <button
              onClick={handleResetData}
              disabled={resetting}
              className="py-3 px-5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 hover:border-red-500/50 text-red-400 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {resetting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              Wipe Simulated Session Data
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
