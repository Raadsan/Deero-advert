"use client";

import React, { useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    onNext?: () => void;
    onPrev?: () => void;
    hasNext?: boolean;
    hasPrev?: boolean;
}

const ImageModal = ({ isOpen, onClose, children, onNext, onPrev, hasNext, hasPrev }: ImageModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight" && onNext && hasNext) onNext();
            if (e.key === "ArrowLeft" && onPrev && hasPrev) onPrev();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose, onNext, onPrev, hasNext, hasPrev]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-[70] p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
                aria-label="Close"
            >
                <X className="h-6 w-6" />
            </button>

            <div
                ref={modalRef}
                className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center outline-none animate-in zoom-in-95 duration-200"
            >
                {/* Navigation Buttons */}
                {hasPrev && onPrev && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPrev();
                        }}
                        className="fixed left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 rounded-full text-white transition-all z-[70] hover:scale-110"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </button>
                )}

                {children}

                {hasNext && onNext && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onNext();
                        }}
                        className="fixed right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 rounded-full text-white transition-all z-[70] hover:scale-110"
                        aria-label="Next"
                    >
                        <ChevronRight className="h-8 w-8" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ImageModal;

