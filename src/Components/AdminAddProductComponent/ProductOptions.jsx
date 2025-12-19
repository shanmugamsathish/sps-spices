import React from 'react'
import theme from '../../lib/theme';
import { Plus, X } from 'lucide-react';
function ProductOptions({ options, handleOptionChange, addOptionValue, removeOptionValue, handleOptionValueChange }) {
  return (
    <div
    className="p-6 rounded-lg shadow-sm"
    style={{
      backgroundColor: '#FFFFFF',
      border: `1px solid ${theme.colors.border.light}`,
    }}
  >
    <h2
      className="text-xl font-semibold mb-6"
      style={{ color: theme.colors.text.primary }}
    >
      Product Options
    </h2>

    {options.map((option, optionIndex) => (
      <div
        key={optionIndex}
        className="mb-6 p-4 rounded-md"
        style={{
          backgroundColor: theme.colors.background.main,
          border: `1px solid ${theme.colors.border.light}`,
        }}
      >
        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: theme.colors.text.secondary }}
          >
            Option Name (e.g., Weight, Size) *
          </label>
          <input
            type="text"
            value={option.name}
            onChange={(e) =>
              handleOptionChange(optionIndex, 'name', e.target.value)
            }
            required
            className="w-full md:w-1/2 px-3 py-2 rounded-md border focus:outline-none focus:ring-2"
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: theme.colors.border.light,
              color: theme.colors.text.primary,
            }}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              className="block text-sm font-medium"
              style={{ color: theme.colors.text.secondary }}
            >
              Option Values *
            </label>
            <button
              type="button"
              onClick={() => addOptionValue(optionIndex)}
              className="flex items-center gap-1 px-3 py-1 rounded-md text-sm cursor-pointer"
              style={{
                backgroundColor: theme.colors.accent.primary,
                color: '#FFFFFF',
              }}
            >
              <Plus className="w-3 h-3" />
              Add Value
            </button>
          </div>

          <div className="space-y-2">
            {option.values.map((value, valueIndex) => (
              <div key={valueIndex} className="flex gap-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    handleOptionValueChange(
                      optionIndex,
                      valueIndex,
                      e.target.value
                    )
                  }
                  required
                  className="flex-1 px-3 py-2 rounded-md border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: theme.colors.border.light,
                    color: theme.colors.text.primary,
                  }}
                  placeholder="e.g., 100g, 250g"
                />
                {option.values.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOptionValue(optionIndex, valueIndex)}
                    className="px-3 py-2 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
  )
}

export default ProductOptions
