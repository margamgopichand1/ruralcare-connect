// village-map.js - Interactive SVG Rural Road & Village Map
// Visualizes village roads, canal, Primary Health Centre, Patient home, and moving Doctor vehicle

window.VillageMap = {
  // Village coordinates on 600x320 SVG canvas
  villages: [
    { name: 'Rampur PHC', x: 260, y: 140, type: 'phc', label: '🏥 Rampur PHC' },
    { name: 'Rampur Ward 3', x: 330, y: 190, type: 'village', label: '🏡 Ramesh Kumar' },
    { name: 'Devgarh', x: 450, y: 80, type: 'village', label: '🏡 Devgarh (Lakshmi Bai)' },
    { name: 'Shivpur', x: 140, y: 220, type: 'village', label: '🏡 Shivpur (Mohan Singh)' },
    { name: 'Balarampur', x: 420, y: 260, type: 'village', label: '🏘️ Balarampur' },
    { name: 'Kishanpur', x: 100, y: 70, type: 'village', label: '🏘️ Kishanpur' }
  ],

  // Convert GPS lat/lng to SVG x,y within our rural bounding box
  // Lat: 25.28 to 25.37, Lng: 82.93 to 83.01
  projectCoords(coords) {
    if (!coords) return { x: 300, y: 160 };
    const minLat = 25.28, maxLat = 25.37;
    const minLng = 82.93, maxLng = 83.01;

    const x = ((coords.lng - minLng) / (maxLng - minLng)) * 520 + 40;
    // Invert Y because latitude goes north (up) but SVG Y goes down
    const y = ((maxLat - coords.lat) / (maxLat - minLat)) * 260 + 30;
    return {
      x: Math.max(30, Math.min(570, x)),
      y: Math.max(25, Math.min(295, y))
    };
  },

  renderTrackingMap(visit, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const docCoords = visit.assignedDoctor ? visit.assignedDoctor.coords : { lat: 25.3200, lng: 82.9750 };
    const patientCoords = visit.patientCoords || { lat: 25.3280, lng: 82.9810 };

    const docPos = this.projectCoords(docCoords);
    const patPos = this.projectCoords(patientCoords);

    // Dynamic vehicle icon
    let vehicleIcon = '🏍️';
    if (visit.assignedDoctor && visit.assignedDoctor.vehicle) {
      if (visit.assignedDoctor.vehicle.includes('Scooty')) vehicleIcon = '🛵';
      if (visit.assignedDoctor.vehicle.includes('Van')) vehicleIcon = '🚐';
    }

    const svg = `
      <svg class="interactive-map-svg" viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ecfdf5" />
            <stop offset="100%" stop-color="#d1fae5" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="3" stdDeviation="3" flood-opacity="0.3" />
          </filter>
        </defs>

        <!-- Rural Terrain & Crop Fields -->
        <rect width="600" height="320" fill="url(#grassGrad)" />
        <path d="M-10,40 Q150,120 280,30 T580,90 L600,0 L0,0 Z" fill="#e2e8f0" opacity="0.3" />
        <path d="M0,240 Q180,200 340,280 T600,220 L600,320 L0,320 Z" fill="#dcfce7" opacity="0.6" />

        <!-- Irrigation Canal (Waterway) -->
        <path d="M50,-10 C120,80 180,180 240,230 S420,280 580,330" fill="none" stroke="#60a5fa" stroke-width="10" opacity="0.75" />
        <text x="75" y="45" fill="#2563eb" font-size="10" font-weight="700" transform="rotate(35 75,45)">💧 Rampur Canal</text>

        <!-- Paved Rural Roads Network -->
        <!-- Road 1: West-East Arterial Road -->
        <path d="M30,80 Q180,110 320,130 T560,110" fill="none" stroke="#94a3b8" stroke-width="12" stroke-linecap="round" />
        <path d="M30,80 Q180,110 320,130 T560,110" fill="none" stroke="#f1f5f9" stroke-width="3" stroke-dasharray="8,6" />

        <!-- Road 2: North-South Village Link -->
        <path d="M260,140 Q280,200 330,230 T440,280" fill="none" stroke="#94a3b8" stroke-width="10" stroke-linecap="round" />
        <path d="M260,140 Q280,200 330,230 T440,280" fill="none" stroke="#f1f5f9" stroke-width="2" stroke-dasharray="6,6" />

        <!-- Road 3: Shivpur Link -->
        <path d="M140,220 Q200,180 260,140" fill="none" stroke="#94a3b8" stroke-width="8" stroke-linecap="round" />

        <!-- Dynamic Doctor Route Line to Patient -->
        <line x1="${docPos.x}" y1="${docPos.y}" x2="${patPos.x}" y2="${patPos.y}" 
              stroke="#059669" stroke-width="4" stroke-dasharray="6,4" opacity="0.85">
          <animate attributeName="stroke-dashoffset" from="40" to="0" dur="0.4s" repeatCount="indefinite" />
        </line>

        <!-- Village Landmarks -->
        <!-- PHC Hub -->
        <g transform="translate(260, 140)">
          <circle r="18" fill="#ffffff" stroke="#ef4444" stroke-width="3" filter="url(#shadow)" />
          <text text-anchor="middle" dy="5" font-size="14">🏥</text>
          <text y="30" text-anchor="middle" font-size="10" font-weight="800" fill="#1e293b">PHC Rampur</text>
        </g>

        <!-- Other Villages -->
        <g transform="translate(450, 80)">
          <circle r="10" fill="#ffffff" stroke="#64748b" stroke-width="2" />
          <text text-anchor="middle" dy="4" font-size="10">🏡</text>
          <text y="20" text-anchor="middle" font-size="9" font-weight="700" fill="#334155">Devgarh</text>
        </g>

        <g transform="translate(140, 220)">
          <circle r="10" fill="#ffffff" stroke="#64748b" stroke-width="2" />
          <text text-anchor="middle" dy="4" font-size="10">🏡</text>
          <text y="20" text-anchor="middle" font-size="9" font-weight="700" fill="#334155">Shivpur</text>
        </g>

        <!-- Patient House Pin with Pulsing Beacon -->
        <g transform="translate(${patPos.x}, ${patPos.y})">
          <circle r="22" fill="#ef4444" opacity="0.2">
            <animate attributeName="r" values="14;28;14" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0;0.3" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <circle r="15" fill="#ef4444" stroke="#ffffff" stroke-width="3" filter="url(#shadow)" />
          <text text-anchor="middle" dy="5" font-size="12">📍</text>
          <rect x="-60" y="-34" width="120" height="20" rx="4" fill="#0f172a" opacity="0.9" />
          <text x="0" y="-20" text-anchor="middle" font-size="10" font-weight="800" fill="#ffffff">
            ${visit.patientName || 'Patient'}
          </text>
        </g>

        <!-- Moving Doctor / Health Worker Vehicle Marker (with 60fps smooth CSS translation) -->
        <g transform="translate(${docPos.x}, ${docPos.y})" style="transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);">
          <circle r="24" fill="#10b981" opacity="0.25">
            <animate attributeName="r" values="18;32;18" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle r="18" fill="#ffffff" stroke="#059669" stroke-width="3" filter="url(#shadow)" />
          <text text-anchor="middle" dy="5" font-size="16">${vehicleIcon}</text>
          <rect x="-70" y="24" width="140" height="22" rx="6" fill="#059669" filter="url(#shadow)" />
          <text x="0" y="39" text-anchor="middle" font-size="11" font-weight="800" fill="#ffffff">
            ${visit.assignedDoctor ? visit.assignedDoctor.name.split(' ')[1] : 'Doctor'} • ${visit.etaMinutes || 5}m
          </text>
        </g>
      </svg>
    `;

    container.innerHTML = svg;
  },

  renderClusterMap(patients, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let pinsSvg = '';
    let polylinePoints = [];

    patients.forEach((p, idx) => {
      const pos = this.projectCoords(p.coords);
      polylinePoints.push(`${pos.x},${pos.y}`);

      const isUrgent = p.urgency === 'urgent';
      const pinColor = isUrgent ? '#dc2626' : '#059669';

      pinsSvg += `
        <g transform="translate(${pos.x}, ${pos.y})">
          <circle r="16" fill="${pinColor}" stroke="#ffffff" stroke-width="3" filter="url(#shadow)" />
          <text text-anchor="middle" dy="5" font-size="11" font-weight="900" fill="#ffffff">${idx + 1}</text>
          <rect x="-55" y="-30" width="110" height="18" rx="4" fill="#1e293b" opacity="0.9" />
          <text x="0" y="-18" text-anchor="middle" font-size="9" font-weight="700" fill="#ffffff">
            ${p.name} (${p.urgency.toUpperCase()})
          </text>
        </g>
      `;
    });

    const svg = `
      <svg class="interactive-map-svg" viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.3" />
          </filter>
        </defs>

        <!-- Base Background -->
        <rect width="600" height="320" fill="#f1f5f9" />
        
        <!-- Canal -->
        <path d="M50,-10 C120,80 180,180 240,230 S420,280 580,330" fill="none" stroke="#93c5fd" stroke-width="8" opacity="0.8" />
        
        <!-- Batch Circuit Route Sequence -->
        <polyline points="${polylinePoints.join(' ')}" fill="none" stroke="#0284c7" stroke-width="3" stroke-dasharray="6,4" />

        <!-- Rampur PHC Starting Point -->
        <g transform="translate(260, 140)">
          <circle r="14" fill="#ffffff" stroke="#ef4444" stroke-width="2" />
          <text text-anchor="middle" dy="4" font-size="12">🏥</text>
          <text y="24" text-anchor="middle" font-size="9" font-weight="800" fill="#1e293b">Start: PHC Rampur</text>
        </g>

        <!-- Cluster Pins -->
        ${pinsSvg}
      </svg>
    `;

    container.innerHTML = svg;
  }
};
