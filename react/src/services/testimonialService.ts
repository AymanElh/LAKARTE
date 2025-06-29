const API_BASE_URL = 'http://localhost:8080/api/testimonials';

export interface TestimonialCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color: string;
  is_active: boolean;
  sort_order: number;
  testimonials_count?: number;
  published_testimonials_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  client_name: string;
  client_title?: string;
  client_company?: string;
  content: string;
  type: 'text' | 'image' | 'video';
  media_path?: string;
  media_url?: string;
  thumbnail_path?: string;
  thumbnail_url?: string;
  rating?: number;
  source?: string;
  source_url?: string;
  is_featured: boolean;
  review_date?: string;
  review_date_human?: string;
  sort_order: number;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  category?: TestimonialCategory;
  creator?: {
    id: number;
    name: string;
  };
}

export interface TestimonialStats {
  total_testimonials: number;
  featured_testimonials: number;
  total_categories: number;
  average_rating: number;
  testimonials_by_type: {
    text: number;
    image: number;
    video: number;
  };
  testimonials_by_source: Record<string, number>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedTestimonialResponse {
  data: Testimonial[];
  pagination: {
    current_page: number;
    total_pages: number;
    per_page: number;
    total: number;
    has_more_pages: boolean;
  };
}

interface GetTestimonialsParams extends Record<string, unknown> {
  page?: number;
  per_page?: number;
  category?: string;
  type?: 'text' | 'image' | 'video';
  min_rating?: number;
}

interface GetFeaturedParams extends Record<string, unknown> {
  limit?: number;
}

interface GetCategoriesParams extends Record<string, unknown> {
  with_counts?: boolean;
}

class TestimonialService {
  private async fetchApi<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    try {
      const url = new URL(endpoint, API_BASE_URL);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  /**
   * Get all published testimonials with optional filtering
   */
  async getTestimonials(params: GetTestimonialsParams = {}): Promise<ApiResponse<PaginatedTestimonialResponse>> {
    const response = await this.fetchApi<PaginatedTestimonialResponse>('/', params);
    return {
      success: response.success,
      data: {
        data: response.data.data || [],
        pagination: response.data.pagination || {
          current_page: 1,
          total_pages: 1,
          per_page: 12,
          total: 0,
          has_more_pages: false,
        }
      }
    };
  }

  /**
   * Get featured testimonials for homepage
   */
  async getFeaturedTestimonials(params: GetFeaturedParams = {}): Promise<ApiResponse<Testimonial[]>> {
    return this.fetchApi<Testimonial[]>('/featured', params);
  }

  /**
   * Get testimonials by category
   */
  async getTestimonialsByCategory(
    categorySlug: string, 
    params: { per_page?: number; page?: number } = {}
  ): Promise<ApiResponse<PaginatedTestimonialResponse & { category: TestimonialCategory }>> {
    return this.fetchApi<PaginatedTestimonialResponse & { category: TestimonialCategory }>(
      `/category/${categorySlug}`, 
      params
    );
  }

  /**
   * Get all active testimonial categories
   */
  async getCategories(params: GetCategoriesParams = {}): Promise<ApiResponse<TestimonialCategory[]>> {
    return this.fetchApi<TestimonialCategory[]>('/categories', params);
  }

  /**
   * Get testimonials statistics
   */
  async getStats(): Promise<ApiResponse<TestimonialStats>> {
    return this.fetchApi<TestimonialStats>('/stats');
  }

  /**
   * Helper method to get star rating display
   */
  getStarRating(rating?: number): string {
    if (!rating) return '';
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  /**
   * Helper method to format review date
   */
  formatReviewDate(dateString?: string): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  /**
   * Helper method to get avatar initials
   */
  getClientInitials(clientName: string): string {
    return clientName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}

export const testimonialService = new TestimonialService();
export default testimonialService;
