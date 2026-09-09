// admin-view.js - Government & Block Medical Officer (BMO) Health Dashboard

window.AdminView = {
  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const analytics = window.AppState.analytics || {};
    const gaps = analytics.coverageGaps || [];
    const trends = analytics.diseaseTrends || [];
    const utilization = analytics.doctorUtilization || [];
    const sosAlerts = window.AppState.sosAlerts || [];

    container.innerHTML = `
      <div class="gov-dashboard">
        <!-- Dashboard Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #334155; padding-bottom: 16px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 24px;">🏛️</span>
              <h2 style="font-size: 22px; font-weight: 900; color: #ffffff;">
                National Rural Health Mission • Block Monitoring System
              </h2>
            </div>
            <div style="font-size: 13px; color: #94a3b8; margin-top: 4px;">
              📍 <strong>${analytics.blockName || 'Chiraigaon Rural Block'}</strong> • Total Population: 1,48,500
            </div>
          </div>
          <div style="text-align: right;">
            <span class="brand-badge" style="background: #0284c7;">LIVE BMO TELEMETRY</span>
            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Synced via National Informatics Centre (NIC)</div>
          </div>
        </div>

        <!-- High Level KPIs Grid -->
        <div class="gov-stats-grid">
          <div class="gov-stat-card">
            <span class="stat-label">DISPATCHES TODAY</span>
            <div class="stat-value" style="color: #38bdf8;">${analytics.dispatchesToday || 47}</div>
            <span style="font-size: 12px; color: #10b981;">↑ 18% higher than 7-day average</span>
          </div>

          <div class="gov-stat-card">
            <span class="stat-label">AVG RESPONSE TIME</span>
            <div class="stat-value" style="color: #10b981;">${analytics.averageResponseTimeMinutes || 19.4}m</div>
            <span style="font-size: 12px; color: #94a3b8;">Target: &lt; ${analytics.targetResponseTimeMinutes || 25} mins</span>
          </div>

          <div class="gov-stat-card">
            <span class="stat-label">ACTIVE HEALTH WORKERS</span>
            <div class="stat-value" style="color: #facc15;">${analytics.activeHealthWorkers || 32}</div>
            <span style="font-size: 12px; color: #94a3b8;">Doctors, ANMs & ASHAs on duty</span>
          </div>

          <div class="gov-stat-card">
            <span class="stat-label">CRITICAL COVERAGE GAPS</span>
            <div class="stat-value" style="color: #f87171;">${analytics.underservedVillages || 4}</div>
            <span style="font-size: 12px; color: #f87171;">Villages requiring mobile unit support</span>
          </div>
        </div>

        <!-- Two Column Panels: Coverage Gaps & Disease Outbreak Trends -->
        <div class="gov-grid-2col">
          <!-- Coverage Gaps Table -->
          <div class="gov-panel">
            <div class="gov-panel-title">
              <span>📍 Village Coverage Gaps & Underserved Zones</span>
              <span style="font-size: 12px; color: #94a3b8;">Radius Analysis</span>
            </div>
            <div style="overflow-x: auto;">
              <table class="gov-table">
                <thead>
                  <tr>
                    <th>Village Hamlet</th>
                    <th>Dist to PHC</th>
                    <th>Pending Visits</th>
                    <th>Status</th>
                    <th>Action / Assigned</th>
                  </tr>
                </thead>
                <tbody>
                  ${gaps.map(g => `
                    <tr>
                      <td><strong>${g.village}</strong></td>
                      <td>${g.distanceToPHC}</td>
                      <td><span style="font-weight: 800; color: #facc15;">${g.pendingVisits}</span></td>
                      <td>
                        <span class="badge-status ${g.status.includes('Critical') ? 'critical' : g.status.includes('High') ? 'warning' : 'good'}">
                          ${g.status}
                        </span>
                      </td>
                      <td style="font-size: 11px; color: #cbd5e1;">${g.healthWorkerAssigned}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Disease Trend Chart Bars -->
          <div class="gov-panel">
            <div class="gov-panel-title">
              <span>📈 Disease Outbreak Surveillance (Weekly Trends)</span>
              <span style="font-size: 12px; color: #38bdf8;">Epidemic Alert</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${trends.map(t => {
                const isHigh = t.riskLevel.includes('High');
                const barColor = isHigh ? '#ef4444' : t.riskLevel.includes('Attention') ? '#f59e0b' : '#10b981';
                const percentage = Math.min(100, Math.round((t.weekCases / 100) * 100));

                return `
                  <div>
                    <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
                      <strong style="color: #f1f5f9;">${t.disease}</strong>
                      <span style="color: ${barColor}; font-weight: 800;">${t.weekCases} cases (${t.trend})</span>
                    </div>
                    <div style="height: 10px; background: #334155; border-radius: 5px; overflow: hidden;">
                      <div style="height: 100%; width: ${percentage}%; background: ${barColor}; border-radius: 5px;"></div>
                    </div>
                    <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">
                      Alert Status: <span style="color: ${barColor}; font-weight: 700;">${t.riskLevel}</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Doctor Utilization & Active Emergency Feeds -->
        <div class="gov-grid-2col">
          <!-- Doctor Utilization Table -->
          <div class="gov-panel">
            <div class="gov-panel-title">
              <span>🩺 Health Worker & Doctor Utilization</span>
              <span style="font-size: 12px; color: #10b981;">Duty Logs</span>
            </div>
            <table class="gov-table">
              <thead>
                <tr>
                  <th>Health Worker</th>
                  <th>Role</th>
                  <th>Hours on Duty</th>
                  <th>Visits Today</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                ${utilization.map(u => `
                  <tr>
                    <td><strong>${u.name}</strong></td>
                    <td style="color: #94a3b8;">${u.role}</td>
                    <td>${u.hoursOnDuty}</td>
                    <td><strong style="color: #38bdf8;">${u.visitsToday}</strong></td>
                    <td style="color: #facc15;">⭐ ${u.satisfactionRating}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Live SOS Emergency Alerts Feed -->
          <div class="gov-panel">
            <div class="gov-panel-title">
              <span>🚨 Live SOS 108 Emergency Incident Log</span>
              <span style="font-size: 12px; color: #ef4444;">Ambulance Net</span>
            </div>
            ${sosAlerts.length === 0 ? `
              <div style="text-align: center; padding: 24px; color: #94a3b8; font-size: 13px;">
                No emergency SOS dispatches active. System normal.
              </div>
            ` : sosAlerts.map(s => `
              <div style="background: #0f172a; border-left: 4px solid #ef4444; border-radius: 6px; padding: 10px; margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; font-size: 12px;">
                  <strong style="color: #fca5a5;">${s.patientName} (${s.location.split(' ')[0]})</strong>
                  <span class="badge-status ${s.status === 'resolved' ? 'good' : 'critical'}">
                    ${s.status.toUpperCase()}
                  </span>
                </div>
                <div style="font-size: 11px; color: #cbd5e1; margin-top: 4px;">
                  Ambulance: ${s.ambulanceUnit} • ETA: ${s.etaMinutes} mins
                </div>
                <div style="font-size: 10px; color: #64748b; margin-top: 2px;">
                  Incident ID: ${s.id}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
};
