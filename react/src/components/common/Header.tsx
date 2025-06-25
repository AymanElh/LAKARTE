import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown } from 'lucide-react';
import { languageOptions } from '../../i18n';
import Logo from './Logo';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLangDropdown = () => setIsLangDropdownOpen(!isLangDropdownOpen);
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangDropdownOpen(false);
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const currentLang = languageOptions.find(lang => lang.code === i18n.language) || languageOptions[0];
  
  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container-custom flex justify-between items-center">
        <Logo />
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-6">
            <li>
              <a href="#home" className="text-primary-900 hover:text-gold-500 transition-colors">
                {t('nav.home')}
              </a>
            </li>
            <li>
              <a href="#gallery" className="text-primary-900 hover:text-gold-500 transition-colors">
                {t('nav.gallery')}
              </a>
            </li>
            <li>
              <a href="#testimonials" className="text-primary-900 hover:text-gold-500 transition-colors">
                {t('nav.testimonials')}
              </a>
            </li>
            <li>
              <a href="#pricing" className="text-primary-900 hover:text-gold-500 transition-colors">
                {t('nav.pricing')}
              </a>
            </li>
            <li>
              <a href="#blog" className="text-primary-900 hover:text-gold-500 transition-colors">
                {t('nav.blog')}
              </a>
            </li>
          </ul>
          
          <div className="relative">
            <button 
              className="flex items-center space-x-1 text-primary-800 hover:text-gold-500"
              onClick={toggleLangDropdown}
            >
              <span>{currentLang.flag}</span>
              <span>{currentLang.code.toUpperCase()}</span>
              <ChevronDown size={16} />
            </button>
            
            {isLangDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg py-2 w-36">
                {languageOptions.map((lang) => (
                  <button
                    key={lang.code}
                    className="w-full text-left px-4 py-2 hover:bg-gold-50 flex items-center space-x-2"
                    onClick={() => changeLanguage(lang.code)}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <a href="#customize" className="btn btn-primary">
            {t('hero.cta')}
          </a>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            className="text-primary-900 p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container-custom py-4">
            <ul className="space-y-4">
              <li>
                <a 
                  href="#home" 
                  className="block text-primary-900 hover:text-gold-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.home')}
                </a>
              </li>
              <li>
                <a 
                  href="#gallery" 
                  className="block text-primary-900 hover:text-gold-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.gallery')}
                </a>
              </li>
              <li>
                <a 
                  href="#testimonials" 
                  className="block text-primary-900 hover:text-gold-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.testimonials')}
                </a>
              </li>
              <li>
                <a 
                  href="#pricing" 
                  className="block text-primary-900 hover:text-gold-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.pricing')}
                </a>
              </li>
              <li>
                <a 
                  href="#blog" 
                  className="block text-primary-900 hover:text-gold-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.blog')}
                </a>
              </li>
            </ul>
            
            <div className="mt-4 flex flex-col space-y-4">
              <div className="flex space-x-4">
                {languageOptions.map((lang) => (
                  <button
                    key={lang.code}
                    className={`flex items-center space-x-1 ${i18n.language === lang.code ? 'text-gold-500 font-medium' : 'text-primary-600'}`}
                    onClick={() => changeLanguage(lang.code)}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>
              
              <a 
                href="#customize" 
                className="btn btn-primary inline-block"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('hero.cta')}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;