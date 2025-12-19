import React from 'react'

import theme from '../../../lib/theme';
import ProductImages from '../../AdminAddProductComponent/ProductImages';
import ProductVarient from '../../AdminAddProductComponent/ProductVarient';
import ProductOptions from '../../AdminAddProductComponent/ProductOptions';
import BasicInfo from '../../AdminAddProductComponent/BasicInfo';

function ScrollableContent({ formData, variants, options, images, handleInputChange, handleVariantChange, addVariant, removeVariant, handleOptionChange, handleOptionValueChange, addOptionValue, removeOptionValue, handleImageChange, addImage, removeImage, generateHandle, handleSubmit, loading }) {
  return (
    <div className="overflow-y-auto flex-1 p-4 sm:p-6">
    {loading && !formData.title ? (
      <div className="flex justify-center items-center py-12">
        <div style={{ color: theme.colors.text.primary }}>Loading product data...</div>
      </div>
    ) : (
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
      </form>
    )}
  </div>
  )
}

export default ScrollableContent
