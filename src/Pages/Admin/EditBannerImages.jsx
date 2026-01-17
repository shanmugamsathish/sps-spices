import React, { useEffect, useState } from 'react'
import BannerImages from '../../Components/AdminBannerImages/BannerImages'
import { getBannerImages, updateBannerImages } from '../../apiCalls/bannerImage'
import theme from '../../lib/theme'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { setLoading } from '../../redux/loaderSlice'
import { useSelector, useDispatch } from 'react-redux'

function EditBannerImages() {
  const [images, setImages] = useState([])
  const [productId, setProductId] = useState(null)
  const [updating, setUpdating] = useState(false)
  const { loading } = useSelector(state => state.loader)
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchBannerImages = async () => {
      try {
        dispatch(setLoading(true))
        const response = await getBannerImages()
        if (response && response.products && response.products.length > 0) {
          const bannerProduct = response.products[0]
          setProductId(bannerProduct.id)
          if (bannerProduct.images && bannerProduct.images.length > 0) {
            setImages(bannerProduct.images.map((img) => img.src || null))
          } else {
            setImages([null])
          }
        } else {
          toast.error('No banner images found')
        }
        dispatch(setLoading(false))
      } catch (error) {
        console.error("Error fetching banner images:", error)
        toast.error('Failed to fetch banner images')
        dispatch(setLoading(false))
      }
    }
    fetchBannerImages()
  }, [dispatch])

  const handleImageChange = (index, file) => {
    if (!file) return
    
    const updatedImages = [...images]
    updatedImages[index] = file
    setImages(updatedImages)
  }

  const addImage = () => {
    setImages([...images, null]) 
  }

  const removeImage = (index) => {
    const validImagesCount = images.filter(img => img !== null && img !== undefined && img !== '').length
    
    if (validImagesCount <= 1) {
      toast.error('At least one banner image is required for the hero section')
      return
    }
    
    if (window.confirm('Are you sure you want to remove this banner image?')) {
      setImages(images.filter((_, i) => i !== index))
    }
  }

  const handleUpdateImages = async () => {
    if (!productId) {
      toast.error('Product ID not found')
      return
    }

    const validImages = images.filter(img => img !== null && img !== undefined && img !== '')
    if (validImages.length === 0) {
      toast.error('Please add at least one banner image')
      return
    }

    try {
      dispatch(setLoading(true))
      setUpdating(true)
      
      const formData = new FormData()
      
      const existingImages = []
      
      images.forEach((image, index) => {
        if (image instanceof File) {
          formData.append('images', image)
        } else if (image && typeof image === 'string' && image.trim() !== '') {
          existingImages.push({
            src: image,
            position: index + 1,
          })
        }
      })

      const productData = {}
      if (existingImages.length > 0) {
        productData.images = existingImages
      }

      formData.append('productData', JSON.stringify(productData))

      const response = await updateBannerImages(productId, formData)
      
      if (response && (response.success || response.message || response.product) && !response.error) {
        const updatedProduct = response.product || response
        
        if (updatedProduct && updatedProduct.images && Array.isArray(updatedProduct.images)) {
          setImages(updatedProduct.images.map((img) => img.src || null))
        }
        
        toast.success(response.message || 'Banner images updated successfully!')
      } else {
        toast.error(response?.message || response?.error || 'Failed to update banner images')
      }
    } catch (error) {
      console.error("Error updating images:", error)
      toast.error(error.response?.data?.message || 'An error occurred while updating images')
    } finally {
      dispatch(setLoading(false))
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg" style={{ color: theme.colors.text.secondary }}>
          Loading banner images...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: theme.colors.background.secondary }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: theme.colors.text.primary }}>
            Edit Banner Images
          </h1>
          <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
            Manage the banner images displayed on your homepage carousel
          </p>
        </div>

              {/* Add Image Button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={addImage}
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all hover:shadow-lg"
          style={{ 
            backgroundColor: theme.colors.accent.primary,
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = theme.colors.accent.hover;
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = theme.colors.accent.primary;
            e.target.style.transform = 'translateY(0)';
          }}
        >
          <Plus className="w-5 h-5" />
          Add New
        </button>
      </div>
      </div>

        {/* Banner Images Component */}
        <BannerImages
          images={images}
          handleImageChange={handleImageChange}
          addImage={addImage}
          removeImage={removeImage}
          handleUpdateImages={handleUpdateImages}
        />

        {/* Update Button */}
        <div className="mt-6 flex justify-between items-center">
          <span className="text-sm" style={{ color: theme.colors.text.secondary }}>
            Note: Click the Update Banner Images button after completing your changes to ensure they are saved.
          </span>
          <button
            type="button"
            onClick={handleUpdateImages}
            disabled={updating || loading}
            className="px-6 py-3 rounded-lg text-white font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
            {updating ? 'Updating...' : 'Update Banner Images'}
          </button>
        </div>

        {/* Updating Indicator */}
        {updating && (
          <div className="mt-6 text-center">
            <span className="text-sm" style={{ color: theme.colors.text.secondary }}>
              Updating banner images...
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default EditBannerImages
