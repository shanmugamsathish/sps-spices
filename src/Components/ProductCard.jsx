import React from "react";
import { ShoppingCart } from "lucide-react";
import theme from "../lib/theme";
import { useLocation } from "react-router-dom";
function ProductCard({ productsList }) {
  console.log('productsList in ProductCard', productsList);
  const location = useLocation();
  const isHome = location.pathname === "/";
  
  // Ensure productsList is an array before using slice
  const productsListArray = Array.isArray(productsList) ? productsList : [];
  const productsData = isHome ? productsListArray.slice(0, 4) : productsListArray;
  
  // Helper function to format price
  const formatPrice = (price) => {
    return parseFloat(price || 0).toFixed(2);
  };

  // Helper function to get the first variant (or default variant)
  const getFirstVariant = (product) => {
    return product?.variants?.[0] || {};
  };

  // Helper function to get product image
  const getProductImage = (product) => {
    return product?.image?.src || product?.images?.[0]?.src || '';
  };

  // Helper function to check availability
  const isAvailable = (product) => {
    return product?.status === 'active' && (getFirstVariant(product)?.inventory_quantity || 0) > 0;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pt-4 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {productsData && productsData.length > 0 ? (
        productsData?.map((product) => {
          const variant = getFirstVariant(product);
          const productImage = getProductImage(product);
          const available = isAvailable(product);
          const stockQuantity = variant?.inventory_quantity || 0;
          const comparePrice = variant?.compare_at_price || variant?.price;
          const currentPrice = variant?.price;

          return (
            <div
              key={product.id}
              className="flex flex-col gap-2 sm:gap-3 rounded-md p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-shadow duration-300"
              style={{
                backgroundColor: theme.colors.background.main,
                border: `1px solid ${theme.colors.border.light}`,
                color: theme.colors.text.primary,
              }}
            >
              <img
                src={productImage}
                alt={product.title ||'Product'}
                className="w-full h-48 sm:h-56 md:h-56 lg:h-56 pb-2 object-cover rounded-md hover:scale-105 transition-all duration-300"
                style={{ borderBottom: `1px solid ${theme.colors.border.light}` }}
              />
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-center">
                {product.title}
              </h2>
              <div className="flex justify-between ">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between gap-2">
                    <span className="text-sm sm:text-base lg:text-sm font-bold ">
                      MRP:{" "}
                      {comparePrice && comparePrice !== currentPrice && (
                        <span className="text-sm sm:text-base lg:text-xs line-through">
                          ₹ {formatPrice(comparePrice)}
                        </span>
                      )}
                    </span>
                    <span className="text-sm sm:text-base lg:text-sm font-bold">
                      ₹ {formatPrice(currentPrice)}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm lg:text-md opacity-80">
                    Stock: {stockQuantity} left
                  </span>
                </div>
                <span
                  className={`text-xs sm:text-sm lg:text-md font-medium ${
                    available
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {available ? "Available" : "Out of Stock"}
                </span>
              </div>
              <button
                className="glow-button px-4 py-2 rounded-md flex justify-center items-center gap-2 hover:opacity-90 transition-opacity relative z-10"
                style={{
                  backgroundColor: theme.colors.accent.primary,
                  color: theme.colors.background.main,
                }}
              >
                <ShoppingCart className="w-4 h-4 font-bold relative z-10" />
                <span className="relative z-10">Add to Cart</span>
              </button>
            </div>
          );
        })
      ) : (
        <div className="flex flex-col justify-center items-center h-screen w-screen">
          <p className="text-center opacity-80">Loading...</p>
        </div>
      )}
    </div>
  );
}

export default ProductCard;
