"use client";

import { useState, useEffect, useRef } from "react";
import { X, MessageCircle, Bot, Facebook, Linkedin, Instagram, Share2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isSocialOpen, setIsSocialOpen] = useState(false);

  // Hide on dashboard and system pages
  const isDashboard = pathname.startsWith("/dashboard") ||
    pathname.startsWith("/management") ||
    pathname.startsWith("/config") ||
    pathname.startsWith("/configuration") ||
    pathname.startsWith("/payments") ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/reset-password");

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

  if (isDashboard) return null;

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
                  className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${msg.role === "user"
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

      {/* Social Links & Chat Toggle Group */}
      <div className="flex flex-col gap-4 items-end">
        <div className="flex flex-col items-end gap-3 relative">
          {/* Social Links Menu (Now Absolute to prevent shifting buttons) */}
          <AnimatePresence>
            {isSocialOpen && (
              <div className="absolute bottom-[calc(100%+12px)] right-0 flex flex-col gap-3 items-end z-10">
                {[
                  {
                    label: "Facebook",
                    href: "https://www.facebook.com/deeroadvert",
                    icon: <Facebook className="w-5 h-5 text-white" />,
                  },
                  {
                    label: "LinkedIn",
                    href: "https://so.linkedin.com/company/deero-advert",
                    icon: <Linkedin className="w-5 h-5 text-white" />,
                  },
                  {
                    label: "TikTok",
                    href: "https://www.tiktok.com/@deeroadverts?_r=1&_t=ZS-950PzD1Xrjp",
                    icon: (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-1.07 4.41-2.73 5.91-1.66 1.48-3.9 2.21-6.15 2.05-2.26-.14-4.4-1.22-5.74-3.04-1.34-1.81-1.8-4.2-1.22-6.39.57-2.18 2.07-4.04 4.09-4.99 2.02-.95 4.39-1.05 6.47-.28l-.01 4.15c-1.14-.58-2.52-.73-3.76-.36-1.25.37-2.28 1.25-2.79 2.45-.52 1.2-.41 2.62.29 3.73.69 1.12 1.95 1.84 3.25 1.92 1.3.08 2.62-.35 3.55-1.23.94-.88 1.45-2.16 1.43-3.46-.03-5.69-.01-11.39-.02-17.08z" />
                      </svg>
                    ),
                  },
                  {
                    label: "Instagram",
                    href: "https://www.instagram.com/deeroadvert/",
                    icon: <Instagram className="w-5 h-5 text-white" />,
                  },
                  {
                    label: "Behance",
                    href: "https://www.behance.net/deeroadvert",
                    icon: (
                      <img
                        src="/home-images/behance.png"
                        alt="Behance"
                        className="w-5 h-5 object-contain invert brightness-0 grayscale"
                      />
                    ),
                  },
                  {
                    label: "WhatsApp",
                    href: "https://wa.me/252618553566",
                    icon: (
                      <svg
                        viewBox="0 0 24 24"
                        className="w-8 h-8 text-white fill-current"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.435 5.631 1.436h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    ),
                  },
                ].map((social, index) => (
                  <motion.div
                    key={social.label}
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: 20 }}
                    transition={{
                      duration: 0.2,
                      delay: (5 - index) * 0.05,
                      type: "spring",
                      stiffness: 260,
                      damping: 20
                    }}
                  >
                    <Link
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-[#1a1a1a] hover:bg-[#EB4724] rounded-full flex items-center justify-center shadow-lg transition-colors group relative"
                    >
                      {social.icon}
                      <span className="absolute right-14 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {social.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Social Links Label & Toggle (Now on top) */}
          <div className="flex items-center gap-3 relative group">
            {!isSocialOpen && (
              <div
                className="bg-black py-1 px-4 rounded-full shadow-lg hidden sm:block h-fit opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              >
                <span className="text-white text-[11px] font-bold tracking-wider uppercase">Social Links</span>
              </div>
            )}

            <button
              onClick={() => {
                const nextState = !isSocialOpen;
                setIsSocialOpen(nextState);
                if (nextState) setIsOpen(false);
              }}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-110 active:scale-95 z-20 transition-colors ${isSocialOpen ? 'bg-[#651313]' : 'bg-[#EB4724]'
                }`}
            >
              {isSocialOpen ? (
                <X className="w-8 h-8 text-white" />
              ) : (
                <Share2 className="w-8 h-8 text-white" />
              )}

              {!isSocialOpen && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  6
                </span>
              )}
            </button>
          </div>

          {/* Chat Toggle (Now at the bottom) */}
          {!isOpen && (
            <div className="flex items-center gap-3 relative group">
              <div
                className="bg-black py-1 px-4 rounded-full shadow-lg hidden sm:block h-fit opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              >
                <span className="text-white text-[11px] font-bold tracking-wider uppercase">Chats</span>
              </div>

              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => {
                  setIsOpen(true);
                  setIsSocialOpen(false);
                }}
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 bg-[#F7B5A7] z-20"
              >
                <MessageCircle className="w-7 h-7 text-[#1a1a1a]" />
              </motion.button>
            </div>
          )}
        </div>
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
