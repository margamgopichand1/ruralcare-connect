import React, { useState, useEffect } from 'react';
import { getDistrictMetrics } from '../../services/analyticsService';
import { mockFacilities, mockDoctors, mockAmbulances } from '../../data/mockData';
import { LeafletMap, MapMarkerItem } from '../common/LeafletMap';
import {
  Building2,
  Users,
  Stethoscope,
  Ambulance,
  Clock,
  Share2,
  AlertTriangle,
  TrendingUp,
  Activity,
  MapPin,
  Filter,
  CheckCircle,
  ShieldCheck,
  Pill,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { DistrictMetrics } from '../../types';

export const GovernmentDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DistrictMetrics>(getDistrictMetrics());
  const [selectedDistrict, setSelectedDistrict] = useState('Pune');
  const [selectedTaluka, setSelectedTaluka] = useState('All');
  const [selectedFacilityType, setSelectedFacilityType] = useState('All');
  const [mapLayer, setMapLayer] = useState<'all' | 'doctors' | 'facilities' | 'gaps'>('all');

  useEffect(() => {
    setMetrics(getDistrictMetrics());
  }, []);

  // Filter facilities based on selection
  const filteredFacilities = mockFacilities.filter((f) => {
    const matchTaluka = selectedTaluka === 'All' || f.taluka.toLowerCase() === selectedTaluka.toLowerCase();
    const matchType = selectedFacilityType === 'All' || f.type.toLowerCase().includes(selectedFacilityType.toLowerCase());
    return matchTaluka && matchType;
  });

  // Prepare Map Markers
  const mapMarkers: MapMarkerItem[] = [];

  if (mapLayer === 'all' || mapLayer === 'facilities' || mapLayer === 'gaps') {
    filteredFacilities.forEach((f) => {
      mapMarkers.push({
        id: f.id,
        lat: f.lat,
        lng: f.lng,
        title: f.name,
        type: f.type === 'District Hospital' ? 'hospital' : 'phc',
        subtitle: `${f.taluka} • ${f.totalBeds} Beds • ${f.availableDoctors} Doctors`,
        badge: f.coverageStatus === 'critical_gap' ? 'COVERAGE GAP' : f.type
      });
    });
  }

  if (mapLayer === 'all' || mapLayer === 'doctors') {
    mockDoctors.forEach((d) => {
      if (d.isAvailable) {
        mapMarkers.push({
          id: d.id,
          lat: d.lat,
          lng: d.lng,
          title: d.name,
          type: 'doctor',
          subtitle: `${d.specialization} • ${d.serviceArea}`,
          badge: 'ACTIVE ON-DUTY'
        });
      }
    });
  }

  // Add sample active emergency incident in Shirur
  mapMarkers.push({
    id: 'active-sos-incident',
    lat: 18.8256,
    lng: 74.3721,
    title: 'Active 108 Emergency Call',
    type: 'emergency',
    subtitle: 'Karegaon Junction • Ambulance MH-12-RN-4421 Dispatched',
    badge: '108 ESCALATION'
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gov-dark via-slate-900 to-gov-dark rounded-3xl p-6 sm:p-8 text-white shadow-xl border-b-4 border-health-600">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-health-600 text-white font-bold uppercase tracking-wider">
                Govt of Maharashtra
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                Smart India Hackathon 2026 | PS 26133
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              District Healthcare Command Center
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time epidemiological monitoring, rural physician dispatch tracking, PHC medicine inventories, and 108 emergency escalation telemetry across Pune District.
            </p>
          </div>

          <div className="p-4 bg-white/10 rounded-2xl border border-white/15 text-xs space-y-1.5 self-start md:self-auto min-w-[220px]">
            <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              System Health & Synced Nodes
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>All 14 Talukas Online</span>
            </div>
            <div className="text-slate-300 text-[11px]">Last Gateway Sync: Just Now</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Filters:</span>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg font-semibold text-slate-800 bg-white"
            >
              <option value="Pune">Pune District</option>
              <option value="Satara">Satara District</option>
              <option value="Ahmednagar">Ahmednagar District</option>
              <option value="Nashik">Nashik District</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block">Taluka / Block</label>
            <select
              value={selectedTaluka}
              onChange={(e) => setSelectedTaluka(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg font-semibold text-slate-800 bg-white"
            >
              <option value="All">All Talukas</option>
              <option value="Shirur">Shirur</option>
              <option value="Junnar">Junnar</option>
              <option value="Khed">Khed</option>
              <option value="Ambegaon">Ambegaon</option>
              <option value="Baramati">Baramati</option>
              <option value="Daund">Daund</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block">Facility Tier</label>
            <select
              value={selectedFacilityType}
              onChange={(e) => setSelectedFacilityType(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg font-semibold text-slate-800 bg-white"
            >
              <option value="All">All Tiers (PHC, CHC, SDH)</option>
              <option value="PHC">Primary Health Centres (PHC)</option>
              <option value="CHC">Community Health Centres (CHC)</option>
              <option value="District Hospital">Sub-District & District Hospitals</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-bold text-slate-500">Map Layer:</span>
          {(['all', 'facilities', 'doctors', 'gaps'] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => setMapLayer(layer)}
              className={`px-2.5 py-1 rounded-lg font-bold capitalize transition ${
                mapLayer === layer
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>
      </div>

      {/* High-Level KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-bold">Total Patients</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.totalPatients}</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Across 14 Talukas</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-bold">Active Doctors</span>
            <Stethoscope className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{metrics.activeDoctors}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">On Doorstep Duty</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-bold">Visits Today</span>
            <Activity className="w-4 h-4 text-health-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.visitsToday}</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">+14% vs yesterday</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-bold">Emergency Cases</span>
            <Ambulance className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-600">{metrics.emergencyCases}</div>
          <div className="text-[10px] text-red-700 font-medium mt-0.5">108 Fleet active</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-bold">Avg Response</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-900">{metrics.averageResponseTimeMin}m</div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">Doorstep arrival</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-bold">Pending Referrals</span>
            <Share2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-900">{metrics.pendingReferrals}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">Specialist triage</div>
        </div>
      </div>

      {/* Critical Alert Cards Strip */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Intelligent System Alerts</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.criticalAlerts.map((alt) => (
            <div
              key={alt.id}
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                alt.severity === 'critical'
                  ? 'bg-red-50/70 border-red-200 text-red-950'
                  : 'bg-amber-50/70 border-amber-200 text-amber-950'
              }`}
            >
              <div
                className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  alt.severity === 'critical' ? 'bg-red-200 text-red-800' : 'bg-amber-200 text-amber-800'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs">{alt.title}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{alt.time}</span>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed">{alt.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* District GIS Map & Taluka Coverage Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* District GIS Map */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                District GIS Telemetry Map (Pune Rural)
              </h3>
              <p className="text-xs text-slate-500">
                Live pins for PHCs, hospitals, active physicians, and red zones.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              {mapMarkers.length} Nodes Displayed
            </span>
          </div>

          <LeafletMap
            center={[18.8280, 74.3750]}
            zoom={11}
            height="420px"
            markers={mapMarkers}
          />
        </div>

        {/* Coverage by Taluka & Doctor Utilization */}
        <div className="lg:col-span-5 space-y-6">
          {/* Taluka Coverage Progress */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Healthcare Coverage by Taluka
                </h3>
                <p className="text-xs text-slate-500">Doorstep physician coverage ratios</p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Avg 78%
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {metrics.talukaCoverage.map((tal) => (
                <div key={tal.taluka} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800">{tal.taluka}</span>
                    <span className="font-mono font-bold text-slate-700">
                      {tal.coveragePct}% ({tal.activeDoctors} Doctors)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        tal.coveragePct >= 80
                          ? 'bg-emerald-600'
                          : tal.coveragePct >= 65
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${tal.coveragePct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor Utilization Gauge */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Doctor Utilization Metric
              </span>
              <div className="text-3xl font-black text-slate-900 mt-0.5">
                {metrics.doctorUtilizationRate}%
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Active clinical hours vs idle standby time
              </p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center font-black text-emerald-700 text-sm bg-emerald-50">
              Optimal
            </div>
          </div>
        </div>
      </div>

      {/* Disease Outbreak Clusters & Hourly Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Epidemiological Outbreak Surveillance */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Disease Outbreak Surveillance
              </h3>
              <p className="text-xs text-slate-500">Doorstep symptom clusters tracked in real-time</p>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-bold">
              IDSP Linked
            </span>
          </div>

          <div className="space-y-3">
            {metrics.diseaseOutbreaks.map((outbreak, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-extrabold text-slate-900">{outbreak.disease}</h4>
                  <span className="text-slate-500 text-[11px]">
                    Hotspot Taluka: <strong>{outbreak.hotspotTaluka}</strong>
                  </span>
                </div>

                <div className="text-right">
                  <div className="font-black text-slate-900 text-sm">{outbreak.cases} Cases</div>
                  <span
                    className={`text-[10px] font-bold uppercase ${
                      outbreak.trend === 'increasing'
                        ? 'text-red-600'
                        : outbreak.trend === 'stable'
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {outbreak.trend} trend
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requests Hourly Trend Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Doorstep Visit Requests Volume (24h)
              </h3>
              <p className="text-xs text-slate-500">Hourly demand curves across rural centers</p>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2">
            {metrics.requestsTrend.map((item, idx) => {
              const maxReq = 30;
              const heightPct = (item.requests / maxReq) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="text-[10px] font-extrabold text-slate-700">{item.requests}</div>
                  <div
                    className="w-full bg-gradient-to-t from-health-700 to-emerald-500 rounded-t-lg transition-all duration-500"
                    style={{ height: `${heightPct}%` }}
                  />
                  <div className="text-[9px] font-mono text-slate-400 mt-1">{item.hour}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
