export const dynamic = 'force-static';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NewsHero from "@/components/news/NewsHero";
import NewsList from "@/components/news/NewsList";

export default function NewsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-[170px]">
                <NewsHero />
                <NewsList />
            </main>
            <Footer />
        </div>
    );
}


