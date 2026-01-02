import React, { useEffect } from "react";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import theme from "../lib/theme";
import { Link } from "react-router-dom";
import { ROUTES } from "../lib/constant";
import { getUserProfile } from "../apiCalls/users";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";


function Footer() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userProfile = await getUserProfile();
      dispatch(setUser(userProfile));
    };
    fetchUserProfile();
  }, [dispatch]);
  return (
    <footer
      className="text-center lg:text-left"
      style={{
        backgroundColor: theme.colors.accent.primary,
        color: theme.colors.background.main,
      }}
    >

      {/* Main Footer Content */}
      <div className="px-25 py-4 text-center md:text-left">
        <div className="grid-1 grid gap-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <span className="mb-4 inline-block font-semibold uppercase md:justify-start border-b border-white pb-2">
              SPS SPICES AND DRY FRUITS
            </span>
            <p>
              Pure, aromatic spices and nutrient-rich dry fruits. Sourced with
              quality, packed with freshness.
            </p>
          </div>

          {/* Useful Links */}
          <div >
            <span className="mb-4 inline-block font-semibold uppercase md:justify-start border-b border-white pb-2">
              Useful Links
            </span>
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
            <span className="mb-4 inline-block font-semibold uppercase md:justify-start border-b border-white pb-2">
              Contact
            </span>
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
            <span className="mb-4 inline-block font-semibold uppercase md:justify-start border-b border-white pb-2">
              Policies
            </span>
            <p className="mb-2 cursor-pointer"><Link to={ROUTES.PRIVACY_POLICY} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Privacy Policy</Link></p>
            <p className="mb-2 cursor-pointer"><Link to={ROUTES.TERMS_AND_CONDITION} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Terms & Conditions</Link></p>
            <div className="flex flex-col gap-2 justify-center md:justify-start my-6">
              <span>Follow <span className="font-semibold">SPS SPICES AND DRY FRUITS</span> on social networks:</span>
              <div className="flex gap-4">
              <a href="https://www.instagram.com/sps_spices/" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="w-6 h-6" />
              </a>
              <a href="https://wa.me/917092597277" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className="w-6 h-6" />
              </a>
              <a href="https://www.youtube.com/@spsspices" target="_blank" rel="noopener noreferrer">
                <FaYoutube className="w-6 h-6" />
              </a>
              <a href="https://www.facebook.com/spsspices" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="w-6 h-6" />
              </a>
              <a href="https://www.twitter.com/spsspices" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="w-6 h-6" />
              </a>
            </div>
            </div>

          </div>
        </div>
        {/* Copyright */}
        <div className="text-center mt-4 flex flex-col gap-2 justify-center md:justify-start">
          <div className="flex items-center justify-center ">
          <span>© 2025&nbsp;</span>
          <span className="font-semibold">spsspicesanddryfruits. All Rights Reserved</span>
          </div>
          <span className="font-semibold">Designed and Developed by <a href="https://pragantechnologies.com" target="_blank" rel="noopener noreferrer">Pragan Tech Solutions</a></span>
        </div>
      </div>

      {/* Offer Banner */}
      {/* <div
        className="p-6 text-center"
      >
        <span>
          Use Code <strong>"012546"</strong> – Free shipping on orders above
          ₹1500
        </span>
      </div> */}
    </footer>
  );
}

export default Footer;
