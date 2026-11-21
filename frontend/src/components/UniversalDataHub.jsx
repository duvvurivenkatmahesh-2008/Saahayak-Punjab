import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Globe, 
  FileUp, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Sparkles, 
  Layers, 
  ArrowRight,
  ExternalLink,
  Volume2
} from 'lucide-react';
import { ingestUrlData, ingestTextData, fetchActiveSources, resetSources, executeGroundedQuery } from '../utils/api';
import { speakPunjabiText } from '../utils/audio';

export default function UniversalDataHub() {
  const [activeTab, setActiveTab] = useState('url_pull'); // 'url_pull', 'doc_drop', 'inspector'
  const [sourcesData, setSourcesData] = useState(null);
  const [isLoadingSources, setIsLoadingSources] = useState(false);

  // URL Puller state
  const [urlInput, setUrlInput] = useState('');
  const [urlDomainLabel, setUrlDomainLabel] = useState('Punjab State Live Feed');
  const [isIngestingUrl, setIsIngestingUrl] = useState(false);
  const [urlIngestResult, setUrlIngestResult] = useState(null);

  // Doc Dropzone state
  const [docTitle, setDocTitle] = useState('');
  const [docText, setDocText] = useState('');
  const [docDomainLabel, setDocDomainLabel] = useState('Custom Policy Circular');
  const [isIngestingText, setIsIngestingText] = useState(false);
  const [textIngestResult, setTextIngestResult] = useState(null);

  // Live Inspector Stage Test
  const [testQuery, setTestQuery] = useState('');
  const [isTestingQuery, setIsTestingQuery] = useState(false);
  const [testQueryResult, setTestQueryResult] = useState(null);

  // Load sources
  const loadSources = async () => {
    setIsLoadingSources(true);
    try {
      const data = await fetchActiveSources();
      setSourcesData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingSources(false);
    }
  };

  useEffect(() => {
    loadSources();
  }, []);

  // Handle URL Ingest
  const handleIngestUrl = async () => {
    if (!urlInput.trim()) return;
    setIsIngestingUrl(true);
    setUrlIngestResult(null);
    try {
      const res = await ingestUrlData(urlInput, urlDomainLabel);
      setUrlIngestResult(res);
      loadSources();
    } catch (e) {
      setUrlIngestResult({ status: 'error', error: e.message });
    } finally {
      setIsIngestingUrl(false);
    }
  };

  // Handle Text Ingest
  const handleIngestText = async () => {
    if (!docTitle.trim() || !docText.trim()) return;
    setIsIngestingText(true);
    setTextIngestResult(null);
    try {
      const res = await ingestTextData(docTitle, docText, docDomainLabel);
      setTextIngestResult(res);
      loadSources();
    } catch (e) {
      setTextIngestResult({ status: 'error', error: e.message });
    } finally {
      setIsIngestingText(false);
    }
  };

  // Handle Test Query
  const handleTestQuery = async () => {
    if (!testQuery.trim()) return;
    setIsTestingQuery(true);
    setTestQueryResult(null);
    try {
      const res = await executeGroundedQuery(testQuery);
      setTestQueryResult(res);
      if (res.punjabi_text) {
        speakPunjabiText(res.punjabi_text);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTestingQuery(false);
    }
  };

  // Preset URLs for one-click testing
  const urlPresets = [
    {
      title: 'Agmarknet Punjab Daily Mandi Bulletin',
      url: 'https://enam.gov.in/web/dashboard/trade-data',
      domain: 'Agri & Mandi Board Live'
    },
    {
      title: 'Punjab Social Security Welfare Schemes',
      url: 'https://punjab.gov.in/schemes',
      domain: 'Govt Citizen Welfare'
    },
    {
      title: 'IMD Chandigarh Agro-Weather Advisory',
      url: 'https://mausam.imd.gov.in/chandigarh/',
      domain: 'Weather & Climate'
    },
    {
      title: 'Punjab Health Systems Civil Hospitals',
      url: 'https://nhm.punjab.gov.in',
      domain: 'Healthcare Directory'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-[#111827] to-[#0c1626]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                <Database className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Universal Data Hub — <span className="text-emerald-400">"Pull ANY Type of Data"</span>
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Sahaayak AI is not hardcoded to a fixed list. Connect any live webpage URL, REST JSON feed, CSV, or custom policy circular. The backend indexes it in milliseconds and makes it immediately queryable over both <strong>Basic Keypad Phone IVR (1800-180-1551)</strong> and the <strong>Smartphone Super-App</strong>!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadSources}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono-code flex items-center gap-1.5 border border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSources ? 'animate-spin' : ''}`} />
              <span>Sync Stats</span>
            </button>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono-code text-xs">
              <strong>{sourcesData?.total_records || 15}</strong> Active Grounded Records
            </div>
          </div>
        </div>
      </div>

      {/* 3-Tab Sub-Navigator */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'url_pull', label: '1. Live URL / Web & API Puller', icon: Globe },
          { id: 'doc_drop', label: '2. Instant Document / Policy Dropzone', icon: FileUp },
          { id: 'inspector', label: '3. Live Knowledge Inspector & Test Bench', icon: Search },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-950 border border-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Live URL / Web Scraper */}
      {activeTab === 'url_pull' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              Ingest Real-Time Web Pages & JSON Feeds
            </h3>
            <p className="text-xs text-slate-400">
              Paste any live Punjab or national portal link. Our engine fetches, parses with BeautifulSoup, extracts key entities, and updates the Rapidfuzz search index.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono-code text-slate-300 block mb-1">
                  Public URL or JSON Endpoint:
                </label>
                <input
                  type="url"
                  placeholder="https://punjab.gov.in/latest-notification..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono-code focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono-code text-slate-300 block mb-1">
                  Domain Category Tag:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Punjab Agri Advisory, Mandi Board Live, Health Bulletin"
                  value={urlDomainLabel}
                  onChange={(e) => setUrlDomainLabel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={handleIngestUrl}
                disabled={isIngestingUrl || !urlInput.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 disabled:opacity-50"
              >
                {isIngestingUrl ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{isIngestingUrl ? 'Fetching & Parsing Live URL...' : 'Fetch, Parse & Index Live Feed'}</span>
              </button>
            </div>

            {/* Ingest Result Output */}
            {urlIngestResult && (
              <div className={`p-4 rounded-xl border text-xs ${
                urlIngestResult.status === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              }`}>
                {urlIngestResult.status === 'success' ? (
                  <div>
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Live Ingestion Succeeded! Queryable Now.</span>
                    </div>
                    <p className="font-mono-code text-[11px] text-slate-300">
                      <strong>Title:</strong> {urlIngestResult.title}
                    </p>
                    <p className="font-mono-code text-[11px] text-slate-400 mt-1">
                      {urlIngestResult.preview}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>Failed to fetch: {urlIngestResult.error}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Preset Samples */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono-code">
              Demo Sample Presets:
            </h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Click any verified Punjab link to auto-fill and test live ingestion right on stage:
            </p>

            <div className="space-y-2">
              {urlPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setUrlInput(preset.url);
                    setUrlDomainLabel(preset.domain);
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/30 text-left transition-all"
                >
                  <div className="text-xs font-semibold text-white">{preset.title}</div>
                  <div className="text-[10px] text-emerald-400 font-mono-code truncate">{preset.url}</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">[{preset.domain}]</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Document / Policy Dropzone */}
      {activeTab === 'doc_drop' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 max-w-3xl mx-auto space-y-4">
          <div className="flex items-center gap-2">
            <FileUp className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Instant Policy, Circular or CSV Text Dropzone
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Paste any new Punjab Government cabinet decision, agricultural subsidy order, or local mandi notification. It will be indexed into the knowledge vector in real-time.
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-mono-code text-slate-300 block mb-1">
                Document / Circular Title:
              </label>
              <input
                type="text"
                placeholder="e.g. Punjab Solar Tubewell Subsidy Circular 2026"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono-code text-slate-300 block mb-1">
                Policy Text or Extracted PDF Content:
              </label>
              <textarea
                rows={6}
                placeholder="Paste the full scheme guidelines, subsidy percentages, eligible districts, helpline numbers, or price rates..."
                value={docText}
                onChange={(e) => setDocText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs leading-relaxed focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={handleIngestText}
              disabled={isIngestingText || !docTitle.trim() || !docText.trim()}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isIngestingText ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{isIngestingText ? 'Indexing Document...' : 'Index Document & Make Spoken Voice Ready'}</span>
            </button>
          </div>

          {textIngestResult && (
            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Document successfully indexed! Ready for voice query tests.</span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono-code">
                {textIngestResult.preview}
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Live Knowledge Inspector & Test Bench */}
      {activeTab === 'inspector' && (
        <div className="space-y-6">
          
          {/* Active Knowledge Sources Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sourcesData?.static_domains?.map((d) => (
              <div key={d.id} className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-code px-2 py-0.5 rounded font-bold" style={{ backgroundColor: `${d.color}20`, color: d.color }}>
                    [{d.badge}]
                  </span>
                  <span className="text-xs font-mono-code font-bold text-white">
                    {d.record_count} Records
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{d.name}</h4>
                <div className="font-gurmukhi text-xs text-slate-300">{d.name_pa}</div>
                <div className="text-[10px] text-slate-400 font-mono-code truncate">
                  {d.source_authority}
                </div>
              </div>
            ))}
          </div>

          {/* Test Bench */}
          <div className="glass-panel rounded-2xl p-6 border border-emerald-500/30 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400" />
              Live Stage Test Bench: Query Any Grounded Knowledge
            </h3>
            <p className="text-xs text-slate-400">
              Type or paste any query in Punjabi (Gurmukhi or Roman) or English to verify Rapidfuzz matching against all active sources.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask e.g. 'Khanna mandi kanak', 'Shagun scheme 51000', 'Ludhiana civil hospital'..."
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTestQuery()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleTestQuery}
                disabled={isTestingQuery || !testQuery.trim()}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs uppercase"
              >
                {isTestingQuery ? 'Matching...' : 'Test Query'}
              </button>
            </div>

            {testQueryResult && (
              <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                testQueryResult.verified ? 'bg-slate-950 border-emerald-500/40' : 'bg-slate-950 border-amber-500/40'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded ${
                    testQueryResult.verified ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                  }`}>
                    [{testQueryResult.domain_badge}] • {testQueryResult.confidence_score}% Confidence
                  </span>
                  <button
                    onClick={() => speakPunjabiText(testQueryResult.punjabi_text)}
                    className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono-code"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Hear Punjabi Audio</span>
                  </button>
                </div>

                <div className="font-gurmukhi text-sm text-emerald-300 leading-relaxed">
                  {testQueryResult.punjabi_text}
                </div>

                <div className="text-[11px] text-slate-400 font-mono-code pt-1 border-t border-slate-800">
                  Authority: {testQueryResult.source_citation}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
