export const dynamic = 'force-dynamic';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CaseStudyHero from "@/components/casestudy/CaseStudyHero";
import CaseStudyList from "@/components/casestudy/CaseStudyList";

export default function CaseStudyPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-[106px] md:pt-[131px]">
                <CaseStudyHero />
                <CaseStudyList />
            </main>
            <Footer />
        </div>
    );
}
