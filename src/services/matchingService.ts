import { Doctor, VisitCategory, VisitUrgency } from '../types';
import { mockDoctors, mockVisitRequests } from '../data/mockData';

// Haversine formula to compute distance in kilometers
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return parseFloat(d.toFixed(1));
}

// Estimate arrival time based on distance (averaging 25-30 km/h on rural roads + 3 min dispatch delay)
export function estimateEtaMinutes(distanceKm: number): number {
  const travelMinutes = Math.round((distanceKm / 28) * 60);
  return Math.max(4, travelMinutes + 3);
}

export interface MatchedDoctorCandidate {
  doctor: Doctor;
  distanceKm: number;
  etaMinutes: number;
  matchScore: number;
  specialtyMatch: boolean;
  continuityOfCare: boolean;
}

export function findMatchingDoctors(
  patientLat: number,
  patientLng: number,
  category: VisitCategory,
  urgency: VisitUrgency,
  patientId: string,
  allDoctors: Doctor[] = mockDoctors
): MatchedDoctorCandidate[] {
  // Check previous visits for continuity of care
  const previousDoctorIds = new Set(
    mockVisitRequests
      .filter((v) => v.patientId === patientId && v.doctorId)
      .map((v) => v.doctorId)
  );

  const candidates: MatchedDoctorCandidate[] = [];

  for (const doc of allDoctors) {
    // Must be verified and available
    if (!doc.isVerified || !doc.isAvailable) {
      continue;
    }

    const distance = calculateHaversineDistance(
      patientLat,
      patientLng,
      doc.lat,
      doc.lng
    );

    // Filter radius: 35km maximum for rural doorstep visit
    if (distance > 35) {
      continue;
    }

    let specialtyMatch = false;
    const specLower = doc.specialization.toLowerCase();

    // Specialty matching logic
    if (
      category === 'fever' ||
      category === 'general' ||
      category === 'cold_cough'
    ) {
      specialtyMatch =
        specLower.includes('physician') ||
        specLower.includes('general') ||
        specLower.includes('medicine') ||
        specLower.includes('integrative');
    } else if (category === 'child_health') {
      specialtyMatch =
        specLower.includes('pediatric') || specLower.includes('child');
    } else if (category === 'womens_health') {
      specialtyMatch =
        specLower.includes('women') ||
        specLower.includes('gynec') ||
        specLower.includes('obstetric');
    } else if (category === 'elderly_care') {
      specialtyMatch =
        specLower.includes('physician') ||
        specLower.includes('medicine') ||
        specLower.includes('diabetologist');
    } else if (category === 'skin') {
      specialtyMatch =
        specLower.includes('skin') ||
        specLower.includes('physician') ||
        specLower.includes('integrative');
    } else {
      specialtyMatch = true;
    }

    const continuityOfCare = previousDoctorIds.has(doc.id);

    // Scoring calculation:
    // Distance penalty: -3 points per km
    // Base score: 100
    // Specialty match bonus: +30
    // Rating bonus: rating * 4 (e.g. 4.8 * 4 = 19.2)
    // Continuity of care bonus: +15
    // Urgency adjustment: if urgent, distance weight is doubled
    const distancePenalty =
      urgency === 'urgent' || urgency === 'emergency'
        ? distance * 5
        : distance * 3;

    let score = 100 - distancePenalty;
    if (specialtyMatch) score += 30;
    score += doc.rating * 4;
    if (continuityOfCare) score += 15;

    candidates.push({
      doctor: doc,
      distanceKm: distance,
      etaMinutes: estimateEtaMinutes(distance),
      matchScore: Math.round(score),
      specialtyMatch,
      continuityOfCare
    });
  }

  // Sort descending by matchScore
  candidates.sort((a, b) => b.matchScore - a.matchScore);

  return candidates;
}
