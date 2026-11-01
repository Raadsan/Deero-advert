"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Globe2, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { isAuthenticated, getUser, clearAuth, isStaff as hasStaffRole, isAdmin } from "@/utils/auth";
import { logout as apiLogout } from "../../api-client/authApi";
import { getActiveAnnouncements, Announcement } from "../../api-client/announcementApi";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, X, ChevronDown, Package } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  {
    label: "Services",
    href: "#",
    subLinks: [
      
      {
        label: "Packages",
        href: "/Packages"
      },
      {
        label: "Hosting & Domains",
        href: "/hosting"
      },
    ]
  },
  { label: "Portfolio", href: "/portfolio" },
  {
    label: "Resources",
    href: "#",
    subLinks: [
      { label: "Blog", href: "/blogs" },
      { label: "News & Events", href: "/news" },
      { label: "Case Studies", href: "/casestudy" }
    ]
  },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const { cartItems } = useCart();
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "";
  const [hash, setHash] = useState("");
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [activeAnnouncement, setActiveAnnouncement] = useState<Announcement | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(isAuthenticated());
    const userData = getUser();
    if (userData) {
      setUser(userData);
      setIsAdminUser(isAdmin());
      setIsStaff(hasStaffRole());
    } else {
      setUser(null);
      setIsAdminUser(false);
      setIsStaff(false);
    }

    const fetchAnnouncement = async () => {
      try {
        const res = await getActiveAnnouncements();
        if (res.data?.success && res.data?.data?.length > 0) {
          setActiveAnnouncement(res.data.data[0]);
        }
      } catch (err) {
        console.error("Error fetching active announcement:", err);
      }
    };
    fetchAnnouncement();

    if (typeof window === "undefined") return;
    const setCurrentHash = () => setHash(window.location.hash || "");
    setCurrentHash();
    window.addEventListener("hashchange", setCurrentHash);
    return () => window.removeEventListener("hashchange", setCurrentHash);
  }, []);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    const userData = getUser();
    if (userData) {
      setUser(userData);
      setIsAdminUser(isAdmin());
      setIsStaff(hasStaffRole());
    } else {
      setUser(null);
      setIsAdminUser(false);
      setIsStaff(false);
    }
  }, [pathname]);

  const handleLogout = async () => {
    await apiLogout();
    clearAuth();
    setIsLoggedIn(false);
    setIsAdminUser(false);
    setIsStaff(false);
    setUser(null);
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300">
      {/* Announcement Banner */}
      {showBanner && activeAnnouncement && (
        <div className="bg-[#EB4724] text-white py-1.5 md:py-2 px-4 shadow-inner">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <div className="flex-1 flex items-center justify-center gap-2 md:gap-4 overflow-hidden">
              <div className="flex-shrink-0 bg-white/20 p-1.5 rounded-full animate-pulse">
                <Megaphone className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 overflow-hidden">
                <span className="font-bold text-xs md:text-sm uppercase tracking-wider whitespace-nowrap bg-white/20 px-2 py-0.5 rounded leading-none">
                  Announcement
                </span>
                {activeAnnouncement.linkUrl ? (
                  <a
                    href={activeAnnouncement.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-xs md:text-base truncate max-w-[200px] sm:max-w-md md:max-w-none underline-offset-2 hover:underline"
                    title={activeAnnouncement.linkUrl}
                  >
                    {activeAnnouncement.title}: <span className="font-normal opacity-90">{activeAnnouncement.message}</span>
                  </a>
                ) : (
                  <span className="font-semibold text-xs md:text-base truncate max-w-[200px] sm:max-w-md md:max-w-none">
                    {activeAnnouncement.title}: <span className="font-normal opacity-90">{activeAnnouncement.message}</span>
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="flex-shrink-0 ml-4 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-3 bg-[#651313] py-1.5 text-sm font-medium text-white sm:px-6 md:gap-6 md:py-2 md:text-base leading-tight">
        <a href="tel:+252618553839" className="text-base md:text-lg hover:underline">+252 61 8553839</a>
        <span className="hidden sm:inline">|</span>
        <a href="mailto:info@advert.deero.so" className="underline-offset-2 hover:underline">
          info@advert.deero.so
        </a>
        <span className="hidden sm:inline">|</span>
        <span>HQ Digfeer, Mogadishu - Somalia</span>
        <span className="hidden sm:inline">|</span>
        <div className="flex items-center gap-3 font-semibold">
          <Link href="/news" className="transition hover:text-[#EB4724]">News</Link>
          <span className="hidden sm:inline">|</span>
          <Link href="/careers" className="transition hover:text-[#EB4724]">Career</Link>
          <span className="hidden sm:inline">|</span>
          <Link href="/free-booking" className="transition hover:text-[#EB4724] font-semibold">
            Free Booking
          </Link>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-gray-200/80 bg-white/95 backdrop-blur-sm shadow-xs sm:px-6">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-4 sm:px-6 h-[70px] md:h-[95px] flex items-center justify-between">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Image
                src="/home-images/Deero Logo full.png"
                alt="Deero Advertising Agency"
                width={500}
                height={500}
                className="w-[150px] md:w-[210px] lg:w-[240px] max-h-full h-auto cursor-pointer object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-semibold text-[#651313]">
            {navLinks.map((link) => {
              if (link.subLinks) {
                const isSubActive = link.subLinks.some((sub) => {
                  const [subPath] = sub.href.split("#");
                  return mounted && (pathname === subPath || (subPath !== "/" && pathname.startsWith(subPath)));
                });

                return (
                  <div
                    key={link.label}
                    className="relative group"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className={`flex items-center gap-1 transition py-4 ${
                      isSubActive ? "text-[#EB4724] font-bold" : "text-[#651313] hover:text-[#EB4724]"
                    }`}>
                      {link.label}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openDropdown === link.label ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className={link.label === "Services"
                            ? "absolute left-1/2 mt-0 w-72 -translate-x-1/2 rounded-2xl border border-[#651313]/10 bg-white shadow-2xl z-50 overflow-hidden"
                            : "absolute left-0 mt-0 w-48 rounded-xl border border-gray-100 bg-white shadow-xl z-50 overflow-hidden"
                          }
                        >
                          <div className={link.label === "Services" ? "flex flex-col gap-1 p-3" : "p-1"}>
                            {link.subLinks.map((sub) => {
                              const [subPath] = sub.href.split("#");
                              const isChildActive = mounted && (pathname === subPath || (subPath !== "/" && pathname.startsWith(subPath)));
                              const MenuIcon = sub.label === "Hosting & Domains" ? Globe2 : Package;
                              return (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  className={link.label === "Services"
                                    ? `group/item flex w-full items-center gap-3 rounded-xl p-3 transition-colors ${isChildActive ? "bg-[#EB4724]/5" : "hover:bg-[#651313]/5"}`
                                    : `block px-4 py-2.5 rounded-lg text-sm transition-colors ${isChildActive ? "bg-gray-50 text-[#EB4724] font-bold" : "text-[#651313] hover:bg-gray-50 hover:text-[#EB4724]"}`
                                  }
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  {link.label === "Services" ? (
                                    <>
                                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#651313] text-white transition-colors group-hover/item:bg-[#EB4724]">
                                        <MenuIcon className="h-5 w-5" />
                                      </span>
                                      <span className="font-bold text-[#651313] group-hover/item:text-[#EB4724]">{sub.label}</span>
                                    </>
                                  ) : sub.label}
                                </Link>
                              );
                            })}
                            {link.label === "Services" && (
                              <Link
                                href="/services"
                                onClick={() => setOpenDropdown(null)}
                                className="flex w-full items-center justify-center gap-2 rounded-xl border-t border-[#651313]/10 px-4 py-3 text-sm font-bold text-[#EB4724] transition hover:bg-[#EB4724] hover:text-white"
                              >
                                Explore All Services
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              const [linkPathPart, linkHashPart] = link.href.split("#");
              const linkPath = linkPathPart || "/";
              const linkHash = linkHashPart ? `#${linkHashPart}` : "";
              const isActive = mounted && (linkHash
                ? pathname === linkPath && hash === linkHash
                : pathname === linkPath);

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative py-1 transition-colors duration-200 ${
                    isActive ? "text-[#EB4724] font-bold" : "text-[#651313] hover:text-[#EB4724]"
                  } after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[2px] after:bg-[#EB4724] after:rounded-full after:transition-transform after:duration-300 ${
                    isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right — Client Area */}
          <div className="hidden md:flex items-center gap-6">
            {isLoggedIn && !isStaff && (
              <Link href="/cart" className="relative p-2 text-[#651313] hover:bg-gray-100 rounded-full transition">
                <ShoppingCart className="h-6 w-6" />
                {cartItems.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#EB4724] text-[10px] font-bold text-white ring-2 ring-white">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            )}

            {isLoggedIn ? (
              <Link
                href={hasStaffRole() ? "/dashboard" : "/user"}
                className="rounded-full bg-[#EB4724] px-6 py-2.5 font-semibold text-white transition hover:opacity-90 shadow-md"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-[#EB4724] px-6 py-2.5 font-semibold text-white transition hover:opacity-90 shadow-md"
              >
                Client Area
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-2">
            {isLoggedIn && !isStaff && (
              <Link href="/cart" className="relative p-2 text-[#651313] hover:bg-gray-100 rounded-full transition">
                <ShoppingCart className="h-6 w-6" />
                {cartItems.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#EB4724] text-[10px] font-bold text-white ring-2 ring-white">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            )}
            <button
              type="button"
              aria-label="Toggle navigation"
              className="p-2 rounded-md text-[#651313] transition hover:bg-[#651313]/5"
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
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden border-t border-white/30 bg-white px-4 pb-4 shadow-sm">
            <div className="flex flex-col gap-3 font-semibold text-[#651313]">
              {navLinks.map((link) => {
                if (link.subLinks) {
                  return (
                    <div key={link.label} className="flex flex-col">
                      <div className="px-2 py-2 text-xs uppercase font-bold text-gray-400 tracking-wider mt-2">
                        {link.label}
                      </div>
                      <div className="flex flex-col gap-1 ml-2 border-l border-gray-100 pl-4">
                        {link.subLinks.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="rounded-md px-2 py-2 text-sm transition hover:bg-[#651313]/5 hover:text-[#EB4724]"
                            onClick={() => setOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                const isActive = mounted && link.href.startsWith("/") && (pathname === link.href || pathname.startsWith(link.href));

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`rounded-md px-2 py-2 transition ${isActive ? "text-[#EB4724]" : "text-[#651313]"} hover:bg-[#651313]/5`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Mobile Booking Button */}
              <Link
                href="/free-booking"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 transition text-[#651313] hover:bg-[#651313]/5 hover:text-[#EB4724] font-semibold text-left"
              >
                Free Booking
              </Link>

              {isLoggedIn ? (
                <div className="flex flex-col gap-3 mt-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between px-2 py-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#651313] text-white">
                        {user?.fullname?.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#651313]">{user?.fullname}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={hasStaffRole() ? "/dashboard" : "/user"}
                    className="w-full rounded-full bg-[#EB4724] py-2 text-center text-white font-semibold transition"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-full border border-red-100 py-2 text-center text-red-600 bg-red-50 font-semibold transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full bg-[#EB4724] px-5 py-2 text-center text-white shadow-sm transition hover:opacity-90"
                  onClick={() => setOpen(false)}
                >
                  Client Area
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
