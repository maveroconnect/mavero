import {
  FiArrowUpRight,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiPhone,
  FiTwitter,
} from "react-icons/fi";

import AppDownload from "./AppDownload";
import logo from "../assets/image/logo.jpeg";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">

      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">

        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.7fr_0.7fr_1fr]">

          {/* Brand */}
          <div>

            <div className="flex items-center gap-2">

              <img
                src={logo}
                alt="Mavero"
                className="h-11 w-auto object-contain"
              />

              <div>
                <p className="text-xl font-black">
                  MAVERO
                </p>

                <p className="text-[7px] uppercase tracking-[0.2em] text-blue-300">
                  Professional Services
                </p>
              </div>

            </div>

            <p className="mt-6 max-w-sm text-xs leading-6 text-blue-200">
              Mavero connects customers with professional
              service providers, making it easier to find
              the right person for the job.
            </p>

            <div className="mt-7 flex gap-2">

              {[
                <FiFacebook />,
                <FiInstagram />,
                <FiLinkedin />,
                <FiTwitter />,
              ].map((icon, index) => (

                <a
                  key={index}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-blue-200 transition hover:border-[#C9A227] hover:text-[#C9A227]"
                >
                  {icon}
                </a>

              ))}

            </div>

          </div>


          {/* Platform */}
          <div>

            <h3 className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A227]">
              Platform
            </h3>

            <div className="space-y-3">

              <a
                href="#home"
                className="block text-xs text-blue-200 hover:text-white"
              >
                Home
              </a>

              <a
                href="#how-it-works"
                className="block text-xs text-blue-200 hover:text-white"
              >
                How It Works
              </a>

              <a
                href="#services"
                className="block text-xs text-blue-200 hover:text-white"
              >
                Services
              </a>

              <a
                href="#customers"
                className="block text-xs text-blue-200 hover:text-white"
              >
                For Customers
              </a>

              <a
                href="#providers"
                className="block text-xs text-blue-200 hover:text-white"
              >
                For Providers
              </a>

            </div>

          </div>


          {/* Company */}
          <div>

            <h3 className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A227]">
              Company
            </h3>

            <div className="space-y-3">

              <a
                href="#about"
                className="block text-xs text-blue-200 hover:text-white"
              >
                About Mavero
              </a>

              <a
                href="#testimonials"
                className="block text-xs text-blue-200 hover:text-white"
              >
                Testimonials
              </a>

              <a
                href="#"
                className="block text-xs text-blue-200 hover:text-white"
              >
                Privacy Policy
              </a>

              <a
                href="#"
                className="block text-xs text-blue-200 hover:text-white"
              >
                Terms of Service
              </a>

            </div>

          </div>


          {/* App */}
          <div>

            <h3 className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A227]">
              Get The App
            </h3>

            <p className="mb-5 text-xs leading-6 text-blue-200">
              Download Mavero and discover a simpler way
              to connect with professional service providers.
            </p>

            <AppDownload />

          </div>

        </div>


        {/* Bottom */}
        <div className="mt-14 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-[9px] text-blue-300 sm:flex-row">

          <p>
            © 2026 Mavero. All rights reserved.
          </p>

          <p>
            Connecting people. Connecting services.
          </p>

        </div>

      </div>

    </footer>
  );
}