"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

export default function SuccessNotification() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [type, setType] = useState("");

    useEffect(() => {
        if (searchParams.get("success") === "true") {
            setShow(true);
            setType(searchParams.get("type") || "order");
            
            // Auto hide after 8 seconds
            const timer = setTimeout(() => {
                handleClose();
            }, 8000);

            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    const handleClose = () => {
        setShow(false);
        // Remove the query param without refreshing
        const params = new URLSearchParams(searchParams.toString());
        params.delete("success");
        params.delete("type");
        router.replace("/" + (params.toString() ? "?" + params.toString() : ""), { scroll: false });
    };

    const getMessage = () => {
        switch(type) {
            case "hosting":
                return "Your hosting package has been purchased successfully!";
            case "service":
                return "Your service purchase has been completed successfully!";
            case "domain":
                return "Your domain registration has been completed successfully!";
            default:
                return "Your order has been completed successfully!";
        }
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="fixed bottom-8 left-4 right-4 md:left-auto md:right-8 z-[100] md:max-w-md w-full"
                >
                    <div className="bg-[#651313] text-white p-5 rounded-2xl shadow-2xl border border-white/10 flex items-start gap-4 relative overflow-hidden group">
                        {/* Background Decoration */}
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
                        
                        <div className="bg-green-500/20 p-2 rounded-xl shrink-0">
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                        </div>
                        
                        <div className="flex-1 pr-6">
                            <h4 className="font-bold text-lg mb-1 flex items-center gap-2">
                                Payment Successful!
                            </h4>
                            <p className="text-white/80 text-sm leading-relaxed">
                                {getMessage()}
                            </p>
                        </div>

                        <button 
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Progress Bar */}
                        <motion.div 
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 8, ease: "linear" }}
                            className="absolute bottom-0 left-0 h-1 bg-green-500/40"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
