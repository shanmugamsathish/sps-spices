import React from 'react'
import theme from '../../lib/theme';
import { Search, Plus, X, Trash2 } from 'lucide-react';

function CollectionType({ formData, handleInputChange, handleSearchChange, searchQuery, showAutocomplete, autocompleteResults, autocompleteRef, searchRef, openBrowseModal, selectedProducts, removeProduct, addRule, rules, handleRuleChange, removeRule, selectProductFromSearch, getProductImage, isEditMode = false }) {
  return (
    <div
    className="p-4 sm:p-6 rounded-lg shadow-sm"
    style={{
      backgroundColor: "#FFFFFF",
      border: `1px solid ${theme.colors.border.light}`,
    }}
  >
    <h2
      className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6"
      style={{ color: theme.colors.text.primary }}
    >
      Collection Type
    </h2>
    {isEditMode ? (
      // In edit mode, show only the current collection type as read-only
      <div className="flex items-center gap-2">
        <div
          className="px-4 py-2 rounded-md font-medium text-white"
          style={{
            backgroundColor: theme.colors.accent.primary,
            border: `1px solid ${theme.colors.border.light}`,
          }}
        >
          {formData.collection_type === "smart_collection" ? "Smart Collection" : "Manual Collection"}
        </div>
      </div>
    ) : (
      // In add mode, show radio buttons to select type
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="collection_type"
            value="custom_collection"
            checked={formData.collection_type === "custom_collection"}
            onChange={handleInputChange}
            className="w-4 h-4"
            style={{ accentColor: theme.colors.accent.primary }}
          />
          <span style={{ color: theme.colors.text.primary }}>
            Manual Collection
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="collection_type"
            value="smart_collection"
            checked={formData.collection_type === "smart_collection"}
            onChange={handleInputChange}
            className="w-4 h-4"
            style={{ accentColor: theme.colors.accent.primary }}
          />
          <span style={{ color: theme.colors.text.primary }}>
            Smart Collection
          </span>
        </label>
      </div>
    )}

    {/* Product Selection for Manual Collection */}
    {formData.collection_type === "custom_collection" && (
      <div className="mt-4 sm:mt-6">
        <h2
          className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6"
          style={{ color: theme.colors.text.primary }}
        >
          Products
        </h2>

        {/* Search and Browse */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative" ref={searchRef}>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: theme.colors.text.secondary }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products by name..."
                className="w-full pl-10 pr-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: theme.colors.background.main,
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.primary,
                }}
              />
            </div>
            {showAutocomplete && autocompleteResults.length > 0 && (
              <div
                ref={autocompleteRef}
                className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto"
                style={{
                  borderColor: theme.colors.border.light,
                }}
              >
                {autocompleteResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => selectProductFromSearch(product)}
                    className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b"
                    style={{
                      borderColor: theme.colors.border.light,
                    }}
                  >
                    <img
                      src={getProductImage(product)}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <span style={{ color: theme.colors.text.primary }}>
                      {product.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={openBrowseModal}
            className="px-4 py-2 rounded-md font-medium transition-colors cursor-pointer w-full sm:w-auto"
            style={{
              backgroundColor: theme.colors.border.light,
              color: theme.colors.text.primary,
            }}
          >
            Browse
          </button>
        </div>

        {/* Selected Products Table */}
        {selectedProducts.length > 0 && (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead>
                  <tr
                    style={{
                      backgroundColor: theme.colors.background.main,
                      borderBottom: `2px solid ${theme.colors.border.light}`,
                    }}
                  >
                    <th
                      className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold"
                      style={{ color: theme.colors.text.primary }}
                    >
                      S.No
                    </th>
                    <th
                      className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold"
                      style={{ color: theme.colors.text.primary }}
                    >
                      Image
                    </th>
                    <th
                      className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold"
                      style={{ color: theme.colors.text.primary }}
                    >
                      Product Title
                    </th>
                    <th
                      className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold hidden sm:table-cell"
                      style={{ color: theme.colors.text.primary }}
                    >
                      Status
                    </th>
                    <th
                      className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold"
                      style={{ color: theme.colors.text.primary }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
              <tbody>
                {selectedProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                    style={{
                      borderBottom:
                        index < selectedProducts.length - 1
                          ? `1px solid ${theme.colors.border.light}`
                          : "none",
                    }}
                  >
                    <td className="px-2 sm:px-4 py-3">
                      <span
                        className="text-xs sm:text-sm"
                        style={{ color: theme.colors.text.primary }}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      {getProductImage(product) ? (
                        <img
                          src={getProductImage(product)}
                          alt={product.title}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-md flex items-center justify-center"
                          style={{
                            backgroundColor:
                              theme.colors.background.main,
                            border: `1px solid ${theme.colors.border.light}`,
                          }}
                        >
                          <span
                            className="text-xs"
                            style={{
                              color: theme.colors.text.secondary,
                            }}
                          >
                            No Image
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <span
                        className="font-medium text-xs sm:text-sm"
                        style={{ color: theme.colors.text.primary }}
                      >
                        {product.title || "N/A"}
                      </span>
                      <div className="sm:hidden mt-1">
                        <span
                          className={`text-xs font-medium ${
                            product.status === "active"
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          {product.status || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 hidden sm:table-cell">
                      <span
                        className={`font-medium text-xs sm:text-sm ${
                          product.status === "active"
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {product.status || "N/A"}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <button
                        type="button"
                        onClick={() => removeProduct(product.id)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors cursor-pointer mx-auto flex"
                        title="Remove Product"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}
      </div>
    )}

    {/* Smart Collection Rules */}
    {formData.collection_type === "smart_collection" && (
      <div className="mt-4 sm:mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4 sm:mb-6">
          <h2
            className="text-lg sm:text-xl font-semibold"
            style={{ color: theme.colors.text.primary }}
          >
            Smart Collection Rules
          </h2>
          <button
            type="button"
            onClick={addRule}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-white text-sm font-medium transition-colors cursor-pointer w-full sm:w-auto"
            style={{ backgroundColor: theme.colors.accent.primary }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor =
                theme.colors.accent.hover;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor =
                theme.colors.accent.primary;
            }}
          >
            <Plus className="w-4 h-4" />
            Add Rule
          </button>
        </div>

        <div className="space-y-4">
          {rules.map((rule, index) => (
            <div
              key={index}
              className="p-4 rounded-md flex flex-col sm:flex-row gap-4 items-stretch sm:items-end"
              style={{
                backgroundColor: theme.colors.background.main,
                border: `1px solid ${theme.colors.border.light}`,
              }}
            >
              <div className="flex-1">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.colors.text.secondary }}
                >
                  Column
                </label>
                <select
                  value={rule.column}
                  onChange={(e) =>
                    handleRuleChange(index, "column", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: theme.colors.border.light,
                    color: theme.colors.text.primary,
                  }}
                >
                  <option value="product_type">Product Type</option>
                  <option value="tag">Tag</option>
                  <option value="vendor">Vendor</option>
                  <option value="product_category_id">
                    Product Category ID
                  </option>
                </select>
              </div>

              <div className="flex-1">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.colors.text.secondary }}
                >
                  Relation
                </label>
                <select
                  value={rule.relation}
                  onChange={(e) =>
                    handleRuleChange(index, "relation", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: theme.colors.border.light,
                    color: theme.colors.text.primary,
                  }}
                >
                  <option value="equals">Equals</option>
                  <option value="contains">Contains</option>
                  <option value="not_equals">Not Equals</option>
                </select>
              </div>

              <div className="flex-1">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.colors.text.secondary }}
                >
                  Condition
                </label>
                <input
                  type="text"
                  value={rule.condition}
                  onChange={(e) =>
                    handleRuleChange(index, "condition", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: theme.colors.border.light,
                    color: theme.colors.text.primary,
                  }}
                  placeholder="Enter condition value"
                />
              </div>

              {rules.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRule(index)}
                  className="px-4 py-2 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                  title="Remove Rule"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {rules.length > 1 && (
          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="disjunctive"
                checked={formData.disjunctive}
                onChange={handleInputChange}
                className="w-4 h-4"
                style={{ accentColor: theme.colors.accent.primary }}
              />
              <span style={{ color: theme.colors.text.primary }}>
                Match any condition (OR) instead of all conditions (AND)
              </span>
            </label>
          </div>
        )}
      </div>
    )}
  </div>
  )
}

export default CollectionType
