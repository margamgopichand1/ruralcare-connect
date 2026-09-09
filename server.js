// server.js - RuralCare Connect Backend Server
// Built for Node.js (runnable via agy-node)

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// MIME types for static files
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg'
};

// Seed Data
const initialDoctors = [
  {
    id: 'doc-1',
    name: 'Dr. Priya Sharma',
    degree: 'MBBS, DNB (Family Medicine)',
    roleTitle: 'Rural Medical Officer',
    organization: 'Rampur Primary Health Centre (PHC)',
    phone: '+91 98765 11001',
    rating: 4.9,
    reviewsCount: 184,
    vehicle: 'Hero Splendor (Bike)',
    vehicleNumber: 'UP-65-BX-4412',
    avatar: '👩‍⚕️',
    coords: { lat: 25.3200, lng: 82.9750 },
    village: 'Rampur PHC',
    verified: true,
    licenseNumber: 'MCI-UP-2018-8834',
    verificationDate: '2023-04-15',
    online: true,
    completedVisits: 142,
    languages: ['Hindi', 'Bhojpuri', 'English'],
    emergencyResponder: true
  },
  {
    id: 'doc-2',
    name: 'Dr. Rajesh Verma',
    degree: 'BAMS (Ayurvedic & Community Medicine)',
    roleTitle: 'Community Health Officer (CHO)',
    organization: 'Devgarh Health & Wellness Centre',
    phone: '+91 98765 22002',
    rating: 4.8,
    reviewsCount: 112,
    vehicle: 'Bajaj Pulsar 150',
    vehicleNumber: 'UP-65-AK-9018',
    avatar: '👨‍⚕️',
    coords: { lat: 25.3450, lng: 82.9900 },
    village: 'Devgarh',
    verified: true,
    licenseNumber: 'BAMS-UP-2019-4102',
    verificationDate: '2023-06-20',
    online: true,
    completedVisits: 98,
    languages: ['Hindi', 'Bhojpuri'],
    emergencyResponder: false
  },
  {
    id: 'doc-3',
    name: 'Sunita Devi',
    degree: 'Senior ASHA Worker / Certified ANM',
    roleTitle: 'Village Health Worker & Vaccinator',
    organization: 'Shivpur Sub-Centre',
    phone: '+91 98765 33003',
    rating: 4.95,
    reviewsCount: 310,
    vehicle: 'TVS Scooty Pep',
    vehicleNumber: 'UP-65-ME-2187',
    avatar: '🥻',
    coords: { lat: 25.3100, lng: 82.9550 },
    village: 'Shivpur',
    verified: true,
    licenseNumber: 'ASHA-GOI-2016-1044',
    verificationDate: '2022-11-10',
    online: true,
    completedVisits: 310,
    languages: ['Hindi', 'Bhojpuri'],
    emergencyResponder: true
  },
  {
    id: 'doc-4',
    name: 'Dr. Anand Kulkarni',
    degree: 'MD (General Medicine)',
    roleTitle: 'Visiting Specialist Consultant',
    organization: 'Balarampur Taluka Hospital',
    phone: '+91 98765 44004',
    rating: 4.7,
    reviewsCount: 94,
    vehicle: 'Maruti Omni Mobile Medical Van',
    vehicleNumber: 'UP-65-CL-6621',
    avatar: '👨‍⚕️',
    coords: { lat: 25.2900, lng: 82.9950 },
    village: 'Balarampur',
    verified: true,
    licenseNumber: 'MCI-UP-2014-2291',
    verificationDate: '2021-08-12',
    online: false,
    completedVisits: 220,
    languages: ['Hindi', 'Marathi', 'English'],
    emergencyResponder: true
  },
  {
    id: 'doc-5',
    name: 'Dr. Fatima Khan',
    degree: 'MBBS, DGO (Obstetrics & Gynecology)',
    roleTitle: 'Maternal & Child Health Specialist',
    organization: 'Kishanpur Community Health Centre',
    phone: '+91 98765 55005',
    rating: 4.9,
    reviewsCount: 165,
    vehicle: 'Honda Activa 6G',
    vehicleNumber: 'UP-65-TR-3390',
    avatar: '👩‍⚕️',
    coords: { lat: 25.3600, lng: 82.9400 },
    village: 'Kishanpur',
    verified: false,
    licenseNumber: 'MCI-UP-2021-9981',
    verificationDate: null,
    online: true,
    completedVisits: 85,
    languages: ['Hindi', 'Urdu', 'English'],
    emergencyResponder: true
  }
];

const initialPatients = [
  {
    id: 'pat-1',
    name: 'Ramesh Kumar',
    age: 48,
    gender: 'Male',
    village: 'Rampur (Ward 3 - Near Canal)',
    abhaId: '91-4523-8871-9012',
    phone: '+91 98391 22345',
    bloodGroup: 'B+',
    chronicConditions: ['Type 2 Diabetes', 'Mild Hypertension'],
    allergies: ['Penicillin (Moderate rash)'],
    coords: { lat: 25.3280, lng: 82.9810 },
    avatar: '👨‍🌾',
    highRisk: false,
    history: [
      {
        id: 'hist-1',
        date: '2026-08-28',
        doctorName: 'Dr. Priya Sharma',
        diagnosis: 'Seasonal Viral Pyrexia & Fatigue',
        symptoms: 'Fever 101°F, Body ache, Mild throat congestion',
        prescriptions: [
          { medicine: 'Paracetamol 500mg', dosage: '1 tablet 3 times a day (after food)', timing: '1-1-1', days: '3 days', icon: 'tablet' },
          { medicine: 'Vitamin C & Zinc chewable', dosage: '1 tablet daily', timing: '1-0-0', days: '5 days', icon: 'pill' },
          { medicine: 'Oral Rehydration Salts (ORS)', dosage: 'Mix 1 sachet in 1L clean water, sip throughout day', timing: 'Continuous', days: '2 days', icon: 'drop' }
        ],
        followUp: 'If fever persists after 72 hrs, visit Rampur PHC for Malaria/Dengue card test.',
        status: 'Recovered'
      },
      {
        id: 'hist-2',
        date: '2026-06-14',
        doctorName: 'Dr. Priya Sharma',
        diagnosis: 'Routine Diabetic Blood Sugar Review',
        symptoms: 'Fasting Sugar 142 mg/dL, Polyuria',
        prescriptions: [
          { medicine: 'Metformin 500mg', dosage: '1 tablet with morning meal', timing: '1-0-0', days: '30 days', icon: 'tablet' }
        ],
        followUp: 'Reduce jaggery/rice intake. Recheck HbA1c in 3 months.',
        status: 'Under Management'
      }
    ]
  },
  {
    id: 'pat-2',
    name: 'Lakshmi Bai',
    age: 26,
    gender: 'Female',
    village: 'Devgarh Village (Near Old Banyan Tree)',
    abhaId: '91-7712-3409-1144',
    phone: '+91 94502 88719',
    bloodGroup: 'O+',
    chronicConditions: ['Antenatal Care - 24 Weeks Gestation (2nd Trimester)'],
    allergies: ['None known'],
    coords: { lat: 25.3410, lng: 82.9860 },
    avatar: '👩',
    highRisk: true,
    highRiskNote: 'Moderate Anemia (Hb 9.2 g/dL) - Regular ANM follow-up mandatory',
    history: [
      {
        id: 'hist-3',
        date: '2026-08-10',
        doctorName: 'Sunita Devi (ASHA/ANM)',
        diagnosis: 'Routine 2nd Trimester ANC Checkup',
        symptoms: 'BP 110/70, Fetal Heart Sounds normal (144 bpm), Hb 9.2 g/dL',
        prescriptions: [
          { medicine: 'Iron & Folic Acid (IFA) Red Tablets', dosage: '1 tablet daily at night after dinner with lemon water', timing: '0-0-1', days: '60 days', icon: 'pill' },
          { medicine: 'Calcium + Vitamin D3', dosage: '1 tablet morning after breakfast (do not take with iron)', timing: '1-0-0', days: '60 days', icon: 'tablet' }
        ],
        followUp: 'Next ANC visit on 10th September. Check BP and weight.',
        status: 'Active Follow-up'
      }
    ]
  },
  {
    id: 'pat-3',
    name: 'Mohan Singh',
    age: 62,
    gender: 'Male',
    village: 'Shivpur Purva (House #14)',
    abhaId: '91-2290-8841-6532',
    phone: '+91 87654 33120',
    bloodGroup: 'A+',
    chronicConditions: ['Chronic Bronchial Asthma', 'Joint Arthralgia'],
    allergies: ['Sulfa drugs'],
    coords: { lat: 25.3080, lng: 82.9590 },
    avatar: '👴',
    highRisk: true,
    highRiskNote: 'Acute Respiratory Exacerbation Risk during monsoon changes',
    history: [
      {
        id: 'hist-4',
        date: '2026-07-22',
        doctorName: 'Dr. Anand Kulkarni',
        diagnosis: 'Chronic Bronchitis Acute Flare',
        symptoms: 'Wheezing, Productive cough, SPO2 93% on room air',
        prescriptions: [
          { medicine: 'Salbutamol + Ipratropium Inhaler', dosage: '2 puffs when breathless', timing: 'As needed', days: '30 days', icon: 'inhaler' },
          { medicine: 'Acebrophylline 100mg', dosage: '1 capsule at night', timing: '0-0-1', days: '10 days', icon: 'capsule' }
        ],
        followUp: 'Avoid cow dung smoke and damp fields. Use mask in morning mist.',
        status: 'Stable'
      }
    ]
  }
];

const clusterPatients = [
  { id: 'cl-1', name: 'Ganga Ram', village: 'Rampur North', symptom: 'Severe Backache', urgency: 'routine', coords: { lat: 25.3240, lng: 82.9770 } },
  { id: 'cl-2', name: 'Sunita Devi (Child Ananya, 3y)', village: 'Rampur Canal', symptom: 'Loose Stools & Vomiting', urgency: 'urgent', coords: { lat: 25.3270, lng: 82.9790 } },
  { id: 'cl-3', name: 'Kewal Yadav', village: 'Rampur East', symptom: 'Wound Dressing post-farm injury', urgency: 'routine', coords: { lat: 25.3310, lng: 82.9830 } },
  { id: 'cl-4', name: 'Phoolwati', village: 'Rampur Ward 1', symptom: 'High BP & Giddiness', urgency: 'routine', coords: { lat: 25.3190, lng: 82.9710 } }
];

const governmentAnalytics = {
  blockName: 'Chiraigaon Rural Block (District Varanasi)',
  totalPopulation: 148500,
  coveredVillages: 28,
  underservedVillages: 4,
  activeHealthWorkers: 32,
  dispatchesToday: 47,
  urgentDispatches: 9,
  averageResponseTimeMinutes: 19.4,
  targetResponseTimeMinutes: 25.0,
  coverageGaps: [
    { village: 'Devgarh South Hamlet', distanceToPHC: '9.4 km', pendingVisits: 6, status: 'Critical Gap', healthWorkerAssigned: 'None (Requires Mobile Unit)' },
    { village: 'Kishanpur Riverside', distanceToPHC: '7.8 km', pendingVisits: 4, status: 'High Backlog', healthWorkerAssigned: 'Dr. Fatima Khan' },
    { village: 'Balarampur Forest Fringe', distanceToPHC: '11.2 km', pendingVisits: 3, status: 'Moderate Gap', healthWorkerAssigned: 'Mobile Van Clinic' },
    { village: 'Shivpur Majra', distanceToPHC: '4.1 km', pendingVisits: 1, status: 'Covered', healthWorkerAssigned: 'Sunita Devi (ASHA)' }
  ],
  diseaseTrends: [
    { disease: 'Seasonal Viral Pyrexia / Dengue Alert', weekCases: 84, trend: '+22%', riskLevel: 'High (Monsoon Outbreak)' },
    { disease: 'Acute Gastroenteritis / Diarrhea', weekCases: 46, trend: '-8%', riskLevel: 'Moderate' },
    { disease: 'Maternal High-Risk Follow-up', weekCases: 38, trend: '+5%', riskLevel: 'Monitored' },
    { disease: 'Pediatric Lower Respiratory Infections', weekCases: 29, trend: '+14%', riskLevel: 'Attention Needed' },
    { disease: 'Chronic Diabetes / Hypertension Follow-up', weekCases: 62, trend: 'Stable', riskLevel: 'Routine' }
  ],
  doctorUtilization: [
    { name: 'Dr. Priya Sharma', role: 'RMO Rampur', hoursOnDuty: '6.5 hrs', visitsToday: 11, satisfactionRating: 4.9 },
    { name: 'Sunita Devi', role: 'ASHA Shivpur', hoursOnDuty: '7.2 hrs', visitsToday: 14, satisfactionRating: 4.95 },
    { name: 'Dr. Rajesh Verma', role: 'CHO Devgarh', hoursOnDuty: '5.8 hrs', visitsToday: 9, satisfactionRating: 4.8 },
    { name: 'Dr. Anand Kulkarni', role: 'Taluka Specialist', hoursOnDuty: '4.0 hrs', visitsToday: 6, satisfactionRating: 4.7 },
    { name: 'Dr. Fatima Khan', role: 'MCH Kishanpur', hoursOnDuty: '5.2 hrs', visitsToday: 7, satisfactionRating: 4.9 }
  ]
};

let state = {
  doctors: JSON.parse(JSON.stringify(initialDoctors)),
  patients: JSON.parse(JSON.stringify(initialPatients)),
  clusterPatients: JSON.parse(JSON.stringify(clusterPatients)),
  activeVisit: null,
  visitHistoryLogs: [],
  sosAlerts: [],
  analytics: JSON.parse(JSON.stringify(governmentAnalytics)),
  offlineQueue: []
};

const sseClients = new Set();

function broadcastEvent(type, data) {
  const payload = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch (err) {
      sseClients.delete(client);
    }
  }
}

function calculateDistanceKm(coords1, coords2) {
  if (!coords1 || !coords2) return 3.5;
  const R = 6371;
  const dLat = (coords2.lat - coords1.lat) * Math.PI / 180;
  const dLng = (coords2.lng - coords1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(coords1.lat * Math.PI / 180) * Math.cos(coords2.lat * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
}

function computeDoctorRankings(patientCoords, patientId, isUrgent = false) {
  const verifiedOnlineDoctors = state.doctors.filter(d => d.verified && d.online);

  return verifiedOnlineDoctors.map(doc => {
    const dist = calculateDistanceKm(doc.coords, patientCoords);
    const ratingScore = (doc.rating / 5.0) * 100;
    const distanceScore = Math.max(0, 100 - (dist * 10));
    const patient = state.patients.find(p => p.id === patientId);
    const hadPriorVisit = patient && patient.history && patient.history.some(h => h.doctorName && h.doctorName.includes(doc.name.split(' ')[1] || ''));
    const continuityScore = hadPriorVisit ? 100 : 40;
    const totalScore = (distanceScore * 0.40) + (ratingScore * 0.30) + (continuityScore * 0.30);

    return {
      doctorId: doc.id,
      doctor: doc,
      distanceKm: dist,
      estimatedMinutes: Math.max(5, Math.round(dist * 3.5)),
      ratingScore: Math.round(ratingScore),
      distanceScore: Math.round(distanceScore),
      continuityScore: Math.round(continuityScore),
      hadPriorVisit,
      totalScore: Math.round(totalScore)
    };
  }).sort((a, b) => b.totalScore - a.totalScore);
}

let movementInterval = null;
let simulationSpeedMultiplier = 3; // 3x speed for snappy live demos

function startMovementSimulation(visit) {
  if (movementInterval) clearInterval(movementInterval);
  if (!visit || !visit.assignedDoctorId) return;

  const doctor = state.doctors.find(d => d.id === visit.assignedDoctorId);
  const patient = state.patients.find(p => p.id === visit.patientId);
  if (!doctor || !patient) return;

  let currentDist = visit.currentDistanceKm || visit.distanceKm || 3.5;
  let currentMins = visit.etaMinutes || Math.round(currentDist * 3.5);

  movementInterval = setInterval(() => {
    if (!state.activeVisit || state.activeVisit.id !== visit.id) {
      clearInterval(movementInterval);
      return;
    }
    if (state.activeVisit.status !== 'en_route') {
      return;
    }

    if (currentDist > 0.3) {
      const decrement = 0.7 * (simulationSpeedMultiplier / 3);
      currentDist = Math.max(0.1, Math.round((currentDist - decrement) * 10) / 10);
      currentMins = Math.max(1, Math.round(currentDist * 2.5));

      const latDiff = (patient.coords.lat - doctor.coords.lat) * 0.28;
      const lngDiff = (patient.coords.lng - doctor.coords.lng) * 0.28;
      doctor.coords.lat += latDiff;
      doctor.coords.lng += lngDiff;

      state.activeVisit.currentDistanceKm = currentDist;
      state.activeVisit.etaMinutes = currentMins;

      broadcastEvent('visit_movement', {
        visitId: visit.id,
        doctorCoords: doctor.coords,
        currentDistanceKm: currentDist,
        etaMinutes: currentMins
      });
    } else {
      state.activeVisit.status = 'arrived';
      state.activeVisit.currentDistanceKm = 0.05;
      state.activeVisit.etaMinutes = 0;
      broadcastEvent('visit_status_changed', {
        visitId: visit.id,
        status: 'arrived',
        message: 'Doctor has arrived at the village location!'
      });
      clearInterval(movementInterval);
    }
  }, 1000);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) req.destroy();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname === '/api/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    res.write(': connected to RuralCare live stream\n\n');
    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');

    try {
      if (pathname === '/api/state' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, data: state }));
        return;
      }

      if (pathname === '/api/reset' && method === 'POST') {
        if (movementInterval) clearInterval(movementInterval);
        state = {
          doctors: JSON.parse(JSON.stringify(initialDoctors)),
          patients: JSON.parse(JSON.stringify(initialPatients)),
          clusterPatients: JSON.parse(JSON.stringify(clusterPatients)),
          activeVisit: null,
          visitHistoryLogs: [],
          sosAlerts: [],
          analytics: JSON.parse(JSON.stringify(governmentAnalytics)),
          offlineQueue: []
        };
        broadcastEvent('state_reset', state);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, message: 'State successfully reset to seed data' }));
        return;
      }

      if (pathname.match(/^\/api\/doctors\/([\w-]+)\/toggle$/) && method === 'POST') {
        const docId = pathname.split('/')[3];
        const doctor = state.doctors.find(d => d.id === docId);
        if (!doctor) {
          res.writeHead(404);
          res.end(JSON.stringify({ success: false, error: 'Doctor not found' }));
          return;
        }
        doctor.online = !doctor.online;
        broadcastEvent('doctor_updated', doctor);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, data: doctor }));
        return;
      }

      if (pathname.match(/^\/api\/doctors\/([\w-]+)\/verify$/) && method === 'POST') {
        const docId = pathname.split('/')[3];
        const doctor = state.doctors.find(d => d.id === docId);
        if (!doctor) {
          res.writeHead(404);
          res.end(JSON.stringify({ success: false, error: 'Doctor not found' }));
          return;
        }
        const body = await parseBody(req);
        doctor.verified = true;
        doctor.licenseNumber = body.licenseNumber || doctor.licenseNumber || 'MCI-UP-2023-VERIFIED';
        doctor.verificationDate = new Date().toISOString().split('T')[0];
        broadcastEvent('doctor_updated', doctor);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, data: doctor }));
        return;
      }

      // Configure Simulation Speed
      if (pathname === '/api/config/speed' && method === 'POST') {
        const body = await parseBody(req);
        if (body.speed) {
          simulationSpeedMultiplier = Number(body.speed);
        }
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, speed: simulationSpeedMultiplier }));
        return;
      }

      if (pathname === '/api/visits/book' && method === 'POST') {
        const body = await parseBody(req);
        const {
          patientId = 'pat-1',
          symptomCategory = 'High Fever & Body Chills',
          symptomDescription = 'High fever with body ache for 3 days',
          urgency = 'routine',
          location = 'Rampur (Ward 3 - Near Canal)',
          voiceNoteUsed = false
        } = body;

        const patient = state.patients.find(p => p.id === patientId) || state.patients[0];
        const isUrgent = urgency === 'urgent';

        const rankedCandidates = computeDoctorRankings(patient.coords, patient.id, isUrgent);

        if (rankedCandidates.length === 0) {
          res.writeHead(400);
          res.end(JSON.stringify({
            success: false,
            error: 'No verified health workers currently online in this radius. Please contact 108 Emergency or Rampur PHC.'
          }));
          return;
        }

        const visitId = 'visit-' + Date.now();
        const initialCandidate = rankedCandidates[0];

        const newVisit = {
          id: visitId,
          patientId: patient.id,
          patientName: patient.name,
          patientAge: patient.age,
          patientGender: patient.gender,
          patientPhone: patient.phone,
          patientVillage: location || patient.village,
          patientAbhaId: patient.abhaId,
          patientCoords: patient.coords,
          symptomCategory,
          symptomDescription,
          urgency,
          isUrgent,
          voiceNoteUsed,
          status: 'dispatching',
          createdAt: new Date().toISOString(),
          rankedCandidates,
          currentCandidateIndex: 0,
          currentCandidateDoctorId: isUrgent ? null : initialCandidate.doctorId,
          broadcastMode: isUrgent,
          assignedDoctorId: null,
          assignedDoctor: null,
          distanceKm: initialCandidate.distanceKm,
          currentDistanceKm: initialCandidate.distanceKm,
          etaMinutes: initialCandidate.estimatedMinutes,
          timeoutSeconds: 15,
          prescription: null
        };

        state.activeVisit = newVisit;

        broadcastEvent('visit_created', newVisit);

        res.writeHead(201);
        res.end(JSON.stringify({ success: true, data: newVisit }));
        return;
      }

      if (pathname.match(/^\/api\/visits\/([\w-]+)\/accept$/) && method === 'POST') {
        const visitId = pathname.split('/')[3];
        const body = await parseBody(req);
        const { doctorId } = body;

        if (!state.activeVisit || state.activeVisit.id !== visitId) {
          res.writeHead(404);
          res.end(JSON.stringify({ success: false, error: 'Active visit not found or already closed' }));
          return;
        }

        const doctor = state.doctors.find(d => d.id === doctorId);
        if (!doctor) {
          res.writeHead(404);
          res.end(JSON.stringify({ success: false, error: 'Doctor not found' }));
          return;
        }

        const distance = calculateDistanceKm(doctor.coords, state.activeVisit.patientCoords);
        const eta = Math.max(5, Math.round(distance * 3.5));

        state.activeVisit.status = 'en_route';
        state.activeVisit.assignedDoctorId = doctor.id;
        state.activeVisit.assignedDoctor = doctor;
        state.activeVisit.distanceKm = distance;
        state.activeVisit.currentDistanceKm = distance;
        state.activeVisit.etaMinutes = eta;
        state.activeVisit.acceptedAt = new Date().toISOString();

        state.analytics.dispatchesToday += 1;
        if (state.activeVisit.isUrgent) {
          state.analytics.urgentDispatches += 1;
        }

        broadcastEvent('visit_accepted', state.activeVisit);

        startMovementSimulation(state.activeVisit);

        res.writeHead(200);
        res.end(JSON.stringify({ success: true, data: state.activeVisit }));
        return;
      }

      if (pathname.match(/^\/api\/visits\/([\w-]+)\/decline$/) && method === 'POST') {
        const visitId = pathname.split('/')[3];
        const body = await parseBody(req);
        const { doctorId } = body;

        if (!state.activeVisit || state.activeVisit.id !== visitId) {
          res.writeHead(404);
          res.end(JSON.stringify({ success: false, error: 'Active visit not found' }));
          return;
        }

        const nextIndex = state.activeVisit.currentCandidateIndex + 1;
        if (nextIndex < state.activeVisit.rankedCandidates.length) {
          state.activeVisit.currentCandidateIndex = nextIndex;
          const nextCandidate = state.activeVisit.rankedCandidates[nextIndex];
          state.activeVisit.currentCandidateDoctorId = nextCandidate.doctorId;
          state.activeVisit.distanceKm = nextCandidate.distanceKm;
          state.activeVisit.etaMinutes = nextCandidate.estimatedMinutes;
          state.activeVisit.timeoutSeconds = 35;

          broadcastEvent('visit_forwarded', {
            visit: state.activeVisit,
            previousDoctorId: doctorId,
            nextCandidate
          });
        } else {
          state.activeVisit.status = 'unassigned_alert';
          broadcastEvent('visit_queue_exhausted', state.activeVisit);
        }

        res.writeHead(200);
        res.end(JSON.stringify({ success: true, data: state.activeVisit }));
        return;
      }

      if (pathname.match(/^\/api\/visits\/([\w-]+)\/status$/) && method === 'POST') {
        const visitId = pathname.split('/')[3];
        const body = await parseBody(req);
        const { status } = body;

        if (!state.activeVisit || state.activeVisit.id !== visitId) {
          res.writeHead(404);
          res.end(JSON.stringify({ success: false, error: 'Active visit not found' }));
          return;
        }

        state.activeVisit.status = status;
        if (status === 'arrived') {
          if (movementInterval) clearInterval(movementInterval);
          state.activeVisit.etaMinutes = 0;
          state.activeVisit.currentDistanceKm = 0.05;
        }

        broadcastEvent('visit_status_changed', {
          visitId,
          status,
          visit: state.activeVisit
        });

        res.writeHead(200);
        res.end(JSON.stringify({ success: true, data: state.activeVisit }));
        return;
      }

      // Fast-forward visit to arrival (Instant Demo Jump)
      if (pathname.match(/^\/api\/visits\/([\w-]+)\/fast-forward$/) && method === 'POST') {
        const visitId = pathname.split('/')[3];
        if (!state.activeVisit || state.activeVisit.id !== visitId) {
          res.writeHead(404);
          res.end(JSON.stringify({ success: false, error: 'Active visit not found' }));
          return;
        }

        if (movementInterval) clearInterval(movementInterval);
        state.activeVisit.status = 'arrived';
        state.activeVisit.currentDistanceKm = 0.05;
        state.activeVisit.etaMinutes = 0;

        const doctor = state.doctors.find(d => d.id === state.activeVisit.assignedDoctorId);
        const patient = state.patients.find(p => p.id === state.activeVisit.patientId);
        if (doctor && patient) {
          doctor.coords.lat = patient.coords.lat - 0.001;
          doctor.coords.lng = patient.coords.lng - 0.001;
        }

        broadcastEvent('visit_status_changed', {
          visitId,
          status: 'arrived',
          message: 'Fast-Forward: Doctor has arrived at the patient location!',
          visit: state.activeVisit
        });

        res.writeHead(200);
        res.end(JSON.stringify({ success: true, data: state.activeVisit }));
        return;
      }

      if (pathname.match(/^\/api\/visits\/([\w-]+)\/prescribe$/) && method === 'POST') {
        const visitId = pathname.split('/')[3];
        const body = await parseBody(req);
        const {
          diagnosis = 'Acute Illness',
          clinicalNotes = 'Patient advised rest, hydration, and completion of medications.',
          medicines = [],
          followUp = 'Visit PHC in 5 days if unresolved',
          voiceNoteStub = false
        } = body;

        if (!state.activeVisit || state.activeVisit.id !== visitId) {
          res.writeHead(404);
          res.end(JSON.stringify({ success: false, error: 'Active visit not found' }));
          return;
        }

        const patient = state.patients.find(p => p.id === state.activeVisit.patientId);
        const doctor = state.doctors.find(d => d.id === state.activeVisit.assignedDoctorId) || {
          name: 'Attending Medical Officer',
          roleTitle: 'Medical Officer',
          degree: 'MBBS',
          licenseNumber: 'Verified'
        };

        const prescriptionEntry = {
          id: 'rx-' + Date.now(),
          visitId,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          doctorName: doctor.name,
          doctorRole: doctor.roleTitle || 'Medical Officer',
          doctorDegree: doctor.degree || 'MBBS',
          doctorLicense: doctor.licenseNumber || 'Verified',
          diagnosis,
          symptoms: state.activeVisit.symptomCategory + ' - ' + state.activeVisit.symptomDescription,
          clinicalNotes,
          medicines,
          followUp,
          voiceNoteStub,
          status: 'Active'
        };

        if (patient) {
          if (!patient.history) patient.history = [];
          patient.history.unshift(prescriptionEntry);
        }

        if (doctor && doctor.completedVisits !== undefined) {
          doctor.completedVisits += 1;
        }

        state.activeVisit.status = 'completed';
        state.activeVisit.completedAt = new Date().toISOString();
        state.activeVisit.prescription = prescriptionEntry;

        state.visitHistoryLogs.unshift(state.activeVisit);

        broadcastEvent('prescription_issued', {
          visitId,
          patientId: state.activeVisit.patientId,
          prescription: prescriptionEntry,
          patient
        });

        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          data: {
            visit: state.activeVisit,
            prescription: prescriptionEntry,
            patient
          }
        }));
        return;
      }

      if (pathname.match(/^\/api\/visits\/([\w-]+)\/cancel$/) && method === 'POST') {
        const visitId = pathname.split('/')[3];
        if (movementInterval) clearInterval(movementInterval);

        if (state.activeVisit && state.activeVisit.id === visitId) {
          state.activeVisit.status = 'cancelled';
          broadcastEvent('visit_cancelled', { visitId });
          state.activeVisit = null;
        }

        res.writeHead(200);
        res.end(JSON.stringify({ success: true, message: 'Visit cancelled' }));
        return;
      }

      if (pathname === '/api/sos' && method === 'POST') {
        const body = await parseBody(req);
        const {
          patientId = 'pat-1',
          patientName = 'Ramesh Kumar',
          location = 'Rampur Ward 3 (GPS: 25.3280° N, 82.9810° E)',
          coords = { lat: 25.3280, lng: 82.9810 },
          reason = 'Emergency SOS Button Pressed'
        } = body;

        const sosId = 'sos-' + Date.now();
        const sosRecord = {
          id: sosId,
          patientId,
          patientName,
          location,
          coords,
          reason,
          timestamp: new Date().toISOString(),
          ambulanceUnit: '108 Rural Emergency Ambulance - Unit #UP-65-AMB-108',
          assignedHospital: 'Chiraigaon Community Health Centre (CHC)',
          nearestPhc: 'Rampur Primary Health Centre (1.8 km)',
          etaMinutes: 11,
          status: 'dispatched'
        };

        state.sosAlerts.unshift(sosRecord);
        state.analytics.urgentDispatches += 1;

        broadcastEvent('sos_alert', sosRecord);

        res.writeHead(201);
        res.end(JSON.stringify({ success: true, data: sosRecord }));
        return;
      }

      if (pathname.match(/^\/api\/sos\/([\w-]+)\/resolve$/) && method === 'POST') {
        const sosId = pathname.split('/')[3];
        const sos = state.sosAlerts.find(s => s.id === sosId);
        if (sos) {
          sos.status = 'resolved';
          broadcastEvent('sos_resolved', sos);
        }
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, data: sos }));
        return;
      }

      res.writeHead(404);
      res.end(JSON.stringify({ success: false, error: 'API endpoint not found' }));
      return;
    } catch (err) {
      console.error('API Error:', err);
      res.writeHead(500);
      res.end(JSON.stringify({ success: false, error: err.message }));
      return;
    }
  }

  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const indexPath = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(indexPath, (err, content) => {
        if (err) {
          res.writeHead(404);
          res.end('Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error reading file');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🏥 RuralCare Connect Server running on http://localhost:${PORT}`);
  console.log(`📡 SSE Stream active on http://localhost:${PORT}/api/events`);
  console.log(`🌍 Seeded 5 Doctors, 3 Patients, and Village Cluster`);
  console.log('====================================================');
});
