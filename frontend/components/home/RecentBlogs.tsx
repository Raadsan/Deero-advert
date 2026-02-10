"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getAllBlogs } from "@/api-client/blogsApi";
import { getImageUrl } from "@/utils/url";
import { useState, useEffect } from "react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

export default function RecentBlogs() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await getAllBlogs();
                const data = res.data.success ? res.data.data : (Array.isArray(res.data) ? res.data : []);
                setBlogs(data.reverse());
            } catch (err) {
                console.error("Failed to fetch blogs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <section className="bg-[#fce5d8] py-20 px-4 sm:px-10 overflow-hidden">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
                className="mx-auto max-w-6xl xl:max-w-7xl"
            >
                <div className="text-center mb-16">
                    <motion.div variants={itemVariants} className="mb-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#651313] mb-4">Recent Blogs</h2>
                        <div className="w-20 h-1.5 bg-[#EB4724] mx-auto rounded-full"></div>
                    </motion.div>
                </div>

                <div className="relative w-full overflow-hidden min-h-[500px]">
                    {loading && (
                        <div className="text-center text-gray-500 py-10">Loading blogs...</div>
                    )}
                    {blogs.length === 0 && !loading && (
                        <div className="text-center text-gray-500 py-10">No blogs found.</div>
                    )}

                    {blogs.length > 0 && <BlogSlider blogs={blogs} />}
                </div>
            </motion.div>
        </section>
    );
}

function BlogSlider({ blogs }: { blogs: any[] }) {
    const [index, setIndex] = useState(0);
    const [visibleItems, setVisibleItems] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setVisibleItems(1);
            else if (window.innerWidth < 1024) setVisibleItems(2);
            else setVisibleItems(3);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (blogs.length <= visibleItems) {
            setIndex(0);
            return;
        }

        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % (blogs.length - visibleItems + 1));
        }, 3000); // 3 seconds
        return () => clearInterval(interval);
    }, [visibleItems, blogs.length]);

    return (
        <div className="relative w-full">
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                    transform: `translateX(-${index * (100 / visibleItems)}%)`,
                }}
            >
                {blogs.map((blog, idx) => (
                    <div
                        key={blog._id || idx}
                        style={{ width: `${100 / visibleItems}%` }}
                        className="flex-shrink-0 px-4 h-full"
                    >
                        <div className="bg-white rounded-xl overflow-hidden shadow-xl flex flex-col group transition-all duration-300 transform hover:-translate-y-2 h-full min-h-[520px]">
                            {/* Top Card Area with Image */}
                            <div className={`${['bg-[#EB4724]', 'bg-[#4d0e0e]', 'bg-[#9b7677]'][idx % 3]} h-48 relative overflow-hidden flex-shrink-0`}>
                                <Image
                                    src={getImageUrl(blog.featuredImage || blog.featured_image) || `/home-images/blog${(idx % 3) + 1}.png`}
                                    alt={blog.title || "Blog Cover"}
                                    fill
                                    unoptimized
                                    className="object-cover brightness-110 contrast-125 transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.srcset = "";
                                        target.src = `/home-images/blog${(idx % 3) + 1}.png`;
                                    }}
                                />
                            </div>

                            {/* Content Area */}
                            <div className="p-6 pt-8 flex-1 flex flex-col text-left">
                                <h3 className="text-2xl font-bold text-[#EB4724] mb-4 min-h-[56px] flex items-center justify-start leading-tight line-clamp-2">
                                    {blog.title}
                                </h3>
                                <div
                                    className="text-gray-500 text-sm mb-6 flex-1 line-clamp-3 overflow-hidden"
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />
                                <div className="mt-auto pt-6 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-400 border-t border-gray-100">
                                    <span className="hover:text-[#EB4724] transition-colors">
                                        {typeof blog.author === 'string' ? blog.author : (blog.author?.name || blog.authorName || "Deero Advert")}
                                    </span>
                                    <span>
                                        {new Date(blog.published_date || blog.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Dots */}
            {blogs.length > visibleItems && (
                <div className="flex justify-center gap-2 mt-12">
                    {Array.from({ length: blogs.length - visibleItems + 1 }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === i ? "w-6 bg-[#EB4724]" : "w-1.5 bg-[#EB4724]/30 hover:bg-[#EB4724]/60"
                                }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

