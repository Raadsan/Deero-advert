"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getBlogById } from "@/api-client/blogsApi";
import { getImageUrl } from "@/utils/url";
import Image from "next/image";
import { User, Calendar, ChevronLeft } from "lucide-react";
import Link from "next/link";

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
                        className="max-w-none text-gray-700 leading-relaxed space-y-6 
                            [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-bold [&_h2]:text-[#651313] [&_h2]:mt-10 [&_h2]:mb-4
                            [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-8 [&_h3]:mb-3
                            [&_p]:mb-4 [&_p]:text-base [&_p]:md:text-lg
                            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-6
                            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:mb-6
                            [&_li]:text-gray-700
                            [&_strong]:font-bold [&_strong]:text-gray-900
                            [&_a]:text-[#EB4724] [&_a]:underline [&_a]:underline-offset-4"
                        dangerouslySetInnerHTML={{ 
                            __html: blog.content?.includes("<") 
                                ? blog.content 
                                : blog.content
                                    .split("\n")
                                    .map((line: string) => {
                                        if (line.startsWith("## ")) {
                                            return `<h2>${line.replace("## ", "")}</h2>`;
                                        }
                                        if (line.trim() === "") return "";
                                        return `<p>${line}</p>`;
                                    })
                                    .join("")
                        }}
                    />
                </article>
            </main>
            <Footer />
        </div>
    );
}
