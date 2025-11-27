import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Sparkles, CheckCircle, ChevronDown, BrainCircuit, ClipboardCheck } from 'lucide-react';
import { BookingFormData, ServiceCategory } from '../types';
import { analyzeSkinConcern } from '../services/geminiService';
import { servicesData } from '../data/services';
import { ToastType } from './Toast';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCategory?: string;
  preselectedServiceId?: string;
  onConfirmBooking: (data: BookingFormData) => void;
  showToast: (message: string, type: ToastType) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, preselectedCategory, preselectedServiceId, onConfirmBooking, showToast }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<{ category: string, reason: string } | null>(null);
  
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    concern: '',
    category: preselectedCategory || '',
    service: preselectedServiceId || '',
    date: '',
    time: ''
  });

  const timeSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM", 
    "01:00 PM", "02:00 PM", "03:00 PM", 
    "04:00 PM", "05:00 PM", "06:00 PM"
  ];

  // Get available services based on selected category
  const availableServices = servicesData.filter(
    (s) => s.category === formData.category
  );

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFormData(prev => ({ 
        ...prev, 
        category: preselectedCategory || '',
        service: preselectedServiceId || '',
        date: '',
        time: ''
      }));
      setAiRecommendation(null);
    }
  }, [isOpen, preselectedCategory, preselectedServiceId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      // If category changes, reset the specific service
      if (name === 'category') {
        return { ...prev, [name]: value, service: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleNextStep = async () => {
    if (step === 1) {
      // Validate Step 1
      if (!formData.name || !formData.phone) return;
      
      // AI Analysis Trigger
      if (formData.concern.length > 5 && !formData.category) {
        setLoading(true);
        const recommendation = await analyzeSkinConcern(formData.concern);
        setLoading(false);
        if (recommendation) {
          setAiRecommendation(recommendation);
          setFormData(prev => ({ ...prev, category: recommendation.category, service: '' }));
        } else {
           showToast('AI analysis unavailable. Please select a category manually.', 'info');
        }
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call with engaging loader
    setTimeout(() => {
      onConfirmBooking(formData);
      showToast('Booking submitted successfully!', 'success');
      setLoading(false);
      setStep(5);
    }, 2500); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in relative flex flex-col max-h-[90vh]">
        {!loading && step !== 5 && (
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X size={24} />
          </button>
        )}

        <div className="bg-gold-50 p-6 border-b border-gold-100 shrink-0">
          <h2 className="text-2xl font-serif text-gray-800">Book a Consultation</h2>
          <p className="text-gold-600 text-sm mt-1">Start your journey to radiant skin</p>
          
          {/* Progress Indicators */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ease-in-out ${step >= i ? 'bg-gold-500' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto relative min-h-[400px]">
          {step === 1 && (
            <div className="space-y-4 animate-slide-in" key="step1">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User size={20} className="text-gold-500" /> Personal Details
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name *"
                  required
                  disabled={loading}
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none disabled:bg-gray-50 transition-shadow"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    required
                    disabled={loading}
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none disabled:bg-gray-50 transition-shadow"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    disabled={loading}
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none disabled:bg-gray-50 transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What are your main skin concerns?
                  </label>
                  <textarea
                    name="concern"
                    rows={3}
                    placeholder="E.g., I have some acne scars and fine lines I want to treat..."
                    disabled={loading}
                    value={formData.concern}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none disabled:bg-gray-50 transition-shadow"
                  />
                  {!loading && (
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <BrainCircuit size={12} /> Our AI will recommend the best category for you.
                    </p>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="mt-6 border border-gold-100 rounded-xl bg-gold-50/50 p-6 animate-fade-in">
                   <div className="flex flex-col items-center justify-center gap-3 text-gold-600 mb-4">
                      <div className="bg-white p-2 rounded-full shadow-sm">
                        <Sparkles className="animate-spin text-gold-500" size={24} />
                      </div>
                      <span className="font-semibold text-sm">AI is analyzing your skin profile...</span>
                   </div>
                   <div className="space-y-3 animate-pulse">
                      <div className="h-2 bg-gold-200/50 rounded w-3/4 mx-auto"></div>
                      <div className="h-2 bg-gold-200/50 rounded w-1/2 mx-auto"></div>
                      <div className="h-2 bg-gold-200/50 rounded w-2/3 mx-auto"></div>
                   </div>
                </div>
              ) : (
                <button
                  onClick={handleNextStep}
                  disabled={!formData.name || !formData.phone}
                  className="w-full mt-4 bg-black text-white py-3 rounded-lg font-medium hover:bg-gold-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                >
                  Next Step
                </button>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-slide-in" key="step2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles size={20} className="text-gold-500" /> Treatment Selection
              </h3>

              {aiRecommendation && (
                <div className="bg-gold-50 p-4 rounded-lg border border-gold-200 mb-4 animate-fade-in">
                  <p className="text-sm font-semibold text-gold-800">Based on your concern:</p>
                  <p className="text-sm text-gray-700 mt-1 italic">"{formData.concern}"</p>
                  <div className="mt-3 flex items-start gap-2">
                    <Sparkles className="text-gold-600 shrink-0 mt-0.5" size={16} />
                    <div>
                      <p className="text-sm font-bold text-gray-900">Recommended: {aiRecommendation.category}</p>
                      <p className="text-xs text-gray-600 mt-1">{aiRecommendation.reason}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Category</label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none appearance-none bg-white transition-shadow"
                  >
                    <option value="">-- Select a Category --</option>
                    {Object.values(ServiceCategory).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              {formData.category && availableServices.length > 0 && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specific Service (Optional)</label>
                  <div className="relative">
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none appearance-none bg-white transition-shadow"
                    >
                      <option value="">-- General Consultation --</option>
                      {availableServices.map(service => (
                        <option key={service.id} value={service.title}>{service.title}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!formData.category}
                  className="flex-1 py-3 bg-black text-white rounded-lg hover:bg-gold-600 disabled:opacity-50 transition-colors shadow-lg"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-slide-in" key="step3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar size={20} className="text-gold-500" /> Preferred Date & Time
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none transition-shadow"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setFormData(prev => ({ ...prev, time: slot }))}
                      className={`py-2 px-1 text-xs md:text-sm border rounded-lg transition-colors ${
                        formData.time === slot 
                        ? 'bg-gold-600 text-white border-gold-600 shadow-md' 
                        : 'border-gray-200 text-gray-600 hover:border-gold-400 hover:text-gold-600'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 mt-2 border border-gray-100">
                <p><strong>Note:</strong> Our coordinator will contact you at <strong>{formData.phone}</strong> to confirm.</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!formData.date || !formData.time}
                  className="flex-1 py-3 bg-black text-white rounded-lg hover:bg-gold-600 disabled:opacity-50 transition-colors shadow-lg"
                >
                  Review Booking
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div key="step4-wrapper">
              {loading ? (
                 <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-6 animate-fade-in" key="loading">
                  <div className="relative">
                    {/* Pulsing rings around spinner */}
                    <div className="absolute inset-0 bg-gold-200/30 rounded-full animate-ping"></div>
                    <div className="w-20 h-20 border-4 border-gold-100 rounded-full relative bg-white">
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-gold-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <Calendar className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gold-600 animate-pulse" size={28} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-serif font-bold text-gray-900">Confirming Appointment</h3>
                    <div className="h-1 w-24 bg-gray-200 rounded-full mx-auto overflow-hidden">
                       <div className="h-full bg-gold-600 animate-[loadingBar_1.5s_ease-in-out_infinite]"></div>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">Securing your slot for <br/><span className="font-semibold text-gray-800">{formData.date}</span> at <span className="font-semibold text-gray-800">{formData.time}</span>...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-slide-in" key="review">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ClipboardCheck size={20} className="text-gold-500" /> Review Details
                  </h3>
                  
                  <div className="bg-gray-50 p-5 rounded-xl border border-gold-100 space-y-3 shadow-sm">
                      <div className="flex justify-between border-b border-gray-200 pb-3 text-sm">
                          <span className="text-gray-500">Name</span>
                          <span className="font-bold text-gray-900">{formData.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-3 text-sm">
                          <span className="text-gray-500">Contact</span>
                          <div className="text-right">
                             <div className="font-medium text-gray-900">{formData.phone}</div>
                             <div className="text-gray-500 text-xs">{formData.email}</div>
                          </div>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-3 text-sm">
                          <span className="text-gray-500">Service</span>
                          <span className="font-bold text-gray-900 text-right max-w-[60%]">
                            {formData.service || formData.category}
                          </span>
                      </div>
                      <div className="flex justify-between pt-1 text-sm">
                          <span className="text-gray-500">Date & Time</span>
                          <span className="font-bold text-gold-600 text-right">{formData.date} @ {formData.time}</span>
                      </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                     <div className="min-w-4 pt-0.5"><CheckCircle size={14} className="text-blue-500" /></div>
                     <p>By confirming, you agree to our cancellation policy. A coordinator will call you to finalize details.</p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 py-3 bg-gold-600 text-white rounded-lg hover:bg-gold-700 font-semibold transition-colors shadow-lg"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="text-center py-8 animate-fade-in" key="step5">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-[bounce_1s_ease-in-out]">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-serif text-gray-900 mb-2">Request Received!</h3>
              <p className="text-gray-600 mb-6 max-w-xs mx-auto">
                Thank you, {formData.name}.<br/>
                We have received your booking request for<br/>
                <strong className="text-black">{formData.service || formData.category}</strong><br />
                on <strong>{formData.date}</strong> at <strong>{formData.time}</strong>.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-8 text-sm text-gray-500">
                 We will send a confirmation SMS to {formData.phone} shortly.
              </div>
              <button
                onClick={onClose}
                className="px-10 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-transform hover:scale-105 shadow-lg font-bold"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;