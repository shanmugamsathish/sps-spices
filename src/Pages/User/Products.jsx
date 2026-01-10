import React, { useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { getAllProducts } from "../../apiCalls/products";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../redux/productSlice";
import ProductCategory from "./ProductCategory";
import { setLoading } from "../../redux/loaderSlice";
import toast from "react-hot-toast";
import ProductCard from "../../Components/ProductCard";
import TopSellingProducts from "./TopSellingProducts";
import theme from "../../lib/theme";
import { Zap } from "lucide-react";

function Products() {
  const dispatch = useDispatch();
  const location = useLocation();
  const productsData = useSelector((state) => state?.products?.products || []);

  const fetchProducts = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const products = await getAllProducts();
      dispatch(setProducts(products));
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error fetching products');
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const section = location.state?.section;
    if (!section) return;

    // Function to attempt scrolling with retries
    const attemptScroll = (retries = 5, delay = 300) => {
      const el = document.getElementById(section);
      if (el && el.offsetHeight > 0) {
        // Element exists and has content (height > 0)
        const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - 100; // 100px offset from top

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        return true;
      } else if (retries > 0) {
        // Element not ready, retry after delay
        setTimeout(() => attemptScroll(retries - 1, delay), delay);
      }
      return false;
    };

    // Start attempting scroll after initial delay
    const timeoutId = setTimeout(() => {
      attemptScroll();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [location.state, productsData]);

  // Get unique product types dynamically
  const getUniqueProductTypes = () => {
    if (!Array.isArray(productsData) || productsData.length === 0) {
      return [];
    }
    const types = [...new Set(productsData.map((product) => product.product_type))];
    return types.filter((type) => type && type !== "Top Selling Items"); 
  };

  const productTypes = getUniqueProductTypes();

  return (
    <div>
      {productsData.length === 0 ? (
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
      <section id="amazon-products">
        {/* heading */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase text-center flex items-center justify-center gap-2 ">
          <Zap
            className="text-white w-8 h-8 animate-pulse rounded-full p-1"
            style={{ backgroundColor: theme.colors.accent.primary }}
          />
          <div className="my-4 sm:my-6 lg:my-8">
            {/* Deal of the Day */}
            <span>Deal </span>
            <span
              style={{
                borderBottom: `4px solid ${theme.colors.accent.primary}`,
              }}
            >
              of the 
            </span>
            <span> Day</span>
          </div>
        </div>
        </div>
        <TopSellingProducts marketplace="amazon" />
      </section>
      <section id="flipkart-products">
        {/* heading */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase text-center flex items-center justify-center gap-2 ">
          <Zap
            className="text-white w-8 h-8 animate-pulse rounded-full p-1"
            style={{ backgroundColor: theme.colors.accent.primary }}
          />
          <div className="my-4 sm:my-6 lg:my-8">
            {/* Deal of the Day */}
            <span>Dail</span>
            <span
              style={{
                borderBottom: `4px solid ${theme.colors.accent.primary}`,
              }}
            >
              y D 
            </span>
            <span>eals</span>
          </div>
        </div>
        </div>
        <TopSellingProducts marketplace="flipkart" />
      </section>
    </div>
  );
}

export default Products;
