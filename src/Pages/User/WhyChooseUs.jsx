import React from "react";
import theme from "../../lib/theme";
import logo from "../../assets/LOGO sps bg.png";

function WhyChooseUs() {
  return (
    <div>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-6'>

        <div className="text-center mb-8">
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase"
            style={{ color: theme.colors.text.primary }}
          >
            Why Choose Us
          </h2>

          <p
            className="text-base sm:text-lg max-w-2xl mx-auto mt-3"
            style={{ color: theme.colors.text.secondary }}
          >
            Premium-quality ingredients, processed with care to deliver pure,
            authentic taste in every pack.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 lg:gap-10 items-center max-w-4xl mx-auto">

          <div className="flex justify-center">
            <img
              src={logo}
              alt="SPS Logo"
              className="w-52 sm:w-60 lg:w-72"
            />
          </div>

          <div className="space-y-4">

            {[
              "Premium-grade ingredients",
              "Authentic, balanced flavors",
              "Hygienic processing standards",
              "Freshness-first packaging",
              "Trusted by discerning cooks",
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">

                <span
                  className="w-3 h-3 rounded-full mt-2"
                  style={{ backgroundColor: theme.colors.accent.primary }}
                />

                <p
                  className="text-base sm:text-lg leading-relaxed"
                  style={{ color: theme.colors.text.primary }}
                >
                  {item}
                </p>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}

export default WhyChooseUs;
