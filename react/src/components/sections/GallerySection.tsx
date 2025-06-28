import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, ArrowRight, CreditCard, Smartphone, Wifi, Shield, Zap, RefreshCw } from 'lucide-react';

const cardModels = [
  {
    id: 'premium',
    name: 'Premium Gold',
    price: '235 Dhs',
    image: 'https://images.pexels.com/photos/7821836/pexels-photo-7821836.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    backImage: 'https://images.pexels.com/photos/7821723/pexels-photo-7821723.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    color: 'bg-gradient-to-r from-gold-400 to-gold-600',
    features: [
      'Design sur mesure',
      'Finition premium dorée',
      'Logo gravé',
      'Support prioritaire'
    ],
    specs: {
      material: 'Métal premium',
      thickness: '0.8mm',
      finish: 'Dorée brillante',
      nfc: 'Puce haute performance'
    },
    popular: true
  },
  {
    id: 'professional',
    name: 'Professional Black',
    price: '185 Dhs',
    image: 'https://images.pexels.com/photos/7821704/pexels-photo-7821704.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    backImage: 'https://images.pexels.com/photos/7821726/pexels-photo-7821726.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    color: 'bg-primary-900',
    features: [
      'Design professionnel',
      'Finition mate élégante',
      'Logo imprimé',
      'Support standard'
    ],
    specs: {
      material: 'PVC premium',
      thickness: '0.76mm',
      finish: 'Mate sophistiquée',
      nfc: 'Puce standard'
    },
    popular: false
  },
  {
    id: 'standard',
    name: 'Standard White',
    price: '165 Dhs',
    image: 'https://images.pexels.com/photos/5077047/pexels-photo-5077047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    backImage: 'https://images.pexels.com/photos/5077045/pexels-photo-5077045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    color: 'bg-white',
    features: [
      'Design classique',
      'Finition brillante',
      'Logo imprimé',
      'Support email'
    ],
    specs: {
      material: 'PVC standard',
      thickness: '0.76mm',
      finish: 'Brillante classique',
      nfc: 'Puce standard'
    },
    popular: false
  }
];

const features = [
  {
    icon: Smartphone,
    title: 'Compatible tous smartphones',
    description: 'Fonctionne avec tous les appareils NFC modernes'
  },
  {
    icon: Wifi,
    title: 'Connexion instantanée',
    description: 'Partage immédiat de vos informations'
  },
  {
    icon: Shield,
    title: 'Sécurisé',
    description: 'Protection des données garantie'
  },
  {
    icon: Zap,
    title: 'Sans batterie',
    description: 'Technologie passive durable'
  },
  {
    icon: RefreshCw,
    title: 'Mise à jour facile',
    description: 'Modifiez vos infos à tout moment'
  },
  {
    icon: CreditCard,
    title: 'Design premium',
    description: 'Finitions professionnelles'
  }
];

const GallerySection: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCard, setSelectedCard] = useState(cardModels[0]);
  const [showBack, setShowBack] = useState(false);
  
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section id="cards" className="section bg-gradient-to-b from-primary-50 to-white py-20" ref={ref}>
      <div className="container-custom">
        <div className="section-title">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            Nos Cartes NFC
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-primary-600"
          >
            Des cartes de visite intelligentes pour les professionnels modernes
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-12">
          {/* Left Column - Card Preview */}
          <div>
            <div className="sticky top-24 space-y-8">
              {/* Card Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
                className="relative aspect-[5/3] rounded-2xl overflow-hidden shadow-2xl"
                onMouseEnter={() => setShowBack(true)}
                onMouseLeave={() => setShowBack(false)}
              >
                <motion.div
                  animate={{ opacity: showBack ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <img
                    src={selectedCard.image}
                    alt={selectedCard.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.div
                  animate={{ opacity: showBack ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <img
                    src={selectedCard.backImage}
                    alt={`${selectedCard.name} back`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent" />
                
                {/* Card Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-white text-2xl font-bold mb-2">{selectedCard.name}</h3>
                      <p className="text-white/80">
                        {showBack ? 'Verso' : 'Recto'} de la carte
                      </p>
                    </div>
                    <span className="text-white text-xl font-bold">{selectedCard.price}</span>
                  </div>
                </div>
              </motion.div>

              {/* Technical Specs */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Spécifications techniques</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedCard.specs).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <p className="text-primary-500 text-sm">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Card Selection & Features */}
          <div className="space-y-12">
            {/* Card Models */}
            <div className="space-y-4">
              {cardModels.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative p-6 rounded-xl cursor-pointer transition-all ${
                    selectedCard.id === card.id
                      ? 'bg-primary-900 text-white shadow-xl'
                      : 'bg-white hover:bg-primary-50'
                  }`}
                  onClick={() => setSelectedCard(card)}
                >
                  {card.popular && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-gold-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Populaire
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-10 rounded ${card.color} shadow-lg`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{card.name}</h3>
                          <p className={selectedCard.id === card.id ? 'text-white/80' : 'text-primary-600'}>
                            {card.price}
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {card.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                            <span className={`text-sm ${
                              selectedCard.id === card.id ? 'text-white/80' : 'text-primary-600'
                            }`}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Features Grid */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Caractéristiques communes</h3>
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="bg-white p-4 rounded-xl"
                  >
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-3">
                      <feature.icon className="text-gold-500" size={20} />
                    </div>
                    <h4 className="font-medium mb-1">{feature.title}</h4>
                    <p className="text-sm text-primary-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col items-start gap-4"
            >
              <a href="#customize" className="btn btn-primary">
                Commander maintenant
              </a>
              <p className="text-primary-600 flex items-center gap-2">
                <Star className="text-gold-500" size={16} />
                Livraison garantie sous 24h
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;