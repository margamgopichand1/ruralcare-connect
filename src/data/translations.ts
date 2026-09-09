import { Language } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  sihTag: string;
  home: string;
  bookDoctor: string;
  emergencySos: string;
  medicalRecords: string;
  prescriptions: string;
  referrals: string;
  medicines: string;
  profile: string;
  login: string;
  logout: string;
  dashboard: string;
  roleSelectTitle: string;
  patientRole: string;
  doctorRole: string;
  adminRole: string;
  patientDesc: string;
  doctorDesc: string;
  adminDesc: string;
  demoMode: string;
  findDoctor: string;
  requestDoctor: string;
  cancel: string;
  confirm: string;
  saveVisit: string;
  print: string;
  downloadPdf: string;
  callDoctor: string;
  callAmbulance: string;
  callHospital: string;
  message: string;
  useMyLocation: string;
  selectLocationManually: string;
  urgencyRoutine: string;
  urgencySoon: string;
  urgencyUrgent: string;
  urgencyEmergency: string;
  symptomFever: string;
  symptomColdCough: string;
  symptomStomach: string;
  symptomSkin: string;
  symptomChild: string;
  symptomWomen: string;
  symptomElderly: string;
  symptomGeneral: string;
  onlineStatus: string;
  offlineStatus: string;
  syncingData: string;
  syncedData: string;
  verifiedDoctor: string;
  verificationPending: string;
  sosPrompt: string;
  sosNotice: string;
  voiceInputTitle: string;
  voiceInputTap: string;
  voiceListening: string;
  etaLabel: string;
  distanceLabel: string;
  availableLabel: string;
  ratingLabel: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "RuralCare Connect",
    tagline: "Bringing the doctor to the doorstep",
    sihTag: "Smart India Hackathon 2026 | PS 26133",
    home: "Home",
    bookDoctor: "Book a Doctor",
    emergencySos: "EMERGENCY SOS",
    medicalRecords: "Medical Records",
    prescriptions: "Prescriptions",
    referrals: "Referrals",
    medicines: "Medicine Availability",
    profile: "Profile",
    login: "Login",
    logout: "Logout",
    dashboard: "Dashboard",
    roleSelectTitle: "How would you like to continue?",
    patientRole: "Patient",
    doctorRole: "Doctor / Health Worker",
    adminRole: "Government Admin",
    patientDesc: "Book a doctor, track visits, view medical history and prescriptions.",
    doctorDesc: "Receive visit requests, manage availability, navigate and prescribe.",
    adminDesc: "Monitor district healthcare, view doctor utilization and coverage.",
    demoMode: "Quick Demo Mode",
    findDoctor: "Find Nearest Doctor",
    requestDoctor: "Request Doctor",
    cancel: "Cancel",
    confirm: "Confirm",
    saveVisit: "Save Visit",
    print: "Print",
    downloadPdf: "Download PDF",
    callDoctor: "Call Doctor",
    callAmbulance: "Call Ambulance (108)",
    callHospital: "Call Hospital",
    message: "Message",
    useMyLocation: "Use My Location",
    selectLocationManually: "Select Location Manually",
    urgencyRoutine: "Routine",
    urgencySoon: "Soon",
    urgencyUrgent: "Urgent",
    urgencyEmergency: "Emergency",
    symptomFever: "Fever",
    symptomColdCough: "Cold & Cough",
    symptomStomach: "Stomach Problem",
    symptomSkin: "Skin Problem",
    symptomChild: "Child Health",
    symptomWomen: "Women's Health",
    symptomElderly: "Elderly Care",
    symptomGeneral: "General Consultation",
    onlineStatus: "Online",
    offlineStatus: "Offline — Data will sync automatically",
    syncingData: "Syncing queued data...",
    syncedData: "All data synchronized ✓",
    verifiedDoctor: "Verified Doctor ✓",
    verificationPending: "Verification Pending",
    sosPrompt: "Emergency assistance required?",
    sosNotice: "ETA is the fastest available estimate and depends on ambulance availability.",
    voiceInputTitle: "Describe your symptoms",
    voiceInputTap: "Tap microphone to speak",
    voiceListening: "Listening...",
    etaLabel: "Estimated Arrival",
    distanceLabel: "Distance",
    availableLabel: "Available",
    ratingLabel: "Rating"
  },
  mr: {
    appName: "रूरलकेअर कनेक्ट",
    tagline: "डॉक्टर थेट तुमच्या दारात",
    sihTag: "स्मार्ट इंडिया हॅकाथॉन २०२६ | पीएस २६१३३",
    home: "मुख्यपृष्ठ",
    bookDoctor: "डॉक्टर बोलवा",
    emergencySos: "तातडीची मदत (SOS)",
    medicalRecords: "आरोग्य नोंदी",
    prescriptions: "औषधोपचार चिठ्ठी",
    referrals: "तज्ज्ञ संदर्भ",
    medicines: "औषध साठा",
    profile: "माझी माहिती",
    login: "प्रवेश करा",
    logout: "बाहेर पडा",
    dashboard: "डॅशबोर्ड",
    roleSelectTitle: "तुम्ही कसे पुढे जाऊ इच्छिता?",
    patientRole: "रुग्ण / नागरिक",
    doctorRole: "डॉक्टर / आरोग्य सेवक",
    adminRole: "शासकीय अधिकारी",
    patientDesc: "घरी डॉक्टर बोलवा, तपासणीचा मागोवा घ्या आणि जुनी औषधे पहा.",
    doctorDesc: "रुग्णांचे कॉल स्वीकारा, घरापर्यंत नेव्हिगेट करा आणि डिजिटल चिठ्ठी द्या.",
    adminDesc: "जिल्हा आरोग्य, डॉक्टरांची उपलब्धता आणि साथरोगांवर लक्ष ठेवा.",
    demoMode: "डेमो मोड (१-क्लिक)",
    findDoctor: "जवळचा डॉक्टर शोधा",
    requestDoctor: "डॉक्टर बोलवा",
    cancel: "रद्द करा",
    confirm: "नक्की करा",
    saveVisit: "तपासणी जतन करा",
    print: "प्रिंट करा",
    downloadPdf: "पीडीएफ डाऊनलोड करा",
    callDoctor: "डॉक्टरना फोन करा",
    callAmbulance: "रुग्णवाहिका फोन (१०८)",
    callHospital: "रुग्णालयाशी संपर्क",
    message: "संदेश पाठवा",
    useMyLocation: "माझे सध्याचे ठिकाण वापरा",
    selectLocationManually: "गाव निवडा",
    urgencyRoutine: "नेहमीची",
    urgencySoon: "लवकरच",
    urgencyUrgent: "तातडीची",
    urgencyEmergency: "अतितातडीची (आणीबाणी)",
    symptomFever: "ताप",
    symptomColdCough: "सर्दी व खोकला",
    symptomStomach: "पोटाचे विकार",
    symptomSkin: "त्वचारोग",
    symptomChild: "बाल आरोग्य",
    symptomWomen: "महिला आरोग्य",
    symptomElderly: "ज्येष्ठ नागरिक काळजी",
    symptomGeneral: "सामान्य तपासणी",
    onlineStatus: "इंटरनेट सुरू",
    offlineStatus: "ऑफलाईन — डेटा नंतर स्वयंचलित सिंक होईल",
    syncingData: "डेटा सिंक होत आहे...",
    syncedData: "सर्व डेटा सुरक्षित सिंक झाला ✓",
    verifiedDoctor: "प्रमाणित डॉक्टर ✓",
    verificationPending: "प्रमाणन प्रलंबित",
    sosPrompt: "तातडीची वैद्यकीय मदत हवी आहे का?",
    sosNotice: "अंदाजित वेळ रुग्णवाहिकेच्या उपलब्धतेवर अवलंबून आहे.",
    voiceInputTitle: "तुमचा त्रास सांगा",
    voiceInputTap: "माईकवर टॅप करून बोला",
    voiceListening: "ऐकत आहे...",
    etaLabel: "पोहोचण्याची वेळ",
    distanceLabel: "अंतर",
    availableLabel: "उपलब्ध",
    ratingLabel: "मूल्यांकन"
  },
  hi: {
    appName: "रूरलकेयर कनेक्ट",
    tagline: "डॉक्टर आपके द्वार",
    sihTag: "स्मार्ट इंडिया हैकाथॉन 2026 | पीएस 26133",
    home: "होम",
    bookDoctor: "डॉक्टर बुक करें",
    emergencySos: "आपातकालीन सहायता (SOS)",
    medicalRecords: "चिकित्सा रिकॉर्ड",
    prescriptions: "दवा पर्ची",
    referrals: "रेफरल",
    medicines: "दवा उपलब्धता",
    profile: "प्रोफाइल",
    login: "लॉग इन",
    logout: "लॉग आउट",
    dashboard: "डैशबोर्ड",
    roleSelectTitle: "आप किस रूप में जारी रखना चाहते हैं?",
    patientRole: "मरीज",
    doctorRole: "डॉक्टर / स्वास्थ्य कार्यकर्ता",
    adminRole: "सरकारी अधिकारी",
    patientDesc: "डॉक्टर बुलाएं, विजिट ट्रैक करें, मेडिकल रिकॉर्ड और पर्ची देखें।",
    doctorDesc: "मरीज की रिक्वेस्ट स्वीकार करें, घर तक पहुंचें और डिजिटल पर्चा दें।",
    adminDesc: "जिला स्तर पर स्वास्थ्य सुविधाओं, डॉक्टर उपलब्धता की निगरानी करें।",
    demoMode: "डेमो मोड (तुरंत प्रवेश)",
    findDoctor: "निकटतम डॉक्टर खोजें",
    requestDoctor: "डॉक्टर से अनुरोध करें",
    cancel: "रद्द करें",
    confirm: "पुष्टि करें",
    saveVisit: "विजिट सहेजें",
    print: "प्रिंट करें",
    downloadPdf: "पीडीएफ डाउनलोड करें",
    callDoctor: "डॉक्टर को कॉल करें",
    callAmbulance: "एम्बुलेंस कॉल (108)",
    callHospital: "अस्पताल को कॉल करें",
    message: "संदेश",
    useMyLocation: "मेरा स्थान उपयोग करें",
    selectLocationManually: "स्थान मैन्युअल रूप से चुनें",
    urgencyRoutine: "सामान्य",
    urgencySoon: "जल्द",
    urgencyUrgent: "जरूरी",
    urgencyEmergency: "आपातकाल",
    symptomFever: "बुखार",
    symptomColdCough: "सर्दी और खांसी",
    symptomStomach: "पेट की समस्या",
    symptomSkin: "त्वचा की समस्या",
    symptomChild: "बाल स्वास्थ्य",
    symptomWomen: "महिला स्वास्थ्य",
    symptomElderly: "बुजुर्गों की देखभाल",
    symptomGeneral: "सामान्य परामर्श",
    onlineStatus: "ऑनलाइन",
    offlineStatus: "ऑफ़लाइन — डेटा स्वचालित रूप से सिंक होगा",
    syncingData: "डेटा सिंक हो रहा है...",
    syncedData: "सभी डेटा सफलतापूर्वक सिंक हुआ ✓",
    verifiedDoctor: "सत्यापित डॉक्टर ✓",
    verificationPending: "सत्यापन लंबित",
    sosPrompt: "क्या आपातकालीन सहायता की आवश्यकता है?",
    sosNotice: "अनुमानित समय एम्बुलेंस की नजदीकी और उपलब्धता पर निर्भर है।",
    voiceInputTitle: "अपने लक्षण बताएं",
    voiceInputTap: "बोलने के लिए माइक दबाएं",
    voiceListening: "सुन रहे हैं...",
    etaLabel: "अनुमानित समय",
    distanceLabel: "दूरी",
    availableLabel: "उपलब्ध",
    ratingLabel: "रेटिंग"
  },
  te: {
    appName: "రూరల్ కేర్ కనెక్ట్",
    tagline: "ఇంటి వద్దకే వైద్యుడు",
    sihTag: "స్మార్ట్ ఇండియా హ్యాకథాన్ 2026 | PS 26133",
    home: "హోమ్",
    bookDoctor: "డాక్టర్‌ను బుక్ చేయండి",
    emergencySos: "అత్యవసర SOS",
    medicalRecords: "వైద్య రికార్డులు",
    prescriptions: "ప్రిస్క్రిప్షన్లు",
    referrals: "రెఫరల్స్",
    medicines: "మందుల లభ్యత",
    profile: "ప్రొఫైల్",
    login: "లాగిన్",
    logout: "లాగ్ అవుట్",
    dashboard: "డాష్‌బోర్డ్",
    roleSelectTitle: "మీరు ఎలా కొనసాగాలనుకుంటున్నారు?",
    patientRole: "రోగి",
    doctorRole: "డాక్టర్ / ఆరోగ్య కార్యకర్త",
    adminRole: "ప్రభుత్వ అధికారి",
    patientDesc: "డాక్టర్‌ను బుక్ చేసుకోండి, సందర్శనలను ట్రాక్ చేయండి, ప్రిస్క్రిప్షన్లను చూడండి.",
    doctorDesc: "రోగుల అభ్యర్థనలను స్వీకరించండి, ఇంటికి నావిగేట్ చేయండి మరియు ప్రిస్క్రైబ్ చేయండి.",
    adminDesc: "జిల్లా ఆరోగ్య సేవలను మరియు వైద్యుల సేవలను పర్యవేక్షించండి.",
    demoMode: "డెమో మోడ్",
    findDoctor: "సమీప వైద్యుడిని కనుగొనండి",
    requestDoctor: "డాక్టర్‌ను అభ్యర్థించండి",
    cancel: "రద్దు చేయండి",
    confirm: "నిర్ధారించండి",
    saveVisit: "విజిట్ సేవ్ చేయండి",
    print: "ప్రింట్ చేయండి",
    downloadPdf: "పీడీఎఫ్ డౌన్‌లోడ్",
    callDoctor: "డాక్టర్‌కి కాల్ చేయండి",
    callAmbulance: "అంబులెన్స్ కాల్ (108)",
    callHospital: "ఆసుపత్రికి కాల్ చేయండి",
    message: "సందేశం",
    useMyLocation: "నా స్థానాన్ని ఉపయోగించండి",
    selectLocationManually: "గ్రామాన్ని ఎంచుకోండి",
    urgencyRoutine: "సాధారణం",
    urgencySoon: "త్వరగా",
    urgencyUrgent: "అత్యవసరం",
    urgencyEmergency: "ఎమర్జెన్సీ",
    symptomFever: "జ్వరం",
    symptomColdCough: "జలుబు మరియు దగ్గు",
    symptomStomach: "కడుపు నొప్పి",
    symptomSkin: "చర్మ సమస్య",
    symptomChild: "పిల్లల ఆరోగ్యం",
    symptomWomen: "మహిళల ఆరోగ్యం",
    symptomElderly: "వృద్ధుల సంరక్షణ",
    symptomGeneral: "సాధారణ సంప్రదింపులు",
    onlineStatus: "ఆన్‌లైన్",
    offlineStatus: "ఆఫ్‌లైన్ — డేటా స్వయంచాలకంగా సింక్ అవుతుంది",
    syncingData: "డేటా సింక్ అవుతోంది...",
    syncedData: "మొత్తం డేటా సురక్షితంగా సింక్ చేయబడింది ✓",
    verifiedDoctor: "ధృవీకరించబడిన వైద్యుడు ✓",
    verificationPending: "ధృవీకరణ పెండింగ్‌లో ఉంది",
    sosPrompt: "అత్యవసర సహాయం కావాలా?",
    sosNotice: "అంచనా వేసిన సమయం అంబులెన్స్ లభ్యతపై ఆధారపడి ఉంటుంది.",
    voiceInputTitle: "మీ లక్షణాలను వివరించండి",
    voiceInputTap: "మాట్లాడటానికి మైక్‌ను నొక్కండి",
    voiceListening: "వింటున్నారు...",
    etaLabel: "చేరుకునే సమయం",
    distanceLabel: "దూరం",
    availableLabel: "అందుబాటులో ఉంది",
    ratingLabel: "రేటింగ్"
  }
};
