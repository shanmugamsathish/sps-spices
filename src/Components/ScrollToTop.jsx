import React, { useState, useEffect } from "react";
import { ArrowUpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import theme from "../lib/theme";

const ScrollToTop = () => {
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={scrollToTop}
          aria-label="Scroll to Top"
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 animate-bounce"
          style={{
            backgroundColor: theme.colors.text.primary,
            color: "#FFFFFF",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.accent.hover || theme.colors.accent.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.text.primary;
          }}
        >
          <ArrowUpCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;