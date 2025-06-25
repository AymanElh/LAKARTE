import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Play, Pause, Star, Share2, MessageCircle, Send, MapIcon as WhatsappIcon } from 'lucide-react';

// Sample data for testimonials
const testimonials = [
  {
    id: '1',
    videoUrl: 'https://player.vimeo.com/video/824804225?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1',
    posterImage: 'https://images.pexels.com/photos/3760514/pexels-photo-3760514.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    person: {
      name: 'Rachid Tazi',
      role: 'CEO, Digital Solutions',
      rating: 5,
      review: "LAKARTE a transformé ma façon de networker. La qualité est exceptionnelle !",
      date: '15 Mars 2024',
      likes: 234,
      comments: 18
    }
  },
  {
    id: '2',
    videoUrl: 'https://player.vimeo.com/video/824804225?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1',
    posterImage: 'https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    person: {
      name: 'Nadia El Fassi',
      role: 'Marketing Manager',
      rating: 5,
      review: "Design élégant, livraison rapide et un excellent support !",
      date: '10 Mars 2024',
      likes: 187,
      comments: 12
    }
  },
  {
    id: '3',
    videoUrl: 'https://player.vimeo.com/video/824804225?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1',
    posterImage: 'https://images.pexels.com/photos/3760373/pexels-photo-3760373.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    person: {
      name: 'Thomas Dupont',
      role: 'Freelance Designer',
      rating: 5,
      review: "La qualité et le style des cartes sont exceptionnels !",
      date: '5 Mars 2024',
      likes: 156,
      comments: 9
    }
  },
  {
    id: '4',
    videoUrl: 'https://player.vimeo.com/video/824804225?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1',
    posterImage: 'https://images.pexels.com/photos/3771118/pexels-photo-3771118.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    person: {
      name: 'Samira Alaoui',
      role: 'Restaurant Owner',
      rating: 5,
      review: "Les cartes Google Reviews ont boosté notre visibilité !",
      date: '1 Mars 2024',
      likes: 203,
      comments: 15
    }
  }
];

const TestimonialsSection: React.FC = () => {
  const { t } = useTranslation();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRefs = useRef<{ [key: string]: HTMLIFrameElement }>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  
  const handleVideoClick = (id: string) => {
    if (activeVideo === id) {
      setIsPlaying(!isPlaying);
      const iframe = videoRefs.current[id];
      if (iframe) {
        const message = isPlaying ? 'pause' : 'play';
        iframe.contentWindow?.postMessage(`{"method":"${message}"}`, '*');
      }
    } else {
      setActiveVideo(id);
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
            Témoignages Vidéo
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-primary-600"
          >
            Découvrez les retours d'expérience de nos clients
          </motion.p>
        </div>

        {/* Reels Grid */}
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
                src={testimonial.posterImage}
                alt={testimonial.person.name}
                className="w-full h-full object-cover"
              />

              {/* Overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary-900 opacity-90">
                {/* Play button */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="text-primary-900 ml-1" size={24} />
                  </div>
                </div>

                {/* User info and stats */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={testimonial.posterImage}
                        alt={testimonial.person.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{testimonial.person.name}</p>
                      <p className="text-white/80 text-xs">{testimonial.person.role}</p>
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.person.rating)].map((_, i) => (
                      <Star key={i} size={12} className="text-gold-500 fill-current" />
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="text-white text-sm line-clamp-2 mb-2">
                    {testimonial.person.review}
                  </p>

                  {/* Engagement stats */}
                  <div className="flex items-center gap-4 text-white/90 text-xs">
                    <span className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      {testimonial.person.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={14} />
                      {testimonial.person.likes}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 flex flex-col items-center gap-6">
          <button
            onClick={() => setShowSubmitModal(true)}
            className="btn btn-primary"
          >
            Partager votre expérience
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <Share2 size={20} />
            Partager ces témoignages
          </button>
        </div>

        {/* Submit Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 bg-primary-900/80 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold mb-4">Partagez votre expérience</h3>
              <p className="text-primary-600 mb-6">
                Envoyez-nous votre vidéo témoignage et partagez votre expérience avec LAKARTE !
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
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;