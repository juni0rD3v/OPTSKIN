import React, { useState } from 'react';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { ToastType } from './Toast';

interface AdminLoginProps {
  onLogin: (role: 'staff' | 'superadmin') => void;
  onBack: () => void;
  showToast: (message: string, type: ToastType) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack, showToast }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Mock Role-Based Authentication
    if (password === 'admin123') {
      onLogin('staff');
      showToast('Welcome back, Staff Member!', 'success');
    } else if (password === 'developer123') {
      onLogin('superadmin');
      showToast('Welcome back, Developer! Full access granted.', 'success');
    } else {
      setError('Invalid Access Code');
      showToast('Invalid access code provided.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 animate-fade-in">
      <div className="absolute top-8 left-8">
        <button 
          onClick={onBack}
          className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Website
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-gold-600" size={32} />
          </div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Portal Access</h1>
          <p className="text-gray-500 text-sm">Enter your access code to view the dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Access Code</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-shadow"
              placeholder="••••••••"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gold-600 transition-colors shadow-lg"
          >
            Login
          </button>

          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2">Restricted Access. Authorized Personnel Only.</p>
            <div className="flex flex-col gap-1 items-center">
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                Staff Code: <strong>admin123</strong>
              </span>
              <span className="text-xs text-gold-700 bg-gold-50 px-2 py-1 rounded border border-gold-200 flex items-center gap-1">
                <ShieldCheck size={10} /> Dev Code: <strong>developer123</strong>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;