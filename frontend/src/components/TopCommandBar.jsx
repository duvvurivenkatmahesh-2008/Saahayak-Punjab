import React from 'react';
import { 
  ShieldCheck, 
  PhoneCall, 
  Smartphone, 
  Layers, 
  Database, 
  Settings, 
  Activity, 
  Radio, 
  Sparkles 
} from 'lucide-react';

export default function TopCommandBar({ activeTab, setActiveTab, onOpenSettings, isOnline = true }) {
  const tabs = [
    { id: 'mission_control', label: 'Mission Control', icon: Layers, badge: '3-Way Split' },
    { id: 'keypad_phone', label: 'Basic Keypad Phone', icon: PhoneCall, badge: 'Toll-Free 1800' },
    { id: 'smartphone_app', label: 'Smartphone Super-App', icon: Smartphone, badge: 'Voice + Vision' },
    { id: 'data_hub', label: 'Universal Data Hub', icon: Database, badge: 'Live Ingestion' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-emerald-500/20 bg-[#090D16]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & Grounding Engine Live Badge */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 shadow-lg shadow-emerald-500/20 border border-emerald-400/40">
            <span className="font-gurmukhi font-extrabold text-xl text-slate-950">ਸ</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Sahaayak AI Punjab
                <span className="font-gurmukhi text-emerald-400 font-semibold text-sm">ਸਹਾਇਕ AI</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Zero Hallucination
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>Universal Grounding Engine</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-mono-code">Toll-Free 1800-180-1551</span>
            </p>
          </div>
        </div>

        {/* 4-Tab View Switcher */}
        <div className="flex items-center gap-1 bg-[#111827]/90 p-1 rounded-xl border border-slate-800 shadow-inner overflow-x-auto max-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/40 border border-emerald-400/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono-code ${
                  isActive ? 'bg-black/30 text-emerald-200' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Action & Settings Drawer Button */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-mono-code text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>IVR ACTIVE: 1800-180-1551</span>
          </div>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors"
            title="Configure Sarvam AI & Gemini API Keys"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">API Keys</span>
          </button>
        </div>

      </div>
    </header>
  );
}
