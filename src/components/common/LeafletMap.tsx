import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export interface MapMarkerItem {
  id: string;
  lat: number;
  lng: number;
  title: string;
  type: 'patient' | 'doctor' | 'hospital' | 'phc' | 'ambulance' | 'emergency';
  subtitle?: string;
  badge?: string;
}

interface LeafletMapProps {
  center: [number, number];
  zoom?: number;
  markers?: MapMarkerItem[];
  polyline?: [number, number][];
  onLocationSelect?: (lat: number, lng: number) => void;
  interactive?: boolean;
  className?: string;
  height?: string;
}

// Custom SVG icon generator for zero external image asset dependencies
const createCustomIcon = (type: MapMarkerItem['type'], title: string) => {
  let bg = '#16a34a'; // green
  let svgIcon = '';

  if (type === 'patient') {
    bg = '#2563eb'; // blue
    svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
  } else if (type === 'doctor') {
    bg = '#059669'; // emerald
    svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 7v6"/><path d="M9 10h6"/></svg>`;
  } else if (type === 'hospital') {
    bg = '#dc2626'; // red
    svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>`;
  } else if (type === 'phc') {
    bg = '#0284c7'; // sky blue
    svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
  } else if (type === 'ambulance' || type === 'emergency') {
    bg = '#ea580c'; // amber/orange
    svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v7h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M9 10h3"/></svg>`;
  }

  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
        <div style="background-color: ${bg}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2.5px solid white; transform: translateY(-4px); transition: transform 0.2s ease;">
          ${svgIcon}
        </div>
        <div style="background: white; color: #1e293b; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.15); border: 1px solid #e2e8f0; white-space: nowrap; margin-top: 2px;">
          ${title}
        </div>
      </div>
    `,
    iconSize: [36, 56],
    iconAnchor: [18, 48],
    popupAnchor: [0, -48]
  });
};

export const LeafletMap: React.FC<LeafletMapProps> = ({
  center,
  zoom = 13,
  markers = [],
  polyline,
  onLocationSelect,
  interactive = true,
  className = '',
  height = '350px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const polylineLayerRef = useRef<L.Polyline | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: interactive
      });

      // Standard free OpenStreetMap tiles with no API key requirement
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | RuralCare GIS',
        maxZoom: 18
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      if (interactive && onLocationSelect) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          onLocationSelect(e.latlng.lat, e.latlng.lng);
        });
      }

      mapInstanceRef.current = map;

      // Ensure mobile and modal sizing updates properly without grey tile gaps
      setTimeout(() => {
        try {
          map.invalidateSize();
        } catch (e) {
          // ignore
        }
      }, 250);
    }

    return () => {
      // Keep map instance or clean up if needed
    };
  }, []);

  // Update center & zoom
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    }
  }, [center[0], center[1], zoom]);

  // Update Markers
  useEffect(() => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;

    markersLayerRef.current.clearLayers();

    markers.forEach((m) => {
      const icon = createCustomIcon(m.type, m.title);
      const marker = L.marker([m.lat, m.lng], { icon });

      let popupContent = `
        <div style="font-family: system-ui, sans-serif; min-width: 160px;">
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${m.title}</h4>
          ${m.subtitle ? `<p style="margin: 0; font-size: 12px; color: #475569;">${m.subtitle}</p>` : ''}
          ${m.badge ? `<span style="display: inline-block; margin-top: 6px; padding: 2px 8px; font-size: 10px; font-weight: 700; border-radius: 9999px; background: #dcfce7; color: #166534;">${m.badge}</span>` : ''}
        </div>
      `;

      marker.bindPopup(popupContent);
      markersLayerRef.current?.addLayer(marker);
    });
  }, [markers]);

  // Update Polyline
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (polylineLayerRef.current) {
      polylineLayerRef.current.remove();
      polylineLayerRef.current = null;
    }

    if (polyline && polyline.length > 1) {
      const line = L.polyline(polyline, {
        color: '#15803d', // Health green
        weight: 5,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(mapInstanceRef.current);

      polylineLayerRef.current = line;
      mapInstanceRef.current.fitBounds(line.getBounds(), { padding: [50, 50] });
    }
  }, [polyline]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, minHeight: '220px' }}
      className={`relative w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner ${className}`}
    />
  );
};
