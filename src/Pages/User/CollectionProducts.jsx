import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../../Components/ProductCard";
import { ArrowLeft } from "lucide-react";
import theme from "../../lib/theme";
import { ROUTES } from "../../lib/constant";
import { getCollectionById } from "../../apiCalls/collections";
import { setLoading } from "../../redux/loaderSlice";
import toast from "react-hot-toast";

function CollectionProducts() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [collection, setCollection] = useState(location.state?.collection || null);
  
  // Get all products from Redux
  const allProducts = useSelector((state) => state?.products?.products || []);

  // Fetch collection if not in state
  const fetchCollection = useCallback(async () => {
    if (!collection && id) {
      try {
        dispatch(setLoading(true));
        const collectionData = await getCollectionById(id);
        setCollection(collectionData);
      } catch (error) {
        console.error('Error fetching collection:', error);
        toast.error('Error fetching collection');
      } finally {
        dispatch(setLoading(false));
      }
    }
  }, [collection, id, dispatch]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  // Filter products by collection ID
  const collectionProducts = useMemo(() => {
    if (!collection || !Array.isArray(collection.collects) || !Array.isArray(allProducts)) {
      return [];
    }

    // Extract product IDs from collection's collects array
    const productIds = collection.collects.map(collect => collect.product_id);
    
    // Filter products that match the collection's product IDs
    return allProducts.filter(product => productIds.includes(product.id));
  }, [collection, allProducts]);

  return (
    <div>
      {/* Header with back button and collection title */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 ">
        <button
          onClick={() => {
            navigate(ROUTES.COLLECTIONS);
            window.scrollTo(0, 0);
          }}
          className="mb-4 px-4 py-2 rounded-md flex items-center gap-2 hover:opacity-90 transition-opacity ml-auto"
          style={{
            backgroundColor: theme.colors.accent.primary,
            color: theme.colors.background.main,
          }}
        >
          <ArrowLeft className="w-4 h-4 font-bold" />
          <span>Back to Collections</span>
        </button>
        
        <div className="flex justify-between items-center">
          <h1 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase"
            style={{ color: theme.colors.text.primary }}
          >
            {collection?.title || 'Collection Products'}
          </h1>
          <p className="text-sm sm:text-base opacity-80">
            {collectionProducts.length} {collectionProducts.length === 1 ? 'Product' : 'Products'}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <ProductCard productsList={collectionProducts} />
    </div>
  );
}

export default CollectionProducts;

