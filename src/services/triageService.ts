export type TriageUrgency = 'routine' | 'priority' | 'urgent' | 'emergency';

export interface TriageResult {
  urgency: TriageUrgency;
  urgencyLabel: string;
  badgeColor: string;
  symptomSummary: string[];
  riskIndicators: string[];
  recommendedCarePathway: string;
  isEmergency: boolean;
  suggestedAction: 'sos' | 'doctor' | 'home_visit' | 'routine';
  disclaimer: string;
}

export function evaluateSymptomTriage(
  selectedSymptoms: string[],
  additionalNotes: string = '',
  patientAge: number = 40
): TriageResult {
  const lowerSymptoms = selectedSymptoms.map((s) => s.toLowerCase());
  const lowerNotes = additionalNotes.toLowerCase();

  const isChestPain = lowerSymptoms.some((s) => s.includes('chest pain') || s.includes('chest tightness')) || lowerNotes.includes('chest pain');
  const isBreathingSevere = lowerSymptoms.some((s) => s.includes('breathing difficulty') || s.includes('shortness of breath')) || lowerNotes.includes('breath');
  const isSuddenNumbness = lowerSymptoms.some((s) => s.includes('numbness') || s.includes('paralysis') || s.includes('slurred speech'));
  const isSevereBleeding = lowerSymptoms.some((s) => s.includes('bleeding') || s.includes('unconscious') || s.includes('seizure'));

  const isFever = lowerSymptoms.some((s) => s.includes('fever'));
  const isCough = lowerSymptoms.some((s) => s.includes('cough'));
  const isDizziness = lowerSymptoms.some((s) => s.includes('dizziness') || s.includes('headache'));
  const isStomach = lowerSymptoms.some((s) => s.includes('vomiting') || s.includes('diarrhea') || s.includes('stomach'));

  const disclaimer = 'AI-assisted recommendation — final clinical decision must be made by a qualified healthcare professional. RuralCare Connect does NOT provide autonomous diagnoses.';

  // Emergency Case 1: Cardiac / Respiratory red flags
  if ((isChestPain && isBreathingSevere) || isSuddenNumbness || isSevereBleeding) {
    return {
      urgency: 'emergency',
      urgencyLabel: '🔴 EMERGENCY (Immediate 108 EMS Required)',
      badgeColor: 'bg-red-600 text-white',
      symptomSummary: selectedSymptoms,
      riskIndicators: [
        'Acute cardiovascular/respiratory compromise risk',
        'Potential acute coronary syndrome or severe pulmonary distress',
        'Requires immediate Advanced Life Support (ALS) stabilization'
      ],
      recommendedCarePathway: 'Trigger 108 Emergency SOS immediately. Dispatch to nearest facility with Intensive Care / Cath Lab capability.',
      isEmergency: true,
      suggestedAction: 'sos',
      disclaimer
    };
  }

  // Urgent Case: Isolated chest pain OR severe breathing OR high fever with convulsions
  if (isChestPain || (isBreathingSevere && isFever)) {
    return {
      urgency: 'urgent',
      urgencyLabel: '🟠 URGENT (Priority Clinical Evaluation Within 1-2 Hours)',
      badgeColor: 'bg-amber-600 text-white',
      symptomSummary: selectedSymptoms,
      riskIndicators: [
        'Significant clinical symptom cluster',
        'Risk of rapid deterioration without medical supervision',
        'Escalated queue priority recommended at Primary Health Centre'
      ],
      recommendedCarePathway: 'Urgent consultation at nearest PHC/Rural Hospital or expedited doctor home visit.',
      isEmergency: false,
      suggestedAction: 'doctor',
      disclaimer
    };
  }

  // Priority Case: Moderate fever + cough OR vomiting + dizziness
  if ((isFever && isCough) || (isStomach && isDizziness) || patientAge > 65) {
    return {
      urgency: 'priority',
      urgencyLabel: '🟡 PRIORITY (Frontline Assessment Recommended Today)',
      badgeColor: 'bg-yellow-500 text-slate-900',
      symptomSummary: selectedSymptoms,
      riskIndicators: [
        'Infectious or acute presentation requiring diagnostic confirmation',
        'Hydration or fever management required to avoid complications',
        'Suitable for ASHA/ANM doorstep triage or teleconsultation'
      ],
      recommendedCarePathway: 'ASHA/ANM doorstep assessment or doctor teleconsultation with prescription dispatch.',
      isEmergency: false,
      suggestedAction: 'home_visit',
      disclaimer
    };
  }

  // Routine Case: Basic checkup, BP monitoring, mild symptoms
  return {
    urgency: 'routine',
    urgencyLabel: '🟢 ROUTINE (Scheduled Care / Preventive Follow-up)',
    badgeColor: 'bg-emerald-600 text-white',
    symptomSummary: selectedSymptoms.length > 0 ? selectedSymptoms : ['Routine Health Screening'],
    riskIndicators: [
      'Stable clinical profile with non-urgent presentation',
      'Eligible for routine outpatient appointment or local sub-centre visit'
    ],
    recommendedCarePathway: 'Scheduled appointment with PHC medical officer or routine sub-centre check-up.',
    isEmergency: false,
    suggestedAction: 'routine',
    disclaimer
  };
}
