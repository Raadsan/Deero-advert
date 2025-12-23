"use client";

import Image from "next/image";
import Link from "next/link";

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

export default function RecentBlogs() {
    return (
        <section className="bg-[#fce5d8] py-20 px-4">
            <div className="mx-auto max-w-6xl">
                <h2 className="text-3xl font-bold text-[#651313] text-center mb-16">Recent Blogs</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {blogs.map((blog) => (
                        <div key={blog.id} className="bg-white rounded-xl overflow-hidden shadow-xl flex flex-col group transition-transform hover:-translate-y-2 duration-300">
                            {/* Top Card Area with Icon */}
                            <div className={`${blog.color} h-48 relative flex items-center justify-center p-8 overflow-hidden`}>
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-x-4 -translate-y-8"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full -translate-x-8 translate-y-12"></div>

                                <div className="relative w-full h-full flex items-center justify-center p-4">
                                    <Image
                                        src={blog.image}
                                        alt="Blog Cover"
                                        fill
                                        className="object-contain p-4 brightness-110 contrast-125"
                                    />
                                </div>

                                {/* Float Badge */}
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg py-2 px-4 flex items-center gap-3 w-[85%] z-20">
                                    <div className="w-10 h-10 rounded-full bg-[#fce5d8] flex items-center justify-center border-2 border-[#EB4724]">
                                        <Image src="/home-images/Deero Logo full.png" alt="Logo" width={40} height={40} className="object-contain p-1" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-[#EB4724] uppercase">{blog.author}</span>
                                        <span className="text-[9px] text-gray-400 font-semibold">{blog.date}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-8 pt-10 flex-1 flex flex-col text-center">
                                <h3 className="text-lg font-bold text-[#651313] mb-4 min-h-[56px] flex items-center justify-center leading-tight">
                                    {blog.title}
                                </h3>
                                <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-3">
                                    {blog.excerpt}
                                </p>

                                <div className="border-t border-gray-100 pt-6 mt-auto">
                                    <div className="flex flex-wrap justify-center gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                        {blog.tags.map((tag) => (
                                            <span key={tag} className="hover:text-[#EB4724] cursor-pointer transition-colors">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        href="/blogs"
                        className="bg-[#EB4724] text-white px-12 py-3.5 rounded-full font-bold uppercase tracking-widest hover:bg-[#d13d1d] transition shadow-lg inline-block"
                    >
                        Read More
                    </Link>
                </div>
            </div>
        </section>
    );
}
