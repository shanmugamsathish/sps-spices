import React from 'react'

import theme from '../../../lib/theme';
import BasicInformation from '../../AdminAddCustomerComponent/BasicInformation';
import Address from '../../AdminAddCustomerComponent/Address';

function ScrollableContent({ formData, addresses, addAddress, removeAddress, handleAddressChange, handleInputChange, generateHandle, handleSubmit, loading }) {
  return (
    <div className="overflow-y-auto flex-1 p-4 sm:p-6">
    {loading && !formData.title ? (
      <div className="flex justify-center items-center py-12">
        <div style={{ color: theme.colors.text.primary }}>Loading customer data...</div>
      </div>
    ) : (
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Customer Information */}
        <BasicInformation
          formData={formData}
          handleInputChange={handleInputChange}
          generateHandle={generateHandle}
        />

        {/* Addresses */}
        <Address
          addresses={addresses}
          addAddress={addAddress}
          removeAddress={removeAddress}
          handleAddressChange={handleAddressChange}
        />
      </form>
    )}
  </div>
  )
}

export default ScrollableContent
