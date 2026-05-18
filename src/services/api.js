export const GeoService = {
  getCoordinates: async (query) => {
    if(!query || query.toLowerCase().includes('current')) return null;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
      return null; // Not found
    } catch(e) {
      console.error(e);
      return null;
    }
  }
};
