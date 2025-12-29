import React from "react";
import ProductCard from "../../Components/ProductCard";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../lib/constant";
import { MoveRight } from "lucide-react";
import theme from "../../lib/theme";
import { useSelector } from "react-redux";

function ProductCategory({ categoryName, productType, sectionId }) {
  console.log(categoryName, productType, sectionId);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  
  // Get all products from Redux
  const allProducts = useSelector((state) => state?.products?.products || []);
  
  // Filter products by product_type dynamically
  const categoryProducts = Array.isArray(allProducts)
    ? allProducts.filter((product) => product.product_type === productType)
    : [];

  // Helper function to format category name for section ID
  const formatSectionId = (name) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  // Use provided sectionId or generate from categoryName
  const finalSectionId = sectionId || formatSectionId(categoryName);

  // Split category name for styling (e.g., "Whole Spices" -> ["Whole", "Spices"])
  const nameParts = categoryName.split(" ");
  const firstWord = nameParts[0];
  const restWords = nameParts.slice(1).join(" ");

  return (
    <section id={finalSectionId}>
      <div className="flex justify-between items-center container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase">
          <span
            className="border-b-4 pb-1"
            style={{ borderColor: theme.colors.accent.primary }}
          >
            {firstWord}
          </span>{" "}
          {restWords}
        </h1>
        {isHome && (
          <button
            className="px-4 py-2 rounded-md flex justify-center items-center gap-2 hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: theme.colors.accent.primary,
              color: theme.colors.background.main,
            }}
            onClick={() =>
              navigate(ROUTES.PRODUCTS, { state: { section: finalSectionId } })
            }
          >
            View All <MoveRight className="w-4 h-4 font-bold" />
          </button>
        )}
      </div>
      <ProductCard productsList={categoryProducts} />
    </section>
  );
}

export default ProductCategory;

