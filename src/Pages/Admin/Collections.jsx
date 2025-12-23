import React, { useEffect, useCallback, useState, useRef } from 'react';
import { getAllCollections, deleteCollection } from '../../apiCalls/collections';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../lib/constant';
import theme from '../../lib/theme';
import { Edit, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import DialogBox from '../../Components/DialogBox';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../redux/loaderSlice';
import EditCollectionModal from '../../Components/AdminEditCollection/EditCollectionModal';

function Collections() {
  const [collections, setCollections] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [selectedCollectionTitle, setSelectedCollectionTitle] = useState(null);
  const [productCounts, setProductCounts] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [tableWidth, setTableWidth] = useState(null);
  const [tablePosition, setTablePosition] = useState({ top: 0, left: 0 });
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchCollections = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const collectionsData = await getAllCollections();
      const collectionsList = Array.isArray(collectionsData) ? collectionsData : [];
      setCollections(collectionsList);
      
      // Calculate product counts from collects array (now included in response)
      const counts = {};
      collectionsList.forEach((collection) => {
        // Determine collection type
        const isSmartCollection = collection.rules !== undefined;
        
        if (isSmartCollection) {
          // For smart collections, we can't easily get count without fetching products
          counts[collection.id] = 'Smart';
        } else {
          // For manual collections, get count from collects array (now included in response)
          const collects = collection?.collects || [];
          counts[collection.id] = collects.length || 0;
        }
      });
      
      setProductCounts(counts);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Failed to fetch collections');
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

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
  }, [collections, updateTableDimensions]);

  // Get collection image
  const getCollectionImage = (collection) => {
    return collection?.image?.src || '';
  };

  // Handle edit collection
  const handleEdit = (collectionId) => {
    setSelectedCollectionId(collectionId);
    setEditModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setEditModalOpen(false);
    setSelectedCollectionId(null);
  };

  // Handle collection update
  const handleCollectionUpdate = () => {
    fetchCollections(); // Refresh the list
  };

  const handleDeleteDialog = (collectionId, collectionTitle) => {
    setIsDialogOpen(true);
    setSelectedCollectionId(collectionId);
    setSelectedCollectionTitle(collectionTitle);
  };

  // Handle delete collection
  const handleDelete = useCallback(async (collectionId) => {
    try {
      dispatch(setLoading(true));
      const response = await deleteCollection(collectionId);
      if (response) {
        dispatch(setLoading(false));
        toast.success(response.message);
      } else {
        dispatch(setLoading(false));
        toast.error(response.message);
      }
      fetchCollections();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error deleting collection:', error);
      dispatch(setLoading(false));
      toast.error(error.response?.data?.message || 'Failed to delete collection');
      setIsDialogOpen(false);
    } finally {
      dispatch(setLoading(false));
    }
  }, [fetchCollections, dispatch]);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{ color: theme.colors.text.primary }}
        >
          Collections
        </h1>
        <button
          onClick={() => {navigate(ROUTES.ADMIN_ADD_COLLECTION); window.scrollTo(0, 0)}}
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
          Add Collection
        </button>
      </div>

      {collections.length === 0 ? (
        <div
          className="p-8 text-center rounded-lg"
          style={{
            backgroundColor: '#FFFFFF',
            border: `1px solid ${theme.colors.border.light}`,
          }}
        >
          <p style={{ color: theme.colors.text.secondary }}>
            No collections found. Add your first collection to get started.
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
                    Collection Title
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    No of Products
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
                {collections.map((collection, index) => {
                  const collectionImage = getCollectionImage(collection);
                  const productCount = productCounts[collection.id] !== undefined 
                    ? productCounts[collection.id] 
                    : 'Loading...';

                  return (
                    <tr
                      key={collection.id}
                      className="hover:bg-gray-50 transition-colors"
                      style={{
                        borderBottom:
                          index < collections.length - 1
                            ? `1px solid ${theme.colors.border.light}`
                            : 'none',
                      }}
                    >
                      <td className="px-4 py-3">
                        {collectionImage ? (
                          <img
                            src={collectionImage}
                            alt={collection.title || 'Collection'}
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
                          {collection.title || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="font-medium"
                          style={{ color: theme.colors.text.primary }}
                        >
                          {typeof productCount === 'number' ? productCount : productCount}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleEdit(collection.id)}
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
                            title="Edit Collection"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDialog(collection.id, collection.title)}
                            className="p-2 rounded-md text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Collection"
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

      {/* Edit Collection Modal */}
      <EditCollectionModal
        collectionId={selectedCollectionId}
        isOpen={editModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleCollectionUpdate}
        tableWidth={tableWidth}
        tablePosition={tablePosition}
      />

      <DialogBox 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        title={selectedCollectionTitle} 
        description={`Are you sure you want to delete "${selectedCollectionTitle}"?`} 
        onConfirm={() => handleDelete(selectedCollectionId)} 
      />
    </div>
  );
}

export default Collections;
