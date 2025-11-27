import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onBookClick: () => void;
  currentPage: 'home' | 'about' | 'blog' | 'services';
  onNavigate: (page: 'home' | 'about' | 'blog' | 'services', sectionId?: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onBookClick, currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', page: 'home', href: '#' },
    { name: 'Services', page: 'services', href: '#services' },
    { name: 'About us', page: 'about', href: '#about' },
    { name: 'Our Location', page: 'home', href: '#location' },
    { name: 'Contact Us', page: 'home', href: '#contact' },
    { name: 'Blog', page: 'blog', href: '#blog' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: { name: string, page: string, href: string }) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    // Check if it's a page switch or a section scroll
    if (item.page === 'about') {
      onNavigate('about');
    } else if (item.page === 'blog') {
      onNavigate('blog');
    } else if (item.page === 'services') {
      onNavigate('services');
    } else {
      onNavigate('home', item.href);
    }
  };

  return (
    <header 
      className={`fixed w-full top-0 z-40 transition-all duration-300 ${
        isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-md py-2' 
        : 'bg-white/90 backdrop-blur-sm shadow-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
             <a 
               href="#" 
               onClick={(e) => { e.preventDefault(); onNavigate('home', '#'); }}
               className={`font-serif font-bold tracking-tight text-gray-900 transition-all duration-300 ${isScrolled ? 'text-xl' : 'text-2xl'}`}
             >
                Optimum<span className="text-gold-600">Skin</span>
             </a>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item as any)}
                className={`text-sm font-medium transition-colors uppercase tracking-wide ${
                  (currentPage === item.page && (item.page !== 'home' || (item.page === 'home' && item.name === 'Home')))
                  ? 'text-gold-600'
                  : 'text-gray-600 hover:text-gold-600'
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA Button Desktop */}
          <div className="hidden md:block">
            <button 
              onClick={onBookClick}
              className={`bg-black text-white rounded-full text-sm font-semibold hover:bg-gold-600 transition-all ${
                isScrolled ? 'px-5 py-2' : 'px-6 py-2.5'
              }`}
            >
              Book Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg h-screen overflow-y-auto pb-20 left-0 top-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`block px-3 py-3 rounded-md text-base font-medium ${
                   (currentPage === item.page && (item.page !== 'home' || item.name === 'Home'))
                   ? 'bg-gold-50 text-gold-700'
                   : 'text-gray-700 hover:bg-gold-50 hover:text-gold-700'
                }`}
                onClick={(e) => handleNavClick(e, item as any)}
              >
                {item.name}
              </a>
            ))}
            <button 
              onClick={() => {
                onBookClick();
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-3 py-3 text-gold-600 font-bold border-t border-gray-100 mt-2"
            >
              Book a Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;