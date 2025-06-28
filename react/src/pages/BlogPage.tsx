import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { blogService, BlogArticle, BlogCategory, PaginatedResponse } from '../services/blogService';

const BlogPage: React.FC = () => {
  const [articles, setArticles] = useState<PaginatedResponse<BlogArticle> | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const locale = 'fr';

  const fetchArticles = async (page: number = 1, search?: string, category?: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await blogService.getArticles({
        page,
        per_page: 9,
        search,
        category,
        sort_by: 'published_at',
        sort_order: 'desc'
      });

      if (response.success) {
        setArticles(response.data);
      } else {
        setError('Erreur lors du chargement des articles');
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await blogService.getCategories({ with_count: true, locale });
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchArticles(1, searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchArticles(page, searchQuery, selectedCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles(1, searchQuery, selectedCategory);
  };

  if (loading && !articles) {
    return (
      <div className="py-20">
        <div className="container-custom">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !articles) {
    return (
      <div className="py-20">
        <div className="container-custom text-center">
          <h1 className="text-2xl font-bold mb-4">Erreur</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => fetchArticles()} 
            className="btn btn-primary"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      {/* Hero Section */}
      <div className="bg-primary-900 text-white py-16 mb-12">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Notre Blog
            </h1>
            <p className="text-xl text-primary-200 max-w-2xl mx-auto">
              Découvrez nos conseils, actualités et guides pour optimiser votre présence digitale
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom">
        {/* Search and Filter */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />
              </form>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category) => (
                  <option 
                    key={category.id} 
                    value={blogService.formatCategorySlug(category, locale)}
                  >
                    {blogService.formatCategoryName(category, locale)} 
                    {category.articles_count ? ` (${category.articles_count})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {articles && articles.data.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            >
              {articles.data.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <Link to={`/blog/${blogService.formatArticleSlug(article, locale)}`}>
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={article.featured_image_url || 'https://images.pexels.com/photos/6693655/pexels-photo-6693655.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                        alt={blogService.formatArticleTitle(article, locale)}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  <div className="p-6">
                    {article.category && (
                      <span 
                        className="inline-block text-xs px-2 py-1 rounded-full mb-3 text-white"
                        style={{ backgroundColor: article.category.color === 'primary' ? '#1a365d' : article.category.color }}
                      >
                        {blogService.formatCategoryName(article.category, locale)}
                      </span>
                    )}

                    <Link to={`/blog/${blogService.formatArticleSlug(article, locale)}`}>
                      <h2 className="text-xl font-bold mb-3 hover:text-gold-500 transition-colors">
                        {blogService.formatArticleTitle(article, locale)}
                      </h2>
                    </Link>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blogService.formatArticleExcerpt(article, locale)}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>
                            {new Date(article.published_at).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{article.estimated_reading_time || `${article.reading_time || 5} min`}</span>
                        </div>
                      </div>
                      {article.author && (
                        <span className="font-medium">{article.author.name}</span>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>

            {/* Pagination */}
            {articles.last_page > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft size={20} />
                </button>

                {Array.from({ length: articles.last_page }, (_, i) => i + 1)
                  .filter(page => {
                    return page === 1 || 
                           page === articles.last_page || 
                           (page >= currentPage - 2 && page <= currentPage + 2);
                  })
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg border ${
                          currentPage === page
                            ? 'bg-gold-500 text-white border-gold-500'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === articles.last_page}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Aucun article trouvé</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory 
                ? 'Essayez de modifier vos critères de recherche.' 
                : 'Aucun article n\'est encore disponible.'}
            </p>
            {(searchQuery || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }}
                className="btn btn-primary"
              >
                Voir tous les articles
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
