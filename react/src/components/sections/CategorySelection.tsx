import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CreditCard, Star, Check, Users, Smartphone, Gauge, ArrowRight } from 'lucide-react';

interface CategorySelectionProps {
  onSelectType: (type: 'nfc' | 'google') => void;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({ onSelectType }) => {
  const { t } = useTranslation();
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  const handleCardSelect = (type: 'nfc' | 'google') => {
    onSelectType(type);
    const formElement = document.getElementById('customize');
    if (formElement) {
      const offset = 100; // Adjust this value based on your header height
      const elementPosition = formElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* NFC Card Section */}
      <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary-50 to-white py-20" ref={ref}>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/7821836/pexels-photo-7821836.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center opacity-5" />
        
        <div className="container-custom relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Column - Content */}
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 bg-gold-50 text-gold-600 px-4 py-2 rounded-full"
                >
                  <CreditCard size={16} />
                  <span className="text-sm font-medium">Carte NFC Professionnelle</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">
                    Votre carte de visite <br />
                    <span className="text-gold-500">nouvelle génération</span>
                  </h2>
                  <p className="text-xl text-primary-600">
                    Partagez vos informations professionnelles en un seul tap
                  </p>
                </motion.div>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-4"
                >
                  {[
                    { icon: Smartphone, text: 'Compatible avec tous les smartphones' },
                    { icon: Users, text: 'Idéal pour le networking professionnel' },
                    { icon: Gauge, text: 'Mise à jour instantanée des informations' }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gold-50 rounded-xl flex items-center justify-center">
                        <feature.icon className="text-gold-500" size={24} />
                      </div>
                      <span className="text-primary-700">{feature.text}</span>
                    </div>
                  ))}
                </motion.div>

                {/* Price and CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <p className="text-primary-600">À partir de</p>
                    <p className="text-4xl font-bold text-primary-900">165 Dhs</p>
                  </div>
                  <button
                    onClick={() => handleCardSelect('nfc')}
                    className="btn btn-primary w-full sm:w-auto"
                  >
                    Commander maintenant
                  </button>
                </motion.div>
              </div>

              {/* Right Column - Card Preview */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative aspect-[5/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.pexels.com/photos/7821836/pexels-photo-7821836.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="NFC Card"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent" />
                  
                  {/* Card Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-white text-2xl font-bold mb-2">Premium Gold</h3>
                        <p className="text-white/80">Design professionnel</p>
                      </div>
                      <div className="flex items-center gap-2 text-white">
                        <span className="text-xl font-bold">235 Dhs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success-50 rounded-full flex items-center justify-center">
                      <Star className="text-success-500" size={20} />
                    </div>
                    <div>
                      <p className="font-medium">Avis clients</p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="text-gold-500 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary-900 to-primary-800 py-20">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/5717456/pexels-photo-5717456.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center opacity-10" />
        
        <div className="container-custom relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Column - Content */}
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 bg-gold-500 text-white px-4 py-2 rounded-full"
                >
                  <Star size={16} />
                  <span className="text-sm font-medium">Carte Google Reviews</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Boostez vos avis <br />
                    <span className="text-gold-500">Google Reviews</span>
                  </h2>
                  <p className="text-xl text-primary-300">
                    Augmentez votre visibilité et votre réputation en ligne
                  </p>
                </motion.div>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-4"
                >
                  {[
                    { icon: Star, text: 'Augmentez vos avis Google' },
                    { icon: Users, text: 'Parfait pour les commerces' },
                    { icon: Gauge, text: 'Boost de visibilité garanti' }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                        <feature.icon className="text-gold-500" size={24} />
                      </div>
                      <span className="text-white">{feature.text}</span>
                    </div>
                  ))}
                </motion.div>

                {/* Price and CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <p className="text-primary-300">À partir de</p>
                    <p className="text-4xl font-bold text-white">220 Dhs</p>
                  </div>
                  <button
                    onClick={() => handleCardSelect('google')}
                    className="btn btn-primary w-full sm:w-auto"
                  >
                    Commander maintenant
                  </button>
                </motion.div>
              </div>

              {/* Right Column - Card Preview */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative aspect-[5/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.pexels.com/photos/5717456/pexels-photo-5717456.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Google Reviews Card"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent" />
                  
                  {/* Card Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-white text-2xl font-bold mb-2">Pack Standard</h3>
                        <p className="text-white/80">100 cartes personnalisées</p>
                      </div>
                      <div className="flex items-center gap-2 text-white">
                        <span className="text-xl font-bold">380 Dhs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success-50 rounded-full flex items-center justify-center">
                      <ArrowRight className="text-success-500" size={20} />
                    </div>
                    <div>
                      <p className="font-medium">Livraison rapide</p>
                      <p className="text-sm text-primary-600">Sous 24h</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CategorySelection;