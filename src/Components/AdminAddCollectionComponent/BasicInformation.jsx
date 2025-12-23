import React from 'react'
import theme from '../../lib/theme';

function BasicInformation({ formData, handleInputChange, generateHandle }) {
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
      Basic Information
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: theme.colors.text.secondary }}
        >
          Collection Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          onBlur={generateHandle}
          required
          className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
          style={{
            backgroundColor: theme.colors.background.main,
            borderColor: theme.colors.border.light,
            color: theme.colors.text.primary,
            focusRingColor: theme.colors.accent.primary,
          }}
          placeholder="Enter collection title"
        />
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: theme.colors.text.secondary }}
        >
          Handle (URL Slug) *
        </label>
        <input
          type="text"
          name="handle"
          value={formData.handle}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
          style={{
            backgroundColor: theme.colors.background.main,
            borderColor: theme.colors.border.light,
            color: theme.colors.text.primary,
          }}
          placeholder="collection-url-slug"
        />
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: theme.colors.text.secondary }}
        >
          Sort Order
        </label>
        <select
          name="sort_order"
          value={formData.sort_order}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
          style={{
            backgroundColor: theme.colors.background.main,
            borderColor: theme.colors.border.light,
            color: theme.colors.text.primary,
          }}
        >
          <option value="best-selling">Best Selling</option>
          <option value="manual">Manual</option>
          <option value="alpha-asc">Alphabetically (A-Z)</option>
          <option value="alpha-desc">Alphabetically (Z-A)</option>
        </select>
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: theme.colors.text.secondary }}
        >
          Publish Collection
        </label>
        <select
          name="published_scope"
          value={formData.published_scope}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
          style={{
            backgroundColor: theme.colors.background.main,
            borderColor: theme.colors.border.light,
            color: theme.colors.text.primary,
          }}
        >
          <option value="global">Published</option>
          <option value="web">Web Only</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: theme.colors.text.secondary }}
        >
          Description (HTML)
        </label>
        <textarea
          name="body_html"
          value={formData.body_html}
          onChange={handleInputChange}
          rows="6"
          className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
          style={{
            backgroundColor: theme.colors.background.main,
            borderColor: theme.colors.border.light,
            color: theme.colors.text.primary,
          }}
          placeholder="Enter collection description with HTML formatting..."
        />
      </div>
    </div>
  </div>
  )
}

export default BasicInformation
