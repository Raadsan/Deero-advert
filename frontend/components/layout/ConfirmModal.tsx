"use client";

import React from "react";
import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmVariant?: "danger" | "primary";
}

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to continue?",
    confirmLabel = "Yes, Confirm",
    cancelLabel = "Cancel",
    confirmVariant = "primary",
}: ConfirmModalProps) => {
    const confirmBtnClass =
        confirmVariant === "danger"
            ? "bg-red-600 hover:bg-red-700"
            : "bg-[#651313] hover:bg-[#4a0e0e]";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
            <div className="space-y-6">
                <div className="flex flex-col items-center text-center space-y-4 py-2">
                    <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                        <AlertTriangle className="h-8 w-8" />
                    </div>
                    <p className="text-sm text-gray-600 max-w-sm mx-auto">{message}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-50">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all active:scale-95"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-all shadow-sm active:scale-95 ${confirmBtnClass}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
