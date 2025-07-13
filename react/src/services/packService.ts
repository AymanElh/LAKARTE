import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface Pack {
  id: number;
  name: string;
  slug: string;
  description: string;
  type: string;
  price: number;
  delivery_time_days: number;
  is_active: boolean;
  highlight: boolean;
  image_path?: string;
  features?: any[];
}

const packService = {
  async getPacks() {
    try {
      console.log('Calling packs API endpoint:', `${API_URL}/api/packs`);
      const response = await axios.get(`${API_URL}/api/packs`);
      console.log('Raw packs API response:', response);
      return response.data;
    } catch (error) {
      console.error('Packs API error:', error);
      throw error;
    }
  },

  async getPack(slug: string) {
    try {
      const response = await axios.get(`${API_URL}/api/packs/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pack with slug ${slug}:`, error);
      throw error;
    }
  },

  formatPrice(price: number) {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
    }).format(price);
  }
};

export default packService;
