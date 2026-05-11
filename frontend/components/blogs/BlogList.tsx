"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getAllBlogs } from "@/api-client/blogsApi";
import { getImageUrl } from "@/utils/url";
import { useState, useEffect } from "react";

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

export default function BlogList() {
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

    if (loading) {
        return (
            <section className="bg-[#fce5d8]/30 py-20 px-4">
                <div className="mx-auto max-w-6xl xl:max-w-7xl text-center text-gray-500">
                    Loading blogs...
                </div>
            </section>
        );
    }

    if (blogs.length === 0) {
        return (
            <section className="bg-[#fce5d8]/30 py-20 px-4">
                <div className="mx-auto max-w-6xl xl:max-w-7xl text-center text-gray-500">
                    No blogs found.
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#fce5d8]/30 py-20 px-4 sm:px-10">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={containerVariants}
                className="mx-auto max-w-6xl xl:max-w-7xl"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog, idx) => (
                        <motion.div
                            key={blog.id || blog._id || idx}
                            variants={itemVariants}
                            className="h-full"
                        >
                            <Link 
                                href={`/blogs/${blog.id || blog._id}`}
                                className="bg-white rounded-xl overflow-hidden shadow-lg flex flex-col group transition-all duration-300 transform hover:-translate-y-2 h-full min-h-[500px]"
                            >
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
                                    <h3 className="text-2xl font-bold text-[#EB4724] mb-4 min-h-[56px] flex items-center justify-start leading-tight line-clamp-2 group-hover:text-[#651313] transition-colors">
                                        {blog.title}
                                    </h3>
                                    <div className="text-gray-500 text-sm mb-6 flex-1 line-clamp-6 overflow-hidden leading-relaxed">
                                        {blog.content?.replace(/<[^>]*>?/gm, '').substring(0, 260)}...
                                    </div>

                                    <div className="flex items-center gap-2 text-[#EB4724] font-bold text-sm mb-6">
                                        Read More
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>

                                    <div className="mt-auto pt-6 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-400 border-t border-gray-100">
                                        <span className="hover:text-[#EB4724] transition-colors">
                                            {typeof blog.author === 'string' ? blog.author : (blog.author?.name || blog.authorName || "Deero Advert")}
                                        </span>
                                        <span>
                                            {new Date(blog.published_date || blog.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
