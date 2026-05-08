import axios from 'axios';

export interface ISSLocationResponse {
  message: string;
  timestamp: number;
  iss_position: {
    latitude: string;
    longitude: string;
  };
}

export interface NominatimResponse {
  display_name?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    country?: string;
    ocean?: string;
    sea?: string;
    state?: string;
  };
  error?: string;
}

export interface Astronaut {
  name: string;
  craft: string;
}

export interface AstrosResponse {
  message: string;
  number: number;
  people: Astronaut[];
}

export const api = {
  getISSLocation: async (): Promise<ISSLocationResponse> => {
    try {
      // Use where the ISS at API for direct HTTPS client-side fetch on Vercel
      const response = await axios.get('https://api.wheretheiss.at/v1/satellites/25544');
      const data = response.data;
      return {
        message: "success",
        timestamp: data.timestamp,
        iss_position: {
          latitude: data.latitude.toString(),
          longitude: data.longitude.toString()
        }
      };
    } catch (error) {
      // Fallback to local proxy if it exists
      const response = await axios.get('/api/iss-now');
      return response.data;
    }
  },

  getNearestPlace: async (lat: string | number, lon: string | number): Promise<string> => {
    try {
      const response = await axios.get<NominatimResponse>(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
        {
          headers: {
            // Nominatim requires a user-agent
            'User-Agent': 'ISS-Live-Tracker-App',
          },
        }
      );

      const data = response.data;
      
      if (data.error) {
        return 'Ocean / Remote Area';
      }

      if (data.address) {
        const place = data.address.city || 
                      data.address.town || 
                      data.address.village || 
                      data.address.ocean || 
                      data.address.sea || 
                      data.address.state || 
                      data.address.country;
        
        const country = data.address.country;
        
        if (place && country && place !== country) {
          return `${place}, ${country}`;
        }
        return place || 'Ocean / Remote Area';
      }
      
      return 'Ocean / Remote Area';
    } catch (error) {
      console.warn('Failed to fetch location name', error);
      return 'Unknown Location';
    }
  },

  getAstronauts: async (): Promise<AstrosResponse> => {
    const response = await axios.get('/api/astros');
    return response.data;
  }
};
