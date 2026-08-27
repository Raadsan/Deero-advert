"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarCheck, CheckCircle2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { createConsultation } from "../../api-client/consultationApi";

// localStorage key — set ONLY when user clicks Cancel/X or submits (permanent)
const DISMISSED_KEY = "consultationModalDismissed";
// sessionStorage key — set once per browser tab so in-page navigation doesn't re-trigger
const SESSION_KEY = "consultationModalShown";

export default function ConsultationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    service: "",
  });

  useEffect(() => {
    // If permanently dismissed by user, never show again
    if (localStorage.getItem(DISMISSED_KEY)) return;

    // Already shown in this tab session — don't show again while navigating pages
    if (sessionStorage.getItem(SESSION_KEY)) return;

    // Mark as shown for this tab so navigating between pages won't re-trigger
    sessionStorage.setItem(SESSION_KEY, "true");

    // Show on scroll
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsOpen(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Runs once per mount — sessionStorage handles per-tab logic

  // Always open modal when the header "Free Booking" button is clicked
  useEffect(() => {
    const handleForceOpen = () => setIsOpen(true);
    window.addEventListener("openConsultationModal", handleForceOpen);
    return () => window.removeEventListener("openConsultationModal", handleForceOpen);
  }, []);

  const handleDismiss = () => {
    // Mark as permanently dismissed in localStorage
    localStorage.setItem(DISMISSED_KEY, "true");
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await createConsultation(formData);
      if (res.success) {
        toast.success(
          "🎉 Consultation booked successfully!\nOur team will contact you within 24 hours.",
          {
            duration: 6000,
            style: {
              background: "#fff",
              color: "#111827",
              border: "1px solid #EB4724",
              padding: "16px",
              fontWeight: "600",
              fontSize: "14px",
              lineHeight: "1.6",
              whiteSpace: "pre-line",
            },
          }
        );
        localStorage.setItem(DISMISSED_KEY, "true");
        setIsOpen(false);
        setFormData({ name: "", phone: "", email: "", location: "", service: "" });
      } else {
        toast.error(res.error || "Failed to book. Please try again.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to book. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop — clicking it does NOT close the modal */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto md:overflow-hidden"
          >
            {/* Close / Cancel Button — the ONLY way to dismiss */}
            <button
              onClick={handleDismiss}
              title="Close and don't show again"
              className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-full text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Content Section */}
            <div className="w-full md:w-5/12 bg-gradient-to-br from-[#FFF5F3] to-white p-8 md:p-10 border-r border-gray-100 md:overflow-y-auto flex flex-col justify-center relative">
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#EB4724]/5 rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EB4724] to-[#651313] mb-8 shadow-lg shadow-[#EB4724]/20">
                  <CalendarCheck className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                  Consultation Booking Form
                </h2>
                <p className="text-[#EB4724] font-semibold text-lg mb-6">
                  Get Expert Advice — Absolutely FREE
                </p>

                <div className="space-y-4 text-gray-600 text-sm leading-relaxed mb-8 text-justify">
                  <p>
                    Fill out this form to book a FREE 30-minute consultation with our team and get professional advice on any of our services:{" "}
                    <strong className="text-gray-900">
                      Graphic Design &amp; Branding, Marketing &amp; Campaign Strategy, Video Production &amp; Motion Graphics, Digital Marketing, Web Services, Event Branding &amp; Promotion, and Digital Consulting.
                    </strong>
                  </p>
                  <p>
                    We will provide you with professional advice, an assessment, and practical recommendations tailored to your business needs, goals, and challenges.
                  </p>
                </div>

                <div className="mt-auto">
                  <h3 className="text-gray-900 font-semibold text-lg mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#EB4724]" />
                    What Happens Next?
                  </h3>
                  <div className="space-y-3 text-gray-600 text-sm text-justify">
                    <p>
                      Once you submit the form, our team will contact you to better understand your needs. We will then provide you with practical advice and recommendations tailored to your business.
                    </p>
                    <p>
                      If you are satisfied with our recommendations and decide to work with us, you can choose from our professional services. Special discounts may also be available for clients who proceed with our services after the consultation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Section */}
            <div className="w-full md:w-7/12 p-8 md:p-12 bg-white md:overflow-y-auto relative">
              <div className="mb-8 relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Please Fill Out the Form</h3>
                <p className="text-gray-500 text-sm">
                  Complete the form below so we can contact you and schedule your FREE 30-minute consultation.
                </p>
              </div>

              <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#EB4724] focus:ring-1 focus:ring-[#EB4724] focus:bg-white transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#EB4724] focus:ring-1 focus:ring-[#EB4724] focus:bg-white transition-all"
                      placeholder="+252 61 000 0000"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#EB4724] focus:ring-1 focus:ring-[#EB4724] focus:bg-white transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#EB4724] focus:ring-1 focus:ring-[#EB4724] focus:bg-white transition-all"
                    placeholder="City, Country"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">What Would You Like Consultation About?</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#EB4724] focus:ring-1 focus:ring-[#EB4724] focus:bg-white transition-all appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: `right 1rem center`,
                      backgroundRepeat: `no-repeat`,
                      backgroundSize: `1.5em 1.5em`,
                    }}
                  >
                    <option value="" disabled>Select a service...</option>
                    <option value="Graphic Design & Branding">Graphic Design &amp; Branding</option>
                    <option value="Marketing & Campaign Strategy">Marketing &amp; Campaign Strategy</option>
                    <option value="Video Production & Motion Graphics">Video Production &amp; Motion Graphics</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Web Services">Web Services</option>
                    <option value="Event Branding & Promotion">Event Branding &amp; Promotion</option>
                    <option value="Digital Consulting">Digital Consulting</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  {/* Cancel button — dismisses permanently */}
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 group relative inline-flex items-center justify-center px-6 py-3 font-bold text-white transition-all duration-200 bg-gradient-to-r from-[#EB4724] to-[#651313] rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#EB4724]/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EB4724] ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 text-sm sm:text-base text-center">
                      {isLoading ? "Booking..." : "Book Your FREE 30-Minute Consultation"}
                      {!isLoading && (
                        <ArrowRight className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                      )}
                    </span>
                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-[#651313] to-[#EB4724] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>

                <p className="text-center text-xs text-gray-400 mt-2">
                  By submitting this form, you agree to our privacy policy and terms of service.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
