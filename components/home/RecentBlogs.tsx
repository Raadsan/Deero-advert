"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const blogs = [
    {
        id: 1,
        title: "How Motion Graphics Can Help Your Brand Marketing?",
        excerpt: "Here is the article rewritten to improve transition words and...",
        author: "Deero Advert",
        date: "July 8, 2023",
        tags: ["Brand Marketing", "Motion Graphics"],
        color: "bg-[#EB4724]",
        image: "/home-images/blog1.png",
    },
    {
        id: 2,
        title: "Why every business needs a website?",
        excerpt: "In this article, we will emphasize and explain the concept...",
        author: "Deero Advert",
        date: "April 22, 2023",
        tags: ["Design", "Develop", "Website"],
        color: "bg-[#4d0e0e]",
        image: "/home-images/blog2.png",
    },
    {
        id: 3,
        title: "Why is branding essential for any business?",
        excerpt: "In this section, we will emphasize and explain the concept...",
        author: "Deero Advert",
        date: "April 23, 2023",
        tags: ["Branding", "Design", "Identity"],
        color: "bg-[#9b7677]",
        image: "/home-images/blog3.png",
    },
  
];

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
                    {blogs.map((blog) => (
                        <motion.div
                            key={blog.id}
                            variants={itemVariants}
                            whileHover={{ y: -10 }}
                            className="bg-white rounded-xl overflow-hidden shadow-xl flex flex-col group transition-all duration-300"
                        >
                            {/* Top Card Area with Icon */}
                            <div className={`${blog.color} h-48 relative overflow-hidden`}>
                                <Image
                                    src={blog.image}
                                    alt="Blog Cover"
                                    fill
                                    className="object-cover brightness-110 contrast-125 transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Float Badge */}
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.4 }}
                                    className="absolute -bottom-8 left-6 bg-white rounded-md shadow-md py-2 px-4 flex items-center gap-3 w-fit pr-10 z-20"
                                >
                                    <div className="w-12 h-12 rounded-full bg-[#fce5d8] flex items-center justify-center border-2 border-[#EB4724]">
                                        <Image src="/home-images/Deero Logo full.png" alt="Logo" width={44} height={44} className="object-contain p-1" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-[#EB4724] uppercase">{blog.author}</span>
                                        <span className="text-[10px] text-gray-400 font-semibold">{blog.date}</span>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Content Area */}
                            <div className="p-6 pt-12 flex-1 flex flex-col text-left">
                                <h3 className="text-2xl font-bold text-[#EB4724] mb-4 min-h-[56px] flex items-center justify-start leading-tight">
                                    {blog.title}
                                </h3>
                                <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-3">
                                    {blog.excerpt}
                                </p>
                                <div className="border-t border-gray-100 pt-6 mt-auto">
                                    <div className="flex flex-wrap justify-start gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                        {blog.tags.map((tag) => (
                                            <span key={tag} className="hover:text-[#EB4724] cursor-pointer transition-colors">{tag}</span>
                                        ))}
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
