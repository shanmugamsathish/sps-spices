import React, { useState } from 'react';
import theme from "../../lib/theme"
import { addMarketplaceProduct } from '../../apiCalls/products';
import TopSellingProducts from '../User/TopSellingProducts';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../redux/loaderSlice';
import toast from 'react-hot-toast';

function FlipkartProducts() {
  const [url, setUrl] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    try {
      dispatch(setLoading(true));
      const data = {
        url: url.trim(),
        marketplace: 'flipkart'
      };
      const response = await addMarketplaceProduct(data);
      console.log('Product added successfully:', response);
      
      if (response.success) {
        toast.success('Product added successfully!');
        setUrl(''); // Clear the input
        setRefreshKey(prev => prev + 1);
      } else {
        toast.error(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add product';
      toast.error(`Error: ${errorMessage}`);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
    <div className="max-w-xl mx-auto p-4 border-b border-gray-300">
      <h1 className="text-2xl font-bold mb-4 text-center" style={{ color: theme.colors.text.primary }}>Flipkart Products</h1>

      <form
        onSubmit={handleSubmit}
        className="  rounded-lg p-4 flex flex-col sm:flex-row gap-2"
      >
        <input
          type="text"
          name="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Flipkart URL"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 " style={{ borderColor: theme.colors.accent.primary }}
        />
        <button
          type="submit"
          className="px-4 py-2 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors" style={{ backgroundColor: theme.colors.accent.primary }}
        >
          Fetch Product
        </button>
      </form>

      <p className="mt-2 text-sm text-gray-500 text-center">
        Paste the Flipkart product URL above to fetch product details.
      </p>
    </div>
    <TopSellingProducts key={refreshKey} marketplace="flipkart" />
    </div>
  );
}

export default FlipkartProducts;

