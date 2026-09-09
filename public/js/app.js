// app.js - Master UI Controller & Navigation for RuralCare Connect

window.App = {
  activeView: 'dual', // 'dual', 'patient', 'doctor', 'admin'

  async init() {
    // Initialize State
    await window.AppState.init();

    // Subscribe to State Changes for reactive re-renders
    window.AppState.subscribe((event, data) => {
      this.handleStateUpdate(event, data);
    });

    // Language change listener
    window.addEventListener('language_changed', () => {
      this.render();
    });

    // Render initial layout
    this.render();
  },

  setView(view) {
    this.activeView = view;

    // Update tab bar buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === view);
    });

    this.render();
  },

  render() {
    const stage = document.getElementById('stage-container');
    if (!stage) return;

    if (this.activeView === 'dual') {
      stage.innerHTML = `
        <div class="dual-viewport">
          <!-- Left Column: Patient Phone Frame -->
          <div class="device-frame" id="patient-device-root"></div>

          <!-- Right Column: Doctor Phone Frame -->
          <div class="device-frame" id="doctor-device-root"></div>
        </div>
      `;
      window.PatientView.render('patient-device-root');
      window.DoctorView.render('doctor-device-root');
    } else if (this.activeView === 'patient') {
      stage.innerHTML = `
        <div class="single-viewport">
          <div class="device-frame" id="patient-device-root"></div>
        </div>
      `;
      window.PatientView.render('patient-device-root');
    } else if (this.activeView === 'doctor') {
      stage.innerHTML = `
        <div class="single-viewport">
          <div class="device-frame" id="doctor-device-root"></div>
        </div>
      `;
      window.DoctorView.render('doctor-device-root');
    } else if (this.activeView === 'admin') {
      stage.innerHTML = `
        <div class="dashboard-viewport" id="admin-root"></div>
      `;
      window.AdminView.render('admin-root');
    }

    // Apply translations across UI
    window.RURAL_I18N.applyTranslations();
  },

  handleStateUpdate(event, data) {
    if (this.activeView === 'dual') {
      window.PatientView.render('patient-device-root');
      window.DoctorView.render('doctor-device-root');
    } else if (this.activeView === 'patient') {
      window.PatientView.render('patient-device-root');
    } else if (this.activeView === 'doctor') {
      window.DoctorView.render('doctor-device-root');
    } else if (this.activeView === 'admin') {
      window.AdminView.render('admin-root');
    }

    // Update offline indicator if needed
    if (event === 'offline_simulation_changed') {
      const banner = document.getElementById('offline-banner');
      const btn = document.getElementById('offline-toggle-btn');
      if (banner) {
        banner.style.display = data.isOffline ? 'flex' : 'none';
      }
      if (btn) {
        btn.classList.toggle('simulating-offline', data.isOffline);
        btn.innerHTML = data.isOffline ? '⚠️ Simulating Offline (No 4G)' : '📶 Simulate Offline';
      }
      if (data.isOffline) {
        this.showToast('📶 2G/No Signal Mode simulated. Bookings will queue locally.');
      } else {
        this.showToast('🟢 Signal Restored. Offline items synchronized!');
      }
    }
  },

  showToast(message) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<span>🔔</span> <span>${message}</span>`;
    toast.style.display = 'flex';

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.style.display = 'none';
    }, 4500);
  },

  async handleResetDemo() {
    if (confirm('Reset prototype state to initial demo seed (5 doctors, 3 patients)?')) {
      await window.AppState.resetAll();
      this.showToast('Prototype state successfully reset to initial demo seeds.');
      this.render();
    }
  },

  currentSpeed: 3,

  async toggleSpeed() {
    if (this.currentSpeed === 1) this.currentSpeed = 3;
    else if (this.currentSpeed === 3) this.currentSpeed = 5;
    else this.currentSpeed = 1;

    const label = document.getElementById('speed-label');
    if (label) {
      label.textContent = `Speed: ${this.currentSpeed}x ${this.currentSpeed === 5 ? 'Hyper' : this.currentSpeed === 3 ? 'Turbo' : 'Normal'}`;
    }
    await window.AppState.setSimulationSpeed(this.currentSpeed);
    this.showToast(`⚡ Simulation speed set to ${this.currentSpeed}x`);
  },

  async runFastDemoWalkthrough() {
    this.setView('dual');
    this.showToast('🚀 Running 8-second end-to-end demo walkthrough...');

    // Step 1: Book visit
    await new Promise(r => setTimeout(r, 600));
    window.AppState.patientActiveTab = 'book';
    this.render();

    const bookRes = await window.AppState.bookVisit({
      patientId: 'pat-1',
      symptomCategory: 'High Fever & Chills',
      symptomDescription: 'Fever 101.5F with severe shivering for 2 days',
      urgency: 'urgent',
      location: 'Rampur (Ward 3 - Near Canal)'
    });

    const visit = bookRes.data;
    window.AppState.patientActiveTab = 'tracking';
    this.render();
    this.showToast('Step 1: Patient booked urgent visit. Pinging doctors...');

    // Step 2: Doctor Accepts
    await new Promise(r => setTimeout(r, 1600));
    const doctorId = 'doc-1';
    await window.AppState.acceptVisit(visit.id, doctorId);
    this.showToast('Step 2: Dr. Priya Sharma accepted! En route on Hero Splendor.');

    // Step 3: Fast-forward to arrival
    await new Promise(r => setTimeout(r, 2200));
    await window.AppState.fastForwardVisit(visit.id);
    this.showToast('Step 3: Doctor arrived at Ramesh Kumar\'s home.');

    // Step 4: Open Rx pad and prescribe
    await new Promise(r => setTimeout(r, 1400));
    window.AppState.doctorActiveTab = 'prescription';
    this.render();

    await new Promise(r => setTimeout(r, 1200));
    await window.AppState.issuePrescription(visit.id, {
      diagnosis: 'Seasonal Viral Pyrexia & Fatigue',
      clinicalNotes: 'Bed rest and hydration advised.',
      medicines: [
        { medicine: 'Paracetamol 500mg', dosage: '1 tablet 3 times a day', timing: '1-1-1', days: '3 days' },
        { medicine: 'Oral Rehydration Salts (ORS)', dosage: '1 sachet in 1L water', timing: 'Continuous', days: '2 days' }
      ],
      followUp: 'Recheck at Rampur PHC if fever persists.'
    });

    // Step 5: Patient sees updated ABHA records
    window.AppState.patientActiveTab = 'records';
    window.AppState.doctorActiveTab = 'incoming';
    this.render();
    this.showToast('✨ Step 5: Prescription synced to ABHA record in real time!');
  }
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});
