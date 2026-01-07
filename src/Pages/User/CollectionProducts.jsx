import React, { useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../Components/ProductCard";
import { ArrowLeft } from "lucide-react";
import theme from "../../lib/theme";
import { ROUTES } from "../../lib/constant";
import { getCollectionById } from "../../apiCalls/collections";
import { setLoading } from "../../redux/loaderSlice";
import toast from "react-hot-toast";
import { setProducts } from "../../redux/productSlice";

function CollectionProducts() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const products = useSelector((state) => state?.products?.products || []);
  // Fetch collection if not in state
  const fetchCollection = useCallback(async () => {
    if (id) {
      try {
        dispatch(setLoading(true));
        const response = await getCollectionById(id);
        const collectionData = response?.collection || response;
        dispatch(setProducts(collectionData.products));
      } catch (error) {
        console.error('Error fetching collection:', error);
        toast.error('Error fetching collection');
      } finally {
        dispatch(setLoading(false));
      }
    }
  }, [id, dispatch]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  return (
    <div>
      {/* Header collection title */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 ">
        <div className="flex justify-between items-center">
          <h1 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase"
            style={{ color: theme.colors.text.primary }}
          >
            {products[0]?.product_type || 'Collection Products'}
          </h1>
          <p className="text-sm sm:text-base opacity-80">
            {products.length} {products.length === 1 ? 'Product' : 'Products'}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <ProductCard productsList={products} />
    </div>
  );
}

export default CollectionProducts;

