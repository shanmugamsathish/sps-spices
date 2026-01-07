import React, { useState, useEffect } from "react";
import { BsWhatsapp } from "react-icons/bs";
import { FOOTER_TEXT } from "../lib/constant";

const WhatsApp = () => {
  const whatsappLink = FOOTER_TEXT.FOLLOW_US.SOCIAL_MEDIA.WHATSAPP;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-25 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
      >
            <BsWhatsapp size={28} />
        </a>
      )}
    </>
  );
};

export default WhatsApp;
