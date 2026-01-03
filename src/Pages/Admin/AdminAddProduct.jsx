import React, { useState, useCallback } from "react";
import theme from "../../lib/theme";
import { createProduct } from "../../apiCalls/products";
import BasicInfo from "../../Components/AdminAddProductComponent/BasicInfo";
import ProductVarient from "../../Components/AdminAddProductComponent/ProductVarient";
import ProductOptions from "../../Components/AdminAddProductComponent/ProductOptions";
import ProductImages from "../../Components/AdminAddProductComponent/ProductImages";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loaderSlice";

function AdminAddProduct() {
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

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleVariantChange = useCallback((index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    const weightValue = parseFloat(updatedVariants[index].weight);
    if (!isNaN(weightValue) && weightValue > 0) {
      const weightUnit = updatedVariants[index].weight_unit;
      
      if (field === "weight" || field === "weight_unit") {
        if (weightUnit === "kg") {
          updatedVariants[index].grams = (weightValue * 1000).toString();
        } else if (weightUnit === "g") {
          updatedVariants[index].grams = weightValue.toString();
        } else if (weightUnit === "mg") {
          updatedVariants[index].grams = (weightValue / 1000).toString();
        } else if (weightUnit === "lb") {
          updatedVariants[index].grams = (weightValue * 453.592).toString();
        } else if (weightUnit === "oz") {
          updatedVariants[index].grams = (weightValue * 28.3495).toString();
        }
      }
    } 
    setVariants(updatedVariants);
  }, [variants]);

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

  // Helper function to generate variants from options
  const generateVariantsFromOptions = useCallback(
    (updatedOptions, currentVariants) => {
      if (updatedOptions.length > 0 && updatedOptions[0].values) {
        // Get the first option's non-empty values
        const optionValues = updatedOptions[0].values.filter(
          (v) => v.trim() !== ""
        );

        if (optionValues.length > 0) {
          // Generate variants based on option values
          return optionValues.map((value, index) => {
            // Check if variant already exists at this index
            const existingVariant = currentVariants[index];

            if (existingVariant && existingVariant.option1 === value) {
              // Variant already exists with correct option value, preserve all data
              return existingVariant;
            } else if (existingVariant) {
              // Variant exists but option value changed, update option1 and title
              return {
                ...existingVariant,
                option1: value,
                title: formData.title ? `${formData.title} - ${value}` : value,
                // sku should be the product title with first 3 letters capital + 001, 002, 003, etc.
                sku: formData.title ? `${formData.title.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(3, '0')}` : value,
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
      // If no option values, return at least one empty variant
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

      // Auto-generate variants when option values change
      if (optionIndex === 0) {
        const newVariants = generateVariantsFromOptions(
          updatedOptions,
          variants
        );
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

      // Auto-generate variants when option values are added
      if (optionIndex === 0) {
        const newVariants = generateVariantsFromOptions(
          updatedOptions,
          variants
        );
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

        // Auto-generate variants when option values are removed
        if (optionIndex === 0) {
          const newVariants = generateVariantsFromOptions(
            updatedOptions,
            variants
          );
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

  const isFormValid = useCallback(() => {
    if (!formData.title?.trim() || 
        !formData.vendor?.trim() || 
        !formData.product_type?.trim() ||
        !formData.status?.trim() || 
        !formData.body_html?.trim()) {
      return false;
    }

    if (options.length === 0 || 
        options.some(option => !option.name?.trim() || 
        !option.values || 
        option.values.length === 0 || 
        option.values.every(v => !v?.trim()))) {
      return false;
    }

    if (variants.length === 0) {
      return false;
    }

    const hasInvalidVariant = variants.some(variant => 
      !variant.title?.trim() || 
      !variant.price?.trim() || 
      !variant.sku?.trim() || 
      variant.inventory_quantity === "" || 
      variant.inventory_quantity === null ||
      variant.inventory_quantity === undefined ||
      !variant.weight?.trim() || 
      !variant.weight_unit?.trim()
    );

    if (hasInvalidVariant) {
      return false;
    }

    const hasImage = images.some(image => image instanceof File);
    if (!hasImage) {
      return false;
    }

    return true;
  }, [formData.title, formData.vendor, formData.product_type, formData.status, formData.body_html, options, variants, images]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!isFormValid()) {
        toast.error("Please fill in all required fields");
        return;
      }

      dispatch(setLoading(true));

      const formDataToSend = new FormData();

      const productData = {
        title: formData.title,
        body_html: formData.body_html,
        vendor: formData.vendor,
        product_type: formData.product_type,
        tags: formData.tags,
        status: formData.status,
        handle:
          formData.handle || formData.title.toLowerCase().replace(/\s+/g, "-"),
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

      formDataToSend.append('productData', JSON.stringify(productData));

      // Add image files
      images.forEach((image) => {
        if (image instanceof File) {
          formDataToSend.append('images', image);
        }
      });

      try {
        const response = await createProduct(formDataToSend);
        if (response) {
          dispatch(setLoading(false));
          toast.success(response.message);
        } else {
          dispatch(setLoading(false));
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Error creating product:", error);
        dispatch(setLoading(false));
        toast.error(error.message);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [formData, variants, options, images, dispatch]
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1
          className="text-3xl md:text-4xl font-bold mb-8"
          style={{ color: theme.colors.text.primary }}
        >
          Add New Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Product Information */}
          <BasicInfo
            formData={formData}
            handleInputChange={handleInputChange}
            generateHandle={generateHandle}
          />

          {/* Product Options */}
          <ProductOptions
            options={options}
            handleOptionChange={handleOptionChange}
            addOptionValue={addOptionValue}
            removeOptionValue={removeOptionValue}
            handleOptionValueChange={handleOptionValueChange}
          />

          {/* Product Variants */}
          <ProductVarient
            variants={variants}
            handleVariantChange={handleVariantChange}
            addVariant={addVariant}
            removeVariant={removeVariant}
          />

          {/* Product Images */}
          <ProductImages
            images={images}
            handleImageChange={handleImageChange}
            addImage={addImage}
            removeImage={removeImage}
          />

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-6 py-3 rounded-md font-medium transition-colors cursor-pointer"
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
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminAddProduct;
