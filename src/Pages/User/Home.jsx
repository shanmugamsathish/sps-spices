import React, { useEffect, useCallback } from "react";
import { getAllProducts } from "../../apiCalls/products";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../redux/productSlice";
import ProductCategory from "./ProductCategory";
import Collections from "./Collections";
import RecentProducts from "./RecentProducts";
import Contact from "./Contact";
import WhyChooseUs from "./WhyChooseUs";
import { setLoading } from "../../redux/loaderSlice";
import toast from "react-hot-toast";
import theme from "../../lib/theme";
import HeroSection from "./HeroSection";
import { TITLES } from "../../lib/constant";
import Reviews from "./Reviews";
import { Smile, Clock, Folder, ShoppingBag } from "lucide-react";
import ProductCard from "../../Components/ProductCard";

function Home() {
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state?.products?.products || []);

  const fetchProducts = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const products = await getAllProducts();
      dispatch(setProducts(products));
    } catch (error) {
      toast.error(`${error.message || "Error fetching products"}`);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Get unique product types dynamically
  const getUniqueProductTypes = () => {
    if (!Array.isArray(allProducts) || allProducts.length === 0) {
      return [];
    }
    const types = [
      ...new Set(allProducts.map((product) => product.product_type)),
    ];
    return types.filter((type) => type);
  };

  const productTypes = getUniqueProductTypes();

  return (
    <div>
      <HeroSection />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase text-center mb-4 flex items-center justify-center gap-2 ">
          <ShoppingBag
            className="text-white w-8 h-8 animate-pulse rounded-full p-1.5"
            style={{ backgroundColor: theme.colors.accent.primary }}
          />
          <div>
            <span>Our </span>
            <span
              style={{
                borderBottom: `4px solid ${theme.colors.accent.primary}`,
              }}
            >
              Prod
            </span>
            <span>ucts</span>
          </div>
        </div>
      </div>
      {allProducts.length === 0 ? (
        <ProductCard productsList={[]} />
      ) : (
        productTypes.map((productType) => (
          <ProductCategory
            key={productType}
            categoryName={productType}
            productType={productType}
            sectionId={productType.toLowerCase().replace(/\s+/g, "-")}
          />
        ))
      )}
      {/* border-b-2 border-gray-200 */}
      <div className="border-b-2 border-gray-200 my-4"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-6">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase text-center flex items-center justify-center gap-2 ">
          <Folder
            className="text-white w-8 h-8 animate-pulse rounded-full p-1"
            style={{ backgroundColor: theme.colors.accent.primary }}
          />
          <div>
            <span>Col</span>
            <span
              style={{
                borderBottom: `4px solid ${theme.colors.accent.primary}`,
              }}
            >
              lecti
            </span>
            <span>ons</span>
          </div>
        </div>
      </div>
      <Collections />
      <div className="border-b-2 border-gray-200 my-4"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-6">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase text-center mb-4 flex items-center justify-center gap-2 ">
          <Clock
            className="text-white w-8 h-8 animate-pulse rounded-full "
            style={{ backgroundColor: theme.colors.accent.primary }}
          />

          <div>
            <span>Lates</span>
            <span
              style={{
                borderBottom: `4px solid ${theme.colors.accent.primary}`,
              }}
            >
              t Prod
            </span>
            <span>ucts</span>
          </div>
        </div>
      </div>
      <RecentProducts />
      <div className="border-b-2 border-gray-200 my-4"></div>
      <WhyChooseUs />
      <div className="py-4 bg-black sm:py-6 lg:py-8 mt-4 sm:mt-6 lg:mt-8">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase text-center my-8 text-white flex items-center justify-center gap-2 ">
          <Smile
            className="text-white w-8 h-8 animate-pulse rounded-full "
            style={{ backgroundColor: theme.colors.accent.primary }}
          />
          <div>
            <span>Happy Cu</span>
            <span className="border-b-4 border-b-white pb-2">stome</span>
            <span>rs Review</span>
          </div>
        </div>
        <Reviews />
      </div>
      <Contact />
    </div>
  );
}

export default Home;
