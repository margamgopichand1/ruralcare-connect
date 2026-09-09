// patient-view.js - Patient Portal UI & Interaction Handlers

window.PatientView = {
  selectedSymptom: 'fever',
  selectedUrgency: 'routine',
  voiceInputActive: false,

  symptoms: [
    { id: 'fever', icon: '🌡️', titleKey: 'symptomFever', desc: 'Fever > 100°F, chills, fatigue' },
    { id: 'maternal', icon: '🤰', titleKey: 'symptomMaternal', desc: 'Antenatal, cramps, BP check' },
    { id: 'injury', icon: '🩹', titleKey: 'symptomInjury', desc: 'Farm cut, bleeding, dressing' },
    { id: 'child', icon: '👶', titleKey: 'symptomChild', desc: 'Pediatric cough, vomiting' },
    { id: 'diarrhea', icon: '💧', titleKey: 'symptomDiarrhea', desc: 'Loose stools, dehydration' },
    { id: 'chronic', icon: '🩺', titleKey: 'symptomChronic', desc: 'Diabetic sugar / BP review' },
    { id: 'general', icon: '🤒', titleKey: 'symptomGeneral', desc: 'Weakness, headache, pain' }
  ],

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const patient = window.AppState.patients.find(p => p.id === window.AppState.currentPatientId) || window.AppState.patients[0];
    const activeTab = window.AppState.patientActiveTab;
    const activeVisit = window.AppState.activeVisit;

    // If an active visit exists and is not completed/cancelled, show tracking tab by default unless user explicitly chose records
    let currentTab = activeTab;
    if (activeVisit && (activeVisit.status === 'dispatching' || activeVisit.status === 'en_route' || activeVisit.status === 'arrived' || activeVisit.status === 'in_consultation') && activeTab === 'book') {
      currentTab = 'tracking';
      window.AppState.patientActiveTab = 'tracking';
    }

    container.innerHTML = `
      <!-- Patient Phone Frame Header -->
      <div class="device-header">
        <div class="device-role-label">
          <span>📱</span>
          <span data-i18n="patientApp">Patient App</span>
        </div>
        <div class="device-notch"></div>
        <div style="font-size: 11px; opacity: 0.8;">4G Jio • 92% 🔋</div>
      </div>

      <!-- Quick Switch Patient Header -->
      <div class="user-switch-banner">
        <span>👤 <strong>${patient.name}</strong> (${patient.age}y)</span>
        <select onchange="window.PatientView.switchPatient(this.value)">
          ${window.AppState.patients.map(p => `
            <option value="${p.id}" ${p.id === patient.id ? 'selected' : ''}>
              ${p.name} - ${p.village.split(' ')[0]}
            </option>
          `).join('')}
        </select>
      </div>

      <!-- Device Body (Scrollable) -->
      <div class="device-body" id="patient-device-body">
        ${currentTab === 'book' ? this.renderBookingTab(patient) : ''}
        ${currentTab === 'tracking' ? this.renderTrackingTab(activeVisit, patient) : ''}
        ${currentTab === 'records' ? this.renderRecordsTab(patient) : ''}
      </div>

      <!-- Floating SOS Button (Always Visible) -->
      <button class="sos-floating-btn" onclick="window.SosFlow.openSosModal('${patient.id}')" title="108 Emergency Ambulance">
        <span style="font-size: 20px;">🚨</span>
        <span>SOS</span>
      </button>

      <!-- Bottom Navigation Bar -->
      <div class="device-footer">
        <button class="footer-nav-item ${currentTab === 'book' ? 'active' : ''}" onclick="window.PatientView.setTab('book')">
          <span class="nav-icon">➕</span>
          <span data-i18n="bookTab">Book Visit</span>
        </button>
        <button class="footer-nav-item ${currentTab === 'tracking' ? 'active' : ''}" onclick="window.PatientView.setTab('tracking')">
          <span class="nav-icon">📍</span>
          <span data-i18n="trackingTab">Live Tracking</span>
        </button>
        <button class="footer-nav-item ${currentTab === 'records' ? 'active' : ''}" onclick="window.PatientView.setTab('records')">
          <span class="nav-icon">📋</span>
          <span data-i18n="recordsTab">Records</span>
        </button>
      </div>
    `;

    // Initialize SVG map if on tracking tab
    if (currentTab === 'tracking' && activeVisit) {
      window.VillageMap.renderTrackingMap(activeVisit, 'patient-tracking-map');
    }
  },

  renderBookingTab(patient) {
    const t = key => window.RURAL_I18N.t(key);

    return `
      <div class="patient-content">
        <!-- Welcome Card -->
        <div class="welcome-card">
          <h2 style="font-size: 18px; font-weight: 800;">${t('welcomeGreeting')}, ${patient.name}!</h2>
          <p style="font-size: 12px; opacity: 0.9; margin-top: 4px;">
            ${t('tagline')} • <strong>${patient.village}</strong>
          </p>
        </div>

        <!-- Voice Input Stub -->
        <div class="voice-banner" onclick="window.PatientView.toggleVoiceStub()">
          <div style="flex: 1;">
            <div style="font-size: 13px; font-weight: 800; color: #0d9488;" data-i18n="voiceInputStub">
              ${t('voiceInputStub')}
            </div>
            <div style="font-size: 11px; color: #475569; margin-top: 2px;" id="voice-status-text">
              ${this.voiceInputActive ? t('voiceListening') : 'Hindi / Bhojpuri / Regional Voice Search'}
            </div>
          </div>
          <div class="voice-mic-btn" style="${this.voiceInputActive ? 'animation: pulse-ring 1s infinite;' : ''}">
            🎤
          </div>
        </div>

        <!-- Voice transcribed notification -->
        ${this.voiceInputActive ? `
          <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 10px; padding: 10px; font-size: 12px; color: #166534;">
            <strong>✨ Voice Detected:</strong> ${t('voiceDetected')}
          </div>
        ` : ''}

        <!-- Symptom Selector Grid -->
        <div>
          <div class="section-label">
            <span data-i18n="selectSymptom">${t('selectSymptom')}</span>
          </div>
          <div class="symptom-grid">
            ${this.symptoms.map(s => `
              <div class="symptom-tile ${this.selectedSymptom === s.id ? 'selected' : ''}" 
                   onclick="window.PatientView.selectSymptom('${s.id}')">
                <span class="symptom-icon">${s.icon}</span>
                <span class="symptom-name" data-i18n="${s.titleKey}">${t(s.titleKey)}</span>
                <span class="symptom-sub">${s.desc}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Urgency Level -->
        <div>
          <div class="section-label" data-i18n="urgencyLabel">${t('urgencyLabel')}</div>
          <div class="urgency-selector">
            <div class="urgency-option routine ${this.selectedUrgency === 'routine' ? 'selected' : ''}" 
                 onclick="window.PatientView.selectUrgency('routine')">
              <div class="urgency-title" style="color: var(--primary-dark);">
                🟢 <span data-i18n="routineCare">${t('routineCare')}</span>
              </div>
              <div class="urgency-sub" data-i18n="routineCareSub">${t('routineCareSub')}</div>
            </div>

            <div class="urgency-option urgent ${this.selectedUrgency === 'urgent' ? 'selected' : ''}" 
                 onclick="window.PatientView.selectUrgency('urgent')">
              <div class="urgency-title" style="color: var(--emergency);">
                🚨 <span data-i18n="urgentCare">${t('urgentCare')}</span>
              </div>
              <div class="urgency-sub" data-i18n="urgentCareSub">${t('urgentCareSub')}</div>
            </div>
          </div>
        </div>

        <!-- Village Location Selection (Mock GPS) -->
        <div>
          <div class="section-label" data-i18n="villageLocation">${t('villageLocation')}</div>
          <select class="village-picker" id="patient-village-select">
            <option value="Rampur (Ward 3 - Near Canal)">📍 Rampur (Ward 3 - Near Canal Bridge)</option>
            <option value="Devgarh Village (Near Old Banyan Tree)">📍 Devgarh Village (Old Banyan Tree)</option>
            <option value="Shivpur Purva (House #14)">📍 Shivpur Purva (Near Temple)</option>
            <option value="Balarampur North">📍 Balarampur North Hamlet</option>
            <option value="Kishanpur Primary School">📍 Kishanpur (Near Primary School)</option>
          </select>
        </div>

        <!-- Big Accessible Action Button -->
        <button class="btn-large ${this.selectedUrgency === 'urgent' ? 'btn-urgent' : 'btn-primary'}" 
                onclick="window.PatientView.submitBooking()">
          <span>${this.selectedUrgency === 'urgent' ? '🚨' : '🩺'}</span>
          <span data-i18n="findDoctorBtn">${t('findDoctorBtn')}</span>
        </button>
      </div>
    `;
  },

  renderTrackingTab(visit, patient) {
    const t = key => window.RURAL_I18N.t(key);

    if (!visit || visit.status === 'completed' || visit.status === 'cancelled') {
      return `
        <div class="patient-content" style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 54px; margin-bottom: 12px;">🏡</div>
          <h3 style="font-weight: 800; font-size: 17px; margin-bottom: 6px;">No Active Visit in Progress</h3>
          <p style="font-size: 13px; color: #64748b; margin-bottom: 20px;">
            Request a health worker or doctor visit to your doorstep whenever you need medical care.
          </p>
          <button class="btn-large btn-primary" onclick="window.PatientView.setTab('book')">
            <span>➕</span>
            <span data-i18n="bookVisitTitle">${t('bookVisitTitle')}</span>
          </button>
        </div>
      `;
    }

    const isDispatching = visit.status === 'dispatching';
    const isEnRoute = visit.status === 'en_route';
    const isArrived = visit.status === 'arrived';
    const isInConsultation = visit.status === 'in_consultation';

    return `
      <div class="tracking-container">
        <!-- Interactive Rural Map View -->
        <div class="map-wrapper">
          <div id="patient-tracking-map" style="width: 100%; height: 100%;"></div>
          
          <div class="map-overlay-eta">
            <div class="pulse-dot"></div>
            <span>
              ${isDispatching ? 'Matching nearby doctors...' : 
                isEnRoute ? `ETA: ${visit.etaMinutes || 12} mins • ${visit.currentDistanceKm || 3.2} km away` :
                isArrived ? 'Doctor has arrived at village!' :
                'Consultation in progress'}
            </span>
          </div>
        </div>

        <!-- Tracking Details Panel -->
        <div class="tracking-details">
          <!-- Ride Status Stepper -->
          <div class="status-stepper">
            <div class="step-item ${isDispatching || isEnRoute || isArrived || isInConsultation ? 'active completed' : ''}">
              <div class="step-circle">1</div>
              <div class="step-label">Matched</div>
            </div>
            <div class="step-item ${isEnRoute || isArrived || isInConsultation ? 'active completed' : ''}">
              <div class="step-circle">2</div>
              <div class="step-label">En Route</div>
            </div>
            <div class="step-item ${isArrived || isInConsultation ? 'active completed' : ''}">
              <div class="step-circle">3</div>
              <div class="step-label">Arrived</div>
            </div>
            <div class="step-item ${isInConsultation ? 'active completed' : ''}">
              <div class="step-circle">4</div>
              <div class="step-label">Exam</div>
            </div>
          </div>

          <!-- Doctor Card -->
          ${visit.assignedDoctor ? `
            <div class="doctor-card">
              <div class="doctor-avatar-circle">
                ${visit.assignedDoctor.avatar || '👩‍⚕️'}
              </div>
              <div class="doctor-info-box">
                <div class="doctor-name">
                  <span>${visit.assignedDoctor.name}</span>
                  <span class="verified-badge" title="Verified Medical Practitioner">✓ Verified</span>
                </div>
                <div class="doctor-role">${visit.assignedDoctor.roleTitle} (${visit.assignedDoctor.rating} ★)</div>
                <div class="doctor-vehicle">
                  🏍️ ${visit.assignedDoctor.vehicle} • ${visit.assignedDoctor.vehicleNumber}
                </div>
              </div>
              <button class="call-doctor-btn" onclick="window.PatientView.callDoctor('${visit.assignedDoctor.phone}')" title="Call Doctor">
                📞
              </button>
            </div>
          ` : `
            <div style="background: #f8fafc; border: 2px dashed #94a3b8; border-radius: 12px; padding: 16px; text-align: center;">
              <div style="font-weight: 700; color: #0f172a; margin-bottom: 4px;">
                ${visit.broadcastMode ? '🚨 Emergency Broadcast Sent to All Nearby Doctors' : '🔍 Pinging Rank #1 Doctor...'}
              </div>
              <div style="font-size: 12px; color: #64748b;">
                ${visit.broadcastMode ? 'First available health worker will confirm in seconds' : 'Auto-forwarding in 35 seconds if no response'}
              </div>
            </div>
          `}

          <!-- Symptoms & Visit Info -->
          <div style="background: #f1f5f9; padding: 12px; border-radius: 10px; font-size: 13px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748b;">Reason for visit:</span>
              <strong style="color: #0f172a;">${visit.symptomCategory}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748b;">Urgency:</span>
              <span style="font-weight: 700; color: ${visit.isUrgent ? '#dc2626' : '#059669'};">
                ${visit.urgency.toUpperCase()}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">Consultation Fee:</span>
              <span style="font-weight: 700; color: #059669;">FREE (National Rural Health Mission)</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 8px; margin-top: auto;">
            <button class="btn-large btn-secondary" style="flex: 1; min-height: 44px; font-size: 13px;"
                    onclick="window.PatientView.cancelVisit('${visit.id}')">
              Cancel Request
            </button>
            ${isEnRoute ? `
              <button class="btn-large btn-primary" style="flex: 1; min-height: 44px; font-size: 13px; background: #0284c7;"
                      onclick="window.AppState.fastForwardVisit('${visit.id}')" title="Skip simulated travel time">
                ⚡ Fast-Forward
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },

  renderRecordsTab(patient) {
    const t = key => window.RURAL_I18N.t(key);

    return `
      <div class="records-container">
        <!-- ABHA Unified Patient Card -->
        <div class="abha-card">
          <div class="abha-header">
            <div>
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8;">Ayushman Bharat Digital Mission</div>
              <strong style="font-size: 16px;">ABHA Health ID Card</strong>
            </div>
            <div style="font-size: 24px;">🇮🇳</div>
          </div>
          <div class="abha-number">${patient.abhaId}</div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-top: 8px;">
            <div>Name: <strong>${patient.name}</strong></div>
            <div>Gender/Age: <strong>${patient.gender}/${patient.age}</strong></div>
            <div>Blood: <strong>${patient.bloodGroup}</strong></div>
          </div>
        </div>

        <!-- High Risk Flag if any -->
        ${patient.highRisk ? `
          <div class="high-risk-alert-card">
            <span style="font-size: 24px;">⚠️</span>
            <div>
              <strong>HIGH-RISK PATIENT FLAG</strong>
              <div style="font-size: 12px; margin-top: 2px;">${patient.highRiskNote || 'Requires frequent rural health monitoring'}</div>
            </div>
          </div>
        ` : ''}

        <!-- Chronic Conditions & Allergies -->
        <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 12px; padding: 14px;">
          <div style="font-size: 12px; font-weight: 800; color: #475569; margin-bottom: 6px;">KNOWN CONDITIONS & ALLERGIES</div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${(patient.chronicConditions || []).map(c => `
              <span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;">
                🩺 ${c}
              </span>
            `).join('')}
            ${(patient.allergies || []).map(a => `
              <span style="background: #fee2e2; color: #991b1b; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;">
                ⚠️ Allergy: ${a}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Prescription History Timeline -->
        <div>
          <div class="section-label">PAST VISITS & DIGITAL PRESCRIPTIONS</div>
          ${(patient.history || []).length === 0 ? `
            <div style="text-align: center; padding: 20px; color: #64748b; font-size: 13px;">
              No prior prescriptions recorded yet.
            </div>
          ` : (patient.history || []).map(item => `
            <div class="timeline-item">
              <div class="timeline-date">
                <span>📅 ${item.date} ${item.time || ''}</span>
                <span>👨‍⚕️ ${item.doctorName}</span>
              </div>
              <div class="diagnosis-title">${item.diagnosis}</div>
              <div style="font-size: 12px; color: #475569; margin-bottom: 8px;">
                Symptoms: ${item.symptoms}
              </div>

              <!-- Visual Dosage Schedule (Optimized for Low Literacy) -->
              <div class="rx-pill-grid">
                ${(item.prescriptions || item.medicines || []).map(med => `
                  <div class="rx-pill-item">
                    <div>
                      <strong style="font-size: 13px; color: #0f172a;">${med.medicine || med.name}</strong>
                      <div style="font-size: 11px; color: #64748b;">${med.dosage || med.dose} • ${med.days || ''}</div>
                    </div>
                    <div class="timing-tags">
                      ${med.timing && med.timing.includes('1-') ? `<span class="timing-tag morning">☀️ ${t('medicineMorning')}</span>` : ''}
                      ${med.timing && med.timing.includes('-1-') ? `<span class="timing-tag afternoon">🌤️ ${t('medicineAfternoon')}</span>` : ''}
                      ${med.timing && med.timing.endsWith('-1') ? `<span class="timing-tag night">🌙 ${t('medicineNight')}</span>` : ''}
                      ${!med.timing ? `<span class="timing-tag morning">${med.frequency || 'Daily'}</span>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>

              ${item.followUp ? `
                <div style="background: #f0fdf4; border-left: 3px solid #059669; padding: 8px 10px; font-size: 12px; color: #166534; margin-top: 8px; border-radius: 4px;">
                  <strong>💡 ${t('followUpNote')}:</strong> ${item.followUp}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  selectSymptom(id) {
    this.selectedSymptom = id;
    this.render('patient-device-root');
  },

  selectUrgency(urgency) {
    this.selectedUrgency = urgency;
    this.render('patient-device-root');
  },

  toggleVoiceStub() {
    this.voiceInputActive = !this.voiceInputActive;
    if (this.voiceInputActive) {
      window.AudioEngine.playNotificationChime();
      this.selectedSymptom = 'fever';
      this.selectedUrgency = 'urgent';
    }
    this.render('patient-device-root');
  },

  setTab(tab) {
    window.AppState.patientActiveTab = tab;
    this.render('patient-device-root');
  },

  switchPatient(patientId) {
    window.AppState.currentPatientId = patientId;
    window.AppState.notify('patient_switched', patientId);
    this.render('patient-device-root');
  },

  async submitBooking() {
    const patient = window.AppState.patients.find(p => p.id === window.AppState.currentPatientId) || window.AppState.patients[0];
    const locSelect = document.getElementById('patient-village-select');
    const location = locSelect ? locSelect.value : patient.village;

    const symptomObj = this.symptoms.find(s => s.id === this.selectedSymptom) || this.symptoms[0];

    const payload = {
      patientId: patient.id,
      symptomCategory: window.RURAL_I18N.t(symptomObj.titleKey),
      symptomDescription: symptomObj.desc,
      urgency: this.selectedUrgency,
      location,
      voiceNoteUsed: this.voiceInputActive
    };

    window.AudioEngine.playNotificationChime();
    const result = await window.AppState.bookVisit(payload);

    if (result.success) {
      window.AppState.patientActiveTab = 'tracking';
      this.render('patient-device-root');
      window.App.showToast(`Request sent! Pinging nearest health workers in ${location.split(' ')[0]}...`);
    } else {
      alert(result.error || 'Booking failed');
    }
  },

  async cancelVisit(visitId) {
    if (confirm('Cancel this health visit request?')) {
      await window.AppState.cancelVisit(visitId);
      window.AppState.patientActiveTab = 'book';
      this.render('patient-device-root');
      window.App.showToast('Visit request was cancelled.');
    }
  },

  callDoctor(phone) {
    window.AudioEngine.playNotificationChime();
    alert(`Connecting phone call to Doctor at ${phone} via Rural Health Toll-Free Gateway...`);
  }
};
