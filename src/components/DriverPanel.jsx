import React, { useContext, useState } from 'react';
import { RideContext } from '../context/RideContext';
import { Navigation, ShieldCheck, MapPin } from 'lucide-react';

export default function DriverPanel() {
  const { rideRequest, broadcastRideRequest } = useContext(RideContext);
  const [isOnline, setIsOnline] = useState(true);
  const [otp, setOtp] = useState('');

  const containerClass = "absolute bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[400px] bg-black/60 backdrop-blur-3xl border border-white/20 p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 text-white animate-slide-up flex flex-col gap-4";

  const handleAccept = () => broadcastRideRequest({ ...rideRequest, status: 'accepted', driverName: 'Sanjay Kumar' });
  const handleDecline = () => broadcastRideRequest(null);
  const handleArrived = () => broadcastRideRequest({ ...rideRequest, status: 'arrived' });
  
  const handleVerifyOTP = () => {
    if(otp === '7842') broadcastRideRequest({...rideRequest, status: 'in_progress'});
    else alert("Invalid Driver OTP! Let's ensure passenger safety (Try: 7842)");
  };

  const handleComplete = () => broadcastRideRequest(null);

  return (
    <>
      <div className="absolute top-6 right-6 z-50 animate-slide-up bg-black/60 backdrop-blur-xl border border-white/20 text-white font-bold p-3 px-5 rounded-full shadow-lg flex items-center gap-3 cursor-pointer" onClick={() => setIsOnline(!isOnline)}>
        <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400 shadow-[0_0_10px_#4ade80]' : 'bg-gray-500'}`}></div>
        <span>{isOnline ? 'Online' : 'Offline'}</span>
      </div>

      <div className={containerClass}>
        {!isOnline ? (
          <div className="text-center py-4">
            <h2 className="text-2xl font-bold text-gray-400">Offline</h2>
            <p className="text-sm mt-1 text-gray-500">Go online to receive trips.</p>
          </div>
        ) : !rideRequest ? (
          <div className="text-center py-2 flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-500/20 border border-blue-400/30 rounded-full flex items-center justify-center mb-3">
              <span className="text-3xl animate-pulse">📡</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">Finding Trips</h2>
            <p className="text-gray-400 text-sm mt-1">Waiting for requests.</p>
          </div>
        ) : rideRequest.status === 'pending' ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold text-blue-400">New Request</h2>
              <span className="bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)] text-black px-3 py-1 rounded-lg font-black text-lg">{rideRequest.price}</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
              <p className="font-bold text-gray-400 text-xs mb-2 uppercase tracking-wider">{rideRequest.tier}</p>
              <div className="flex flex-col relative w-full">
                <div className="absolute left-[5px] top-[14px] bottom-[10px] w-[2px] bg-white/10"></div>
                <p className="font-bold text-md flex items-center gap-4 mb-3 relative z-10"><span className="w-3 h-3 rounded-full border-[2px] border-black bg-blue-400 shadow-[0_0_0_2px_rgba(96,165,250,0.5)]"></span> <span className="line-clamp-1">{rideRequest.pickup}</span></p>
                <p className="font-bold text-md flex items-center gap-4 relative z-10"><span className="w-3 h-3 bg-green-500 rounded-sm shadow-[0_0_0_2px_rgba(34,197,94,0.5)]"></span> <span className="line-clamp-1">{rideRequest.dropoff}</span></p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleDecline} className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-xl text-red-200 hover:bg-red-500/40 transition-colors">✕</button>
              <button onClick={handleAccept} className="flex-1 bg-white text-black hover:bg-gray-200 font-extrabold text-lg rounded-2xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">Accept</button>
            </div>
          </div>
        ) : rideRequest.status === 'accepted' ? (
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-extrabold text-blue-400">Heading to Pickup</h2>
            <p className="text-white font-bold mb-2 flex items-center gap-2 bg-white/10 p-3 rounded-xl"><MapPin size={18}/> <span className="line-clamp-1">{rideRequest.pickup}</span></p>
            <button onClick={handleArrived} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg p-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]">Arrived</button>
          </div>
        ) : rideRequest.status === 'arrived' ? (
          <div className="flex flex-col gap-3 items-center">
            <h2 className="text-xl font-extrabold text-green-400">Verify OTP</h2>
            <p className="text-gray-300 text-sm">Ask passenger for their PIN.</p>
            <input type="text" placeholder="####" className="w-full bg-black/40 border border-white/20 rounded-xl p-4 text-center text-2xl tracking-[1em] outline-none font-extrabold focus:border-blue-500 text-white mx-auto block" value={otp} onChange={e=>setOtp(e.target.value)} />
            <button onClick={handleVerifyOTP} className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-extrabold text-lg p-4 rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)]"><ShieldCheck size={20}/> Start Ride</button>
          </div>
        ) : rideRequest.status === 'in_progress' ? (
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-extrabold text-green-400 flex items-center gap-2"><Navigation size={20}/> Routing to Dropoff</h2>
            <p className="text-white font-bold mb-2 bg-white/10 p-3 rounded-xl line-clamp-2">{rideRequest.dropoff}</p>
            <button onClick={handleComplete} className="w-full bg-red-500 hover:bg-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] font-bold text-lg p-4 rounded-xl transition-all">End Trip</button>
          </div>
        ) : null}
      </div>
    </>
  );
}
