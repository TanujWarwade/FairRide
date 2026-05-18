import React, { createContext, useState, useEffect } from 'react';
import { dbService } from '../services/database';

export const RideContext = createContext();

export const RideProvider = ({ children }) => {
  const [rideState, setRideState] = useState('idle'); // idle, options, searching, active
  const [rideRequest, setRideRequest] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [routeData, setRouteData] = useState(null); 

  useEffect(() => {
    const initialReq = dbService.getLatestRideRequest();
    if (initialReq) setRideRequest(initialReq);

    const unsubscribe = dbService.subscribeToRideRequest((data) => {
      setRideRequest(data);
      if(data?.status === 'accepted' || data?.status === 'arrived' || data?.status === 'in_progress') {
         setMapVisible(true);
         setRideState('active'); 
      } else if (!data) {
         setRideState('idle'); 
         setMapVisible(false);
      }
    });

    return unsubscribe;
  }, []);

  const broadcastRideRequest = (req) => {
    setRideRequest(req);
    dbService.publishRideRequest(req);
    if(req && (req.status === 'accepted' || req.status === 'arrived' || req.status === 'in_progress')) {
      setMapVisible(true);
      setRideState('active');
    } else if (!req) {
      setMapVisible(false);
      setRideState('idle');
    }
  };

  return (
    <RideContext.Provider value={{ 
      rideState, setRideState, 
      rideRequest, broadcastRideRequest,
      mapVisible, setMapVisible,
      routeData, setRouteData
    }}>
      {children}
    </RideContext.Provider>
  );
};
