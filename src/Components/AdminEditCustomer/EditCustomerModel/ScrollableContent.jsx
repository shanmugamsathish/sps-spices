import React, { useState, useEffect } from 'react'
import theme from '../../../lib/theme';
import BasicInformation from '../../AdminAddCustomerComponent/BasicInformation';
import Address from '../../AdminAddCustomerComponent/Address';
import { fetchStates } from '../../../apiCalls/fetchstates';

function ScrollableContent({ formData, addresses, addAddress, removeAddress, handleAddressChange, handleInputChange, generateHandle, handleSubmit, loading, formErrors = {}, addressesErrors = {} }) {
  const [states, setStates] = useState([]);
  useEffect(() => {
    const fetchStatesData = async () => {
      try {
        const statesData = await fetchStates();
        if (statesData.success && Array.isArray(statesData.states)) {
          setStates(statesData.states);
        }
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
    fetchStatesData();
  }, []);
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
          validationErrors={formErrors}
        />

        {/* Addresses */}
        <Address
          addresses={addresses}
          addAddress={addAddress}
          removeAddress={removeAddress}
          handleAddressChange={handleAddressChange}
          states={states}
          validationErrors={addressesErrors}
        />
      </form>
    )}
  </div>
  )
}

export default ScrollableContent
