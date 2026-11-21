import React, { useState, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Camera, 
  Upload, 
  Volume2, 
  CheckCircle2, 
  PhoneCall, 
  FileText, 
  Wheat, 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  ChevronRight, 
  Wifi, 
  WifiOff, 
  Maximize2, 
  Minimize2,
  ExternalLink
} from 'lucide-react';
import { speakPunjabiText, stopSpeech } from '../utils/audio';
import { analyzeVision, executeGroundedQuery } from '../utils/api';

export default function SmartphoneSuperApp() {
  const [isListening, setIsListening] = useState(false);
  const [queryInput, setQueryInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [appResponse, setAppResponse] = useState(null);
  const [activeVisionResult, setActiveVisionResult] = useState(null);
  const [isVisionScanning, setIsVisionScanning] = useState(false);
  const [offlineCacheActive, setOfflineCacheActive] = useState(false);
  const [isFullScreenPhone, setIsFullScreenPhone] = useState(false);

  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Pre-cached offline dataset for zero-internet field operations
  const offlineCachedRecords = {
    'mandi': {
      title: 'Offline Field Cache: Punjab Mandi MSP Rates',
      summary: 'ਕਣਕ (Wheat) ਸਰਕਾਰੀ MSP: ₹2,275/ਕੁਇੰਟਲ | ਝੋਨਾ (Paddy): ₹2,320/ਕੁਇੰਟਲ। ਪੰਜਾਬ ਮੰਡੀ ਬੋਰਡ ਕੰਟਰੋਲ ਰੂਮ: 0172-5101640।',
      helpline: '0172-5101640',
      domain: 'AGRI-OFFLINE-CACHE'
    },
    'health': {
      title: 'Offline Field Cache: Emergency Helplines',
      summary: 'ਮੁਫ਼ਤ ਐਂਬੂਲੈਂਸ: 108 | ਡਾਕਟਰੀ ਸਲਾਹ ਹੈਲਪਲਾਈਨ: 104 | ਮਹਿਲਾ ਹੈਲਪਲਾਈਨ: 181 | ਬਿਜਲੀ ਸ਼ਿਕਾਇਤ: 1912।',
      helpline: '108 / 104',
      domain: 'HEALTH-OFFLINE-CACHE'
    }
  };

  // Submit Query to Grounding Engine
  const handleQuery = async (text) => {
    if (!text.trim()) return;
    setIsProcessing(true);
    setActiveVisionResult(null);

    if (offlineCacheActive) {
      setTimeout(() => {
        const offResp = text.toLowerCase().includes('mandi') || text.toLowerCase().includes('rate')
          ? offlineCachedRecords.mandi
          : offlineCachedRecords.health;
        setAppResponse({
          verified: true,
          detected_domain: 'Offline Field Cache',
          domain_badge: offResp.domain,
          punjabi_text: offResp.summary,
          roman_punjabi: 'Offline cache to data deliver ho gya.',
          english_text: offResp.title,
          source_citation: 'Device SQLite / IndexedDB Field Cache (Zero Internet)',
          confidence_score: 100.0,
          offline: true
        });
        speakPunjabiText(offResp.summary);
        setIsProcessing(false);
      }, 400);
      return;
    }

    try {
      const data = await executeGroundedQuery(text, 'smartphone_app');
      setAppResponse(data);
      if (data.punjabi_text) {
        speakPunjabiText(data.punjabi_text);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // Mic Toggle
  const toggleMic = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Browser does not support Web Speech Recognition. Please type or tap a quick domain tile.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.lang = 'pa-IN';
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
        stopSpeech();
      };

      rec.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setQueryInput(text);
        setIsListening(false);
        handleQuery(text);
      };

      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);

      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Camera Vision Presets
  const handleVisionPreset = async (presetType) => {
    setIsVisionScanning(true);
    setAppResponse(null);
    try {
      const dummyB64 = "data:image/jpeg;base64,/9j/4AAQSkZJRg==";
      const res = await analyzeVision(dummyB64, '', presetType);
      setActiveVisionResult(res);
      if (res.punjabi_summary) {
        speakPunjabiText(res.punjabi_summary);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsVisionScanning(false);
    }
  };

  // Custom Image Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      setIsVisionScanning(true);
      setAppResponse(null);
      try {
        const res = await analyzeVision(reader.result, 'Analyze this scan in Punjabi', 'wheat_disease');
        setActiveVisionResult(res);
        if (res.punjabi_summary) {
          speakPunjabiText(res.punjabi_summary);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsVisionScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Domain Quick-Tiles
  const domainTiles = [
    { title: 'ਖੇਤੀ ਤੇ ਮੰਡੀ ਭਾਅ', sub: 'Mandi & Crop Rates', icon: Wheat, query: 'Khanna mandi vich kanak da rate ki hai?', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40' },
    { title: 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ', sub: 'Shagun & Pensions', icon: FileText, query: 'Shagun scheme ya pension layi ki documents chahide ne?', color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/40' },
    { title: 'ਸਿਵਲ ਹਸਪਤਾਲ', sub: 'OPD & Emergency 108', icon: Building2, query: 'Ludhiana civil hospital OPD timing te emergency number dasso', color: 'border-rose-500/40 text-rose-400 bg-rose-950/40' },
    { title: 'ਵਜ਼ੀਫ਼ੇ ਤੇ ਨੌਕਰੀਆਂ', sub: 'Scholarships & Jobs', icon: GraduationCap, query: 'Punjab post-matric scholarship di last date ki hai?', color: 'border-purple-500/40 text-purple-400 bg-purple-950/40' },
  ];

  return (
    <div className={`flex flex-col items-center justify-center w-full px-2 py-4 ${isFullScreenPhone ? 'max-w-2xl mx-auto' : ''}`}>
      
      {/* Top Mobile Container Header */}
      <div className="flex items-center justify-between w-full max-w-[390px] mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setOfflineCacheActive(!offlineCacheActive)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono-code transition-all border ${
              offlineCacheActive
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/40 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            {offlineCacheActive ? <WifiOff className="w-3 h-3 text-amber-400" /> : <Wifi className="w-3 h-3 text-emerald-400" />}
            <span>{offlineCacheActive ? 'Offline Field Cache: ON' : 'Online Engine'}</span>
          </button>
        </div>

        <button
          onClick={() => setIsFullScreenPhone(!isFullScreenPhone)}
          className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center gap-1"
        >
          {isFullScreenPhone ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isFullScreenPhone ? 'Standard View' : 'Expand'}</span>
        </button>
      </div>

      {/* Smartphone Chassis */}
      <div className="relative w-full max-w-[390px] rounded-[48px] bg-gradient-to-b from-[#171b26] via-[#0d1017] to-[#070a10] border-[5px] border-[#2d3748] shadow-2xl shadow-emerald-950/20 overflow-hidden flex flex-col min-h-[720px]">
        
        {/* Dynamic Island / Notch */}
        <div className="pt-3 px-6 pb-2 flex items-center justify-between bg-[#111827] border-b border-slate-800 text-slate-400 text-[10px] font-mono-code">
          <span>9:41</span>
          <div className="w-24 h-4 rounded-full bg-black flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="flex items-center gap-1">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* App Title & Domicile Badge */}
        <div className="p-4 bg-gradient-to-b from-[#111827] to-[#090D16] border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base">Sahaayak Super-App</span>
                <span className="font-gurmukhi text-emerald-400 font-bold text-sm">ਸਹਾਇਕ</span>
              </div>
              <p className="text-[11px] text-slate-400">Universal Punjab Citizen & Farmer Assistant</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-gurmukhi font-bold text-sm">
              ਪੰ
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">

          {/* Hero Voice Mic Button Section */}
          <div className="flex flex-col items-center justify-center p-5 rounded-3xl bg-gradient-to-b from-[#1e293b]/60 to-[#0f172a]/80 border border-emerald-500/30 text-center relative overflow-hidden shadow-lg">
            
            <p className="text-xs font-mono-code text-slate-300 uppercase tracking-wider mb-2">
              Voice-First Punjabi AI
            </p>

            <button
              onClick={toggleMic}
              disabled={isProcessing}
              className={`relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 shadow-2xl active:scale-95 ${
                isListening
                  ? 'bg-rose-500 text-white shadow-rose-500/40 animate-pulse'
                  : 'bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 text-slate-950 shadow-emerald-500/40 hover:shadow-emerald-500/60'
              }`}
            >
              {isListening ? (
                <MicOff className="w-10 h-10" />
              ) : (
                <Mic className="w-10 h-10 fill-slate-950" />
              )}
              {/* Outer pulsing ring */}
              <span className="absolute inset-0 rounded-full border-2 border-emerald-400/50 animate-ping opacity-30"></span>
            </button>

            <h3 className="mt-3 font-gurmukhi text-lg font-bold text-white">
              {isListening ? 'ਸੁਣ ਰਿਹਾ ਹੈ... (Speak now)' : 'ਬੋਲੋ / Ask Anything in Punjabi'}
            </h3>
            <p className="text-[11px] text-slate-400 font-gurmukhi mt-0.5">
              ਕਣਕ ਰੇਟ, ਸ਼ਗਨ ਸਕੀਮ, ਪੈਨਸ਼ਨ, ਸਿਵਲ ਹਸਪਤਾਲ ਜਾਂ ਕੋਈ ਵੀ ਸਵਾਲ
            </p>
          </div>

          {/* Universal Camera Vision Scanner Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white font-gurmukhi">
                  ਫੋਟੋ ਖਿੱਚੋ / Universal Vision Scanner
                </span>
              </div>
              <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                Gemini 2.5 Flash
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mb-3">
              Scan any crop leaf disease, government notice/form, medicine strip, or soil card.
            </p>

            {/* Hidden native file input */}
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
            />

            {/* Vision One-Click Presets */}
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleVisionPreset('wheat_disease')}
                disabled={isVisionScanning}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-emerald-950/60 text-slate-200 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 text-[10px] flex flex-col items-center text-center transition-all"
              >
                <span className="text-sm mb-0.5">🌾</span>
                <span className="font-semibold">Wheat Rust</span>
                <span className="text-[9px] text-slate-400 font-gurmukhi">ਪੀਲੀ ਕੁੰਗੀ</span>
              </button>

              <button
                onClick={() => handleVisionPreset('govt_form')}
                disabled={isVisionScanning}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-cyan-950/60 text-slate-200 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-[10px] flex flex-col items-center text-center transition-all"
              >
                <span className="text-sm mb-0.5">📜</span>
                <span className="font-semibold">Govt Notice</span>
                <span className="text-[9px] text-slate-400 font-gurmukhi">ਸ਼ਗਨ ਫਾਰਮ</span>
              </button>

              <button
                onClick={() => handleVisionPreset('medicine_strip')}
                disabled={isVisionScanning}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 text-slate-200 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 text-[10px] flex flex-col items-center text-center transition-all"
              >
                <span className="text-sm mb-0.5">💊</span>
                <span className="font-semibold">Medicine Strip</span>
                <span className="text-[9px] text-slate-400 font-gurmukhi">ਸਿਵਲ ਦਵਾਈ</span>
              </button>
            </div>

            <button
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="w-full mt-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Custom Photo or Document</span>
            </button>
          </div>

          {/* Vision Diagnosis Card Output */}
          {activeVisionResult && (
            <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-black border-2 border-cyan-500/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono-code">
                    {activeVisionResult.category}
                  </span>
                </div>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {activeVisionResult.confidence}% Verified
                </span>
              </div>

              <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
                {activeVisionResult.title}
              </h4>

              <div className="p-3 rounded-xl bg-black/60 border border-slate-800 font-gurmukhi text-xs leading-relaxed text-slate-200">
                {activeVisionResult.punjabi_summary}
              </div>

              {activeVisionResult.action_items && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono-code text-slate-400 uppercase">Action Checklist:</span>
                  {activeVisionResult.action_items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono-code text-slate-400">
                <span>{activeVisionResult.verified_helpline}</span>
                <button
                  onClick={() => speakPunjabiText(activeVisionResult.punjabi_summary)}
                  className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 hover:text-white"
                  title="Speak Aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Grounded Query Result Card */}
          {appResponse && (
            <div className={`p-4 rounded-2xl border-2 space-y-3 ${
              appResponse.verified 
                ? 'bg-gradient-to-b from-slate-900 to-black border-emerald-500/40 shadow-xl' 
                : 'bg-gradient-to-b from-slate-900 to-black border-amber-500/40 shadow-xl'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded ${
                  appResponse.verified ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                }`}>
                  [{appResponse.domain_badge}]
                </span>
                <span className="text-[10px] font-mono-code text-slate-400">
                  {appResponse.confidence_score}% Confidence
                </span>
              </div>

              {/* Gurmukhi Spoken Text */}
              <div className="p-3 rounded-xl bg-black/60 border border-slate-800 font-gurmukhi text-sm leading-relaxed text-emerald-300">
                {appResponse.punjabi_text}
              </div>

              {/* English Summary */}
              <p className="text-xs text-slate-400 leading-normal">
                {appResponse.english_text}
              </p>

              {/* Source Citation */}
              <div className="pt-2 border-t border-slate-800 text-[10px] font-mono-code text-slate-400 flex items-center justify-between">
                <span className="truncate max-w-[240px]">Source: {appResponse.source_citation}</span>
                <button
                  onClick={() => speakPunjabiText(appResponse.punjabi_text)}
                  className="p-1 rounded bg-slate-800 text-emerald-400"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Domain Quick-Tiles */}
          <div>
            <span className="text-[11px] font-mono-code text-slate-400 uppercase tracking-wider block mb-2">
              Explore by Punjab Sector:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {domainTiles.map((tile, idx) => {
                const Icon = tile.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleQuery(tile.query)}
                    className={`p-3 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between ${tile.color}`}
                  >
                    <Icon className="w-5 h-5 mb-2" />
                    <div>
                      <div className="font-gurmukhi font-bold text-sm text-white">{tile.title}</div>
                      <div className="text-[10px] font-medium text-slate-400 truncate">{tile.sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Navigation Bar */}
        <div className="p-3 bg-[#111827] border-t border-slate-800 flex items-center justify-around text-slate-400 text-xs">
          <div className="flex flex-col items-center text-emerald-400 font-semibold">
            <Mic className="w-4 h-4 mb-0.5" />
            <span className="text-[9px]">Sahaayak</span>
          </div>
          <div className="flex flex-col items-center hover:text-white cursor-pointer" onClick={() => handleQuery('Khanna mandi')}>
            <Wheat className="w-4 h-4 mb-0.5" />
            <span className="text-[9px]">Mandi</span>
          </div>
          <div className="flex flex-col items-center hover:text-white cursor-pointer" onClick={() => handleQuery('Shagun scheme')}>
            <FileText className="w-4 h-4 mb-0.5" />
            <span className="text-[9px]">Schemes</span>
          </div>
          <div className="flex flex-col items-center hover:text-white cursor-pointer" onClick={() => handleQuery('Civil hospital')}>
            <Building2 className="w-4 h-4 mb-0.5" />
            <span className="text-[9px]">Hospital</span>
          </div>
        </div>

      </div>

    </div>
  );
}
