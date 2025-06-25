import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';

// Sample blog data (in a real app, this would come from an API)
const blogPosts = [
  {
    id: '1',
    slug: 'comment-les-cartes-nfc-peuvent-revolutionner-votre-entreprise',
    title: 'Comment les cartes NFC peuvent révolutionner votre entreprise',
    excerpt: 'Découvrez comment les professionnels utilisent les cartes NFC pour booster leur image de marque et faciliter la prise de contact.',
    content: `
      <h2>L'importance du networking professionnel</h2>
      <p>Dans le monde professionnel d'aujourd'hui, le networking est devenu un élément crucial pour le développement des affaires. Les cartes NFC représentent une évolution majeure dans la manière dont les professionnels échangent leurs coordonnées et créent des connexions.</p>
      
      <h2>Les avantages des cartes NFC</h2>
      <ul>
        <li>Partage instantané des coordonnées</li>
        <li>Image professionnelle moderne</li>
        <li>Mise à jour facile des informations</li>
        <li>Respect de l'environnement</li>
      </ul>
      
      <h2>Comment intégrer les cartes NFC dans votre stratégie</h2>
      <p>L'intégration des cartes NFC dans votre stratégie de networking peut se faire de plusieurs manières. Voici quelques suggestions pour maximiser leur utilisation :</p>
      
      <ol>
        <li>Personnalisez votre carte selon votre image de marque</li>
        <li>Incluez tous vos points de contact importants</li>
        <li>Utilisez des appels à l'action clairs</li>
        <li>Mesurez l'impact de vos interactions</li>
      </ol>
    `,
    date: '10 Mai 2025',
    readTime: '5 min',
    image: 'https://images.pexels.com/photos/6693655/pexels-photo-6693655.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Business',
    author: {
      name: 'Sarah Martin',
      role: 'Marketing Specialist',
      image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    relatedPosts: [
      {
        id: '2',
        title: 'Les avantages des cartes Google Reviews pour les restaurants',
        image: 'https://images.pexels.com/photos/2403391/pexels-photo-2403391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        slug: 'les-avantages-des-cartes-google-reviews-pour-les-restaurants'
      },
      {
        id: '3',
        title: 'Guide de personnalisation: créez une carte NFC unique',
        image: 'https://images.pexels.com/photos/4346312/pexels-photo-4346312.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        slug: 'guide-de-personnalisation-creez-une-carte-nfc-unique'
      }
    ]
  }
];

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(post => post.slug === slug);
  
  if (!post) {
    return (
      <div className="container-custom py-20">
        <h1>Article non trouvé</h1>
        <Link to="/" className="text-gold-500 hover:text-gold-600">
          Retour à l'accueil
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
            src={post.image} 
            alt={post.title}
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
              to="/" 
              className="inline-flex items-center text-white mb-6 hover:text-gold-500 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Retour au blog
            </Link>
            
            <span className="inline-block bg-gold-500 text-white text-sm px-3 py-1 rounded-full mb-4">
              {post.category}
            </span>
            
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{post.readTime} de lecture</span>
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
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Author Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 p-6 bg-primary-50 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <img 
                  src={post.author.image} 
                  alt={post.author.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{post.author.name}</h3>
                  <p className="text-primary-600">{post.author.role}</p>
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
                    href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${post.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary-100 hover:bg-primary-200 p-3 rounded-lg transition-colors"
                  >
                    <Twitter size={20} />
                  </a>
                  <a 
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}&title=${post.title}`}
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
                  {post.relatedPosts.map(relatedPost => (
                    <Link 
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.slug}`}
                      className="group block"
                    >
                      <div className="aspect-video rounded-lg overflow-hidden mb-2">
                        <img 
                          src={relatedPost.image} 
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="font-medium group-hover:text-gold-500 transition-colors">
                        {relatedPost.title}
                      </h4>
                    </Link>
                  ))}
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