import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Trophy, Award, Flame, ClipboardCheck, Lock, Unlock, Calendar } from 'lucide-react';

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [unlockedIds, setUnlockedIds] = useState(new Map()); // achievementId -> unlockedAt
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAchievementsData();
  }, []);

  const fetchAchievementsData = async () => {
    try {
      // 1. Get all system achievements
      const allRes = await api.get('/api/achievements');
      setAchievements(allRes.data);

      // 2. Get user unlocked mapping
      const unlockedRes = await api.get('/api/achievements/unlocked');
      const mapping = new Map();
      unlockedRes.data.forEach(item => {
        mapping.set(item.achievement.id, item.unlockedAt);
      });
      setUnlockedIds(mapping);
    } catch (err) {
      console.error(err);
      setError('Could not download rewards catalog.');
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName, isUnlocked) => {
    const cls = `w-6 h-6 ${isUnlocked ? 'text-blue-400' : 'text-slate-600'}`;
    switch(iconName) {
      case 'check_in':
        return <ClipboardCheck className={cls} />;
      case 'streak_7':
        return <Flame className={`w-6 h-6 ${isUnlocked ? 'text-orange-500 fill-orange-500/10' : 'text-slate-600'}`} />;
      case 'streak_30':
        return <Trophy className={`w-6 h-6 ${isUnlocked ? 'text-yellow-400' : 'text-slate-600'}`} />;
      case 'master':
        return <Award className={`w-6 h-6 ${isUnlocked ? 'text-indigo-400' : 'text-slate-600'}`} />;
      default:
        return <Award className={cls} />;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  const unlockedCount = unlockedIds.size;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto overflow-y-auto w-full">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/60 pb-5">
        <div className="text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-heading">Achievements &amp; Milestones</h1>
          <p className="text-xs text-slate-500 mt-1">Unlock gamified awards by maintaining consistent hydration cycles.</p>
        </div>
        
        {/* Aggregated unlocked metrics */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 self-start sm:self-auto">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="text-xs font-bold text-slate-300">
            {unlockedCount} / {achievements.length} Badges Unlocked
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 text-red-400 text-xs flex gap-2.5 text-left">
          <Lock className="w-4 h-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Grid listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        {achievements.map((ach) => {
          const isUnlocked = unlockedIds.has(ach.id);
          const unlockedAt = unlockedIds.get(ach.id);

          return (
            <div 
              key={ach.id}
              className={`glass-panel border rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative ${
                isUnlocked 
                  ? 'border-blue-900/40 bg-gradient-to-br from-blue-950/15 via-slate-950 to-slate-950 shadow-lg shadow-blue-500/5' 
                  : 'border-slate-900 bg-slate-950/40'
              }`}
            >
              {/* Lock/Unlock Floating Indicator */}
              <div className="absolute top-4 right-4">
                {isUnlocked ? (
                  <span className="p-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 block"><Unlock className="w-3.5 h-3.5" /></span>
                ) : (
                  <span className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 block"><Lock className="w-3.5 h-3.5" /></span>
                )}
              </div>

              <div className="flex gap-4">
                {/* Icon wrapper */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border flex-shrink-0 ${
                  isUnlocked 
                    ? 'bg-blue-600/10 border-blue-500/30' 
                    : 'bg-slate-900 border-slate-850'
                }`}>
                  {getIconComponent(ach.icon, isUnlocked)}
                </div>

                <div className="space-y-1 pr-6">
                  <h4 className={`font-extrabold text-sm ${isUnlocked ? 'text-slate-100' : 'text-slate-500'}`}>
                    {ach.name}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>

              {/* Unlocked date badge if unlocked */}
              {isUnlocked && unlockedAt && (
                <div className="mt-4 pt-3.5 border-t border-slate-900/60 flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                  <Calendar className="w-3.5 h-3.5" /> Unlocked on {new Date(unlockedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
