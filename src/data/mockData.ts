import {
  Patient,
  Doctor,
  Facility,
  Ambulance,
  MedicalRecordItem,
  VisitRequest,
  MedicineItem,
  DistrictMetrics,
  NotificationItem,
  NearbyProvider,
  QueueItem,
  DiagnosticTestItem,
  DiagnosticBooking,
  HighRiskPatient,
  PreArrivalAlert,
  AuditLogItem
} from '../types';

export const mockPatients: Patient[] = [
  {
    id: "pat-1",
    userId: "u-pat-1",
    name: "Ramesh Patil",
    age: 48,
    gender: "Male",
    phone: "+91 98221 44512",
    village: "Karegaon",
    taluka: "Shirur",
    district: "Pune",
    emergencyContact: {
      name: "Sunita Patil",
      relationship: "Spouse",
      phone: "+91 98221 44513"
    },
    bloodGroup: "B+",
    allergies: ["Penicillin", "Sulfa Drugs"],
    medicalConditions: ["Mild Hypertension", "Type 2 Diabetes (Borderline)"],
    preferredLanguage: "mr",
    abhaId: "14-8892-3021-9981",
    lat: 18.8256,
    lng: 74.3721
  },
  {
    id: "pat-2",
    userId: "u-pat-2",
    name: "Anandi Bai Shinde",
    age: 67,
    gender: "Female",
    phone: "+91 94210 33819",
    village: "Pabal",
    taluka: "Shirur",
    district: "Pune",
    emergencyContact: {
      name: "Ganesh Shinde",
      relationship: "Son",
      phone: "+91 94210 33820"
    },
    bloodGroup: "O+",
    allergies: ["Aspirin"],
    medicalConditions: ["Osteoarthritis", "Hypertension"],
    preferredLanguage: "mr",
    abhaId: "14-5541-7712-4402",
    lat: 18.8410,
    lng: 74.3215
  },
  {
    id: "pat-3",
    userId: "u-pat-3",
    name: "Tukaram Gaikwad",
    age: 54,
    gender: "Male",
    phone: "+91 98811 72610",
    village: "Otur",
    taluka: "Junnar",
    district: "Pune",
    emergencyContact: {
      name: "Savita Gaikwad",
      relationship: "Spouse",
      phone: "+91 98811 72611"
    },
    bloodGroup: "A+",
    allergies: [],
    medicalConditions: ["Asthma"],
    preferredLanguage: "mr",
    abhaId: "14-9912-1102-8874",
    lat: 19.2612,
    lng: 73.9840
  },
  {
    id: "pat-4",
    userId: "u-pat-4",
    name: "Pooja Jadhav",
    age: 26,
    gender: "Female",
    phone: "+91 88882 19934",
    village: "Manchar",
    taluka: "Ambegaon",
    district: "Pune",
    emergencyContact: {
      name: "Vikram Jadhav",
      relationship: "Brother",
      phone: "+91 88882 19935"
    },
    bloodGroup: "AB+",
    allergies: [],
    medicalConditions: ["Pregnancy - Second Trimester"],
    preferredLanguage: "mr",
    abhaId: "14-3321-4491-6672",
    lat: 19.0124,
    lng: 73.9450
  },
  {
    id: "pat-5",
    userId: "u-pat-5",
    name: "Dnyaneshwar More",
    age: 35,
    gender: "Male",
    phone: "+91 97631 88201",
    village: "Chakan Rural",
    taluka: "Khed",
    district: "Pune",
    emergencyContact: {
      name: "Archana More",
      relationship: "Spouse",
      phone: "+91 97631 88202"
    },
    bloodGroup: "O-",
    allergies: ["Ibuprofen"],
    medicalConditions: [],
    preferredLanguage: "mr",
    abhaId: "14-7719-8821-3310",
    lat: 18.7561,
    lng: 73.8590
  },
  {
    id: "pat-6",
    userId: "u-pat-6",
    name: "Suman Deshmukh",
    age: 72,
    gender: "Female",
    phone: "+91 91580 44299",
    village: "Malegaon Khurd",
    taluka: "Baramati",
    district: "Pune",
    emergencyContact: {
      name: "Sanjay Deshmukh",
      relationship: "Son",
      phone: "+91 91580 44300"
    },
    bloodGroup: "B-",
    allergies: [],
    medicalConditions: ["Chronic Kidney Disease Stage 2", "Hypertension"],
    preferredLanguage: "hi",
    abhaId: "14-6621-9984-2201",
    lat: 18.1524,
    lng: 74.5768
  },
  {
    id: "pat-7",
    userId: "u-pat-7",
    name: "Rahul Bhosle",
    age: 19,
    gender: "Male",
    phone: "+91 95451 22891",
    village: "Patas",
    taluka: "Daund",
    district: "Pune",
    emergencyContact: {
      name: "Kisan Bhosle",
      relationship: "Father",
      phone: "+91 95451 22892"
    },
    bloodGroup: "A+",
    allergies: [],
    medicalConditions: [],
    preferredLanguage: "en",
    abhaId: "14-1182-4471-5509",
    lat: 18.4350,
    lng: 74.4120
  },
  {
    id: "pat-8",
    userId: "u-pat-8",
    name: "Kaveri Kadam",
    age: 41,
    gender: "Female",
    phone: "+91 98900 11478",
    village: "Ghodegaon",
    taluka: "Ambegaon",
    district: "Pune",
    emergencyContact: {
      name: "Mahadev Kadam",
      relationship: "Spouse",
      phone: "+91 98900 11479"
    },
    bloodGroup: "O+",
    allergies: ["Dust Mites"],
    medicalConditions: ["Anemia"],
    preferredLanguage: "mr",
    abhaId: "14-4412-8890-7723",
    lat: 19.0450,
    lng: 73.8320
  }
];

export const mockDoctors: Doctor[] = [
  {
    id: "doc-1",
    userId: "u-doc-1",
    name: "Dr. Priya Sharma",
    qualification: "MBBS, MD (General Medicine)",
    specialization: "General Physician",
    licenseNumber: "MMC/2016/08/2341",
    experience: 12,
    rating: 4.8,
    totalReviews: 248,
    serviceArea: "Shirur & Ranjangaon Rural",
    lat: 18.8290,
    lng: 74.3795,
    isAvailable: true,
    isVerified: true,
    phone: "+91 98230 11844",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    bio: "Passionate public health physician specializing in rural community care, fever diagnostics, and elderly chronic management."
  },
  {
    id: "doc-2",
    userId: "u-doc-2",
    name: "Dr. Anand Deshmukh",
    qualification: "MBBS, DCH (Pediatrics)",
    specialization: "Child Health / Pediatrician",
    licenseNumber: "MMC/2014/05/1190",
    experience: 14,
    rating: 4.9,
    totalReviews: 312,
    serviceArea: "Shirur & Shikrapur",
    lat: 18.8350,
    lng: 74.3850,
    isAvailable: true,
    isVerified: true,
    phone: "+91 98224 88310",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
    bio: "Senior pediatrician dedicated to childhood immunization, nutrition, and acute pediatric infections in rural health centers."
  },
  {
    id: "doc-3",
    userId: "u-doc-3",
    name: "Dr. Sunita Kulkarni",
    qualification: "BAMS, MD (Ayurveda & Integrative Medicine)",
    specialization: "General Practitioner / Integrative",
    licenseNumber: "MMC/2012/03/4921",
    experience: 16,
    rating: 4.7,
    totalReviews: 189,
    serviceArea: "Khed & Chakan",
    lat: 18.7610,
    lng: 73.8650,
    isAvailable: true,
    isVerified: true,
    phone: "+91 94231 66720",
    avatar: "https://images.unsplash.com/photo-1594824813589-322194600e57?auto=format&fit=crop&q=80&w=300",
    bio: "Integrative medicine practitioner focusing on chronic arthritis, digestive disorders, and rural wellness camps."
  },
  {
    id: "doc-4",
    userId: "u-doc-4",
    name: "Dr. Rajesh Shinde",
    qualification: "MBBS, MS (Orthopedics)",
    specialization: "Orthopedics & Trauma",
    licenseNumber: "MMC/2010/11/0812",
    experience: 18,
    rating: 4.6,
    totalReviews: 142,
    serviceArea: "Baramati & Daund",
    lat: 18.1580,
    lng: 74.5820,
    isAvailable: false,
    isVerified: true,
    phone: "+91 98902 44119",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300",
    bio: "Orthopedic surgeon specializing in farm labor musculoskeletal injuries, joint pain, and rural trauma stabilization."
  },
  {
    id: "doc-5",
    userId: "u-doc-5",
    name: "Dr. Meera Joshi",
    qualification: "MBBS, DGO (Obstetrics & Gynecology)",
    specialization: "Women's Health / Gynecologist",
    licenseNumber: "MMC/2017/09/3321",
    experience: 10,
    rating: 4.9,
    totalReviews: 290,
    serviceArea: "Ambegaon & Manchar",
    lat: 19.0150,
    lng: 73.9480,
    isAvailable: true,
    isVerified: true,
    phone: "+91 97640 11984",
    avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=300",
    bio: "Passionate about maternal healthcare, antenatal checkups, and cervical cancer screenings in tribal and rural areas."
  },
  {
    id: "doc-6",
    userId: "u-doc-6",
    name: "Dr. Vikram Jadhav",
    qualification: "MBBS (Emergency Medicine Fellow)",
    specialization: "Emergency Care & General",
    licenseNumber: "MMC/2019/02/7710",
    experience: 7,
    rating: 4.7,
    totalReviews: 110,
    serviceArea: "Daund & Patas",
    lat: 18.4380,
    lng: 74.4150,
    isAvailable: true,
    isVerified: true,
    phone: "+91 91588 33400",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300",
    bio: "Emergency first-responder doctor managing snakebites, acute trauma, cardiac emergencies, and fever outbreaks."
  },
  {
    id: "doc-7",
    userId: "u-doc-7",
    name: "Dr. Swati More",
    qualification: "BAMS, CGO",
    specialization: "Women & Child Care",
    licenseNumber: "MMC/2015/07/5541",
    experience: 11,
    rating: 4.8,
    totalReviews: 175,
    serviceArea: "Shirur Rural & Pabal",
    lat: 18.8430,
    lng: 74.3250,
    isAvailable: true,
    isVerified: true,
    phone: "+91 98226 55012",
    avatar: "https://images.unsplash.com/photo-1594824813589-322194600e57?auto=format&fit=crop&q=80&w=300",
    bio: "Dedicated to adolescent girls health, nutritional anemia, and doorstep maternal checkups."
  },
  {
    id: "doc-8",
    userId: "u-doc-8",
    name: "Dr. Nitin Chavan",
    qualification: "MBBS, MD (Pulmonology / Chest)",
    specialization: "Respiratory & Chest Physician",
    licenseNumber: "MMC/2013/04/9021",
    experience: 15,
    rating: 4.8,
    totalReviews: 215,
    serviceArea: "Junnar & Otur",
    lat: 19.2650,
    lng: 73.9880,
    isAvailable: true,
    isVerified: true,
    phone: "+91 94220 77411",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300",
    bio: "Expert in seasonal respiratory infections, rural COPD from biomass smoke, and asthma management."
  },
  {
    id: "doc-9",
    userId: "u-doc-9",
    name: "Dr. Kavita Pawar",
    qualification: "MBBS (Community Medicine)",
    specialization: "General Physician",
    licenseNumber: "MMC/2020/01/1045",
    experience: 5,
    rating: 4.6,
    totalReviews: 88,
    serviceArea: "Shirur & Sanaswadi",
    lat: 18.8180,
    lng: 74.3610,
    isAvailable: true,
    isVerified: false, // For testing verification flow
    phone: "+91 98814 99023",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    bio: "Community health physician focusing on primary prevention, village sanitation health audits, and fever triage."
  },
  {
    id: "doc-10",
    userId: "u-doc-10",
    name: "Dr. Santosh Gaikwad",
    qualification: "MBBS, DNB (Internal Medicine)",
    specialization: "General Physician / Diabetologist",
    licenseNumber: "MMC/2011/12/3389",
    experience: 17,
    rating: 4.9,
    totalReviews: 340,
    serviceArea: "Junnar Rural",
    lat: 19.2100,
    lng: 73.8750,
    isAvailable: true,
    isVerified: true,
    phone: "+91 98229 11330",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
    bio: "Senior physician managing complex metabolic syndromes, hypertension, and vector-borne seasonal diseases."
  }
];

export const mockFacilities: Facility[] = [
  {
    id: "fac-1",
    name: "PHC Karegaon",
    type: "PHC",
    taluka: "Shirur",
    district: "Pune",
    lat: 18.8280,
    lng: 74.3750,
    contactPhone: "+91 2138 222110",
    totalBeds: 12,
    availableDoctors: 3,
    activeCases: 28,
    coverageStatus: "adequate"
  },
  {
    id: "fac-2",
    name: "PHC Pabal",
    type: "PHC",
    taluka: "Shirur",
    district: "Pune",
    lat: 18.8430,
    lng: 74.3260,
    contactPhone: "+91 2138 234200",
    totalBeds: 10,
    availableDoctors: 2,
    activeCases: 19,
    coverageStatus: "adequate"
  },
  {
    id: "fac-3",
    name: "Rural Hospital Shirur (Sub-District Hospital)",
    type: "District Hospital",
    taluka: "Shirur",
    district: "Pune",
    lat: 18.8260,
    lng: 74.3820,
    contactPhone: "+91 2138 222045",
    totalBeds: 50,
    availableDoctors: 8,
    activeCases: 64,
    coverageStatus: "adequate"
  },
  {
    id: "fac-4",
    name: "PHC Narayangaon",
    type: "PHC",
    taluka: "Junnar",
    district: "Pune",
    lat: 19.1240,
    lng: 73.9780,
    contactPhone: "+91 2132 242111",
    totalBeds: 15,
    availableDoctors: 2,
    activeCases: 42,
    coverageStatus: "needs_attention"
  },
  {
    id: "fac-5",
    name: "Sub-District Hospital Manchar",
    type: "District Hospital",
    taluka: "Ambegaon",
    district: "Pune",
    lat: 19.0140,
    lng: 73.9460,
    contactPhone: "+91 2133 223150",
    totalBeds: 100,
    availableDoctors: 12,
    activeCases: 89,
    coverageStatus: "adequate"
  },
  {
    id: "fac-6",
    name: "CHC Ghodegaon",
    type: "CHC",
    taluka: "Ambegaon",
    district: "Pune",
    lat: 19.0460,
    lng: 73.8340,
    contactPhone: "+91 2133 244220",
    totalBeds: 30,
    availableDoctors: 3,
    activeCases: 33,
    coverageStatus: "critical_gap"
  },
  {
    id: "fac-7",
    name: "CHC Chakan",
    type: "CHC",
    taluka: "Khed",
    district: "Pune",
    lat: 18.7580,
    lng: 73.8610,
    contactPhone: "+91 2135 249010",
    totalBeds: 40,
    availableDoctors: 5,
    activeCases: 51,
    coverageStatus: "adequate"
  },
  {
    id: "fac-8",
    name: "Aundh District Hospital",
    type: "District Hospital",
    taluka: "Haveli",
    district: "Pune",
    lat: 18.5720,
    lng: 73.8110,
    contactPhone: "+91 20 2588 3401",
    totalBeds: 300,
    availableDoctors: 45,
    activeCases: 210,
    coverageStatus: "adequate"
  },
  {
    id: "fac-9",
    name: "Sassoon General Hospital & Medical College",
    type: "District Hospital",
    taluka: "Pune City",
    district: "Pune",
    lat: 18.5280,
    lng: 73.8740,
    contactPhone: "+91 20 2612 8000",
    totalBeds: 1296,
    availableDoctors: 160,
    activeCases: 850,
    coverageStatus: "adequate"
  }
];

export const mockAmbulances: Ambulance[] = [
  {
    id: "amb-1",
    vehicleNumber: "MH-12-RN-4421",
    driverName: "Kishore Sonawane",
    driverPhone: "+91 98220 54109",
    baseLocation: "Shirur Rural Station",
    lat: 18.8270,
    lng: 74.3760,
    isAvailable: true,
    estimatedEtaMinutes: 8
  },
  {
    id: "amb-2",
    vehicleNumber: "MH-12-QZ-8812",
    driverName: "Ashok Jagtap",
    driverPhone: "+91 94210 99401",
    baseLocation: "Shikrapur Bypass",
    lat: 18.8150,
    lng: 74.3410,
    isAvailable: true,
    estimatedEtaMinutes: 14
  },
  {
    id: "amb-3",
    vehicleNumber: "MH-14-AX-3390",
    driverName: "Dattatraya Shinde",
    driverPhone: "+91 97632 11044",
    baseLocation: "Manchar Sub-District",
    lat: 19.0130,
    lng: 73.9440,
    isAvailable: true,
    estimatedEtaMinutes: 18
  },
  {
    id: "amb-4",
    vehicleNumber: "MH-12-KP-7711",
    driverName: "Sanjay Bhosale",
    driverPhone: "+91 91580 77312",
    baseLocation: "Narayangaon Highway",
    lat: 19.1220,
    lng: 73.9750,
    isAvailable: false,
    estimatedEtaMinutes: 25
  },
  {
    id: "amb-5",
    vehicleNumber: "MH-42-AA-9901",
    driverName: "Balasaheb Thorat",
    driverPhone: "+91 98901 88490",
    baseLocation: "Baramati District Hub",
    lat: 18.1560,
    lng: 74.5800,
    isAvailable: true,
    estimatedEtaMinutes: 12
  }
];

export const mockMedicines: MedicineItem[] = [
  {
    id: "med-1",
    name: "Paracetamol 500mg",
    genericName: "Paracetamol (Acetaminophen)",
    category: "Antipyretic / Analgesic",
    description: "Standard essential drug for fever, headache, and mild-to-moderate body ache.",
    dosageForm: "Tablet",
    stocks: [
      {
        facilityId: "fac-1",
        facilityName: "PHC Karegaon",
        facilityType: "PHC",
        quantity: 120,
        status: "in_stock",
        distanceKm: 0.8,
        contactPhone: "+91 2138 222110"
      },
      {
        facilityId: "fac-2",
        facilityName: "PHC Pabal",
        facilityType: "PHC",
        quantity: 12,
        status: "low_stock",
        distanceKm: 4.5,
        contactPhone: "+91 2138 234200"
      },
      {
        facilityId: "fac-3",
        facilityName: "Rural Hospital Shirur",
        facilityType: "District Hospital",
        quantity: 850,
        status: "in_stock",
        distanceKm: 2.1,
        contactPhone: "+91 2138 222045"
      },
      {
        facilityId: "fac-6",
        facilityName: "CHC Ghodegaon",
        facilityType: "CHC",
        quantity: 0,
        status: "out_of_stock",
        distanceKm: 18.2,
        contactPhone: "+91 2133 244220"
      }
    ]
  },
  {
    id: "med-2",
    name: "Amoxicillin 500mg",
    genericName: "Amoxicillin Trihydrate",
    category: "Antibiotic",
    description: "Broad-spectrum penicillin antibiotic for bacterial respiratory, ENT and urinary infections.",
    dosageForm: "Capsule",
    stocks: [
      {
        facilityId: "fac-1",
        facilityName: "PHC Karegaon",
        facilityType: "PHC",
        quantity: 65,
        status: "in_stock",
        distanceKm: 0.8,
        contactPhone: "+91 2138 222110"
      },
      {
        facilityId: "fac-3",
        facilityName: "Rural Hospital Shirur",
        facilityType: "District Hospital",
        quantity: 420,
        status: "in_stock",
        distanceKm: 2.1,
        contactPhone: "+91 2138 222045"
      },
      {
        facilityId: "fac-2",
        facilityName: "PHC Pabal",
        facilityType: "PHC",
        quantity: 8,
        status: "low_stock",
        distanceKm: 4.5,
        contactPhone: "+91 2138 234200"
      }
    ]
  },
  {
    id: "med-3",
    name: "ORS (Oral Rehydration Salts)",
    genericName: "WHO Formulation Oral Rehydration Salts",
    category: "Electrolytes",
    description: "Lifesaving oral rehydration powder for acute diarrheal illness and dehydration prevention.",
    dosageForm: "Powder Sachet",
    stocks: [
      {
        facilityId: "fac-1",
        facilityName: "PHC Karegaon",
        facilityType: "PHC",
        quantity: 340,
        status: "in_stock",
        distanceKm: 0.8,
        contactPhone: "+91 2138 222110"
      },
      {
        facilityId: "fac-2",
        facilityName: "PHC Pabal",
        facilityType: "PHC",
        quantity: 210,
        status: "in_stock",
        distanceKm: 4.5,
        contactPhone: "+91 2138 234200"
      },
      {
        facilityId: "fac-3",
        facilityName: "Rural Hospital Shirur",
        facilityType: "District Hospital",
        quantity: 900,
        status: "in_stock",
        distanceKm: 2.1,
        contactPhone: "+91 2138 222045"
      }
    ]
  },
  {
    id: "med-4",
    name: "Cetirizine 10mg",
    genericName: "Cetirizine Hydrochloride",
    category: "Antihistamine",
    description: "Fast-acting antihistamine for allergic rhinitis, cold sneezing, and allergic skin hives.",
    dosageForm: "Tablet",
    stocks: [
      {
        facilityId: "fac-1",
        facilityName: "PHC Karegaon",
        facilityType: "PHC",
        quantity: 80,
        status: "in_stock",
        distanceKm: 0.8,
        contactPhone: "+91 2138 222110"
      },
      {
        facilityId: "fac-2",
        facilityName: "PHC Pabal",
        facilityType: "PHC",
        quantity: 15,
        status: "low_stock",
        distanceKm: 4.5,
        contactPhone: "+91 2138 234200"
      }
    ]
  },
  {
    id: "med-5",
    name: "Metformin 500mg",
    genericName: "Metformin Hydrochloride",
    category: "Antidiabetic",
    description: "First-line oral blood glucose-lowering therapy for Type 2 diabetes management.",
    dosageForm: "Tablet",
    stocks: [
      {
        facilityId: "fac-1",
        facilityName: "PHC Karegaon",
        facilityType: "PHC",
        quantity: 190,
        status: "in_stock",
        distanceKm: 0.8,
        contactPhone: "+91 2138 222110"
      },
      {
        facilityId: "fac-3",
        facilityName: "Rural Hospital Shirur",
        facilityType: "District Hospital",
        quantity: 650,
        status: "in_stock",
        distanceKm: 2.1,
        contactPhone: "+91 2138 222045"
      }
    ]
  },
  {
    id: "med-6",
    name: "Amlodipine 5mg",
    genericName: "Amlodipine Besylate",
    category: "Antihypertensive",
    description: "Calcium channel blocker for essential blood pressure control in adult rural patients.",
    dosageForm: "Tablet",
    stocks: [
      {
        facilityId: "fac-1",
        facilityName: "PHC Karegaon",
        facilityType: "PHC",
        quantity: 145,
        status: "in_stock",
        distanceKm: 0.8,
        contactPhone: "+91 2138 222110"
      },
      {
        facilityId: "fac-2",
        facilityName: "PHC Pabal",
        facilityType: "PHC",
        quantity: 30,
        status: "low_stock",
        distanceKm: 4.5,
        contactPhone: "+91 2138 234200"
      }
    ]
  }
];

export const mockMedicalRecords: MedicalRecordItem[] = [
  {
    id: "rec-1",
    patientId: "pat-1",
    date: "2026-08-15",
    type: "phc_visit",
    title: "Routine Hypertension Check & Fasting Sugar",
    providerName: "Dr. Santosh Gaikwad",
    facilityName: "PHC Karegaon",
    diagnosis: "Essential Hypertension - Controlled",
    vitals: {
      temperature: "98.4 °F",
      bloodPressure: "128/82 mmHg",
      heartRate: "74 bpm",
      spO2: "98%"
    },
    details: "Patient is compliant with medication. Dietary reduction of table salt advised. Fasting sugar 118 mg/dL."
  },
  {
    id: "rec-2",
    patientId: "pat-1",
    date: "2026-07-20",
    type: "district_hospital",
    title: "Cardiology Screening & ECG Review",
    providerName: "Dr. Arvind Kulkarni",
    facilityName: "Aundh District Hospital",
    diagnosis: "Normal Sinus Rhythm, No Ischemia",
    vitals: {
      temperature: "98.6 °F",
      bloodPressure: "134/84 mmHg",
      heartRate: "78 bpm",
      spO2: "99%"
    },
    details: "Referral follow-up completed. ECG within normal limits. Advised regular brisk morning walking 30 mins."
  },
  {
    id: "rec-3",
    patientId: "pat-1",
    date: "2026-05-10",
    type: "consultation",
    title: "Doorstep Visit - Acute Bronchitis",
    providerName: "Dr. Priya Sharma",
    facilityName: "RuralCare Mobile Visit",
    diagnosis: "Acute Bronchial Allergy with Productive Cough",
    vitals: {
      temperature: "99.8 °F",
      bloodPressure: "124/80 mmHg",
      heartRate: "82 bpm",
      spO2: "97%"
    },
    details: "Prescribed Cetirizine 10mg and steam inhalation. Symptoms resolved in 5 days."
  },
  {
    id: "rec-4",
    patientId: "pat-2",
    date: "2026-08-28",
    type: "consultation",
    title: "Bilateral Knee Osteoarthritis Pain Management",
    providerName: "Dr. Sunita Kulkarni",
    facilityName: "PHC Pabal",
    diagnosis: "Grade 2 Osteoarthritis Both Knees",
    vitals: {
      bloodPressure: "138/88 mmHg",
      heartRate: "76 bpm",
      spO2: "97%"
    },
    details: "Advised quadriceps isometric exercises and hot fomentation. Avoid sitting on floor."
  },
  {
    id: "rec-5",
    patientId: "pat-3",
    date: "2026-09-02",
    type: "consultation",
    title: "Seasonal Asthma Exacerbation Check",
    providerName: "Dr. Nitin Chavan",
    facilityName: "PHC Narayangaon",
    diagnosis: "Moderate Persistent Asthma with Wheezing",
    vitals: {
      temperature: "98.2 °F",
      bloodPressure: "120/78 mmHg",
      heartRate: "86 bpm",
      spO2: "95%"
    },
    details: "Inhaler technique reviewed. Cautioned against early morning farm dust exposure."
  }
];

export const mockVisitRequests: VisitRequest[] = [
  {
    id: "req-1",
    patientId: "pat-1",
    patientName: "Ramesh Patil",
    patientAge: 48,
    patientGender: "Male",
    category: "fever",
    symptoms: "High fever (102°F) since yesterday with severe shivering and body ache.",
    urgency: "urgent",
    lat: 18.8256,
    lng: 74.3721,
    address: "Near Vitthal Temple, Karegaon, Tal. Shirur, Dist. Pune",
    preferredLanguage: "mr",
    doctorId: "doc-1",
    doctorName: "Dr. Priya Sharma",
    doctorSpecialty: "General Physician",
    doctorRating: 4.8,
    status: "completed",
    distanceKm: 1.8,
    etaMinutes: 8,
    requestedAt: "2026-09-09T09:15:00Z",
    acceptedAt: "2026-09-09T09:16:30Z",
    completedAt: "2026-09-09T10:05:00Z",
    vitals: {
      temperature: "101.4 °F",
      bloodPressure: "124/82 mmHg",
      heartRate: "84 bpm",
      spO2: "98%"
    },
    diagnosis: "Acute Viral Pyrexia (Viral Fever)",
    notes: "Patient well-hydrated. Paracetamol 500mg prescribed. If fever persists after 48 hours, blood test for Dengue NS1 recommended."
  },
  {
    id: "req-2",
    patientId: "pat-2",
    patientName: "Anandi Bai Shinde",
    patientAge: 67,
    patientGender: "Female",
    category: "elderly_care",
    symptoms: "Severe dizziness on standing up, mild nausea.",
    urgency: "soon",
    lat: 18.8410,
    lng: 74.3215,
    address: "Bungalow Road, Pabal, Tal. Shirur",
    preferredLanguage: "mr",
    doctorId: "doc-7",
    doctorName: "Dr. Swati More",
    doctorSpecialty: "Women & Child Care",
    doctorRating: 4.8,
    status: "completed",
    distanceKm: 2.3,
    etaMinutes: 12,
    requestedAt: "2026-09-09T11:00:00Z",
    acceptedAt: "2026-09-09T11:02:00Z",
    completedAt: "2026-09-09T11:55:00Z",
    vitals: {
      temperature: "98.2 °F",
      bloodPressure: "105/65 mmHg",
      heartRate: "68 bpm",
      spO2: "97%"
    },
    diagnosis: "Postural Hypotension & Mild Dehydration",
    notes: "Advised adequate fluids with ORS. Gradual postural changes."
  }
];

export const initialDistrictMetrics: DistrictMetrics = {
  totalPatients: 4280,
  activeDoctors: 38,
  visitsToday: 74,
  emergencyCases: 6,
  averageResponseTimeMin: 14.2,
  pendingReferrals: 11,
  talukaCoverage: [
    { taluka: "Shirur", coveragePct: 88, activeDoctors: 9, population: 385000, status: "good" },
    { taluka: "Junnar", coveragePct: 82, activeDoctors: 8, population: 399000, status: "good" },
    { taluka: "Khed", coveragePct: 76, activeDoctors: 7, population: 450000, status: "moderate" },
    { taluka: "Ambegaon", coveragePct: 58, activeDoctors: 3, population: 235000, status: "low" },
    { taluka: "Baramati", coveragePct: 91, activeDoctors: 7, population: 429000, status: "good" },
    { taluka: "Daund", coveragePct: 71, activeDoctors: 4, population: 380000, status: "moderate" }
  ],
  doctorUtilizationRate: 84, // 84%
  requestsTrend: [
    { hour: "06:00", requests: 3 },
    { hour: "08:00", requests: 12 },
    { hour: "10:00", requests: 24 },
    { hour: "12:00", requests: 18 },
    { hour: "14:00", requests: 11 },
    { hour: "16:00", requests: 20 },
    { hour: "18:00", requests: 16 },
    { hour: "20:00", requests: 9 }
  ],
  diseaseOutbreaks: [
    { disease: "Viral Pyrexia (Seasonal Fever)", cases: 68, trend: "increasing", hotspotTaluka: "Junnar" },
    { disease: "Acute Gastroenteritis", cases: 24, trend: "increasing", hotspotTaluka: "Shirur" },
    { disease: "Upper Respiratory Tract Infection", cases: 41, trend: "stable", hotspotTaluka: "Ambegaon" },
    { disease: "Suspected Dengue", cases: 7, trend: "decreasing", hotspotTaluka: "Khed" }
  ],
  criticalAlerts: [
    {
      id: "alt-1",
      type: "doctor_coverage",
      title: "Low Doctor Coverage Detected",
      description: "Ambegaon tribal belt currently has only 3 active doctors on-duty for 235,000 population.",
      severity: "critical",
      time: "25 min ago"
    },
    {
      id: "alt-2",
      type: "medicine_shortage",
      title: "Medicine Stock Running Low",
      description: "Paracetamol 500mg and ORS stock depleted below buffer threshold at PHC Pabal.",
      severity: "warning",
      time: "1 hour ago"
    },
    {
      id: "alt-3",
      type: "disease_spike",
      title: "High Fever Cluster Reported",
      description: "14 viral fever doorstep calls logged in Junnar block over the last 48 hours.",
      severity: "warning",
      time: "3 hours ago"
    }
  ]
};

export const mockNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    recipientRole: "patient",
    title: "Visit Request Accepted",
    message: "Dr. Priya Sharma accepted your visit request. Estimated arrival in 8 minutes.",
    timestamp: "10 min ago",
    read: false,
    type: "visit"
  },
  {
    id: "notif-2",
    recipientRole: "patient",
    title: "Doctor En Route",
    message: "Doctor is approximately 500m away from your location.",
    timestamp: "4 min ago",
    read: false,
    type: "visit"
  },
  {
    id: "notif-3",
    recipientRole: "patient",
    title: "Prescription Ready",
    message: "Prescription added to your unified ABHA digital medical record.",
    timestamp: "Just now",
    read: false,
    type: "record"
  },
  {
    id: "notif-4",
    recipientRole: "doctor",
    title: "Urgent Visit Assigned",
    message: "High fever patient request received in Karegaon village (1.8 km).",
    timestamp: "12 min ago",
    read: false,
    type: "visit"
  },
  {
    id: "notif-5",
    recipientRole: "admin",
    title: "Emergency SOS Escalation",
    message: "108 ALS Ambulance MH-12-RN-4421 dispatched to Karegaon junction.",
    timestamp: "5 min ago",
    read: false,
    type: "sos"
  },
  {
    id: "notif-6",
    recipientRole: "hospital_admin",
    title: "🚨 Emergency Pre-Arrival Alert",
    message: "Incoming 108 ALS Ambulance with suspected cardiac emergency. ETA 12 min. Prepare Resus Bay.",
    timestamp: "2 min ago",
    read: false,
    type: "sos"
  }
];

export const mockNearbyProviders: NearbyProvider[] = [
  {
    id: "prov-1",
    name: "Dr. Ravi Kumar",
    role: "doctor",
    qualification: "MBBS, DNB (Family Medicine)",
    specialization: "General Physician",
    distanceKm: 1.4,
    etaMinutes: 18,
    areaServed: "Karegaon & Ranjangaon Rural",
    services: ["Fever Treatment", "BP & Diabetes Review", "Clinical Diagnosis", "Prescriptions", "Elderly Care"],
    isAvailable: true,
    isVerified: true,
    phone: "+91 98220 11920",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "prov-2",
    name: "Lakshmi Devi",
    role: "asha",
    qualification: "Certified ASHA Community Worker (NHM)",
    specialization: "Frontline Community Health",
    distanceKm: 0.8,
    etaMinutes: 10,
    areaServed: "Karegaon Wards 1 to 4",
    services: ["Basic Check-up", "Blood Pressure Monitoring", "Maternal ANC Check", "Child Immunization Support", "Medicine Delivery"],
    isAvailable: true,
    isVerified: true,
    phone: "+91 94230 88122",
    avatar: "https://images.unsplash.com/photo-1594824813627-81c81ef40d47?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "prov-3",
    name: "Anitha Nurse",
    role: "nurse",
    qualification: "GNM, Registered Nurse & Midwife (MNC)",
    specialization: "Community Health Nursing / ANM",
    distanceKm: 2.1,
    etaMinutes: 22,
    areaServed: "Karegaon Sub-Centre & Phata",
    services: ["Vitals Check (BP, SpO2, Temp)", "Injections & IV Fluids", "Wound Dressing", "Postnatal Follow-up", "Elderly Bedside Care"],
    isAvailable: true,
    isVerified: true,
    phone: "+91 94211 55670",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "prov-4",
    name: "Dr. Priya Sharma",
    role: "doctor",
    qualification: "MBBS, MD (Internal Medicine)",
    specialization: "General Medicine & Tele-Specialist",
    distanceKm: 1.8,
    etaMinutes: 15,
    areaServed: "Shirur Taluka",
    services: ["Teleconsultation", "Prescription", "Secondary Referral", "Infectious Disease Triage"],
    isAvailable: true,
    isVerified: true,
    phone: "+91 98230 11844",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
  }
];

export const mockQueueItems: QueueItem[] = [
  {
    id: "q-1",
    tokenNumber: "A-021",
    patientId: "pat-2",
    patientName: "Anandi Bai Shinde",
    age: 67,
    gender: "Female",
    reason: "Severe dizziness on standing up, history of hypertension",
    priority: "urgent",
    status: "in_consultation",
    estimatedWaitMinutes: 0,
    arrivedAt: "09:15 AM",
    updatedByClinicalStaff: true,
    notes: "Upgraded by Dr. Priya after BP recorded at 178/104 mmHg"
  },
  {
    id: "q-2",
    tokenNumber: "A-024",
    patientId: "pat-3",
    patientName: "Tukaram Gaikwad",
    age: 54,
    gender: "Male",
    reason: "Asthmatic bronchospasm, breathing difficulty with audible wheeze",
    priority: "critical",
    status: "waiting",
    estimatedWaitMinutes: 8,
    arrivedAt: "09:30 AM",
    updatedByClinicalStaff: true,
    notes: "Clinical triage escalated priority over routine tokens"
  },
  {
    id: "q-3",
    tokenNumber: "A-027",
    patientId: "pat-1",
    patientName: "Ramesh Patil",
    age: 48,
    gender: "Male",
    reason: "High fever (102°F), shivering, and acute body aches since yesterday",
    priority: "normal",
    status: "waiting",
    estimatedWaitMinutes: 28,
    arrivedAt: "09:42 AM",
    notes: "Routine queue token allocated via mobile kiosk"
  },
  {
    id: "q-4",
    tokenNumber: "A-029",
    patientId: "pat-6",
    patientName: "Suman Deshmukh",
    age: 72,
    gender: "Female",
    reason: "Monthly hypertension prescription refill & routine creatinine check",
    priority: "normal",
    status: "waiting",
    estimatedWaitMinutes: 44,
    arrivedAt: "09:50 AM",
    notes: "Scheduled follow-up appointment"
  },
  {
    id: "q-5",
    tokenNumber: "A-031",
    patientId: "pat-7",
    patientName: "Rahul Bhosle",
    age: 19,
    gender: "Male",
    reason: "Minor agricultural scratch dressing renewal",
    priority: "normal",
    status: "waiting",
    estimatedWaitMinutes: 58,
    arrivedAt: "10:05 AM"
  }
];

export const mockPreArrivalAlerts: PreArrivalAlert[] = [
  {
    id: "alert-ems-108",
    hospitalId: "fac-4",
    hospitalName: "Shirur Rural Hospital (Sub-District Hospital)",
    ambulanceNumber: "MH-12-RN-4421 (ALS Unit 108)",
    patientName: "Babanrao Jagtap",
    patientAge: 56,
    patientGender: "Male",
    condition: "Suspected Acute Coronary Syndrome (Severe crushing chest pain, SpO2 91%, diaphoresis)",
    priority: "critical",
    etaMinutes: 12,
    requiredCare: "Emergency Department / Cath Lab / Resus Bay 1",
    timestamp: "Just now",
    status: "incoming"
  }
];

export const mockDiagnosticTests: DiagnosticTestItem[] = [
  {
    id: "diag-1",
    name: "Complete Blood Count (CBC) with Platelets",
    category: "Blood Test",
    description: "Evaluates infection markers, hemoglobin, total leukocyte count (TLC), and platelet count for suspected viral/bacterial infections.",
    turnaroundTime: "2 Hours",
    sampleType: "Venous Blood (EDTA)",
    participatingFacilities: ["PHC Karegaon", "Shirur Rural Hospital", "Aundh District Hospital"]
  },
  {
    id: "diag-2",
    name: "12-Lead Electrocardiogram (ECG)",
    category: "Cardiac",
    description: "Records electrical activity of the heart to rule out myocardial infarction, arrhythmia, and conduction blocks.",
    turnaroundTime: "Immediate (15 min)",
    sampleType: "Non-invasive Lead Placement",
    participatingFacilities: ["PHC Karegaon", "Shirur Rural Hospital", "Aundh District Hospital"]
  },
  {
    id: "diag-3",
    name: "Chest X-Ray (PA View)",
    category: "Imaging",
    description: "Digital radiography to evaluate lungs for pneumonia consolidation, pulmonary tuberculosis, or cardiac enlargement.",
    turnaroundTime: "1 Hour",
    sampleType: "Digital Radiography",
    participatingFacilities: ["Shirur Rural Hospital", "Aundh District Hospital"]
  },
  {
    id: "diag-4",
    name: "Ultrasound (USG) Abdomen & Pelvis",
    category: "Imaging",
    description: "High-resolution sonography for maternal fetal well-being, hepatobiliary evaluation, and renal calculus.",
    turnaroundTime: "Same Day",
    sampleType: "Transabdominal Sonography",
    participatingFacilities: ["Shirur Rural Hospital", "Aundh District Hospital"]
  },
  {
    id: "diag-5",
    name: "HbA1c (Glycated Hemoglobin)",
    category: "Blood Test",
    description: "Assesses average blood glucose levels over the past 3 months for long-term diabetes monitoring.",
    turnaroundTime: "4 Hours",
    sampleType: "Whole Blood",
    participatingFacilities: ["PHC Karegaon", "Shirur Rural Hospital"]
  },
  {
    id: "diag-6",
    name: "Sputum Smear Examination for AFB",
    category: "Microbiology",
    description: "Microscopic test for Mycobacterium tuberculosis under National TB Elimination Programme (NTEP).",
    turnaroundTime: "24 Hours",
    sampleType: "Early Morning Sputum",
    participatingFacilities: ["PHC Karegaon", "Shirur Rural Hospital"]
  }
];

export const mockDiagnosticBookings: DiagnosticBooking[] = [
  {
    id: "dbook-1",
    patientId: "pat-1",
    patientName: "Ramesh Patil",
    testId: "diag-1",
    testName: "Complete Blood Count (CBC) with Platelets",
    facilityId: "fac-1",
    facilityName: "PHC Karegaon",
    facilityDistanceKm: 0.8,
    date: "2026-09-10",
    slot: "10:30 AM",
    status: "completed",
    reportUrl: "/reports/cbc_ramesh_patil.pdf",
    reportDate: "2026-09-10 (12:45 PM)",
    findingsSummary: "Hb: 13.8 g/dL (Normal). TLC: 11,400 /uL (Mild Leukocytosis - Bacterial infection marker). Platelets: 2.1 Lakhs. Widal Test: Negative.",
    reviewedByDoctor: "Dr. Priya Sharma"
  },
  {
    id: "dbook-2",
    patientId: "pat-1",
    patientName: "Ramesh Patil",
    testId: "diag-2",
    testName: "12-Lead Electrocardiogram (ECG)",
    facilityId: "fac-1",
    facilityName: "PHC Karegaon",
    facilityDistanceKm: 0.8,
    date: "2026-07-15",
    slot: "11:00 AM",
    status: "completed",
    reportUrl: "/reports/ecg_ramesh_patil.pdf",
    reportDate: "2026-07-15",
    findingsSummary: "Sinus rhythm, HR 78 bpm. No acute ST-T segment elevation or depression. Mild left ventricular strain pattern consistent with borderline hypertension.",
    reviewedByDoctor: "Dr. Priya Sharma"
  }
];

export const mockHighRiskPatients: HighRiskPatient[] = [
  {
    id: "hr-1",
    patientId: "pat-4",
    patientName: "Pooja Jadhav",
    age: 26,
    gender: "Female",
    village: "Manchar",
    taluka: "Ambegaon",
    conditionCategory: "maternal",
    conditionName: "High-Risk Pregnancy (32 Weeks, Severe Anemia Hb 8.1 g/dL)",
    riskLevel: "critical",
    lastVisitDate: "2026-08-20",
    nextFollowUpDate: "2026-09-10",
    status: "overdue",
    missedVisitsCount: 1,
    ashaWorkerAssigned: "Lakshmi Devi (ASHA)",
    ashaPhone: "+91 94230 88122",
    patientPhone: "+91 88882 19934",
    notes: "Requires parenteral Iron Sucrose infusion at CHC Manchar. Transport assistance coordinated."
  },
  {
    id: "hr-2",
    patientId: "pat-6",
    patientName: "Suman Deshmukh",
    age: 72,
    gender: "Female",
    village: "Malegaon Khurd",
    taluka: "Baramati",
    conditionCategory: "chronic_kidney",
    conditionName: "CKD Stage 2 with Refractory Hypertension (BP 176/102)",
    riskLevel: "critical",
    lastVisitDate: "2026-08-28",
    nextFollowUpDate: "2026-09-14",
    status: "due_soon",
    missedVisitsCount: 0,
    ashaWorkerAssigned: "Sarita More (ASHA)",
    ashaPhone: "+91 98210 99401",
    patientPhone: "+91 91580 44299",
    notes: "Serum Creatinine monitoring and ACE inhibitor dose titrations scheduled."
  },
  {
    id: "hr-3",
    patientId: "pat-9",
    patientName: "Aarav Shinde (Child)",
    age: 3,
    gender: "Male",
    village: "Pabal",
    taluka: "Shirur",
    conditionCategory: "child",
    conditionName: "Severe Acute Malnutrition (SAM) & Missed DPT Booster",
    riskLevel: "high",
    lastVisitDate: "2026-08-15",
    nextFollowUpDate: "2026-09-08",
    status: "overdue",
    missedVisitsCount: 2,
    ashaWorkerAssigned: "Lakshmi Devi (ASHA)",
    ashaPhone: "+91 94230 88122",
    patientPhone: "+91 94210 33819",
    notes: "Home visit for Ready-to-Use Therapeutic Food (RUTF) supply and weight tracking needed."
  },
  {
    id: "hr-4",
    patientId: "pat-2",
    patientName: "Anandi Bai Shinde",
    age: 67,
    gender: "Female",
    village: "Pabal",
    taluka: "Shirur",
    conditionCategory: "hypertension",
    conditionName: "Uncontrolled Hypertension with Fall Risk",
    riskLevel: "high",
    lastVisitDate: "2026-08-30",
    nextFollowUpDate: "2026-09-15",
    status: "due_soon",
    missedVisitsCount: 0,
    ashaWorkerAssigned: "Lakshmi Devi (ASHA)",
    ashaPhone: "+91 94230 88122",
    patientPhone: "+91 94210 33819",
    notes: "Home visit scheduled by ANM for bedside BP and mobility assessment."
  }
];

export const mockAuditLogs: AuditLogItem[] = [
  {
    id: "log-1",
    timestamp: "2026-09-12 10:14:02",
    userName: "Dr. Priya Sharma",
    role: "doctor",
    action: "PRIORITY_OVERRIDE",
    resource: "Queue Token A-024 (Tukaram Gaikwad)",
    facility: "PHC Karegaon",
    status: "SUCCESS"
  },
  {
    id: "log-2",
    timestamp: "2026-09-12 09:58:31",
    userName: "Ramesh Patil",
    role: "patient",
    action: "CONSENT_GRANTED_ABHA",
    resource: "Unified Health Record Sharing",
    facility: "Patient Mobile Portal",
    status: "SUCCESS"
  },
  {
    id: "log-3",
    timestamp: "2026-09-12 09:45:10",
    userName: "Rajesh Patil (108 Driver)",
    role: "ambulance",
    action: "EMERGENCY_STATUS_CHANGE",
    resource: "Dispatch SOS-8821 -> En Route",
    facility: "Shirur Highway Sub-station",
    status: "SUCCESS"
  },
  {
    id: "log-4",
    timestamp: "2026-09-12 09:12:44",
    userName: "Lakshmi Devi (ASHA)",
    role: "health_worker",
    action: "OFFLINE_SYNC_COMMITTED",
    resource: "4 Field Registrations Synced",
    facility: "Karegaon Sub-Centre",
    status: "SUCCESS"
  }
];

