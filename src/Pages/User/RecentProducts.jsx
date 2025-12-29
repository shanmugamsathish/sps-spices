import React from 'react'
import ProductCard from '../../Components/ProductCard'
import { useSelector } from 'react-redux'

function RecentProducts() {
  const products = useSelector((state) => state.products.products);
  return (
    <div>
      <ProductCard productsList={products} horizontal={true} />
    </div>
  )
}

export default RecentProducts
