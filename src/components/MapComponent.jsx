import React, { useEffect, useContext, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import { RideContext } from '../context/RideContext';

const MAP_THEME = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

function MapLogic({ role }) {
  const map = useMap();
  const { routeData, rideRequest } = useContext(RideContext);
  const routingRef = useRef(null);
  
  useEffect(() => {
    if (routeData && routeData.pickupCoords && routeData.dropoffCoords) {
      if (routingRef.current) {
        map.removeControl(routingRef.current);
        routingRef.current = null;
      }
      
      const pick = L.latLng(routeData.pickupCoords.lat, routeData.pickupCoords.lng);
      const drop = L.latLng(routeData.dropoffCoords.lat, routeData.dropoffCoords.lng);
      
      let ways = [pick, drop]; 
      let styles = [{color: '#6366f1', opacity: 0.9, weight: 6}]; // Indigo trip default

      if (rideRequest?.status === 'accepted' || rideRequest?.status === 'arrived') {
         const driverLoc = L.latLng(routeData.pickupCoords.lat + 0.015, routeData.pickupCoords.lng + 0.015);
         ways = [driverLoc, pick];
         styles = [{color: '#10b981', opacity: 0.9, weight: 6}]; // Green driver coming
      } else if (rideRequest?.status === 'in_progress') {
         ways = [pick, drop];
         styles = [{color: '#3b82f6', opacity: 0.9, weight: 6}]; // Blue transit active
      }
      
      routingRef.current = L.Routing.control({
          waypoints: ways,
          lineOptions: { styles: styles }, 
          createMarker: function(i, wp) {
            if(i === 0) return L.circleMarker(wp.latLng, {radius: 8, color:'#fff', fillColor:'#000', fillOpacity: 1, weight:3});
            return L.circleMarker(wp.latLng, {radius: 8, color:'#fff', fillColor:'#22c55e', fillOpacity: 1, weight:3});
          },
          show: false, addWaypoints: false, routeWhileDragging: false, fitSelectedRoutes: true
      }).addTo(map);
    }

    return () => {
      if (routingRef.current) map.removeControl(routingRef.current);
    };
    // eslint-disable-next-line
  }, [routeData, rideRequest?.status]);
  
  return null;
}

export default function MapComponent({ role }) {
  const { mapVisible } = useContext(RideContext);

  return (
    <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${mapVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <MapContainer 
        center={[20.5937, 78.9629]} 
        zoom={5} 
        zoomControl={false}
        className="w-full h-full filter brightness-75 contrast-[1.2] saturate-[1.3]"
      >
        <TileLayer url={MAP_THEME} attribution="&copy; CARTO" />
        <MapLogic role={role} />
      </MapContainer>
    </div>
  );
}
