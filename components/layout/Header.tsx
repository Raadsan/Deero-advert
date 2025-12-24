"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Hosting", href: "/#hosting" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "https://www.behance.net/deeroadvert" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "";
  const [hash, setHash] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const setCurrentHash = () => setHash(window.location.hash || "");
    setCurrentHash();
    window.addEventListener("hashchange", setCurrentHash);
    return () => window.removeEventListener("hashchange", setCurrentHash);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50">
      {/* Top bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 bg-[#651313] py-3 text-sm font-medium text-white sm:px-6 md:text-base">
        <span className="text-base md:text-lg">+252 61 8553566</span>
        <span className="hidden sm:inline">|</span>
        <a
          href="mailto:info@advert.deero.so"
          className="underline-offset-2 hover:underline"
        >
          info@advert.deero.so
        </a>
        <span className="hidden sm:inline">|</span>
        <span>HQ Digfeer, Mogadishu - Somalia</span>
        <span className="hidden sm:inline">|</span>
        <div className="flex items-center gap-3 font-semibold">
          <Link
            href="/news"
            className="transition hover:text-[#EB4724]"
          >
            News
          </Link>
          <Link
            href="/career"
            className="transition hover:text-[#EB4724]"
          >
            Career
          </Link>
          {/* <Link
            href="#download"
            className="rounded-full bg-[#EB4724] px-4 py-1.5 text-white transition hover:opacity-90"
          >
            Download
          </Link> */}
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-white/20 bg-white/95 backdrop-blur-sm shadow-sm sm:px-6">
        <div className="mx-auto max-w-7xl px-4 md:px-6 h-[120px] flex items-center justify-between">

          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Image
              src="/home-images/Deero Logo full.png"
              alt="Deero Advertising Agency"
              width={500}
              height={500}
              className="w-[220px] md:w-[260px] lg:w-[300px] h-auto"
              priority
            />
          </div>

          {/* Navigation - Center */}
          <nav className="hidden md:flex gap-8 font-semibold   text-[#651313] pr-22">
            {navLinks.map((link) => {
              const [linkPathPart, linkHashPart] = link.href.split("#");
              const linkPath = linkPathPart || "/";
              const linkHash = linkHashPart ? `#${linkHashPart}` : "";

              const isActive = linkHash
                ? pathname === linkPath && hash === linkHash
                : pathname === linkPath;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition ${isActive ? "text-[#EB4724]" : "text-[#651313]"
                    } hover:text-[#EB4724]`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Client Area - Right */}
          <div className="hidden md:flex pr-25">
            <Link
              href="#client-area"
              className="rounded-full bg-[#EB4724] px-6 py-2.5 font-semibold text-white transition hover:opacity-90"
            >
              Client Area
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label="Toggle navigation"
            className="md:hidden ml-4 p-2 rounded-md text-[#651313] transition hover:bg-[#651313]/5"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden border-t border-white/30 bg-white px-4 pb-4 shadow-sm">
            <div className="flex flex-col gap-3 font-semibold text-[#651313]">
              {navLinks.map((link) => {
                const isActive =
                  link.href.startsWith("/") &&
                  (pathname === link.href || pathname.startsWith(link.href));

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-md px-2 py-2 transition ${isActive ? "text-[#EB4724]" : "text-[#651313]"
                      } hover:bg-[#651313]/5`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="#client-area"
                className="rounded-full bg-[#EB4724] px-5 py-2 text-center text-white shadow-sm transition hover:opacity-90"
                onClick={() => setOpen(false)}
              >
                Client Area
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
