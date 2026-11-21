import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  MessageSquare, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle,
  RotateCcw,
  Radio
} from 'lucide-react';
import { playDtmfTone, playRingtone, playHangupTone, speakPunjabiText, stopSpeech } from '../utils/audio';

export default function KeypadPhone({ 
  onQuerySubmit, 
  currentResponse, 
  isLoading, 
  isFullScreen = false 
}) {
  const [callState, setCallState] = useState('IDLE'); // 'IDLE', 'RINGING', 'CONNECTED', 'SPEAKING', 'LISTENING'
  const [callDuration, setCallDuration] = useState(0);
  const [screenText, setScreenText] = useState('PUNJAB GOVT IVR\n1800-180-1551\nPress CALL to start');
  const [dialBuffer, setDialBuffer] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSmsCard, setShowSmsCard] = useState(false);
  const [lastSmsData, setLastSmsData] = useState(null);
  const [copiedSms, setCopiedSms] = useState(false);

  const timerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Call duration counter
  useEffect(() => {
    if (callState === 'CONNECTED' || callState === 'SPEAKING' || callState === 'LISTENING') {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [callState]);

  // Update screen text when a grounded response arrives
  useEffect(() => {
    if (!currentResponse) return;

    if (currentResponse.verified) {
      setScreenText(
        `[${currentResponse.domain_badge}]\n` +
        (currentResponse.punjabi_text ? currentResponse.punjabi_text.slice(0, 140) + '...' : 'Verified facts retrieved.')
      );

      // Play audio response if call is active
      if (callState !== 'IDLE') {
        setCallState('SPEAKING');
        speakPunjabiText(
          currentResponse.punjabi_text,
          () => setCallState('SPEAKING'),
          () => setCallState('LISTENING')
        );
      }
    } else if (currentResponse.hallucination_blocked) {
      setScreenText(
        `[BLOCKED: <72% CONF]\n` +
        `ਸਾਹਾਇਕ AI: ਇਹ ਜਾਣਕਾਰੀ ਪੰਜਾਬ ਸਰਕਾਰ ਦੇ ਡੇਟਾ ਵਿੱਚ ਪ੍ਰਮਾਣਿਤ ਨਹੀਂ ਹੈ।`
      );
      if (callState !== 'IDLE') {
        setCallState('SPEAKING');
        speakPunjabiText(
          currentResponse.punjabi_text,
          () => setCallState('SPEAKING'),
          () => setCallState('LISTENING')
        );
      }
    }
  }, [currentResponse]);

  // Format timer MM:SS
  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Start Call Flow
  const handleStartCall = () => {
    if (callState !== 'IDLE') return;

    setCallState('RINGING');
    setCallDuration(0);
    setScreenText('DIALING...\n1800-180-1551\nConnecting to Sahaayak...');
    playRingtone();

    setTimeout(() => {
      setCallState('CONNECTED');
      setScreenText('CONNECTED: 1800-180-1551\nਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਸਾਹਾਇਕ AI\nਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛੋ ਜਾਂ ਨੰਬਰ ਦਬਾਓ:');
      
      const greeting = 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਸਾਹਾਇਕ AI ਪੰਜਾਬ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਮੰਡੀ ਭਾਅ ਲਈ 1 ਦਬਾਓ, ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਲਈ 2 ਦਬਾਓ, ਸਿਵਲ ਹਸਪਤਾਲ ਲਈ 3 ਦਬਾਓ, ਜਾਂ ਸਿੱਧਾ ਬੋਲੋ।';
      speakPunjabiText(
        greeting,
        () => setCallState('SPEAKING'),
        () => setCallState('LISTENING')
      );
    }, 1800);
  };

  // Hang-up Call Flow
  const handleEndCall = () => {
    if (callState === 'IDLE') return;

    stopSpeech();
    playHangupTone();
    setCallState('IDLE');
    setScreenText('CALL ENDED\n1800-180-1551\nSMS Summary Sent.');

    // Save SMS Data if we had a query result
    if (currentResponse) {
      setLastSmsData({
        timestamp: new Date().toLocaleTimeString(),
        phone: '1800-180-1551',
        domain: currentResponse.detected_domain,
        verified: currentResponse.verified,
        punjabi: currentResponse.punjabi_text,
        roman: currentResponse.roman_punjabi,
        english: currentResponse.english_text,
        citation: currentResponse.source_citation
      });
      setShowSmsCard(true);
    }
  };

  // Handle Keypad Buttons
  const handleKeyPress = (key) => {
    playDtmfTone(key);
    setDialBuffer((prev) => (prev + key).slice(-12));

    // If on active call, trigger DTMF action
    if (callState !== 'IDLE') {
      if (key === '1') {
        setScreenText('DTMF [1] PRESSED\nQuerying Mandi & Weather...\nਖੰਨਾ ਮੰਡੀ ਕਣਕ ਰੇਟ');
        onQuerySubmit('Khanna mandi vich kanak da rate ki hai?');
      } else if (key === '2') {
        setScreenText('DTMF [2] PRESSED\nQuerying Govt Schemes...\nਸ਼ਗਨ ਸਕੀਮ ਦਸਤਾਵੇਜ਼');
        onQuerySubmit('Shagun scheme ya pension layi ki documents chahide ne?');
      } else if (key === '3') {
        setScreenText('DTMF [3] PRESSED\nQuerying Hospitals...\nਲੁਧਿਆਣਾ ਸਿਵਲ ਹਸਪਤਾਲ');
        onQuerySubmit('Ludhiana civil hospital OPD timing te emergency number dasso');
      } else if (key === '0') {
        setScreenText('DTMF [0] PRESSED\nConnecting to Human Officer...\n1076 Citizen Grievance');
        speakPunjabiText('ਤੁਹਾਡੀ ਕਾਲ ਪੰਜਾਬ ਸੇਵਾ ਕੇਂਦਰ ਸਹਾਇਤਾ ਅਧਿਕਾਰੀ ਨਾਲ ਜੋੜੀ ਜਾ ਰਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਲਾਈਨ ਤੇ ਬਣੇ ਰਹੋ।');
      } else {
        setScreenText(`DTMF [${key}] Tone Sent\nListening for voice query...`);
      }
    } else {
      setScreenText(`DIAL: ${dialBuffer + key}\nPress [CALL] to connect`);
    }
  };

  // Microphone Speech Recognition
  const toggleListening = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Browser does not support Web Speech Recognition. Please use the quick-test chips below!');
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
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setIsListening(true);
        setScreenText('MIC LISTENING...\nਆਪਣਾ ਸਵਾਲ ਬੋਲੋ (Speak in Punjabi)');
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setScreenText(`HEARD:\n"${transcript}"\nVerifying with Punjab Data...`);
        if (callState === 'IDLE') {
          handleStartCall();
        }
        onQuerySubmit(transcript);
      };

      rec.onerror = (e) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
        // Fallback prompt
        setScreenText('Voice timeout.\nClick a quick query chip below:');
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  // Quick Test Queries across diverse sectors
  const testChips = [
    { label: '🌾 Khanna Mandi Wheat Rate', query: 'Khanna mandi vich kanak da rate ki hai?' },
    { label: '📜 Shagun Scheme Documents', query: 'Shagun scheme ya pension layi ki documents chahide ne?' },
    { label: '🏥 Ludhiana Hospital OPD & 108', query: 'Ludhiana civil hospital OPD timing te emergency number dasso' },
    { label: '🎓 Post-Matric Scholarship Deadline', query: 'Punjab post-matric scholarship di last date ki hai?' },
    { label: '⚡ Free 300 Units Bijli / 1912', query: 'Bijli bill 300 units free te pspcl helpline 1912' },
    { label: '⚠️ Hallucination Test: Mars Land Price', query: 'Mars te zameen da rate ki hai?' },
  ];

  return (
    <div className={`flex flex-col items-center w-full ${isFullScreen ? 'max-w-xl mx-auto py-6' : ''}`}>
      
      {/* Title & Toll-Free Banner */}
      <div className="w-full text-center mb-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/30 text-xs text-slate-300">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">Basic Keypad Phone IVR</span>
          <span className="text-emerald-400 font-mono-code font-bold">1800-180-1551</span>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded font-mono-code">TOLL-FREE</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Works on any ₹999 JioBharat or basic 2G feature phone without internet</p>
      </div>

      {/* Feature Phone Chassis */}
      <div className="relative w-[310px] sm:w-[330px] rounded-[44px] bg-gradient-to-b from-[#262c36] via-[#171b22] to-[#0e1117] p-5 shadow-2xl shadow-black border-4 border-[#3a4454] select-none">
        
        {/* Phone Speaker Grill */}
        <div className="flex justify-center mb-3">
          <div className="w-14 h-1.5 rounded-full bg-[#0a0d12] border border-[#374151] flex items-center justify-around px-2">
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
          </div>
        </div>

        {/* NOKIA / SAHAAYAK Brand Name */}
        <div className="text-center mb-2">
          <span className="text-[11px] font-mono-code font-extrabold tracking-widest text-slate-400 uppercase">
            SAHAAYAK 1800
          </span>
        </div>

        {/* Glowing LCD Screen */}
        <div className="relative rounded-2xl p-3 mb-4 border-2 border-[#4b5563] overflow-hidden bg-[#102217] text-[#4ade80] shadow-inner font-mono-code min-h-[148px] flex flex-col justify-between">
          
          {/* LCD Top Status Bar */}
          <div className="flex items-center justify-between text-[10px] pb-1 border-b border-[#2d5236] text-[#86efac]">
            <div className="flex items-center gap-1">
              <span className="font-bold">ıll PUNJAB</span>
              <span className="text-[9px]">4G</span>
            </div>
            <div className="flex items-center gap-1.5">
              {callState !== 'IDLE' && (
                <span className="text-amber-300 font-bold animate-pulse">
                  CALL {formatTimer(callDuration)}
                </span>
              )}
              <span className="font-bold">🔋 100%</span>
            </div>
          </div>

          {/* LCD Center Display Content */}
          <div className="py-2 text-xs leading-relaxed whitespace-pre-wrap font-gurmukhi overflow-hidden max-h-[86px]">
            {isLoading ? (
              <div className="flex items-center gap-2 text-amber-300 animate-pulse font-mono-code">
                <span>⚡ Grounding with Punjab DB...</span>
              </div>
            ) : (
              screenText
            )}
          </div>

          {/* LCD Audio Equalizer Waveform during active voice */}
          <div className="flex items-center justify-between pt-1 border-t border-[#2d5236] text-[10px]">
            <span className="text-[#86efac] text-[9px] uppercase">
              {callState === 'SPEAKING' ? 'AI SPEAKING' : callState === 'LISTENING' ? 'MIC OPEN' : 'STANDBY'}
            </span>
            <div className="flex items-center gap-0.5 h-3">
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className={`w-1 bg-[#4ade80] rounded-sm transition-all duration-150 ${
                    callState === 'SPEAKING' || isListening ? 'wave-bar' : 'h-1 opacity-40'
                  }`}
                  style={{ animationDelay: `${i * 0.15}s` }}
                ></span>
              ))}
            </div>
          </div>
        </div>

        {/* Soft Keys & D-Pad Section */}
        <div className="grid grid-cols-3 gap-2 items-center mb-3 px-1">
          {/* Left Soft Key */}
          <button
            onClick={() => handleKeyPress('*')}
            className="h-7 rounded-lg bg-gradient-to-b from-[#374151] to-[#1f2937] text-slate-300 active:translate-y-0.5 text-[11px] font-bold border border-slate-600 shadow flex items-center justify-center hover:bg-slate-700"
          >
            Menu
          </button>

          {/* Directional Pad Center Button */}
          <div className="flex justify-center">
            <button
              onClick={() => handleKeyPress('0')}
              className="w-10 h-10 rounded-full bg-gradient-to-b from-[#374151] to-[#111827] border-2 border-slate-500 shadow-lg text-[10px] text-emerald-400 font-bold active:scale-95 flex items-center justify-center"
              title="OK / Select"
            >
              OK
            </button>
          </div>

          {/* Right Soft Key */}
          <button
            onClick={() => setScreenText('PUNJAB GOVT IVR\n1800-180-1551\nDial 1, 2, 3 or Speak')}
            className="h-7 rounded-lg bg-gradient-to-b from-[#374151] to-[#1f2937] text-slate-300 active:translate-y-0.5 text-[11px] font-bold border border-slate-600 shadow flex items-center justify-center hover:bg-slate-700"
          >
            Clear
          </button>
        </div>

        {/* Action Buttons: Green Call & Red End */}
        <div className="grid grid-cols-2 gap-3 mb-4 px-1">
          <button
            onClick={handleStartCall}
            disabled={callState !== 'IDLE'}
            className={`h-11 rounded-2xl flex items-center justify-center gap-1.5 font-bold text-xs uppercase tracking-wide transition-all duration-150 shadow-md ${
              callState !== 'IDLE'
                ? 'bg-slate-700 text-slate-400 opacity-60 cursor-not-allowed'
                : 'bg-gradient-to-b from-emerald-500 to-emerald-700 text-slate-950 hover:from-emerald-400 hover:to-emerald-600 active:scale-95 border border-emerald-300 shadow-emerald-950/60'
            }`}
          >
            <Phone className="w-4 h-4 fill-slate-950" />
            <span>Call</span>
          </button>

          <button
            onClick={handleEndCall}
            disabled={callState === 'IDLE'}
            className={`h-11 rounded-2xl flex items-center justify-center gap-1.5 font-bold text-xs uppercase tracking-wide transition-all duration-150 shadow-md ${
              callState === 'IDLE'
                ? 'bg-slate-700 text-slate-400 opacity-60 cursor-not-allowed'
                : 'bg-gradient-to-b from-rose-500 to-rose-700 text-white hover:from-rose-400 hover:to-rose-600 active:scale-95 border border-rose-400 shadow-rose-950/60'
            }`}
          >
            <PhoneOff className="w-4 h-4" />
            <span>Hang Up</span>
          </button>
        </div>

        {/* T9 Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 px-1">
          {[
            { num: '1', sub: 'Mandi/Weather', highlight: true },
            { num: '2', sub: 'Govt Schemes', highlight: true },
            { num: '3', sub: 'Hospitals/108', highlight: true },
            { num: '4', sub: 'GHI' },
            { num: '5', sub: 'JKL' },
            { num: '6', sub: 'MNO' },
            { num: '7', sub: 'PQRS' },
            { num: '8', sub: 'TUV' },
            { num: '9', sub: 'WXYZ' },
            { num: '*', sub: 'Tone' },
            { num: '0', sub: 'Operator', highlight: true },
            { num: '#', sub: 'SMS Info' },
          ].map((k) => (
            <button
              key={k.num}
              onClick={() => handleKeyPress(k.num)}
              className="h-11 rounded-xl bg-gradient-to-b from-[#2b3340] to-[#1a202c] hover:from-[#374151] hover:to-[#1f2937] active:from-slate-700 active:to-slate-900 active:scale-95 border border-slate-600/80 shadow text-slate-200 flex flex-col items-center justify-center p-0.5 transition-transform"
            >
              <span className={`text-base font-extrabold font-mono-code leading-none ${
                k.highlight ? 'text-emerald-400' : 'text-slate-100'
              }`}>
                {k.num}
              </span>
              <span className="text-[8px] font-sans text-slate-400 font-medium leading-tight truncate max-w-full px-0.5">
                {k.sub}
              </span>
            </button>
          ))}
        </div>

        {/* Live Mic Voice Button on Phone */}
        <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between px-1">
          <button
            onClick={toggleListening}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all border ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse border-rose-400'
                : 'bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span>{isListening ? 'Listening Punjabi...' : '🎙️ Speak Punjabi (Mic)'}</span>
          </button>
        </div>

      </div>

      {/* Multi-Domain Quick-Test Chips */}
      <div className="w-full mt-4 max-w-md">
        <p className="text-[11px] font-mono-code text-slate-400 uppercase tracking-wider mb-2 text-center">
          ⚡ Multi-Domain One-Click Judge Tests:
        </p>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {testChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (callState === 'IDLE') handleStartCall();
                onQuerySubmit(chip.query);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-emerald-950/70 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 text-[11px] transition-all text-left"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Nokia Post-Call SMS Summary Card Modal */}
      {showSmsCard && lastSmsData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111827] border-2 border-emerald-500/40 rounded-2xl max-w-md w-full p-5 shadow-2xl shadow-emerald-950/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Post-Call SMS Summary
                    <span className="text-[10px] font-mono-code px-1.5 py-0.2 bg-emerald-950 text-emerald-400 rounded border border-emerald-500/30">
                      1800-180-1551
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Sent to Caller ID: 98721-XXXXX</p>
                </div>
              </div>
              <button
                onClick={() => setShowSmsCard(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                ✕ Close
              </button>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 font-gurmukhi text-sm text-emerald-300 leading-relaxed max-h-48 overflow-y-auto">
              <p className="font-semibold text-white mb-1">
                ਸਾਹਾਇਕ AI ਪ੍ਰਮਾਣਿਤ ਜਾਣਕਾਰੀ ({lastSmsData.domain}):
              </p>
              {lastSmsData.punjabi}
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono-code">
              <span className="text-emerald-400">Source: </span>
              {lastSmsData.citation}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Sahaayak AI Punjab Summary:\n${lastSmsData.punjabi}\n\nEnglish: ${lastSmsData.english}\nSource: ${lastSmsData.citation}`
                  );
                  setCopiedSms(true);
                  setTimeout(() => setCopiedSms(false), 2000);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white"
              >
                {copiedSms ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSms ? 'Copied Fact SMS!' : 'Copy SMS Text'}</span>
              </button>

              <button
                onClick={() => setShowSmsCard(false)}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
