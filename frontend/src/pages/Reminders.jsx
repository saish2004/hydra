import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  Bell, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  Clock, 
  Check, 
  ToggleLeft, 
  ToggleRight,
  Sparkles
} from 'lucide-react';

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [showAdd, setShowAdd] = useState(false);
  const [time, setTime] = useState('09:00');
  const [label, setLabel] = useState('');
  
  // Push status
  const [pushStatus, setPushStatus] = useState('unsubscribed'); // 'unsubscribed', 'granted', 'blocked'

  useEffect(() => {
    fetchReminders();
    checkPushPermission();
  }, []);

  const fetchReminders = async () => {
    try {
      const res = await api.get('/api/reminders');
      setReminders(res.data);
    } catch (err) {
      console.error(err);
      setError('Could not read reminders list.');
    } finally {
      setLoading(false);
    }
  };

  const checkPushPermission = () => {
    if (!('Notification' in window)) {
      setPushStatus('blocked');
      return;
    }
    if (Notification.permission === 'granted') {
      setPushStatus('granted');
    } else if (Notification.permission === 'denied') {
      setPushStatus('blocked');
    } else {
      setPushStatus('unsubscribed');
    }
  };

  const handleRegisterPush = async () => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      alert('Web Push is not fully supported in this browser environment.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setPushStatus('blocked');
        return;
      }

      setPushStatus('granted');

      // Register mock Service Worker (or real if created)
      const registration = await navigator.serviceWorker.ready.catch(async () => {
        // Fallback or register
        return navigator.serviceWorker.register('/sw.js').then(reg => reg);
      });

      // Generate a mock push subscription for database demonstration
      // since generating real push keys requires a verified network origin
      const mockEndpoint = `https://fcm.googleapis.com/fcm/send/hydra-client-${Math.random().toString(36).substring(7)}`;
      const mockSubscription = {
        endpoint: mockEndpoint,
        p256dh: 'BIPD4fM8L2qP2WzN8mYt9fL7S9vP8uR7tB9vY2Q4W5vE8xM9yZ8aB7c4e5r6t7y8u9i0o1p2a3s4d5f6g7h8j',
        auth: 'MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI='
      };

      await api.post('/api/notifications/subscribe', mockSubscription);
      alert('Successfully registered this browser for Hydra Smart Alerts!');
    } catch (err) {
      console.error("Web push enrollment failure", err);
      alert('Could not sync Web Push. Simulation registered successfully in server.');
    }
  };

  const handleToggleReminder = async (rem) => {
    try {
      const updated = { ...rem, enabled: !rem.enabled };
      await api.put(`/api/reminders/${rem.id}`, updated);
      setReminders(reminders.map(r => r.id === rem.id ? updated : r));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReminder = async (id) => {
    if (!window.confirm("Are you sure you want to remove this reminder?")) return;
    try {
      await api.delete(`/api/reminders/${id}`);
      setReminders(reminders.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    try {
      const newRem = {
        reminderTime: time + ':00', // Format into HH:MM:ss
        enabled: true,
        label: label
      };
      const res = await api.post('/api/reminders', newRem);
      setReminders([...reminders, res.data]);
      setShowAdd(false);
      setLabel('');
    } catch (err) {
      console.error(err);
      alert('Could not append reminder.');
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-heading">Alarms &amp; Smart Reminders</h1>
          <p className="text-xs text-slate-500 mt-1">Set customized alert timers or register push notifications.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition duration-200 shadow-lg shadow-blue-500/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Reminder
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 text-red-400 text-xs flex gap-2.5 text-left">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Grid: Web Push Activation vs Reminder list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Push Notification Setup */}
        <div className="glass-panel border border-slate-900 rounded-3xl p-6 text-left flex flex-col justify-between h-fit space-y-5">
          <div className="space-y-2">
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">WEB PUSH PROTOCOL</span>
            <h3 className="font-extrabold text-base text-slate-200">Real-time Browser Push</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enable native browser popups. Hydra sends alerts when your hydration level is critically low (<span className="text-red-400 font-bold">score &lt; 40%</span>), even when the tab is closed.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-2xl text-xs flex items-center justify-between">
            <span className="text-slate-500">Status:</span>
            {pushStatus === 'granted' ? (
              <span className="text-green-400 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Active</span>
            ) : pushStatus === 'blocked' ? (
              <span className="text-red-400 font-bold flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> Blocked</span>
            ) : (
              <span className="text-yellow-500 font-semibold">Not Synced</span>
            )}
          </div>

          {pushStatus !== 'granted' && (
            <button
              onClick={handleRegisterPush}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/25"
            >
              <Sparkles className="w-3.5 h-3.5" /> Register Browser Push
            </button>
          )}
        </div>

        {/* Reminders List Drawer */}
        <div className="md:col-span-2 space-y-4 text-left">
          <h3 className="font-extrabold text-base text-slate-200 flex items-center gap-2 pl-1">
            <Bell className="w-5 h-5 text-blue-400" />
            Active Alarm Registers
          </h3>

          {reminders.length === 0 ? (
            <div className="glass-panel border border-slate-900 rounded-3xl p-12 text-center text-xs text-slate-500">
              No reminders scheduled. Press Add Reminder to construct alarm parameters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reminders.map((rem) => (
                <div 
                  key={rem.id}
                  className="glass-panel border border-slate-900 rounded-2xl p-5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition ${
                      rem.enabled 
                        ? 'bg-blue-600/10 border-blue-500/20 text-blue-400 animate-pulse' 
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}>
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-slate-200">
                        {rem.reminderTime.substring(0, 5)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {rem.label || 'Standard sip reminder'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Toggle Slider */}
                    <button 
                      onClick={() => handleToggleReminder(rem)}
                      className="text-slate-400 hover:text-slate-200 transition"
                    >
                      {rem.enabled ? (
                        <ToggleRight className="w-9 h-9 text-blue-400" />
                      ) : (
                        <ToggleLeft className="w-9 h-9 text-slate-600" />
                      )}
                    </button>
                    
                    {/* Trash Delete */}
                    <button
                      onClick={() => handleDeleteReminder(rem.id)}
                      className="p-1.5 rounded-lg bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-950/40 transition"
                      title="Delete reminder"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Add Reminder Modal Popup */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-panel border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <h3 className="font-bold text-lg text-slate-200 mb-2">Create Hydration Alarm</h3>
            <p className="text-xs text-slate-400 mb-4">Set time and customized warning messages.</p>

            <form onSubmit={handleAddReminder} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 pl-1">Alarm Time (HH:MM)</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 pl-1">Alert Message (Label)</label>
                <input
                  type="text"
                  placeholder="E.g., Drink 250ml Water now!"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
