import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';

export default function Login() {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [role, setRole] = useState('customer');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState(1);

  if (user) {
    return <Navigate to={user.role === 'customer' ? '/rider' : '/driver'} replace />;
  }

  const handleLogin = () => {
    login(phone, role);
    navigate(role === 'customer' ? '/rider' : '/driver');
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 text-white p-8 rounded-4xl w-full max-w-sm shadow-2xl flex flex-col items-center animate-slide-up">
        
        <div className="w-16 h-16 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
          <span className="text-white font-extrabold text-2xl tracking-tighter">FR</span>
        </div>
        
        <h1 className="text-3xl font-extrabold mb-1">FairRide</h1>
        <p className="text-gray-300 mb-8 font-medium">Reimagining transport.</p>
        
        <div className="flex w-full gap-2 mb-6 bg-black/20 p-1.5 rounded-2xl border border-white/10">
          <button 
            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 ${role === 'customer' ? 'bg-white/20 shadow-sm text-white border border-white/20' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setRole('customer')}
          >
            Rider
          </button>
          <button 
            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 ${role === 'driver' ? 'bg-white/20 shadow-sm text-white border border-white/20' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setRole('driver')}
          >
            Driver
          </button>
        </div>
        
        {step === 1 ? (
          <>
            <input 
              type="tel" 
              placeholder="Enter mobile number" 
              className="w-full p-4 text-lg bg-black/20 border border-white/20 focus:border-white rounded-2xl outline-none transition-all placeholder-gray-400 font-semibold"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button 
              onClick={() => { if(phone) setStep(2) }}
              className="w-full mt-6 bg-linear-to-r from-indigo-600 to-purple-600 text-white p-4 font-bold text-lg rounded-2xl hover:brightness-110 shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight size={20} />
            </button>
          </>
        ) : (
          <>
            <input 
              type="text" 
              placeholder="Enter 4-digit OTP" 
              className="w-full p-4 text-center tracking-[1em] text-lg bg-black/20 border border-white/20 focus:border-white rounded-2xl outline-none transition-all placeholder-gray-400 font-bold"
            />
            <button 
              onClick={handleLogin}
              className="w-full mt-6 bg-linear-to-r from-indigo-600 to-purple-600 text-white p-4 font-bold text-lg rounded-2xl hover:brightness-110 shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all active:scale-95"
            >
              Verify & Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
