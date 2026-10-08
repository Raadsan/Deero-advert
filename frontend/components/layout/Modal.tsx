"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
}

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-2xl" }: ModalProps) => {
    useEffect(() => {
        if (!isOpen) return;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
                className={`relative w-full ${maxWidth} max-h-[85vh] overflow-y-auto transform rounded-xl bg-white p-5 shadow-2xl transition-all animate-in zoom-in-95 duration-200 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                    <h3 className="text-xl font-bold text-[#651313]">{title}</h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
