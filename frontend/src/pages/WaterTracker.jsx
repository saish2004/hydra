import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  Droplet, 
  Trash2, 
  Plus, 
  Calendar, 
  Sparkles, 
  TrendingUp 
} from 'lucide-react';

export default function WaterTracker() {
  const [logs, setLogs] = useState([]);
  const [goal, setGoal] = useState(2500);
  const [consumed, setConsumed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchWaterTrackerData();
  }, []);

  const fetchWaterTrackerData = async () => {
    try {
      // 1. Get user profile goal
      const profileRes = await api.get('/api/profile');
      setGoal(profileRes.data.dailyWaterGoal);

      // 2. Get today's intake amount
      const consumedRes = await api.get('/api/water/today');
      setConsumed(consumedRes.data);

      // 3. Get today's detailed logs list
      const logsRes = await api.get('/api/water/today-logs');
      setLogs(logsRes.data);
    } catch (err) {
      setError('Failed to fetch tracker logs. Verify connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWater = async (amount) => {
    setActionLoading(true);
    try {
      await api.post(`/api/water?amount=${amount}`);
      fetchWaterTrackerData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteLog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this log?")) return;
    setActionLoading(true);
    try {
      await api.delete(`/api/water/${id}`);
      fetchWaterTrackerData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  const remaining = Math.max(0, goal - consumed);
  const percent = Math.min(100, Math.round((consumed / goal) * 100));

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto overflow-y-auto w-full">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/60 pb-5">
        <div className="text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-heading">Water Intake Tracker</h1>
          <p className="text-xs text-slate-500 mt-1">Manage, add, and clear cellular rehydration logs in real time.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-900/10 border border-blue-800/30 text-xs font-semibold text-blue-400">
          <Calendar className="w-4 h-4" /> Today: {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Grid: Gauge vs Increments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core Progress Ring Widget */}
        <div className="glass-panel border border-slate-900 rounded-3xl p-6 sm:p-8 text-left flex flex-col justify-between relative overflow-hidden">
          <div>
            <h3 className="font-extrabold text-sm text-slate-400 tracking-wider">CELLULAR LOG DENSITY</h3>
            <p className="text-xs text-slate-500 mt-0.5">Hydration status compared against your profile goal.</p>
          </div>

          <div className="flex items-center gap-6 my-6">
            <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-slate-900" strokeWidth="6" stroke="currentColor" fill="transparent" r="48" cx="56" cy="56" />
                <circle 
                  className="text-blue-500" 
                  strokeWidth="6" 
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - percent / 100)}
                  strokeLinecap="round" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="48" 
                  cx="56" 
                  cy="56" 
                />
              </svg>
              <span className="absolute text-xl font-black text-slate-200">{percent}%</span>
            </div>
            
            <div className="space-y-1.5 text-left">
              <div className="text-2xl font-black text-slate-200">{consumed} ml <span className="text-xs text-slate-500 font-medium">consumed</span></div>
              <div className="text-sm font-semibold text-slate-400">Goal: {goal} ml</div>
              <div className="text-xs text-slate-500">
                {remaining > 0 ? `Need ${remaining} ml more today` : "Daily water goal achieved! Excellent work. 🎉"}
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-950/60 border border-slate-900 rounded-2xl p-4 flex justify-between items-center text-xs">
            <span className="text-slate-500">System Formula:</span>
            <span className="text-blue-400 font-bold">Weight x 35 ml</span>
          </div>
        </div>

        {/* Increments Buttons Widget */}
        <div className="glass-panel border border-slate-900 rounded-3xl p-6 sm:p-8 text-left flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-400 tracking-wider">INCREMENT QUANTUM LOGGING</h3>
            <p className="text-xs text-slate-500 mt-0.5">Click to append water consumption values to your daily logs.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 my-6">
            <button 
              onClick={() => handleAddWater(250)}
              disabled={actionLoading}
              className="py-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl font-black text-sm text-blue-400 flex flex-col items-center justify-center gap-1.5 transition"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400"><Plus className="w-4 h-4" /></div>
              +250 ml
            </button>
            <button 
              onClick={() => handleAddWater(500)}
              disabled={actionLoading}
              className="py-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl font-black text-sm text-blue-400 flex flex-col items-center justify-center gap-1.5 transition"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400"><Plus className="w-4 h-4" /></div>
              +500 ml
            </button>
            <button 
              onClick={() => handleAddWater(750)}
              disabled={actionLoading}
              className="py-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl font-black text-sm text-blue-400 flex flex-col items-center justify-center gap-1.5 transition"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400"><Plus className="w-4 h-4" /></div>
              +750 ml
            </button>
            <button 
              onClick={() => handleAddWater(1000)}
              disabled={actionLoading}
              className="py-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl font-black text-sm text-blue-400 flex flex-col items-center justify-center gap-1.5 transition"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400"><Plus className="w-4 h-4" /></div>
              +1.0 Litre
            </button>
          </div>

          <p className="text-[10px] text-slate-500 text-center">
            *Achievements recalculate dynamically on goal completion.
          </p>
        </div>

      </div>

      {/* Table Section: Todays intake logs history */}
      <div className="glass-panel border border-slate-900 rounded-3xl p-6 text-left">
        <h3 className="font-extrabold text-base text-slate-200 mb-4 flex items-center gap-2">
          <Droplet className="w-5 h-5 text-blue-400" />
          Consumption Chronology
        </h3>

        {logs.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">No water logged yet today. Take your first sip!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-slate-300 text-xs">
              <thead>
                <tr className="border-b border-slate-900/80 text-slate-500">
                  <th className="pb-3 text-left font-semibold">TIMESTAMP</th>
                  <th className="pb-3 text-left font-semibold">AMOUNT (ML)</th>
                  <th className="pb-3 text-right font-semibold">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/40">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/10 transition">
                    <td className="py-3 text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 font-bold text-slate-200">{log.amount} ml</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        disabled={actionLoading}
                        className="p-1.5 rounded-lg bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-950/40 transition"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
