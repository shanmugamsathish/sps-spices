import React, { useEffect, useCallback, useState, useRef } from 'react';
import { getAllProducts, deleteProduct } from '../../apiCalls/products';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../lib/constant';
import theme from '../../lib/theme';
import { Edit, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import EditProductModal from '../../Components/AdminEditProduct/EditProductModal';
import DialogBox from '../../Components/DialogBox';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../redux/loaderSlice';

function Products() {
  const [products, setProducts] = useState([]);
  const [loadingText, setLoadingText] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductTitle, setSelectedProductTitle] = useState(null);
  const [tableWidth, setTableWidth] = useState(null);
  const [tablePosition, setTablePosition] = useState({ top: 0, left: 0 });
  const tableRef = useRef(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchProducts = useCallback(async () => {
    try {
      setLoadingText(true);
      dispatch(setLoading(true));
      const productsData = await getAllProducts();
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoadingText(false);
      dispatch(setLoading(false));
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Get table width and position for modal
  const updateTableDimensions = useCallback(() => {
    if (tableRef.current) {
      const rect = tableRef.current.getBoundingClientRect();
      setTableWidth(rect.width);
      setTablePosition({ top: rect.top, left: rect.left });
    }
  }, []);

  useEffect(() => {
    updateTableDimensions();
    
    // Update on window resize and scroll
    window.addEventListener('resize', updateTableDimensions);
    window.addEventListener('scroll', updateTableDimensions);
    
    return () => {
      window.removeEventListener('resize', updateTableDimensions);
      window.removeEventListener('scroll', updateTableDimensions);
    };
  }, [products, loadingText, updateTableDimensions]);

  // Calculate total stock from all variants
  const getTotalStock = (product) => {
    if (!product.variants || !Array.isArray(product.variants)) return 0;
    return product.variants.reduce((total, variant) => {
      return total + (parseInt(variant.inventory_quantity) || 0);
    }, 0);
  };

  // Get price (first variant's price or lowest price)
  const getPrice = (product) => {
    if (!product.variants || product.variants.length === 0) return '0.00';
    const prices = product.variants
      .map((v) => parseFloat(v.price) || 0)
      .filter((p) => p > 0);
    if (prices.length === 0) return '0.00';
    const lowestPrice = Math.min(...prices);
    return lowestPrice.toFixed(2);
  };

  // Get product image
  const getProductImage = (product) => {
    return product?.image?.src || product?.images?.[0]?.src || '';
  };

  // Handle edit product
  const handleEdit = (productId) => {
    setSelectedProductId(productId);
    setEditModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setEditModalOpen(false);
    setSelectedProductId(null);
  };

  // Handle product update
  const handleProductUpdate = () => {
    fetchProducts(); // Refresh the list
  };

  const handleDeleteDialog = (productId, productTitle) => {
    setIsDialogOpen(true);
    setSelectedProductId(productId);
    setSelectedProductTitle(productTitle);
  };

    // Handle delete product
    const handleDelete = useCallback(async (productId) => {
      try {
        dispatch(setLoading(true));
        const response = await deleteProduct(productId);
        if (response) {
          dispatch(setLoading(false));
          toast.success(response.message);
        } else {
          dispatch(setLoading(false));
          toast.error(response.message);
        }
        fetchProducts();
        setIsDialogOpen(false);
      } catch (error) {
        console.error('Error deleting product:', error);
        dispatch(setLoading(false));
        toast.error(error.response?.data?.message || 'Failed to delete product');
        setIsDialogOpen(false);
      } finally {
        dispatch(setLoading(false));
      }
    }, [fetchProducts, dispatch]);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{ color: theme.colors.text.primary }}
        >
          Products
        </h1>
        <button
          onClick={() => navigate(ROUTES.ADMIN_ADD_PRODUCT)}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-white text-sm font-medium transition-colors cursor-pointer"
          style={{ backgroundColor: theme.colors.accent.primary }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = theme.colors.accent.hover;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = theme.colors.accent.primary;
          }}
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div
          className="p-8 text-center rounded-lg"
          style={{
            backgroundColor: '#FFFFFF',
            border: `1px solid ${theme.colors.border.light}`,
          }}
        >
          <p style={{ color: theme.colors.text.secondary }}>
            No products found. Add your first product to get started.
          </p>
        </div>
      ) : (
        <div
          ref={tableRef}
          className="rounded-lg overflow-hidden shadow-sm"
          style={{
            backgroundColor: '#FFFFFF',
            border: `1px solid ${theme.colors.border.light}`,
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  style={{
                    backgroundColor: theme.colors.background.main,
                    borderBottom: `2px solid ${theme.colors.border.light}`,
                  }}
                >
                  <th
                    className="px-4 py-3 text-left text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Image
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Product Title
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Product Type
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Stock Available
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Price
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Status
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => {
                  const totalStock = getTotalStock(product);
                  const price = getPrice(product);
                  const productImage = getProductImage(product);

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors"
                      style={{
                        borderBottom:
                          index < products.length - 1
                            ? `1px solid ${theme.colors.border.light}`
                            : 'none',
                      }}
                    >
                      <td className="px-4 py-3">
                        {productImage ? (
                          <img
                            src={productImage}
                            alt={product.title || 'Product'}
                            className="w-16 h-16 object-cover rounded-md"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div
                            className="w-16 h-16 rounded-md flex items-center justify-center"
                            style={{
                              backgroundColor: theme.colors.background.main,
                              border: `1px solid ${theme.colors.border.light}`,
                            }}
                          >
                            <span
                              className="text-xs"
                              style={{ color: theme.colors.text.secondary }}
                            >
                              No Image
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="font-medium"
                          style={{ color: theme.colors.text.primary }}
                        >
                          {product.title || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span style={{ color: theme.colors.text.secondary }}>
                          {product.product_type || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-medium ${
                            totalStock > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {totalStock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="font-medium"
                          style={{ color: theme.colors.text.primary }}
                        >
                          ₹{price}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="font-medium"
                          style={{ color: theme.colors.text.primary }}
                        >
                          {product.status || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleEdit(product.id)}
                            className="p-2 rounded-md transition-colors cursor-pointer"
                            style={{
                              backgroundColor: theme.colors.accent.primary,
                              color: '#FFFFFF',
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = theme.colors.accent.hover;
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = theme.colors.accent.primary;
                            }}
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDialog(product.id, product.title)}
                            className="p-2 rounded-md text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      <EditProductModal
        productId={selectedProductId}
        isOpen={editModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleProductUpdate}
        tableWidth={tableWidth}
        tablePosition={tablePosition}
      />
      <DialogBox isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={selectedProductTitle} description={`Are you sure you want to delete "${selectedProductTitle}"?` } onConfirm={() => handleDelete(selectedProductId, selectedProductTitle)} />
    </div>
  );
}

export default Products;
