import React, { useState } from 'react';
import { searchMedicines } from '../../services/medicineService';
import { MedicineItem } from '../../types';
import {
  Search,
  Pill,
  Building2,
  MapPin,
  Phone,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Filter,
  Sparkles
} from 'lucide-react';

export const MedicineFinderView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const medicines = searchMedicines(searchQuery, selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
            <Pill className="w-3.5 h-3.5 text-emerald-300" />
            <span>Public Health Drug Inventory Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Real-Time Medicine Availability
          </h1>
          <p className="text-sm text-emerald-100 leading-relaxed">
            Check essential medicines and stock levels at nearby Primary Health Centres (PHCs), CHCs, and District Hospitals across Pune District.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by drug name (e.g. Paracetamol 500mg, Amoxicillin, ORS)..."
            className="w-full pl-11 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-health-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-bold border border-slate-300 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-health-500 w-full sm:w-auto"
          >
            <option value="all">All Drug Categories</option>
            <option value="Antipyretic">Antipyretic / Fever</option>
            <option value="Antibiotic">Antibiotics</option>
            <option value="Electrolytes">Electrolytes / ORS</option>
            <option value="Antihistamine">Antihistamine / Allergy</option>
            <option value="Antidiabetic">Antidiabetic / Diabetes</option>
            <option value="Antihypertensive">Antihypertensive / BP</option>
          </select>
        </div>
      </div>

      {/* Quick Search Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 font-bold">Quick search:</span>
        {['Paracetamol 500mg', 'ORS', 'Amoxicillin', 'Metformin', 'Cetirizine'].map((chip) => (
          <button
            key={chip}
            onClick={() => setSearchQuery(chip)}
            className="px-3 py-1 bg-slate-100 hover:bg-health-100 hover:text-health-800 text-slate-700 rounded-full font-semibold transition border border-slate-200"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Medicine Results */}
      <div className="space-y-6">
        {medicines.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <Pill className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No medicines found</h3>
            <p className="text-xs text-slate-500 mt-1">Try searching for generic names or adjusting filters.</p>
          </div>
        ) : (
          medicines.map((med) => (
            <div
              key={med.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">{med.name}</h3>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {med.dosageForm}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Generic: <strong>{med.genericName}</strong> • Category: {med.category}
                  </p>
                </div>
              </div>

              {/* Facility Stocks Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {med.stocks.map((stock, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
                      stock.status === 'in_stock'
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : stock.status === 'low_stock'
                        ? 'bg-amber-50/50 border-amber-200'
                        : 'bg-red-50/50 border-red-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {stock.facilityType}
                        </span>
                        {stock.status === 'in_stock' ? (
                          <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Available
                          </span>
                        ) : stock.status === 'low_stock' ? (
                          <span className="text-xs font-black text-amber-700 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Low Stock
                          </span>
                        ) : (
                          <span className="text-xs font-black text-red-700 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Out of Stock
                          </span>
                        )}
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-sm">{stock.facilityName}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{stock.distanceKm} km away</span>
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block">Current Stock</span>
                        <strong className="text-sm font-black text-slate-900">{stock.quantity} units</strong>
                      </div>
                      <a
                        href={`tel:${stock.contactPhone}`}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-200 font-bold text-[11px] flex items-center gap-1 transition"
                      >
                        <Phone className="w-3 h-3 text-health-600" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
