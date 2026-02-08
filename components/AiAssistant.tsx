
import React, { useState, useRef, useEffect } from 'react';
// GoogleGenAI will be imported dynamically
import { gsap } from 'gsap';

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Hi! I am Kytriq AI. How can I help you bring your digital idea to life today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(chatRef.current, { scale: 0.8, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' });
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

      console.log('AI Assistant: Attempting to initialize with API Key:', apiKey ? 'PRESENT' : 'MISSING');

      if (!apiKey) {
        throw new Error("VITE_GEMINI_API_KEY is missing. Check .env.local and restart the dev server.");
      }

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })), { role: 'user', parts: [{ text: userMsg }] }],
        config: {
          systemInstruction: `You are the Kytriq Technologies AI Assistant. 
          Kytriq is a software development company specializing in intelligent systems, web, mobile, and desktop apps. 
          Mission: "Bringing digital ideas to life". 
          Flagship product: SalePilot (AI-powered POS). 
          Tone: Premium, professional, futuristic, minimalistic, trustworthy.
          Be concise and helpful.`
        }
      });

      const aiText = response.text || "I'm sorry, I couldn't process that. Can you try again?";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error: any) {
      console.error(error);
      let errorMessage = "Service is temporarily unavailable. Please contact us directly!";

      if (error.message?.includes("VITE_GEMINI_API_KEY")) {
        errorMessage = "AI Configuration missing. Please check the setup!";
      } else if (error.status === "RESOURCE_EXHAUSTED" || error.message?.includes("429") || error.message?.includes("quota")) {
        errorMessage = "The AI is currently at its capacity limit. Please try again in a minute!";
      }

      setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {isOpen && (
        <div ref={chatRef} className="mb-4 w-[350px] max-w-[calc(100vw-2rem)] h-[450px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-robot text-white text-xs"></i>
              </div>
              <span className="font-heading font-bold dark:text-white">Kytriq AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-5 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-200 dark:border-gray-800'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-2xl border border-gray-200 dark:border-gray-800">
                  <span className="flex space-x-1">
                    <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></span>
                    <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-gray-900 flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything..."
              className="flex-grow bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-500 dark:text-white"
            />
            <button
              onClick={sendMessage}
              disabled={isTyping}
              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
            >
              <i className="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-90 transition-transform relative"
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-robot'} text-2xl`}></i>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full border-2 border-white dark:border-brand-dark flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default AiAssistant;
