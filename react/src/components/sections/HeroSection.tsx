import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Star, ArrowRight, CreditCard, Smartphone, Users } from 'lucide-react';

const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-[#FBF7EF]">
      {/* Moroccan Pattern Background */}
      <div className="absolute inset-0 bg-moroccan-mosaic opacity-5" />
      <div className="absolute inset-0 bg-moroccan-stars opacity-5" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full" 
        style={{
          background: 'radial-gradient(circle at center, #C4A484 0%, transparent 70%)',
          opacity: 0.2
        }}
      />
      <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full" 
        style={{
          background: 'radial-gradient(circle at center, #8B4513 0%, transparent 70%)',
          opacity: 0.1
        }}
      />

      <div className="container-custom relative pt-32 lg:pt-40 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="relative z-10">
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-8 border border-[#C4A484]/20"
            >
              <Star size={16} className="text-[#8B4513]" />
              <span className="text-sm font-medium">Plus de 1700 cartes NFC livrées</span>
            </motion.div>

            {/* Main Content */}
            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
              >
                Votre carte NFC
                <br />
                <span className="text-[#8B4513]">en 40 secondes</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-primary-600 max-w-lg"
              >
                Créez votre carte de visite NFC personnalisée et boostez votre networking professionnel.
              </motion.p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-4 my-8">
              {[
                { icon: CreditCard, text: "Design premium" },
                { icon: Smartphone, text: "Compatible NFC" },
                { icon: Users, text: "Networking facile" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#C4A484]/20"
                >
                  <div className="w-10 h-10 bg-[#FBF7EF] rounded-xl flex items-center justify-center mb-3">
                    <feature.icon size={20} className="text-[#8B4513]" />
                  </div>
                  <p className="text-sm text-primary-600">{feature.text}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <a 
                href="#customize" 
                className="btn bg-[#8B4513] hover:bg-[#6B3410] text-white shadow-md hover:shadow-lg rounded-full px-6 py-3 font-medium transition-all duration-300"
              >
                Créer ma carte
              </a>
              <a 
                href="#gallery" 
                className="btn border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white rounded-full px-6 py-3 font-medium transition-all duration-300"
              >
                Voir la galerie
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex items-center gap-8 text-primary-600"
            >
              <div>
                <p className="text-2xl font-bold text-[#8B4513]">1,700+</p>
                <p className="text-sm">Clients satisfaits</p>
              </div>
              <div className="w-px h-12 bg-[#C4A484]/30" />
              <div>
                <p className="text-2xl font-bold text-[#8B4513]">4.9/5</p>
                <p className="text-sm">Note moyenne</p>
              </div>
              <div className="w-px h-12 bg-[#C4A484]/30" />
              <div>
                <p className="text-2xl font-bold text-[#8B4513]">24h</p>
                <p className="text-sm">Délai livraison</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl moroccan-border"
            >
              <img
                src="https://images.pexels.com/photos/6447217/pexels-photo-6447217.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="LAKARTE presentation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#8B4513]/50 to-transparent" />
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg z-10 border border-[#C4A484]/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FBF7EF] rounded-full flex items-center justify-center">
                  <Star className="text-[#8B4513]" size={20} />
                </div>
                <div>
                  <p className="font-medium">Avis vérifiés</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="text-[#8B4513] fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg z-10 border border-[#C4A484]/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FBF7EF] rounded-full flex items-center justify-center">
                  <ArrowRight className="text-[#8B4513]" size={20} />
                </div>
                <div>
                  <p className="font-medium">Livraison rapide</p>
                  <p className="text-sm text-primary-600">Sous 24h max</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;