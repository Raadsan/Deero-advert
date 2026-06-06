"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getBlogById } from "@/api-client/blogsApi";
import { getImageUrl } from "@/utils/url";
import Image from "next/image";
import { Calendar, ChevronLeft } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

// Helper function to process text and style hashtags
const processChildren = (children: any): any => {
    if (typeof children === "string") {
        const parts = children.split(/(#[a-zA-Z0-9_À-ÿ]+)/g);
        return parts.map((part, index) => {
            if (part.startsWith("#")) {
                return (
                    <span key={index} className="text-[#007bff] hover:underline cursor-pointer font-medium mr-1">
                        {part}
                    </span>
                );
            }
            return part;
        });
    }
    if (Array.isArray(children)) {
        return children.map((child, index) => (
            <React.Fragment key={index}>{processChildren(child)}</React.Fragment>
        ));
    }
    return children;
};

export default function BlogDetailsPage() {
    const { id } = useParams();
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                if (!id) return;
                const res = await getBlogById(id as string);
                // The backend returns the blog object directly
                if (res.data && (res.data.id || res.data._id || res.data.slug)) {
                    setBlog(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch blog details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow pt-[106px] md:pt-[131px] flex items-center justify-center">
                    <div className="animate-pulse text-gray-400">Loading blog details...</div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow pt-[106px] md:pt-[131px] flex flex-col items-center justify-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">Blog not found</h1>
                    <Link href="/blogs" className="text-[#EB4724] font-semibold hover:underline flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" /> Back to Blogs
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
                <article className="mx-auto max-w-4xl px-4 py-12 md:py-16">
                    {/* Back Link */}
                    <Link href="/blogs" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#EB4724] transition-colors mb-8">
                        <ChevronLeft className="h-4 w-4" />
                        Back to Blogs
                    </Link>

                    {/* Featured Image */}
                    <div className="relative w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl mb-10">
                        <Image
                            src={getImageUrl(blog.featuredImage || blog.featured_image) || "/home-images/blog1.png"}
                            alt={blog.title}
                            fill
                            priority
                             unoptimized
                            className="object-cover"
                        />
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                        {blog.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-10 pb-10 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-[#651313] flex items-center justify-center text-white text-xs font-bold">
                                {blog.author?.name?.charAt(0) || blog.authorName?.charAt(0) || "D"}
                            </div>
                            <span className="font-semibold text-gray-900">
                                {blog.author?.name || blog.authorName || "Deero Advert"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-[#EB4724]" />
                            <span>{new Date(blog.published_date || blog.createdAt).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric"
                            })}</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div 
                        className="max-w-none text-gray-700 leading-relaxed space-y-6"
                    >
                        <ReactMarkdown
                            components={{
                                h2: ({ children }) => (
                                    <h2 className="mt-10 mb-4 text-2xl font-bold text-[#651313] md:text-3xl">
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="mt-8 mb-3 text-xl font-bold text-gray-900 md:text-2xl">
                                        {children}
                                    </h3>
                                ),
                                p: ({ children }) => (
                                    <p className="mb-4 text-justify text-base md:text-lg">
                                        {processChildren(children)}
                                    </p>
                                ),
                                ul: ({ children }) => (
                                    <ul className="mb-6 list-disc space-y-2 pl-6">
                                        {children}
                                    </ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className="mb-6 list-decimal space-y-2 pl-6">
                                        {children}
                                    </ol>
                                ),
                                li: ({ children }) => (
                                    <li className="text-gray-700">
                                        {children}
                                    </li>
                                ),
                                strong: ({ children }) => (
                                    <strong className="font-bold text-gray-900">
                                        {children}
                                    </strong>
                                ),
                                a: ({ href, children }) => (
                                    <a className="text-[#EB4724] underline underline-offset-4" href={href}>
                                        {children}
                                    </a>
                                ),
                            }}
                        >
                            {blog.content || ""}
                        </ReactMarkdown>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
}
