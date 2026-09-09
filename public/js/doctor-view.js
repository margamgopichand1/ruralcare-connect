// doctor-view.js - Doctor & Health Worker Portal UI & Interaction Handlers

window.DoctorView = {
  prescriptionMedicines: [],
  activePrescriptionTab: 'form',

  quickMeds: [
    { name: 'Paracetamol 500mg', dosage: '1 tablet 3 times a day', timing: '1-1-1', days: '3 days' },
    { name: 'Oral Rehydration Salts (ORS)', dosage: '1 sachet in 1L water', timing: 'Continuous', days: '2 days' },
    { name: 'Amoxicillin 500mg', dosage: '1 capsule after food', timing: '1-0-1', days: '5 days' },
    { name: 'Iron & Folic Acid (IFA)', dosage: '1 red tablet at night', timing: '0-0-1', days: '30 days' },
    { name: 'Metformin 500mg', dosage: '1 tablet with breakfast', timing: '1-0-0', days: '30 days' },
    { name: 'Cetirizine 10mg', dosage: '1 tablet at bedtime', timing: '0-0-1', days: '5 days' }
  ],

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const doctor = window.AppState.doctors.find(d => d.id === window.AppState.currentDoctorId) || window.AppState.doctors[0];
    const activeTab = window.AppState.doctorActiveTab;
    const activeVisit = window.AppState.activeVisit;

    container.innerHTML = `
      <!-- Doctor Phone Frame Header -->
      <div class="device-header">
        <div class="device-role-label">
          <span>🩺</span>
          <span data-i18n="doctorApp">Doctor / Health Worker App</span>
        </div>
        <div class="device-notch"></div>
        <div style="font-size: 11px; opacity: 0.8;">BMO Network • 98% 🔋</div>
      </div>

      <!-- Quick Switch Doctor Header & Online Status Toggle -->
      <div class="doctor-header-card">
        <div>
          <div style="font-size: 11px; color: #64748b; font-weight: 700;">SWITCH DOCTOR / ASHA</div>
          <select style="font-weight: 700; padding: 2px 6px; border-radius: 6px;" onchange="window.DoctorView.switchDoctor(this.value)">
            ${window.AppState.doctors.map(d => `
              <option value="${d.id}" ${d.id === doctor.id ? 'selected' : ''}>
                ${d.name} (${d.roleTitle.split(' ')[0]}) - ${d.verified ? '✓ Verified' : '⚠️ Pending'}
              </option>
            `).join('')}
          </select>
        </div>

        <!-- Online / Offline Availability Toggle -->
        <button class="status-toggle-pill ${doctor.online ? 'online' : 'offline'}" 
                onclick="window.DoctorView.toggleOnline('${doctor.id}')">
          <span style="font-size: 12px;">${doctor.online ? '🟢' : '⚪'}</span>
          <span>${doctor.online ? 'Online' : 'Offline'}</span>
        </button>
      </div>

      <!-- License Verification Banner if Unverified -->
      ${!doctor.verified ? `
        <div style="background: #fffbeb; border-bottom: 2px solid #f59e0b; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
          <div style="font-size: 12px; color: #92400e;">
            <strong>⚠️ License Verification Required</strong><br>
            Upload MCI / Ayush Council credentials to accept visits.
          </div>
          <button class="btn-primary" style="padding: 6px 12px; font-size: 12px; border-radius: 6px;" 
                  onclick="window.DoctorView.verifyLicense('${doctor.id}')">
            Verify Now
          </button>
        </div>
      ` : ''}

      <!-- Doctor Device Body (Scrollable) -->
      <div class="device-body" id="doctor-device-body">
        ${activeTab === 'incoming' ? this.renderIncomingTab(doctor, activeVisit) : ''}
        ${activeTab === 'cluster' ? this.renderClusterTab(doctor) : ''}
        ${activeTab === 'prescription' ? this.renderPrescriptionPad(doctor, activeVisit) : ''}
      </div>

      <!-- Bottom Doctor Navigation Bar -->
      <div class="device-footer">
        <button class="footer-nav-item ${activeTab === 'incoming' ? 'active' : ''}" onclick="window.DoctorView.setTab('incoming')">
          <span class="nav-icon">🚨</span>
          <span>Dispatches</span>
        </button>
        <button class="footer-nav-item ${activeTab === 'cluster' ? 'active' : ''}" onclick="window.DoctorView.setTab('cluster')">
          <span class="nav-icon">🗺️</span>
          <span>Cluster Route</span>
        </button>
        <button class="footer-nav-item ${activeTab === 'prescription' ? 'active' : ''}" onclick="window.DoctorView.setTab('prescription')">
          <span class="nav-icon">📝</span>
          <span>Rx Pad</span>
        </button>
      </div>
    `;

    if (activeTab === 'cluster') {
      window.VillageMap.renderClusterMap(window.AppState.clusterPatients, 'doctor-cluster-map');
    }
  },

  renderIncomingTab(doctor, activeVisit) {
    const t = key => window.RURAL_I18N.t(key);

    // Check if this doctor has an incoming ride request
    const hasIncomingRequest = activeVisit && 
      activeVisit.status === 'dispatching' && 
      (activeVisit.broadcastMode || activeVisit.currentCandidateDoctorId === doctor.id);

    // Check if this doctor accepted the visit and is active
    const isAssignedDoctor = activeVisit && 
      activeVisit.assignedDoctorId === doctor.id && 
      (activeVisit.status === 'en_route' || activeVisit.status === 'arrived' || activeVisit.status === 'in_consultation');

    return `
      <div style="padding: 14px; display: flex; flex-direction: column; gap: 14px;">
        <!-- Doctor Profile Card -->
        <div style="background: #ffffff; border-radius: 12px; padding: 14px; border: 1px solid var(--border); box-shadow: var(--shadow-sm);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="doctor-avatar-circle" style="font-size: 28px;">
              ${doctor.avatar}
            </div>
            <div>
              <strong style="font-size: 16px; color: #0f172a;">${doctor.name}</strong>
              <div style="font-size: 12px; color: #64748b;">${doctor.degree}</div>
              <div style="font-size: 12px; color: #059669; font-weight: 700;">
                ✓ ${doctor.licenseNumber || 'MCI Verified'} • ${doctor.completedVisits} visits completed
              </div>
            </div>
          </div>
          <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #475569; display: flex; justify-content: space-between;">
            <span>Vehicle: <strong>${doctor.vehicle}</strong></span>
            <span>Rating: <strong>⭐ ${doctor.rating} / 5.0</strong></span>
          </div>
        </div>

        <!-- Incoming Ride Request Card (Ride-Hailing Pulsing View) -->
        ${hasIncomingRequest ? `
          <div class="incoming-request-card ${activeVisit.isUrgent ? 'urgent' : ''}">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 12px; font-weight: 900; letter-spacing: 0.5px; color: ${activeVisit.isUrgent ? '#dc2626' : '#059669'};">
                ${activeVisit.isUrgent ? '🚨 URGENT CASE BROADCAST' : '🔔 INCOMING VISIT DISPATCH'}
              </span>
              <span style="font-size: 13px; font-weight: 800; background: #f1f5f9; padding: 2px 8px; border-radius: 4px;">
                ⏱️ 35s Auto-Forward
              </span>
            </div>

            <!-- Auto-forward countdown progress bar -->
            <div class="request-timer-bar">
              <div class="request-timer-fill"></div>
            </div>

            <div>
              <div style="font-size: 18px; font-weight: 900; color: #0f172a;">
                ${activeVisit.patientName} (${activeVisit.patientAge}y, ${activeVisit.patientGender})
              </div>
              <div style="font-size: 13px; color: #475569; margin-top: 2px;">
                📍 ${activeVisit.patientVillage}
              </div>
              <div style="display: inline-block; margin-top: 6px; background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 700;">
                🛣️ Distance: ~${activeVisit.distanceKm || 2.8} km • ~${activeVisit.etaMinutes || 10} min by bike
              </div>
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px;">
              <div style="font-size: 11px; font-weight: 800; color: #64748b;">PATIENT REPORTED SYMPTOMS:</div>
              <strong style="font-size: 14px; color: #0f172a;">${activeVisit.symptomCategory}</strong>
              <div style="font-size: 12px; color: #475569; margin-top: 2px;">
                "${activeVisit.symptomDescription}"
              </div>
            </div>

            <!-- Action Buttons: Accept / Decline -->
            <div class="doctor-actions-row">
              <button class="btn-large btn-secondary" style="min-height: 48px;" 
                      onclick="window.DoctorView.declineVisit('${activeVisit.id}', '${doctor.id}')">
                Pass
              </button>
              <button class="btn-large ${activeVisit.isUrgent ? 'btn-urgent' : 'btn-primary'}" style="min-height: 48px;" 
                      onclick="window.DoctorView.acceptVisit('${activeVisit.id}', '${doctor.id}')">
                Accept Visit
              </button>
            </div>
          </div>
        ` : ''}

        <!-- Active Visit Navigation Card if Accepted -->
        ${isAssignedDoctor ? `
          <div style="background: #ffffff; border: 2px solid var(--primary); border-radius: 12px; padding: 16px; box-shadow: var(--shadow-md);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 12px; font-weight: 800; color: var(--primary);">ACTIVE VISIT IN PROGRESS</span>
              <span class="badge-status good">${activeVisit.status.toUpperCase()}</span>
            </div>

            <h3 style="font-size: 17px; font-weight: 900; color: #0f172a;">
              Visiting: ${activeVisit.patientName} (${activeVisit.patientVillage.split(' ')[0]})
            </h3>
            <div style="font-size: 12px; color: #475569; margin-top: 2px;">
              Reason: ${activeVisit.symptomCategory}
            </div>

            <!-- Turn-by-Turn Rural Road Guidance Simulator -->
            <div style="background: #f0fdf4; border-left: 4px solid var(--primary); padding: 10px; border-radius: 6px; margin: 12px 0; font-size: 12px;">
              <strong>🧭 Rural Navigation Guidance:</strong><br>
              ${activeVisit.status === 'en_route' ? 
                `Follow Rampur canal embankment road for 1.8 km → Turn left after the primary school.` : 
                `You have reached ${activeVisit.patientName}'s house.`}
            </div>

            <div style="display: flex; gap: 8px; margin-bottom: 12px;">
              <button class="btn-large btn-secondary" style="flex: 1; min-height: 44px; font-size: 13px;"
                      onclick="window.PatientView.callDoctor('${activeVisit.patientPhone || '+91 98391 22345'}')">
                📞 Call Patient
              </button>

              ${activeVisit.status === 'en_route' ? `
                <button class="btn-large btn-primary" style="flex: 1; min-height: 44px; font-size: 13px;"
                        onclick="window.DoctorView.markArrived('${activeVisit.id}')">
                  📍 Arrived
                </button>
                <button class="btn-large btn-primary" style="flex: 1; min-height: 44px; font-size: 13px; background: #0284c7;"
                        onclick="window.AppState.fastForwardVisit('${activeVisit.id}')" title="Skip travel animation">
                  ⚡ Instant Arrive
                </button>
              ` : `
                <button class="btn-large btn-primary" style="flex: 1; min-height: 44px; font-size: 13px;"
                        onclick="window.DoctorView.openPrescriptionPad()">
                  📝 Open Rx Pad
                </button>
              `}
            </div>
          </div>
        ` : ''}

        <!-- When no active requests -->
        ${!hasIncomingRequest && !isAssignedDoctor ? `
          <div style="background: #ffffff; border-radius: 12px; padding: 28px 16px; text-align: center; border: 1px dashed var(--border);">
            <div style="font-size: 40px; margin-bottom: 8px;">📡</div>
            <h4 style="font-weight: 800; font-size: 15px; color: #0f172a;">Standing by for Rural Dispatches</h4>
            <p style="font-size: 12px; color: #64748b; margin-top: 4px;">
              You will receive an instant audio & visual alert when a patient books a home visit in your coverage zone.
            </p>
          </div>
        ` : ''}
      </div>
    `;
  },

  renderClusterTab(doctor) {
    const cluster = window.AppState.clusterPatients || [];

    return `
      <div style="padding: 14px; display: flex; flex-direction: column; gap: 14px;">
        <div style="background: #ffffff; border-radius: 12px; padding: 14px; border: 1px solid var(--border);">
          <h3 style="font-size: 16px; font-weight: 800; color: #0f172a;">Today's Village Cluster Route</h3>
          <p style="font-size: 12px; color: #64748b; margin-top: 2px;">
            Optimized batch route for Rampur North & Canal Hamlet (4 clustered visits).
          </p>
        </div>

        <!-- Cluster SVG Map -->
        <div style="height: 240px; background: #e2e8f0; border-radius: 12px; overflow: hidden; border: 1px solid var(--border);">
          <div id="doctor-cluster-map" style="width: 100%; height: 100%;"></div>
        </div>

        <!-- Cluster Patients Queue -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${cluster.map((p, idx) => `
            <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 10px; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 28px; height: 28px; border-radius: 50%; background: ${p.urgency === 'urgent' ? '#dc2626' : '#059669'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px;">
                  ${idx + 1}
                </div>
                <div>
                  <strong style="font-size: 14px; color: #0f172a;">${p.name}</strong>
                  <div style="font-size: 11px; color: #64748b;">📍 ${p.village} • ${p.symptom}</div>
                </div>
              </div>
              <span class="badge-status ${p.urgency === 'urgent' ? 'critical' : 'good'}">
                ${p.urgency.toUpperCase()}
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderPrescriptionPad(doctor, activeVisit) {
    if (this.prescriptionMedicines.length === 0) {
      this.prescriptionMedicines = [
        { medicine: 'Paracetamol 500mg', dosage: '1 tablet 3 times a day', timing: '1-1-1', days: '3 days' },
        { medicine: 'Oral Rehydration Salts (ORS)', dosage: '1 sachet in 1L clean water', timing: 'Continuous', days: '2 days' }
      ];
    }

    const patientName = activeVisit ? activeVisit.patientName : 'Ramesh Kumar';
    const patientAbha = activeVisit ? activeVisit.patientAbhaId : '91-4523-8871-9012';

    return `
      <div class="rx-pad">
        <div style="background: #f0fdf4; border-left: 4px solid var(--primary); padding: 12px; border-radius: 6px;">
          <div style="font-size: 11px; font-weight: 800; color: var(--primary);">DIGITAL PRESCRIPTION & ABHA SYNC</div>
          <div style="font-size: 15px; font-weight: 800; color: #0f172a; margin-top: 2px;">
            Patient: ${patientName}
          </div>
          <div style="font-size: 12px; color: #475569;">ABHA ID: <strong>${patientAbha}</strong></div>
        </div>

        <!-- Quick Medicine Suggestions Chips -->
        <div>
          <label style="font-size: 12px; font-weight: 800; color: #475569;">QUICK MEDICINE ADD (TAP TO INSERT):</label>
          <div class="quick-rx-chips">
            ${this.quickMeds.map(qm => `
              <span class="rx-chip" onclick="window.DoctorView.addQuickMed('${qm.name}', '${qm.dosage}', '${qm.timing}', '${qm.days}')">
                ➕ ${qm.name}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Selected Medicines List -->
        <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: 8px; padding: 10px;">
          <div style="font-size: 12px; font-weight: 800; color: #475569; margin-bottom: 6px;">PRESCRIBED MEDICATIONS:</div>
          ${this.prescriptionMedicines.length === 0 ? `
            <div style="font-size: 12px; color: #94a3b8; font-style: italic;">Tap pills above to add medications...</div>
          ` : this.prescriptionMedicines.map((m, idx) => `
            <div style="display: flex; justify-content: space-between; align-items: center; background: #ffffff; border: 1px solid #e2e8f0; padding: 6px 10px; border-radius: 6px; margin-bottom: 4px; font-size: 13px;">
              <div>
                <strong>${m.medicine}</strong> - ${m.dosage} (${m.days})
              </div>
              <button style="color: #dc2626; background: none; border: none; font-weight: bold; cursor: pointer;"
                      onclick="window.DoctorView.removeMed(${idx})">✕</button>
            </div>
          `).join('')}
        </div>

        <!-- Diagnosis & Notes -->
        <div class="rx-form-group">
          <label>Clinical Diagnosis:</label>
          <input type="text" id="rx-diagnosis-input" value="Viral Fever & Acute Dehydration" />
        </div>

        <div class="rx-form-group">
          <label>Follow-up & Dietary Advice (Low Literacy Friendly):</label>
          <textarea id="rx-followup-input" rows="2">Rest for 3 days. Drink boiled ORS water. Revisit Rampur PHC on Monday if temperature does not subside.</textarea>
        </div>

        <!-- Issue Prescription Button -->
        <button class="btn-large btn-primary" onclick="window.DoctorView.submitPrescription('${activeVisit ? activeVisit.id : 'visit-1'}')">
          <span>✍️</span>
          <span>Complete Visit & Issue Prescription</span>
        </button>
      </div>
    `;
  },

  setTab(tab) {
    window.AppState.doctorActiveTab = tab;
    this.render('doctor-device-root');
  },

  openPrescriptionPad() {
    window.AppState.doctorActiveTab = 'prescription';
    this.render('doctor-device-root');
  },

  switchDoctor(doctorId) {
    window.AppState.currentDoctorId = doctorId;
    window.AppState.notify('doctor_switched', doctorId);
    this.render('doctor-device-root');
  },

  async toggleOnline(doctorId) {
    await window.AppState.toggleDoctorOnline(doctorId);
    this.render('doctor-device-root');
  },

  async verifyLicense(doctorId) {
    const regNum = prompt('Enter State Medical Council / Ayush Registration #:', 'MCI-UP-2023-8891');
    if (regNum) {
      await window.AppState.verifyDoctorLicense(doctorId, regNum);
      this.render('doctor-device-root');
      window.App.showToast('Doctor credentials verified by State Medical Registry!');
    }
  },

  async acceptVisit(visitId, doctorId) {
    const doctor = window.AppState.doctors.find(d => d.id === doctorId);
    if (!doctor.verified) {
      alert('Verification required before accepting patient visits. Please verify credentials first.');
      return;
    }

    window.AudioEngine.playSuccess();
    const result = await window.AppState.acceptVisit(visitId, doctorId);
    if (result.success) {
      this.render('doctor-device-root');
      window.App.showToast('Visit accepted! Route navigation initialized.');
    }
  },

  async declineVisit(visitId, doctorId) {
    const result = await window.AppState.declineVisit(visitId, doctorId);
    if (result.success) {
      this.render('doctor-device-root');
      window.App.showToast('Visit passed. Auto-forwarding to next ranked doctor...');
    }
  },

  async markArrived(visitId) {
    await window.AppState.updateVisitStatus(visitId, 'arrived');
    this.render('doctor-device-root');
    window.App.showToast('Marked as Arrived at patient house.');
  },

  addQuickMed(name, dosage, timing, days) {
    this.prescriptionMedicines.push({ medicine: name, dosage, timing, days });
    this.render('doctor-device-root');
  },

  removeMed(index) {
    this.prescriptionMedicines.splice(index, 1);
    this.render('doctor-device-root');
  },

  async submitPrescription(visitId) {
    const diagInput = document.getElementById('rx-diagnosis-input');
    const followupInput = document.getElementById('rx-followup-input');

    if (this.prescriptionMedicines.length === 0) {
      this.addQuickMed('Paracetamol 500mg', '1 tablet 3 times a day', '1-1-1', '3 days');
      this.addQuickMed('Oral Rehydration Salts (ORS)', '1 sachet in 1L clean water', 'Continuous', '2 days');
    }

    const payload = {
      diagnosis: diagInput ? diagInput.value : 'Acute Illness',
      clinicalNotes: 'Patient advised complete bed rest and hydration.',
      medicines: this.prescriptionMedicines,
      followUp: followupInput ? followupInput.value : 'Visit PHC in 5 days if unresolved'
    };

    const result = await window.AppState.issuePrescription(visitId, payload);
    if (result.success) {
      this.prescriptionMedicines = [];
      window.AppState.doctorActiveTab = 'incoming';
      this.render('doctor-device-root');
      window.App.showToast('Prescription saved to patient\'s ABHA Digital Health Record!');
    }
  }
};
