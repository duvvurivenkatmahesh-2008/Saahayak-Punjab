import React, { useState, useEffect } from 'react';
import TopCommandBar from './components/TopCommandBar';
import KeypadPhone from './components/KeypadPhone';
import AntiHallucinationShield from './components/AntiHallucinationShield';
import PunjabTelemetryPulse from './components/PunjabTelemetryPulse';
import SmartphoneSuperApp from './components/SmartphoneSuperApp';
import UniversalDataHub from './components/UniversalDataHub';
import SettingsModal from './components/SettingsModal';
import { executeGroundedQuery } from './utils/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('mission_control');
  const [currentResponse, setCurrentResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeDistrict, setActiveDistrict] = useState('Ludhiana');
  const [callerHistory, setCallerHistory] = useState([]);

  // Auto-run a starter query on initial load to show judges immediate grounded state
  useEffect(() => {
    handleQuerySubmit('Khanna mandi vich kanak da rate ki hai?');
  }, []);

  const handleQuerySubmit = async (queryText) => {
    if (!queryText || !queryText.trim()) return;
    setIsLoading(true);
    try {
      const res = await executeGroundedQuery(queryText, 'ivr_keypad', activeDistrict);
      setCurrentResponse(res);
      if (res.caller_history) {
        setCallerHistory(res.caller_history);
      }
    } catch (e) {
      console.error('Query execution error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-[#F8FAFC] flex flex-col font-sans">
      
      {/* Top Command Bar */}
      <TopCommandBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4">

        {/* VIEW 1: MISSION CONTROL (3-COLUMN SPLIT-SCREEN JUDGE DASHBOARD) */}
        {activeTab === 'mission_control' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left Column (4 cols): Keypad Phone IVR Simulator */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <KeypadPhone 
                onQuerySubmit={handleQuerySubmit}
                currentResponse={currentResponse}
                isLoading={isLoading}
              />
            </div>

            {/* Center Column (5 cols): Grounding & Anti-Hallucination Engine */}
            <div className="lg:col-span-5">
              <AntiHallucinationShield 
                response={currentResponse}
                isLoading={isLoading}
              />
            </div>

            {/* Right Column (3 cols): Punjab District Telemetry & Pulse */}
            <div className="lg:col-span-3">
              <PunjabTelemetryPulse 
                activeDistrict={activeDistrict}
                onSelectDistrict={setActiveDistrict}
                callerHistory={callerHistory}
              />
            </div>

          </div>
        )}

        {/* VIEW 2: FULL-SCREEN BASIC KEYPAD PHONE MODE */}
        {activeTab === 'keypad_phone' && (
          <div className="py-4">
            <KeypadPhone 
              onQuerySubmit={handleQuerySubmit}
              currentResponse={currentResponse}
              isLoading={isLoading}
              isFullScreen={true}
            />
          </div>
        )}

        {/* VIEW 3: SMARTPHONE SUPER-APP (VOICE + CAMERA VISION) */}
        {activeTab === 'smartphone_app' && (
          <SmartphoneSuperApp />
        )}

        {/* VIEW 4: UNIVERSAL DATA HUB (PULL ANY TYPE OF DATA) */}
        {activeTab === 'data_hub' && (
          <UniversalDataHub />
        )}

      </main>

      {/* API Keys Drawer Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      {/* Footer Status Bar */}
      <footer className="glass-panel border-t border-slate-800/80 py-2.5 px-4 text-center text-[11px] text-slate-500 font-mono-code flex flex-wrap items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>FastAPI Grounding Daemon: Online on :8000</span>
          <span className="text-slate-600">•</span>
          <span>Rapidfuzz Strict Anti-Hallucination Threshold: 72.0%</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Sahaayak AI Punjab (ਸਹਾਇਕ AI)</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400">Toll-Free 1800-180-1551</span>
        </div>
      </footer>

    </div>
  );
}
