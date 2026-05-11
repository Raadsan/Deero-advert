"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import { User, Calendar, ChevronLeft, Target, Lightbulb, TrendingUp, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getCaseStudyById } from "@/api-client/caseStudyApi";
import { getImageUrl } from "@/utils/url";

export default function CaseStudyDetailsPage() {
    const { id } = useParams();
    const [caseStudy, setCaseStudy] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCaseStudy = async () => {
            try {
                if (!id) return;
                const res = await getCaseStudyById(id as string);
                const data = res.data;
                
                // Format data to match component expectations
                setCaseStudy({
                    ...data,
                    image: getImageUrl(data.image),
                    services: Array.isArray(data.services) ? data.services : (typeof data.services === 'string' ? JSON.parse(data.services) : [])
                });
            } catch (err) {
                console.error("Failed to fetch case study details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCaseStudy();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow pt-[106px] md:pt-[131px] flex items-center justify-center">
                    <div className="animate-pulse text-gray-400 font-bold">Loading case study details...</div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!caseStudy) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow pt-[106px] md:pt-[131px] flex flex-col items-center justify-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">Case Study not found</h1>
                    <Link href="/casestudy" className="text-[#EB4724] font-semibold hover:underline flex items-center gap-1 transition-all">
                        <ChevronLeft className="h-4 w-4" /> Back to Case Studies
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-grow pt-[106px] md:pt-[131px]">
                {/* Hero Section for Detail - Matching AboutHero Style */}
                <section className="relative w-full bg-gradient-to-r from-[#4d0e0e] via-[#651313] to-[#EB4724] py-16 md:py-24 px-4 overflow-hidden">
                    {/* Watermark Pattern - From AboutHero */}
                    <div className="absolute inset-0 flex items-center justify-between opacity-10 pointer-events-none select-none px-4">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div key={i} className="w-24 h-24 md:w-32 md:h-32 relative shrink-0">
                                {/* <img
                                    src="/home-images/about-01.svg"
                                    alt=""
                                    className="w-full h-full object-contain grayscale brightness-0 invert opacity-30"
                                /> */}
                            </div>
                        ))}
                    </div>
                    
                    <div className="mx-auto max-w-6xl relative z-10">
                        <Link href="/casestudy" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group font-semibold">
                            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to All Case Studies
                        </Link>
                        
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="max-w-3xl">
                                <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6 border border-white/10">
                                    {caseStudy.category}
                                </span>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-white drop-shadow-xl">
                                    {caseStudy.title}
                                </h1>
                            </div>
                            <div className="flex flex-col gap-2 border-l-2 border-white/30 pl-6 py-2">
                                <span className="text-white/60 text-xs uppercase font-bold tracking-widest">Client</span>
                                <span className="text-xl font-bold text-white">{caseStudy.client}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <article className="mx-auto max-w-6xl px-4 py-16">
                    {/* Featured Image & Quick Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
                        <div className="lg:col-span-2">
                            <div className="relative w-full h-[400px] md:h-[550px] rounded-[2rem] overflow-hidden shadow-2xl group">
                                <Image
                                    src={caseStudy.image || ""}
                                    alt={caseStudy.title}
                                    fill
                                    priority
                                    unoptimized
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-8">
                            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm h-full">
                                <h3 className="text-xl font-bold text-[#651313] mb-8 flex items-center gap-2 border-b border-gray-200 pb-4">
                                    Project Details
                                </h3>
                                
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-[#EB4724]/10 p-3 rounded-xl">
                                            <Calendar className="h-5 w-5 text-[#EB4724]" />
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Timeline</p>
                                            <p className="text-gray-900 font-bold">{caseStudy.duration}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-4">
                                        <div className="bg-[#EB4724]/10 p-3 rounded-xl">
                                            <User className="h-5 w-5 text-[#EB4724]" />
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Agency</p>
                                            <p className="text-gray-900 font-bold">{caseStudy.author}</p>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">Services Delivered</p>
                                        <div className="flex flex-wrap gap-2">
                                            {caseStudy.services.map((service: string, i: number) => (
                                                <span key={i} className="bg-white border border-gray-200 text-[#651313] text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm">
                                                    {service}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Case Study Core Content - Vertical Layout */}
                    <div className="max-w-4xl mx-auto space-y-16">
                        {/* The Challenge */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-4 mb-2">
                                <div className="bg-[#EB4724] w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-[#EB4724]/20">
                                    <Target className="text-white h-5 w-5" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-[#651313]">The Challenge</h2>
                            </div>
                            <div className="text-gray-800 text-lg leading-relaxed space-y-6">
                                <p>
                                    {caseStudy.challenge}
                                </p>
                                <p>
                                    In today's competitive landscape, businesses face the constant pressure of evolving consumer expectations. For {caseStudy.client}, the primary hurdle was not just the technical implementation, but ensuring that the solution resonated with their core audience while maintaining operational efficiency.
                                </p>
                            </div>
                        </motion.div>

                        {/* Our Solution */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-4 mb-2">
                                <div className="bg-[#651313] w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-[#651313]/20">
                                    <Lightbulb className="text-white h-5 w-5" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-[#651313]">Our Solution</h2>
                            </div>
                            <div className="text-gray-800 text-lg leading-relaxed space-y-6">
                                <p>
                                    {caseStudy.solution}
                                </p>
                                <p>
                                    Our approach focused on creating a seamless bridge between complex backend systems and an intuitive frontend experience. By leveraging modern technologies and user-centric design principles, we were able to deliver a solution that exceeded the initial requirements and set a new standard for the industry.
                                </p>
                            </div>
                        </motion.div>

                        {/* The Result */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-4 mb-2">
                                <div className="bg-[#EB4724] w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-[#EB4724]/20">
                                    <TrendingUp className="text-white h-5 w-5" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-[#651313]">The Result</h2>
                            </div>
                            <div className="text-gray-800 text-lg leading-relaxed space-y-6">
                                <p>
                                    {caseStudy.result}
                                </p>
                                <p>
                                    The impact of this project was immediate and measurable. Beyond the numbers, {caseStudy.client} reported a significant improvement in internal team morale and a stronger position in the market. This success serves as a testament to the power of strategic collaboration and innovative thinking.
                                </p>
                                <div className="flex items-center gap-2 text-[#EB4724] font-bold text-sm">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Success Achieved
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-24 bg-[#651313] rounded-[3.5rem] p-12 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-[#651313]/30">
                        {/* Subtle Background Elements for Depth */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#EB4724]/20 rounded-full blur-[100px] pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/40 rounded-full blur-[80px] pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                                Want to see similar results?
                            </h2>
                            <p className="text-white/80 max-w-2xl mx-auto mb-12 text-lg md:text-xl font-medium leading-relaxed">
                                Ready to transform your brand into a visual masterpiece? Let's collaborate on your next project and bring your vision to life.
                            </p>
                            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-[#651313] font-extrabold px-12 py-5 rounded-full shadow-xl hover:scale-105 transition-all active:scale-95 group">
                                Start Your Project 
                                <TrendingUp className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </Link>
                        </div>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
}
