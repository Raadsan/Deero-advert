"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    id: string;
    type: 'domain' | 'hosting';
    title: string;
    subtitle: string;
    price: number;
    options?: string;
    renewalPrice?: number;
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

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('deero_cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to load cart", e);
            }
        }
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        localStorage.setItem('deero_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item: CartItem) => {
        setCartItems((prev) => {
            // Prevent duplicates
            if (prev.find(i => i.subtitle === item.subtitle)) {
                return prev;
            }
            return [...prev, item];
        });
    };

    const removeFromCart = (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const toggleCartItem = (item: CartItem) => {
        setCartItems((prev) => {
            const exists = prev.find(i => i.subtitle === item.subtitle);
            if (exists) {
                return prev.filter(i => i.subtitle !== item.subtitle);
            }
            return [...prev, item];
        });
    };

    const isInCart = (subtitle: string) => {
        return !!cartItems.find(i => i.subtitle === subtitle);
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, toggleCartItem, isInCart, clearCart, cartTotal }}>
            {children}
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
