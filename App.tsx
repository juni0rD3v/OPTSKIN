
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import ServiceModal from './components/ServiceModal';
import ContactSection from './components/ContactSection';
import AboutPage from './components/AboutPage';
import BlogPage from './components/BlogPage';
import ServicePage from './components/ServicePage';
import BlogPostDetail from './components/BlogPostDetail';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Toast, { ToastType } from './components/Toast';
import { ArrowRight, Star, Calendar, ChevronDown, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { ServiceInfo, BlogPost, ServiceCategory, BookingFormData, Appointment, AppointmentStatus, Inquiry } from './types';
import { servicesData } from './data/services';
import { blogPostsData } from './data/blogPosts';
import { backend } from './services/backend';

const App: React.FC = () => {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'blog' | 'services' | 'login' | 'admin'>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({ 
    message: '', 
    type: 'info', 
    isVisible: false 
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true });
  };

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedCategory, setPreselectedCategory] = useState<string>('');
  const [preselectedServiceTitle, setPreselectedServiceTitle] = useState<string>('');
  
  const [selectedService, setSelectedService] = useState<ServiceInfo | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Blog State
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [visibleBlogCount, setVisibleBlogCount] = useState(3);
  const [blogSectionVisible, setBlogSectionVisible] = useState(false);
  const blogSectionRef = useRef<HTMLDivElement>(null);

  // Hero Slider State
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  // --- Admin / Data State (Now Fetched from Backend) ---
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch Data on Load
  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedAppts, fetchedInquiries] = await Promise.all([
          backend.getAppointments(),
          backend.getInquiries()
        ]);
        setAppointments(fetchedAppts);
        setInquiries(fetchedInquiries);
      } catch (error) {
        console.error("Failed to load data:", error);
        showToast("Failed to load backend data", "error");
      } finally {
        setIsLoadingData(false);
      }
    };
    loadData();
  }, []);

  const displayedBlogPosts = blogPostsData.slice(0, visibleBlogCount);
  const hasMorePosts = visibleBlogCount < blogPostsData.length;

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedBlogPost]);

  // Intersection Observer for Blog Section Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBlogSectionVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (blogSectionRef.current) {
      observer.observe(blogSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleNavigation = (page: 'home' | 'about' | 'blog' | 'services' | 'login' | 'admin', sectionId?: string) => {
    // If navigating to blog, clear selected post to show list
    if (page === 'blog') setSelectedBlogPost(null);

    // If trying to access admin without auth, send to login
    if (page === 'admin' && !isAuthenticated) {
      setCurrentPage('login');
      return;
    }

    if (page !== currentPage) {
      setCurrentPage(page);
      // If switching pages and there's a section ID, we need to wait for render
      if (sectionId) {
        setTimeout(() => {
          const element = document.querySelector(sectionId);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      // Same page, just scroll
      if (sectionId) {
        const element = document.querySelector(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (page === 'home' && sectionId === '#') {
           window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleOpenBooking = (category?: string, serviceTitle?: string) => {
    setPreselectedCategory(category || '');
    setPreselectedServiceTitle(serviceTitle || '');
    setIsBookingModalOpen(true);
  };

  const handleServiceClick = (service: ServiceInfo) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const handleBookServiceFromCard = (e: React.MouseEvent, service: ServiceInfo) => {
    e.stopPropagation();
    handleOpenBooking(service.category, service.title);
  };

  const handleBlogPostClick = (post: BlogPost) => {
    setSelectedBlogPost(post);
    setCurrentPage('blog');
  };

  const handleLoadMoreStories = () => {
    setVisibleBlogCount(prev => prev + 3);
  };

  // Admin Handlers
  const handleAdminLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('admin');
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  const handleNewBooking = async (formData: BookingFormData) => {
    const newAppointment: Appointment = {
      id: `APT-${Date.now().toString().slice(-4)}`,
      clientName: formData.name,
      service: formData.service || formData.category,
      date: formData.date,
      time: formData.time,
      phone: formData.phone,
      email: formData.email,
      status: 'Pending',
      notes: formData.concern
    };
    
    // Save to backend
    await backend.addAppointment(newAppointment);
    
    // Update local state to reflect change immediately
    setAppointments(prev => [newAppointment, ...prev]);
  };

  const handleUpdateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    // Optimistic UI update
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status } : apt
    ));
    // Persist to backend
    await backend.updateAppointmentStatus(id, status);
  };

  const handleNewInquiry = async (data: { name: string; email: string; phone: string; message: string }) => {
    const newInquiry: Inquiry = {
      id: `INQ-${Date.now().toString().slice(-4)}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      date: new Date().toISOString().split('T')[0],
      read: false
    };
    
    // Save to backend
    await backend.addInquiry(newInquiry);
    
    // Update local state
    setInquiries(prev => [newInquiry, ...prev]);
    showToast('Inquiry sent! We will contact you shortly.', 'success');
  };

  const handleMarkInquiryRead = async (id: string) => {
    // Optimistic UI Update
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, read: true } : inq));
    showToast('Inquiry marked as read', 'success');
    
    // Persist
    await backend.markInquiryRead(id);
  };

  // Hero Slides Data
  const heroSlides = [
    {
      id: 1,
      type: 'brand',
      title: "OPTIMUM SKIN",
      description: "Your partner in achieving your Skin Goals. Optimum Skin is a leading aesthetic provider that leverages innovative technology to enhance beauty and wellness. Our team of experts is dedicated to providing personalized skincare treatments and high-quality products tailored to each client's unique needs.",
      image: "https://picsum.photos/1000/800?random=hero1", // Placeholder for doctor/device image
      ctaText: "Book a Consultation",
      onCtaClick: () => handleOpenBooking(),
      layout: 'image-left' // Text right, Image left
    },
    {
      id: 2,
      type: 'feature',
      subtitle: "Featured Treatment",
      title: "ASCE + EXOSOMES",
      headline: "The Secret to Radiant, Healthy Skin",
      description: "According to Dr. Porfirio Tica, ASCE+ Exosomes is a revolutionary new skincare treatment that harnesses the power of exosomes to deliver unparalleled results...",
      image: "https://picsum.photos/1000/800?random=10",
      ctaText: "Read Full Article",
      onCtaClick: () => handleBlogPostClick(blogPostsData[1]),
      reviews: true,
      layout: 'image-right' // Text left, Image right (original layout)
    }
  ];

  // Auto-advance hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      if (currentPage === 'home') {
        setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [currentPage]);

  const renderContent = () => {
    // Admin Views
    if (currentPage === 'login') {
      return (
        <AdminLogin 
          onLogin={handleAdminLogin} 
          onBack={() => setCurrentPage('home')}
          showToast={showToast}
        />
      );
    }

    if (currentPage === 'admin') {
      return (
        <AdminDashboard 
          onLogout={handleAdminLogout} 
          appointments={appointments}
          inquiries={inquiries}
          onStatusChange={handleUpdateAppointmentStatus}
          onMarkInquiryRead={handleMarkInquiryRead}
          showToast={showToast}
          onViewSite={() => setCurrentPage('home')}
        />
      );
    }

    // Public Views
    if (currentPage === 'about') return <AboutPage />;
    
    if (currentPage === 'services') {
      return (
        <ServicePage 
          onServiceClick={handleServiceClick} 
          onBookClick={handleOpenBooking} 
        />
      );
    }
    
    if (currentPage === 'blog') {
      if (selectedBlogPost) {
        return (
          <BlogPostDetail 
            post={selectedBlogPost} 
            onBack={() => setSelectedBlogPost(null)} 
            onBookClick={() => handleOpenBooking()}
          />
        );
      }
      return <BlogPage onPostClick={handleBlogPostClick} />;
    }

    return (
      <>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 md:px-6 bg-[#FDFBF7] min-h-[600px] flex items-center overflow-hidden">
          <div className="container mx-auto relative z-10">
            {heroSlides.map((slide, index) => (
              <div 
                key={slide.id}
                className={`transition-all duration-700 ease-in-out absolute inset-0 w-full h-full flex items-center ${
                  index === currentHeroSlide 
                    ? 'opacity-100 translate-x-0 relative' 
                    : 'opacity-0 translate-x-8 absolute top-0 pointer-events-none'
                }`}
              >
                <div className="grid md:grid-cols-2 gap-12 items-center w-full">
                  {/* Layout Logic */}
                  {slide.layout === 'image-left' ? (
                    <>
                      {/* Image Left */}
                      <div className="order-1 relative">
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                          <img 
                            src={slide.image} 
                            alt={slide.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Text Right */}
                      <div className="order-2 space-y-6">
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 tracking-tight uppercase">
                          {slide.title}
                        </h1>
                        <p className="text-gray-600 text-lg leading-relaxed">
                          {slide.description}
                        </p>
                        <button 
                          onClick={slide.onCtaClick}
                          className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gold-600 transition-colors shadow-lg mt-4"
                        >
                          {slide.ctaText} <ArrowRight size={18} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                       {/* Text Left (Original Layout) */}
                       <div className="order-2 md:order-1 space-y-6">
                        {slide.subtitle && (
                          <span className="text-gold-600 font-bold tracking-widest text-sm uppercase">{slide.subtitle}</span>
                        )}
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                          {slide.title} <br />
                          {slide.headline && (
                            <span className="text-gold-600 text-3xl md:text-5xl font-normal italic normal-case block mt-2">
                              {slide.headline}
                            </span>
                          )}
                        </h1>
                        <p className="text-gray-600 text-lg leading-relaxed">
                          {slide.description}
                        </p>
                        <button 
                          onClick={slide.onCtaClick}
                          className="inline-flex items-center gap-2 text-black font-bold border-b-2 border-black pb-1 hover:text-gold-600 hover:border-gold-600 transition-colors"
                        >
                          {slide.ctaText} <ArrowRight size={16} />
                        </button>
                      </div>

                      {/* Image Right */}
                      <div className="order-1 md:order-2 relative">
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                          <img 
                            src={slide.image} 
                            alt={slide.title} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        {slide.reviews && (
                          <div className="absolute -bottom-6 -left-6 bg-white p-6 shadow-xl rounded-lg max-w-xs hidden lg:block animate-fade-in-up">
                            <div className="flex items-center gap-2 mb-2">
                              <Star className="fill-gold-400 text-gold-400" size={16} />
                              <Star className="fill-gold-400 text-gold-400" size={16} />
                              <Star className="fill-gold-400 text-gold-400" size={16} />
                              <Star className="fill-gold-400 text-gold-400" size={16} />
                              <Star className="fill-gold-400 text-gold-400" size={16} />
                            </div>
                            <p className="text-sm text-gray-600 italic">"The results are instantaneous and simply magical."</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Slider Controls */}
          <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
             {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentHeroSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentHeroSlide === index ? 'bg-gold-600 w-8' : 'bg-gray-300 hover:bg-gold-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
             ))}
          </div>
        </section>

        {/* Featured Services Teaser */}
        <section className="py-20 px-4 md:px-6 bg-gray-50">
           <div className="container mx-auto">
             <div className="flex flex-col md:flex-row justify-between items-end mb-12">
               <div>
                 <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-2">Featured Treatments</h2>
                 <div className="w-16 h-1 bg-gold-500 mb-4"></div>
                 <p className="text-gray-500 max-w-lg">Discover our most popular services designed to help you look and feel your absolute best.</p>
               </div>
               <button 
                 onClick={() => handleNavigation('services')}
                 className="hidden md:flex items-center gap-2 text-black font-bold hover:text-gold-600 transition-colors border-b-2 border-transparent hover:border-gold-600 pb-1"
               >
                 View All Services <ArrowRight size={18} />
               </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {servicesData.slice(0, 4).map((service, index) => (
                  <div 
                    key={service.id}
                    onClick={() => handleServiceClick(service)}
                    className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 group cursor-pointer animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="h-48 overflow-hidden relative">
                       <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                       <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                          <span className="text-xs text-gold-400 font-bold uppercase">{service.category}</span>
                          <h3 className="text-white font-serif font-bold text-lg leading-tight">{service.title}</h3>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
             
             <div className="text-center mt-8 md:hidden">
                <button 
                   onClick={() => handleNavigation('services')}
                   className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold"
                >
                  View All Services <ArrowRight size={18} />
                </button>
             </div>
           </div>
        </section>

        {/* About Us Teaser Section */}
        <section id="about" className="py-20 px-4 md:px-6 bg-[#f5f5f5] scroll-mt-24">
          <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img src="https://picsum.photos/600/600?random=30" alt="Clinic Interior" className="rounded-2xl shadow-xl w-full" />
              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-full w-48 h-48 flex flex-col items-center justify-center shadow-2xl hidden md:flex animate-bounce-slow">
                  <span className="text-4xl font-serif font-bold text-gold-600">30+</span>
                  <span className="text-gray-600 text-sm font-semibold uppercase tracking-wide mt-1">Years of Legacy</span>
              </div>
            </div>
            <div>
              <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6 uppercase tracking-wider">About Us</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Optimum Glow started in 2015 with a vision to be a recognized premier aesthetic provider in the category of beauty enhancement and wellness improvement, utilizing world-class technology.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Founded by Dr. Porfirio P. Tica, we are committed to providing expert skin care to our clients, delivering suitable treatments and high-quality products that fit any client's skin condition.
              </p>

              <button 
                  onClick={() => handleNavigation('about')}
                  className="text-gold-600 font-bold hover:text-gold-800 transition-colors flex items-center gap-2 group"
              >
                Read Our Full Story <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <blockquote className="mt-12 border-l-4 border-gold-500 pl-6 italic text-gray-700">
                "Optimum Skin is a leading aesthetic provider that leverages innovative technology to enhance beauty and wellness."
              </blockquote>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <ContactSection onSubmit={handleNewInquiry} />

        {/* Blog / Latest Stories Teaser */}
        <section 
          id="blog" 
          ref={blogSectionRef}
          className="py-20 px-4 md:px-6 container mx-auto scroll-mt-24 min-h-[600px]"
        >
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-4xl font-bold text-gray-900 mb-2">Latest Stories</h2>
              <p className="text-gray-500">Stay updated with the latest trends in aesthetic medicine.</p>
            </div>
            <button 
              onClick={() => handleNavigation('blog')}
              className="text-gold-600 font-bold hover:text-black transition-colors mt-4 md:mt-0 hidden md:block"
            >
              Visit Blog Page
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {displayedBlogPosts.map((post, index) => (
              <div 
                key={post.id} 
                className={`group cursor-pointer ${blogSectionVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${(index % 3) * 150}ms`, animationFillMode: 'forwards' }}
                onClick={() => handleBlogPostClick(post)}
              >
                <div className="overflow-hidden rounded-xl mb-4">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-2 text-gold-600 text-xs font-bold uppercase tracking-wider mb-2">
                  <Calendar size={12} /> {post.date}
                </div>
                <h3 className="font-serif text-xl font-bold text-gray-900 leading-snug group-hover:text-gold-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            {hasMorePosts ? (
              <button 
                onClick={handleLoadMoreStories}
                className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gold-600 transition-colors"
              >
                View More Stories <ChevronDown size={18} />
              </button>
            ) : (
               <button 
                onClick={() => handleNavigation('blog')}
                className="inline-flex items-center gap-2 border-2 border-black text-black px-8 py-3 rounded-full font-bold hover:bg-black hover:text-white transition-colors"
              >
                Go to Blog Page <ArrowRight size={18} />
              </button>
            )}
          </div>
        </section>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* Global Toast */}
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />

      {currentPage !== 'login' && currentPage !== 'admin' && (
        <Header 
          currentPage={currentPage as any}
          onNavigate={handleNavigation as any}
          onBookClick={() => handleOpenBooking()} 
        />
      )}

      {renderContent()}

      {currentPage !== 'login' && currentPage !== 'admin' && (
        <Footer 
          onNavigate={handleNavigation}
          onBookClick={() => handleOpenBooking()} 
          isAuthenticated={isAuthenticated}
        />
      )}
      
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        preselectedCategory={preselectedCategory}
        preselectedServiceId={preselectedServiceTitle}
        onConfirmBooking={handleNewBooking}
        showToast={showToast}
      />

      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        service={selectedService}
        onBook={() => {
          setIsServiceModalOpen(false);
          handleOpenBooking(selectedService?.category, selectedService?.title);
        }}
      />
    </div>
  );
};

export default App;
