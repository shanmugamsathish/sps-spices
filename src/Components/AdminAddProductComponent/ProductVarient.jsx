import React from 'react'
import theme from '../../lib/theme';
import { Plus, Trash2 } from 'lucide-react';

function ProductVarient({ variants, handleVariantChange, addVariant, removeVariant }) {
  return (
    <div
    className="p-6 rounded-lg shadow-sm"
    style={{
      backgroundColor: '#FFFFFF',
      border: `1px solid ${theme.colors.border.light}`,
    }}
  >
    <div className="flex justify-between items-center mb-6">
      <h2
        className="text-xl font-semibold"
        style={{ color: theme.colors.text.primary }}
      >
        Product Variants
      </h2>
      <button
        type="button"
        onClick={addVariant}
        className="flex items-center gap-2 px-4 py-2 rounded-md text-white text-sm font-medium transition-colors cursor-pointer"
        style={{ backgroundColor: theme.colors.accent.primary }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = theme.colors.accent.hover;
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = theme.colors.accent.primary;
        }}
      >
        <Plus className="w-4 h-4" />
        Add Variant
      </button>
    </div>

    <div className="space-y-6">
      {variants.map((variant, index) => (
        <div
          key={index}
          className="p-4 rounded-md"
          style={{
            backgroundColor: theme.colors.background.main,
            border: `1px solid ${theme.colors.border.light}`,
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className="font-medium"
              style={{ color: theme.colors.text.primary }}
            >
              Variant {index + 1}
            </h3>
            {variants.length > 1 && (
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.colors.text.secondary }}
              >
                Title (e.g., 100g) *
              </label>
              <input
                type="text"
                value={variant.title}
                onChange={(e) =>
                  handleVariantChange(index, 'title', e.target.value)
                }
                required
                className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.primary,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.colors.text.secondary }}
              >
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={variant.price}
                onChange={(e) =>
                  handleVariantChange(index, 'price', e.target.value)
                }
                required
                className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.primary,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.colors.text.secondary }}
              >
                Compare at Price
              </label>
              <input
                type="number"
                step="0.01"
                value={variant.compare_at_price}
                onChange={(e) =>
                  handleVariantChange(
                    index,
                    'compare_at_price',
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.primary,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.colors.text.secondary }}
              >
                SKU *
              </label>
              <input
                type="text"
                value={variant.sku}
                onChange={(e) =>
                  handleVariantChange(index, 'sku', e.target.value)
                }
                required
                className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.primary,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.colors.text.secondary }}
              >
                Inventory Quantity *
              </label>
              <input
                type="number"
                value={variant.inventory_quantity}
                onChange={(e) =>
                  handleVariantChange(
                    index,
                    'inventory_quantity',
                    e.target.value
                  )
                }
                required
                className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.primary,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.colors.text.secondary }}
              >
                Weight *
              </label>
              <input
                type="number"
                step="0.01"
                value={variant.weight}
                onChange={(e) =>
                  handleVariantChange(index, 'weight', e.target.value)
                }
                required
                className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.primary,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.colors.text.secondary }}
              >
                Weight Unit *
              </label>
              <select
                value={variant.weight_unit}
                onChange={(e) =>
                  handleVariantChange(index, 'weight_unit', e.target.value)
                }
                required
                className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.primary,
                }}
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="lb">lb</option>
                <option value="oz">oz</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.colors.text.secondary }}
              >
                Grams (auto-calculated)
              </label>
              <input
                type="number"
                value={variant.grams}
                readOnly
                className="w-full px-3 py-2 rounded-md border bg-gray-100"
                style={{
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.secondary,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.colors.text.secondary }}
              >
                Option Value (e.g., 100g) *
              </label>
              <input
                type="text"
                value={variant.option1}
                onChange={(e) =>
                  handleVariantChange(index, 'option1', e.target.value)
                }
                required
                className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.primary,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}

export default ProductVarient
