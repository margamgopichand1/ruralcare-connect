import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Patient, Doctor } from '../types';
import { mockPatients, mockDoctors } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  currentPatient: Patient | null;
  currentDoctor: Doctor | null;
  role: UserRole | null;
  login: (email: string, role: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  quickDemoLogin: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to patient session for instant prototype immersion
  const [role, setRole] = useState<UserRole | null>(() => {
    return (localStorage.getItem('ruralcare_role') as UserRole) || 'patient';
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ruralcare_user');
    if (saved) return JSON.parse(saved);
    return {
      id: "u-pat-1",
      email: "patient@ruralcare.demo",
      name: "Ramesh Patil",
      role: "patient",
      phone: "+91 98221 44512",
      village: "Karegaon, Shirur"
    };
  });

  const [currentPatient, setCurrentPatient] = useState<Patient | null>(mockPatients[0]);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(mockDoctors[0]);

  useEffect(() => {
    if (role === 'patient') {
      setCurrentPatient(mockPatients[0]);
      setUser({
        id: "u-pat-1",
        email: "patient@ruralcare.demo",
        name: "Ramesh Patil",
        role: "patient",
        phone: "+91 98221 44512",
        village: "Karegaon, Shirur"
      });
    } else if (role === 'health_worker') {
      setUser({
        id: "u-asha-1",
        email: "asha.lakshmi@ruralcare.demo",
        name: "Lakshmi Devi (ASHA)",
        role: "health_worker",
        phone: "+91 94230 88122",
        village: "Sub-Centre Karegaon"
      });
    } else if (role === 'doctor') {
      setCurrentDoctor(mockDoctors[0]);
      setUser({
        id: "u-doc-1",
        email: "doctor@ruralcare.demo",
        name: "Dr. Priya Sharma",
        role: "doctor",
        phone: "+91 98230 11844",
        village: "PHC Karegaon"
      });
    } else if (role === 'ambulance') {
      setUser({
        id: "u-amb-1",
        email: "driver.rajesh@ems108.gov.in",
        name: "Rajesh Patil (108 Driver)",
        role: "ambulance",
        phone: "+91 98224 55108",
        village: "108 Base - Shirur Junction"
      });
    } else if (role === 'hospital_admin') {
      setUser({
        id: "u-hosp-1",
        email: "ms.shirur@health.gov.in",
        name: "Dr. Sunita Kulkarni (MS)",
        role: "hospital_admin",
        phone: "+91 2138 222144",
        village: "Shirur Rural Hospital"
      });
    } else if (role === 'district_admin' || role === 'admin') {
      setUser({
        id: "u-admin-1",
        email: "dho.pune@health.gov.in",
        name: "Dr. Vilas Rao (DHO)",
        role: "district_admin",
        phone: "+91 20 2605 1400",
        village: "District Health Office, Pune"
      });
    }
  }, [role]);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('ruralcare_role', newRole);
  };

  const login = (email: string, chosenRole: UserRole) => {
    switchRole(chosenRole);
    return true;
  };

  const quickDemoLogin = (chosenRole: UserRole) => {
    switchRole(chosenRole);
  };

  const logout = () => {
    setRole(null);
    setUser(null);
    localStorage.removeItem('ruralcare_role');
    localStorage.removeItem('ruralcare_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentPatient,
        currentDoctor,
        role,
        login,
        logout,
        switchRole,
        quickDemoLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
