import React from 'react'
import theme from '../../lib/theme'
import { Plus, Trash2 } from "lucide-react";

function Address({ addresses, addAddress, removeAddress, handleAddressChange }) {
  return (
    <div
    className="p-6 rounded-lg shadow-sm"
    style={{
      backgroundColor: "#FFFFFF",
      border: `1px solid ${theme.colors.border.light}`,
    }}
  >
    <div className="flex items-center justify-between mb-6">
      <h2
        className="text-xl font-semibold"
        style={{ color: theme.colors.text.primary }}
      >
        Addresses (Optional)
      </h2>
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
    </div>

    <div className="space-y-6">
      {addresses.map((address, index) => (
        <div
          key={index}
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: theme.colors.background.main,
            borderColor: theme.colors.border.light,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-md font-semibold"
              style={{ color: theme.colors.text.primary }}
            >
              Address {index + 1}
            </h3>
            {addresses.length > 1 && (
              <button
                type="button"
                onClick={() => removeAddress(index)}
                className="p-2 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                title="Remove Address"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.colors.text.secondary }}
              >
                First Name
              </label>
              <input
                type="text"
                value={address.first_name}
                onChange={(e) => handleAddressChange(index, "first_name", e.target.value)}
                className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.primary,
                }}
                placeholder="Enter first name"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.colors.text.secondary }}
              >
                Last Name
              </label>
              <input
                type="text"
                value={address.last_name}
                onChange={(e) => handleAddressChange(index, "last_name", e.target.value)}
                className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.primary,
                }}
                placeholder="Enter last name"
              />
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
                onChange={(e) => handleAddressChange(index, "company", e.target.value)}
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
                Address Line 1
              </label>
              <input
                type="text"
                value={address.address1}
                onChange={(e) => handleAddressChange(index, "address1", e.target.value)}
                className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.primary,
                }}
                placeholder="Street address"
              />
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
                onChange={(e) => handleAddressChange(index, "address2", e.target.value)}
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
                City
              </label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => handleAddressChange(index, "city", e.target.value)}
                className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.primary,
                }}
                placeholder="Enter city"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.colors.text.secondary }}
              >
                State/Province
              </label>
              <input
                type="text"
                value={address.province}
                onChange={(e) => handleAddressChange(index, "province", e.target.value)}
                className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.primary,
                }}
                placeholder="Enter state/province"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.colors.text.secondary }}
              >
                Country
              </label>
              <input
                type="text"
                value={address.country}
                onChange={(e) => handleAddressChange(index, "country", e.target.value)}
                className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.primary,
                }}
                placeholder="Enter country"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.colors.text.secondary }}
              >
                ZIP/Postal Code
              </label>
              <input
                type="text"
                value={address.zip}
                onChange={(e) => handleAddressChange(index, "zip", e.target.value)}
                className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.primary,
                }}
                placeholder="Enter ZIP code"
              />
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
                onChange={(e) => handleAddressChange(index, "phone", e.target.value)}
                className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.primary,
                }}
                placeholder="+91 1234567890"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}

export default Address
