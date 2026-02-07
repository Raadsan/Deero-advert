export const dynamic = 'force-static';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CareersHero from "@/components/careers/CareersHero";
import JobsList from "@/components/careers/JobsList";

export default function CareersPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-[170px]">
                <CareersHero />
                <JobsList />
            </main>
            <Footer />
        </div>
    );
}
