"use client";

import { useState, useEffect } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useRouter, usePathname } from "next/navigation";
import { getAllPackages, HostingPackage } from "@/api-client/hostingPackageApi";
import { createTransaction } from "@/api-client/transactionApi";
import { getUserId, isAuthenticated, isAdminOrManager } from "@/utils/auth";

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

export default function HostingPackages() {
    // const { toggleCartItem, isInCart } = useCart(); // REMOVED Cart Logic
    const router = useRouter();
    const pathname = usePathname();
    const [isYearly, setIsYearly] = useState(false);
    const [packages, setPackages] = useState<HostingPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Purchase State
    const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<HostingPackage | null>(null);
    const [accountNo, setAccountNo] = useState("");
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [purchaseStatus, setPurchaseStatus] = useState<{ success: boolean; message: string } | null>(null);


    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res: any = await getAllPackages();
                const data = res.data?.data || res.data || [];
                setPackages(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to load packages", err);
                setError("Failed to load hosting packages");
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    const handleChoosePlan = (plan: HostingPackage) => {
        // Authenticate
        if (!isAuthenticated()) {
            router.push("/login?redirect=" + pathname);
            return;
        }

        if (isAdminOrManager()) {
            alert("Admin and Manager accounts cannot purchase services.");
            return;
        }

        setSelectedPlan(plan);
        setAccountNo("");
        setPurchaseStatus(null);
        setPurchaseModalOpen(true);
    };

    const processPurchase = async () => {
        if (!selectedPlan || !accountNo) return;

        setIsPurchasing(true);
        setPurchaseStatus(null);

        try {
            const userId = getUserId();
            if (!userId) throw new Error("User not found");

            let finalPrice = selectedPlan.price;
            let description = `Payment for Hosting - ${selectedPlan.name} (Monthly)`;

            if (isYearly) {
                finalPrice = selectedPlan.price * 12;
                description = `Payment for Hosting - ${selectedPlan.name} (Yearly)`;
            }

            await createTransaction({
                hostingPackageId: selectedPlan._id,
                userId: userId,
                type: "hosting_payment",
                amount: finalPrice,
                paymentMethod: "waafi",
                accountNo: accountNo,
                description: description
            });

            setPurchaseStatus({ success: true, message: "Transaction initiated successfully! Check your phone for verification." });
        } catch (err: any) {
            console.error("Purchase failed", err);
            setPurchaseStatus({ success: false, message: err.response?.data?.message || "Transaction failed. Please try again." });
        } finally {
            setIsPurchasing(false);
        }
    };

    // Helper to get style props
    const getStyleProps = (index: number) => {
        // Cycle styles or specific logic
        const styles = [
            { buttonColor: "bg-[#f28b6d]", bgColor: "bg-[#fcd7c3]", isMain: false },
            { buttonColor: "bg-[#651313]", bgColor: "bg-[#fcd7c3]", isMain: true },
            { buttonColor: "bg-[#f28b6d]", bgColor: "bg-[#fcd7c3]", isMain: false }
        ];
        return styles[index % styles.length];
    };

    if (loading) return <div className="text-center py-20">Loading packages...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

    return (
        <section className="bg-white py-12 px-4 sm:px-10">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
                className="mx-auto max-w-6xl xl:max-w-7xl"
            >
                <div className="text-center mb-12">
                    <motion.div variants={itemVariants} className="mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#651313] mb-4">Web Hosting Packages</h2>
                        <div className="w-20 h-1.5 bg-[#EB4724] mx-auto rounded-full"></div>
                    </motion.div>

                    {/* Toggle */}
                    <motion.div variants={itemVariants} className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-semibold transition-colors duration-300 ${!isYearly ? 'text-[#651313]' : 'text-gray-400'}`}>Monthly</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="relative w-14 h-7 bg-[#EB4724] rounded-full p-1 transition-colors duration-300"
                        >
                            <motion.div
                                animate={{ x: isYearly ? 28 : 0 }}
                                className="w-5 h-5 bg-white rounded-full shadow-md"
                            ></motion.div>
                        </button>
                        <span className={`text-sm font-semibold transition-colors duration-300 ${isYearly ? 'text-[#651313]' : 'text-gray-400'}`}>Yearly</span>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {packages.map((plan, index) => {
                        const { buttonColor, bgColor, isMain } = getStyleProps(index);

                        return (
                            <motion.div
                                key={plan._id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className={`${bgColor} p-6 shadow-sm flex flex-col relative overflow-hidden transition-all duration-300`}
                            >


                                <h3 className="text-3xl font-bold text-[#651313] mb-4">{plan.name}</h3>
                                <p className="text-sm text-[#651313]/80 mb-4 leading-relaxed">
                                    {plan.desc}
                                </p>

                                {/* Save badge removed or dynamic if we knew logic. Keeping if 'pudgeText' exists? */}
                                {plan.pudgeText && (
                                    <div className="bg-[#651313] text-white text-[10px] font-bold py-1 px-3 rounded-full w-fit mb-4 uppercase tracking-wider">
                                        {plan.pudgeText}
                                    </div>
                                )}

                                <div className="mb-2 text-[#651313]/60 text-xs font-semibold">From only</div>
                                <div className="flex items-baseline mb-6">
                                    <span className="text-4xl font-bold text-[#651313]">
                                        ${isYearly ? (plan.price * 12).toFixed(2) : plan.price}
                                    </span>
                                    <span className="text-[#651313]/60 text-xs ml-1 font-semibold">
                                        /{isYearly ? 'year' : 'month'}
                                    </span>
                                </div>

                                <ul className="space-y-3 mb-6 flex-1">
                                    {plan.features && plan.features.map((feature, i) => (
                                        <li key={`${feature}-${i}`} className="flex items-center gap-3 text-[#651313] text-sm">
                                            <CheckIcon className="h-4 w-4 shrink-0 stroke-[3]" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleChoosePlan(plan)}
                                    className={`${buttonColor} text-white font-bold py-4 rounded-full shadow-lg hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest text-xs`}
                                >
                                    Choose Plan
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

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
                            <p className="text-gray-600 mb-6">You are selecting the <span className="font-bold text-[#EB4724]">{selectedPlan.name}</span> plan.</p>

                            <div className="bg-gray-50 p-4 rounded-xl mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-500 text-sm font-medium uppercase tracking-wide">Price</span>
                                    <span className="text-xl font-bold text-[#651313]">
                                        ${isYearly ? (selectedPlan.price * 12).toFixed(2) : selectedPlan.price}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-sm font-medium uppercase tracking-wide">Method</span>
                                    <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        WaafiPay
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-gray-500 text-sm font-medium uppercase tracking-wide">Cycle</span>
                                    <span className="text-sm font-bold text-gray-700">
                                        {isYearly ? 'Yearly' : 'Monthly'}
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
        </section>
    );
}

