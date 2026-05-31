import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Clipboard, ShieldAlert, Award, ChevronLeft, ChevronRight, Activity, Smile, Calendar } from 'lucide-react';

export default function DailyCheckIn() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Survey Form answers
  const [form, setForm] = useState({
    urineColor: '',
    energyLevel: '',
    skinTexture: ''
  });

  // Success summary details
  const [results, setResults] = useState(null);

  const handleSelect = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleNext = () => {
    if (step === 1 && !form.urineColor) return;
    if (step === 2 && !form.energyLevel) return;
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!form.skinTexture) return;
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/checkin', form);
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit check-in. You may have already checked in today.');
    } finally {
      setLoading(false);
    }
  };

  const urineOptions = [
    { value: 'Very clear', label: 'Very Clear (Hydrated)', color: 'bg-teal-500/10 border-teal-500/30 text-teal-400', colorDesc: 'Clear fluid, optimal cellular health.' },
    { value: 'Light yellow', label: 'Light Yellow (Normal)', color: 'bg-yellow-100/10 border-yellow-200/30 text-yellow-200', colorDesc: 'Standard baseline hydration levels.' },
    { value: 'Dark yellow', label: 'Dark Yellow (Dehydrated)', color: 'bg-yellow-600/10 border-yellow-500/30 text-yellow-500', colorDesc: 'Concentrated. Water intake needed.' },
    { value: 'Very dark', label: 'Very Dark Amber (Severe)', color: 'bg-amber-800/10 border-amber-700/30 text-amber-500', colorDesc: 'Critical dehydration alert!' }
  ];

  const energyOptions = [
    { value: 'Full of energy', label: 'Full of Energy', color: 'bg-green-500/10 border-green-500/30 text-green-400' },
    { value: 'Normal', label: 'Normal Baseline', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
    { value: 'Tired', label: 'Tired / Sluggish', color: 'bg-orange-500/10 border-orange-500/30 text-orange-400' },
    { value: 'Extremely exhausted', label: 'Extremely Exhausted', color: 'bg-red-500/10 border-red-500/30 text-red-400' }
  ];

  const skinOptions = [
    { value: 'Normal', label: 'Normal / Elastic', color: 'bg-green-500/10 border-green-500/30 text-green-400' },
    { value: 'Slightly dry', label: 'Slightly Dry', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' },
    { value: 'Dry', label: 'Dry / Tight', color: 'bg-orange-500/10 border-orange-500/30 text-orange-400' },
    { value: 'Very dry', label: 'Very Dry / Irritated', color: 'bg-red-500/10 border-red-500/30 text-red-400' }
  ];

  if (results) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto flex flex-col justify-center items-center">
        {/* Results Screen */}
        <div className="glass-panel border border-slate-900 rounded-3xl p-8 text-center space-y-6 w-full relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400" />
          
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400 animate-bounce">
            <Smile className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-100 font-heading">Check-In Logged!</h2>
            <p className="text-xs text-slate-400">Biological metrics processed successfully by scoring logic.</p>
          </div>

          {/* Results Summary Box */}
          <div className="grid grid-cols-2 gap-4 bg-slate-950/60 border border-slate-900 rounded-2xl p-4">
            <div className="text-left">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Cellular Hydration</span>
              <span className="text-3xl font-extrabold text-blue-400">{results.hydrationScore}%</span>
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Fatigue score</span>
              <span className="text-3xl font-extrabold text-orange-400">{results.fatigueScore}%</span>
            </div>
            <div className="col-span-2 text-left pt-2 border-t border-slate-900/60 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Dehydration Risk Index</span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400">
                {results.riskLevel}
              </span>
            </div>
          </div>

          {/* Tips rendering */}
          {results.recommendations && (
            <div className="text-left space-y-2.5">
              <span className="text-xs font-semibold text-slate-400 block pl-1">Dynamic Treatment Routine</span>
              <div className="space-y-1.5">
                {results.recommendations.split(' | ').map((rec, i) => (
                  <div key={i} className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl text-xs text-slate-300">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-200 text-xs font-bold transition"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/water-tracker')}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-500/20"
            >
              Water Tracker
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-xl mx-auto flex flex-col justify-center w-full">
      
      {/* Back Button */}
      {step > 1 && (
        <button 
          onClick={handleBack}
          className="self-start flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 mb-4 font-semibold"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Step {step - 1}
        </button>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/20 border border-red-900/40 text-red-400 text-xs flex gap-2.5 items-start text-left">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <div className="glass-panel border border-slate-900 rounded-3xl p-6 sm:p-8 text-left space-y-6 shadow-2xl relative">
        {/* Top Progress bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-slate-900 rounded-t-3xl overflow-hidden">
          <div 
            className="bg-blue-500 h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Step 1: Urine Color */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Step 1 of 3</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-100 font-heading mt-1">Urine Color Evaluation</h2>
              <p className="text-xs text-slate-500 mt-1">Select the option that matches your urine color today. (Primary hydration indicator)</p>
            </div>

            <div className="space-y-3">
              {urineOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect('urineColor', opt.value)}
                  className={`w-full p-4 rounded-2xl border text-left transition flex justify-between items-center gap-4 ${
                    form.urineColor === opt.value
                      ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                      : 'bg-slate-950/60 border-slate-900 hover:border-slate-800 text-slate-300'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm">{opt.label}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{opt.colorDesc}</p>
                  </div>
                  <span className={`w-3.5 h-3.5 rounded-full border-2 ${
                    form.urineColor === opt.value ? 'bg-blue-500 border-blue-500' : 'border-slate-700'
                  }`} />
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!form.urineColor}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl font-bold text-xs transition disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              Continue to Step 2 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Energy Level */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Step 2 of 3</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-100 font-heading mt-1">Energy & Stamina Index</h2>
              <p className="text-xs text-slate-500 mt-1">How has your physical and mental stamina been today?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {energyOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect('energyLevel', opt.value)}
                  className={`p-5 rounded-2xl border text-left transition flex flex-col justify-between h-28 ${
                    form.energyLevel === opt.value
                      ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                      : 'bg-slate-950/60 border-slate-900 hover:border-slate-800 text-slate-300'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full border-2 self-end ${
                    form.energyLevel === opt.value ? 'bg-blue-500 border-blue-500' : 'border-slate-700'
                  }`} />
                  <h4 className="font-bold text-sm tracking-wide">{opt.value}</h4>
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!form.energyLevel}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl font-bold text-xs transition disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              Continue to Step 3 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 3: Skin Texture */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Step 3 of 3</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-100 font-heading mt-1">Dermal Moisture Level</h2>
              <p className="text-xs text-slate-500 mt-1">Examine skin elasticity (e.g. pinch testing on back of your hand).</p>
            </div>

            <div className="space-y-3">
              {skinOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect('skinTexture', opt.value)}
                  className={`w-full p-4 rounded-2xl border text-left transition flex justify-between items-center ${
                    form.skinTexture === opt.value
                      ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                      : 'bg-slate-950/60 border-slate-900 hover:border-slate-800 text-slate-300'
                  }`}
                >
                  <h4 className="font-bold text-sm">{opt.label}</h4>
                  <span className={`w-3.5 h-3.5 rounded-full border-2 ${
                    form.skinTexture === opt.value ? 'bg-blue-500 border-blue-500' : 'border-slate-700'
                  }`} />
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!form.skinTexture || loading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl font-bold text-xs transition disabled:opacity-40 flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20"
            >
              {loading ? 'Processing Bio Data...' : 'Submit Health Metrics'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
