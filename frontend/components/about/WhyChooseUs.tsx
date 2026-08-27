import {
    BadgeDollarSign,
    ChartNoAxesCombined,
    Lightbulb,
    PackageCheck,
    Star,
    UsersRound,
} from "lucide-react";

const reasons = [
    {
        title: "One-Stop Agency",
        description:
            "Everything your business needs in one place. Our integrated creative, digital marketing, and advertising services ensure efficiency, consistency, and measurable growth.",
        icon: PackageCheck,
    },
    {
        title: "Customer First",
        description:
            "We take time to understand your goals, challenges, and opportunities, then create tailored solutions that deliver lasting value and long-term success.",
        icon: UsersRound,
    },
    {
        title: "Experienced Agency",
        description:
            "Since 2019, we have helped businesses build stronger brands, increase visibility, engage the right audiences, and achieve sustainable growth.",
        icon: Star,
    },
    {
        title: "Competitive Pricing",
        description:
            "We deliver professional, high-quality services at competitive rates, helping you maximize value and achieve measurable results within your budget.",
        icon: BadgeDollarSign,
    },
    {
        title: "Innovation & Creativity",
        description:
            "We combine original thinking with the latest digital trends and technologies to create distinctive campaigns that keep your business ahead.",
        icon: Lightbulb,
    },
    {
        title: "Results-Driven Approach",
        description:
            "We track performance, analyze data, and continuously optimize every campaign to maximize return on investment and help you reach your goals.",
        icon: ChartNoAxesCombined,
    },
];

export default function WhyChooseUs() {
    return (
        <section className="bg-[#fce5d8] px-4 py-20 sm:px-10 lg:py-28">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto mb-14 max-w-3xl text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-[#1a1a1a] md:text-5xl">
                        Why Choose <span className="text-[#7a1717]">Deero?</span>
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
                        A committed creative partner with the expertise, ideas, and focus to move your business forward.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {reasons.map((reason) => {
                        const Icon = reason.icon;

                        return (
                            <article
                                key={reason.title}
                                className="group relative overflow-hidden rounded-2xl border border-[#4d0e0e]/10 bg-white p-8 shadow-[0_12px_40px_rgba(77,14,14,0.07)] transition duration-300 hover:-translate-y-2 hover:border-[#F7B5A7] hover:shadow-[0_20px_50px_rgba(77,14,14,0.14)]"
                            >
                                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4d0e0e] text-[#F7B5A7] transition duration-300 group-hover:rotate-3 group-hover:bg-[#F7B5A7] group-hover:text-[#4d0e0e]">
                                    <Icon size={27} strokeWidth={1.8} aria-hidden="true" />
                                </div>
                                <h3 className="mb-3 text-center text-xl font-bold text-[#1a1a1a]">{reason.title}</h3>
                                <p lang="en" className="text-justify [hyphens:auto] leading-relaxed text-gray-600">
                                    {reason.description}
                                </p>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
