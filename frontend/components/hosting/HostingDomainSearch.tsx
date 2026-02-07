"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

import { checkDomainAvailability, DomainCheckResult, fetchAllDomainPrices, DomainPrice } from "../../api-client/domainCheckerApi";
import { ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { isAuthenticated, isAdminOrManager } from "@/utils/auth";
import { useCart } from "@/context/CartContext";

export default function HostingDomainSearch({ transparent = false }: { transparent?: boolean }) {
    const { toggleCartItem, isInCart } = useCart();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'register'>('register');
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<DomainCheckResult[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [allPrices, setAllPrices] = useState<DomainPrice[]>([]);
    const [selectedDuration, setSelectedDuration] = useState(1);

    // Use useSearchParams to get the query parameter
    // Note: We need to use useSearchParams from next/navigation
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash === '#register') setActiveTab('register');
        };

        handleHashChange(); // Initial check
        window.addEventListener('hashchange', handleHashChange);

        // Load all available TLDs and handle auto-search
        const init = async () => {
            const prices = await fetchAllDomainPrices();
            setAllPrices(prices);

            // Check for domain in URL
            const domainParam = searchParams.get('domain');
            if (domainParam) {
                setQuery(domainParam);
                // Trigger search after a small delay to ensure state updates
                // We need to call the search logic directly here since we can't easily invoke the handler from useEffect if it relies on current state
                // But we can duplicate the logic or use a ref. 
                // Cleaner approach: Extract check logic
                performSearch(domainParam, prices);
            }
        };
        init();

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [searchParams]); // Re-run if params change

    const performSearch = async (searchQuery: string, prices: DomainPrice[]) => {
        if (!searchQuery.trim()) return;

        // Enforce that user must enter a domain with an extension
        if (!searchQuery.includes('.')) {
            // If coming from home page without extension, maybe we shouldn't alert immediately but just show input?
            // User request earlier was to enforce it. Let's just return if invalid from URL to avoid alert loop on load
            return;
        }

        setLoading(true);
        try {
            const lastDotIndex = searchQuery.lastIndexOf('.');
            const targetTld = searchQuery.substring(lastDotIndex);

            // Pass the query and specific TLD
            const data = await checkDomainAvailability(searchQuery, [targetTld]);

            if (data.success) {
                setResults(data.results);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleAddToCart = (domain: string, price: string) => {
        // Authenticate
        if (!isAuthenticated()) {
            router.push("/login?redirect=" + window.location.pathname);
            return;
        }

        // Restrict Admin and Manager
        if (isAdminOrManager()) {
            alert("Admin and Manager accounts cannot purchase domains.");
            return;
        }

        toggleCartItem({
            id: Math.random().toString(36).substr(2, 9),
            type: 'domain',
            title: 'Domain Registration',
            subtitle: domain,
            price: parseFloat(price.replace('$', '')),
            options: `${selectedDuration} Year${selectedDuration > 1 ? 's' : ''}`,
            renewalPrice: parseFloat(price.replace('$', '')) / selectedDuration // calculate base renewal properly per year assumption
        });
    };

    const handleSearch = async () => {
        if (!query.trim()) return;

        // Enforce that user must enter a domain with an extension
        if (!query.includes('.')) {
            alert("Please enter a valid domain name including the extension (e.g., example.com)");
            return;
        }

        setLoading(true);
        try {
            // Determine which TLD to check based on user input
            const lastDotIndex = query.lastIndexOf('.');
            const targetTld = query.substring(lastDotIndex);

            // Only check availability for this specific TLD
            const data = await checkDomainAvailability(query, [targetTld]);

            if (data.success) {
                setResults(data.results);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="domains" className={`${transparent ? 'bg-transparent' : 'bg-[#fcd7c3]'} py-16 px-4 sm:px-10 relative overflow-hidden`}>
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                <div className="w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </div>

            <div className="mx-auto max-w-4xl relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-[#651313] mb-4">
                        Search Your Domain Name
                    </h2>
                    <p className="text-[#651313]/80 mb-8 max-w-lg mx-auto">
                        Your perfect domain name is waiting for you. Search now to find it.
                    </p>

                    {/* Tabs - Hidden as only one option remains */}
                    <div className="hidden bg-white/50 p-1 rounded-full backdrop-blur-sm border border-white/20">
                        <button
                            onClick={() => setActiveTab('register')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'register'
                                ? 'bg-[#EB4724] text-white shadow-md'
                                : 'text-[#651313] hover:bg-white/50'
                                }`}
                        >
                            Register Domain
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-white/40">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key="register"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Enter your domain name (e.g. example.com)"
                                        className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-[#EB4724] focus:ring-2 focus:ring-[#EB4724]/10 focus:outline-none transition-all text-lg text-black"
                                    />
                                    <MagnifyingGlassIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                                </div>
                                <button
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="bg-[#651313] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#4d0e0e] transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 duration-200 disabled:opacity-70"
                                >
                                    {loading ? (
                                        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                                    ) : (
                                        <MagnifyingGlassIcon className="w-5 h-5" />
                                    )}
                                    Search
                                </button>
                            </div>

                            {/* Results Section */}
                            {results && query && (
                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    {(() => {
                                        const searchDomain = query.includes('.') ? query.toLowerCase() : `${query.toLowerCase()}.com`;
                                        const match = results.find(r => r.domain.toLowerCase() === searchDomain);

                                        if (match) {
                                            if (match.invalidTld) {
                                                return (
                                                    <div className="w-full bg-[#651313]/5 rounded-xl p-4 flex items-center gap-3 text-[#651313]">
                                                        <div className="bg-[#651313] rounded-full p-1 shrink-0">
                                                            <ExclamationCircleIcon className="w-5 h-5 text-white" />
                                                        </div>
                                                        <span className="font-semibold text-lg">{match.domain} extension not exist</span>
                                                    </div>
                                                );
                                            } else if (!match.available) {
                                                return (
                                                    <div className="w-full bg-[#651313]/5 rounded-xl p-4 flex items-center gap-3 text-[#651313]">
                                                        <div className="bg-[#651313] rounded-full p-1 shrink-0">
                                                            <ExclamationCircleIcon className="w-5 h-5 text-white" />
                                                        </div>
                                                        <span className="font-semibold text-lg">{match.domain} is unavailable</span>
                                                    </div>
                                                );
                                            } else {
                                                const basePrice = parseFloat(match.price.replace(/[^0-9.]/g, '')) || 0;
                                                const totalPrice = (basePrice * selectedDuration).toFixed(2);

                                                return (
                                                    <div className="w-full bg-green-50 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                                        {/* Left side - Available message */}
                                                        <div className="flex items-center gap-3">
                                                            <div className="bg-green-600 rounded-full p-1 shrink-0">
                                                                <CheckCircleIcon className="w-5 h-5 text-white" />
                                                            </div>
                                                            <span className="font-semibold text-lg text-green-700">{match.domain} is available!</span>
                                                        </div>

                                                        {/* Right side - Duration, Price, and Button */}
                                                        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                                            {/* Duration Dropdown */}
                                                            <div className="relative">
                                                                <select
                                                                    value={selectedDuration}
                                                                    onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
                                                                    className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:border-green-500 text-sm font-medium cursor-pointer hover:border-green-400 transition-colors"
                                                                >
                                                                    {[1, 2, 3, 5, 10].map(year => (
                                                                        <option key={year} value={year}>{year} year{year > 1 ? 's' : ''}</option>
                                                                    ))}
                                                                </select>
                                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
                                                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                                                </div>
                                                            </div>

                                                            {/* Price Display */}
                                                            <div className="font-bold text-lg text-gray-800 min-w-[70px] text-right">
                                                                ${totalPrice}
                                                            </div>

                                                            {/* Add to Cart Button */}
                                                            <button
                                                                onClick={() => handleAddToCart(match.domain, totalPrice)}
                                                                className={`whitespace-nowrap px-5 py-2 rounded-lg font-bold transition-all shadow-sm active:scale-95 ${isInCart(match.domain)
                                                                    ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                                                    : 'bg-[#EB4724] text-white hover:bg-[#d13d1d]'
                                                                    }`}
                                                            >
                                                                {isInCart(match.domain) ? 'Remove from Cart' : 'Add to Cart'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        }
                                        return null;
                                    })()}

                                </div>
                            )}
                        </motion.div>

                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}

