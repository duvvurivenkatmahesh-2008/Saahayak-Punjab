# 🌾 Sahaayak AI Punjab (ਸਹਾਇਕ AI)
### Universal Multi-Domain Punjabi Voice & Vision AI for Basic Keypad Phones & Smartphones

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20App-10B981?style=for-the-badge)](https://your-live-deployment-link.vercel.app)
[![Backend API](https://img.shields.io/badge/FastAPI-Grounded%20Engine-06B6D4?style=for-the-badge)](https://your-backend-link.onrender.com/docs)
[![License: MIT](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)

> **One Grounded AI Brain. Two Accessible Doors.**  
> Bridging India's rural digital divide by delivering verified, real-time agricultural, healthcare, welfare, education, and civic intelligence in **Punjabi (ਪੰਜਾਬੀ)**—to both a **₹1,000 basic keypad phone (via Toll-Free IVR)** and a **modern smartphone (via Voice + Camera Vision)**.

---

## 🚨 The Problem
1. **The Hardware & Literacy Divide:** Over 40% of rural citizens still rely on basic keypad feature phones with zero internet access, locking them out of modern mobile apps and portals.
2. **The AI Hallucination Risk:** Standard LLMs frequently invent crop mandi prices, medical helpline numbers, and government scheme eligibility rules—errors that directly cost rural families money and critical time.
3. **Siloed Single-Purpose Tools:** Existing helplines are fragmented across agriculture, healthcare, scholarships, and utility services.

---

## 💡 Our Solution: "One Brain, Two Doors"

**Sahaayak AI Punjab** connects a **Universal Anti-Hallucination Grounding Engine** to two inclusive interfaces:

* **📞 Door 1 — Toll-Free Voice IVR (`1800-180-1551`) for Basic Keypad Phones:**
  * No smartphone, no internet, and no reading required.
  * Supports natural Punjabi voice queries, **DTMF keypad fallbacks** (`Press 1 for Mandis`, `2 for Govt Schemes`, `3 for Health`), **Caller-ID Memory**, and automatic **post-call SMS summaries**.
* **📱 Door 2 — Multimodal Citizen Super-App for Smartphones:**
  * Voice-first Punjabi interface paired with rich visual cards, **Smart Mandi Arbitrage comparisons** (highlighting nearby mandis paying higher rates), **Offline Field Caching**, and a **Camera Vision Scanner** for diagnosing crop leaf diseases, reading medicine strips, or translating government notices aloud in Punjabi.
* **🔌 Universal Data Hub (Dynamic Ingestion):**
  * Not hardcoded to one domain—administrators can plug in **any live URL, JSON API, CSV, or policy document** in real time, making new data immediately queryable via voice across both channels.

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER ACCESS CHANNELS                            │
├───────────────────────────────────┬─────────────────────────────────────┤
│   📞 Basic Keypad Feature Phone   │      📱 Smartphone Super-App        │
│  • Toll-Free Voice Call (IVR)     │  • 1-Tap Punjabi Voice Assistant    │
│  • DTMF Keypad Fallback (0-9)     │  • Camera Leaf / Document Scanner   │
│  • Post-Call SMS Summary          │  • Offline-First Visual Cards       │
└─────────────────┬─────────────────┴──────────────────┬──────────────────┘
                  │                                    │
                  ▼                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                UNIFIED FASTAPI ORCHESTRATOR (/backend)                  │
│  1. Punjabi Speech Layer   ──► Sarvam AI (Saaras STT & Bulbul TTS)      │
│  2. Multimodal Vision      ──► Gemini 2.5 Flash (Leaf & Doc Analysis)   │
│  3. Grounding & Guardrails ──► RapidFuzz Entity Matching + Confidence   │
│                                Gating (Blocks <72% Unverified Queries)  │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   UNIVERSAL KNOWLEDGE & DATA HUB                        │
│  • Agmarknet Mandis & MSP    • Punjab Govt Welfare & Pension Schemes    │
│  • District Hospitals & 108  • Scholarships, Jobs & Transport Helplines │
│  • Live URL / API / CSV / Custom Knowledge Connectors                   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🛡️ Anti-Hallucination Grounding Engine
- **Rapidfuzz Token-Set & Partial Ratio Matching:** Strict **72.0% confidence threshold**.
- **Zero Hallucination Filter:** Queries about topics not verified in authorized Punjab state databases (e.g., *"Mars te zameen da rate ki hai?"*) are strictly blocked and flagged with an amber guardrail shield.
- **Official Source Authorities:**
  - **Agriculture & Mandis:** Punjab Mandi Board & Agmarknet Daily Bulletin
  - **Social Welfare:** Department of Social Security, Women & Child Development
  - **Healthcare:** Punjab Health Systems Corporation (PHSC) & 108/104 Helplines
  - **Education:** Punjab Scholarship Cell & Dr. Ambedkar Portal
  - **Utilities & Power:** PSPCL 1912 & PRTC Bus Directory

---

## 🚀 Quick Startup Guide

### 1. Start the FastAPI Grounding Backend
```powershell
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be live at: `http://localhost:8000/docs`

### 2. Start the Vite React Frontend
```powershell
cd frontend
npm install
npm run dev
```
Open your browser at: `http://localhost:5173`

---

## 🔑 Optional API Keys
Sahaayak AI is designed with **100% operational fallbacks** right out of the box with zero configuration:
- Built-in Web Speech API Punjabi speech synthesis + PAU diagnostic vision engine.
- To connect real enterprise keys, click the **Settings (Gear Icon)** on the top bar:
  - `SARVAM_API_KEY`: Connects Sarvam AI `bulbul:v1` Punjabi TTS & `saaras:v4` STT.
  - `GEMINI_API_KEY`: Connects Google Gemini 2.5 Flash for live multimodal image scans.

---

## 📁 Repository Structure
```
sahaayak-ai-punjab/
├── backend/
│   ├── data/
│   │   └── universal_knowledge.json   # Verified multi-domain Punjab dataset
│   ├── grounding_engine.py            # Rapidfuzz matcher with 72% confidence cutoff
│   ├── main.py                        # FastAPI routes for query, ingestion, voice, vision
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TopCommandBar.jsx          # Mission Control navigation & API keys
│   │   │   ├── KeypadPhone.jsx            # Nokia 3310 feature phone IVR simulator
│   │   │   ├── AntiHallucinationShield.jsx# Green/Amber verification shield & telemetry
│   │   │   ├── PunjabTelemetryPulse.jsx   # Interactive district map & caller memory
│   │   │   ├── SmartphoneSuperApp.jsx     # Mobile app + Gemini 2.5 Flash Vision
│   │   │   ├── UniversalDataHub.jsx       # Live URL/CSV puller & stage test bench
│   │   │   └── SettingsModal.jsx          # API keys drawer
│   │   ├── utils/
│   │   │   ├── audio.js                   # Web Audio DTMF & Punjabi speech synthesis
│   │   │   └── api.js                     # FastAPI client
│   │   ├── App.jsx
│   │   └── index.css                      # Tailwind v4 + glassmorphism + LCD styling
│   └── vite.config.js
└── README.md
```
