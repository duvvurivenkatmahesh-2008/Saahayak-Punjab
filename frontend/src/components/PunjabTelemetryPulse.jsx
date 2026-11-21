import React, { useState } from 'react';
import { 
  MapPin, 
  Activity, 
  Users, 
  TrendingUp, 
  History, 
  ShieldCheck, 
  PhoneIncoming, 
  Building2, 
  Wheat 
} from 'lucide-react';

export default function PunjabTelemetryPulse({ activeDistrict = 'Ludhiana', onSelectDistrict, callerHistory = [] }) {
  const [selectedDist, setSelectedDist] = useState(activeDistrict);

  // District statistics & facts
  const districts = {
    'Ludhiana': {
      name_pa: 'ਲੁਧਿਆਣਾ',
      calls: 1420,
      mandi: 'Khanna Mandi: Kanak ₹2,425/qtl (Lifting 82%)',
      hospital: 'Civil Hospital Field Ganj (OPD 8AM-2PM)',
      scheme: 'Shagun Scheme: 312 applications verified',
      cx: 190,
      cy: 165
    },
    'Amritsar': {
      name_pa: 'ਅੰਮ੍ਰਿਤਸਰ',
      calls: 1180,
      mandi: 'Bhagtanwala: Basmati 1121 ₹3,850/qtl',
      hospital: 'Jallianwala Bagh Civil Hospital (24x7 Trauma)',
      scheme: 'Old Age Pension: 890 DBT accounts linked',
      cx: 110,
      cy: 90
    },
    'Jalandhar': {
      name_pa: 'ਜਲੰਧਰ',
      calls: 890,
      mandi: 'Maqsudan: Aloo Jyoti ₹1,150/qtl',
      hospital: 'Civil Hospital Shaheed Babu Labh Singh',
      scheme: 'Post-Matric Scholarship: 1,420 Freeship cards',
      cx: 155,
      cy: 125
    },
    'Patiala': {
      name_pa: 'ਪਟਿਆਲਾ',
      calls: 940,
      mandi: 'Patiala Mandi: Kanak ₹2,410/qtl',
      hospital: 'Govt Rajindra Hospital (Super-Specialty ICU)',
      scheme: 'PRTC Women Free Bus Travel active',
      cx: 240,
      cy: 215
    },
    'Bathinda': {
      name_pa: 'ਬਠਿੰਡਾ',
      calls: 1050,
      mandi: 'Cotton Yard: Narma ₹7,180/qtl (Above MSP)',
      hospital: 'Bhai Mani Singh Hospital & Cancer Unit',
      scheme: 'Sarbat Sehat Bima: 540 e-cards issued',
      cx: 120,
      cy: 245
    },
    'Mohali': {
      name_pa: 'ਐਸ.ਏ.ਐਸ. ਨਗਰ (ਮੋਹਾਲੀ)',
      calls: 670,
      mandi: 'Kurali Mandi: Maize ₹2,100/qtl',
      hospital: 'District Hospital Phase 6 (CT & Dialysis)',
      scheme: 'Ghar Ghar Rozgar: 180 youth placed',
      cx: 260,
      cy: 175
    }
  };

  const handleDistClick = (dKey) => {
    setSelectedDist(dKey);
    if (onSelectDistrict) onSelectDistrict(dKey);
  };

  const distInfo = districts[selectedDist] || districts['Ludhiana'];

  // Live multi-sector updates
  const recentUpdates = [
    { time: '12:24', sector: 'MANDI', text: 'Khanna Mandi: 18,400 qtls wheat arrivals. Average rate ₹2,425/qtl.' },
    { time: '12:21', sector: 'WELFARE', text: 'Shagun Scheme: ₹51,000 DBT credited to 42 brides in Ludhiana & Patiala.' },
    { time: '12:18', sector: 'HEALTH', text: 'Civil Hospital Ludhiana: Blood Bank O+ve & B+ve units replenished.' },
    { time: '12:14', sector: 'POWER', text: 'PSPCL 1912: 300 free units subsidy applied to 28,400 new meters.' },
  ];

  return (
    <div className="flex flex-col gap-4">

      {/* Interactive Punjab District Map Card */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono-code">
              Punjab District Pulse & Call Traffic
            </h3>
          </div>
          <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
            6,150 Calls Today
          </span>
        </div>

        {/* SVG stylized map of Punjab */}
        <div className="relative w-full h-[210px] bg-[#0c121e] rounded-xl border border-slate-800/80 p-2 overflow-hidden flex items-center justify-center">
          
          <svg viewBox="0 0 320 280" className="w-full h-full">
            {/* Punjab State Contour Outline (Stylized) */}
            <path
              d="M 60,80 L 110,40 L 180,30 L 220,70 L 280,140 L 270,200 L 210,260 L 140,265 L 80,240 L 50,170 Z"
              fill="#131c2e"
              stroke="#1e293b"
              strokeWidth="2"
            />
            {/* District connection network lines */}
            <line x1="110" y1="90" x2="155" y2="125" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <line x1="155" y1="125" x2="190" y2="165" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <line x1="190" y1="165" x2="240" y2="215" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <line x1="190" y1="165" x2="120" y2="245" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <line x1="190" y1="165" x2="260" y2="175" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

            {/* Clickable District Nodes */}
            {Object.entries(districts).map(([key, d]) => {
              const isSelected = selectedDist === key;
              return (
                <g key={key} onClick={() => handleDistClick(key)} className="cursor-pointer group">
                  {/* Radar pulse rings */}
                  <circle
                    cx={d.cx}
                    cy={d.cy}
                    r={isSelected ? 16 : 9}
                    fill={isSelected ? '#10b981' : '#06b6d4'}
                    opacity={isSelected ? 0.25 : 0.15}
                    className="animate-ping"
                  />
                  {/* Main Node */}
                  <circle
                    cx={d.cx}
                    cy={d.cy}
                    r={isSelected ? 7 : 5}
                    fill={isSelected ? '#10b981' : '#38bdf8'}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 2 : 1}
                  />
                  {/* District Label */}
                  <text
                    x={d.cx}
                    y={d.cy - 10}
                    textAnchor="middle"
                    fill={isSelected ? '#4ade80' : '#cbd5e1'}
                    fontSize={isSelected ? "11" : "9"}
                    fontWeight={isSelected ? "bold" : "normal"}
                    fontFamily="'JetBrains Mono', sans-serif"
                  >
                    {key}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Map Overlay Badge */}
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 backdrop-blur border border-slate-800 text-[10px] font-mono-code text-slate-300">
            Selected: <strong className="text-emerald-400">{selectedDist}</strong> ({distInfo.name_pa})
          </div>
        </div>

        {/* Selected District Telemetry Info */}
        <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
            <span className="font-bold text-white flex items-center gap-1.5 font-gurmukhi">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {selectedDist} ({distInfo.name_pa})
            </span>
            <span className="text-[10px] font-mono-code text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
              {distInfo.calls} Calls Handled
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-300">
            <div className="flex items-start gap-1.5">
              <Wheat className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
              <span className="truncate">{distInfo.mandi}</span>
            </div>
            <div className="flex items-start gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
              <span className="truncate">{distInfo.hospital}</span>
            </div>
            <div className="flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span className="truncate">{distInfo.scheme}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Caller-ID Memory Card */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <History className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono-code">
              Caller Memory (Context Retention)
            </h3>
          </div>
          <span className="text-[10px] font-mono-code text-slate-400">
            Caller ID: 98721-XXXXX
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mb-2 leading-tight">
          When the same citizen calls back, Sahaayak remembers previous queries across different domains:
        </p>

        <div className="space-y-1.5">
          {callerHistory && callerHistory.length > 0 ? (
            callerHistory.map((item, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] flex items-center justify-between">
                <div className="truncate max-w-[200px]">
                  <span className="text-slate-400 font-mono-code text-[10px] mr-1.5">[{item.timestamp}]</span>
                  <span className="text-white font-medium">"{item.query}"</span>
                </div>
                <span className="text-[10px] font-mono-code text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded ml-2">
                  {item.verified ? `${item.confidence}% Match` : 'Blocked'}
                </span>
              </div>
            ))
          ) : (
            <>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] flex items-center justify-between">
                <div className="truncate">
                  <span className="text-slate-400 font-mono-code text-[10px] mr-1.5">[12:15]</span>
                  <span className="text-white">"Khanna mandi kanak rate"</span>
                </div>
                <span className="text-[10px] font-mono-code text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                  94% Agri
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] flex items-center justify-between">
                <div className="truncate">
                  <span className="text-slate-400 font-mono-code text-[10px] mr-1.5">[12:17]</span>
                  <span className="text-white">"Shagun scheme documents"</span>
                </div>
                <span className="text-[10px] font-mono-code text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded">
                  92% Welfare
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Live Verified Facts Multi-Sector Ticker */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800">
        <div className="flex items-center gap-1.5 mb-2">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono-code">
            Live Punjab Multi-Domain Telemetry
          </h3>
        </div>

        <div className="space-y-2">
          {recentUpdates.map((item, idx) => (
            <div key={idx} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] leading-snug">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-slate-800 text-amber-300">
                  {item.sector}
                </span>
                <span className="text-[10px] font-mono-code text-slate-500">{item.time}</span>
              </div>
              <p className="text-slate-300 font-medium">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
