import React, { useState } from 'react';
import { Send, CheckCircle, Info } from 'lucide-react';

interface ContactSectionProps {
  onSubmit: (data: { name: string; email: string; phone: string; message: string }) => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({ onSubmit }) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Simulate API call to CRM
    setTimeout(() => {
      setStatus('success');
      // Pass data to parent App to update Admin Dashboard
      onSubmit(formState);
      console.log("CRM Update: New Lead Created", formState);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReset = () => {
    setStatus('idle');
    setFormState({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section id="contact" className="py-20 px-4 md:px-6 bg-white scroll-mt-24">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-gray-600">Have a question? We'd love to hear from you.</p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          <div className="bg-gold-600 p-8 md:w-1/3 text-white flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-2xl font-bold mb-4">Contact Info</h3>
              <p className="text-gold-100 mb-6">Fill up the form and our team will get back to you within 24 hours.</p>
              
              <div className="space-y-4 text-sm">
                <p><strong>Phone:</strong> 0917 706 1616</p>
                <p><strong>Email:</strong> info@optimumskin.com</p>
                <p><strong>Address:</strong> Pasig City, Philippines</p>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gold-500/30 text-xs text-gold-200">
               <div className="flex items-start gap-2">
                 <Info size={14} className="shrink-0 mt-0.5" />
                 <p>
                   <strong>CRM Strategy:</strong> Inquiries are automatically tagged as "New Lead" in our CRM. High-intent keywords in the message trigger instant SMS notifications to our sales team.
                 </p>
               </div>
            </div>
          </div>

          <div className="p-8 md:w-2/3 min-h-[400px] flex flex-col justify-center">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center text-center py-6 animate-fade-in">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">Message Sent!</h3>
                <p className="text-gray-600 max-w-xs mx-auto mb-8">
                  Thank you for contacting us, {formState.name}. We will be in touch shortly.
                </p>
                <button 
                  onClick={handleReset}
                  className="px-6 py-2 bg-gray-100 hover:bg-gold-50 text-gold-600 font-bold rounded-full transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none transition-all"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formState.phone}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none transition-all"
                      placeholder="0917 XXX XXXX"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none transition-all"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gold-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {status === 'submitting' ? 'Sending...' : 'Send Message'} 
                  {!status && <Send size={18} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;