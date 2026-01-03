import React, { useState, useEffect, useCallback } from 'react'
import { getFavourites } from '../../apiCalls/favourites'
import { useDispatch } from 'react-redux'
import { setLoading } from '../../redux/loaderSlice'
import toast from 'react-hot-toast'
import ProductCard from '../../Components/ProductCard'
import RecentProducts from '../User/RecentProducts'
import theme from '../../lib/theme'
import { TITLES } from '../../lib/constant'

function AddToWishlist() {
  const dispatch = useDispatch()
  const [favourites, setFavourites] = useState([])

  const fetchFavourites = useCallback(async () => {
    dispatch(setLoading(true))
    try {
      const res = await getFavourites()
      if (res?.success) {
        setFavourites(res.favorites || [])
      } else {
        setFavourites([])
      }
    } catch (err) {
      console.error('Error fetching favourites:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load favorites'
      toast.error(errorMessage)
      setFavourites([])
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  useEffect(() => {
    fetchFavourites()
  }, [fetchFavourites])

  return (
    <div className="container mx-auto  py-6 sm:py-8">
      <div >
        <h1 
          className="text-2xl sm:text-3xl lg:text-4xl font-bold mx-7"
          style={{ color: theme.colors.text.primary }}
        >
          {TITLES.WISHLIST.TITLE}
        </h1>
        {favourites.length > 0 && (
          <p 
            className="mt-2 text-sm sm:text-base opacity-80 mx-8"
            style={{ color: theme.colors.text.secondary }}
          >
            {favourites.length} {favourites.length === 1 ? 'item' : 'items'} in your wishlist
          </p>
        )}
      </div>

      {favourites.length === 0 ? (
        <div 
          className="flex flex-col items-center justify-center py-12 sm:py-16 rounded-lg"
          style={{
            backgroundColor: theme.colors.background.main,
            border: `1px solid ${theme.colors.border.light}`,
          }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-16 h-16 sm:w-20 sm:h-20 mb-4 opacity-50" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
            style={{ color: theme.colors.text.secondary }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <h2 
            className="text-xl sm:text-2xl font-semibold mb-2"
            style={{ color: theme.colors.text.primary }}
          >
            Your wishlist is empty
          </h2>
          <p 
            className="text-sm sm:text-base text-center max-w-md"
            style={{ color: theme.colors.text.secondary }}
          >
            Start adding products to your wishlist by clicking the heart icon on any product
          </p>
        </div>
      ) : (
        <ProductCard productsList={favourites} onFavoriteChange={fetchFavourites} />
      )}
    </div>
  )
}

export default AddToWishlist
