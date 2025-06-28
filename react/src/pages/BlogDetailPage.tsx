import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { blogService, BlogArticle } from '../services/blogService';
import { getLocalizedText, getLocalizedSlug, getCurrentLocale } from '../utils/multilingual';

const BlogDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentLocale = getCurrentLocale();

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await blogService.getArticle(slug, {
          with_related: true,
          related_count: 3
        });
        
        if (response.success) {
          setArticle(response.data);
        } else {
          setError('Article non trouvé');
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="container-custom py-20">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container-custom py-20">
        <h1>Article non trouvé</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link to="/blog" className="text-gold-500 hover:text-gold-600">
          Retour au blog
        </Link>
      </div>
    );
  }
  
  return (
    <article className="py-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] mb-12">
        <div className="absolute inset-0">
          <img 
            src={article.featured_image_url || 'https://images.pexels.com/photos/6693655/pexels-photo-6693655.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
            alt={getLocalizedText(article.title, currentLocale)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900 to-transparent opacity-70" />
        </div>
        
        <div className="container-custom relative h-full flex flex-col justify-end pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              to="/blog" 
              className="inline-flex items-center text-white mb-6 hover:text-gold-500 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              {t('backToBlog', 'Retour au blog')}
            </Link>
            
            <span className="inline-block bg-gold-500 text-white text-sm px-3 py-1 rounded-full mb-4">
              {article.category ? getLocalizedText(article.category.name, currentLocale) : 'Blog'}
            </span>
            
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {getLocalizedText(article.title, currentLocale)}
            </h1>
            
            <div className="flex items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{new Date(article.published_at).toLocaleDateString('fr-FR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{article.estimated_reading_time || `${article.reading_time || 5} min de lecture`}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: getLocalizedText(article.content || article.excerpt, currentLocale) }}
            />
            
            {/* Author Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 p-6 bg-primary-50 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-200 flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-lg">
                    {article.author?.name.charAt(0) || 'A'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{article.author?.name || 'Auteur'}</h3>
                  <p className="text-primary-600">Auteur</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* Share Buttons */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Share2 size={20} />
                  Partager l'article
                </h3>
                <div className="flex gap-3">
                  <a 
                    href={`https://facebook.com/sharer/sharer.php?u=${window.location.href}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary-100 hover:bg-primary-200 p-3 rounded-lg transition-colors"
                  >
                    <Facebook size={20} />
                  </a>
                  <a 
                    href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${getLocalizedText(article.title, currentLocale)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary-100 hover:bg-primary-200 p-3 rounded-lg transition-colors"
                  >
                    <Twitter size={20} />
                  </a>
                  <a 
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}&title=${getLocalizedText(article.title, currentLocale)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary-100 hover:bg-primary-200 p-3 rounded-lg transition-colors"
                  >
                    <Linkedin size={20} />
                  </a>
                </div>
              </motion.div>
              
              {/* Related Posts */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-4">Articles similaires</h3>
                <div className="space-y-4">
                  {article.related_articles && article.related_articles.length > 0 ? (
                    article.related_articles.map((relatedArticle: BlogArticle) => (
                      <Link 
                        key={relatedArticle.id}
                        to={`/blog/${getLocalizedSlug(relatedArticle.slug, currentLocale)}`}
                        className="group block"
                      >
                        <div className="aspect-video rounded-lg overflow-hidden mb-2">
                          <img 
                            src={relatedArticle.featured_image_url || 'https://images.pexels.com/photos/6693655/pexels-photo-6693655.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                            alt={getLocalizedText(relatedArticle.title, currentLocale)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="font-medium group-hover:text-gold-500 transition-colors">
                          {getLocalizedText(relatedArticle.title, currentLocale)}
                        </h4>
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-500">{t('noRelatedArticles', 'Aucun article similaire disponible')}</p>
                  )}
                </div>
              </motion.div>
              
              {/* CTA Box */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-primary-900 text-white p-6 rounded-xl"
              >
                <h3 className="text-lg font-semibold mb-2">
                  Prêt à passer au digital ?
                </h3>
                <p className="text-primary-300 mb-4">
                  Créez votre carte NFC personnalisée en quelques clics
                </p>
                <Link to="/#customize" className="btn btn-primary w-full">
                  Commander maintenant
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogDetailPage;