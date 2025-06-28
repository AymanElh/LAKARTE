import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary-900 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-primary-300 mb-4">
              {t('footer.about.text')}
            </p>
            <div className="flex space-x-3">
              <a href="https://facebook.com" className="bg-primary-800 hover:bg-gold-500 rounded-full p-2 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://instagram.com" className="bg-primary-800 hover:bg-gold-500 rounded-full p-2 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://linkedin.com" className="bg-primary-800 hover:bg-gold-500 rounded-full p-2 transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="https://twitter.com" className="bg-primary-800 hover:bg-gold-500 rounded-full p-2 transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.links')}</h3>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-primary-300 hover:text-gold-500 transition-colors">
                  {t('nav.home')}
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-primary-300 hover:text-gold-500 transition-colors">
                  {t('nav.gallery')}
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-primary-300 hover:text-gold-500 transition-colors">
                  {t('nav.testimonials')}
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-primary-300 hover:text-gold-500 transition-colors">
                  {t('nav.pricing')}
                </a>
              </li>
              <li>
                <a href="#blog" className="text-primary-300 hover:text-gold-500 transition-colors">
                  {t('nav.blog')}
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone size={18} className="mt-1 flex-shrink-0" />
                <a href="tel:+212691600160" className="text-primary-300 hover:text-gold-500 transition-colors">
                  +212 6 91 60 01 60
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={18} className="mt-1 flex-shrink-0" />
                <a href="mailto:contact@lakarte.com" className="text-primary-300 hover:text-gold-500 transition-colors">
                  contact@lakarte.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span className="text-primary-300">
                  Casablanca, Morocco
                </span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-primary-300 mb-4">
              Restez informé de nos dernières nouveautés et offres spéciales.
            </p>
            <form className="space-y-3">
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                className="w-full px-4 py-2 rounded-md bg-primary-800 border border-primary-700 focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
              />
              <button type="submit" className="btn btn-primary w-full">
                S'abonner
              </button>
            </form>
          </div>
        </div>
        
        {/* Divider */}
        <hr className="border-primary-800 my-8" />
        
        {/* Copyright */}
        <div className="text-center text-primary-400">
          <p>&copy; {currentYear} LAKARTE. {t('footer.rights')}.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;