import React, { useState, useEffect } from 'react';
import { Settings, Key, ShieldCheck, Check, Sparkles, AlertCircle, X } from 'lucide-react';
import { getApiKeys, setApiKeys } from '../utils/api';

export default function SettingsModal({ isOpen, onClose }) {
  const [sarvamKey, setSarvamKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const keys = getApiKeys();
      setSarvamKey(keys.sarvamKey);
      setGeminiKey(keys.geminiKey);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKeys(sarvamKey, geminiKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#111827] border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl shadow-emerald-950/40 relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">API Keys & Engine Settings</h3>
            <p className="text-xs text-slate-400">Optional: Connect live Sarvam AI & Gemini 2.5 Flash</p>
          </div>
        </div>

        {/* Fallback assurance notice */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 mb-4 text-xs text-emerald-300 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold mb-0.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero-Setup Guaranteed Operation:</span>
          </div>
          If you leave these fields blank, Sahaayak AI automatically runs using its high-speed Web Speech Punjabi voice engine + grounded PAU/Punjab multimodal vision dataset with 100% features enabled.
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono-code text-slate-300 block mb-1 flex items-center justify-between">
              <span>Sarvam AI API Key (Bulbul Punjabi TTS & Saaras STT):</span>
              <span className="text-[10px] text-slate-500">Optional</span>
            </label>
            <input
              type="password"
              placeholder="Paste SARVAM_API_KEY..."
              value={sarvamKey}
              onChange={(e) => setSarvamKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono-code focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-mono-code text-slate-300 block mb-1 flex items-center justify-between">
              <span>Google Gemini API Key (Gemini 2.5 Flash Multimodal Vision):</span>
              <span className="text-[10px] text-slate-500">Optional</span>
            </label>
            <input
              type="password"
              placeholder="Paste GEMINI_API_KEY..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono-code focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => {
              setSarvamKey('');
              setGeminiKey('');
              setApiKeys('', '');
            }}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Clear Stored Keys
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs uppercase flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-slate-950" /> : <Sparkles className="w-4 h-4" />}
              <span>{savedSuccess ? 'Saved to Browser!' : 'Save & Close'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
