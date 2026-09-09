# 🩺 RuralCare Connect — "Bringing the Doctor to the Doorstep"

**Smart India Hackathon 2026 | Problem Statement: SIH26133**  
**Organization:** Government of Maharashtra  
**Theme:** MedTech / BioTech / HealthTech  

---

## 📌 Executive Summary & Project Objective

Rural and tribal communities across Maharashtra face severe healthcare delivery hurdles: geographic distance to Primary Health Centres (PHCs) and District Hospitals, lack of motorized transport, shortage of doctors, fragmented paper records, and delayed ambulance response.

**RuralCare Connect** is a digital public-health platform designed to bring medical care directly to the doorstep of rural patients. It introduces an on-demand ride-hailing dispatch model for certified doctors, unified longitudinal digital health records (ABHA-compatible), real-time 108 emergency escalation, and a district-level monitoring command center for public health administrators.

> [!NOTE]
> **Prototype Note:** Current version uses simulated/local services for demonstration. Production deployment can integrate government MIS, Firebase, PostgreSQL/PostGIS, and India's existing 108 emergency ambulance infrastructure.

---

## 🌟 Key Features

### 1. 🚖 On-Demand Ride-Hailing Doctor Dispatch
- Multi-step booking flow tailored for rural users:
  - Symptom selection (Fever, Cough, Stomach, Skin, Child health, Women's health, Elderly care)
  - Urgency categorization (Routine, Soon, Urgent, Emergency)
  - Interactive OpenStreetMap GPS village locator
  - Multi-factor matching algorithm: **Haversine Distance + Specialty Match + Doctor Rating + Continuity of Care**
- Real-time animated radar search and automated acceptance simulation.

### 2. 🗺️ Real-Time Doctor Route Tracking
- OpenStreetMap and Leaflet integration with zero paid API keys.
- Live moving doctor marker, polyline path, ETA countdown, and distance decay.
- Direct contact simulations: Call Doctor and In-App SMS messaging.

### 3. 🚨 108 Emergency SOS Pipeline
- Always-available high-contrast SOS trigger across all screens.
- Captures GPS coordinates, matches nearest available 108 ambulance (e.g. `MH-12-RN-4421`), dispatches driver details, and alerts the nearest hospital trauma bay.
- Real-time SMS dispatch simulation to the patient's family emergency contact.
- Statutory disclaimer: *"ETA is the fastest available estimate and depends on ambulance availability and rural road conditions."*

### 4. 📋 Unified Digital Health Record (ABHA Compatible)
- Longitudinal clinical timeline that travels with the patient across Sub-Centers, PHCs, CHCs, and District Hospitals.
- Chronological logs of consultations, vitals, prescriptions, and specialist referrals.

### 5. 💊 Real-Time Medicine Stock Inventory
- Searchable essential drug catalog (Paracetamol 500mg, Amoxicillin, ORS, Metformin, Cetirizine, Amlodipine).
- Live stock indicators (*In Stock*, *Low Stock*, *Out of Stock*) across nearby PHCs with direct call shortcuts.

### 6. 🏛️ District Healthcare Command Center (Govt of Maharashtra)
- Real-time district health KPIs: Total Patients, Active Doctors, Visits Today, Emergency Cases, Average Response Time, Pending Referrals.
- Interactive GIS map showing PHCs, hospitals, active doctors, coverage red zones, and emergency incidents.
- Epidemiological outbreak surveillance heatmap (Viral Pyrexia clusters, Gastroenteritis, Dengue).
- Doctor utilization rate and hourly request volume curves.

### 7. 📶 Offline-First Resilience & Auto-Sync
- Built-in network simulator toggle (Online 🟢 / Offline 🟠).
- Queues visit requests and clinical drafts locally when connectivity drops.
- Automatically synchronizes queued data when the network is restored.

### 8. 🌐 Multilingual & Voice Accessibility
- Dynamic 4-language support:
  - **English**
  - **मराठी (Marathi)**
  - **हिन्दी (Hindi)**
  - **తెలుగు (Telugu)**
- Voice symptom input powered by Web Speech API with prototype simulation fallback.
- Low-tech accessibility page covering SMS request syntax (`CARE FEVER SHIRUR` to 56161), toll-free IVR (1800-RURAL-CARE), and local ASHA worker directory.

### 9. ⚖️ Hackathon Presentation / Judge Demo Mode
- Floating presentation bar with 1-click guided walkthroughs for all SIH evaluation rubrics:
  - `▶ Patient Journey`: Booking -> Matching -> Tracking -> Consultation -> Prescription -> ABHA Record
  - `▶ Doctor Journey`: Incoming Request -> Accept -> Clinical Vitals -> Rx Formulation
  - `▶ Emergency 108 SOS`: Immediate 108 Ambulance escalation & hospital alert
  - `▶ Government Command Center`: District GIS telemetry & epidemiological charts
  - `▶ Offline Mode`: Offline queue and automatic reconnection sync
  - `▶ Multilingual`: Instant language toggle across all labels

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 with TypeScript |
| **Bundler & Dev Server** | Vite 5 |
| **Styling & Design System** | Tailwind CSS with custom public health palette |
| **Icons** | Lucide React |
| **Geospatial Mapping** | Leaflet + OpenStreetMap (Zero paid API keys required) |
| **Data & Persistence** | LocalStorage + Mock REST Service Layer |
| **Speech Recognition** | Web Speech API (`webkitSpeechRecognition`) + Voice Demo Fallback |
| **Export & Print** | Native CSS print stylesheets + Plaintext/PDF file blob generator |

---

## 👥 Demo Accounts (1-Click Login Supported)

| Stakeholder Role | Email | Password | Persona & Focus |
|---|---|---|---|
| **Patient** | `patient@ruralcare.demo` | `patient123` | Ramesh Patil (Karegaon, Shirur) — Book visits, records, SOS |
| **Doctor** | `doctor@ruralcare.demo` | `doctor123` | Dr. Priya Sharma (MBBS, MD) — Accept requests, vitals, Rx |
| **Govt Admin** | `admin@ruralcare.demo` | `admin123` | District Health Officer (Pune) — GIS map, outbreak surveillance |

*Note: You can switch roles at any time using the role pill in the top navigation bar or the Judge Demo Bar.*

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+ or v10+)

### Setup & Launch
```bash
# 1. Clone or navigate to the project directory
cd C:\Users\akshu\.gemini\antigravity\scratch\ruralcare-connect

# 2. Install dependencies (if not already installed)
npm install

# 3. Start local development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:5173
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```
ruralcare-connect/
├── public/
├── src/
│   ├── assets/              # Icons, banners, graphics
│   ├── components/
│   │   ├── admin/           # Government District Healthcare Command Center
│   │   │   └── GovernmentDashboard.tsx
│   │   ├── auth/            # Role Selection & 1-Click Demo Login Modal
│   │   │   └── RoleSelectModal.tsx
│   │   ├── common/          # Reusable LeafletMap, Navbar, Footer, LanguageSelector
│   │   │   ├── Footer.tsx
│   │   │   ├── LanguageSelector.tsx
│   │   │   ├── LeafletMap.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── NotificationBell.tsx
│   │   │   └── OfflineBanner.tsx
│   │   ├── doctor/          # Doctor console, MMC verification, consultation workflow
│   │   │   ├── DoctorDashboard.tsx
│   │   │   ├── DoctorProfileModal.tsx
│   │   │   ├── DoctorVerificationModal.tsx
│   │   │   └── VisitWorkflowModal.tsx
│   │   ├── emergency/       # 108 Emergency SOS modal & telemetry
│   │   │   └── EmergencySosModal.tsx
│   │   ├── judge/           # SIH Hackathon presentation bar
│   │   │   └── JudgeDemoBar.tsx
│   │   ├── landing/         # Problem statement landing page & features
│   │   │   └── LandingPage.tsx
│   │   └── patient/         # Booking wizard, radar matching, live tracking, EHR
│   │       ├── BookDoctorModal.tsx
│   │       ├── DoctorMatchingModal.tsx
│   │       ├── LiveTrackingView.tsx
│   │       ├── MedicalRecordsView.tsx
│   │       ├── MedicineFinderView.tsx
│   │       ├── PatientDashboard.tsx
│   │       ├── PatientProfileModal.tsx
│   │       ├── PrescriptionModal.tsx
│   │       ├── SmsIvrFallbackView.tsx
│   │       └── VoiceInputModal.tsx
│   ├── context/             # React State Providers
│   │   ├── AuthContext.tsx
│   │   ├── LanguageContext.tsx
│   │   ├── NetworkContext.tsx
│   │   └── NotificationContext.tsx
│   ├── data/                # Realistic Maharashtra datasets & multi-language dictionaries
│   │   ├── mockData.ts
│   │   └── translations.ts
│   ├── services/            # Domain Business Logic & REST interfaces
│   │   ├── analyticsService.ts
│   │   ├── emergencyService.ts
│   │   ├── liveTrackingService.ts
│   │   ├── matchingService.ts
│   │   ├── medicalRecordService.ts
│   │   ├── medicineService.ts
│   │   ├── offlineSyncService.ts
│   │   ├── prescriptionService.ts
│   │   └── referralService.ts
│   ├── types/               # Strict TypeScript definitions
│   │   └── index.ts
│   ├── App.tsx              # Main entry orchestration
│   ├── index.css            # Tailwind & print media styles
│   └── main.tsx             # React DOM root
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🔮 Future Production Integration Roadmap

1. **Backend Migration**: Modular mock services can be directly swapped with a Django/FastAPI or Node.js/NestJS REST layer.
2. **PostgreSQL & PostGIS**: Replace the in-memory Haversine distance calculations with spatial indexing (`ST_DWithin`, `ST_Distance`) for sub-millisecond doctor and ambulance geocaching.
3. **Realtime WebSocket / MQTT**: Integrate with MQTT / Firebase for two-way telemetry exchange between mobile doctor devices and hospital dispatchers.
4. **National Health Mission Integration**: Plug directly into India's ABDM (Ayushman Bharat Digital Mission) gateway via NDHM M1/M2/M3 API bridges for real ABHA health ID verification and electronic health record federated exchange.
5. **Telecom Gateway Integration**: Connect the mock SMS/IVR system to Bharat Sanchar Nigam Limited (BSNL) or state telecom USSD gateways to support feature-phone users without data connections.

---

**Built with pride for Smart India Hackathon 2026.**  
*Government of Maharashtra • Directorate of Health Services*
