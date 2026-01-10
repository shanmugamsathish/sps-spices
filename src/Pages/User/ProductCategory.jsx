import React, { useMemo, useCallback } from "react";
import ProductCard from "../../Components/ProductCard";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../lib/constant";
import { MoveRight } from "lucide-react";
import theme from "../../lib/theme";
import { useSelector } from "react-redux";

function ProductCategory({ categoryName, productType, sectionId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  
  // Get all products from Redux
  const allProducts = useSelector((state) => state?.products?.products || []);

  const getTotalInventory = useCallback((product) => {
    if (!product?.variants || !Array.isArray(product.variants)) {
      return 0;
    }
    return product.variants.reduce((total, variant) => {
      const quantity = Number(variant?.inventory_quantity || 0);
      return total + quantity;
    }, 0);
  }, []);

  // Filter products by product_type dynamically
  const filteredProducts = useMemo(() => {
    return Array.isArray(allProducts)
      ? allProducts.filter(
          (product) =>
            product.product_type === productType &&
            product.product_type !== "Top Selling Items"
        )
      : [];
  }, [allProducts, productType]);

  const categoryProducts = useMemo(() => {
    if (!filteredProducts || filteredProducts.length === 0) return filteredProducts;
    
    const withInventory = [];
    const withoutInventory = [];
    
    filteredProducts.forEach((product) => {
      const totalInventory = getTotalInventory(product);
      if (totalInventory > 0) {
        withInventory.push(product);
      } else {
        withoutInventory.push(product);
      }
    });
    
    return [...withInventory, ...withoutInventory];
  }, [filteredProducts, getTotalInventory]);

  const formatSectionId = (name) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  const finalSectionId = sectionId || formatSectionId(categoryName);

  const nameParts = categoryName.split(" ");
  const firstWord = nameParts[0];
  const restWords = nameParts.slice(1).join(" ");

  if (!categoryProducts || categoryProducts.length === 0) {
    return null;
  }

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

