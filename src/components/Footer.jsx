import React from "react";
import { images } from "../constants/constants";
import { BiNavigation } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { FaFacebookF } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
import { SiTiktok } from "react-icons/si";
import { TfiYoutube } from "react-icons/tfi";
import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Contest", to: "/contest" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-cyan-300/15 bg-[#080d10] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr] lg:gap-14 lg:px-10 lg:py-14">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <Link to="/" aria-label="Place My Films home" className="group inline-flex items-center gap-3">
            <img src={images.logo} alt="" className="h-11 w-11 object-contain transition-transform duration-300 group-hover:scale-105" />
            <span className="text-xl font-extrabold tracking-[-0.045em] sm:text-2xl">
              PLACE <span className="text-white">MY FILMS</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
            Helping independent filmmakers bring their stories to the audiences they deserve.
          </p>
          <p className="mt-8 text-xs text-white/40">
            © {new Date().getFullYear()} Place My Films. All rights reserved.
          </p>
        </div>

        <div className="text-center md:text-left">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-white">Get in touch</h2>
          <div className="mt-5 space-y-4">
            <p className="flex items-start justify-center gap-3 text-sm leading-relaxed text-white/65 md:justify-start">
              <BiNavigation aria-hidden="true" className="mt-0.5 shrink-0 text-lg text-cyan-300" />
              <span>P.O. Box 3225<br />Rock Hill, SC 29732</span>
            </p>
            <a
              href="mailto:help@placemyfilms.com"
              className="inline-flex items-center justify-center gap-3 text-sm text-white/70 transition-colors hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 md:justify-start"
            >
              <MdEmail aria-hidden="true" className="text-lg text-cyan-300" />
              help@placemyfilms.com
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center md:col-span-2 md:flex-row md:items-start md:justify-between lg:col-span-1 lg:flex-col lg:items-start lg:justify-start">
          <div>
            <h2 className="text-center text-sm font-bold uppercase tracking-[0.18em] text-white md:text-left">Explore</h2>
            <nav aria-label="Footer navigation" className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-3 md:justify-start">
              {footerLinks.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm text-white/60 transition-colors hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-6 flex items-center gap-3 lg:mt-7">
            <a href="https://web.facebook.com/placemyfilms?_rdc=1&_rdr" target="_blank" rel="noreferrer" aria-label="Place My Films on Facebook" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/65 transition-all hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300">
              <FaFacebookF size={16} aria-hidden="true" />
            </a>
            <a href="https://www.instagram.com/placemyfilms/" target="_blank" rel="noreferrer" aria-label="Place My Films on Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/65 transition-all hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300">
              <BsInstagram size={16} aria-hidden="true" />
            </a>
            <a href="https://www.tiktok.com/@placemyfilms" target="_blank" rel="noreferrer" aria-label="Place My Films on TikTok" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/65 transition-all hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300">
              <SiTiktok size={15} aria-hidden="true" />
            </a>
            <a href="https://www.youtube.com/channel/UC6dQ8Wn_Ng5H_t2tAAjDHFg" target="_blank" rel="noreferrer" aria-label="Place My Films on YouTube" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/65 transition-all hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300">
              <TfiYoutube size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;