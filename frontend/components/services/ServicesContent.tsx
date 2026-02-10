import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";
import { getAllServices, Service } from "../../api-client/serviceApi";
import { CheckIcon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getImageUrl } from "@/utils/url";
import { getUserId, isAuthenticated, isUser, isAdminOrManager } from "@/utils/auth";
import { createTransaction } from "@/api-client/transactionApi";
import DigitalConsultingSection from "./DigitalConsultingSection";

const HEADER_OFFSET = 170; // match fixed header height

const scrollToSection = (sectionId: string | null) => {
    if (!sectionId) return;
    const element = document.getElementById(sectionId);
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const targetY = rect.top + scrollTop - HEADER_OFFSET;

    window.scrollTo({
        top: targetY,
        behavior: "smooth"
    });
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const getServiceSlug = (title: string) =>
    (title || "service").trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

interface ServicesContentProps {
    showTitle?: boolean;
    showViewMore?: boolean;
    paddingClasses?: string;
    filterSlug?: string;
}

export default function ServicesContent({
    showTitle = true,
    showViewMore = false,
    paddingClasses = "py-16 px-4 sm:px-10",
    filterSlug
}: ServicesContentProps) {
    const pathname = usePathname();
    const router = useRouter();
    const isServicesPage = pathname?.startsWith("/services");

    const [groupedServices, setGroupedServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedPackages, setExpandedPackages] = useState<Record<string, boolean>>({});

    // Purchase State
    const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [accountNo, setAccountNo] = useState("");
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [purchaseStatus, setPurchaseStatus] = useState<{ success: boolean; message: string } | null>(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                // Add a tiny delay to ensure everything is settled on refresh
                await new Promise(resolve => setTimeout(resolve, 100));

                const res: any = await getAllServices();
                console.log("Services API Raw Response:", res);

                // Extremely robust parsing for different response formats
                let servicesData = [];
                if (res.data?.data && Array.isArray(res.data.data)) {
                    servicesData = res.data.data;
                } else if (Array.isArray(res.data)) {
                    servicesData = res.data;
                } else if (res.data?.success && res.data?.services && Array.isArray(res.data.services)) {
                    servicesData = res.data.services;
                } else if (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
                    // Try to find any array property (fallback)
                    const values = Object.values(res.data);
                    const arrayProp = values.find(val => Array.isArray(val)) as any[];
                    if (arrayProp) servicesData = arrayProp;
                }

                console.log("Parsed Services Data:", servicesData);
                const rawResults: Service[] = servicesData;

                // Group by title and merge packages
                const groupedMap = new Map<string, Service>();

                rawResults.forEach(service => {
                    const title = (service.serviceTitle || "Service").trim();
                    const key = title.toLowerCase();

                    if (groupedMap.has(key)) {
                        const existing = groupedMap.get(key)!;
                        // Merge packages
                        if (service.packages) {
                            existing.packages = [...(existing.packages || []), ...service.packages];
                        }
                        // Favor entry with an icon
                        if (!existing.serviceIcon && service.serviceIcon) {
                            existing.serviceIcon = service.serviceIcon;
                        }
                    } else {
                        // Create deep copy to avoid mutating original state
                        groupedMap.set(key, { ...service, packages: [...(service.packages || [])] });
                    }
                });

                let results = Array.from(groupedMap.values());

                // Sort to put "Graphic Design" first
                results.sort((a, b) => {
                    const titleA = (a.serviceTitle || "").toLowerCase();
                    const titleB = (b.serviceTitle || "").toLowerCase();
                    if (titleA === "graphic design") return -1;
                    if (titleB === "graphic design") return 1;
                    return 0;
                });

                setGroupedServices(results);
            } catch (err) {
                console.error("Error fetching services:", err);
                setError("no service found");
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    // Handle scroll after navigation from hash or slug - wait for loading to finish
    useEffect(() => {
        if (!loading) {
            let targetId = "";

            if (isServicesPage && window.location.hash) {
                targetId = window.location.hash.substring(1);
            } else if (filterSlug) {
                targetId = filterSlug;
            }

            if (targetId) {
                // Function to perform the actual scroll
                const performScroll = () => {
                    const element = document.getElementById(targetId);
                    if (element) {
                        scrollToSection(targetId);
                    }
                };

                // First attempt
                const timer1 = setTimeout(performScroll, 300);

                // Second attempt (in case images shifted things)
                const timer2 = setTimeout(performScroll, 800);

                return () => {
                    clearTimeout(timer1);
                    clearTimeout(timer2);
                };
            }
        }
    }, [isServicesPage, loading, filterSlug]);

    const handleServiceClick = (service: Service) => {
        const slug = getServiceSlug(service.serviceTitle || "service");
        router.push(`/services/${slug}`);
    };

    const handlePurchaseClick = (pkg: any, service: Service) => {
        // Check if user is not authenticated
        if (!isAuthenticated()) {
            router.push("/login?redirect=" + pathname);
            return;
        }

        // Check if user is admin or manager (they shouldn't purchase)
        if (isAdminOrManager()) {
            alert("Admin and Manager accounts cannot purchase services. Please use a regular user account.");
            return;
        }

        // User is authenticated and is a regular user
        setSelectedPlan(pkg);
        setSelectedService(service);
        setAccountNo("");
        setPurchaseStatus(null);
        setPurchaseModalOpen(true);
    };

    const processPurchase = async () => {
        if (!selectedPlan || !selectedService || !accountNo) return;

        setIsPurchasing(true);
        setPurchaseStatus(null);

        try {
            const userId = getUserId();
            if (!userId) throw new Error("User not found");

            await createTransaction({
                serviceId: selectedService._id,
                packageId: selectedPlan._id,
                userId: userId,
                type: "service_payment",
                amount: selectedPlan.price,
                paymentMethod: "waafi",
                accountNo: accountNo,
                description: `Payment for ${selectedService.serviceTitle} - ${selectedPlan.packageTitle}`
            });

            setPurchaseStatus({ success: true, message: "Transaction initiated successfully! Check your phone for verification." });
            // Close after delay or let user close? Let's just show success in modal.
        } catch (err: any) {
            console.error("Purchase failed", err);
            setPurchaseStatus({ success: false, message: err.response?.data?.message || "Transaction failed. Please try again." });
        } finally {
            setIsPurchasing(false);
        }
    };

    return (
        <section className={`bg-[#f2f2f2] overflow-hidden ${paddingClasses}`}>
            <motion.div
                initial="hidden"
                animate="visible"
                viewport={{ once: true, amount: 0 }}
                variants={containerVariants}
                className="mx-auto max-w-6xl xl:max-w-7xl text-center space-y-12"
            >
                {showTitle && (
                    <motion.div variants={itemVariants} className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#651313] mb-4">
                            Our Services
                        </h2>
                        <div className="w-20 h-1.5 bg-[#EB4724] mx-auto rounded-full"></div>
                    </motion.div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#651313]"></div>
                    </div>
                ) : error ? (
                    <div className="text-red-500 py-10">{error}</div>
                ) : (
                    <>
                        {/* Icon Navigation Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-12 gap-x-8 mb-24">
                            {groupedServices.map((service, index) => (
                                <ServiceCard
                                    key={service._id}
                                    name={service.serviceTitle || "Service"}
                                    icon={getImageUrl(service.serviceIcon) || "/logo deero-02 .svg"}
                                    index={index}
                                    active={filterSlug ? getServiceSlug(service.serviceTitle || "") === filterSlug : false}
                                    itemVariants={itemVariants}
                                    onClick={() => handleServiceClick(service)}
                                />
                            ))}
                        </div>

                        {/* Filtered or All Services Sections */}
                        {(isServicesPage || filterSlug) && groupedServices
                            .filter(service => !filterSlug || getServiceSlug(service.serviceTitle || "") === filterSlug)
                            .map((service) => {
                                const slug = getServiceSlug(service.serviceTitle || "");
                                const isDigitalConsulting = slug.includes("digital-consulting") || slug.includes("business-growth");

                                if (isDigitalConsulting) {
                                    return (
                                        <div key={service._id} id={slug} className="">
                                            <DigitalConsultingSection
                                                service={service}
                                                onPurchase={handlePurchaseClick}
                                            />
                                        </div>
                                    );
                                }

                                if (service.packages && service.packages.length > 0) {
                                    return (
                                        <motion.div
                                            key={service._id}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true, amount: 0.1 }}
                                            variants={containerVariants}
                                            id={slug}
                                            className="pt-16 pb-24 border-t border-gray-200/50"
                                        >
                                            <h3 className="text-3xl md:text-4xl font-bold text-[#EB4724] mb-12 text-center">
                                                {service.serviceTitle} Packages
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center items-stretch">
                                                {service.packages.map((pkg: any, idx: number) => {
                                                    const packageId = `${service._id}-${idx}`;
                                                    const isExpanded = expandedPackages[packageId];
                                                    const initialFeaturesCount = 5;
                                                    const hasMoreFeatures = pkg.features?.length > initialFeaturesCount;
                                                    const displayedFeatures = isExpanded ? pkg.features : (pkg.features?.slice(0, initialFeaturesCount) || []);

                                                    return (
                                                        <motion.div
                                                            key={idx}
                                                            variants={itemVariants}
                                                            whileHover={{ scale: 1.02 }}
                                                            className="bg-[#fcd7c3] p-8 rounded-2xl shadow-sm border-none flex flex-col transition-all duration-300 relative overflow-hidden group min-h-[480px] text-left"
                                                        >
                                                            {/* Most Popular Ribbon logic */}
                                                            {idx === 1 && (
                                                                <div className="absolute top-6 -right-8 w-40 h-8">
                                                                    <div className="bg-[#651313] w-full h-full rotate-45 flex items-center justify-center shadow-md">
                                                                        <span className="text-white text-[10px] font-bold uppercase tracking-widest translate-y-[1px]">Most Popular</span>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <h4 className="text-2xl font-bold text-[#4d0e0e] mb-4 pr-8 leading-tight">{pkg.packageTitle}</h4>

                                                            <div className="flex items-baseline mb-8">
                                                                <span className="text-5xl font-bold text-[#EB4724]">${pkg.price}</span>
                                                            </div>

                                                            <div className="flex-1">
                                                                <ul className="space-y-4 mb-6">
                                                                    {displayedFeatures.map((feature: string, fIdx: number) => (
                                                                        <motion.li
                                                                            initial={{ opacity: 0, x: -10 }}
                                                                            animate={{ opacity: 1, x: 0 }}
                                                                            transition={{ delay: fIdx * 0.05 }}
                                                                            key={fIdx}
                                                                            className="flex items-start gap-3"
                                                                        >
                                                                            <CheckIcon className="h-4 w-4 shrink-0 stroke-[4] text-[#EB4724] mt-1" />
                                                                            <span className="text-base text-[#4d0e0e] font-medium leading-tight">{feature}</span>
                                                                        </motion.li>
                                                                    ))}
                                                                </ul>

                                                                {hasMoreFeatures && (
                                                                    <button
                                                                        onClick={() => setExpandedPackages(prev => ({ ...prev, [packageId]: !isExpanded }))}
                                                                        className="flex items-center gap-2 text-[#651313] font-bold text-sm mb-8 hover:text-[#EB4724] transition-colors"
                                                                    >
                                                                        <div className={`w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                                            <ChevronDownIcon className="h-4 w-4" />
                                                                        </div>
                                                                        {isExpanded ? 'Collapse Feature' : 'Expand Feature'}
                                                                    </button>
                                                                )}
                                                            </div>


                                                            <button
                                                                onClick={() => handlePurchaseClick(pkg, service)}
                                                                className="w-full py-4 px-6 rounded-xl bg-[#651313] text-white font-bold text-sm uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg"
                                                            >
                                                                Purchase Plan
                                                            </button>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    );
                                }
                                return null;
                            })}
                    </>
                )}

                {showViewMore && (
                    <motion.div variants={itemVariants} className="flex justify-center pt-8">
                        <Link
                            href="/services"
                            className="bg-[#EB4724] text-white px-8 py-3 rounded-full font-bold text-lg uppercase tracking-wide hover:bg-[#EB4724] hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            VIEW MORE
                        </Link>
                    </motion.div>
                )}

                {/* Purchase Modal */}
                <AnimatePresence>
                    {purchaseModalOpen && selectedPlan && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                            onClick={() => !isPurchasing && setPurchaseModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
                            >
                                <button
                                    onClick={() => setPurchaseModalOpen(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                                    disabled={isPurchasing}
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>

                                <h3 className="text-2xl font-bold text-[#651313] mb-2">Confirm Purchase</h3>
                                <p className="text-gray-600 mb-6">You are selecting the <span className="font-bold text-[#EB4724]">{selectedPlan.packageTitle}</span> plan for <span className="font-semibold">{selectedService?.serviceTitle}</span>.</p>

                                <div className="bg-gray-50 p-4 rounded-xl mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-500 text-sm font-medium uppercase tracking-wide">Price</span>
                                        <span className="text-xl font-bold text-[#651313]">${selectedPlan.price}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-sm font-medium uppercase tracking-wide">Method</span>
                                        <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                            WaafiPay
                                        </span>
                                    </div>
                                </div>

                                {purchaseStatus ? (
                                    <div className={`p-4 rounded-xl mb-6 text-center ${purchaseStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        <p className="font-semibold">{purchaseStatus.message}</p>
                                        {purchaseStatus.success && (
                                            <button
                                                onClick={() => setPurchaseModalOpen(false)}
                                                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-green-700 transition"
                                            >
                                                Close
                                            </button>
                                        )}
                                        {!purchaseStatus.success && (
                                            <button
                                                onClick={() => setPurchaseStatus(null)}
                                                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-red-700 transition"
                                            >
                                                Try Again
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-6">
                                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                                Waafi Account Number
                                            </label>
                                            <input
                                                type="text"
                                                value={accountNo}
                                                onChange={(e) => setAccountNo(e.target.value)}
                                                placeholder="e.g. 25261xxxxxxx"
                                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EB4724]/20 focus:border-[#EB4724] transition-all font-medium"
                                                disabled={isPurchasing}
                                            />
                                            <p className="text-xs text-gray-400 mt-2 ml-1">Enter your Waafi mobile money number to authorize payment.</p>
                                        </div>

                                        <button
                                            onClick={processPurchase}
                                            disabled={!accountNo || isPurchasing}
                                            className="w-full py-4 bg-[#651313] text-white rounded-xl font-bold uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center justify-center gap-3"
                                        >
                                            {isPurchasing && (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            )}
                                            {isPurchasing ? "Processing..." : "Pay Now"}
                                        </button>
                                    </>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}

