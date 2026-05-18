import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { ArrowRight } from 'lucide-react';

export default function AuthPanel() {
  const { setUser } = useContext(AppContext);
  const [role, setRole] = useState('customer');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState(1);

  const handleLogin = () => {
    setUser({ phone, role, name: role === 'driver' ? 'Sanjay Kumar' : 'Rahul Sharma' });
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white text-black p-8 rounded-4xl w-full max-w-sm shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col items-center animate-slide-up">
        
        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6">
          <span className="text-white font-extrabold text-2xl tracking-tighter">FR</span>
        </div>
        
        <h1 className="text-3xl font-extrabold mb-1">FairRide</h1>
        <p className="text-gray-500 mb-8 font-medium">Reimagining transport.</p>
        
        <div className="flex w-full gap-2 mb-6 bg-gray-100 p-1.5 rounded-2xl">
          <button 
            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 ${role === 'customer' ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] text-black' : 'text-gray-500 hover:text-black'}`}
            onClick={() => setRole('customer')}
          >
            Rider
          </button>
          <button 
            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 ${role === 'driver' ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] text-black' : 'text-gray-500 hover:text-black'}`}
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
              className="w-full p-4 text-lg bg-gray-100 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl outline-none transition-all font-semibold"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button 
              onClick={() => { if(phone) setStep(2) }}
              className="w-full mt-6 bg-black text-white p-4 font-bold text-lg rounded-2xl hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
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
              className="w-full p-4 text-center tracking-[1em] text-lg bg-gray-100 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl outline-none transition-all font-bold"
            />
            <button 
              onClick={handleLogin}
              className="w-full mt-6 bg-black text-white p-4 font-bold text-lg rounded-2xl hover:bg-gray-800 transition-all active:scale-[0.98]"
            >
              Verify & Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
