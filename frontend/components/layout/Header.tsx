"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, User, LogOut, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { isAuthenticated, getUser, clearAuth, isAdmin, isManager, isAdminOrManager } from "@/utils/auth";
import { logout as apiLogout } from "../../api-client/authApi";
import { getActiveAnnouncements, Announcement } from "../../api-client/announcementApi";
import { Megaphone, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Hosting", href: "/hosting" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
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
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [activeAnnouncement, setActiveAnnouncement] = useState<Announcement | null>(null);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    const userData = getUser();
    if (userData) {
      setUser(userData);
      setIsAdminUser(isAdmin());
      setIsStaff(isAdminOrManager());
    } else {
      setUser(null);
      setIsAdminUser(false);
      setIsStaff(false);
    }

    const fetchAnnouncement = async () => {
      try {
        const res = await getActiveAnnouncements();
        if (res.data?.success && res.data?.data?.length > 0) {
          // Get the latest active announcement
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

  // Re-check auth status when pathname changes (e.g., after login/logout)
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    const userData = getUser();
    if (userData) {
      setUser(userData);
      setIsAdminUser(isAdmin());
      setIsStaff(isAdminOrManager());
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
    setShowProfileDropdown(false);
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 shadow-sm transition-all duration-300">
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
      {/* Top bar logic... */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-3 bg-[#651313] py-1.5 text-sm font-medium text-white sm:px-6 md:gap-6 md:py-2 md:text-base leading-tight">
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
          <span className="hidden sm:inline">|</span>
          <Link
            href="/careers"
            className="transition hover:text-[#EB4724]"
          >
            Career
          </Link>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-white/20 bg-white/95 backdrop-blur-sm shadow-sm sm:px-6">
        <div className="mx-auto max-w-7xl px-4 md:px-6 h-[70px] md:h-[95px] flex items-center justify-between">

          {/* Logo - Left */}
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

          {/* Navigation - Center */}
          <nav className="hidden md:flex gap-8 font-semibold text-[#651313] pr-22">
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
          <div className="hidden md:flex items-center gap-6 pr-25">
            {/* Shopping Cart - Only show when logged in */}
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
                href={"/dashboard"}
                className="rounded-full bg-[#EB4724] px-6 py-2.5 font-semibold text-white transition hover:opacity-90"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-[#EB4724] px-6 py-2.5 font-semibold text-white transition hover:opacity-90"
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

