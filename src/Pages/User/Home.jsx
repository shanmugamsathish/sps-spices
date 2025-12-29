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

function Home() {
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state?.products?.products || []);

  const fetchProducts = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const products = await getAllProducts();
      dispatch(setProducts(products));
      toast.success("Products fetched successfully");
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase">
          <span
            className="border-b-4 pb-1"
            style={{ borderColor: theme.colors.accent.primary }}
          >
            Products
          </span>
        </h2>
        <p className=" mt-10 text-lg font-medium text-center" style={{ color: theme.colors.text.primary }}>
          Royal Spices. Refined Taste. Pure, carefully sourced spices crafted to
          elevate everyday cooking into an experience of elegance.
        </p>
      </div>
      {productTypes.map((productType) => (
        <ProductCategory
          key={productType}
          categoryName={productType}
          productType={productType}
          sectionId={productType.toLowerCase().replace(/\s+/g, "-")}
        />
      ))}
      {/* border-b-2 border-gray-200 */}
      <div className="border-b-2 border-gray-200 my-4"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase">
          <span
            className="border-b-4 pb-1"
            style={{ borderColor: theme.colors.accent.primary }}
          >
            Collections
          </span>
        </h2>
        <p className=" mt-10 text-lg font-medium " style={{ color: theme.colors.text.primary }}>
        A signature collection of premium spice blends, crafted with precision and tradition. Each blend delivers depth, aroma, and balance — created for kitchens that demand nothing but the finest.
        </p>
      </div>
      <Collections />
      <div className="border-b-2 border-gray-200 my-4"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase">
          <span
            className="border-b-4 pb-1"
            style={{ borderColor: theme.colors.accent.primary }}
          >
            Recent Products
          </span>
        </h2>
        <p className=" mt-10 text-lg font-medium " style={{ color: theme.colors.text.primary }}>
        A signature collection of premium spice blends, crafted with precision and tradition. Each blend delivers depth, aroma, and balance — created for kitchens that demand nothing but the finest.
        </p>
      </div>
      <RecentProducts />
      <div className="border-b-2 border-gray-200 my-4"></div>
      <WhyChooseUs />
      <div className="border-b-2 border-gray-200 my-4"></div>
      <Contact />
    </div>
  );
}

export default Home;
