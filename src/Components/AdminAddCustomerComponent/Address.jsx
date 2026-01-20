import React from "react";
import theme from "../../lib/theme";
import { Plus, Trash2, MapPin } from "lucide-react";
import AddressSelectionModal from "../AddressSelectionModal";

function Address({
  addresses,
  addAddress,
  removeAddress,
  handleAddressChange,
  isPaymentPage,
  validationErrors = {},
  isAddressModalOpen = false,
  setIsAddressModalOpen,
  handleSelectAddress,
  states = [],
}) {
  return (
    <div
      className="p-6 rounded-lg shadow-sm"
      style={{
        backgroundColor: "#FFFFFF",
        border: `1px solid ${theme.colors.border.light}`,
      }}
    >
      <div className="flex items-center justify-between mb-6">
        {isPaymentPage ? (
           <h2
            className="text-xl font-semibold"
            style={{ color: theme.colors.text.primary }}
          >
            Shipping Addresses
          </h2> 
        ) : (
          <h2
            className="text-xl font-semibold"
            style={{ color: theme.colors.text.primary }}
          >
            Addresses (Optional)
          </h2>
        )}
         {isPaymentPage ? (
           addresses.length > 1 && setIsAddressModalOpen ? (
             <button
               type="button"
               onClick={() => setIsAddressModalOpen(true)}
               className="flex items-center gap-2 px-4 py-2 rounded-md text-white text-sm font-medium transition-colors"
               style={{ backgroundColor: theme.colors.accent.primary }}
               onMouseEnter={(e) => {
                 e.target.style.backgroundColor = theme.colors.accent.hover;
               }}
               onMouseLeave={(e) => {
                 e.target.style.backgroundColor = theme.colors.accent.primary;
               }}
             >
               <MapPin className="w-4 h-4" />
               Choose Address
             </button>
           ) : null
        ) : (
        <button
          type="button"
          onClick={addAddress}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-white text-sm font-medium transition-colors"
          style={{ backgroundColor: theme.colors.accent.primary }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = theme.colors.accent.hover;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = theme.colors.accent.primary;
          }}
        >
          <Plus className="w-4 h-4" />
          Add Address
        </button>
        )}
      </div>

      <div className="space-y-6">
        {(isPaymentPage ? (addresses[0] ? [addresses[0]] : []) : addresses).map((address, index) => {
          // For payment page, always use index 0 for the displayed address
          const actualIndex = isPaymentPage ? 0 : index;
          // Handle nested error structure (for EditCustomerModal) or flat structure (for PaymentPage)
          const addressErrors = validationErrors[actualIndex] || validationErrors || {};
          return (
          <div
            key={actualIndex}
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: theme.colors.background.main,
              borderColor: theme.colors.border.light,
            }}
          >
            {!isPaymentPage && (
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-md font-semibold"
                  style={{ color: theme.colors.text.primary }}
                >
                  Address {actualIndex + 1}
                </h3>
                {addresses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAddress(actualIndex)}
                    className="p-2 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                    title="Remove Address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.colors.text.secondary }}
                >
                  First Name {isPaymentPage && <span style={{ color: "#DC2626" }}>*</span>}
                </label>
                <input
                  type="text"
                  value={address.first_name}
                  onChange={(e) =>
                    handleAddressChange(actualIndex, "first_name", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: addressErrors.first_name ? "#DC2626" : theme.colors.border.light,
                    color: theme.colors.text.primary,
                  }}
                  placeholder="Enter first name"
                />
                {addressErrors.first_name && (
                  <p className="mt-1 text-sm" style={{ color: "#DC2626" }}>
                    {addressErrors.first_name}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.colors.text.secondary }}
                >
                  Last Name {isPaymentPage && <span style={{ color: "#DC2626" }}>*</span>}
                </label>
                <input
                  type="text"
                  value={address.last_name}
                  onChange={(e) =>
                    handleAddressChange(actualIndex, "last_name", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: addressErrors.last_name ? "#DC2626" : theme.colors.border.light,
                    color: theme.colors.text.primary,
                  }}
                  placeholder="Enter last name"
                />
                {addressErrors.last_name && ( 
                  <p className="mt-1 text-sm" style={{ color: "#DC2626" }}>
                    {addressErrors.last_name}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.colors.text.secondary }}
                >
                  Company
                </label>
                <input
                  type="text"
                  value={address.company}
                  onChange={(e) =>
                    handleAddressChange(actualIndex, "company", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: theme.colors.border.light,
                    color: theme.colors.text.primary,
                  }}
                  placeholder="Enter company name"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.colors.text.secondary }}
                >
                  Address Line 1 {isPaymentPage && <span style={{ color: "#DC2626" }}>*</span>}
                </label>
                <input
                  type="text"
                  value={address.address1}
                  onChange={(e) =>
                    handleAddressChange(actualIndex, "address1", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: addressErrors.address1 ? "#DC2626" : theme.colors.border.light,
                    color: theme.colors.text.primary,
                  }}
                  placeholder="Street address"
                />
                {addressErrors.address1 && ( 
                  <p className="mt-1 text-sm" style={{ color: "#DC2626" }}>
                    {addressErrors.address1}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.colors.text.secondary }}
                >
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={address.address2}
                  onChange={(e) =>
                    handleAddressChange(actualIndex, "address2", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: theme.colors.border.light,
                    color: theme.colors.text.primary,
                  }}
                  placeholder="Apartment, suite, etc."
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.colors.text.secondary }}
                >
                  City {isPaymentPage && <span style={{ color: "#DC2626" }}>*</span>}
                </label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) =>
                    handleAddressChange(actualIndex, "city", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: addressErrors.city ? "#DC2626" : theme.colors.border.light,
                    color: theme.colors.text.primary,
                  }}
                  placeholder="Enter city"
                />
                {addressErrors.city && ( 
                  <p className="mt-1 text-sm" style={{ color: "#DC2626" }}>
                    {addressErrors.city}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.colors.text.secondary }}
                >
                  State/Province {isPaymentPage && <span style={{ color: "#DC2626" }}>*</span>}
                </label>
                <select
                  value={address.province || ""}
                  onChange={(e) =>
                    handleAddressChange(actualIndex, "province", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: addressErrors.province ? "#DC2626" : theme.colors.border.light,
                    color: theme.colors.text.primary,
                  }}
                >
                  <option value="">Select State/Province</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {addressErrors.province && ( 
                  <p className="mt-1 text-sm" style={{ color: "#DC2626" }}>
                    {addressErrors.province}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.colors.text.secondary }}
                >
                  Country {isPaymentPage && <span style={{ color: "#DC2626" }}>*</span>}
                </label>
                <input
                  type="text"
                  value={address.country}
                  onChange={(e) =>
                    handleAddressChange(actualIndex, "country", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: addressErrors.country ? "#DC2626" : theme.colors.border.light,
                    color: theme.colors.text.primary,
                  }}
                  placeholder="Enter country"
                />
                {addressErrors.country && ( 
                  <p className="mt-1 text-sm" style={{ color: "#DC2626" }}>
                    {addressErrors.country}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.colors.text.secondary }}
                >
                  ZIP/Postal Code {isPaymentPage && <span style={{ color: "#DC2626" }}>*</span>}
                </label>
                <input
                  type="text"
                  value={address.zip}
                  onChange={(e) =>
                    handleAddressChange(actualIndex, "zip", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: addressErrors.zip ? "#DC2626" : theme.colors.border.light,
                    color: theme.colors.text.primary,
                  }}
                  placeholder="Enter ZIP code"
                />
                {addressErrors.zip && ( 
                  <p className="mt-1 text-sm" style={{ color: "#DC2626" }}>
                    {addressErrors.zip}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.colors.text.secondary }}
                >
                  Phone
                </label>
                <input
                  type="tel"
                  value={address.phone}
                  onChange={(e) =>
                    handleAddressChange(actualIndex, "phone", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: addressErrors.phone ? "#DC2626" : theme.colors.border.light,
                    color: theme.colors.text.primary,
                  }}
                  placeholder="+91 1234567890"
                />
                {addressErrors.phone && ( 
                  <p className="mt-1 text-sm" style={{ color: "#DC2626" }}>
                    {addressErrors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {/* Address Selection Modal */}
      <AddressSelectionModal isPaymentPage={isPaymentPage} isAddressModalOpen={isAddressModalOpen} setIsAddressModalOpen={setIsAddressModalOpen} handleSelectAddress={handleSelectAddress} addresses={addresses} theme={theme} />
    </div>
  );
}

export default Address;
