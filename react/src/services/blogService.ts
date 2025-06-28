const API_BASE_URL = 'http://localhost:8080/api/blog';

export interface BlogCategory {
  id: number;
  name: {
    en: string;
    fr: string;
    ar: string;
  };
  slug: {
    en: string;
    fr: string;
    ar: string;
  };
  description: {
    en: string;
    fr: string;
    ar: string;
  };
  color: string;
  icon?: string;
  is_active: boolean;
  sort_order: number;
  articles_count?: number;
  created_at: string;
  updated_at: string;
}

export interface BlogAuthor {
  id: number;
  name: string;
}

export interface BlogArticle {
  id: number;
  title: {
    en: string;
    fr: string;
    ar: string;
  };
  slug: {
    en: string;
    fr: string;
    ar: string;
  };
  excerpt: {
    en: string;
    fr: string;
    ar: string;
  };
  content?: {
    en: string;
    fr: string;
    ar: string;
  };
  meta_title?: {
    en: string;
    fr: string;
    ar: string;
  };
  meta_description?: {
    en: string;
    fr: string;
    ar: string;
  };
  featured_image?: string;
  featured_image_url?: string;
  status: string;
  published_at: string;
  is_featured: boolean;
  allow_comments: boolean;
  tags?: string[];
  views_count: number;
  reading_time?: number;
  created_at: string;
  updated_at: string;
  published_at_human?: string;
  estimated_reading_time?: string;
  author?: BlogAuthor;
  category?: BlogCategory;
  related_articles?: BlogArticle[];
}

export interface BlogStats {
  total_articles: number;
  total_categories: number;
  total_views: number;
  featured_articles: number;
  total_authors: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

class BlogService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Making blog API request to:', url);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        ...options,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        console.error('Blog API Error:', error);
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Blog API Response:', data);
      return data;
    } catch (error) {
      console.error('Blog Service Error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  }

  // Categories
  async getCategories(params?: {
    search?: string;
    with_count?: boolean;
    locale?: string;
  }): Promise<ApiResponse<BlogCategory[]>> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.with_count) searchParams.set('with_count', 'true');
    if (params?.locale) searchParams.set('locale', params.locale);

    const query = searchParams.toString();
    return this.makeRequest(`/categories${query ? `?${query}` : ''}`);
  }

  async getCategory(slug: string, params?: {
    locale?: string;
    with_articles?: boolean;
    per_page?: number;
  }): Promise<ApiResponse<BlogCategory>> {
    const searchParams = new URLSearchParams();
    if (params?.locale) searchParams.set('locale', params.locale);
    if (params?.with_articles) searchParams.set('with_articles', 'true');
    if (params?.per_page) searchParams.set('per_page', params.per_page.toString());

    const query = searchParams.toString();
    return this.makeRequest(`/categories/${slug}${query ? `?${query}` : ''}`);
  }

  // Articles
  async getArticles(params?: {
    search?: string;
    category?: string;
    author?: number;
    tags?: string[];
    featured?: boolean;
    sort_by?: string;
    sort_order?: string;
    per_page?: number;
    page?: number;
  }): Promise<ApiResponse<PaginatedResponse<BlogArticle>>> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.author) searchParams.set('author', params.author.toString());
    if (params?.tags) searchParams.set('tags', params.tags.join(','));
    if (params?.featured) searchParams.set('featured', 'true');
    if (params?.sort_by) searchParams.set('sort_by', params.sort_by);
    if (params?.sort_order) searchParams.set('sort_order', params.sort_order);
    if (params?.per_page) searchParams.set('per_page', params.per_page.toString());
    if (params?.page) searchParams.set('page', params.page.toString());

    const query = searchParams.toString();
    return this.makeRequest(`/articles${query ? `?${query}` : ''}`);
  }

  async getArticle(slug: string, params?: {
    with_related?: boolean;
    related_count?: number;
  }): Promise<ApiResponse<BlogArticle>> {
    const searchParams = new URLSearchParams();
    if (params?.with_related) searchParams.set('with_related', 'true');
    if (params?.related_count) searchParams.set('related_count', params.related_count.toString());

    const query = searchParams.toString();
    return this.makeRequest(`/articles/${slug}${query ? `?${query}` : ''}`);
  }

  async getFeaturedArticles(limit?: number): Promise<ApiResponse<BlogArticle[]>> {
    const searchParams = new URLSearchParams();
    if (limit) searchParams.set('limit', limit.toString());

    const query = searchParams.toString();
    return this.makeRequest(`/articles/featured${query ? `?${query}` : ''}`);
  }

  async getLatestArticles(limit?: number): Promise<ApiResponse<BlogArticle[]>> {
    const searchParams = new URLSearchParams();
    if (limit) searchParams.set('limit', limit.toString());

    const query = searchParams.toString();
    return this.makeRequest(`/articles/latest${query ? `?${query}` : ''}`);
  }

  async getPopularArticles(params?: {
    limit?: number;
    timeframe?: 'all' | 'week' | 'month';
  }): Promise<ApiResponse<BlogArticle[]>> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.timeframe) searchParams.set('timeframe', params.timeframe);

    const query = searchParams.toString();
    return this.makeRequest(`/articles/popular${query ? `?${query}` : ''}`);
  }

  async searchArticles(query: string, per_page?: number): Promise<ApiResponse<PaginatedResponse<BlogArticle>>> {
    const searchParams = new URLSearchParams();
    searchParams.set('query', query);
    if (per_page) searchParams.set('per_page', per_page.toString());

    const queryString = searchParams.toString();
    return this.makeRequest(`/articles/search?${queryString}`);
  }

  // Stats and metadata
  async getStats(): Promise<ApiResponse<BlogStats>> {
    return this.makeRequest('/stats');
  }

  async getTags(): Promise<ApiResponse<Array<{ name: string; count: number }>>> {
    return this.makeRequest('/tags');
  }

  async getTrendingArticles(params?: {
    timeframe?: 'week' | 'month' | 'year';
    limit?: number;
  }): Promise<ApiResponse<BlogArticle[]>> {
    const searchParams = new URLSearchParams();
    if (params?.timeframe) searchParams.set('timeframe', params.timeframe);
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const query = searchParams.toString();
    return this.makeRequest(`/trending${query ? `?${query}` : ''}`);
  }

  // Utility methods
  getLocalizedValue<T>(obj: { en: T; fr: T; ar: T }, locale: string = 'fr'): T {
    return obj[locale as keyof typeof obj] || obj.en;
  }

  formatArticleSlug(article: BlogArticle, locale: string = 'fr'): string {
    return this.getLocalizedValue(article.slug, locale);
  }

  formatArticleTitle(article: BlogArticle, locale: string = 'fr'): string {
    return this.getLocalizedValue(article.title, locale);
  }

  formatArticleExcerpt(article: BlogArticle, locale: string = 'fr'): string {
    return this.getLocalizedValue(article.excerpt, locale);
  }

  formatArticleContent(article: BlogArticle, locale: string = 'fr'): string {
    return article.content ? this.getLocalizedValue(article.content, locale) : '';
  }

  formatCategoryName(category: BlogCategory, locale: string = 'fr'): string {
    return this.getLocalizedValue(category.name, locale);
  }

  formatCategorySlug(category: BlogCategory, locale: string = 'fr'): string {
    return this.getLocalizedValue(category.slug, locale);
  }
}

export const blogService = new BlogService();
