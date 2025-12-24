import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CareerHero from "@/components/career/CareerHero";
import CareerList from "@/components/career/CareerList";

export default function CareerPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-[170px]">
                <CareerHero />
                <CareerList />
            </main>
            <Footer />
        </div>
    );
}


