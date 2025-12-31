import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        cart: null, // Store cart data
        cartQuantities: {}, // Map of variantId -> quantity in cart
    },
    reducers: {
        // Set products
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        // Update product inventory
        updateProductInventory: (state, action) => {
            // action.payload: { variantId, quantity } - quantity to subtract from inventory
            const { variantId, quantity } = action.payload;
            
            state.products = state.products.map(product => {
                if (product.variants && Array.isArray(product.variants)) {
                    const updatedVariants = product.variants.map(variant => {
                        // Check if this variant matches (by id or admin_graphql_api_id)
                        const matches = variant.id === variantId || 
                                       variant.admin_graphql_api_id === variantId ||
                                       `gid://shopify/ProductVariant/${variant.id}` === variantId;
                        
                        if (matches && variant.inventory_quantity !== undefined) {
                            return {
                                ...variant,
                                inventory_quantity: Math.max(0, variant.inventory_quantity - quantity)
                            };
                        }
                        return variant;
                    });
                    
                    return {
                        ...product,
                        variants: updatedVariants
                    };
                }
                return product;
            });
        },
        // Update product inventory from cart
        updateInventoryFromCart: (state, action) => {
            const cart = action.payload;
            
            if (!cart || !cart.lines || !cart.lines.edges) {
                return;
            }
            
            // Store cart data in state
            state.cart = cart;
            
            // Build cart quantities map
            const cartQuantities = {};
            cart.lines.edges.forEach(edge => {
                const variantId = edge.node.merchandise?.id;
                const quantity = edge.node.quantity;
                if (variantId && quantity) {
                    cartQuantities[variantId] = quantity;
                }
            });
            state.cartQuantities = cartQuantities;
            
            // Update product inventory
            state.products = state.products.map(product => {
                if (product.variants && Array.isArray(product.variants)) {
                    const updatedVariants = product.variants.map(variant => {
                        // Try to match variant by different ID formats
                        const variantGraphQLId = variant.admin_graphql_api_id || 
                                                  (variant.id && typeof variant.id === 'string' && variant.id.startsWith('gid://') 
                                                    ? variant.id 
                                                    : `gid://shopify/ProductVariant/${variant.id}`);
                        
                        const cartQuantity = cartQuantities[variantGraphQLId];
                        
                        if (cartQuantity !== undefined && variant.inventory_quantity !== undefined) {
                            // Subtract cart quantity from inventory
                            return {
                                ...variant,
                                inventory_quantity: Math.max(0, variant.inventory_quantity - cartQuantity)
                            };
                        }
                        return variant;
                    });
                    
                    return {
                        ...product,
                        variants: updatedVariants
                    };
                }
                return product;
            });
        },
        
        // Set cart
        setCart: (state, action) => {
            // Store cart data
            state.cart = action.payload;
            
            // Build cart quantities map
            if (action.payload && action.payload.lines && action.payload.lines.edges) {
                const cartQuantities = {};
                action.payload.lines.edges.forEach(edge => {
                    const variantId = edge.node.merchandise?.id;
                    const quantity = edge.node.quantity;
                    if (variantId && quantity) {
                        cartQuantities[variantId] = quantity;
                    }
                });
                state.cartQuantities = cartQuantities;
            }
        },
        
        // Clear cart
        clearCart: (state) => {
            state.cart = null;
            state.cartQuantities = {};
        },
    },
});

export const { setProducts, updateProductInventory, updateInventoryFromCart, setCart, clearCart } = productSlice.actions;

// Selectors to get cart quantities
export const selectCart = (state) => state.products.cart;
export const selectCartQuantities = (state) => state.products.cartQuantities;

// Get total items count in cart
export const selectCartItemsCount = (state) => {
    const cart = state.products.cart;
    if (!cart || !cart.lines || !cart.lines.edges) return 0;
    return cart.lines.edges.reduce((total, edge) => total + (edge.node.quantity || 0), 0);
};

// Get quantity for a specific variant
export const selectVariantCartQuantity = (variantId) => (state) => {
    const cartQuantities = state.products.cartQuantities;
    if (!cartQuantities) return 0;
    
    // Try exact match first
    if (cartQuantities[variantId]) {
        return cartQuantities[variantId];
    }
    
    // Try matching by GraphQL ID format
    const variantGraphQLId = variantId.startsWith('gid://') 
        ? variantId 
        : `gid://shopify/ProductVariant/${variantId}`;
    
    return cartQuantities[variantGraphQLId] || 0;
};

export default productSlice.reducer;