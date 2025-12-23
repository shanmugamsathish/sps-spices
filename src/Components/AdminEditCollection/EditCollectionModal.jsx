import React, { useState, useCallback, useEffect, useRef } from 'react';
import { getCollectionById, updateCollection } from '../../apiCalls/collections';
import { getAllProducts, autoSearchProducts } from '../../apiCalls/products';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../redux/loaderSlice';
import BrowseProductModel from '../AdminAddCollectionComponent/BrowseProductModel';
import ScrollableContent from './EditCollectionModel/ScrollableContent';
import Header from './EditCollectionModel/Header';

function EditCollectionModal({ collectionId, isOpen, onClose, onUpdate, tableWidth, tablePosition }) {
  const [loadingText, setLoadingText] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    handle: "",
    body_html: "",
    sort_order: "best-selling",
    published_scope: "global",
    collection_type: "custom_collection",
    disjunctive: false,
  });

  const [image, setImage] = useState(null);
  const [rules, setRules] = useState([
    {
      column: "product_type",
      relation: "equals",
      condition: "",
    },
  ]);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [browseModalOpen, setBrowseModalOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [browseSelectedProducts, setBrowseSelectedProducts] = useState([]);
  const searchRef = useRef(null);
  const autocompleteRef = useRef(null);
  const modalRef = useRef(null);

  const fetchCollectionData = useCallback(async () => {
    try {
      setLoadingText(true);
      dispatch(setLoading(true));
      const response = await getCollectionById(collectionId);
      const collection = response?.collection || response;
      const collectionType = response?.collection_type || 
                            (collection.rules !== undefined ? 'smart_collection' : 'custom_collection');
      
      
      const normalizedInitialRules = collectionType === 'smart_collection' && collection.rules
        ? collection.rules.map(rule => ({
            ...rule,
            column: rule.column === 'type' ? 'product_type' : rule.column
          }))
        : collection.rules;
      
      setInitialData({
        ...collection,
        collection_type: collectionType,
        rules: normalizedInitialRules,
      });
      
      setFormData({
        title: collection.title || "",
        handle: collection.handle || "",
        body_html: collection.body_html || "",
        sort_order: collection.sort_order || "best-selling",
        published_scope: collection.published_scope || "global",
        collection_type: collectionType,
        disjunctive: collection.disjunctive || false,
      });

      if (collection.image?.src) {
        setImage(collection.image.src);
      } else {
        setImage(null);
      }

      if (collectionType === 'smart_collection' && collection.rules) {
        const normalizedRules = collection.rules.length > 0 
          ? collection.rules.map(rule => ({
              ...rule,
              column: rule.column === 'type' ? 'product_type' : rule.column
            }))
          : [{
              column: "product_type",
              relation: "equals",
              condition: "",
            }];
        setRules(normalizedRules);
      } else {
        setRules([{
          column: "product_type",
          relation: "equals",
          condition: "",
        }]);
      }

      // Fetch products for manual collections
      if (collectionType === 'custom_collection' && collection.collects && collection.collects.length > 0) {
        try {
          const allProductsData = await getAllProducts();
          const productsList = Array.isArray(allProductsData) ? allProductsData : [];
          
          const productIds = collection.collects.map(collect => String(collect.product_id));
          const matchedProducts = productsList.filter(product => 
            productIds.includes(String(product.id))
          );
          
          setSelectedProducts(matchedProducts);
        } catch (error) {
          console.error('Error fetching products for collection:', error);
          setSelectedProducts([]);
        }
      } else {
        setSelectedProducts([]);
      }

      setHasChanges(false);
    } catch (error) {
      console.error("Error fetching collection:", error);
      toast.error("Failed to load collection data");
      onClose();
    } finally {
      setLoadingText(false);
      dispatch(setLoading(false));
    }
  }, [collectionId, onClose, dispatch]);

  const checkForChanges = useCallback(() => {
    if (!initialData) return;

    const initialCollectionType = initialData.collection_type || 
                                  (initialData.rules !== undefined ? 'smart_collection' : 'custom_collection');
    
    const formChanged =
      formData.title !== (initialData.title || "") ||
      formData.handle !== (initialData.handle || "") ||
      formData.body_html !== (initialData.body_html || "") ||
      formData.sort_order !== (initialData.sort_order || "best-selling") ||
      formData.published_scope !== (initialData.published_scope || "global") ||
      formData.collection_type !== initialCollectionType ||
      formData.disjunctive !== (initialData.disjunctive || false);

    let rulesChanged = false;
    if (formData.collection_type === 'smart_collection') {
      const normalizedCurrentRules = rules.map(rule => ({
        column: rule.column === 'type' ? 'product_type' : rule.column,
        relation: rule.relation,
        condition: rule.condition ? rule.condition.trim() : rule.condition
      }));
      
      const normalizedInitialRules = (initialData.rules || []).map(rule => ({
        column: rule.column === 'type' ? 'product_type' : rule.column,
        relation: rule.relation,
        condition: rule.condition ? rule.condition.trim() : rule.condition
      }));
      
      rulesChanged = JSON.stringify(normalizedCurrentRules) !== JSON.stringify(normalizedInitialRules);
    }

    const productsChanged = formData.collection_type === 'custom_collection' &&
      JSON.stringify(selectedProducts.map(p => p.id).sort()) !== 
      JSON.stringify((initialData.collects || []).map(c => String(c.product_id)).sort());

    const imageChanged = image instanceof File || 
      (image !== (initialData.image?.src || null));

    setHasChanges(formChanged || rulesChanged || productsChanged || imageChanged);
  }, [formData, rules, selectedProducts, image, initialData]);

  useEffect(() => {
    if (isOpen && collectionId) {
      fetchCollectionData();
    } else {
      resetForm();
    }
  }, [isOpen, collectionId, fetchCollectionData]);

  useEffect(() => {
    if (initialData) {
      checkForChanges();
    }
  }, [formData, rules, selectedProducts, image, initialData, checkForChanges]);

  const resetForm = () => {
    setFormData({
      title: "",
      handle: "",
      body_html: "",
      sort_order: "best-selling",
      published_scope: "global",
      collection_type: "custom_collection",
      disjunctive: false,
    });
    setImage(null);
    setRules([{
      column: "product_type",
      relation: "equals",
      condition: "",
    }]);
    setSelectedProducts([]);
    setSearchQuery("");
    setAutocompleteResults([]);
    setInitialData(null);
    setHasChanges(false);
  };

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "collection_type") {
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const generateHandle = useCallback(() => {
    if (formData.title) {
      const handle = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, handle }));
    }
  }, [formData.title]);

  const handleRuleChange = useCallback(
    (index, field, value) => {
      const updatedRules = [...rules];
      updatedRules[index][field] = value;
      setRules(updatedRules);
    },
    [rules]
  );

  const addRule = useCallback(() => {
    setRules([
      ...rules,
      {
        column: "product_type",
        relation: "equals",
        condition: "",
      },
    ]);
  }, [rules]);

  const removeRule = useCallback(
    (index) => {
      if (rules.length > 1) {
        setRules(rules.filter((_, i) => i !== index));
      }
    },
    [rules]
  );

  // Product search autocomplete
  const handleSearchChange = useCallback(
    async (e) => {
      const query = e.target.value;
      setSearchQuery(query);
      if (query.trim().length > 0) {
        try {
          dispatch(setLoading(true));
          const response = await autoSearchProducts(query);
          const products = response?.products || [];
          setAutocompleteResults(products);
          setShowAutocomplete(true);
        } catch (error) {
          console.error("Error searching products:", error);
          setAutocompleteResults([]);
        } finally {
          dispatch(setLoading(false));
        }
      } else {
        setAutocompleteResults([]);
        setShowAutocomplete(false);
      }
    },
    [dispatch]
  );

  // Select product from autocomplete
  const selectProductFromSearch = useCallback(
    (product) => {
      if (!selectedProducts.find((p) => p.id === product.id)) {
        setSelectedProducts([...selectedProducts, product]);
      }
      setSearchQuery("");
      setShowAutocomplete(false);
      setAutocompleteResults([]);
    },
    [selectedProducts]
  );

  // Remove product from selected
  const removeProduct = useCallback(
    (productId) => {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
    },
    [selectedProducts]
  );

  // Get product image
  const getProductImage = useCallback((product) => {
    return product?.image?.src || product?.images?.[0]?.src || "";
  }, []);

  // Handle collection image file change
  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  }, []);

  // Remove collection image
  const removeImage = useCallback(() => {
    setImage(null);
  }, []);

  // Get image preview
  const getImagePreview = useCallback(() => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    if (image && typeof image === 'string') {
      return image;
    }
    return null;
  }, [image]);

  // Open browse modal
  const openBrowseModal = useCallback(async () => {
    setBrowseModalOpen(true);
    setBrowseSelectedProducts([]);
    try {
      dispatch(setLoading(true));
      const products = await getAllProducts();
      setAllProducts(Array.isArray(products) ? products : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Toggle product selection in browse modal
  const toggleBrowseProduct = useCallback((product) => {
    setBrowseSelectedProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  }, []);

  // Add selected products from browse modal
  const addBrowseProducts = useCallback(() => {
    const newProducts = browseSelectedProducts.filter(
      (product) => !selectedProducts.find((p) => p.id === product.id)
    );
    setSelectedProducts([...selectedProducts, ...newProducts]);
    setBrowseModalOpen(false);
    setBrowseSelectedProducts([]);
    toast.success(`${newProducts.length} product(s) added`);
  }, [browseSelectedProducts, selectedProducts]);

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      dispatch(setLoading(true));
      setLoadingText(true);

      const formDataToSend = new FormData();

      const collectionData = {
        title: formData.title,
        handle: formData.handle || formData.title.toLowerCase().replace(/\s+/g, "-"),
        body_html: formData.body_html || "",
        sort_order: formData.sort_order,
        published_scope: formData.published_scope,
        collection_type: formData.collection_type,
      };

      // Add smart collection rules if it's a smart collection
      if (formData.collection_type === "smart_collection") {
        const validRules = rules.filter(
          (rule) => rule.column && rule.relation && rule.condition.trim() !== ""
        );
        if (validRules.length > 0) {
          collectionData.rules = validRules;
          collectionData.disjunctive = formData.disjunctive;
        }
      }

      // Add products for manual collection (always include collects array, even if empty)
      if (formData.collection_type === "custom_collection") {
        collectionData.collects = selectedProducts.map((product, index) => ({
          product_id: String(product.id),
          position: index + 1,
        }));
      }

      formDataToSend.append("collectionData", JSON.stringify(collectionData));

      // Add image file if it's a new file upload
      if (image instanceof File) {
        formDataToSend.append("images", image);
      }

      try {
        const response = await updateCollection(collectionId, formDataToSend);
        toast.success(response.message || "Collection updated successfully");
        onUpdate();
        onClose();
      } catch (error) {
        console.error("Error updating collection:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to update collection");
      } finally {
        setLoadingText(false);
        dispatch(setLoading(false));
      }
    },
    [formData, rules, selectedProducts, image, collectionId, onUpdate, onClose, dispatch]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="absolute bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
        style={{
          width: tableWidth ? `${tableWidth}px` : "90%",
          maxWidth: "1400px",
          maxHeight: tablePosition.top > 150 
            ? `${tablePosition.top - 60}px` 
            : "calc(100vh - 2rem)",
          top: tablePosition.top > 150 
            ? `${Math.max(1, tablePosition.top - (tablePosition.top > 500 ? 500 : tablePosition.top - 20))}px` 
            : "1rem",
          left: tablePosition.left > 0 ? `${tablePosition.left}px` : "50%",
          transform: tablePosition.left > 0 ? "none" : "translateX(-50%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <Header onClose={onClose} hasChanges={hasChanges} loadingText={loadingText} handleSubmit={handleSubmit} />

        {/* Scrollable Content */}
        <ScrollableContent loadingText={loadingText} formData={formData} handleInputChange={handleInputChange} generateHandle={generateHandle} handleSubmit={handleSubmit} handleSearchChange={handleSearchChange} searchQuery={searchQuery} showAutocomplete={showAutocomplete} autocompleteResults={autocompleteResults} autocompleteRef={autocompleteRef} searchRef={searchRef} openBrowseModal={openBrowseModal} selectedProducts={selectedProducts} removeProduct={removeProduct} addRule={addRule} rules={rules} handleRuleChange={handleRuleChange} removeRule={removeRule} selectProductFromSearch={selectProductFromSearch} getProductImage={getProductImage} image={image} handleImageChange={handleImageChange} removeImage={removeImage} getImagePreview={getImagePreview} />
      </div>

      {/* Browse Products Modal */}
      <BrowseProductModel 
        browseModalOpen={browseModalOpen} 
        setBrowseModalOpen={setBrowseModalOpen} 
        allProducts={allProducts} 
        browseSelectedProducts={browseSelectedProducts} 
        selectedProducts={selectedProducts} 
        toggleBrowseProduct={toggleBrowseProduct} 
        addBrowseProducts={addBrowseProducts} 
        getProductImage={getProductImage} 
      />
    </div>
  );
}

export default EditCollectionModal;