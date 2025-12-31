"use client";

const roles = [
    {
        title: "Graphic Designer",
        type: "Full-time",
        location: "Mogadishu, Somalia",
        summary:
            "Create brand identities, campaign visuals and social media assets that reflect our clients’ stories and Deero’s quality.",
    },
    {
        title: "Digital Marketing Specialist",
        type: "Full-time",
        location: "Mogadishu, Somalia",
        summary:
            "Plan and execute performance-driven campaigns across social media platforms with a strong focus on content and analytics.",
    },
   
];

export default function CareerList() {
    return (
        <section className="bg-[#f2f2f2] py-16 px-4 sm:px-10">
            <div className="max-w-6xl mx-auto space-y-10">
                <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#4d0e0e]">
                        Open Positions
                    </h2>
                    <p className="text-sm md:text-base text-[#651313]/80">
                        We’re always looking for passionate creatives. Send your portfolio
                        and CV to{" "}
                        <a
                            href="mailto:info@advert.deero.so"
                            className="font-semibold text-[#EB4724]"
                        >
                            info@advert.deero.so
                        </a>
                        .
                    </p>
                </div>

                <div className="space-y-6">
                    {roles.map((role) => (
                        <div
                            key={role.title}
                            className="bg-white rounded-2xl border border-[#f4c6aa] px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                        >
                            <div>
                                <h3 className="text-lg md:text-xl font-bold text-[#4d0e0e]">
                                    {role.title}
                                </h3>
                                <p className="text-xs text-[#651313]/70 mt-1">
                                    {role.type} • {role.location}
                                </p>
                                <p className="text-sm text-[#4d0e0e]/80 mt-3 max-w-xl">
                                    {role.summary}
                                </p>
                            </div>
                            <a
                                href="mailto:info@advert.deero.so"
                                className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-[#EB4724] text-white text-sm font-semibold whitespace-nowrap hover:brightness-110 transition"
                            >
                                Apply Now
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}


