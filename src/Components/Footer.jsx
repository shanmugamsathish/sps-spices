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
import { FOOTER_TEXT } from "../lib/constant";
import { useLocation } from "react-router-dom";

function Footer() {
  const dispatch = useDispatch();
  const location = useLocation();
  const auth = [ROUTES.HOME, ROUTES.PRODUCTS].includes(location.pathname);
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userProfile = await getUserProfile();
      dispatch(setUser(userProfile));
    };
    if (auth) {
      fetchUserProfile();
    }
  }, [dispatch, auth]);
  
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
              {FOOTER_TEXT.BRAND_NAME}
            </span>
            <p>
              {FOOTER_TEXT.DESCRIPTION}
            </p>
          </div>

          {/* Useful Links */}
          <div >
            <span className="mb-4 inline-block font-semibold uppercase md:justify-start border-b border-white pb-2">
              {FOOTER_TEXT.USEFUL_LINKS.title}
            </span>
            <p className="mb-2">
              <Link to={FOOTER_TEXT.USEFUL_LINKS.links[0].link}>{FOOTER_TEXT.USEFUL_LINKS.links[0].title}</Link>
            </p>
            <p className="mb-2">
              <Link to={FOOTER_TEXT.USEFUL_LINKS.links[1].link}>{FOOTER_TEXT.USEFUL_LINKS.links[1].title}</Link>
            </p>
            <p className="mb-2">
              <Link to={FOOTER_TEXT.USEFUL_LINKS.links[2].link}>{FOOTER_TEXT.USEFUL_LINKS.links[2].title}</Link>
            </p>
            <p className="mb-2">
              <Link to={FOOTER_TEXT.USEFUL_LINKS.links[3].link}>{FOOTER_TEXT.USEFUL_LINKS.links[3].title}</Link>
            </p>
            <p className="mb-2">
              <Link to={FOOTER_TEXT.USEFUL_LINKS.links[4].link}>{FOOTER_TEXT.USEFUL_LINKS.links[4].title}</Link>
            </p>
          </div>

          {/* Contact */}
          <div>
            <span className="mb-4 inline-block font-semibold uppercase md:justify-start border-b border-white pb-2">
              {FOOTER_TEXT.CONTACT_INFO.TITLE}
            </span>
            <p className="mb-4 flex items-center justify-center md:justify-start">
              {FOOTER_TEXT.CONTACT_INFO.ADDRESS}
            </p>
            <p className="mb-4 flex items-center justify-center md:justify-start">
              {FOOTER_TEXT.CONTACT_INFO.EMAIL}
            </p>
            <p className="mb-4 flex items-center justify-center md:justify-start">
              {FOOTER_TEXT.CONTACT_INFO.PHONE}
            </p>
            {/* <p className="flex items-center justify-center md:justify-start">
              Wholesale & Retail Enquiries
            </p> */}
          </div>

          {/* Policies */}
          <div>
            <span className="mb-4 inline-block font-semibold uppercase md:justify-start border-b border-white pb-2">
              {FOOTER_TEXT.POLICIES.TITLE}
            </span>
            <p className="mb-2 cursor-pointer"><Link to={ROUTES.PRIVACY_POLICY} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{FOOTER_TEXT.POLICIES.PRIVACY_POLICY.title}</Link></p>
            <p className="mb-2 cursor-pointer"><Link to={ROUTES.TERMS_AND_CONDITION} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{FOOTER_TEXT.POLICIES.TERMS_AND_CONDITIONS.title}</Link></p>
            <div className="flex flex-col gap-2 justify-center md:justify-start my-6">
              <span>{FOOTER_TEXT.FOLLOW_US.TEXT.TITLE} <span className="font-semibold">{FOOTER_TEXT.BRAND_NAME}</span> {FOOTER_TEXT.FOLLOW_US.TEXT.TEXT_2}</span>
              <div className="flex gap-4">
              <a className="bg-red-400 hover:bg-red-400 text-white p-1 rounded-full" href={FOOTER_TEXT.FOLLOW_US.SOCIAL_MEDIA.INSTAGRAM} target="_blank" rel="noopener noreferrer">
                <FaInstagram className="w-5 h-5 " />
              </a>
              <a className="bg-green-500 hover:bg-green-600 text-white p-1 rounded-full" href={FOOTER_TEXT.FOLLOW_US.SOCIAL_MEDIA.WHATSAPP} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className="w-5 h-5 " />
              </a>
              <a className="bg-red-600 hover:bg-red-600 text-white p-1 rounded-full" href={FOOTER_TEXT.FOLLOW_US.SOCIAL_MEDIA.YOUTUBE} target="_blank" rel="noopener noreferrer">
                <FaYoutube className="w-5 h-5" />
              </a>
              <a className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full" href={FOOTER_TEXT.FOLLOW_US.SOCIAL_MEDIA.FACEBOOK} target="_blank" rel="noopener noreferrer">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full" href={FOOTER_TEXT.FOLLOW_US.SOCIAL_MEDIA.TWITTER} target="_blank" rel="noopener noreferrer">
                <FaTwitter className="w-5 h-5" />
              </a>
            </div>
            </div>

          </div>
        </div>
        {/* Copyright */}
        <div className="text-center mt-4 flex flex-col gap-2 justify-center md:justify-start">
          <div className="flex items-center justify-center ">
          <span>{FOOTER_TEXT.COPYRIGHT.TEXT.YEAR}&nbsp;</span>
          <span className="font-semibold">{FOOTER_TEXT.COPYRIGHT.TEXT.BRAND_NAME} All Rights Reserved</span>
          </div>
          <span className="font-semibold">{FOOTER_TEXT.DESIGNED_AND_DEVELOPED_BY.TEXT} <a href={FOOTER_TEXT.DESIGNED_AND_DEVELOPED_BY.LINK} target="_blank" rel="noopener noreferrer">{FOOTER_TEXT.DESIGNED_AND_DEVELOPED_BY.LINK_TEXT}</a></span>
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
