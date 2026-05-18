export const dbService = {
  subscribeToRideRequest: (callback) => {
    const handler = (e) => {
      if (e.key === 'fairRideApp') {
        const data = e.newValue ? JSON.parse(e.newValue) : null;
        callback(data);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  },
  
  getLatestRideRequest: () => {
    const data = localStorage.getItem('fairRideApp');
    return data ? JSON.parse(data) : null;
  },

  publishRideRequest: (req) => {
    if (req) {
      localStorage.setItem('fairRideApp', JSON.stringify(req));
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'fairRideApp',
        newValue: JSON.stringify(req)
      }));
    } else {
      localStorage.removeItem('fairRideApp');
      window.dispatchEvent(new StorageEvent('storage', { key: 'fairRideApp', newValue: null }));
    }
  }
};
