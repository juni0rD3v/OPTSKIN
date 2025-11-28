
import React, { useState } from 'react';
import { ArrowRight, Star, Tag, Check, ArrowUpRight, Lock } from 'lucide-react';
import { ServiceInfo, ServiceCategory } from '../types';

interface ServicePageProps {
  onServiceClick: (service: ServiceInfo) => void;
  onBookClick: (category?: string, serviceTitle?: string) => void;
  services: ServiceInfo[]; // New Prop
}

const ServicePage: React.FC<ServicePageProps> = ({ onServiceClick, onBookClick, services }) => {
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string>('All');

  // Filter Services based on selected category. We include unavailable ones but show them differently.
  const filteredServices = selectedServiceCategory === 'All' 
    ? services 
    : services.filter(service => service.category === selectedServiceCategory);

  return (
    <div className="pt-20 animate-fade-in bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <span className="text-gold-600 font-bold uppercase tracking-widest text-sm mb-2 block">World-Class Treatments</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Services</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            From medical-grade facials to advanced laser treatments, we offer a comprehensive range of procedures tailored to your unique skin needs.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 px-4 md:px-6 container mx-auto">
        
        {/* Service Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 sticky top-24 z-30 bg-gray-50/95 p-4 backdrop-blur-sm rounded-xl">
            <button 
              onClick={() => setSelectedServiceCategory('All')}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                selectedServiceCategory === 'All' 
                ? 'bg-black text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Services
            </button>
            {Object.values(ServiceCategory).map(category => (
              <button 
                key={category}
                onClick={() => setSelectedServiceCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedServiceCategory === category 
                  ? 'bg-black text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredServices.map((service, index) => (
            <div 
              key={service.id} 
              className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full animate-fade-in-up ${!service.available ? 'opacity-75 grayscale' : ''}`}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => service.available && onServiceClick(service)}
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded text-gray-800 shadow-sm uppercase tracking-wider">
                  {service.category}
                </div>
                {!service.available && (
                   <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg">
                         <Lock size={16} /> Temporarily Unavailable
                      </span>
                   </div>
                )}
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-2">
                   <h3 className={`font-serif text-lg font-bold text-gray-900 leading-tight group-hover:text-gold-600 transition-colors ${!service.available ? 'line-through text-gray-400' : ''}`}>
                    {service.title}
                  </h3>
                </div>
                
                <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                  {service.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <span className="text-gold-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                    Details <ArrowUpRight size={14} />
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (service.available) onBookClick(service.category, service.title);
                    }}
                    disabled={!service.available}
                    className={`text-xs font-bold px-4 py-2 rounded-full transition-colors shadow-sm ${
                        service.available 
                        ? 'bg-gray-900 text-white hover:bg-gold-600' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                    }`}
                  >
                    {service.available ? 'Book Now' : 'Closed'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredServices.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No services found in this category.
            </div>
        )}
      </section>

      {/* Ultherapy Promo Section */}
      <section className="py-20 bg-gray-900 text-white relative overflow-hidden mt-12">
        <div className="absolute inset-0 opacity-20">
            <img src="https://picsum.photos/1920/1080?random=20" className="w-full h-full object-cover" alt="Background" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block bg-gold-600 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-4">Limited Offer</div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              ULTHERAPY: Non-Surgical Lifting
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Get the stunning transformation you've always wanted! Effective for treating a wide range of skin concerns, delivering natural-looking results without downtime.
              <br /><br />
              <span className="flex items-center gap-2 mb-2"><Check className="text-gold-500" size={16}/> Full Face Ulthera Treatment (400 Shots)</span>
              <span className="flex items-center gap-2"><Check className="text-gold-500" size={16}/> Full Face Plus Package (600 Shots)</span>
              <span className="text-gold-400 font-bold text-xl block mt-6">Get as much as 30% off!</span>
            </p>
            <button 
              onClick={() => onBookClick('Skin Rejuvenation', 'Ultherapy')}
              className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gold-500 hover:text-white transition-all transform hover:scale-105 shadow-lg"
            >
              Book Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;
