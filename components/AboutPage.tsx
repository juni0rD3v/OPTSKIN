import React from 'react';
import { Quote, Target, Eye, Heart, ShieldCheck, Award } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="pt-20 animate-fade-in">
      {/* Hero Section */}
      <section className="relative py-24 bg-gray-900 text-white">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://picsum.photos/1920/800?random=about1" 
            alt="Clinic Interior" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">About <span className="text-gold-400">Optimum</span> Skin</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Welcome to Optimum Skin Aesthetics and Laser Center. <br/>
            Celebrating 30 Years of Aesthetic Mastery.
          </p>
        </div>
      </section>

      {/* Founder's Message */}
      <section className="py-20 px-4 md:px-6 bg-[#FDFBF7]">
        <div className="container mx-auto grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5 relative">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative">
              <img 
                src="https://picsum.photos/600/800?random=doctor" 
                alt="Dr. Porfirio P. Tica" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 text-white">
                <h3 className="font-serif text-2xl font-bold">Dr. Porfirio P. Tica</h3>
                <p className="text-gold-400 text-sm uppercase tracking-widest">Founder & Lead Surgeon</p>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-white p-6 rounded-xl shadow-lg border-l-4 border-gold-600 hidden md:block">
               <Award size={32} className="text-gold-600 mb-2" />
               <p className="font-bold text-gray-900">30+ Years</p>
               <p className="text-xs text-gray-500">of Experience</p>
            </div>
          </div>
          
          <div className="md:col-span-7 space-y-8">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gold-100">
              <Quote size={40} className="text-gold-200 mb-4" />
              <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">A Message from our Founder</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed italic">
                <p>
                  "To our patients, friends, and partners, I extend my deepest gratitude for entrusting us with your beauty and well-being. Your support has been the cornerstone of our success, and we are committed to delivering nothing but the best in return."
                </p>
                <p>
                  "With over three decades of experience as a cosmetic surgeon, my journey in the field of aesthetics has been nothing short of extraordinary. Every year, every patient, and every procedure has contributed to my understanding of the profound impact of aesthetic medicine."
                </p>
                <p>
                  "As you navigate through our website and explore our services, I invite you to become a part of the Optimum Skin family. Join us on a journey of transformation, confidence, and beauty."
                </p>
              </div>
              <p className="mt-8 font-serif font-bold text-lg text-gray-900 not-italic">
                — Dr. Porfirio P. Tica
              </p>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">Continuing the Legacy</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                I take immense pride in announcing the legacy I have built is being carried forward by a remarkable team, with unwavering dedication and a commitment to maintaining the highest standards of patient care. Together, they bring fresh perspectives and boundless energy to our center.
              </p>
              <p className="text-gray-600 leading-relaxed">
                At Optimum Skin, we embrace innovation, safety, and patient satisfaction as our guiding principles. As we celebrate 30 years of excellence, we also look to the future with excitement and optimism.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            {/* Mission */}
            <div className="bg-gray-50 p-10 rounded-3xl relative overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target size={120} />
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center text-gold-600">
                  <Target size={24} />
                </div>
                <h2 className="font-serif text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Optimum Skin's mission is to set the benchmark for customer service in the aesthetic industry. We're dedicated to ensuring customer satisfaction by providing tailored dermatologic care and wellness services. Our commitment extends to continuous market leadership through the acquisition of world-class technologies that are rigorously tested for safety and effectiveness.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gray-50 p-10 rounded-3xl relative overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Eye size={120} />
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white">
                  <Eye size={24} />
                </div>
                <h2 className="font-serif text-3xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                At Optimum Skin, our aim is to become the ultimate aesthetic destination, merging advanced techniques with personalized care. Our vision is to help you, our valued client, discover your best self through the Optimum Skin experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Care */}
      <section className="py-20 px-4 md:px-6 bg-gray-900 text-white relative">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-block p-3 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
             <Heart size={32} className="text-gold-400" />
          </div>
          <h2 className="font-serif text-4xl font-bold mb-6">Patient Care Excellence</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-12">
            Our team of board certified Aesthetic Doctors and Dermatologists at Optimum Skin are all highly trained and experienced professionals who are dedicated to providing the best possible care for their patients.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
             <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <ShieldCheck className="text-gold-400 mb-4" size={28} />
                <h4 className="font-bold text-lg mb-2">Safety First</h4>
                <p className="text-sm text-gray-400">All technologies and procedures are rigorously tested for safety and effectiveness.</p>
             </div>
             <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <Award className="text-gold-400 mb-4" size={28} />
                <h4 className="font-bold text-lg mb-2">Expert Team</h4>
                <p className="text-sm text-gray-400">Board-certified specialists who continuously train in the latest global procedures.</p>
             </div>
             <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <Heart className="text-gold-400 mb-4" size={28} />
                <h4 className="font-bold text-lg mb-2">Personalized</h4>
                <p className="text-sm text-gray-400">Tailored dermatologic care and wellness services fitting your unique skin condition.</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;