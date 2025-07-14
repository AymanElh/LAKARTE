import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface Template {
  id: number;
  pack_id: number;
  name: string;
  description?: string;
  recto_path?: string;
  verso_path?: string;
  preview_path?: string;
  is_active: boolean;
  tags?: string[];
  pack?: {
    id: number;
    name: string;
    slug: string;
    type: string;
  };
}

const templateService = {
  async getTemplates(params?: { pack_id?: number; pack_slug?: string; search?: string }) {
    try {
      console.log('Calling API endpoint:', `${API_URL}/api/templates`);
      const response = await axios.get(`${API_URL}/api/templates`, { params });
      console.log('Raw API response:', response);
      return response.data;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  async getTemplate(id: number) {
    try {
      const response = await axios.get(`${API_URL}/api/templates/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching template with id ${id}:`, error);
      throw error;
    }
  },

  getImageUrl(path?: string) {
    if (!path) return null;
    return `${API_URL}/storage/${path}`;
  }
};

export default templateService;
