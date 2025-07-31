import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { languageOptions } from '../../i18n';
import { useAuth } from '../../hooks/useAuth';
import Logo from './Logo';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLangDropdown = () => setIsLangDropdownOpen(!isLangDropdownOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangDropdownOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsUserDropdownOpen(false);
  };

  const handleAdminAccess = () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      window.open(`http://localhost:8080/admin-redirect?_token=${token}`, '_blank');
    }
    setIsUserDropdownOpen(false);
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
              <a href="/" className="text-primary-900 hover:text-gold-500 transition-colors">
                {t('nav.home')}
              </a>
            </li>
            <li>
              <Link to="/packs" className="text-primary-900 hover:text-gold-500 transition-colors">
                Packs
              </Link>
            </li>
            <li>
              <Link to="/templates" className="text-primary-900 hover:text-gold-500 transition-colors">
                Templates
              </Link>
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
              <a href="/blog" className="text-primary-900 hover:text-gold-500 transition-colors">
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

          {isAuthenticated ? (
            <div className="relative">
              <button
                className="flex items-center space-x-2 text-primary-800 hover:text-gold-500"
                onClick={toggleUserDropdown}
              >
                <User size={20} />
                <span>{user?.name}</span>
                <ChevronDown size={16} />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg py-2 w-48">
                  <Link
                    to="/profile"
                    className="w-full text-left px-4 py-2 hover:bg-gold-50 flex items-center space-x-2"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <User size={16} />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={handleAdminAccess}
                    className="w-full text-left px-4 py-2 hover:bg-gold-50 flex items-center space-x-2"
                  >
                    <User size={16} />
                    <span>Admin Dashboard</span>
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gold-50 flex items-center space-x-2"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>{t('auth.logout')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-primary-800 hover:text-gold-500 transition-colors"
              >
                {t('auth.signIn')}
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
              >
                {t('auth.signUp')}
              </Link>
            </div>
          )}

          <a href="/customize" className="btn btn-primary">
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
                <Link
                  to="/packs"
                  className="block text-primary-900 hover:text-gold-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Packs
                </Link>
              </li>
              <li>
                <Link
                  to="/templates"
                  className="block text-primary-900 hover:text-gold-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Templates
                </Link>
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

              {isAuthenticated ? (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2 text-primary-700">
                    <User size={20} />
                    <span>{user?.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleAdminAccess();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-primary-600 hover:text-gold-500"
                  >
                    <User size={16} />
                    <span>Admin Dashboard</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-primary-600 hover:text-gold-500"
                  >
                    <LogOut size={16} />
                    <span>{t('auth.logout')}</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="text-primary-800 hover:text-gold-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('auth.signIn')}
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary inline-block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('auth.signUp')}
                  </Link>
                </div>
              )}

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
