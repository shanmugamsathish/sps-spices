import React, { useState, useCallback, useEffect, useRef } from 'react';
import { getProductById, updateProduct } from '../../apiCalls/products';
import toast from 'react-hot-toast';
import Header from './EditProductModal/Header';
import ScrollableContent from './EditProductModal/ScrollableContent';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../redux/loaderSlice';

function EditProductModal({ productId, isOpen, onClose, onUpdate, tableWidth, tablePosition }) {
  console.log("EditProductModal", productId, isOpen, onClose, onUpdate, tableWidth, tablePosition);
  const [loadingText, setLoadingText] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    body_html: "",
    vendor: "",
    product_type: "",
    tags: "",
    status: "active",
    handle: "",
    published_scope: "global",
  });

  const [variants, setVariants] = useState([
    {
      title: "",
      price: "",
      compare_at_price: "",
      sku: "",
      inventory_quantity: "",
      weight: "",
      weight_unit: "kg",
      grams: "",
      option1: "",
    },
  ]);

  const [options, setOptions] = useState([
    {
      name: "",
      values: [""],
    },
  ]);

  const [images, setImages] = useState([null]);
  const modalRef = useRef(null);

  const fetchProductData = useCallback(async () => {
    try {
      setLoadingText(true);
      dispatch(setLoading(true));
      const response = await getProductById(productId);
      const product = response?.product?.product || response?.product || response;
      setInitialData(product);
      setFormData({
        title: product.title || "",
        body_html: product.body_html || "",
        vendor: product.vendor || "",
        product_type: product.product_type || "",
        tags: product.tags || "",
        status: product.status || "active",
        handle: product.handle || "",
        published_scope: product.published_scope || "global",
      });

      if (product.variants && product.variants.length > 0) {
        setVariants(
          product.variants.map((variant) => ({
            title: variant.title || "",
            price: variant.price || "",
            compare_at_price: variant.compare_at_price || "",
            sku: variant.sku || "",
            inventory_quantity: variant.inventory_quantity?.toString() || "",
            weight: variant.weight?.toString() || "",
            weight_unit: variant.weight_unit || "kg",
            grams: variant.grams?.toString() || "",
            option1: variant.option1 || "",
          }))
        );
      }

      if (product.options && product.options.length > 0) {
        setOptions(
          product.options.map((option) => ({
            name: option.name || "",
            values: option.values && option.values.length > 0 
              ? option.values 
              : [""],
          }))
        );
      } else {
        setOptions([{ name: "", values: [""] }]);
      }

      if (product.images && product.images.length > 0) {
        setImages(product.images.map((img) => img.src || null));
      } else if (product.image?.src) {
        setImages([product.image.src]);
      } else {
        setImages([null]);
      }

      setHasChanges(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product data");
      onClose();
    } finally {
      setLoadingText(false);
      dispatch(setLoading(false));
    }
  }, [productId, onClose]);

  const checkForChanges = useCallback(() => {
    if (!initialData) return;

    const formChanged =
      formData.title !== (initialData.title || "") ||
      formData.body_html !== (initialData.body_html || "") ||
      formData.vendor !== (initialData.vendor || "") ||
      formData.product_type !== (initialData.product_type || "") ||
      formData.tags !== (initialData.tags || "") ||
      formData.status !== (initialData.status || "active") ||
      formData.handle !== (initialData.handle || "");

    const variantsChanged =
      JSON.stringify(variants) !==
      JSON.stringify(
        (initialData.variants || []).map((v) => ({
          title: v.title || "",
          price: v.price || "",
          compare_at_price: v.compare_at_price || "",
          sku: v.sku || "",
          inventory_quantity: v.inventory_quantity?.toString() || "",
          weight: v.weight?.toString() || "",
          weight_unit: v.weight_unit || "kg",
          grams: v.grams?.toString() || "",
          option1: v.option1 || "",
        }))
      );

    const optionsChanged =
      JSON.stringify(options) !==
      JSON.stringify(
        (initialData.options || []).map((o) => ({
          name: o.name || "",
          values: o.values || [""],
        }))
      );

    const initialImages = (initialData.images || [])
      .map((img) => img.src || "")
      .filter((src) => src);
    const currentImages = images
      .map((img) => {
        if (img instanceof File) {
          return img.name; // Use file name for comparison
        }
        return img || "";
      })
      .filter((img) => img);
    const imagesChanged = JSON.stringify(initialImages) !== JSON.stringify(currentImages);

    setHasChanges(formChanged || variantsChanged || optionsChanged || imagesChanged);
  }, [formData, variants, options, images, initialData]);

  useEffect(() => {
    if (isOpen && productId) {
      fetchProductData();
    } else {
      resetForm();
    }
  }, [isOpen, productId, fetchProductData]);

  useEffect(() => {
    if (initialData) {
      checkForChanges();
    }
  }, [formData, variants, options, images, initialData, checkForChanges]);

  const resetForm = () => {
    setFormData({
      title: "",
      body_html: "",
      vendor: "",
      product_type: "",
      tags: "",
      status: "active",
      handle: "",
      published_scope: "global",
    });
    setVariants([
      {
        title: "",
        price: "",
        compare_at_price: "",
        sku: "",
        inventory_quantity: "",
        weight: "",
        weight_unit: "kg",
        grams: "",
        option1: "",
      },
    ]);
    setOptions([{ name: "", values: [""] }]);
    setImages([null]);
    setInitialData(null);
    setHasChanges(false);
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;

    // Auto-calculate grams from weight
    if (field === "weight" && value) {
      const weightValue = parseFloat(value);
      if (!isNaN(weightValue)) {
        updatedVariants[index].grams = (weightValue * 1000).toString();
      }
    }

    setVariants(updatedVariants);
  };

  const addVariant = useCallback(() => {
    setVariants([
      ...variants,
      {
        title: "",
        price: "",
        compare_at_price: "",
        sku: "",
        inventory_quantity: "",
        weight: "",
        weight_unit: "kg",
        grams: "",
        option1: "",
      },
    ]);
  }, [variants]);

  const removeVariant = useCallback(
    (index) => {
      if (variants.length > 1) {
        setVariants(variants.filter((_, i) => i !== index));
      }
    },
    [variants]
  );

  const handleOptionChange = useCallback(
    (index, field, value) => {
      const updatedOptions = [...options];
      updatedOptions[index][field] = value;
      setOptions(updatedOptions);
    },
    [options]
  );

  const generateVariantsFromOptions = useCallback(
    (updatedOptions, currentVariants) => {
      if (updatedOptions.length > 0 && updatedOptions[0].values) {
        const optionValues = updatedOptions[0].values.filter(
          (v) => v.trim() !== ""
        );

        if (optionValues.length > 0) {
          return optionValues.map((value, index) => {
            const existingVariant = currentVariants[index];

            if (existingVariant && existingVariant.option1 === value) {
              return existingVariant;
            } else if (existingVariant) {
              return {
                ...existingVariant,
                option1: value,
                title: formData.title ? `${formData.title} - ${value}` : value,
                sku: formData.title
                  ? `${formData.title.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(3, "0")}`
                  : value,
              };
            } else {
              return {
                title: formData.title ? `${formData.title} - ${value}` : value,
                price: "",
                compare_at_price: "",
                sku: "",
                inventory_quantity: "",
                weight: "",
                weight_unit: "kg",
                grams: "",
                option1: value,
              };
            }
          });
        }
      }
      return currentVariants.length > 0
        ? currentVariants
        : [
            {
              title: "",
              price: "",
              compare_at_price: "",
              sku: "",
              inventory_quantity: "",
              weight: "",
              weight_unit: "kg",
              grams: "",
              option1: "",
            },
          ];
    },
    [formData]
  );

  const handleOptionValueChange = useCallback(
    (optionIndex, valueIndex, value) => {
      const updatedOptions = [...options];
      updatedOptions[optionIndex].values[valueIndex] = value;
      setOptions(updatedOptions);

      if (optionIndex === 0) {
        const newVariants = generateVariantsFromOptions(updatedOptions, variants);
        setVariants(newVariants);
      }
    },
    [options, variants, generateVariantsFromOptions]
  );

  const addOptionValue = useCallback(
    (optionIndex) => {
      const updatedOptions = [...options];
      updatedOptions[optionIndex].values.push("");
      setOptions(updatedOptions);

      if (optionIndex === 0) {
        const newVariants = generateVariantsFromOptions(updatedOptions, variants);
        setVariants(newVariants);
      }
    },
    [options, variants, generateVariantsFromOptions]
  );

  const removeOptionValue = useCallback(
    (optionIndex, valueIndex) => {
      const updatedOptions = [...options];
      if (updatedOptions[optionIndex].values.length > 1) {
        updatedOptions[optionIndex].values = updatedOptions[
          optionIndex
        ].values.filter((_, i) => i !== valueIndex);
        setOptions(updatedOptions);

        if (optionIndex === 0) {
          const newVariants = generateVariantsFromOptions(updatedOptions, variants);
          setVariants(newVariants);
        }
      }
    },
    [options, variants, generateVariantsFromOptions]
  );

  const handleImageChange = useCallback(
    (index, file) => {
      const updatedImages = [...images];
      updatedImages[index] = file;
      setImages(updatedImages);
    },
    [images]
  );

  const addImage = useCallback(() => {
    setImages([...images, null]);
  }, [images]);

  const removeImage = useCallback(
    (index) => {
      if (images.length > 1) {
        setImages(images.filter((_, i) => i !== index));
      }
    },
    [images]
  );

  const generateHandle = useCallback(() => {
    if (formData.title) {
      const handle = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, handle }));
    }
  }, [formData.title]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();

      // Add product data as JSON string
      const productData = {
        title: formData.title,
        body_html: formData.body_html,
        vendor: formData.vendor,
        product_type: formData.product_type,
        tags: formData.tags,
        status: formData.status,
        handle: formData.handle || formData.title.toLowerCase().replace(/\s+/g, "-"),
        published_scope: formData.published_scope,
        variants: variants.map((variant, index) => ({
          title: variant.title,
          price: variant.price,
          compare_at_price: variant.compare_at_price || null,
          sku: variant.sku,
          inventory_quantity: parseInt(variant.inventory_quantity) || 0,
          weight: parseFloat(variant.weight) || 0,
          weight_unit: variant.weight_unit,
          grams: parseInt(variant.grams) || 0,
          option1: variant.option1,
          position: index + 1,
          taxable: true,
          requires_shipping: true,
          inventory_policy: "deny",
          fulfillment_service: "manual",
          inventory_management: "shopify",
        })),
        options: options.map((option) => ({
          name: option.name,
          values: option.values.filter((v) => v.trim() !== ""),
        })),
      };

      // Separate new file uploads from existing image URLs
      const existingImages = [];
      images.forEach((image, index) => {
        if (image instanceof File) {
          // New file upload - will be sent as file
          formDataToSend.append('images', image);
        } else if (image && typeof image === 'string' && image.trim() !== '') {
          // Existing image URL - keep it
          existingImages.push({
            src: image,
            position: index + 1,
          });
        }
      });

      // Add existing images to product data
      if (existingImages.length > 0) {
        productData.images = existingImages;
      }

      formDataToSend.append('productData', JSON.stringify(productData));

      try {
        setLoadingText(true);
        dispatch(setLoading(true));
        const response = await updateProduct(productId, formDataToSend);
        toast.success(response.message || "Product updated successfully");
        onUpdate();
        onClose();
      } catch (error) {
        console.error("Error updating product:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to update product");
      } finally {
        setLoadingText(false);
        dispatch(setLoading(false));
      }
    },
    [formData, variants, options, images, productId, onUpdate, onClose]
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
        <Header onClose={onClose} hasChanges={hasChanges} loading={loadingText} handleSubmit={handleSubmit} />

        {/* Scrollable Content */}
        <ScrollableContent formData={formData} variants={variants} options={options} images={images} handleInputChange={handleInputChange} handleVariantChange={handleVariantChange} addVariant={addVariant} removeVariant={removeVariant} handleOptionChange={handleOptionChange} handleOptionValueChange={handleOptionValueChange} addOptionValue={addOptionValue} removeOptionValue={removeOptionValue} handleImageChange={handleImageChange} addImage={addImage} removeImage={removeImage} generateHandle={generateHandle} handleSubmit={handleSubmit} loading={loadingText} />
      </div>
    </div>
  );
}

export default EditProductModal;

