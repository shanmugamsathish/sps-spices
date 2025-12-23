import React, { useEffect, useCallback } from "react";
import { getAllProducts } from "../../apiCalls/products";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../redux/productSlice";
import ProductCategory from "./ProductCategory";
import { setLoading } from "../../redux/loaderSlice";
import toast from "react-hot-toast";

function Home() {
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state?.products?.products || []);

  const fetchProducts = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const products = await getAllProducts();
      dispatch(setProducts(products));
      toast.success('Products fetched successfully');
    } catch (error) {
      toast.error(`${error.message || 'Error fetching products'}`);
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
    const types = [...new Set(allProducts.map((product) => product.product_type))];
    return types.filter((type) => type); 
  };

  const productTypes = getUniqueProductTypes();

  return (
    <div>
      {productTypes.map((productType) => (
        <ProductCategory
          key={productType}
          categoryName={productType}
          productType={productType}
          sectionId={productType.toLowerCase().replace(/\s+/g, "-")}
        />
      ))}
    </div>
  );
}

export default Home;
