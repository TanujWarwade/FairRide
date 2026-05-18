import React, { useState, useContext } from 'react';
import { RideContext } from '../context/RideContext';
import { Clock, ArrowRight, Navigation } from 'lucide-react';
import { GeoService } from '../services/api';

export default function CustomerPanel() {
  const { rideState, setRideState, broadcastRideRequest, rideRequest, setRouteData, setMapVisible } = useContext(RideContext);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [loading, setLoading] = useState(false);
  const [estDist, setEstDist] = useState(0);

  const containerClass = "absolute bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[400px] bg-black/60 backdrop-blur-3xl border border-white/20 p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] z-50 text-white animate-slide-up flex flex-col gap-4";

  const handleSearch = async () => {
    if(!pickup || !dropoff) return alert("Please enter precise detailed locations to fetch routes.");
    setLoading(true);
    
    const pickCoords = await GeoService.getCoordinates(pickup);
    const dropCoords = await GeoService.getCoordinates(dropoff);
    
    setLoading(false);
    
    if(!pickCoords || !dropCoords) {
      alert("Could not recognize one of the locations via OpenStreetMaps.");
      return;
    }
    
    const R = 6371;
    const dLat = (dropCoords.lat - pickCoords.lat) * Math.PI / 180;
    const dLon = (dropCoords.lng - pickCoords.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(pickCoords.lat * Math.PI/180) * Math.cos(dropCoords.lat * Math.PI/180) * Math.sin(dLon/2)**2;
    const dist = (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))) * 1.3; 
    setEstDist(Math.round(dist));
    
    setRouteData({ pickupCoords: pickCoords, dropoffCoords: dropCoords, distance: dist });
    setMapVisible(true);
    setRideState('options');
  };

  const handleBook = (tier, priceStr) => {
    setRideState('searching');
    broadcastRideRequest({
      status: 'pending',
      pickup, dropoff, tier, price: priceStr,
      customer: 'User' 
    });
  };

  if (rideState === 'active' && rideRequest) {
    if (rideRequest.status === 'accepted') {
      return (
        <div className={containerClass}>
          <div className="w-12 h-1.5 bg-white/30 rounded-full mx-auto mb-2"></div>
          <h2 className="text-2xl font-extrabold text-blue-400">Driver En Route</h2>
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
            <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-2xl shadow-inner">👤</div>
            <div>
              <p className="font-extrabold text-lg tracking-tight">{rideRequest.driverName || 'Driver'}</p>
              <p className="text-gray-300 font-medium text-sm flex items-center gap-2">Premium • <span className="text-white font-bold tracking-wider">MH 12 AB 1234</span></p>
            </div>
          </div>
        </div>
      );
    }
    
    if (rideRequest.status === 'arrived') {
       return (
        <div className={containerClass}>
          <div className="w-12 h-1.5 bg-white/30 rounded-full mx-auto mb-2"></div>
          <h2 className="text-3xl font-extrabold text-green-400 text-center">Driver Arrived</h2>
          <div className="bg-white/10 border border-white/20 py-4 rounded-2xl flex flex-col items-center justify-center shadow-inner mt-2">
            <p className="text-gray-300 text-sm font-bold uppercase tracking-widest mb-1">Verify PIN</p>
            <strong className="text-5xl tracking-[0.3em] ml-4 font-black text-white">7842</strong>
          </div>
        </div>
       );
    }

    if (rideRequest.status === 'in_progress') {
       return (
        <div className={containerClass}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)] rounded-full flex items-center justify-center animate-pulse"><Navigation size={24}/></div>
            <div className="flex-1">
              <h2 className="text-xl font-extrabold text-white">Ride In Progress</h2>
              <p className="text-indigo-200 font-medium text-sm leading-tight mt-1 line-clamp-2">To: {rideRequest.dropoff}</p>
            </div>
          </div>
        </div>
       );
    }
  }

  if (rideState === 'searching') {
    return (
      <div className={containerClass + " items-center text-center"}>
        <div className="w-16 h-16 rounded-full border-4 border-blue-400 border-t-transparent animate-spin my-4 shadow-lg"></div>
        <h2 className="text-xl font-bold tracking-tight">Connecting to Driver...</h2>
        <button onClick={() => { setRideState('idle'); broadcastRideRequest(null); }} className="w-full mt-2 bg-red-500/20 border border-red-500/50 text-red-100 p-4 rounded-2xl font-bold hover:bg-red-500/40 transition-colors">Cancel Request</button>
      </div>
    );
  }

  if (rideState === 'options') {
    const miniPrice = Math.round(estDist * 12);
    const sedanPrice = Math.round(estDist * 18);
    return (
      <div className={containerClass}>
        <div className="w-12 h-1.5 bg-white/30 rounded-full mx-auto mb-2"></div>
        <h2 className="text-xl font-extrabold px-1 tracking-tight">Select Ride</h2>
        <div className="flex flex-col gap-3">
          <div onClick={() => handleBook('FairRide Mini', `₹${miniPrice}`)} className="flex items-center justify-between p-4 bg-black/40 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
            <div className="flex items-center gap-3">
              <span className="text-4xl drop-shadow-md">🚕</span>
              <div>
                <p className="font-extrabold text-md">Intercity Mini</p>
                <div className="flex items-center gap-1 text-xs text-gray-300 font-medium mt-0.5"><Clock size={12} className="text-blue-400"/> ~{Math.round(estDist)} km</div>
              </div>
            </div>
            <p className="font-extrabold text-lg text-green-400">₹{miniPrice}</p>
          </div>
          <div onClick={() => handleBook('FairRide Sedan', `₹${sedanPrice}`)} className="flex items-center justify-between p-4 bg-black/40 border border-blue-500/50 rounded-2xl cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:bg-white/10 transition-all">
            <div className="flex items-center gap-3">
              <span className="text-4xl drop-shadow-md brightness-110">🚘</span>
              <div>
                <p className="font-extrabold text-md">Premium Sedan</p>
                <div className="flex items-center gap-1 text-xs text-gray-300 font-medium mt-0.5"><Clock size={12} className="text-blue-400"/> Comfort</div>
              </div>
            </div>
            <p className="font-extrabold text-lg text-green-400">₹{sedanPrice}</p>
          </div>
        </div>
        <button onClick={() => { setRideState('idle'); setMapVisible(false); }} className="w-full mt-2 bg-white/10 border border-white/20 text-white p-3 font-bold rounded-xl hover:bg-white/20 transition-colors">Back</button>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <h2 className="text-2xl font-extrabold tracking-tight px-2">Plan Journey</h2>
      <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col relative shadow-inner">
        <div className="absolute left-6 top-8 bottom-8 w-[2px] bg-white/20 z-0"></div>
        <div className="flex items-center gap-4 relative z-10 py-1">
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_0_3px_rgba(59,130,246,0.3)]"></div>
          <input type="text" placeholder="Pickup (e.g. Pune Station)" className="flex-1 bg-transparent text-md font-bold outline-none border-none placeholder-gray-400 text-white" value={pickup} onChange={e => setPickup(e.target.value)} />
        </div>
        <div className="h-px bg-white/10 ml-9 my-2"></div>
        <div className="flex items-center gap-4 relative z-10 py-1">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-sm shadow-[0_0_0_3px_rgba(34,197,94,0.3)]"></div>
          <input type="text" placeholder="Dropoff (e.g. Mumbai Airport)" className="flex-1 bg-transparent text-md font-bold outline-none border-none placeholder-gray-400 text-white" value={dropoff} onChange={e => setDropoff(e.target.value)} />
        </div>
      </div>
      <button onClick={handleSearch} disabled={loading} className="w-full mt-2 flex items-center justify-between bg-white text-black p-4 font-bold text-lg rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50">
        <span>{loading ? 'Routing...' : 'Find Routes'}</span>
        {!loading && <ArrowRight size={20} />}
      </button>
    </div>
  );
}
