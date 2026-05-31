import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Flame, 
  TrendingUp, 
  Lightbulb, 
  Clipboard, 
  ChevronRight, 
  AlertTriangle,
  Award
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({
    hydrationScore: 100,
    fatigueScore: 0,
    riskLevel: 'Excellent',
    waterConsumed: 0,
    waterGoal: 2000,
    currentStreak: 0,
    bestStreak: 0,
    recommendations: [],
    checkedInToday: false
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingWater, setAddingWater] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/api/dashboard');
      setData(res.data);
    } catch (err) {
      setError('Could not fetch dashboard analytics. Ensure your backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (amount) => {
    setAddingWater(true);
    try {
      await api.post(`/api/water?amount=${amount}`);
      // Refresh data
      fetchDashboardData();
    } catch (err) {
      console.error("Error adding water log", err);
    } finally {
      setAddingWater(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  const percentage = Math.min(100, Math.round((data.waterConsumed / data.waterGoal) * 100));

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto w-full">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-slate-950 border border-blue-900/20 rounded-3xl p-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-heading">
            Hydra Core Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Analyzing cellular hydration depth for <span className="text-blue-400 font-semibold">{user?.fullName}</span>.
          </p>
        </div>
        
        {/* Streak Block */}
        <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800/80 rounded-2xl px-5 py-3.5 self-start md:self-auto">
          <div className="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center">
            <Flame className="w-5.5 h-5.5 text-orange-500 fill-orange-500/20" />
          </div>
          <div className="text-left">
            <div className="text-xs text-slate-500 font-medium">Daily Streak</div>
            <div className="text-lg font-black text-slate-200">
              {data.currentStreak} <span className="text-xs font-normal text-slate-500">days (Best: {data.bestStreak})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Checkin Notification */}
      {!data.checkedInToday && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/30 via-cyan-900/10 to-transparent border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex gap-3 text-left">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 h-10 w-10 flex items-center justify-center flex-shrink-0">
              <Clipboard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm">Daily Health Check-In Required</h4>
              <p className="text-xs text-slate-400 mt-0.5">Answer 3 simple questions to calculate today's fatigue and dehydration levels.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/checkin')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition duration-200 self-start sm:self-auto"
          >
            Check In Now <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Key Indexes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Hydration Score (Circular/Radial widget) */}
        <div className="glass-panel border border-slate-900 rounded-3xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden">
          <div className="absolute top-4 left-4 font-bold text-xs text-slate-500 tracking-wider">HYDRATION SCORE</div>
          
          <div className="relative my-6 flex items-center justify-center">
            {/* SVG Circle Gauge */}
            <svg className="w-36 h-36">
              <circle 
                className="text-slate-800" 
                strokeWidth="8" 
                stroke="currentColor" 
                fill="transparent" 
                r="56" 
                cx="72" 
                cy="72" 
              />
              <circle 
                className="text-blue-500" 
                strokeWidth="8" 
                strokeDasharray={2 * Math.PI * 56}
                strokeDashoffset={2 * Math.PI * 56 * (1 - data.hydrationScore / 100)}
                strokeLinecap="round" 
                stroke="currentColor" 
                fill="transparent" 
                r="56" 
                cx="72" 
                cy="72" 
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-slate-200">{data.hydrationScore}%</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">{data.riskLevel}</span>
            </div>
          </div>

          <div className="w-full bg-slate-950/60 border border-slate-900 rounded-xl px-4 py-2 text-xs text-slate-400 flex justify-between items-center">
            <span>Critical limit: 40%</span>
            <span className={data.hydrationScore < 40 ? "text-red-400 font-bold" : "text-green-400"}>
              {data.hydrationScore < 40 ? "Dehydrated" : "Safe"}
            </span>
          </div>
        </div>

        {/* Fatigue Score Gauge */}
        <div className="glass-panel border border-slate-900 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-4 left-4 font-bold text-xs text-slate-500 tracking-wider">FATIGUE INDEX</div>
          
          <div className="flex-1 flex flex-col justify-center items-center py-6">
            <span className="text-6xl font-black text-orange-400 tracking-tight">{data.fatigueScore}%</span>
            <div className="mt-4 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[10px] text-slate-400 font-medium">
              {data.fatigueScore > 70 ? 'Extreme Exhaustion' : data.fatigueScore > 40 ? 'Moderate Fatigue' : 'Normal Energy'}
            </div>
          </div>

          <div className="w-full bg-slate-950/60 border border-slate-900 rounded-xl px-4 py-2 text-xs text-slate-400 flex justify-between items-center">
            <span>Recovery time</span>
            <span className="text-slate-200 font-bold">
              {data.fatigueScore > 70 ? "9 hours rest" : "Short breaks"}
            </span>
          </div>
        </div>

        {/* Water Intake Tracker Box */}
        <div className="glass-panel border border-slate-900 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-4 left-4 font-bold text-xs text-slate-500 tracking-wider">DAILY WATER TARGET</div>
          
          <div className="py-6 text-left">
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                {data.waterConsumed}
              </span>
              <span className="text-slate-500 text-sm">/ {data.waterGoal} ml</span>
            </div>
            
            {/* Wave Progress Bar */}
            <div className="mt-5 w-full bg-slate-950 h-3.5 rounded-full overflow-hidden border border-slate-900">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${percentage}%` }} 
              />
            </div>
            <div className="flex justify-between items-center mt-2 text-[10px] text-slate-500">
              <span>{percentage}% Completed</span>
              <span>{data.waterConsumed >= data.waterGoal ? "Target Met! 🎉" : `${data.waterGoal - data.waterConsumed}ml remaining`}</span>
            </div>
          </div>

          <div className="w-full flex gap-2">
            <button 
              onClick={() => handleQuickAdd(250)}
              disabled={addingWater}
              className="flex-1 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 hover:border-blue-500/50 text-blue-400 text-xs font-semibold transition"
            >
              +250ml
            </button>
            <button 
              onClick={() => handleQuickAdd(500)}
              disabled={addingWater}
              className="flex-1 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 hover:border-blue-500/50 text-blue-400 text-xs font-semibold transition"
            >
              +500ml
            </button>
          </div>
        </div>

      </div>

      {/* Dynamic Recommendation Panel & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Smart Recommendations */}
        <div className="lg:col-span-2 glass-panel border border-slate-900 rounded-3xl p-6 text-left">
          <h3 className="font-extrabold text-base text-slate-200 flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Dehydration Recovery Protocol
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.recommendations.map((rec, i) => (
              <div 
                key={i} 
                className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-2xl text-xs text-slate-300 flex items-start gap-2.5"
              >
                <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                  {i+1}
                </div>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Add Custom Hydration Widget */}
        <div className="glass-panel border border-slate-900 rounded-3xl p-6 text-left flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-200 flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Quick Log Actions
            </h3>
            <p className="text-xs text-slate-500 mb-4">Log standardized water amounts instantly into your cell indices.</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => handleQuickAdd(250)}
              disabled={addingWater}
              className="py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" /> 250ml
            </button>
            <button 
              onClick={() => handleQuickAdd(500)}
              disabled={addingWater}
              className="py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" /> 500ml
            </button>
            <button 
              onClick={() => handleQuickAdd(750)}
              disabled={addingWater}
              className="py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" /> 750ml
            </button>
            <button 
              onClick={() => handleQuickAdd(1000)}
              disabled={addingWater}
              className="py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" /> 1.0 Litre
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
