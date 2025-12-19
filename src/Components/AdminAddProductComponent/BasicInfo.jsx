import React from 'react'
import theme from '../../lib/theme';

function BasicInfo({ formData, handleInputChange, generateHandle }) {
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
      Basic Information
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: theme.colors.text.secondary }}
        >
          Product Title *
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
        />
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: theme.colors.text.secondary }}
        >
          Handle (URL Slug)
        </label>
        <input
          type="text"
          name="handle"
          value={formData.handle}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
          style={{
            backgroundColor: theme.colors.background.main,
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
          Vendor *
        </label>
        <input
          type="text"
          name="vendor"
          value={formData.vendor}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
          style={{
            backgroundColor: theme.colors.background.main,
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
          Product Type *
        </label>
        <input
          type="text"
          name="product_type"
          value={formData.product_type}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
          style={{
            backgroundColor: theme.colors.background.main,
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
          Status *
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
          style={{
            backgroundColor: theme.colors.background.main,
            borderColor: theme.colors.border.light,
            color: theme.colors.text.primary,
          }}
        >
          <option value="active">Active</option>
          <option value="archived">Archived</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: theme.colors.text.secondary }}
        >
          Tags (comma-separated)
        </label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleInputChange}
          placeholder="tag1, tag2, tag3"
          className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
          style={{
            backgroundColor: theme.colors.background.main,
            borderColor: theme.colors.border.light,
            color: theme.colors.text.primary,
          }}
        />
      </div>

      <div className="md:col-span-2">
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: theme.colors.text.secondary }}
        >
          Description (HTML) *
        </label>
        <textarea
          name="body_html"
          value={formData.body_html}
          onChange={handleInputChange}
          required
          rows="6"
          className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
          style={{
            backgroundColor: theme.colors.background.main,
            borderColor: theme.colors.border.light,
            color: theme.colors.text.primary,
          }}
          placeholder="Enter product description with HTML formatting..."
        />
      </div>
    </div>
  </div>
  )
}

export default BasicInfo
