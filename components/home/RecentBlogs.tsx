"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getAllBlogs } from "@/api/blogsApi";
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
};

export default function RecentBlogs() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await getAllBlogs();
                const data = res.data.success ? res.data.data : (Array.isArray(res.data) ? res.data : []);
                setBlogs(data.slice(0, 3));
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
                className="mx-auto max-w-6xl"
            >
                <motion.h2 variants={itemVariants} className="text-3xl font-bold text-[#651313] text-center mb-16">Recent Blogs</motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {blogs.length === 0 && !loading && (
                        <div className="col-span-full text-center text-gray-500 py-10">No blogs found.</div>
                    )}
                    {blogs.map((blog, idx) => (
                        <motion.div
                            key={blog._id || idx}
                            variants={itemVariants}
                            whileHover={{ y: -10 }}
                            className="bg-white rounded-xl overflow-hidden shadow-xl flex flex-col group transition-all duration-300"
                        >
                            {/* Top Card Area with Image */}
                            <div className={`${['bg-[#EB4724]', 'bg-[#4d0e0e]', 'bg-[#9b7677]'][idx % 3]} h-48 relative overflow-hidden`}>
                                <Image
                                    src={getImageUrl(blog.featuredImage || blog.featured_image) || "/home-images/blog1.png"}
                                    alt="Blog Cover"
                                    fill
                                    unoptimized
                                    className="object-cover brightness-110 contrast-125 transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Float Badge */}
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.4 }}
                                    className="absolute -bottom-8 left-6 bg-white rounded-md shadow-md py-2 px-4 flex items-center gap-3 w-fit pr-10 z-20"
                                >
                                    <div className="w-12 h-12 rounded-full bg-[#fce5d8] flex items-center justify-center border-2 border-[#EB4724] overflow-hidden">
                                        <Image
                                            src={getImageUrl(blog.authorAvatar) || "/home-images/Deero Logo full.png"}
                                            alt="Author"
                                            width={44}
                                            height={44}
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-[#EB4724] uppercase">{blog.authorName || "Deero Advert"}</span>
                                        <span className="text-[10px] text-gray-400 font-semibold">{new Date(blog.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Content Area */}
                            <div className="p-6 pt-12 flex-1 flex flex-col text-left">
                                <h3 className="text-2xl font-bold text-[#EB4724] mb-4 min-h-[56px] flex items-center justify-start leading-tight line-clamp-2">
                                    {blog.title}
                                </h3>
                                <div
                                    className="text-gray-500 text-sm mb-6 flex-1 line-clamp-3 overflow-hidden"
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />
                                <div className="border-t border-gray-100 pt-6 mt-auto">
                                    <div className="flex flex-wrap justify-start gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                        {(() => {
                                            const tags = Array.isArray(blog.categories) ? blog.categories :
                                                (typeof blog.categories === 'string' ? blog.categories.split(',').map((c: string) => c.trim()).filter(Boolean) :
                                                    (blog.tags || ["Design", "Branding"]));

                                            // Ensure we always have an array and handle any duplicates/empty
                                            const uniqueTags = Array.from(new Set(tags)).filter(Boolean);

                                            return uniqueTags.map((tag: any, tIdx: number) => (
                                                <span
                                                    key={`${blog._id}-${tag}-${tIdx}`}
                                                    className="hover:text-[#EB4724] cursor-pointer transition-colors"
                                                >
                                                    {tag}
                                                </span>
                                            ));
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div variants={itemVariants} className="text-center">
                    <Link
                        href="/blogs"
                        className="bg-[#EB4724] text-white px-12 py-3.5 rounded-full font-bold uppercase tracking-widest hover:bg-[#d13d1d] hover:scale-105 active:scale-95 transition-all shadow-lg inline-block"
                    >
                        Read More
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
}
