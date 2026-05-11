export const dynamic = 'force-dynamic';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogHero from "@/components/blogs/BlogHero";
import BlogList from "@/components/blogs/BlogList";

export default function BlogsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-[106px] md:pt-[131px]">
                <BlogHero />
                <BlogList />
            </main>
            <Footer />
        </div>
    );
}
