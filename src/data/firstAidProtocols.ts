export type EmergencyCategoryKey =
  | 'cardiac'
  | 'breathing'
  | 'bleeding'
  | 'stroke'
  | 'burn'
  | 'trauma'
  | 'bite'
  | 'allergic'
  | 'other'
  | 'unknown';

export interface ProtocolStep {
  stepNumber: number;
  title: Record<'en' | 'te' | 'hi', string>;
  instruction: Record<'en' | 'te' | 'hi', string>;
  criticalWarning?: Record<'en' | 'te' | 'hi', string>;
  actionPrompt: Record<'en' | 'te' | 'hi', string>;
  voiceText: Record<'en' | 'te' | 'hi', string>;
}

export interface EmergencyProtocol {
  id: EmergencyCategoryKey;
  icon: string;
  name: Record<'en' | 'te' | 'hi', string>;
  shortDesc: Record<'en' | 'te' | 'hi', string>;
  recommendedFacilityCapability: string;
  triageQuestions: {
    question: Record<'en' | 'te' | 'hi', string>;
    options: { label: Record<'en' | 'te' | 'hi', string>; isUrgent?: boolean }[];
  }[];
  steps: ProtocolStep[];
  dangerSigns: Record<'en' | 'te' | 'hi', string[]>;
  disclaimer: Record<'en' | 'te' | 'hi', string>;
}

export const FIRST_AID_PROTOCOLS: Record<EmergencyCategoryKey, EmergencyProtocol> = {
  cardiac: {
    id: 'cardiac',
    icon: '❤️',
    name: {
      en: 'Person Collapsed / Cardiac Emergency',
      te: 'కుప్పకూలిన వ్యక్తి / గుండె అత్యవసర పరిస్థితి',
      hi: 'बेहोश व्यक्ति / संभावित दिल का दौरा'
    },
    shortDesc: {
      en: 'Severe crushing chest pain, collapse, or suspected cardiac arrest',
      te: 'తీవ్రమైన ఛాతీ నొప్పి, అపస్మారక స్థితి లేదా గుండె సమస్య',
      hi: 'छाती में तेज दर्द, पसीना आना या अचानक बेहोश होना'
    },
    recommendedFacilityCapability: 'Cath Lab / Cardiac ICU / Tele-ECG & Thrombolysis',
    triageQuestions: [
      {
        question: {
          en: 'Is the person conscious and responding?',
          te: 'వ్యక్తి స్పృహలో ఉన్నారా మరియు స్పందిస్తున్నారా?',
          hi: 'क्या व्यक्ति होश में है और प्रतिक्रिया दे रहा है?'
        },
        options: [
          { label: { en: 'Yes, conscious', te: 'అవును, స్పృహలో ఉన్నారు', hi: 'हाँ, होश में हैं' } },
          { label: { en: 'No, unconscious', te: 'లేదు, స్పృహ లేదు', hi: 'नहीं, बेहोश हैं' }, isUrgent: true },
          { label: { en: 'Not sure', te: 'ఖచ్చితంగా తెలియదు', hi: 'पक्का नहीं पता' }, isUrgent: true }
        ]
      },
      {
        question: {
          en: 'Is the person breathing normally?',
          te: 'వ్యక్తి సాధారణంగా శ్వాస తీసుకుంటున్నారా?',
          hi: 'क्या व्यक्ति सामान्य रूप से सांस ले रहा है?'
        },
        options: [
          { label: { en: 'Yes, breathing', te: 'అవును, శ్వాస తీసుకుంటున్నారు', hi: 'हाँ, सांस ले रहे हैं' } },
          { label: { en: 'No breathing / Gasping', te: 'శ్వాస లేదు / ఆయాసపడుతున్నారు', hi: 'सांस नहीं ले रहे / हांफ रहे हैं' }, isUrgent: true },
          { label: { en: 'Not sure', te: 'ఖచ్చితంగా తెలియదు', hi: 'पक्का नहीं पता' }, isUrgent: true }
        ]
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: {
          en: 'Ensure Safe Positioning',
          te: 'సురక్షితమైన భంగిమలో ఉంచండి',
          hi: 'सुरक्षित स्थिति में रखें'
        },
        instruction: {
          en: 'If conscious: Help them sit in a comfortable semi-upright position with knees bent. Loosen tight collar or belt. Do NOT let them walk or exert.',
          te: 'స్పృహలో ఉంటే: మోకాళ్లను వంచి కూర్చోబెట్టండి. గట్టి దుస్తులను వదులు చేయండి. వారిని నడవనివ్వవద్దు.',
          hi: 'यदि होश में हैं: उन्हें पीठ टेककर आराम से बैठाएं और घुटने मोड़ लें। तंग कपड़े ढीले करें। उन्हें चलने न दें।'
        },
        criticalWarning: {
          en: 'Do not allow the patient to exert, walk, or drink water while waiting.',
          te: 'రోగిని నడవనివ్వవద్దు లేదా నీరు త్రాగించవద్దు.',
          hi: 'मरीज को चलने न दें और न ही तुरंत पानी पिलाएं।'
        },
        actionPrompt: {
          en: "I have seated the patient comfortably",
          te: "నేను రోగిని సౌకర్యవంతంగా కూర్చోబెట్టాను",
          hi: "मैंने मरीज को आराम से बैठा दिया है"
        },
        voiceText: {
          en: 'Help the person sit comfortably with back supported. Loosen tight clothes. Do not let them walk.',
          te: 'రోగిని సౌకర్యవంతంగా కూర్చోబెట్టండి. గట్టి దుస్తులు వదులు చేయండి. నడవనివ్వకండి.',
          hi: 'मरीज को आराम से बैठाएं। कपड़े ढीले करें। उन्हें चलने बिल्कुल न दें।'
        }
      },
      {
        stepNumber: 2,
        title: {
          en: 'Check Consciousness & Airway',
          te: 'స్పృహ మరియు శ్వాసను పరీక్షించండి',
          hi: 'होश और सांस की जांच करें'
        },
        instruction: {
          en: 'Gently tap shoulders and shout: "Are you okay?". If completely unresponsive and NOT breathing normally, prepare immediately for Chest Compressions (CPR).',
          te: 'భుజాలను సున్నితంగా తట్టి పిలవండి. స్పందన లేకపోతే మరియు శ్వాస ఆడకపోతే, వెంటనే ఛాతీ ప్రథమ చికిత్స (CPR) ప్రారంభించండి.',
          hi: 'मरीज के कंधे थपथपाएं और आवाज दें। यदि कोई प्रतिक्रिया नहीं है और सांस नहीं चल रही है, तो सीपीआर (CPR) के लिए तैयार हों।'
        },
        criticalWarning: {
          en: 'If breathing is normal, do NOT do CPR. Keep them resting calmly.',
          te: 'సాధారణంగా శ్వాస తీసుకుంటుంటే CPR చేయవద్దు.',
          hi: 'यदि सांस सामान्य है तो सीपीआर न करें, शांत रखें।'
        },
        actionPrompt: {
          en: "Checked responsiveness",
          te: "స్పందనను పరిశీలించాను",
          hi: "प्रतिक्रिया की जांच कर ली है"
        },
        voiceText: {
          en: 'Check if person responds. If unresponsive and not breathing, chest compressions will be needed.',
          te: 'వ్యక్తి స్పందిస్తున్నారో లేదో చూడండి. స్పందన లేకపోతే ఛాతీని నొక్కాలి.',
          hi: 'जांचें कि मरीज बोल पा रहा है या नहीं। अगर बेहोश है तो सीपीआर जरूरी होगा।'
        }
      },
      {
        stepNumber: 3,
        title: {
          en: 'Hands-Only CPR (If Unresponsive & No Breathing)',
          te: 'చేతులతో CPR (స్పృహ లేనప్పుడు)',
          hi: 'छाती पर दबाव (सीपीआर)'
        },
        instruction: {
          en: 'Place the heel of one hand in the center of the chest. Interlock your other hand on top. Push hard and fast: 100 to 120 beats per minute. Push down at least 2 inches.',
          te: 'ఛాతీ మధ్యలో రెండు చేతులను ఒకదానిపై ఒకటి ఉంచి బలంగా, వేగంగా నొక్కండి (నిమిషానికి 100-120 సార్లు). ఛాతీ 2 అంగుళాలు లోపలికి వెళ్లేలా ఒత్తండి.',
          hi: 'छाती के बीच में दोनों हाथों को एक दूसरे के ऊपर रखें। 2 इंच गहरा और तेजी से दबाएं (प्रति मिनट 100 से 120 बार)।'
        },
        criticalWarning: {
          en: 'Do not stop compressions until the ambulance arrives or the person starts breathing.',
          te: 'అంబులెన్స్ వచ్చే వరకు లేదా శ్వాస ప్రారంభమయ్యే వరకు ఆపవద్దు.',
          hi: 'एम्बुलेंस आने तक या सांस लौटने तक दबाव देना बंद न करें।'
        },
        actionPrompt: {
          en: "Performing CPR / Bystander assisting",
          te: "CPR కొనసాగిస్తున్నాను",
          hi: "सीपीआर जारी है"
        },
        voiceText: {
          en: 'Push hard and fast in the center of the chest. Do not stop until ambulance arrives.',
          te: 'ఛాతీ మధ్యలో బలంగా మరియు వేగంగా ఒత్తండి. ఆపవద్దు.',
          hi: 'छाती के बीच में लगातार और तेजी से दबाते रहें। एम्बुलेंस आने तक रुकें नहीं।'
        }
      },
      {
        stepNumber: 4,
        title: {
          en: 'Aspirin Alert & Ambulance Coordination',
          te: 'అంబులెన్స్ కోసం సిద్ధంగా ఉండండి',
          hi: 'एम्बुलेंस समन्वय और दवा सावधानी'
        },
        instruction: {
          en: 'If conscious and NOT allergic, chewable Aspirin (300mg) can be given ONLY if previously recommended by a doctor. Keep road clear for 108 ambulance entry.',
          te: 'రోగికి అలెర్జీ లేకపోతే మరియు డాక్టర్ అనుమతించినట్లయితే మాత్రమే ఆస్పిరిన్ ఇవ్వండి. అంబులెన్స్ వచ్చే మార్గాన్ని సిద్ధం చేయండి.',
          hi: 'यदि मरीज होश में है और डॉक्टर ने पहले कहा हो तभी एस्पिरिन दें। 108 एम्बुलेंस के लिए रास्ता खाली रखें।'
        },
        actionPrompt: {
          en: "Road cleared & 108 crew guided",
          te: "దారి సిద్ధం చేశాము",
          hi: "रास्ता तैयार है और टीम संपर्क में है"
        },
        voiceText: {
          en: 'Keep patient calm. Ensure entrance is clear for the arriving ambulance.',
          te: 'రోగిని ప్రశాంతంగా ఉంచండి. అంబులెన్స్ కోసం దారి సులభంగా ఉండేలా చూడండి.',
          hi: 'मरीज को शांत रखें। एम्बुलेंस के आने का रास्ता साफ रखें।'
        }
      }
    ],
    dangerSigns: {
      en: ['Loss of consciousness', 'Gasping or no breathing', 'Cold clammy skin and bluish lips', 'Severe vomiting with dizziness'],
      te: ['స్పృహ కోల్పోవడం', 'శ్వాస ఆగిపోవడం', 'శరీరం చల్లబడటం మరియు పెదవులు నీలంగా మారడం'],
      hi: ['बेहोश हो जाना', 'सांस रुकना या घरघराहट', 'ठंडा पसीना और होंठ नीले पड़ना']
    },
    disclaimer: {
      en: 'AI provides protocol guidance based on National Emergency Life Support standards. Ambulance 108 has been alerted.',
      te: 'ఈ సమాచారం అత్యవసర మార్గదర్శకత్వం కొరకు మాత్రమే. 108 అంబులెన్స్ సమాచారం పంపబడింది.',
      hi: 'यह निर्देश राष्ट्रीय आपातकालीन मानकों पर आधारित प्राथमिक सहायता है। 108 एम्बुलेंस रास्ते में है।'
    }
  },

  breathing: {
    id: 'breathing',
    icon: '😮‍💨',
    name: {
      en: 'Severe Breathing Difficulty',
      te: 'తీవ్రమైన శ్వాస సమస్య / ఉబ్బసం',
      hi: 'सांस लेने में अत्यधिक कठिनाई'
    },
    shortDesc: {
      en: 'Struggling to breathe, choking, or severe wheezing attack',
      te: 'శ్వాస తీసుకోవడంలో తీవ్రమైన ఇబ్బంది లేదా గొంతు అడ్డంకి',
      hi: 'सांस फूलना, दम घुटना या गंभीर अस्थमा अटैक'
    },
    recommendedFacilityCapability: 'Oxygen Support / High-Flow Resuscitation / Nebulization',
    triageQuestions: [
      {
        question: {
          en: 'Can the person speak full sentences?',
          te: 'వ్యక్తి పూర్తి వాక్యాలు మాట్లాడగలరా?',
          hi: 'क्या व्यक्ति पूरे वाक्य बोल पा रहा है?'
        },
        options: [
          { label: { en: 'Yes, speaking words', te: 'అవును, మాట్లాడగలరు', hi: 'हाँ, बोल पा रहे हैं' } },
          { label: { en: 'No, gasping single words', te: 'లేదు, ఒక్కో మాటే రావడం లేదు', hi: 'नहीं, केवल एक-एक शब्द' }, isUrgent: true }
        ]
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: {
          en: 'Upright High-Fowler Position',
          te: 'నిటారుగా కూర్చోబెట్టండి',
          hi: 'मरीज को सीधा बैठाएं'
        },
        instruction: {
          en: 'Sit the person fully upright, leaning slightly forward. Do NOT allow them to lie flat on their back, as this worsens airway collapse.',
          te: 'వ్యక్తిని నిటారుగా, కొద్దిగా ముందుకు వంచి కూర్చోబెట్టండి. వెల్లకిలా పడుకోనివ్వకండి.',
          hi: 'मरीज को बिल्कुल सीधा बैठाएं और थोड़ा आगे की ओर झुकने दें। उन्हें पीठ के बल बिल्कुल न लेटने दें।'
        },
        actionPrompt: {
          en: "Patient seated upright",
          te: "నిటారుగా కూర్చోబెట్టాను",
          hi: "मरीज को सीधा बैठा दिया"
        },
        voiceText: {
          en: 'Sit the person upright leaning forward. Never let them lie flat.',
          te: 'రోగిని నిటారుగా కూర్చోబెట్టండి. పడుకోనివ్వకండి.',
          hi: 'मरीज को सीधा बैठाएं। लेटने न दें।'
        }
      },
      {
        stepNumber: 2,
        title: {
          en: 'Fresh Air & Clothing',
          te: 'స్వచ్ఛమైన గాలి & వదులైన దుస్తులు',
          hi: 'ताजी हवा और कपड़े ढीले करें'
        },
        instruction: {
          en: 'Open all doors and windows. Clear crowds away from the patient. Loosen shirts, collars, and restrictive garments around chest and neck.',
          te: 'కిటికీలు, తలుపులు తెరవండి. చుట్టూ జనం లేకుండా చూడండి. మెడ మరియు ఛాతీ చుట్టూ దుస్తులు వదులు చేయండి.',
          hi: 'खिड़की-दरवाजे खोल दें। भीड़ हटाएं। गले और सीने के कपड़े ढीले करें।'
        },
        actionPrompt: {
          en: "Ventilation maximized",
          te: "గాలి వచ్చేలా చేశాను",
          hi: "हवा का प्रबंध कर दिया"
        },
        voiceText: {
          en: 'Open windows. Disperse the crowd. Loosen tight neck clothing.',
          te: 'కిటికీలు తెరవండి. జనాన్ని దూరం పెట్టండి.',
          hi: 'खिड़कियां खोलें। भीड़ हटाएं। कपड़े ढीले करें।'
        }
      },
      {
        stepNumber: 3,
        title: {
          en: 'Inhaler Use (If Asthmatic)',
          te: 'ఇన్హేలర్ వాడకం (ఆస్తమా ఉన్నట్లయితే)',
          hi: 'इनहेलर का उपयोग (यदि उपलब्ध हो)'
        },
        instruction: {
          en: 'If the patient has a prescribed reliever inhaler (Salbutamol / Asthalin), assist them in taking 2 to 4 puffs immediately using a spacer if available.',
          te: 'రోగి వద్ద వైద్యుడు సూచించిన ఇన్హేలర్ ఉంటే, వెంటనే 2 నుండి 4 పఫ్స్ పీల్చేలా సహాయపడండి.',
          hi: 'यदि मरीज के पास डॉक्टर द्वारा दिया गया इनहेलर है, तो तुरंत 2 से 4 पफ लेने में मदद करें।'
        },
        actionPrompt: {
          en: "Inhaler administered / None available",
          te: "ఇన్హేలర్ తీసుకున్నారు",
          hi: "इनहेलर दे दिया गया / उपलब्ध नहीं है"
        },
        voiceText: {
          en: 'If they have an asthma inhaler, give two to four puffs now.',
          te: 'ఆస్తమా ఇన్హేలర్ ఉంటే రెండు నుంచి నాలుగు పఫ్స్ ఇవ్వండి.',
          hi: 'यदि इनहेलर है तो 2 से 4 पफ दें।'
        }
      }
    ],
    dangerSigns: {
      en: ['Lips or fingernails turning blue', 'Silent chest (no breath sounds audible)', 'Drowsiness and exhaustion from struggling'],
      te: ['పెదవులు నీలంగా మారడం', 'స్పృహ తగ్గడం'],
      hi: ['होंठ या नाखून नीले पड़ना', 'मरीज का थक कर सुस्त होना']
    },
    disclaimer: {
      en: 'First-aid protocol while ambulance with oxygen resuscitation arrives.',
      te: 'ఆక్సిజన్ అంబులెన్స్ వచ్చే వరకు ప్రథమ చికిత్స.',
      hi: 'ऑक्सीजन एम्बुलेंस आने तक प्राथमिक देखभाल।'
    }
  },

  bleeding: {
    id: 'bleeding',
    icon: '🩸',
    name: {
      en: 'Severe Bleeding & Hemorrhage',
      te: 'తీవ్ర రక్తస్రావం',
      hi: 'गंभीर रक्तस्राव / तेज खून बहना'
    },
    shortDesc: {
      en: 'Uncontrolled spurting or flowing blood from deep cuts or trauma',
      te: 'నియంత్రణ లేని రక్తస్రావం లేదా లోతైన గాయాలు',
      hi: 'गहरे घाव से लगातार बहता हुआ खून'
    },
    recommendedFacilityCapability: 'Trauma OT / Blood Transfusion / Surgical Hemostasis',
    triageQuestions: [
      {
        question: {
          en: 'Is blood spurting continuously or soaking through cloth quickly?',
          te: 'రక్తం చిమ్ముతోందా లేదా గుడ్డ త్వరగా తడిసిపోతోందా?',
          hi: 'क्या खून फव्वारे की तरह बह रहा है?'
        },
        options: [
          { label: { en: 'Yes, heavy spurting', te: 'అవును, చాలా వేగంగా వస్తోంది', hi: 'हाँ, बहुत तेज बह रहा है' }, isUrgent: true },
          { label: { en: 'Moderate slow bleeding', te: 'నెమ్మదిగా కారుతోంది', hi: 'धीमी गति से बह रहा है' } }
        ]
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: {
          en: 'Direct Firm Continuous Pressure',
          te: 'గాయంపై గట్టిగా ఒత్తిడి ఉంచండి',
          hi: 'घाव पर सीधा और मजबूत दबाव बनाएं'
        },
        instruction: {
          en: 'Cover the wound with a clean cloth, sterile gauze, or towel. Press down firmly with both hands directly over the bleeding site. Do NOT release pressure to check.',
          te: 'గాయంపై శుభ్రమైన గుడ్డ ఉంచి రెండు చేతులతో గట్టిగా నొక్కండి. రక్తం ఆగిందో లేదో చూడటానికి ఒత్తిడిని తీసివేయవద్దు.',
          hi: 'घाव पर साफ कपड़ा रखें और दोनों हाथों से लगातार जोर से दबाएं। बार-बार कपड़ा उठाकर न देखें।'
        },
        criticalWarning: {
          en: 'Do not remove blood-soaked cloths! Add another layer on top and keep pressing.',
          te: 'రక్తం తడిసిన గుడ్డను తీయకండి! దానిపైనే మరొక గుడ్డ ఉంచి నొక్కండి.',
          hi: 'खून से भीगा कपड़ा हटाएं नहीं, उसके ऊपर दूसरा कपड़ा रखकर दबाते रहें।'
        },
        actionPrompt: {
          en: "Firm direct pressure applied",
          te: "గట్టిగా నొక్కి పట్టుకున్నాను",
          hi: "मजबूत दबाव बना रखा है"
        },
        voiceText: {
          en: 'Press firmly on the wound with a clean cloth. Do not lift the cloth to check.',
          te: 'శుభ్రమైన గుడ్డతో గాయంపై గట్టిగా ఒత్తండి. ఆపవద్దు.',
          hi: 'साफ कपड़े से घाव को लगातार जोर से दबाए रखें।'
        }
      },
      {
        stepNumber: 2,
        title: {
          en: 'Elevate Injured Limb (If No Fracture)',
          te: 'గాయపడిన భాగాన్ని పైకి ఎత్తండి',
          hi: 'घाव वाले अंग को ऊपर उठाएं'
        },
        instruction: {
          en: 'If the bleeding is on an arm or leg and bones are not broken, gently raise the limb above heart level while continuing firm pressure.',
          te: 'గాయం చేయి లేదా కాలుపై ఉండి ఎముక విరగకపోతే, దానిని గుండె మట్టం కంటే పైకి ఎత్తండి.',
          hi: 'यदि हाथ या पैर पर घाव है और हड्डी नहीं टूटी है, तो उसे हृदय के स्तर से ऊपर उठाएं।'
        },
        actionPrompt: {
          en: "Limb elevated while maintaining pressure",
          te: "పైకి ఎత్తి ఒత్తిడి ఉంచాను",
          hi: "अंग ऊपर उठाया गया"
        },
        voiceText: {
          en: 'Elevate the limb above the heart if bones are not broken.',
          te: 'ఎముక విరగకపోతే గాయపడిన కాలు లేదా చేతిని పైకి ఎత్తండి.',
          hi: 'हड्डी न टूटी हो तो अंग को ऊपर उठाएं।'
        }
      },
      {
        stepNumber: 3,
        title: {
          en: 'Keep Patient Warm to Prevent Shock',
          te: 'రోగి చల్లబడకుండా దుప్పటి కప్పండి',
          hi: 'मरीज को गर्म रखें (शॉक से बचाव)'
        },
        instruction: {
          en: 'Lay the patient down flat. Cover them with a blanket or shawl. Severe blood loss causes rapid hypothermia and shock.',
          te: 'రోగిని పడుకోబెట్టి దుప్పటి కప్పండి. రక్తం పోవడం వల్ల శరీరం చల్లబడి షాక్ వచ్చే ప్రమాదం ఉంది.',
          hi: 'मरीज को सीधा लिटाएं और कंबल या चादर से ढंकें ताकि शरीर ठंडा न पड़े।'
        },
        actionPrompt: {
          en: "Patient kept warm & resting",
          te: "దుప్పటి కప్పాను",
          hi: "मरीज को चादर से ढंक दिया"
        },
        voiceText: {
          en: 'Keep the patient lying down and covered with a warm blanket.',
          te: 'రోగిని పడుకోబెట్టి వెచ్చని దుప్పటి కప్పండి.',
          hi: 'मरीज को लिटाकर गर्म चादर से ढंकें।'
        }
      }
    ],
    dangerSigns: {
      en: ['Extreme thirst and pale cold skin', 'Rapid weak pulse', 'Fainting or confusion'],
      te: ['విపరీతమైన దాహం మరియు శరీరం పాలిపోవడం', 'నాడి వేగంగా మరియు బలహీనంగా మారడం'],
      hi: ['बहुत तेज प्यास लगना और त्वचा पीली पड़ना', 'नाड़ी बहुत तेज या कमजोर होना']
    },
    disclaimer: {
      en: 'Ambulance dispatched with blood control dressings and IV fluids.',
      te: '108 అంబులెన్స్ త్వరలోనే చేరుకుంటుంది.',
      hi: 'एम्बुलेंस रक्तस्राव नियंत्रण किट के साथ रास्ते में है।'
    }
  },

  stroke: {
    id: 'stroke',
    icon: '🧠',
    name: {
      en: 'Suspected Stroke (Paralysis / Face Slump)',
      te: 'పక్షవాతం లక్షణాలు / స్ట్రోక్',
      hi: 'संभावित ब्रेन स्ट्रोक / लकवा'
    },
    shortDesc: {
      en: 'Face drooping, arm weakness, slurred speech, sudden confusion',
      te: 'ముఖం ఒకవైపు వాలడం, మాట తడబడటం, చేయి బలహీనపడటం',
      hi: 'मुंह टेढ़ा होना, आवाज लड़खड़ाना, हाथ में कमजोरी'
    },
    recommendedFacilityCapability: 'CT Scan / Neurological Care / Thrombolysis Unit',
    triageQuestions: [
      {
        question: {
          en: 'Can the person smile evenly without one side dropping?',
          te: 'ముఖం ఒకవైపు వాలకుండా నవ్వగలరా?',
          hi: 'क्या व्यक्ति दोनों तरफ बराबर मुस्कुरा पा रहा है?'
        },
        options: [
          { label: { en: 'Yes, smile is even', te: 'అవును, ముఖం బాగుంది', hi: 'हाँ, बराबर है' } },
          { label: { en: 'No, one side is drooped', te: 'లేదు, ఒకవైపు వాలిపోయింది', hi: 'नहीं, एक तरफ झुक रहा है' }, isUrgent: true }
        ]
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: {
          en: 'Perform the FAST Stroke Check',
          te: 'FAST పరీక్ష చేయండి',
          hi: 'फास्ट (FAST) परीक्षण करें'
        },
        instruction: {
          en: 'F: Face (Ask to smile - does one side droop?). A: Arms (Ask to raise both arms - does one drift downward?). S: Speech (Ask to repeat a simple sentence - is speech slurred?). T: Time (Note the exact time symptoms started).',
          te: 'F - ముఖం వాలిందా చూడండి. A - రెండు చేతులు పైకి ఎత్తమనండి. S - మాట్లాడించి చూడండి. T - సమయాన్ని ఖచ్చితంగా నమోదు చేయండి.',
          hi: 'F: चेहरा (मुस्कुराने पर क्या एक तरफ झुकता है?). A: हाथ (दोनों हाथ उठाने पर क्या एक गिरता है?). S: बोली (क्या बोली लड़खड़ा रही है?). T: समय (शुरू होने का समय नोट करें)।'
        },
        actionPrompt: {
          en: "FAST signs recorded & exact time noted",
          te: "సమయం మరియు లక్షణాలు గుర్తించాను",
          hi: "लक्षण और समय नोट कर लिया है"
        },
        voiceText: {
          en: 'Check face drooping, arm weakness, and slurred speech. Note the exact time it started.',
          te: 'ముఖం, చేతులు, మాటను పరీక్షించి, సమయాన్ని గుర్తించండి.',
          hi: 'चेहरा, हाथ और आवाज की जांच करें। समय नोट करें।'
        }
      },
      {
        stepNumber: 2,
        title: {
          en: 'Safety Position - Recovery Side',
          te: 'ఒకవైపుకు తిప్పి పడుకోబెట్టండి',
          hi: 'करवट दिलाकर लिटाएं'
        },
        instruction: {
          en: 'Lay the person on their side (preferably the non-weak side) with head slightly elevated. This prevents choking if they vomit or swallow saliva.',
          te: 'రోగిని ఒకవైపుకు తిప్పి పడుకోబెట్టండి, తలను కొద్దిగా పైకి ఉంచండి.',
          hi: 'मरीज को एक तरफ करवट दिलाकर लिटाएं और सिर थोड़ा ऊंचा रखें ताकि उल्टी होने पर सांस की नली बंद न हो।'
        },
        criticalWarning: {
          en: 'DO NOT give any food, water, or medication (even aspirin) by mouth! Swallowing is paralyzed.',
          te: 'నోటి ద్వారా నీరు, ఆహారం లేదా మందులు ఇవ్వవద్దు!',
          hi: 'मरीज को मुंह से पानी, खाना या कोई गोली (एस्पिरिन भी नहीं) बिल्कुल न दें।'
        },
        actionPrompt: {
          en: "Patient placed on side; nothing given by mouth",
          te: "ఒకవైపుకు పడుకోబెట్టాను, నోటిలో ఏమీ ఇవ్వలేదు",
          hi: "करवट दिला दी है, मुंह से कुछ नहीं दिया"
        },
        voiceText: {
          en: 'Lay them on their side. Do not give any food, water, or pills.',
          te: 'ఒకవైపుకు పడుకోబెట్టండి. నీరు లేదా మందులు ఇవ్వకండి.',
          hi: 'करवट दिलाएं। कुछ भी खाने-पीने को न दें।'
        }
      }
    ],
    dangerSigns: {
      en: ['Sudden loss of consciousness', 'Severe abrupt thunderclap headache', 'Inability to breathe properly'],
      te: ['హఠాత్తుగా స్పృహ కోల్పోవడం', 'తీవ్రమైన తలనొప్పి'],
      hi: ['अचानक बेहोश होना', 'अत्यधिक तेज सिरदर्द']
    },
    disclaimer: {
      en: 'Stroke requires urgent hospital thrombolytic intervention within the 4.5 hour golden window.',
      te: 'స్ట్రోక్ బాధితులకు మొదటి 4 గంటల్లో ఆసుపత్రి చికిత్స అత్యంత కీలకం.',
      hi: 'स्ट्रोक के इलाज के लिए पहले 4.5 घंटे बेहद महत्वपूर्ण हैं।'
    }
  },

  burn: {
    id: 'burn',
    icon: '🔥',
    name: {
      en: 'Burns & Scalds',
      te: 'కాలిన గాయాలు',
      hi: 'आग या गर्म तरल से जलना'
    },
    shortDesc: {
      en: 'Fire, boiling liquid, electrical or chemical burns',
      te: 'నిప్పు లేదా వేడి నీరు పడటం వల్ల కాలిన గాయాలు',
      hi: 'गर्म पानी, आग या करंट से जलना'
    },
    recommendedFacilityCapability: 'Burn Care Ward / Sterile Dressing / IV Hydration',
    triageQuestions: [
      {
        question: {
          en: 'Is the burn over a large area (chest, face, groin, or entire limb)?',
          te: 'కాలిన గాయం పెద్ద భాగంలో ఉందా (ముఖం, ఛాతీ లేదా చేతులు)?',
          hi: 'क्या शरीर का बड़ा हिस्सा (चेहरा, छाती या हाथ-पैर) जला है?'
        },
        options: [
          { label: { en: 'Yes, extensive area', te: 'అవును, పెద్ద భాగం', hi: 'हाँ, बड़ा हिस्सा जला है' }, isUrgent: true },
          { label: { en: 'Small localized area', te: 'చిన్న భాగం మాత్రమే', hi: 'छोटा घाव है' } }
        ]
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: {
          en: 'Cool with Running Tap Water (20 Minutes)',
          te: 'చల్లటి నీటితో 20 నిమిషాలు కడగండి',
          hi: 'बहते सामान्य पानी से 20 मिनट ठंडा करें'
        },
        instruction: {
          en: 'Immediately cool the burned area under clean, gentle running tap water for a full 20 minutes. Do NOT use ice, ice water, or freezing substances.',
          te: 'గాయంపై చల్లటి కుళాయి నీటిని 20 నిమిషాల పాటు ధారగా పోయండి. మంచుగడ్డలు (ఐస్) వాడవద్దు.',
          hi: 'घाव पर नल का सामान्य पानी लगातार 20 मिनट तक बहने दें। बर्फ का इस्तेमाल बिल्कुल न करें।'
        },
        criticalWarning: {
          en: 'DO NOT apply cow dung, toothpaste, butter, turmeric, or oil to burns! These cause severe lethal infections.',
          te: 'గాయంపై పేడ, పసుపు, టూత్‌పేస్ట్ లేదా నూనె రాయవద్దు! ఇన్ఫెక్షన్ సోకుతుంది.',
          hi: 'घाव पर गोबर, टूथपेस्ट, तेल, घी या हल्दी कभी न लगाएं! इससे गंभीर संक्रमण होता है।'
        },
        actionPrompt: {
          en: "Cooled with clean running water",
          te: "నీటితో చల్లబరిచాను",
          hi: "पानी से ठंडा कर दिया है"
        },
        voiceText: {
          en: 'Pour cool tap water over the burn for twenty minutes. Never use ice, paste, or oil.',
          te: 'కాలిన భాగంపై ఇరవై నిమిషాలు నీరు పోయండి. పేడ లేదా పేస్ట్ రాయకండి.',
          hi: 'नल के पानी से 20 मिनट तक ठंडा करें। बर्फ या तेल न लगाएं।'
        }
      },
      {
        stepNumber: 2,
        title: {
          en: 'Remove Rings & Constrictive Items',
          te: 'ఉంగరాలు, ఆభరణాలు తొలగించండి',
          hi: 'अंगूठी और गहने तुरंत निकालें'
        },
        instruction: {
          en: 'Gently remove rings, bracelets, watches, and tight clothing before swelling begins. Do NOT peel away clothing stuck to the burn.',
          te: 'వాపు రాకముందే ఉంగరాలు, గాజులు, గడియారాలు తొలగించండి. కాలిన చర్మానికి అంటుకున్న దుస్తులను లాగవద్దు.',
          hi: 'सूजन आने से पहले अंगूठी, चूड़ी या घड़ी हटा लें। चिपके हुए कपड़ों को जबरन न खींचें।'
        },
        actionPrompt: {
          en: "Jewelry removed safely",
          te: "ఆభరణాలు తీసివేశాను",
          hi: "गहने हटा दिए गए हैं"
        },
        voiceText: {
          en: 'Remove rings and watches before swelling starts.',
          te: 'వాపు రాకముందే ఉంగరాలు తీసివేయండి.',
          hi: 'सूजन आने से पहले अंगूठियां और घड़ियां निकाल लें।'
        }
      },
      {
        stepNumber: 3,
        title: {
          en: 'Cover Loosely with Clean Plastic Film / Cloth',
          te: 'శుభ్రమైన ప్లాస్టిక్ కవర్ లేదా గుడ్డతో కప్పండి',
          hi: 'साफ प्लास्टिक फिल्म या कपड़े से ढंकें'
        },
        instruction: {
          en: 'Cover the burn loosely with clean cling wrap or a clean, dry, lint-free cloth. Do not pop any blisters.',
          te: 'బొబ్బలను పగలగొట్టవద్దు. శుభ్రమైన ప్లాస్టిక్ కవర్ లేదా గుడ్డతో కప్పండి.',
          hi: 'छालों को बिल्कुल न फोड़ें। साफ प्लास्टिक फिल्म या साफ सूखे कपड़े से ढीला ढंकें।'
        },
        actionPrompt: {
          en: "Covered loosely without bursting blisters",
          te: "కప్పి ఉంచాను",
          hi: "साफ कपड़े से ढंक दिया"
        },
        voiceText: {
          en: 'Cover loosely with clean plastic wrap or dry cloth. Do not burst blisters.',
          te: 'శుభ్రమైన గుడ్డతో కప్పండి. బొబ్బలు పగలగొట్టకండి.',
          hi: 'साफ कपड़े से ढंकें। फफोले न फोड़ें।'
        }
      }
    ],
    dangerSigns: {
      en: ['Burns covering face or airway (smoke inhalation)', 'Charred white or black skin with no pain', 'Shivering or confusion'],
      te: ['ముఖం కాలడం లేదా పొగ పీల్చడం', 'నొప్పి తెలియకపోవడం'],
      hi: ['चेहरे पर जलना या सांस में धुआं जाना', 'त्वचा का सुन्न हो जाना']
    },
    disclaimer: {
      en: 'Major burns require immediate hospital fluid resuscitation to prevent renal failure.',
      te: 'కాలిన గాయాలకు ఆసుపత్రిలో సెలైన్ ఎక్కించడం అత్యవసరం.',
      hi: 'जलने पर तुरंत अस्पताल में ड्रिप और इलाज जरूरी है।'
    }
  },

  trauma: {
    id: 'trauma',
    icon: '🤕',
    name: {
      en: 'Serious Injury / Road Accident / Fracture',
      te: 'రోడ్డు ప్రమాదం / తీవ్ర గాయాలు / ఎముక విరగడం',
      hi: 'गंभीर चोट / सड़क दुर्घटना / हड्डी टूटना'
    },
    shortDesc: {
      en: 'Fall from height, motor accident, suspected spinal trauma, or fracture',
      te: 'వాహన ప్రమాదం లేదా ఎత్తు నుండి పడటం వల్ల గాయాలు',
      hi: 'सड़क हादसा, ऊंचाई से गिरना या शरीर में गंभीर चोट'
    },
    recommendedFacilityCapability: 'Trauma Resuscitation / Orthopedic OT / X-Ray & CT',
    triageQuestions: [
      {
        question: {
          en: 'Is there suspected neck, head, or spine injury?',
          te: 'మెడ లేదా వెన్నుపూసకు దెబ్బ తగిలిందా?',
          hi: 'क्या सिर, गर्दन या रीढ़ की हड्डी में चोट की आशंका है?'
        },
        options: [
          { label: { en: 'Yes, suspected spine/head injury', te: 'అవును, వెన్నుపూస దెబ్బతింది', hi: 'हाँ, गर्दन/सिर में चोट है' }, isUrgent: true },
          { label: { en: 'No spine injury, limb injury only', te: 'చేతులు లేదా కాళ్లు మాత్రమే', hi: 'केवल हाथ या पैर में चोट' } }
        ]
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: {
          en: 'Do NOT Move the Patient (Spine Precautions)',
          te: 'రోగిని కదల్చవద్దు (వెన్నుపూస రక్షణ)',
          hi: 'मरीज को बिल्कुल न हिलाएं (रीढ़ की सुरक्षा)'
        },
        instruction: {
          en: 'Keep the head, neck, and spine completely still in a straight line. Do NOT bend neck or twist body. Moving an accident victim can cause permanent paralysis.',
          te: 'తలను, మెడను కదల్చకుండా నిటారుగా ఉంచండి. ప్రమాద బాధితులను తరలించడం వల్ల పక్షవాతం రావచ్చు.',
          hi: 'सिर और गर्दन को बिल्कुल सीधा रखें। हिलाएं नहीं। मरीज को गलत तरीके से उठाने पर लकवा मार सकता है।'
        },
        actionPrompt: {
          en: "Patient kept still without spinal movement",
          te: "కదలకుండా ఉంచాను",
          hi: "मरीज को बिना हिलाए स्थिर रखा है"
        },
        voiceText: {
          en: 'Do not move the neck or back. Keep the person still.',
          te: 'మెడను కదల్చవద్దు. రోగిని నిశ్చలంగా ఉంచండి.',
          hi: 'गर्दन और रीढ़ को न हिलाएं। मरीज को स्थिर रखें।'
        }
      },
      {
        stepNumber: 2,
        title: {
          en: 'Support Fractured Limbs',
          te: 'విరిగిన భాగానికి ఆసరా ఇవ్వండి',
          hi: 'टूटे अंग को सहारा दें'
        },
        instruction: {
          en: 'If an arm or leg is deformed, support it gently in the position found using rolled blankets or cushions. Do NOT attempt to straighten crooked bones.',
          te: 'విరిగిన ఎముకలను సరిచేయడానికి ప్రయత్నించవద్దు. దుప్పటి లేదా దిండుతో ఆసరా ఇవ్వండి.',
          hi: 'टेढ़ी हड्डी को सीधा करने की कोशिश न करें। कंबल या तकिए से सहारा दें।'
        },
        actionPrompt: {
          en: "Limb supported in position found",
          te: "ఆసరా కల్పించాను",
          hi: "अंग को सहारा दे दिया"
        },
        voiceText: {
          en: 'Support broken limbs in place. Do not force bones straight.',
          te: 'విరిగిన ఎముకను బలవంతంగా తిప్పవద్దు. ఆసరా ఇవ్వండి.',
          hi: 'टूटे अंग को सहारा दें। सीधा करने की कोशिश न करें।'
        }
      }
    ],
    dangerSigns: {
      en: ['Clear fluid or blood leaking from ears or nose', 'Loss of sensation in legs or arms', 'Unequal pupil size'],
      te: ['చెవులు లేదా ముక్కు నుండి రక్తం కారడం', 'చేతులు, కాళ్లలో స్పర్శ తగ్గడం'],
      hi: ['कान या नाक से खून या पानी जैसा तरल बहना', 'हाथ-पैरों में सुन्नपन']
    },
    disclaimer: {
      en: 'Ambulance equipped with cervical spinal collar and scoop stretcher is en route.',
      te: 'స్ట్రెచర్ మరియు కాలర్‌తో కూడిన అంబులెన్స్ వస్తోంది.',
      hi: 'रीढ़ की सुरक्षा उपकरण वाली एम्बुलेंस आ रही है।'
    }
  },

  bite: {
    id: 'bite',
    icon: '🐍',
    name: {
      en: 'Snake Bite / Venomous Insect / Scorpion',
      te: 'పాము కాటు / తేలు కుట్టడం',
      hi: 'सांप का काटना / बिच्छू का डंक'
    },
    shortDesc: {
      en: 'Fangs marks, rapid swelling, numbness, or venom symptoms in rural surroundings',
      te: 'పాము లేదా విషపు కీటకాలు కుట్టడం వల్ల వాపు మరియు నొప్పి',
      hi: 'सांप या जहरीले कीड़े का काटना, सूजन व दर्द'
    },
    recommendedFacilityCapability: 'Anti-Snake Venom (ASV) / Ventilator / Observation Ward',
    triageQuestions: [
      {
        question: {
          en: 'Is the bite from a snake or unknown creature?',
          te: 'పాము కాటు అని భావిస్తున్నారా?',
          hi: 'क्या सांप के काटने की आशंका है?'
        },
        options: [
          { label: { en: 'Yes, suspected snake bite', te: 'అవును, పాము కాటు', hi: 'हाँ, सांप का काटना' }, isUrgent: true },
          { label: { en: 'Scorpion or insect sting', te: 'తేలు లేదా ఇతర కీటకం', hi: 'बिच्छू या अन्य कीड़ा' } }
        ]
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: {
          en: 'Keep Calm & Immobilize the Bitten Limb',
          te: 'రోగిని కదలకుండా ఉంచండి (విషం పాకకుండా)',
          hi: 'मरीज को शांत रखें और अंग को बिल्कुल स्थिर करें'
        },
        instruction: {
          en: 'Keep the patient calm and completely still. Anxiety and walking pump venom into the heart much faster. Splint the bitten limb with a stick or rolled newspaper at heart level.',
          te: 'రోగిని నడవనివ్వకండి. గాయపడిన కాలు లేదా చేతిని కదలకుండా ఒక కర్ర సహాయంతో కట్టండి.',
          hi: 'मरीज को घबराने न दें और चलने बिल्कुल न दें। चलने से जहर तेजी से फैलता है। अंग को लकड़ी की खपच्ची बांधकर स्थिर रखें।'
        },
        criticalWarning: {
          en: 'DO NOT cut the wound, suck out venom, wash with chemicals, or tie a tight wire/rope tourniquet! These dangerous practices destroy tissues and kill patients.',
          te: 'గాయాన్ని కోయవద్దు, నోటితో విషాన్ని పీల్చవద్దు, గట్టిగా తాడు కట్టవద్దు!',
          hi: 'घाव पर चीरा न लगाएं, मुंह से जहर न चूसें और न ही कसकर रस्सी बांधें! इससे अंग सड़ सकता है।'
        },
        actionPrompt: {
          en: "Patient resting still, limb immobilized",
          te: "కదలకుండా చేశాను",
          hi: "मरीज को स्थिर कर दिया है"
        },
        voiceText: {
          en: 'Keep the person completely still. Do not cut the wound or tie tight ropes.',
          te: 'రోగిని కదలకుండా ఉంచండి. గాయాన్ని కోయవద్దు లేదా గట్టిగా కట్టవద్దు.',
          hi: 'मरीज को शांत और स्थिर रखें। घाव पर चीरा या रस्सी न बांधें।'
        }
      },
      {
        stepNumber: 2,
        title: {
          en: 'Remove Rings & Constricting Bands',
          te: 'ఉంగరాలు తొలగించండి',
          hi: 'अंगूठी और धागे तुरंत खोलें'
        },
        instruction: {
          en: 'Take off rings, bangles, anklets, and shoes from the bitten limb immediately, as massive swelling occurs rapidly.',
          te: 'వాపు విపరీతంగా పెరగవచ్చు కాబట్టి ఉంగరాలు, గొలుసులు, చెప్పులు వెంటనే తీసివేయండి.',
          hi: 'काटे गए हाथ या पैर से अंगूठी, कड़े या जूते तुरंत निकाल लें क्योंकि सूजन तेजी से बढ़ती है।'
        },
        actionPrompt: {
          en: "Jewelry removed; swelling area monitored",
          te: "ఆభరణాలు తొలగించాను",
          hi: "गहने हटा दिए गए हैं"
        },
        voiceText: {
          en: 'Remove rings and shoes immediately before severe swelling starts.',
          te: 'వాపు రాకముందే ఉంగరాలు మరియు చెప్పులు తొలగించండి.',
          hi: 'सूजन आने से पहले अंगूठी और जूते तुरंत हटा लें।'
        }
      }
    ],
    dangerSigns: {
      en: ['Drooping eyelids (ptosis) and double vision', 'Difficulty swallowing or breathing', 'Bleeding from gums'],
      te: ['కనురెప్పలు వాలిపోవడం', 'మింగడంలో లేదా శ్వాసలో ఇబ్బంది', 'చిగుళ్ల నుండి రక్తం కారడం'],
      hi: ['पलकें झपकना या आंखें भारी होना', 'थूक निगलने या सांस लेने में तकलीफ', 'मसूड़ों से खून आना']
    },
    disclaimer: {
      en: 'Priority routing to facility stocked with Polyvalent Anti-Snake Venom (ASV).',
      te: 'యాంటీ స్నేక్ వెనమ్ (ASV) ఉన్న ఆసుపత్రికి అంబులెన్స్ రూటింగ్ చేయబడింది.',
      hi: 'एंटी-स्नेक वेनम (ASV) उपलब्ध वाले अस्पताल को अलर्ट भेज दिया गया है।'
    }
  },

  allergic: {
    id: 'allergic',
    icon: '⚠️',
    name: {
      en: 'Severe Allergic Reaction (Anaphylaxis)',
      te: 'తీవ్రమైన అలెర్జీ / గొంతు వాపు',
      hi: 'गंभीर एलर्जी (एनाफिलेक्सिस)'
    },
    shortDesc: {
      en: 'Swelling of throat/face, hives, wheezing, sudden low blood pressure',
      te: 'ముఖం లేదా గొంతు వాపు, దద్దుర్లు, శ్వాస ఆడకపోవడం',
      hi: 'गले और होंठों में सूजन, चकत्ते, सांस लेने में घरघराहट'
    },
    recommendedFacilityCapability: 'Epinephrine Auto-injector / ICU / Airway Management',
    triageQuestions: [
      {
        question: {
          en: 'Is there swelling in the mouth, tongue, or hoarse voice?',
          te: 'నాలుక లేదా గొంతు వాచిందా?',
          hi: 'क्या जीभ या गले में सूजन है?'
        },
        options: [
          { label: { en: 'Yes, throat/tongue swelling', te: 'అవును, గొంతు వాచింది', hi: 'हाँ, गले में सूजन है' }, isUrgent: true },
          { label: { en: 'Skin hives only', te: 'చర్మంపై దద్దుర్లు మాత్రమే', hi: 'सिर्फ त्वचा पर चकत्ते हैं' } }
        ]
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: {
          en: 'Position Flat with Legs Raised',
          te: 'పడుకోబెట్టి కాళ్లను పైకి ఎత్తండి',
          hi: 'सीधा लिटाएं और पैर ऊपर उठाएं'
        },
        instruction: {
          en: 'Lay the person flat on their back and elevate their legs roughly 12 inches to maintain blood flow to the brain and heart. If breathing is difficult, allow semi-reclined sitting.',
          te: 'రోగిని వెల్లకిలా పడుకోబెట్టి కాళ్లను కొద్దిగా పైకి ఎత్తండి. శ్వాస కష్టంగా ఉంటే కూర్చోనివ్వండి.',
          hi: 'मरीज को सीधा लिटाएं और पैरों को थोड़ा ऊपर उठाएं। यदि सांस फूल रही हो तो आधा बैठाएं।'
        },
        actionPrompt: {
          en: "Patient positioned properly",
          te: "సరైన భంగిమలో ఉంచాను",
          hi: "मरीज को स्थिति में रखा"
        },
        voiceText: {
          en: 'Lay them flat and raise their legs slightly.',
          te: 'రోగిని పడుకోబెట్టి కాళ్లను పైకి ఎత్తండి.',
          hi: 'मरीज को लिटाएं और पैर ऊपर उठाएं।'
        }
      },
      {
        stepNumber: 2,
        title: {
          en: 'Epinephrine Auto-Injector (EpiPen) If Available',
          te: 'ఎపినెఫ్రిన్ ఇంజెక్షన్ (అందుబాటులో ఉంటే)',
          hi: 'एपीनेफ्रिन इंजेक्शन (यदि मरीज के पास हो)'
        },
        instruction: {
          en: 'If the patient carries a prescribed auto-injector, assist them in injecting it into the outer middle thigh immediately.',
          te: 'రోగి వద్ద ఎపినెఫ్రిన్ ఇంజెక్షన్ ఉంటే, వెంటనే తొడ భాగంలో ఇవ్వండి.',
          hi: 'यदि मरीज के पास डॉक्टर द्वारा दिया गया ऑटो-इंजेक्टर है, तो तुरंत जांघ पर लगाएं।'
        },
        actionPrompt: {
          en: "EpiPen checked / Assisted",
          te: "ఇంజెక్షన్ సహాయం చేశాను",
          hi: "दवा की जांच कर ली है"
        },
        voiceText: {
          en: 'If they carry an emergency allergy injector, use it in the outer thigh now.',
          te: 'అలెర్జీ ఇంజెక్షన్ ఉంటే తొడలో ఇవ్వండి.',
          hi: 'यदि एलर्जी का इंजेक्शन है तो जांघ पर लगाएं।'
        }
      }
    ],
    dangerSigns: {
      en: ['Inability to swallow or talk', 'Dizziness, collapse, cold skin'],
      te: ['మాట్లాడలేకపోవడం', 'తలతిరగడం లేదా కుప్పకూలడం'],
      hi: ['बोलने या निगलने में असमर्थता', 'चक्कर खाकर गिरना']
    },
    disclaimer: {
      en: 'Anaphylaxis is an extreme life threat. Ambulance ALS unit alerted.',
      te: 'తీవ్ర అలెర్జీ ప్రాణాంతకం కావచ్చు. 108 అంబులెన్స్ వస్తోంది.',
      hi: 'यह एक गंभीर आपातकाल है। 108 एम्बुलेंस रास्ते में है।'
    }
  },

  other: {
    id: 'other',
    icon: '❓',
    name: {
      en: 'Other Medical Emergency / Convulsions',
      te: 'ఇతర అత్యవసర సమస్యలు / ఫిట్స్',
      hi: 'अन्य आपातकाल / मिर्गी का दौरा'
    },
    shortDesc: {
      en: 'Violent convulsions, severe fever spikes, sudden severe poisoning, or heat stroke',
      te: 'ఫిట్స్ రావడం, తీవ్రమైన విషప్రభావం లేదా వడదెబ్బ',
      hi: 'दौरा पड़ना, जहर का असर या लू लगना'
    },
    recommendedFacilityCapability: 'General Emergency & Trauma Stabilization',
    triageQuestions: [
      {
        question: {
          en: 'Is the person having active jerking seizures / convulsions?',
          te: 'వ్యక్తికి ఫిట్స్ వస్తున్నాయా?',
          hi: 'क्या व्यक्ति को दौरे पड़ रहे हैं?'
        },
        options: [
          { label: { en: 'Yes, actively convulsing', te: 'అవును, ఫిట్స్ వస్తున్నాయి', hi: 'हाँ, दौरा पड़ रहा है' }, isUrgent: true },
          { label: { en: 'No, other acute distress', te: 'లేదు, ఇతర సమస్య', hi: 'नहीं, अन्य परेशानी है' } }
        ]
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: {
          en: 'Clear Surrounding Hazards',
          te: 'ప్రమాదకర వస్తువులను దూరంగా ఉంచండి',
          hi: 'आसपास से खतरनाक चीजें हटाएं'
        },
        instruction: {
          en: 'Move away sharp objects, furniture, and hard edges so the person cannot injure themselves during convulsions. Cushion their head with a folded towel.',
          te: 'గాయపడకుండా చుట్టూ ఉన్న వస్తువులను తొలగించండి. తల కింద మెత్తని గుడ్డ ఉంచండి.',
          hi: 'नुकीली चीजें और फर्नीचर हटाएं ताकि चोट न लगे। सिर के नीचे नरम कपड़ा रखें।'
        },
        criticalWarning: {
          en: 'NEVER put spoons, onions, keys, or fingers into the mouth of a convulsing person! This fractures teeth and causes airway suffocation.',
          te: 'నోటిలో చెంచాలు, ఉల్లిపాయలు లేదా తాళాలు పెట్టవద్దు!',
          hi: 'दौरे के समय मुंह में चम्मच, चाबी, प्याज या उंगली कभी न डालें! इससे दम घुट सकता है।'
        },
        actionPrompt: {
          en: "Hazards cleared; head protected",
          te: "తలకు రక్షణ కల్పించాను",
          hi: "खतरे की चीजें हटा दी हैं"
        },
        voiceText: {
          en: 'Clear away hard objects. Protect their head with a soft cloth. Never put anything in their mouth.',
          te: 'చుట్టూ వస్తువులను తొలగించండి. నోటిలో ఏమీ పెట్టవద్దు.',
          hi: 'आसपास की चीजें हटाएं। मुंह में कुछ न डालें।'
        }
      },
      {
        stepNumber: 2,
        title: {
          en: 'Turn to Recovery Position After Jerking Stops',
          te: 'ఫిట్స్ తగ్గాక ఒకవైపుకు తిప్పండి',
          hi: 'दौरा रुकने पर करवट दिलाएं'
        },
        instruction: {
          en: 'Once convulsions cease, roll the person onto their side into the recovery position so saliva drains freely from mouth.',
          te: 'ఫిట్స్ ఆగిన తర్వాత రోగిని ఒకవైపుకు తిప్పి పడుకోబెట్టండి.',
          hi: 'दौरा रुकने पर मरीज को एक तरफ करवट दिलाएं ताकि लार बाहर निकल सके।'
        },
        actionPrompt: {
          en: "Placed in recovery side position",
          te: "ఒకవైపుకు పడుకోబెట్టాను",
          hi: "करवट दिला दी गई"
        },
        voiceText: {
          en: 'When jerking stops, roll them on their side.',
          te: 'ఫిట్స్ ఆగిన తర్వాత రోగిని ఒకవైపుకు తిప్పండి.',
          hi: 'दौरा रुकने पर करवट दिलाकर लिटाएं।'
        }
      }
    ],
    dangerSigns: {
      en: ['Seizure lasting longer than 5 minutes', 'Repeated seizures without regaining consciousness'],
      te: ['ఫిట్స్ 5 నిమిషాల కంటే ఎక్కువ సమయం రావడం'],
      hi: ['दौरा 5 मिनट से अधिक समय तक चलना']
    },
    disclaimer: {
      en: 'Ambulance 108 notified with anti-convulsant medication capability.',
      te: '108 అత్యవసర సేవలకు సమాచారం అందించబడింది.',
      hi: '108 आपातकालीन टीम रास्ते में है।'
    }
  },

  unknown: {
    id: 'unknown',
    icon: '❓',
    name: {
      en: 'General Bystander Emergency Check',
      te: 'సాధారణ అత్యవసర పరిశీలన',
      hi: 'सामान्य आपातकालीन जांच'
    },
    shortDesc: {
      en: 'Uncertain emergency situation requiring basic safety triage',
      te: 'సమస్య ఖచ్చితంగా తెలియనప్పుడు ప్రాథమిక రక్షణ',
      hi: 'स्थिति स्पष्ट न होने पर बुनियादी जांच'
    },
    recommendedFacilityCapability: 'District Hospital / Community Health Centre',
    triageQuestions: [
      {
        question: {
          en: 'Can the patient hear and answer questions?',
          te: 'రోగి మీ మాటలు వినగలరా?',
          hi: 'क्या मरीज आपकी बात सुनकर जवाब दे पा रहा है?'
        },
        options: [
          { label: { en: 'Yes', te: 'అవును', hi: 'हाँ' } },
          { label: { en: 'No', te: 'లేదు', hi: 'नहीं' }, isUrgent: true }
        ]
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: {
          en: 'Check Danger & Response (DRABC)',
          te: 'ప్రమాదం మరియు స్పందనను చూడండి',
          hi: 'खतरे और प्रतिक्रिया की जांच'
        },
        instruction: {
          en: 'Check for danger around the scene (traffic, live electric wires). Check if the person is responsive by speaking loudly and gently touching shoulders.',
          te: 'పరిసరాలలో ఏదైనా ప్రమాదం ఉందో లేదో చూడండి. వ్యక్తి స్పందిస్తున్నారో లేదో గమనించండి.',
          hi: 'आसपास बिजली के तार या ट्रैफिक जैसे खतरे देखें। मरीज से बात करके प्रतिक्रिया जांचें।'
        },
        actionPrompt: {
          en: "Scene checked & confirmed safe",
          te: "పరిశీలించాను",
          hi: "जांच कर ली गई"
        },
        voiceText: {
          en: 'Ensure the area is safe. Check if the person answers your voice.',
          te: 'పరిసరాలు సురక్షితంగా ఉన్నాయో లేదో చూసి మాట్లాడించండి.',
          hi: 'सुरक्षा देखें और मरीज से बात करें।'
        }
      },
      {
        stepNumber: 2,
        title: {
          en: 'Keep Person Calm & Stay Together',
          te: 'రోగి వద్దే ఉండండి',
          hi: 'मरीज के पास रहें और शांत रखें'
        },
        instruction: {
          en: 'Stay with the person. Do not leave them alone. Keep their airway clear and monitor breathing until ambulance 108 reaches your village.',
          te: 'రోగిని ఒంటరిగా వదలకండి. అంబులెన్స్ వచ్చే వరకు దగ్గరే ఉండి శ్వాసను గమనించండి.',
          hi: 'मरीज को अकेला न छोड़ें। एम्बुलेंस आने तक उनके पास रहें और सांस पर नजर रखें।'
        },
        actionPrompt: {
          en: "Staying with patient until help arrives",
          te: "రోగి దగ్గరే ఉన్నాను",
          hi: "मरीज के साथ मौजूद हूँ"
        },
        voiceText: {
          en: 'Stay with the patient. 108 ambulance is on the way.',
          te: 'రోగి దగ్గరే ఉండండి. అంబులెన్స్ వస్తోంది.',
          hi: 'मरीज के पास रहें। एम्बुलेंस आ रही है।'
        }
      }
    ],
    dangerSigns: {
      en: ['Unresponsiveness', 'Cold pale skin', 'Difficulty breathing'],
      te: ['స్పృహ లేకపోవడం', 'చల్లబడటం'],
      hi: ['होश न होना', 'सांस में तकलीफ']
    },
    disclaimer: {
      en: 'Emergency medical services have been coordinated.',
      te: '108 అత్యవసర సేవలకు సమాచారం పంపబడింది.',
      hi: '108 आपातकालीन टीम रास्ते में है।'
    }
  }
};
