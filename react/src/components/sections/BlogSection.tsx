import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Clock, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogService, BlogArticle } from '../../services/blogService';

const BlogSection: React.FC = () => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = 'fr';
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        setLoading(true);
        const response = await blogService.getFeaturedArticles(3);
        if (response.success) {
          setArticles(response.data);
        }
      } catch (error) {
        console.error('Error fetching featured articles:', error);
        // Fallback to latest articles if featured fails
        try {
          const fallbackResponse = await blogService.getLatestArticles(3);
          if (fallbackResponse.success) {
            setArticles(fallbackResponse.data);
          }
        } catch (fallbackError) {
          console.error('Error fetching latest articles:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArticles();
  }, []);
  
  return (
    <section id="blog" className="section bg-white py-20" ref={ref}>
      <div className="container-custom">
        <div className="section-title">
          <h2 className="mb-3">Blog</h2>
          <p className="text-primary-600">Nos derniers articles et conseils</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center mt-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {articles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card card-hover overflow-hidden"
              >
                <div className="aspect-video relative">
                  <img 
                    src={article.featured_image_url || 'https://images.pexels.com/photos/6693655/pexels-photo-6693655.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                    alt={blogService.formatArticleTitle(article, locale)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-gold-500 text-white text-xs font-medium rounded-full">
                      {article.category ? blogService.formatCategoryName(article.category, locale) : 'Blog'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-primary-500 text-sm mb-2">
                    <Calendar size={16} className="mr-1" />
                    <span>
                      {new Date(article.published_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      {article.estimated_reading_time || `${article.reading_time || 5} min`}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2 hover:text-gold-500 transition-colors">
                    <Link to={`/blog/${blogService.formatArticleSlug(article, locale)}`}>
                      {blogService.formatArticleTitle(article, locale)}
                    </Link>
                  </h3>
                  <p className="text-primary-600 text-sm line-clamp-3 mb-4">
                    {blogService.formatArticleExcerpt(article, locale)}
                  </p>
                  <Link 
                    to={`/blog/${blogService.formatArticleSlug(article, locale)}`}
                    className="text-gold-500 text-sm font-medium hover:text-gold-600 transition-colors"
                  >
                    Lire la suite →
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center mt-12">
            <p className="text-gray-500">Aucun article disponible pour le moment.</p>
          </div>
        )}
        
        {/* View All Blog Posts Link */}
        <div className="text-center mt-12">
          <Link 
            to="/blog" 
            className="btn btn-primary"
          >
            Voir tous les articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;