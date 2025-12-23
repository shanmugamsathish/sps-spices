import React from 'react'
import theme from '../../lib/theme';
import { Dialog, DialogPanel } from '@headlessui/react';
import { X } from 'lucide-react';

function BrowseProductModel({ browseModalOpen, setBrowseModalOpen, allProducts, browseSelectedProducts, selectedProducts, toggleBrowseProduct, addBrowseProducts, getProductImage }) {
  return (
    <Dialog
    open={browseModalOpen}
    onClose={() => setBrowseModalOpen(false)}
    className="relative z-50"
  >
    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
    <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
      <DialogPanel className="mx-auto max-w-4xl w-full rounded-lg bg-white shadow-xl flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        <div
          className="p-6 border-b"
          style={{ borderColor: theme.colors.border.light }}
        >
          <div className="flex justify-between items-center">
            <h2
              className="text-xl font-semibold"
              style={{ color: theme.colors.text.primary }}
            >
              Browse Products
            </h2>
            <button
              onClick={() => setBrowseModalOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X
                className="w-5 h-5"
                style={{ color: theme.colors.text.primary }}
              />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {allProducts.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: theme.colors.text.secondary }}>
                No products found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {allProducts.map((product) => {
                const isSelected = browseSelectedProducts.find(
                  (p) => p.id === product.id
                );
                const isAlreadyAdded = selectedProducts.find(
                  (p) => p.id === product.id
                );

                return (
                  <div
                    key={product.id}
                    onClick={() =>
                      !isAlreadyAdded && toggleBrowseProduct(product)
                    }
                    className={`p-4 rounded-md border cursor-pointer transition-all ${
                      isSelected ? "ring-2" : "hover:shadow-md"
                    } ${
                      isAlreadyAdded ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    style={{
                      backgroundColor: isSelected
                        ? theme.colors.background.main
                        : "#FFFFFF",
                      borderColor: isSelected
                        ? theme.colors.accent.primary
                        : theme.colors.border.light,
                      ringColor: theme.colors.accent.primary,
                    }}
                  >
                    <div className="flex gap-3">
                      <img
                        src={getProductImage(product)}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded-md"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-medium truncate"
                          style={{ color: theme.colors.text.primary }}
                        >
                          {product.title}
                        </h3>
                        <p
                          className="text-sm mt-1"
                          style={{ color: theme.colors.text.secondary }}
                        >
                          {product.status || "N/A"}
                        </p>
                        {isAlreadyAdded && (
                          <p className="text-xs mt-1 text-gray-500">
                            Already added
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: theme.colors.accent.primary,
                          }}
                        >
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div
          className="p-4 sm:p-6 border-t flex flex-col sm:flex-row justify-end gap-3 sm:gap-4"
          style={{ borderColor: theme.colors.border.light }}
        >
          <button
            onClick={() => setBrowseModalOpen(false)}
            className="px-4 py-2 rounded-md font-medium transition-colors cursor-pointer w-full sm:w-auto"
            style={{
              backgroundColor: theme.colors.border.light,
              color: theme.colors.text.primary,
            }}
          >
            Cancel
          </button>
          <button
            onClick={addBrowseProducts}
            disabled={browseSelectedProducts.length === 0}
            className="px-4 py-2 rounded-md text-white font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
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
                e.target.style.backgroundColor =
                  theme.colors.accent.primary;
              }
            }}
          >
            Done ({browseSelectedProducts.length})
          </button>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
  )
}

export default BrowseProductModel
