import React from "react";
import { Instagram } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import theme from "../lib/theme";

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
          <span>Follow SPS – Spices & Dry Fruits on social networks:</span>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/spsspices"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: theme.colors.text.primary }}
          >
            <Instagram className="w-6 h-6" />
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919XXXXXXXXX"
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
        <div className="grid-1 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <h6 className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
              SPS – Spices & Dry Fruits
            </h6>
            <p>
              Authentic spices and premium dry fruits crafted with purity and
              tradition. Bringing the true taste of heritage to your kitchen.
            </p>
          </div>

          {/* Products */}
          <div>
            <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
              Our Products
            </h6>
            <p className="mb-4">Whole Spices</p>
            <p className="mb-4">Powdered Spices</p>
            <p className="mb-4">Dry Fruits & Nuts</p>
            <p>Combo & Gift Packs</p>
          </div>

          {/* Useful Links */}
          <div>
            <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
              Useful Links
            </h6>
            <p className="mb-4">Shop Online</p>
            <p className="mb-4">About Us</p>
            <p className="mb-4">Quality Promise</p>
            <p>Bulk Orders</p>
          </div>

          {/* Contact */}
          <div>
            <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
              Contact
            </h6>
            <p className="mb-4 flex items-center justify-center md:justify-start">
              Chennai, Tamil Nadu, India
            </p>
            <p className="mb-4 flex items-center justify-center md:justify-start">
              support@spsspices.com
            </p>
            <p className="mb-4 flex items-center justify-center md:justify-start">
              +91 9XXXXXXXXX (WhatsApp)
            </p>
            <p className="flex items-center justify-center md:justify-start">
              Wholesale & Retail Enquiries
            </p>
          </div>

          {/* Copyright */}
          <div className="flex">
            <span>© 2025&nbsp;</span>
            <span className="font-semibold">
              SPS – Spices & Dry Fruits
            </span>
          </div>
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
          Use Code <strong>"012546"</strong> – Free shipping on orders above ₹1500
        </span>
      </div>
    </footer>
  );
}

export default Footer;
