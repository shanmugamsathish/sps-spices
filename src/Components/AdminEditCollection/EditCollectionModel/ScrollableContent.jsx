import React from 'react'
import theme from '../../../lib/theme';
import BasicInformation from '../../AdminAddCollectionComponent/BasicInformation';
import CollectionType from '../../AdminAddCollectionComponent/CollectionType';
import CollectionImage from '../../AdminAddCollectionComponent/CollectionImage';

function ScrollableContent({ loadingText, formData, handleInputChange, generateHandle, handleSubmit, handleSearchChange, searchQuery, showAutocomplete, autocompleteResults, autocompleteRef, searchRef, openBrowseModal, selectedProducts, removeProduct, addRule, rules, handleRuleChange, removeRule, selectProductFromSearch, getProductImage, image, handleImageChange, removeImage, getImagePreview }) {
  return (
    <div className="overflow-y-auto flex-1 p-4 sm:p-6">
    {loadingText && !formData.title ? (
      <div className="flex justify-center items-center py-12">
        <div style={{ color: theme.colors.text.primary }}>Loading collection data...</div>
      </div>
    ) : (
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <BasicInformation 
          formData={formData} 
          handleInputChange={handleInputChange} 
          generateHandle={generateHandle} 
        />

        {/* Collection Type */}
        <CollectionType 
          formData={formData} 
          handleInputChange={handleInputChange} 
          handleSearchChange={handleSearchChange} 
          searchQuery={searchQuery} 
          showAutocomplete={showAutocomplete} 
          autocompleteResults={autocompleteResults} 
          autocompleteRef={autocompleteRef} 
          searchRef={searchRef} 
          openBrowseModal={openBrowseModal} 
          selectedProducts={selectedProducts} 
          removeProduct={removeProduct} 
          addRule={addRule} 
          rules={rules} 
          handleRuleChange={handleRuleChange} 
          removeRule={removeRule} 
          selectProductFromSearch={selectProductFromSearch} 
          getProductImage={getProductImage}
          isEditMode={true}
        />

        {/* Collection Image */}
        <CollectionImage 
          image={image} 
          handleImageChange={handleImageChange} 
          removeImage={removeImage} 
          getImagePreview={getImagePreview} 
        />
      </form>
    )}
  </div>
  )
}

export default ScrollableContent
