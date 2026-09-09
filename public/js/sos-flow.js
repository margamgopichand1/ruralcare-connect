// sos-flow.js - Emergency 108 Rural Ambulance Dispatch Modal & Handlers

window.SosFlow = {
  activeSos: null,

  async openSosModal(patientId) {
    const patient = window.AppState.patients.find(p => p.id === patientId) || window.AppState.patients[0];

    // Trigger synthetic emergency ambulance siren
    window.AudioEngine.playSiren(4);

    const payload = {
      patientId: patient.id,
      patientName: patient.name,
      location: `${patient.village} (GPS: ${patient.coords.lat}° N, ${patient.coords.lng}° E)`,
      coords: patient.coords,
      reason: 'Panic SOS Triggered by Patient'
    };

    const res = await window.AppState.triggerSos(payload);
    this.activeSos = res.data;

    this.renderModal();

    // Show toast notification
    window.App.showToast('🚨 Nearest Hospital & 108 Ambulance Dispatch Notified!');
  },

  renderModal() {
    let modalEl = document.getElementById('sos-modal-root');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'sos-modal-root';
      document.body.appendChild(modalEl);
    }

    const sos = this.activeSos;
    if (!sos) {
      modalEl.innerHTML = '';
      return;
    }

    modalEl.innerHTML = `
      <div class="modal-overlay">
        <div class="sos-modal">
          <div class="sos-modal-header">
            <span style="font-size: 26px;">🚨</span>
            <div>
              <div style="font-size: 18px; font-weight: 900;">108 EMERGENCY DISPATCH</div>
              <div style="font-size: 11px; opacity: 0.9;">National Rural Emergency Ambulance Service</div>
            </div>
          </div>

          <div class="sos-modal-body">
            <!-- Alert Banner -->
            <div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 12px; border-radius: 6px; color: #991b1b; font-size: 13px;">
              <strong>Connecting to Nearest 108 Ambulance...</strong><br>
              Emergency signal broadcast to Rampur Primary Health Centre and District Medical Control Room.
            </div>

            <!-- GPS Coordinates Captured -->
            <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; font-size: 12px;">
              <div style="font-weight: 800; color: #475569;">GPS COORDINATES CAPTURED:</div>
              <div style="font-family: monospace; font-size: 13px; font-weight: 700; color: #0f172a; margin: 4px 0;">
                📍 ${sos.location}
              </div>
              <div style="color: #64748b;">Patient: <strong>${sos.patientName}</strong></div>
            </div>

            <!-- Ambulance ETA & Details -->
            <div style="background: #eff6ff; border: 1px solid #93c5fd; border-radius: 8px; padding: 14px; text-align: center;">
              <div style="font-size: 11px; font-weight: 800; color: #1e40af; text-transform: uppercase;">Simulated Ambulance ETA</div>
              <div style="font-size: 32px; font-weight: 900; color: #1d4ed8; margin: 4px 0;">
                ⏱️ ${sos.etaMinutes || 11} MINS
              </div>
              <div style="font-size: 12px; color: #1e3a8a; font-weight: 700;">
                🚑 ${sos.ambulanceUnit}
              </div>
              <div style="font-size: 11px; color: #3b82f6; margin-top: 2px;">
                Nearest Base: ${sos.nearestPhc}
              </div>
            </div>

            <!-- Toast summary -->
            <div style="font-size: 12px; color: #475569; text-align: center;">
              ✓ SMS alert with live location sent to registered village emergency contacts.
            </div>

            <div style="display: flex; gap: 10px;">
              <button class="btn-large btn-secondary" style="flex: 1; min-height: 46px; font-size: 14px;" 
                      onclick="window.SosFlow.closeModal()">
                Close Window
              </button>
              <button class="btn-large btn-urgent" style="flex: 1; min-height: 46px; font-size: 14px;" 
                      onclick="window.SosFlow.resolveSos('${sos.id}')">
                Mark Resolved
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  closeModal() {
    this.activeSos = null;
    this.renderModal();
  },

  async resolveSos(sosId) {
    await window.AppState.resolveSos(sosId);
    this.activeSos = null;
    this.renderModal();
    window.App.showToast('Emergency SOS marked as resolved.');
  }
};
