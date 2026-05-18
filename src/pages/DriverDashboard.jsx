import React from 'react';
import MapComponent from '../components/MapComponent';
import DriverPanel from '../components/DriverPanel';

export default function DriverDashboard() {
  return (
    <>
      <MapComponent role="driver" />
      <DriverPanel />
    </>
  );
}
