import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const StatisticsSection: React.FC = () => {
  const { t } = useTranslation();
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });
  
  const stats = [
    { value: 1765, label: t('stats.cards') },
    { value: 1205, label: t('stats.clients') },
    { value: 100, label: `% ${t('stats.customizable')}` }
  ];
  
  return (
    <section className="section bg-primary-900 text-white py-16" ref={ref}>
      <div className="container-custom">
        <div className="section-title">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            {t('stats.title')}
          </motion.h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { 
                  opacity: 1, 
                  scale: 1,
                } : { opacity: 0, scale: 0.5 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 100,
                  damping: 10,
                  delay: index * 0.2 + 0.3 
                }}
                className="text-5xl md:text-6xl font-bold text-gold-500 mb-3"
              >
                <CountUp end={stat.value} duration={2} inView={inView} />
              </motion.div>
              <p className="text-primary-300 text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Simple count-up animation component
const CountUp: React.FC<{
  end: number;
  duration: number;
  inView: boolean;
}> = ({ end, duration, inView }) => {
  const [count, setCount] = React.useState(0);
  
  React.useEffect(() => {
    if (!inView) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };
    
    animationFrame = requestAnimationFrame(updateCount);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, inView]);
  
  return <>{count}</>;
};

export default StatisticsSection;