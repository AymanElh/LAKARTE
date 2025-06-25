import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CreditCard, Smartphone, ArrowRight, Wifi, CheckCircle, Share2 } from 'lucide-react';

const NfcAnimationSection: React.FC = () => {
  const { t } = useTranslation();
  const {ref, inView} = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  const features = [
    {
      icon: Wifi,
      title: 'Technologie NFC',
      description: 'Connexion instantanée sans contact avec tous les smartphones modernes'
    },
    {
      icon: Share2,
      title: 'Partage Intelligent',
      description: 'Partagez vos coordonnées et réseaux sociaux en un seul tap'
    },
    {
      icon: CheckCircle,
      title: 'Mise à jour facile',
      description: 'Modifiez vos informations à tout moment depuis votre espace personnel'
    }
  ];

  return (
    <section className="section bg-primary-900 text-white py-20" ref={ref}>
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Features */}
          <div className="space-y-12">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Une technologie qui simplifie vos connexions
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-primary-300 text-lg"
              >
                Découvrez comment LAKARTE révolutionne le networking professionnel
              </motion.p>
            </div>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="flex items-start gap-4"
                >
                  <div className="bg-gold-500 rounded-xl p-3">
                    <feature.icon size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-primary-300">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <a href="#customize" className="btn btn-primary">
                Créer ma carte
              </a>
            </motion.div>
          </div>

          {/* Right Column: Interactive Animation */}
          <div className="relative h-[600px]">
            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8 }}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-[280px] h-[560px] bg-primary-800 rounded-[3rem] p-4 shadow-2xl z-20"
            >
              <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-primary-800 rounded-b-2xl"></div>

                {/* Screen Content */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="w-full h-full pt-10 px-4"
                >
                  {/* Profile Header */}
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gold-100 rounded-full mx-auto mb-3"></div>
                    <h3 className="text-primary-900 font-semibold">John Doe</h3>
                    <p className="text-primary-500 text-sm">Marketing Director</p>
                  </div>

                  {/* Contact Buttons */}
                  <div className="space-y-3">
                    <button className="w-full py-3 px-4 bg-gold-500 text-white rounded-xl font-medium">
                      Sauvegarder le contact
                    </button>
                    <button className="w-full py-3 px-4 bg-primary-100 text-primary-900 rounded-xl font-medium">
                      Voir le profil complet
                    </button>
                  </div>

                  {/* Social Links */}
                  <div className="mt-6 space-y-3">
                    <div className="bg-primary-50 p-4 rounded-xl">
                      <div className="h-4 w-3/4 bg-primary-200 rounded"></div>
                    </div>
                    <div className="bg-primary-50 p-4 rounded-xl">
                      <div className="h-4 w-2/3 bg-primary-200 rounded"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* NFC Card */}
            <motion.div
              initial={{ x: -100, y: 100, rotate: -20, opacity: 0 }}
              animate={inView ? {
                x: [null, 0, 150],
                y: [null, 50, 0],
                rotate: [null, 0, 0],
                opacity: 1
              } : { x: -100, y: 100, rotate: -20, opacity: 0 }}
              transition={{
                duration: 2,
                delay: 0.5,
                times: [0, 0.7, 1],
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="absolute left-0 top-1/2 w-[200px] h-[320px] bg-gradient-to-r from-gold-400 to-gold-600 rounded-2xl shadow-2xl z-10"
            >
              <div className="p-6 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-white/80 text-sm">NFC</span>
                  <span className="text-white font-bold">LAKARTE</span>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-white/30"></div>
                </div>

                <div className="text-white">
                  <div className="font-bold">John Doe</div>
                  <div className="text-sm opacity-80">Marketing Director</div>
                </div>
              </div>
            </motion.div>

            {/* Connection Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? {
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5]
              } : { opacity: 0 }}
              transition={{
                duration: 1,
                delay: 1.5,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="absolute left-1/3 top-1/2 w-6 h-6 bg-gold-500 rounded-full z-30"
            />

            {/* Success Indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? {
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 1, 0]
              } : { opacity: 0, scale: 0 }}
              transition={{
                duration: 1.5,
                delay: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="absolute right-1/4 top-1/2 -translate-y-1/2 bg-success-500 text-white rounded-full p-3 z-40"
            >
              <CheckCircle size={24} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NfcAnimationSection;