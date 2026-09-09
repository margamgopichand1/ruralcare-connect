// state.js - Reactive State Manager with SSE & Offline-First LocalStorage Fallback

window.AppState = {
  doctors: [],
  patients: [],
  clusterPatients: [],
  activeVisit: null,
  visitHistoryLogs: [],
  sosAlerts: [],
  analytics: {},
  offlineQueue: [],
  isSimulatingOffline: false,

  // Current session identities
  currentPatientId: 'pat-1',
  currentDoctorId: 'doc-1',
  currentView: 'dual', // 'dual', 'patient', 'doctor', 'admin'
  patientActiveTab: 'book', // 'book', 'tracking', 'records'
  doctorActiveTab: 'incoming', // 'incoming', 'cluster', 'verify'

  subscribers: new Set(),

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  },

  notify(event, payload) {
    for (const callback of this.subscribers) {
      try {
        callback(event, payload, this);
      } catch (err) {
        console.error('State subscriber error:', err);
      }
    }
  },

  async init() {
    await this.fetchInitialState();
    this.initSSE();
  },

  async fetchInitialState() {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          this.doctors = json.data.doctors || [];
          this.patients = json.data.patients || [];
          this.clusterPatients = json.data.clusterPatients || [];
          this.activeVisit = json.data.activeVisit || null;
          this.visitHistoryLogs = json.data.visitHistoryLogs || [];
          this.sosAlerts = json.data.sosAlerts || [];
          this.analytics = json.data.analytics || {};
          this.saveToLocalStorage();
          this.notify('init', this);
          return;
        }
      }
    } catch (err) {
      console.warn('Network unavailable, falling back to cached local storage:', err);
      this.loadFromLocalStorage();
    }
  },

  initSSE() {
    if (this.isSimulatingOffline) return;

    try {
      const eventSource = new EventSource('/api/events');

      eventSource.addEventListener('visit_created', e => {
        const visit = JSON.parse(e.data);
        this.activeVisit = visit;
        if (this.currentDoctorId === visit.currentCandidateDoctorId || visit.broadcastMode) {
          window.AudioEngine.playNotificationChime();
        }
        this.notify('visit_created', visit);
      });

      eventSource.addEventListener('visit_accepted', e => {
        const visit = JSON.parse(e.data);
        this.activeVisit = visit;
        this.notify('visit_accepted', visit);
      });

      eventSource.addEventListener('visit_movement', e => {
        const data = JSON.parse(e.data);
        if (this.activeVisit && this.activeVisit.id === data.visitId) {
          this.activeVisit.currentDistanceKm = data.currentDistanceKm;
          this.activeVisit.etaMinutes = data.etaMinutes;
          const doctor = this.doctors.find(d => d.id === this.activeVisit.assignedDoctorId);
          if (doctor) {
            doctor.coords = data.doctorCoords;
          }
          this.notify('visit_movement', data);
        }
      });

      eventSource.addEventListener('visit_status_changed', e => {
        const data = JSON.parse(e.data);
        if (this.activeVisit && this.activeVisit.id === data.visitId) {
          this.activeVisit.status = data.status;
          if (data.status === 'arrived') {
            window.AudioEngine.playSuccess();
          }
          this.notify('visit_status_changed', data);
        }
      });

      eventSource.addEventListener('visit_forwarded', e => {
        const data = JSON.parse(e.data);
        this.activeVisit = data.visit;
        if (this.currentDoctorId === data.visit.currentCandidateDoctorId) {
          window.AudioEngine.playNotificationChime();
        }
        this.notify('visit_forwarded', data);
      });

      eventSource.addEventListener('prescription_issued', e => {
        const data = JSON.parse(e.data);
        const patient = this.patients.find(p => p.id === data.patientId);
        if (patient) {
          if (!patient.history) patient.history = [];
          patient.history.unshift(data.prescription);
        }
        if (this.activeVisit && this.activeVisit.id === data.visitId) {
          this.activeVisit.status = 'completed';
          this.activeVisit.prescription = data.prescription;
        }
        window.AudioEngine.playSuccess();
        this.notify('prescription_issued', data);
      });

      eventSource.addEventListener('doctor_updated', e => {
        const doctor = JSON.parse(e.data);
        const idx = this.doctors.findIndex(d => d.id === doctor.id);
        if (idx !== -1) {
          this.doctors[idx] = doctor;
        }
        this.notify('doctor_updated', doctor);
      });

      eventSource.addEventListener('sos_alert', e => {
        const sos = JSON.parse(e.data);
        this.sosAlerts.unshift(sos);
        window.AudioEngine.playSiren(3);
        this.notify('sos_alert', sos);
      });

      eventSource.addEventListener('sos_resolved', e => {
        const sos = JSON.parse(e.data);
        const target = this.sosAlerts.find(s => s.id === sos.id);
        if (target) target.status = 'resolved';
        this.notify('sos_resolved', sos);
      });

      eventSource.addEventListener('state_reset', e => {
        const newState = JSON.parse(e.data);
        this.doctors = newState.doctors;
        this.patients = newState.patients;
        this.clusterPatients = newState.clusterPatients;
        this.activeVisit = newState.activeVisit;
        this.sosAlerts = newState.sosAlerts;
        this.analytics = newState.analytics;
        this.notify('state_reset', newState);
      });
    } catch (err) {
      console.warn('SSE Error:', err);
    }
  },

  // Actions
  async bookVisit(payload) {
    if (this.isSimulatingOffline) {
      // Queue offline
      const mockVisit = {
        id: 'visit-offline-' + Date.now(),
        patientId: payload.patientId,
        symptomCategory: payload.symptomCategory,
        symptomDescription: payload.symptomDescription,
        urgency: payload.urgency,
        isUrgent: payload.urgency === 'urgent',
        status: 'queued_offline',
        createdAt: new Date().toISOString(),
        offlineNote: 'Queued in offline storage. Will dispatch once network is detected.'
      };
      this.offlineQueue.push({ type: 'book_visit', payload });
      this.activeVisit = mockVisit;
      this.notify('visit_created_offline', mockVisit);
      return { success: true, data: mockVisit };
    }

    const res = await fetch('/api/visits/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      this.activeVisit = data.data;
      this.notify('visit_created', data.data);
    }
    return data;
  },

  async acceptVisit(visitId, doctorId) {
    const res = await fetch(`/api/visits/${visitId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId })
    });
    const data = await res.json();
    if (data.success) {
      this.activeVisit = data.data;
      this.notify('visit_accepted', data.data);
    }
    return data;
  },

  async declineVisit(visitId, doctorId) {
    const res = await fetch(`/api/visits/${visitId}/decline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId })
    });
    const data = await res.json();
    if (data.success) {
      this.activeVisit = data.data;
      this.notify('visit_declined', data.data);
    }
    return data;
  },

  async updateVisitStatus(visitId, status) {
    const res = await fetch(`/api/visits/${visitId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (data.success) {
      this.activeVisit = data.data;
      this.notify('visit_status_changed', { visitId, status, visit: data.data });
    }
    return data;
  },

  async fastForwardVisit(visitId) {
    // Optimistic fast-forward
    if (this.activeVisit) {
      this.activeVisit.status = 'arrived';
      this.activeVisit.currentDistanceKm = 0.05;
      this.activeVisit.etaMinutes = 0;
      this.notify('visit_status_changed', { visitId, status: 'arrived', visit: this.activeVisit });
    }

    const res = await fetch(`/api/visits/${visitId}/fast-forward`, {
      method: 'POST'
    });
    const data = await res.json();
    if (data.success) {
      this.activeVisit = data.data;
      this.notify('visit_status_changed', { visitId, status: 'arrived', visit: data.data });
    }
    return data;
  },

  async setSimulationSpeed(speed) {
    await fetch('/api/config/speed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ speed })
    });
  },

  async issuePrescription(visitId, payload) {
    const res = await fetch(`/api/visits/${visitId}/prescribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      this.activeVisit = data.data.visit;
      const patient = this.patients.find(p => p.id === data.data.patient.id);
      if (patient) {
        patient.history = data.data.patient.history;
      }
      this.notify('prescription_issued', data.data);
    }
    return data;
  },

  async cancelVisit(visitId) {
    const res = await fetch(`/api/visits/${visitId}/cancel`, {
      method: 'POST'
    });
    const data = await res.json();
    if (data.success) {
      this.activeVisit = null;
      this.notify('visit_cancelled', { visitId });
    }
    return data;
  },

  async toggleDoctorOnline(doctorId) {
    const res = await fetch(`/api/doctors/${doctorId}/toggle`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      const doc = this.doctors.find(d => d.id === doctorId);
      if (doc) doc.online = data.data.online;
      this.notify('doctor_updated', doc);
    }
    return data;
  },

  async verifyDoctorLicense(doctorId, licenseNumber) {
    const res = await fetch(`/api/doctors/${doctorId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseNumber })
    });
    const data = await res.json();
    if (data.success) {
      const doc = this.doctors.find(d => d.id === doctorId);
      if (doc) {
        doc.verified = true;
        doc.licenseNumber = data.data.licenseNumber;
        doc.verificationDate = data.data.verificationDate;
      }
      this.notify('doctor_updated', doc);
    }
    return data;
  },

  async triggerSos(payload) {
    const res = await fetch('/api/sos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      this.sosAlerts.unshift(data.data);
      this.notify('sos_alert', data.data);
    }
    return data;
  },

  async resolveSos(sosId) {
    const res = await fetch(`/api/sos/${sosId}/resolve`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      const target = this.sosAlerts.find(s => s.id === sosId);
      if (target) target.status = 'resolved';
      this.notify('sos_resolved', target);
    }
    return data;
  },

  async resetAll() {
    const res = await fetch('/api/reset', { method: 'POST' });
    const data = await res.json();
    await this.fetchInitialState();
    return data;
  },

  toggleOfflineSimulation() {
    this.isSimulatingOffline = !this.isSimulatingOffline;
    if (!this.isSimulatingOffline && this.offlineQueue.length > 0) {
      // Flush offline queue!
      const itemsToSync = [...this.offlineQueue];
      this.offlineQueue = [];
      itemsToSync.forEach(async item => {
        if (item.type === 'book_visit') {
          await this.bookVisit(item.payload);
        }
      });
    }
    this.notify('offline_simulation_changed', { isOffline: this.isSimulatingOffline });
  },

  saveToLocalStorage() {
    try {
      localStorage.setItem('ruralcare_doctors', JSON.stringify(this.doctors));
      localStorage.setItem('ruralcare_patients', JSON.stringify(this.patients));
    } catch (e) {}
  },

  loadFromLocalStorage() {
    try {
      const docs = localStorage.getItem('ruralcare_doctors');
      const pats = localStorage.getItem('ruralcare_patients');
      if (docs) this.doctors = JSON.parse(docs);
      if (pats) this.patients = JSON.parse(pats);
      this.notify('init', this);
    } catch (e) {}
  }
};
