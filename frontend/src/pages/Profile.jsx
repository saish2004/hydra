import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { User, Weight, Calendar, Goal, Bell, Sparkles, Check } from 'lucide-react';

export default function Profile() {
  const { setUser } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: '',
    gender: 'Male',
    weight: '',
    dailyWaterGoal: '',
    remindersEnabled: true,
    reminderInterval: '2'
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/profile');
      setFormData(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to download user profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setSuccess(false);
    setError('');

    try {
      const payload = {
        ...formData,
        age: parseInt(formData.age, 10),
        weight: parseFloat(formData.weight),
        dailyWaterGoal: parseInt(formData.dailyWaterGoal, 10)
      };
      const res = await api.put('/api/profile', payload);
      setFormData(res.data);
      setSuccess(true);
      
      // Update core user in AuthContext
      setUser(prev => ({
        ...prev,
        fullName: res.data.fullName
      }));

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update biological profile.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto overflow-y-auto w-full">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/60 pb-5">
        <div className="text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-heading">Editable Profile</h1>
          <p className="text-xs text-slate-500 mt-1">Adjust age, weight, and cellular targets here.</p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-green-950/20 border border-green-900/40 text-green-400 text-xs flex gap-2.5 items-center text-left">
          <Check className="w-4 h-4 flex-shrink-0" />
          <p>Biometric records updated successfully!</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 text-red-400 text-xs flex gap-2.5 items-start text-left">
          <span className="w-4 h-4 text-red-400">🚨</span>
          <p>{error}</p>
        </div>
      )}

      {/* Forms and Settings Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* Core details column */}
        <div className="glass-panel border border-slate-900 rounded-3xl p-6 h-fit space-y-5">
          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-900/60">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black text-lg">
              {formData.fullName.substring(0, 1)}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-200">{formData.fullName}</h3>
              <p className="text-xs text-slate-500">{formData.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-2xl flex items-center gap-3 text-xs">
              <Weight className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400">Weight Metric:</span>
              <span className="text-slate-200 font-bold ml-auto">{formData.weight} kg</span>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-2xl flex items-center gap-3 text-xs">
              <Goal className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400">Water Target:</span>
              <span className="text-slate-200 font-bold ml-auto">{formData.dailyWaterGoal} ml</span>
            </div>
          </div>
        </div>

        {/* Dynamic edits inputs column (takes 2 cols) */}
        <div className="lg:col-span-2 glass-panel border border-slate-900 rounded-3xl p-6 space-y-5">
          <h3 className="font-extrabold text-base text-slate-200 pb-3 border-b border-slate-900/60">Biometric Settings</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-1">Email (Read Only)</label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-500 bg-slate-950/40 border border-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 pl-1">Age (Years)</label>
              <input
                type="number"
                name="age"
                required
                min={1}
                value={formData.age}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-xs rounded-xl text-slate-200 glass-input"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 pl-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-xs rounded-xl text-slate-200 glass-input cursor-pointer"
              >
                <option value="Male" className="bg-slate-900">Male</option>
                <option value="Female" className="bg-slate-900">Female</option>
                <option value="Other" className="bg-slate-900">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 pl-1">Weight (KG)</label>
              <input
                type="number"
                name="weight"
                required
                min={10}
                step="any"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-xs rounded-xl text-slate-200 glass-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-1">Daily Water Goal (ml)</label>
              <input
                type="number"
                name="dailyWaterGoal"
                required
                min={1000}
                value={formData.dailyWaterGoal}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-1">Reminder Intervals</label>
              <select
                name="reminderInterval"
                value={formData.reminderInterval}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input cursor-pointer"
              >
                <option value="1" className="bg-slate-900">Every 1 Hour</option>
                <option value="2" className="bg-slate-900">Every 2 Hours</option>
                <option value="3" className="bg-slate-900">Every 3 Hours</option>
                <option value="4" className="bg-slate-900">Every 4 Hours</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-900 flex items-center justify-between">
            <label className="flex items-center gap-2.5 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                name="remindersEnabled"
                checked={formData.remindersEnabled}
                onChange={handleChange}
                className="rounded border-slate-850 text-blue-500 focus:ring-0 cursor-pointer w-4 h-4 bg-slate-900"
              />
              Enable push alerts reminders
            </label>

            <button
              type="submit"
              disabled={updating}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-500/20 disabled:opacity-40"
            >
              {updating ? 'Saving Records...' : 'Save Settings'}
            </button>
          </div>
        </div>

      </form>

    </div>
  );
}
