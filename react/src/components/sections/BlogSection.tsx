import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

// Sample blog data
const blogPosts = [
  {
    id: '1',
    title: 'Comment les cartes NFC peuvent révolutionner votre entreprise',
    excerpt: 'Découvrez comment les professionnels utilisent les cartes NFC pour booster leur image de marque et faciliter la prise de contact.',
    date: '10 Mai 2025',
    readTime: '5 min',
    image: 'https://images.pexels.com/photos/6693655/pexels-photo-6693655.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Business',
    slug: 'comment-les-cartes-nfc-peuvent-revolutionner-votre-entreprise'
  },
  {
    id: '2',
    title: 'Les avantages des cartes Google Reviews pour les restaurants',
    excerpt: 'Comment les restaurants peuvent-ils augmenter significativement leurs avis Google grâce aux cartes dédiées?',
    date: '3 Mai 2025',
    readTime: '4 min',
    image: 'https://images.pexels.com/photos/2403391/pexels-photo-2403391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Marketing',
    slug: 'les-avantages-des-cartes-google-reviews-pour-les-restaurants'
  },
  {
    id: '3',
    title: 'Guide de personnalisation: créez une carte NFC unique',
    excerpt: 'Les meilleures pratiques pour concevoir une carte NFC professionnelle qui reflète parfaitement votre identité.',
    date: '28 Avril 2025',
    readTime: '7 min',
    image: 'https://images.pexels.com/photos/4346312/pexels-photo-4346312.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Design',
    slug: 'guide-de-personnalisation-creez-une-carte-nfc-unique'
  }
];

const BlogSection: React.FC = () => {
  const { t } = useTranslation();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  return (
    <section id="blog" className="section bg-white py-20" ref={ref}>
      <div className="container-custom">
        <div className="section-title">
          <h2 className="mb-3">Blog</h2>
          <p className="text-primary-600">Nos derniers articles et conseils</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card card-hover overflow-hidden"
            >
              <div className="aspect-video relative">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-gold-500 text-white text-xs font-medium rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-primary-500 text-sm mb-2">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                  <Link 
                    to={`/blog/${post.slug}`} 
                    className="hover:text-gold-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="text-primary-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <Link 
                  to={`/blog/${post.slug}`}
                  className="text-gold-500 font-medium hover:text-gold-600 transition-colors inline-flex items-center"
                >
                  Lire plus <ArrowIcon className="ml-1" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

// Custom arrow icon component
const ArrowIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
);

export default BlogSection;