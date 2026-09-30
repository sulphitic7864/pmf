import React from "react";
import { images } from "../constants/constants";
import { BiNavigation } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { FaFacebookF } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
import { TfiYoutube } from "react-icons/tfi";

const Footer = () => {
  return (
    <div className="w-full lg:h-72 grid gap-5 md:gap-0 sm:grid-cols-2 lg:grid-cols-3 md:px-32 py-10" style={{ backgroundColor: "rgba(18,18,18,1)" }}>
      {/* Logo Section */}
      <div className="w-full h-full flex flex-col items-center md:items-start justify-between pt-10">
        <img src={images.logo} alt="logo" className="w-16" />
        <h1 className="text-white text-sm">
          &copy; 2021 Place My Films. All Rights Reserved
        </h1>
      </div>

      {/* Contact Information Section */}
      <div className="text-white text-center flex flex-col gap-4 justify-center">
        <h1 className="text-3xl font-bold">Contact Information</h1>
        <h2 className="flex items-center justify-center text-md gap-1">
          <BiNavigation /> P.O. Box 3225 Rock Hill, SC 29732
        </h2>
        <a
          href="mailto:help@placemyfilms.com"
          className="flex items-center justify-center gap-1 underline text-md"
        >
          <MdEmail /> help@placemyfilms.com
        </a>
      </div>

      {/* Links and Social Media Section */}
      <div className="flex flex-col justify-between items-center md:items-end pt-12">
        <div className="flex flex-wrap md:flex-nowrap md:justify-end gap-4 md:w-2/3">
          {["Home", ["About", "Us"], "Pricing", "Blog", ["Contact", "Us"]].map(
            (route, index) => (
              <a
                key={index}
                href={
                  Array.isArray(route)
                    ? route[0] === "About"
                      ? "/about"
                      : "/contact"
                    : route === "Home"
                    ? "/"
                    : route === "Pricing"
                    ? "/pricing"
                    : "/blog"
                }
                className="text-white text-md underline cursor-pointer hover:text-gray-400 transition-colors"
              >
                {Array.isArray(route) ? (
                  <div className="text-center">
                    <span className="block">{route[0]}</span>
                    <span className="block">{route[1]}</span>
                  </div>
                ) : (
                  route
                )}
              </a>
            )
          )}
        </div>

        {/* Social Media Icons */}
        <div className="flex pt-5 justify-center md:justify-end gap-3">
          <FaFacebookF
            size={20}
            className="text-white cursor-pointer hover:text-gray-400 transition-colors"
            onClick={() =>
              window.open(
                "https://web.facebook.com/placemyfilms?_rdc=1&_rdr",
                "_blank"
              )
            }
          />
          <BsInstagram
            size={20}
            className="text-white cursor-pointer hover:text-gray-400 transition-colors"
            onClick={() =>
              window.open(
                "https://www.instagram.com/placemyfilms/",
                "_blank"
              )
            }
          />
          <TfiYoutube
            size={20}
            className="text-white cursor-pointer hover:text-gray-400 transition-colors"
            onClick={() =>
              window.open(
                "https://www.youtube.com/channel/UC6dQ8Wn_Ng5H_t2tAAjDHFg",
                "_blank"
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;