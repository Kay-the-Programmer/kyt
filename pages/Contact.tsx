
import React, { useState, useLayoutEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { gsap } from 'gsap';
import Footer from '../components/Footer';
import SplitText from '../components/SplitText';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const headerRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Header Reveal
    // Use .to() instead of .from() to avoid initial state locking issues
    if (headerRef.current) {
      const chars = headerRef.current.querySelectorAll('.letter-reveal');
      gsap.set(chars, { y: 100, opacity: 0, rotate: 10 });
      gsap.to(chars, {
        y: 0,
        opacity: 1,
        rotate: 0,
        duration: 1,
        stagger: 0.03,
        delay: 1.2, // Wait for TransitionOverlay
        ease: 'power4.out'
      });
    }

    gsap.set(formRef.current, { opacity: 0, y: 40 });
    gsap.to(formRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      delay: 1.4,
      ease: 'power3.out'
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call for contact form
    setTimeout(() => {
      setLoading(false);
      console.log('Form Submission:', JSON.stringify(formData, null, 2)); // Log data for debugging
      setStatus({ type: 'success', message: 'Thank you for your message. We will be in touch shortly!' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const getAiHelp = async (query: string) => {
    setAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I want to draft a message to Kytriq Technologies about: ${query}. 
        Provide a professional, short, and impactful inquiry draft that I can use in a contact form.`,
        config: {
          systemInstruction: "You are a professional assistant helping a client draft a software project inquiry."
        }
      });
      setFormData(prev => ({ ...prev, message: response.text || '' }));
    } catch (err: any) {
      console.error(err);
      setStatus({
        type: 'error',
        message: 'AI Service Temporarily Unavailable. Please write your message manually.'
      });
      // Clear error after 5 seconds
      setTimeout(() => setStatus(null), 5000);
    } finally {
      setAiLoading(false);
    }
  };



  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-20 bg-white dark:bg-brand-dark transition-colors duration-300 overflow-hidden relative">
      {/* Decorative interactive background elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-purple-600/5 rounded-full blur-[80px] animate-pulse [animation-delay:2s]"></div>

      <div className="max-w-7xl mx-auto relative z-10 mb-20">
        <header className="mb-16 md:mb-20 px-6">
          {/* Removed overflow-hidden to ensure animated chars are visible */}
          <h1 ref={headerRef} className="text-5xl md:text-[6rem] font-heading font-extrabold mb-6 md:mb-8 tracking-tighter text-gray-900 dark:text-white leading-none">
            <SplitText text="Let's " /> <SplitText text="Talk." isGradient={true} className="inline-block" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl max-w-2xl font-light leading-relaxed">
            Whether you have a specific project in mind or just want to explore how AI can help your business, we're here to help.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20 px-6">
          {/* Form */}
          <div ref={formRef} className="bg-gray-50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-sm backdrop-blur-sm">
            {status ? (
              <div className={`p-8 rounded-3xl text-center ${status.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400'}`}>
                <i className={`fa-solid ${status.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} text-4xl mb-4`}></i>
                <p className="text-lg font-bold">{status.message}</p>
                <button
                  onClick={() => setStatus(null)}
                  className="mt-6 text-sm font-bold underline hover:no-underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
                    placeholder="Project Inquiry"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Message</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-colors resize-none"
                    placeholder="Tell us about your project... (min 10 characters)"
                    minLength={10}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                >
                  {loading ? (
                    <i className="fa-solid fa-spinner fa-spin"></i>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <i className="fa-solid fa-paper-plane text-xs"></i>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* AI Helper & Contact info */}
          <div className="flex flex-col justify-between py-2">
            <div className="space-y-10 md:space-y-12">
              <div className="bg-blue-600/5 dark:bg-blue-600/10 border border-blue-600/10 dark:border-blue-500/20 p-8 rounded-[2rem] hover:bg-blue-600/10 transition-colors duration-500">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-wand-magic-sparkles text-white text-xs"></i>
                  </div>
                  <h4 className="font-heading font-bold text-gray-900 dark:text-white">AI Inquiry Draftsman</h4>
                </div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-6 italic leading-relaxed">
                  "Not sure how to start? Tell me what you need, and I'll draft a professional message for you."
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[
                    "New AI product",
                    "E-commerce POS",
                    "Custom Mobile App",
                    "Cloud Architecture"
                  ].map(q => (
                    <button
                      key={q}
                      onClick={() => getAiHelp(q)}
                      disabled={aiLoading}
                      className="px-3 py-2 bg-white dark:bg-blue-600/10 border border-gray-200 dark:border-blue-500/20 rounded-full text-[10px] text-blue-600 dark:text-blue-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600/20 transition-all flex items-center space-x-2 shadow-sm"
                    >
                      {aiLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <span>{q}</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-heading font-bold mb-6 md:mb-8 text-gray-900 dark:text-white">Contact Info</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 group cursor-pointer">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-500 border border-gray-100 dark:border-gray-800 shadow-sm shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <i className="fa-solid fa-location-dot text-sm"></i>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm group-hover:text-blue-600 transition-colors">Tech Hub Central, Palo Alto, CA</p>
                  </div>
                  <div className="flex items-center space-x-4 group cursor-pointer">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-500 border border-gray-100 dark:border-gray-800 shadow-sm shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <i className="fa-solid fa-envelope text-sm"></i>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm group-hover:text-blue-600 transition-colors">hello@kytriq.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-6 pt-12">
              <a href="#" className="text-gray-400 hover:text-blue-600 hover:scale-125 transition-all text-2xl"><i className="fa-brands fa-linkedin"></i></a>
              <a href="#" className="text-gray-400 hover:text-blue-600 hover:scale-125 transition-all text-2xl"><i className="fa-brands fa-x-twitter"></i></a>
              <a href="#" className="text-gray-400 hover:text-blue-600 hover:scale-125 transition-all text-2xl"><i className="fa-brands fa-github"></i></a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
