import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { User, Stethoscope, Landmark, ArrowRight, ShieldCheck, Key, CheckCircle } from 'lucide-react';

interface RoleSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleSelected: (role: UserRole) => void;
}

export const RoleSelectModal: React.FC<RoleSelectModalProps> = ({
  isOpen,
  onClose,
  onRoleSelected
}) => {
  const { switchRole, quickDemoLogin, role: currentRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole || 'patient');
  const [isCustomLogin, setIsCustomLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSelectRole = (r: UserRole) => {
    setSelectedRole(r);
    if (r === 'patient') {
      setEmail('patient@ruralcare.demo');
      setPassword('patient123');
    } else if (r === 'doctor') {
      setEmail('doctor@ruralcare.demo');
      setPassword('doctor123');
    } else {
      setEmail('admin@ruralcare.demo');
      setPassword('admin123');
    }
  };

  const handleQuickDemo = (r: UserRole) => {
    quickDemoLogin(r);
    onRoleSelected(r);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    quickDemoLogin(selectedRole);
    onRoleSelected(selectedRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-health-700 to-health-900 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl font-bold p-1 rounded-lg hover:bg-white/10 transition"
          >
            ✕
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Role-Based Prototype Authentication</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">How would you like to continue?</h2>
          <p className="text-emerald-100 text-sm mt-1">
            Choose a stakeholder persona to experience the platform from their perspective.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* PATIENT CARD */}
            <div
              onClick={() => handleSelectRole('patient')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                selectedRole === 'patient'
                  ? 'border-health-600 bg-health-50/70 shadow-md ring-2 ring-health-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              {selectedRole === 'patient' && (
                <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-health-600" />
              )}
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-3">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">PATIENT</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Ramesh Patil (Karegaon)
                </p>
                <ul className="mt-3 space-y-1 text-xs text-slate-600">
                  <li>• Book a doctor</li>
                  <li>• Track live visits</li>
                  <li>• View medical history</li>
                  <li>• Get prescriptions</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickDemo('patient');
                }}
                className="mt-4 w-full py-1.5 px-2 bg-health-600 hover:bg-health-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
              >
                1-Click Demo Login
              </button>
            </div>

            {/* DOCTOR CARD */}
            <div
              onClick={() => handleSelectRole('doctor')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                selectedRole === 'doctor'
                  ? 'border-health-600 bg-health-50/70 shadow-md ring-2 ring-health-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              {selectedRole === 'doctor' && (
                <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-health-600" />
              )}
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">DOCTOR</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Dr. Priya Sharma (MBBS, MD)
                </p>
                <ul className="mt-3 space-y-1 text-xs text-slate-600">
                  <li>• Receive visit requests</li>
                  <li>• Manage availability</li>
                  <li>• Navigate to patients</li>
                  <li>• Create prescriptions</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickDemo('doctor');
                }}
                className="mt-4 w-full py-1.5 px-2 bg-health-600 hover:bg-health-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
              >
                1-Click Demo Login
              </button>
            </div>

            {/* ADMIN CARD */}
            <div
              onClick={() => handleSelectRole('admin')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                selectedRole === 'admin'
                  ? 'border-health-600 bg-health-50/70 shadow-md ring-2 ring-health-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              {selectedRole === 'admin' && (
                <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-health-600" />
              )}
              <div>
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-3">
                  <Landmark className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">GOVT ADMIN</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  District Health Officer (Pune)
                </p>
                <ul className="mt-3 space-y-1 text-xs text-slate-600">
                  <li>• Monitor district health</li>
                  <li>• View doctor utilization</li>
                  <li>• Monitor coverage gaps</li>
                  <li>• Disease outbreak trends</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickDemo('admin');
                }}
                className="mt-4 w-full py-1.5 px-2 bg-health-600 hover:bg-health-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
              >
                1-Click Demo Login
              </button>
            </div>
          </div>

          {/* Credentials Preview or Form */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-500" />
                Demo Credentials ({selectedRole})
              </span>
              <button
                type="button"
                onClick={() => setIsCustomLogin(!isCustomLogin)}
                className="text-xs font-semibold text-health-700 hover:underline"
              >
                {isCustomLogin ? 'Use standard demo accounts' : 'Edit credentials'}
              </button>
            </div>

            {isCustomLogin ? (
              <form onSubmit={handleLoginSubmit} className="space-y-3 mt-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-health-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-health-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-health-700 hover:bg-health-800 text-white font-bold rounded-lg text-sm transition shadow-sm"
                >
                  Sign In as {selectedRole.toUpperCase()}
                </button>
              </form>
            ) : (
              <div className="text-xs font-mono text-slate-600 space-y-1">
                <div>Email: <span className="font-bold text-slate-900">{selectedRole}@ruralcare.demo</span></div>
                <div>Password: <span className="font-bold text-slate-900">{selectedRole}123</span></div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleQuickDemo(selectedRole)}
                    className="px-4 py-1.5 bg-health-700 hover:bg-health-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition"
                  >
                    Enter as {selectedRole.toUpperCase()} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
