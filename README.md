# Sahaayak AI Punjab (ਸਹਾਇਕ AI)
### Universal, Multi-Domain Punjabi Voice & Vision Grounding Engine
**Zero Hallucination Civic & Farm AI for Feature Phones (1800-180-1551) & Smartphone Super-App**

---

## 🌟 Executive Overview
**Sahaayak AI Punjab (ਸਹਾਇਕ AI)** is a production-grade, multi-domain Punjabi conversational and multimodal vision AI engine designed to solve the digital divide across Punjab's 30+ million citizens and farmers.

It operates on an **"Anti-Hallucination Universal Engine + Two Doors"** architecture:
1. **Door 1 — Basic Keypad Feature Phone (IVR `1800-180-1551`):** A tactile Nokia-style simulator allowing anyone with a ₹999 basic phone (or no internet) to speak in Punjabi, dial DTMF numbers (`1` = Mandi, `2` = Schemes, `3` = Health), hear grounded spoken answers, and receive verified SMS receipts.
2. **Door 2 — Smartphone Super-App:** A voice-first, low-literacy friendly mobile app with a pulsing Gurmukhi mic button, dynamic comparison cards, and a **Universal Camera Vision Scanner** (powered by Gemini 2.5 Flash / grounded PAU diagnostics) for crop disease, medicine strips, government notices, and soil health cards.
3. **Universal Data Hub:** A real-time data ingestion portal proving that the engine can pull **ANY** data: live URLs, REST APIs, JSON feeds, or raw document circulars, indexing them into the `rapidfuzz` vector within milliseconds.

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
