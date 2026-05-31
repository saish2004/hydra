import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Shield, Award, Sparkles, Brain, Clock, Zap } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-900/60 z-10">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          <span>💧</span> HYDRA
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-slate-100 hover:bg-slate-900/60 rounded-xl border border-slate-800 transition duration-200">
            Log In
          </Link>
          <Link to="/register" className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-500/20 text-white transition duration-200">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-24 flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
        <div className="flex-1 text-center lg:text-left space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Hydration & Fatigue Tracker
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight font-heading">
            Elevate Your Energy. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
              Master Your Hydration.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Hydra analyzes physiological inputs, urine color patterns, and environmental factors using smart algorithms to predict fatigue limits, calculate dehydration, and dynamic recover targets.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-2xl shadow-xl shadow-blue-500/20 text-white font-semibold transition duration-300 text-center relative group overflow-hidden">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start Hydrating Smart <Zap className="w-4 h-4" />
              </span>
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl text-slate-300 font-semibold transition duration-200 text-center">
              Learn More
            </Link>
          </div>
        </div>

        {/* Feature Dashboard Preview */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none">
          <div className="glass-panel rounded-3xl border border-slate-800 p-6 shadow-2xl relative">
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-400">
              LIVE SIMULATOR
            </div>
            <div className="flex items-center gap-3 border-b border-slate-900/60 pb-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-600/15 border border-blue-500/30 flex items-center justify-center">
                <Droplet className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-200">Hydra Dashboard</h3>
                <p className="text-xs text-slate-500">Real-time biometrics engine</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-2xl text-left">
                <p className="text-xs font-semibold text-slate-500">Hydration Index</p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-extrabold text-blue-400">82%</span>
                  <span className="text-[10px] text-green-400">Optimal</span>
                </div>
              </div>
              <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-2xl text-left">
                <p className="text-xs font-semibold text-slate-500">Fatigue Index</p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-extrabold text-orange-400">24%</span>
                  <span className="text-[10px] text-green-400">Low</span>
                </div>
              </div>
              <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-2xl text-left col-span-2">
                <p className="text-xs font-semibold text-slate-500">Intake Goal Progress</p>
                <div className="mt-3 w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full" style={{ width: '68%' }} />
                </div>
                <div className="flex justify-between items-center mt-2 text-[10px] text-slate-500">
                  <span>1,700 ml consumed</span>
                  <span>Goal: 2,500 ml</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="w-full max-w-7xl mx-auto px-6 py-12 md:py-24 border-t border-slate-900/60">
        <h2 className="text-center text-3xl font-bold text-slate-200 mb-12">Intelligent Hydration Frameworks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-slate-900/40 border border-slate-900 hover:border-slate-800 rounded-2xl text-left space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">Physiological Scoring</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Analyzes dynamic questionnaires (urine shade, skin elasticity, exhaustion levels) to calculate hydration depth and fatigue thresholds instantly.
            </p>
          </div>
          <div className="p-6 bg-slate-900/40 border border-slate-900 hover:border-slate-800 rounded-2xl text-left space-y-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">Smart Alert Triggering</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              If hydration score falls below 40%, the system automatically adjusts notification cycles, driving immediate smart rehydration warnings.
            </p>
          </div>
          <div className="p-6 bg-slate-900/40 border border-slate-900 hover:border-slate-800 rounded-2xl text-left space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">Gamification Engine</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Unlock unique milestones (First Check-In, 7 Day Streaks, Hydration Master) to turn fluid intake tracking into an engaging habits ritual.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-slate-900/60 text-slate-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>HYDRA Hydration Intelligence Systems.</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-300">Privacy</a>
          <a href="#" className="hover:text-slate-300">Terms</a>
          <a href="#" className="hover:text-slate-300">Support</a>
        </div>
      </footer>
    </div>
  );
}
