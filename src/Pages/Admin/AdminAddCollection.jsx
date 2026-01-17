import React, { useState, useCallback, useEffect, useRef } from "react";
import theme from "../../lib/theme";
import { createCollection } from "../../apiCalls/collections";
import { getAllProducts, autoSearchProducts } from "../../apiCalls/products";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loaderSlice";
import BasicInformation from "../../Components/AdminAddCollectionComponent/BasicInformation";
import CollectionType from "../../Components/AdminAddCollectionComponent/CollectionType";
import CollectionImage from "../../Components/AdminAddCollectionComponent/CollectionImage";
import BrowseProductModel from "../../Components/AdminAddCollectionComponent/BrowseProductModel";

function AdminAddCollection() {
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

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
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

  const isFormValid = useCallback(() => {
    if (!formData.title.trim() || !formData.handle.trim()) {
      return false;
    }
    if (formData.collection_type === "smart_collection") {
      return rules.some(
        (rule) => rule.column && rule.relation && rule.condition.trim() !== ""
      );
    }
    return true;
  }, [formData, rules]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!isFormValid()) {
        toast.error("Please fill in all required fields");
        return;
      }

      dispatch(setLoading(true));

      const formDataToSend = new FormData();

      const collectionData = {
        title: formData.title,
        handle:
          formData.handle || formData.title.toLowerCase().replace(/\s+/g, "-"),
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

      // Add products for manual collection
      if (
        formData.collection_type === "custom_collection" &&
        selectedProducts.length > 0
      ) {
        collectionData.collects = selectedProducts.map((product, index) => ({
          product_id: String(product.id),
          position: index + 1,
        }));
      }

      formDataToSend.append("collectionData", JSON.stringify(collectionData));

      // Add image file if provided
      if (image instanceof File) {
        formDataToSend.append("images", image);
      }

      try {
        const response = await createCollection(formDataToSend);
        if (response) {
          dispatch(setLoading(false));
          toast.success(response.message || "Collection created successfully");
          // Reset form
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
          setRules([
            {
              column: "product_type",
              relation: "equals",
              condition: "",
            },
          ]);
          setSelectedProducts([]);
          setSearchQuery("");
          setAutocompleteResults([]);
        } else {
          dispatch(setLoading(false));
          toast.error(response.message || "Failed to create collection");
        }
      } catch (error) {
        dispatch(setLoading(false));
        toast.error(
          `Collection ${
            error.response?.data?.errors?.handle?.[0] ||
            error.response?.data?.message ||
            error.message ||
            "Failed to create collection"
          }`
        );
      } finally {
        dispatch(setLoading(false));
      }
    },
    [formData, rules, selectedProducts, image, isFormValid, dispatch]
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8"
          style={{ color: theme.colors.text.primary }}
        >
          Add New Collection
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <BasicInformation formData={formData} handleInputChange={handleInputChange} generateHandle={generateHandle} />

          {/* Collection Type */}
          <CollectionType formData={formData} handleInputChange={handleInputChange} handleSearchChange={handleSearchChange} searchQuery={searchQuery} showAutocomplete={showAutocomplete} autocompleteResults={autocompleteResults} autocompleteRef={autocompleteRef} searchRef={searchRef} openBrowseModal={openBrowseModal} selectedProducts={selectedProducts} removeProduct={removeProduct} addRule={addRule} rules={rules} handleRuleChange={handleRuleChange} removeRule={removeRule} selectProductFromSearch={selectProductFromSearch} getProductImage={getProductImage} />

          {/* Collection Image */}
          <CollectionImage image={image} handleImageChange={handleImageChange} removeImage={removeImage} getImagePreview={getImagePreview} />

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
            <button
              type="button"
              className="px-6 py-3 rounded-md font-medium transition-colors cursor-pointer w-full sm:w-auto"
              style={{
                backgroundColor: theme.colors.border.light,
                color: theme.colors.text.primary,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid()}
              className="px-6 py-3 rounded-md text-white font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              style={{
                backgroundColor: theme.colors.accent.primary,
              }}
              onMouseEnter={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = theme.colors.accent.hover;
                }
              }}
              onMouseLeave={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = theme.colors.accent.primary;
                }
              }}
            >
              Create Collection
            </button>
          </div>
        </form>
      </div>

      {/* Browse Products Modal */}
      <BrowseProductModel browseModalOpen={browseModalOpen} setBrowseModalOpen={setBrowseModalOpen} allProducts={allProducts} browseSelectedProducts={browseSelectedProducts} selectedProducts={selectedProducts} toggleBrowseProduct={toggleBrowseProduct} addBrowseProducts={addBrowseProducts} getProductImage={getProductImage} />
    </div>
  );
}

export default AdminAddCollection;