// API Client for Sahaayak AI Punjab FastAPI Backend

export const getApiKeys = () => {
  return {
    sarvamKey: localStorage.getItem('sahaayak_sarvam_key') || '',
    geminiKey: localStorage.getItem('sahaayak_gemini_key') || '',
  };
};

export const setApiKeys = (sarvamKey, geminiKey) => {
  localStorage.setItem('sahaayak_sarvam_key', sarvamKey.trim());
  localStorage.setItem('sahaayak_gemini_key', geminiKey.trim());
};

export async function executeGroundedQuery(query, channel = 'ivr_keypad', district = 'Ludhiana') {
  const { sarvamKey } = getApiKeys();
  const headers = {
    'Content-Type': 'application/json',
  };
  if (sarvamKey) {
    headers['X-Sarvam-Key'] = sarvamKey;
  }

  const response = await fetch('/api/query', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      channel,
      district,
      caller_id: '98721-XXXXX'
    })
  });

  if (!response.ok) {
    throw new Error(`Query failed: ${response.statusText}`);
  }

  return await response.json();
}

export async function fetchActiveSources() {
  const response = await fetch('/api/sources');
  if (!response.ok) {
    throw new Error(`Failed to fetch sources: ${response.statusText}`);
  }
  return await response.json();
}

export async function ingestUrlData(url, domainLabel = 'Live Web Pull') {
  const response = await fetch('/api/ingest-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, domain_label: domainLabel })
  });
  if (!response.ok) {
    throw new Error(`Ingest URL failed: ${response.statusText}`);
  }
  return await response.json();
}

export async function ingestTextData(title, text, domainLabel = 'Custom Knowledge Drop') {
  const response = await fetch('/api/ingest-text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, text, domain_label: domainLabel })
  });
  if (!response.ok) {
    throw new Error(`Ingest text failed: ${response.statusText}`);
  }
  return await response.json();
}

export async function resetSources() {
  const response = await fetch('/api/reset-sources', { method: 'POST' });
  return await response.json();
}

export async function analyzeVision(imageBase64, prompt = '', presetType = null) {
  const { geminiKey } = getApiKeys();
  const headers = {
    'Content-Type': 'application/json',
  };
  if (geminiKey) {
    headers['X-Gemini-Key'] = geminiKey;
  }

  const response = await fetch('/api/vision', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      image_base64: imageBase64,
      prompt,
      preset_type: presetType
    })
  });

  if (!response.ok) {
    throw new Error(`Vision analysis failed: ${response.statusText}`);
  }

  return await response.json();
}

export async function synthesizeVoice(text, speaker = 'amrit') {
  const { sarvamKey } = getApiKeys();
  const headers = { 'Content-Type': 'application/json' };
  if (sarvamKey) {
    headers['X-Sarvam-Key'] = sarvamKey;
  }

  const response = await fetch('/api/voice', {
    method: 'POST',
    headers,
    body: JSON.stringify({ text, speaker })
  });

  return await response.json();
}
