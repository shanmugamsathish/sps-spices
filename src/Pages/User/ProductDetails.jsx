import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductById } from '../../apiCalls/products'
import { ShoppingCart } from 'lucide-react'
import theme from '../../lib/theme'
import { setLoading } from '../../redux/loaderSlice'
import { useDispatch } from 'react-redux'

function ProductDetails({ userPage }) {
  console.log('userPage in ProductDetails', userPage);
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loadingText, setLoadingText] = useState(true)
  const dispatch = useDispatch()
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoadingText(true)
        dispatch(setLoading(true))
        const response = await getProductById(id)
        const productData = response?.product?.product || response?.product || response
        setProduct(productData)
        // Set first variant as default
        if (productData?.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0])
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoadingText(false)
        dispatch(setLoading(false))
      }
    }
    fetchProduct()
  }, [id, dispatch])

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant)
    setQuantity(1) // Reset quantity when variant changes
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (selectedVariant?.inventory_quantity || 10)) {
      setQuantity(newQuantity)
    }
  }

  const formatPrice = (price) => {
    return parseFloat(price || 0).toFixed(2)
  }

  const getProductImage = () => {
    return product?.image?.src || product?.images?.[0]?.src || ''
  }

  const parseHTML = (htmlString) => {
    // Extract text and list items from HTML
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, 'text/html')
    const paragraphs = Array.from(doc.querySelectorAll('p')).map(p => p.textContent)
    const listItems = Array.from(doc.querySelectorAll('li')).map(li => li.textContent.replace(/✔|✓/g, '✓'))
    return { paragraphs, listItems }
  }

  if (loadingText) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: theme.colors.background.main }}>
        <p style={{ color: theme.colors.text.primary }}>Loading Product Details...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: theme.colors.background.main }}>
        <p style={{ color: theme.colors.text.primary }}>Product not found</p>
      </div>
    )
  }

  const { paragraphs, listItems } = parseHTML(product.body_html || '')
  const productImage = getProductImage()
  const currentPrice = selectedVariant?.price || '0.00'
  const comparePrice = selectedVariant?.compare_at_price || null
  const hasDiscount = comparePrice && comparePrice !== currentPrice

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: theme.colors.background.main }}>
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
          <div className="flex justify-center items-start lg:sticky lg:top-6">
            <div className="w-full">
              <div 
                className="w-full rounded-lg overflow-hidden shadow-md cursor-zoom-in"
                style={{ 
                  border: `1px solid ${theme.colors.border.light}`,
                  backgroundColor: '#fff',
                  aspectRatio: '1 / 1',
                  maxHeight: '600px'
                }}
              >
                <img
                  src={productImage}
                  alt={product.title || 'Product'}
                  className="w-full h-full object-contain p-4 transition-transform duration-500 ease-in-out hover:scale-150"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:gap-5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight" style={{ color: theme.colors.text.primary }}>
              {product.title}
            </h1>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold" style={{ color: theme.colors.text.primary }}>
                Rs. {formatPrice(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-lg sm:text-xl line-through opacity-60" style={{ color: theme.colors.text.secondary }}>
                  Rs. {formatPrice(comparePrice)}
                </span>
              )}
            </div>

            {product.options && product.options.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="text-base sm:text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
                  Weight
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => {
                    const optionValue = variant.option1 || variant.title
                    const isSelected = selectedVariant?.id === variant.id
                    return (
                      <button
                        key={variant.id}
                        onClick={() => handleVariantSelect(variant)}
                        className="px-5 py-2 rounded-md font-medium transition-all duration-200 text-sm sm:text-base"
                        style={{
                          backgroundColor: isSelected ? theme.colors.accent.primary : 'transparent',
                          color: isSelected ? theme.colors.background.main : theme.colors.text.primary,
                          border: `1px solid ${theme.colors.text.primary}`,
                        }}
                      >
                        {optionValue}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <span className="text-base sm:text-lg font-semibold whitespace-nowrap" style={{ color: theme.colors.text.primary }}>
                Quantity:
              </span>
              <div className="flex items-center border-2 rounded-md overflow-hidden" style={{ borderColor: theme.colors.border.light }}>
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-2 font-bold text-lg hover:opacity-70 transition-opacity"
                  style={{ 
                    color: theme.colors.text.primary,
                    backgroundColor: theme.colors.background.main
                  }}
                >
                  -
                </button>
                <span className="px-4 py-2 font-semibold text-base min-w-[50px] text-center" style={{ 
                  color: theme.colors.text.primary,
                  backgroundColor: theme.colors.background.main,
                  borderLeft: `1px solid ${theme.colors.border.light}`,
                  borderRight: `1px solid ${theme.colors.border.light}`
                }}>
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-2 font-bold text-lg hover:opacity-70 transition-opacity"
                  style={{ 
                    color: theme.colors.text.primary,
                    backgroundColor: theme.colors.background.main
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold hover:opacity-90 transition-opacity flex-1 sm:flex-none"
                style={{
                  backgroundColor: theme.colors.accent.primary,
                  color: theme.colors.background.main,
                }}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to cart
              </button>
              <button
                className="px-6 py-3 rounded-md font-semibold hover:opacity-90 transition-opacity flex-1 sm:flex-none"
                style={{
                  backgroundColor: theme.colors.accent.primary,
                  color: theme.colors.background.main,
                }}
              >
                Buy it now
              </button>
            </div>

            <div className="border-t pt-4" style={{ borderColor: theme.colors.border.light }}></div>

            {paragraphs.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="text-base sm:text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
                  Description
                </h3>
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: theme.colors.text.secondary }}>
                  {paragraphs.join(' ')}
                </p>
              </div>
            )}

            {listItems.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="text-base sm:text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
                  Key Features
                </h3>
                {listItems.map((item, index) => (
                  <div key={index}>
                    <span className="text-sm sm:text-base leading-relaxed" style={{ color: theme.colors.text.secondary }}>
                      {item.trim()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails