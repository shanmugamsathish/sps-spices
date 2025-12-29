import React from "react";
import { Instagram } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import theme from "../lib/theme";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      className="text-center lg:text-left"
      style={{
        backgroundColor: theme.colors.background.main,
        color: theme.colors.text.primary,
      }}
    >
      {/* Top Social Bar */}
      <div
        className="flex gap-4 items-center justify-start border-b-2 px-25 py-4"
        style={{ borderColor: theme.colors.border.light }}
      >
        <div className=" hidden lg:block">
          <span>Follow SPS SPICES AND DRY FRUITS on social networks:</span>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/sps_spices/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: theme.colors.text.primary }}
          >
            <Instagram className="w-6 h-6" />
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/917092597277"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: theme.colors.text.primary }}
          >
            <FaWhatsapp className="w-6 h-6" />
          </a>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="px-25 py-4 text-center md:text-left">
        <div className="grid-1 grid gap-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h6 className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
              SPS SPICES AND DRY FRUITS
            </h6>
            <p>
              Pure, aromatic spices and nutrient-rich dry fruits. Sourced with
              quality, packed with freshness.
            </p>
          </div>

          {/* Useful Links */}
          <div >
            <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
              Useful Links
            </h6>
            <p className="mb-2">
              <Link to="/">Home</Link>
            </p>
            <p className="mb-2">
              <Link to="/about">About Us</Link>
            </p>
            <p className="mb-2">
              <Link to="/products">Products</Link>
            </p>
            <p className="mb-2">
              <Link to="/collections">Collections</Link>
            </p>
            <p className="mb-2">
              <Link to="/contact">Contact Us</Link>
            </p>
          </div>

          {/* Contact */}
          <div>
            <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
              Contact
            </h6>
            <p className="mb-4 flex items-center justify-center md:justify-start">
              C2 NAAZYAS ARCADE 4th Main Road Maharaja Nagar Palayamkottai -
              627011
            </p>
            <p className="mb-4 flex items-center justify-center md:justify-start">
              spsspices@zohomail.in
            </p>
            <p className="mb-4 flex items-center justify-center md:justify-start">
              +91 7092597277 (WhatsApp)
            </p>
            {/* <p className="flex items-center justify-center md:justify-start">
              Wholesale & Retail Enquiries
            </p> */}
          </div>

          {/* Policies */}
          <div>
            <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
              Policies
            </h6>
            <p className="mb-2">Privacy Policy </p>
            <p className="mb-2">Terms & Conditions</p>
          </div>
        </div>
        {/* Copyright */}
        <div className="text-center mt-4">
          <span>© 2025&nbsp;</span>
          <span className="font-semibold">spsspices. All Rights Reserved.</span>
        </div>
      </div>

      {/* Offer Banner */}
      <div
        className="p-6 text-center"
        style={{
          backgroundColor: theme.colors.accent.primary,
          color: theme.colors.background.main,
        }}
      >
        <span>
          Use Code <strong>"012546"</strong> – Free shipping on orders above
          ₹1500
        </span>
      </div>
    </footer>
  );
}

export default Footer;
