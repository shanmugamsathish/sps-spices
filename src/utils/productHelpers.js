// Check if a product belongs to a specific collection
export const isProductInCollection = (product, collectionName) => {
  if (!product || !collectionName) return false;

  // Check if product has collections array
  if (product.collections && Array.isArray(product.collections)) {
    return product.collections.some(
      (col) => col.title?.toLowerCase() === collectionName.toLowerCase() ||
               col.handle?.toLowerCase() === collectionName.toLowerCase().replace(/\s+/g, '-')
    );
  }

  // Check if product has collection_ids
  if (product.collection_ids && Array.isArray(product.collection_ids)) {
    return false;
  }

  // Check product tags for collection indicator (if used as fallback)
  if (product.tags && Array.isArray(product.tags)) {
    return product.tags.some(
      (tag) => tag.toLowerCase().includes(collectionName.toLowerCase())
    );
  }

  return false;
};

// Check if product is refrigerated
export const isRefrigeratedProduct = (product) => {
  return isProductInCollection(product, 'Refrigerated');
};

// Extract numeric product ID from GraphQL ID
export const getNumericProductId = (productId) => {
  if (!productId) return null;
  
  if (typeof productId === 'number') {
    return String(productId);
  }

  if (productId.startsWith('gid://shopify/Product/')) {
    return productId.split('/').pop();
  }

  return String(productId);
};


