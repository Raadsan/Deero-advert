"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getUserId, isAuthenticated } from '@/utils/auth';

export interface CartItem {
    id: string;
    type: 'domain' | 'hosting' | 'service';
    title: string;
    subtitle: string;
    price: number;
    options?: string;
    renewalPrice?: number;
    serviceId?: string | number;
    packageId?: string | number;
    hostingPackageId?: string | number;
    originalAmount?: number;
    discountApplied?: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    toggleCartItem: (item: CartItem) => void;
    isInCart: (subtitle: string) => boolean;
    clearCart: () => void;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartOwner, setCartOwner] = useState<string | null>(null);
    const loadedOwner = useRef<string | null | undefined>(undefined);
    const [toast, setToast] = useState<{
        message: string;
        itemTitle: string;
        type: 'added' | 'removed';
        visible: boolean;
        count: number;
    } | null>(null);

    // Restore only the current user's cart when their session changes.
    useEffect(() => {
        const restoreCart = () => {
            const userId = isAuthenticated() ? getUserId() : null;
            const owner = userId == null ? null : String(userId);
            if (loadedOwner.current === owner) return;

            let items: CartItem[] = [];
            if (owner) {
                const key = `deero_cart:${owner}`;
                // Preserve an existing cart when upgrading a logged-in session.
                const savedCart = localStorage.getItem(key) ??
                    (loadedOwner.current === undefined ? localStorage.getItem('deero_cart') : null);
                if (savedCart) {
                    try {
                        const parsed = JSON.parse(savedCart);
                        if (Array.isArray(parsed)) items = parsed;
                    } catch (e) {
                        console.error('Failed to load cart', e);
                    }
                }
            }
            localStorage.removeItem('deero_cart');
            loadedOwner.current = owner;
            setCartOwner(owner);
            setCartItems(items);
            setToast(null);
        };
        restoreCart();
        window.addEventListener('auth-change', restoreCart);
        window.addEventListener('storage', restoreCart);
        window.addEventListener('focus', restoreCart);
        return () => {
            window.removeEventListener('auth-change', restoreCart);
            window.removeEventListener('storage', restoreCart);
            window.removeEventListener('focus', restoreCart);
        };
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        if (cartOwner && isAuthenticated() && String(getUserId()) === cartOwner) {
            localStorage.setItem(`deero_cart:${cartOwner}`, JSON.stringify(cartItems));
        }
    }, [cartItems, cartOwner]);

    const showToast = (itemTitle: string, type: 'added' | 'removed', count: number) => {
        setToast({ message: type === 'added' ? 'Added to cart' : 'Removed from cart', itemTitle, type, visible: true, count });
        const timer = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(timer);
    };

    const addToCart = (item: CartItem) => {
        let isDuplicate = false;
        setCartItems((prev) => {
            if (prev.find(i => i.subtitle === item.subtitle)) {
                isDuplicate = true;
                return prev;
            }
            return [...prev, item];
        });
        if (!isDuplicate) {
            showToast(item.subtitle || item.title, 'added', cartItems.length + 1);
        }
    };

    const removeFromCart = (id: string) => {
        const itemToRemove = cartItems.find((item) => item.id === id);
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        if (itemToRemove) {
            showToast(itemToRemove.subtitle || itemToRemove.title, 'removed', cartItems.length - 1);
        }
    };

    const toggleCartItem = (item: CartItem) => {
        setCartItems((prev) => {
            const exists = prev.find(i => i.subtitle === item.subtitle);
            if (exists) {
                showToast(item.subtitle || item.title, 'removed', prev.length - 1);
                return prev.filter(i => i.subtitle !== item.subtitle);
            }
            showToast(item.subtitle || item.title, 'added', prev.length + 1);
            return [...prev, item];
        });
    };

    const isInCart = (subtitle: string) => {
        return isAuthenticated() && !!cartItems.find(i => i.subtitle === subtitle);
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, toggleCartItem, isInCart, clearCart, cartTotal }}>
            {children}

            {/* Cart Toast Notification */}
            {toast && toast.visible && (
                <div
                    role="alert"
                    aria-live="polite"
                    className="fixed bottom-6 right-6 z-[9999] max-w-sm w-[calc(100%-2rem)] sm:w-full pointer-events-auto"
                    style={{ animation: 'slideInUp 0.3s ease-out' }}
                >
                    <style>{`
                        @keyframes slideInUp {
                            from { opacity: 0; transform: translateY(20px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}</style>
                    <div className={`p-4 rounded-2xl shadow-2xl border flex items-center justify-between gap-3 ${
                        toast.type === 'added'
                            ? 'bg-[#651313] border-[#EB4724]/40 text-white'
                            : 'bg-gray-900 border-gray-700 text-white'
                    }`}>
                        {/* Icon + Text */}
                        <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                toast.type === 'added' ? 'bg-[#EB4724]' : 'bg-gray-700'
                            }`}>
                                {toast.type === 'added' ? (
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="text-[11px] font-bold text-[#fcd7c3] uppercase tracking-wider leading-none mb-0.5">
                                    {toast.message}
                                </p>
                                <p className="text-sm font-semibold text-white truncate">{toast.itemTitle}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                            {toast.type === 'added' && (
                                <a
                                    href="/cart"
                                    className="bg-[#EB4724] text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-[#d13d1d] transition-colors whitespace-nowrap shadow"
                                >
                                    View Cart ({toast.count})
                                </a>
                            )}
                            <button
                                onClick={() => setToast(null)}
                                aria-label="Dismiss notification"
                                className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
