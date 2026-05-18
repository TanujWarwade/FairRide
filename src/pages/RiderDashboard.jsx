import React from 'react';
import MapComponent from '../components/MapComponent';
import CustomerPanel from '../components/CustomerPanel';

export default function RiderDashboard() {
  return (
    <>
      <MapComponent role="customer" />
      <CustomerPanel />
    </>
  );
}
