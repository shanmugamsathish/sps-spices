import React from 'react'
import ProductCard from '../../Components/ProductCard'
import { useSelector } from 'react-redux'
import theme from '../../lib/theme'

function RecentProducts() {
  const products = useSelector((state) => state.products.products);
  return (
    <div>
        <div className="flex justify-between items-center container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase">
          <span
            className="border-b-4 pb-1"
            style={{ borderColor: theme.colors.accent.primary }}
          >
            Latest
          </span>{" "}
          Products
        </h1>
        </div>
      <ProductCard productsList={products} horizontal={true} />
    </div>
  )
}

export default RecentProducts
