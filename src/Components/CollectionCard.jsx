import React from "react";
import { ArrowRight, ShoppingCart } from "lucide-react";
import theme from "../lib/theme";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../lib/constant";

function CollectionCard({ collectionsList }) {
  const navigate = useNavigate();

  // Ensure collectionsList is an array
  const collectionsListArray = Array.isArray(collectionsList)
    ? collectionsList
    : [];

  // Helper function to get collection image
  const getCollectionImage = (collection) => {
    if (collection?.image?.src) {
      return collection.image.src;
    }
    return null;
  };

  // Helper function to get product count
  const getProductCount = (collection) => {
    if (collection?.collects && Array.isArray(collection.collects)) {
      return collection.collects.length;
    }
    return 0;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  lg:gap-8 py-4 sm:py-4 lg:py-4 container mx-auto px-4 sm:px-6 lg:px-8 ">
      {collectionsListArray.map((collection) => {
        const collectionImage = getCollectionImage(collection);
        const productCount = getProductCount(collection);

        return (
          <div
            key={collection.id}
            className="flex flex-col gap-3 rounded-md p-3 sm:p-4 lg:p-5 transition-shadow duration-300 shadow-lg hover:shadow-xl"
            style={{
              backgroundColor: theme.colors.background.main,
              border: `1px solid ${theme.colors.border.light}`,
              color: theme.colors.text.primary,
            }}
          >
            {/* Collection Image */}
            <div
              className="relative w-full h-48 sm:h-56 md:h-56 lg:h-56 overflow-hidden rounded-md"
              style={{ borderBottom: `1px solid ${theme.colors.border.light}` }}
            >
              {collectionImage ? (
                <img
                  src={collectionImage}
                  alt={collection.title || "Collection"}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: theme.colors.border.light }}
                >
                  <span style={{ color: theme.colors.text.secondary }}>
                    No Image
                  </span>
                </div>
              )}
            </div>

            {/* Collection Title */}
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-center min-h-12">
              {collection.title || "Untitled Collection"}
            </h2>

            {/* Collection Description */}
            {collection.body_html && (
              <p
                className="text-sm line-clamp-2"
                style={{ color: theme.colors.text.secondary }}
              >
                {collection.body_html.replace(/<[^>]*>/g, "").substring(0, 100)}
                {collection.body_html.replace(/<[^>]*>/g, "").length > 100 &&
                  "..."}
              </p>
            )}

            {/* Product Count */}
            <p className="text-xs sm:text-sm opacity-80">
              {productCount} {productCount === 1 ? "Product" : "Products"}
            </p>

            {/* Explore Button */}
            <button
              onClick={() => {
                navigate(`${ROUTES.COLLECTION_PRODUCTS}/${collection.id}`, {
                  state: { collection },
                });
                window.scrollTo(0, 0);
              }}
              className="glow-button px-4 py-2 rounded-md flex justify-center items-center gap-2 hover:opacity-90 transition-opacity relative z-10"
              style={{
                backgroundColor: theme.colors.accent.primary,
                color: theme.colors.background.main,
              }}
            >
              <span>Explore the products</span>
              <ArrowRight className="w-4 h-4 font-bold" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default CollectionCard;
