import { useState } from "react";
import {
  FiArrowUpRight,
  FiMenu,
  FiX,
} from "react-icons/fi";

import logo from "../assets/image/logo.jpeg";

const navLinks = [
  {
    name: "Home",
    href: "#home",
  },
  {
    name: "How It Works",
    href: "#how-it-works",
  },
  {
    name: "Services",
    href: "#services",
  },
  {
    name: "For Customers",
    href: "#customers",
  },
  {
    name: "For Providers",
    href: "#providers",
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-blue-100 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* Logo */}
        <a
          href="#home"
          onClick={closeMenu}
          className="flex items-center gap-2"
        >
          <img
            src={logo}
            alt="Mavero"
            className="h-10 w-auto object-contain"
          />

          <div className="block">
            <p className="text-lg font-black tracking-tight text-[#004687]">
              MAVERO
            </p>

            <p className="-mt-1 text-[7px] font-medium uppercase tracking-[0.2em] text-gray-400">
              Professional Services
            </p>
          </div>
        </a>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[11px] font-semibold text-gray-600 transition hover:text-blue-700"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a
          href="#download"
          className="group hidden items-center gap-2 rounded-full bg-blue-900 px-5 py-3 text-[11px] font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-blue-800 md:inline-flex"
        >
          Get The App

          <FiArrowUpRight
            size={14}
            className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>

        {/* Mobile button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 text-blue-950 md:hidden"
        >
          {open ? (
            <FiX size={20} />
          ) : (
            <FiMenu size={20} />
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      <div
        className={`overflow-hidden border-t border-blue-50 bg-white transition-all duration-300 md:hidden ${
          open
            ? "max-h-[600px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <nav className="px-5 py-5">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={closeMenu}
              className="block border-b border-gray-100 py-4 text-sm font-semibold text-gray-700"
            >
              {link.name}
            </a>
          ))}

          <a
            href="#download"
            onClick={closeMenu}
            className="mt-5 flex w-fit items-center gap-2 rounded-full bg-gold-500 bg-[#004687] px-5 py-3 text-xs font-bold text-white"
          >
            Download Mavero
            <FiArrowUpRight />
          </a>
        </nav>
      </div>
    </header>
  );
}