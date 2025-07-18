const API_BASE_URL = 'http://localhost:8080/api/packs';

export interface Template {
  id: number;
  pack_id: number;
  name: string;
  description?: string;
  recto_path?: string;
  recto_url?: string;
  verso_path?: string;
  verso_url?: string;
  is_active: boolean;
  preview_path?: string;
  preview_url?: string;
  tags?: string[];
  pack?: Pack;
  created_at: string;
  updated_at: string;
}

export interface Pack {
  id: number;
  name: string;
  slug: string;
  description: string;
  type: 'standard' | 'pro' | 'sur_mesure';
  price: number;
  delivery_time_days: number;
  is_active: boolean;
  highlight: boolean;
  image_path?: string;
  image_url?: string;
  features?: string[] | Record<string, string | number | boolean>;
  templates_count?: number;
  templates?: Template[];
  created_at: string;
  updated_at: string;
}

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
  pack?: Pack;
}

export interface PacksApiResponse {
  success: boolean;
  data: Pack[];
  message?: string;
}

export interface PackApiResponse {
  success: boolean;
  data: Pack;
  message?: string;
}

export const packService = {
  // Get all active packs
  async getAllPacks(params?: {
    type?: string;
    highlight?: boolean;
  }): Promise<PacksApiResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.type) {
        queryParams.append('type', params.type);
      }
      
      if (params?.highlight !== undefined) {
        queryParams.append('highlight', params.highlight.toString());
      }
      
      const url = queryParams.toString() 
        ? `${API_BASE_URL}?${queryParams.toString()}`
        : API_BASE_URL;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching packs:', error);
      throw error;
    }
  },

  // Get a specific pack by slug
  async getPackBySlug(slug: string): Promise<PackApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/${slug}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching pack:', error);
      throw error;
    }
  },

  // Get highlighted packs only
  async getHighlightedPacks(): Promise<PacksApiResponse> {
    return this.getAllPacks({ highlight: true });
  },

  // Get packs by type
  async getPacksByType(type: 'standard' | 'pro' | 'sur_mesure'): Promise<PacksApiResponse> {
    return this.getAllPacks({ type });
  }
};

export const packOfferService = {
  // Get all active pack offers
  async getAllPackOffers(params?: {
    pack_id?: number;
    type?: string;
  }): Promise<PackOffer[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.pack_id) {
        queryParams.append('pack_id', params.pack_id.toString());
      }
      
      if (params?.type) {
        queryParams.append('type', params.type);
      }
      
      const url = queryParams.toString() 
        ? `http://localhost:8080/api/pack-offers?${queryParams.toString()}`
        : 'http://localhost:8080/api/pack-offers';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching pack offers:', error);
      return [];
    }
  },

  // Get offers for a specific pack
  async getPackOffers(packId: number): Promise<PackOffer[]> {
    try {
      const response = await fetch(`http://localhost:8080/api/pack-offers/pack/${packId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching pack offers:', error);
      return [];
    }
  },

  // Format discount value for display
  formatDiscount(value: string, type: string): string {
    switch (type) {
      case 'discount':
        if (value.includes('%')) {
          return `${value} de réduction`;
        } else {
          return `${value} DH de réduction`;
        }
      case 'free_item':
        return `Gratuit: ${value}`;
      case 'bundle':
        return `Pack: ${value}`;
      default:
        return value;
    }
  }
};
