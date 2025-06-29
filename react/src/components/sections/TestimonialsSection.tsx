import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Play, Star, Share2, MessageCircle } from 'lucide-react';
import { testimonialService, Testimonial } from '../../services/testimonialService';

const TestimonialsSection: React.FC = () => {
  const { t } = useTranslation();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRefs = useRef<{ [key: string]: HTMLIFrameElement }>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    const fetchFeaturedTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching featured testimonials...'); // Debug log
        const response = await testimonialService.getFeaturedTestimonials({ limit: 8 });
        console.log('Response received:', response); // Debug log
        if (response.success) {
          setTestimonials(response.data);
        } else {
          console.error('API returned success: false', response);
          setError(`Erreur API: ${response.message || 'Réponse invalide'}`);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        // Show more detailed error message
        const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(`Erreur de connexion: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTestimonials();
  }, []);
  
  const handleVideoClick = (id: number) => {
    const idString = id.toString();
    if (activeVideo === idString) {
      setIsPlaying(!isPlaying);
      const iframe = videoRefs.current[idString];
      if (iframe) {
        const message = isPlaying ? 'pause' : 'play';
        iframe.contentWindow?.postMessage(`{"method":"${message}"}`, '*');
      }
    } else {
      setActiveVideo(idString);
      setIsPlaying(true);
    }
  };

  const handleShare = () => {
    const whatsappMessage = encodeURIComponent("Découvrez les témoignages de nos clients LAKARTE !");
    window.open(`https://wa.me/?text=${whatsappMessage}`, '_blank');
  };
  
  return (
    <section id="testimonials" className="section bg-white py-20" ref={ref}>
      <div className="container-custom">
        <div className="section-title">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            {t('testimonials.title', 'Témoignages Clients')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-primary-600"
          >
            {t('testimonials.subtitle', 'Découvrez les retours d\'expérience de nos clients')}
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-12">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="aspect-[9/16] rounded-xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 text-primary-500 hover:text-primary-600"
            >
              Réessayer
            </button>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun témoignage disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-12">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative aspect-[9/16] rounded-xl overflow-hidden group cursor-pointer"
                onClick={() => handleVideoClick(testimonial.id)}
              >
                {/* Thumbnail */}
                <img
                  src={testimonial.media_url || testimonial.thumbnail_url || 'https://images.pexels.com/photos/3760514/pexels-photo-3760514.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                  alt={testimonial.client_name}
                  className="w-full h-full object-cover"
                />

                {/* Overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary-900 opacity-90">
                  {/* Play button - only show for video testimonials */}
                  {testimonial.type === 'video' && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="text-primary-900 ml-1" size={24} />
                      </div>
                    </div>
                  )}

                  {/* User info and stats */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {testimonialService.getClientInitials(testimonial.client_name)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{testimonial.client_name}</p>
                        <p className="text-white/80 text-xs">
                          {testimonial.client_title && testimonial.client_company 
                            ? `${testimonial.client_title}, ${testimonial.client_company}`
                            : testimonial.client_title || testimonial.client_company || 'Client'
                          }
                        </p>
                      </div>
                    </div>
                    
                    {/* Rating */}
                    {testimonial.rating && (
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} size={12} className="text-gold-500 fill-current" />
                        ))}
                      </div>
                    )}

                    {/* Review text */}
                    <p className="text-white text-sm line-clamp-2 mb-2">
                      {testimonial.content}
                    </p>

                    {/* Source and date */}
                    <div className="flex items-center gap-4 text-white/90 text-xs">
                      {testimonial.source && (
                        <span className="flex items-center gap-1">
                          <MessageCircle size={14} />
                          {testimonial.source}
                        </span>
                      )}
                      {testimonial.review_date && (
                        <span className="flex items-center gap-1">
                          <Star size={14} />
                          {testimonialService.formatReviewDate(testimonial.review_date)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 flex flex-col items-center gap-6">
          <button
            onClick={() => setShowSubmitModal(true)}
            className="btn btn-primary"
          >
            {t('testimonials.shareExperience', 'Partager votre expérience')}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <Share2 size={20} />
            {t('testimonials.shareTestimonials', 'Partager ces témoignages')}
          </button>
        </div>

        {/* Submit Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 bg-primary-900/80 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold mb-4">
                {t('testimonials.modal.title', 'Partagez votre expérience')}
              </h3>
              <p className="text-primary-600 mb-6">
                {t('testimonials.modal.description', 'Envoyez-nous votre vidéo témoignage et partagez votre expérience avec LAKARTE !')}
              </p>
              <div className="flex gap-4">
                <a
                  href="https://wa.me/212691600160"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 btn btn-primary"
                >
                  WhatsApp
                </a>
                <a
                  href="mailto:contact@lakarte.com"
                  className="flex-1 btn btn-outline"
                >
                  Email
                </a>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="mt-4 text-primary-500 hover:text-primary-600 w-full"
              >
                {t('common.close', 'Fermer')}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;