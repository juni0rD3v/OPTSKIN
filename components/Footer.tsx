import React from 'react';
import { Facebook, Instagram, Phone, MapPin, Lock, LayoutDashboard } from 'lucide-react';

interface FooterProps {
  onBookClick: () => void;
  onNavigate: (page: 'home' | 'about' | 'blog' | 'login' | 'admin', sectionId?: string) => void;
  isAuthenticated?: boolean;
}

const Footer: React.FC<FooterProps> = ({ onBookClick, onNavigate, isAuthenticated = false }) => {
  const handleLinkClick = (e: React.MouseEvent, page: 'home' | 'about' | 'blog' | 'login' | 'admin', sectionId?: string) => {
    e.preventDefault();
    onNavigate(page, sectionId);
  };

  return (
    <footer id="footer" className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold">Optimum<span className="text-gold-400">Skin</span></h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Leading aesthetic provider leveraging innovative technology to enhance beauty and wellness.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" onClick={(e) => e.preventDefault()}><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" onClick={(e) => e.preventDefault()}><Instagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 font-serif">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" onClick={(e) => handleLinkClick(e, 'home', '#')} className="hover:text-gold-400 transition-colors">Home</a></li>
              <li><a href="#services" onClick={(e) => handleLinkClick(e, 'home', '#services')} className="hover:text-gold-400 transition-colors">Services</a></li>
              <li><a href="#about" onClick={(e) => handleLinkClick(e, 'about')} className="hover:text-gold-400 transition-colors">About Us</a></li>
              <li><a href="#blog" onClick={(e) => handleLinkClick(e, 'blog')} className="hover:text-gold-400 transition-colors">Blog</a></li>
              <li><a href="#contact" onClick={(e) => handleLinkClick(e, 'home', '#contact')} className="hover:text-gold-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Location */}
          <div id="location" className="scroll-mt-24">
            <h4 className="text-lg font-semibold mb-6 font-serif">Our Location</h4>
            <div className="flex items-start gap-3 text-sm text-gray-400">
              <MapPin size={20} className="text-gold-500 shrink-0 mt-1" />
              <p>
                Unit A2 Ground Floor & Mezzanine,<br />
                Phase 1 Arco Parade Arcovia City,<br />
                C5 Pasig City
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6 font-serif">Contact Us</h4>
            <div className="flex items-center gap-3 text-sm text-gray-400 mb-6">
              <Phone size={20} className="text-gold-500 shrink-0" />
              <p>0917 706 1616</p>
            </div>
            <button 
              onClick={onBookClick}
              className="w-full bg-gold-600 hover:bg-gold-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors transform hover:scale-105"
            >
              Book an Appointment
            </button>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2025 Optimum Skin. All Rights Reserved.</p>
          <button 
            onClick={(e) => handleLinkClick(e, isAuthenticated ? 'admin' : 'login')} 
            className={`flex items-center gap-1 transition-colors ${isAuthenticated ? 'text-gold-400 hover:text-white font-bold' : 'hover:text-gray-300'}`}
          >
            {isAuthenticated ? <LayoutDashboard size={12} /> : <Lock size={12} />} 
            {isAuthenticated ? 'Return to Dashboard' : 'Staff Access'}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;