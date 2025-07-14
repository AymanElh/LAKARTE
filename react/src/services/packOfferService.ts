import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface PackOffer {
  id: number;
  pack_id: number;
  title: string;
  description: string;
  type: 'discount' | 'free_item' | 'bundle';
  value: string;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const packOfferService = {
  async getPackOffers(packId?: number) {
    try {
      console.log('Fetching pack offers...');
      const endpoint = packId
        ? `${API_URL}/api/packs/${packId}/offers`
        : `${API_URL}/api/pack-offers`;

      console.log('Calling API endpoint:', endpoint);
      const response = await axios.get(endpoint);
      console.log('Pack offers API response:', response);
      return response.data;
    } catch (error) {
      console.error('Pack offers API error:', error);
      throw error;
    }
  },

  async getPackOffer(id: number) {
    try {
      const response = await axios.get(`${API_URL}/api/pack-offers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pack offer with id ${id}:`, error);
      throw error;
    }
  },

  formatDiscount(value: string, type: string): string {
    if (type === 'discount') {
      // Check if value is percentage or fixed amount
      if (value.includes('%')) {
        return value;
      } else {
        return `${parseInt(value).toLocaleString('fr-MA')} MAD`;
      }
    } else if (type === 'free_item') {
      return `${value} offert(s)`;
    } else if (type === 'bundle') {
      return value;
    }
    return value;
  }
};

export default packOfferService;
