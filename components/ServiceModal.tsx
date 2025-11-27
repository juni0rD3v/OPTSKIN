import React from 'react';
import { X, Check, Tag, Clock } from 'lucide-react';
import { ServiceInfo } from '../types';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceInfo | null;
  onBook: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, service, onBook }) => {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row max-h-[90vh]">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full text-gray-500 hover:text-black hover:bg-white transition-all"
        >
          <X size={20} />
        </button>

        {/* Image Section */}
        <div className="md:w-2/5 h-48 md:h-auto relative">
          <img 
            src={service.image} 
            alt={service.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r" />
          <div className="absolute bottom-4 left-4 text-white md:hidden">
            <h3 className="text-xl font-serif font-bold">{service.title}</h3>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <h2 className="hidden md:block text-3xl font-serif font-bold text-gray-900 mb-2">{service.title}</h2>
          <span className="inline-block px-3 py-1 bg-gold-100 text-gold-800 text-xs font-bold uppercase tracking-wider rounded mb-4">
            {service.category}
          </span>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">About the Treatment</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {service.detailedDescription}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">Key Benefits</h4>
              <ul className="space-y-2">
                {service.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Tag size={16} className="text-gold-600" />
                <span className="text-xs font-bold text-gray-500 uppercase">Price Range</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{service.priceRange}</p>
              <p className="text-xs text-gray-400 mt-1">* Prices may vary based on consultation.</p>
            </div>

            <button
              onClick={() => {
                onClose();
                onBook();
              }}
              className="w-full bg-black text-white py-3.5 rounded-lg font-bold hover:bg-gold-600 transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
            >
              <Clock size={18} /> Book This Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;