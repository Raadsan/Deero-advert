"use client";

import { useState, useEffect, useRef } from "react";
import { X, MessageCircle, Bot } from "lucide-react";

interface Message {
  role: "user" | "bot";
  content: string;
  time: string;
}

const COMMON_QUESTIONS = [
  {
    question: "What services do you offer?",
    answer: "We offer a wide range of services including Web Hosting, Website Development, Digital Marketing, Graphic Design, and Professional Consulting. Check our Services page for more details!",
  },
  {
    question: "About Deero Advert?",
    answer: "Deero Advertising is a leading agency dedicated to providing innovative digital solutions, high-quality marketing services, and professional consulting in Somalia and beyond.",
  },
  {
    question: "How to contact you?",
    answer: "You can reach us at +252 61 8553566 or email info@advert.deero.so. We are also available at our HQ in Digfeer, Mogadishu.",
  },
  {
    question: "Service pricing?",
    answer: "Our pricing is competitive and depends on the specific project requirements. For hosting, plans start as low as $13.99. Contact us for a custom quote!",
  },
  {
    question: "Where are you located?",
    answer: "Our headquarters is located in HQ Digfeer, Mogadishu - Somalia. Feel free to visit us!",
  },
  {
    question: "Your past projects?",
    answer: "We have worked on numerous successful projects across various industries. You can view our work in the Portfolio section of our website.",
  },
  {
    question: "Your team?",
    answer: "Our team consists of experienced developers, designers, and digital strategists committed to excellence and innovation.",
  },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "Hello! Welcome to Deero Advertising. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMessage: Message = {
      role: "user",
      content: text,
      time: currentTime,
    };

    setMessages((prev) => [...prev, newUserMessage]);

    // Simulate bot thinking
    setTimeout(() => {
      const questionMatch = COMMON_QUESTIONS.find(
        (q) => q.question.toLowerCase() === text.toLowerCase()
      );

      const botResponse: Message = {
        role: "bot",
        content: questionMatch 
          ? questionMatch.answer 
          : "Thank you for your message! Our team will get back to you shortly. For immediate assistance, feel free to contact us at +252 61 8553566.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botResponse]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[320px] sm:w-[380px] lg:w-[320px] h-[500px] sm:h-[600px] lg:h-[550px] max-h-[calc(100vh-120px)] lg:max-h-[calc(100vh-140px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-in fade-in slide-in-from-bottom-10 duration-300">
          {/* Header - Brand Maroon */}
          <div className="bg-[#651313] p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold leading-none">Deero AI</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-white/70 font-medium">Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Messages Area - Mission Hover Color */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#F7B5A7]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
                    msg.role === "user"
                      ? "bg-[#EB4724] text-white rounded-tr-none text-right"
                      : "bg-[#F3F4F6] text-gray-800 rounded-tl-none border border-gray-100 text-left"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <span className={`text-[10px] mt-1 block opacity-60 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Common Questions - Brand Secondary (Orange/Red) Hover */}
          <div className="bg-[#F7B5A7] p-4 border-t border-black/10">
            <p className="text-[10px] text-black/60 font-bold uppercase tracking-wider mb-2 px-1">Common Questions:</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q.question)}
                  className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-[11px] text-gray-600 hover:bg-[#EB4724] hover:text-white hover:border-[#EB4724] transition-all text-left shadow-sm"
                >
                  {q.question}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area - Removed as per user request to only allow selecting predefined questions */}
        </div>
      )}

      {/* Toggle Buttons (Matching user photo colors) */}
      <div className="flex flex-col gap-3 scale-110 sm:scale-100 lg:scale-[0.80] items-end">
         {/* Chat Toggle - Yellow Circle */}
         {!isOpen && (
            <button
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 bg-[#F7B5A7] animate-bounce-subtle"
              style={{ animationDuration: '3s' }}
            >
              <div className="relative">
                <MessageCircle className="w-7 h-7 text-[#1a1a1a]" />
              </div>
            </button>
         )}

        {/* WhatsApp Button - Green Circle */}
        <a
          href="https://wa.me/252618553566"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 relative animate-pulse-subtle"
          style={{ animationDuration: '2.5s' }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 text-white fill-current"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.435 5.631 1.436h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#25D366]">1</span>
        </a>
      </div>

      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle infinite;
        }
        .animate-pulse-subtle {
          animation: pulse-subtle infinite;
        }
      `}</style>
    </div>
  );
}
