import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../lib/constant";
import theme from "../../lib/theme";
import { getBannerImages } from "../../apiCalls/bannerImage";
import { setLoading } from '../../redux/loaderSlice'
import { useDispatch } from 'react-redux'

function HeroSection() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [bannerImages, setBannerImages] = useState([]);
  const images = bannerImages[0]?.images || [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        images.length ? (prevIndex + 1) % images.length : 0
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleShopSpices = () => {
    navigate(ROUTES.PRODUCTS);
    window.scrollTo(0, 0);
  };

  const handleShopDryFruits = () => {
    navigate(ROUTES.PRODUCTS);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const fetchBannerImages = async () => {
      try {
        dispatch(setLoading(true));
        const response = await getBannerImages();
        if (response) {
          setBannerImages(response.products);
          dispatch(setLoading(false));
        } else {
          console.error("Error fetching banner images:", response.message);
          dispatch(setLoading(false));
        }
      } catch (error) {
        console.error("Error fetching banner images:", error);
        dispatch(setLoading(false));
      }
    };
    fetchBannerImages();
  }, []);

  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] md:h-[80vh] overflow-hidden">
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={image.src}
              alt={`Hero ${index + 1}`}
              className="w-full h-full object-cover"
            />

            <div
              className="absolute inset-0 bg-black/40"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
            />
          </div>
        ))}
      </div>

      <div className="relative z-30 h-full flex flex-col items-center justify-between px-4 sm:px-6 md:px-8 text-center">
        <div className="mt-auto mb-20 flex flex-col sm:flex-row gap-4 sm:gap-6">
          <button
            onClick={handleShopSpices}
            className="glow-button px-8 py-4 sm:px-10 sm:py-4 md:px-12 md:py-5 rounded-lg text-base sm:text-lg md:text-xl font-semibold shadow-2xl hover:scale-105 transition-transform duration-300"
            style={{
              backgroundColor: theme.colors.accent.primary,
              color: theme.colors.background.main,
            }}
          >
            Shop Spices
          </button>

          <button
            onClick={handleShopDryFruits}
            className="px-8 py-4 sm:px-10 sm:py-4 md:px-12 md:py-5 rounded-lg text-base sm:text-lg md:text-xl font-semibold shadow-2xl hover:scale-105 transition-all duration-300 border-2"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              color: theme.colors.text.primary,
              borderColor: theme.colors.accent.primary,
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
              e.target.style.color = theme.colors.text.primary;
            }}
          >
            Shop Dry Fruits
          </button>
        </div>
      </div>

      {/* Image Indicators (Optional) */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroSection;
