import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import theme from "../../lib/theme"
import WhyChooseUs from "./WhyChooseUs";
import Contact from "./Contact";
import { ABOUT_US, ABOUT_US_IMAGES } from "../../lib/constant";

const AboutUs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="w-full bg-neutral-50">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
      >
        <motion.div variants={itemVariants}>
          <p className="text-sm tracking-widest uppercase font-bold mb-3" style={{color: theme.colors.accent.primary}}>
            {ABOUT_US.TITLE}
          </p>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight " style={{color: theme.colors.text.primary}}>
            {ABOUT_US.SUB_TITLE.TEXT} <span style={{color: theme.colors.accent.primary}}>{ABOUT_US.SUB_TITLE.TEXT_2}.</span> <span style={{color: theme.colors.text.primary}}>{ABOUT_US.SUB_TITLE.TEXT_3}.</span>
          </h1>

          <p className="mt-5 text-neutral-700 text-base sm:text-lg leading-relaxed">
            {ABOUT_US.DESCRIPTION1}
          </p>

          <p className="mt-4 text-neutral-700 text-base sm:text-lg leading-relaxed">
            {ABOUT_US.DESCRIPTION2}
          </p>

          {/* <div className="mt-6 p-4 rounded-2xl bg-white shadow-lg border border-neutral-200">
            <p className="text-sm sm:text-base font-semibold text-neutral-900">
              <span className="font-bold" style={{color: theme.colors.accent.primary}}>Premium Quality</span> • <span className="font-bold" style={{color: theme.colors.text.primary}}>Freshly Packed</span> • <span className="font-bold" style={{color: theme.colors.accent.primary}}>Majestic Masala</span> • <span className="font-bold" style={{color: theme.colors.text.primary}}>Dry Fruits</span>
            </p> 
          </div> */}
        </motion.div>

        <motion.div variants={itemVariants} className="relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-neutral-200">
            <img
              src={ABOUT_US_IMAGES.ABOUT_US_IMAGE}
              alt="Premium Spices & Dry Fruits"
              className="w-full h-[320px] sm:h-[380px] lg:h-[460px] object-cover"
            />
          </div>

          <motion.div whileHover={{ scale: 1.02 }} className="absolute -bottom-6 -right-4 shadow-xl rounded-2xl px-4 py-3 border border-gray-400" style={{backgroundColor: theme.colors.accent.primary}}>
            <p className="text-sm font-bold text-white">
            {ABOUT_US.TRUST_LINE}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 ">
          <WhyChooseUs />
        </div>
      </div>

      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 ">
          <Contact />
        </div>
      </div>

    </section>
  );
};

export default AboutUs;
