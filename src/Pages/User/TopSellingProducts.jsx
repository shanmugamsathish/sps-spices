import React, { useState, useEffect, useCallback } from "react";
import { Loader2Icon, ShoppingCart, Trash2 } from "lucide-react";
import { getMarketplaceProducts } from "../../apiCalls/products";
import ProductCardShimmer from "../../Components/ProductCardShimmer";
import theme from "../../lib/theme";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { deleteMarketplaceProduct } from "../../apiCalls/products";
import toast from "react-hot-toast";
import DialogBox from "../../Components/DialogBox";
import { setLoading } from "../../redux/loaderSlice";

function TopSellingProducts({ marketplace = "amazon" }) {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const isLoadingState = useSelector((state) => state.loader.isLoading);
  const location = useLocation();
  const isAdmin = location.pathname.includes("/admin");
  const isHome = location.pathname === "/";
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  // When home page show 8 products else all products are shown
  const productsToShow = isHome ? products.slice(0, 4) : products;

  // Helper function to check if product belongs to the specified marketplace
  const isProductFromMarketplace = (product, marketplaceType) => {
    if (!product.originalURL) return false;
    const url = product.originalURL.toLowerCase();

    if (marketplaceType === "amazon") {
      return url.includes("amazon.in") || url.includes("amzn.to");
    } else if (marketplaceType === "flipkart") {
      return url.includes("flipkart.com");
    }
    return true;
  };

  const handleGetProducts = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await getMarketplaceProducts("amazon");
      const allProducts = Array.isArray(response) ? response : [];

      const filteredProducts = allProducts.filter((product) =>
        isProductFromMarketplace(product, marketplace)
      );

      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch products";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }, [marketplace, dispatch]);

  useEffect(() => {
    handleGetProducts();
  }, [handleGetProducts]);

  const handleAddToCart = (product) => {
    if (product.originalURL) {
      window.open(product.originalURL, "_blank");
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      toast.error("Product ID not found. Cannot delete product.");
      return;
    }

    try {
      setDeletingId(id);
      const response = await deleteMarketplaceProduct(id);

      if (response.success) {
        toast.success("Product deleted successfully!");
        // Refresh the product list
        await handleGetProducts();
        setIsDialogOpen(false);
        setProductToDelete(null);
      } else {
        toast.error(response.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete product";
      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const shouldShowShimmer = isLoadingState;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {productsToShow.length === 0 && (
        <div className="w-full h-full flex flex-col items-center justify-center">
    <Loader2Icon className="w-4 h-4 animate-spin" />
    <p className="text-sm">Loading...</p>
</div>

      )}
      {!shouldShowShimmer && productsToShow.length === 0 && (
        <div className="w-full text-center py-12">
          <p
            className="text-lg font-semibold"
            style={{ color: theme.colors.text.secondary }}
          >
            No products found
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {shouldShowShimmer
          ? Array.from({ length: 4 }).map((_, index) => (
              <ProductCardShimmer key={`shimmer-${index}`} />
            ))
          : productsToShow.map((product, index) => (
              <div
                key={product.id || `product-${index}`}
                className="flex flex-col gap-2 sm:gap-3 rounded-md p-3 sm:p-4 lg:p-5 transition-shadow duration-300 shadow-lg"
                style={{
                  backgroundColor: theme.colors.background.main,
                  border: `1px solid ${theme.colors.border.light}`,
                  color: theme.colors.text.primary,
                }}
              >
                {/* Product Image */}
                <div
                  className="relative w-full h-48 sm:h-56 md:h-56 lg:h-56 overflow-hidden rounded-md cursor-pointer group"
                  style={{
                    borderBottom: `1px solid ${theme.colors.border.light}`,
                  }}
                >
                  {/* Delete Button - Only show for admin */}
                  {isAdmin && product.id && (
                    <button
                      className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600/80 p-1.5 rounded-full shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProductToDelete(product);
                        setIsDialogOpen(true);
                      }}
                      disabled={deletingId === product.id}
                      title="Delete product"
                    >
                      {deletingId === product.id ? (
                        <Loader2Icon
                          size={18}
                          className="text-white animate-spin"
                        />
                      ) : (
                        <Trash2
                          size={18}
                          className="text-white hover:text-white/80 transition-colors duration-300 cursor-pointer font-bold"
                        />
                      )}
                    </button>
                  )}

                  <img
                    src={product.image || ""}
                    alt={product.title || "Product"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x300?text=No+Image";
                    }}
                  />
                </div>

                {/* Product Title */}
                <div className="flex items-center justify-center h-14 text-center border-b border-gray-200 pb-2">
                  <h2
                    className="text-base sm:text-lg lg:text-xl font-semibold cursor-pointer line-clamp-2"
                    style={{
                      color: theme.colors.text.primary,
                    }}
                  >
                    {product.title}
                  </h2>
                </div>

                {/* Price */}
                <div className="text-center">
                  <span
                    className="text-lg sm:text-xl lg:text-lg font-bold"
                    style={{
                      color: theme.colors.text.primary,
                    }}
                  >
                    {product.price || "₹0.00"}
                  </span>
                </div>

                {/* Add to Cart Button */}
                {!isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="glow-button px-4 py-2 rounded-md flex justify-center items-center gap-2 hover:opacity-90 transition-opacity relative z-10 cursor-pointer"
                    style={{
                      backgroundColor: theme.colors.accent.primary,
                      color: theme.colors.background.main,
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 font-bold relative z-10" />
                    <span className="relative z-10">Add to Cart</span>
                  </button>
                )}
              </div>
            ))}
      </div>
      <DialogBox
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Delete Product"
        description={`Are you sure you want to delete "${productToDelete?.title}"?`}
        onConfirm={() => handleDelete(productToDelete.id)}
      />
    </div>
  );
}

export default TopSellingProducts;
