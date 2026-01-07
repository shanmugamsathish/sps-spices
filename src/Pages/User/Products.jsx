import React, { useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { getAllProducts } from "../../apiCalls/products";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../redux/productSlice";
import ProductCategory from "./ProductCategory";
import { setLoading } from "../../redux/loaderSlice";
import toast from "react-hot-toast";
import ProductCard from "../../Components/ProductCard";

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

    if (!Array.isArray(productsData) || productsData.length === 0) return;

    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.state, productsData]);

  // Get unique product types dynamically
  const getUniqueProductTypes = () => {
    if (!Array.isArray(productsData) || productsData.length === 0) {
      return [];
    }
    const types = [...new Set(productsData.map((product) => product.product_type))];
    return types.filter((type) => type); // Filter out null/undefined types
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
    </div>
  );
}

export default Products;
