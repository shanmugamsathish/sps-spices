import React, { useState } from "react";
import theme from "../../lib/theme";
import { useLocation } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";

function BasicInformation({
  formData,
  handleInputChange,
  isPaymentPage,  
  validationErrors = {},
}) {
  const location = useLocation();
  const isAdmin = location.pathname.includes("/admin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <div
      className="p-6 rounded-lg shadow-sm"
      style={{
        backgroundColor: "#FFFFFF",
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
            First Name{" "}
            {isPaymentPage && <span style={{ color: "#DC2626" }}>*</span>}
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
            style={{
              backgroundColor: theme.colors.background.main,
              borderColor: validationErrors.first_name
                ? "#DC2626"
                : theme.colors.border.light,
              color: theme.colors.text.primary,
            }}
            placeholder="Enter first name"
          />
          {validationErrors.first_name && (
            <p className="mt-1 text-sm" style={{ color: "#DC2626" }}>
              {validationErrors.first_name}
            </p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: theme.colors.text.secondary }}
          >
            Last Name{" "}
            {isPaymentPage && <span style={{ color: "#DC2626" }}>*</span>}
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
            style={{
              backgroundColor: theme.colors.background.main,
              borderColor: validationErrors.last_name
                ? "#DC2626"
                : theme.colors.border.light,
              color: theme.colors.text.primary,
            }}
            placeholder="Enter last name"
          />
          {validationErrors.last_name && (
            <p className="mt-1 text-sm" style={{ color: "#DC2626" }}>
              {validationErrors.last_name}
            </p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: theme.colors.text.secondary }}
          >
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
            style={{
              backgroundColor: theme.colors.background.main,
              borderColor: theme.colors.border.light,
              color: theme.colors.text.primary,
            }}
            placeholder="customer@example.com"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: theme.colors.text.secondary }}
          >
            Phone {isPaymentPage && <span style={{ color: "#DC2626" }}>*</span>}
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
            style={{
              backgroundColor: theme.colors.background.main,
              borderColor: validationErrors.phone
                ? "#DC2626"
                : theme.colors.border.light,
              color: theme.colors.text.primary,
            }}
            placeholder="+91 1234567890"
          />
          {validationErrors.phone && (
            <p className="mt-1 text-sm" style={{ color: "#DC2626" }}>
              {validationErrors.phone}
            </p>
          )}
        </div>

        {isPaymentPage || isAdmin ? null : (
          <>
{/* Password */}
<div>
  <label
    className="block text-sm font-medium mb-2"
    style={{ color: theme.colors.text.secondary }}
  >
    Password *
  </label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={formData.password}
      onChange={handleInputChange}
      required
      minLength={5}
      className="w-full px-4 py-2 pr-10 rounded-md border focus:outline-none focus:ring-2"
      style={{
        backgroundColor: theme.colors.background.main,
        borderColor: theme.colors.border.light,
        color: theme.colors.text.primary,
      }}
      placeholder="Minimum 5 characters"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute inset-y-0 right-3 flex items-center"
    >
      {showPassword
        ? <EyeIcon className="w-5 h-5" />
        : <EyeOffIcon className="w-5 h-5" />
      }
    </button>
  </div>
</div>


{/* Confirm Password */}
<div>
  <label
    className="block text-sm font-medium mb-2"
    style={{ color: theme.colors.text.secondary }}
  >
    Confirm Password *
  </label>

  <div className="relative">
    <input
      type={showConfirmPassword ? "text" : "password"}
      name="password_confirmation"
      value={formData.password_confirmation}
      onChange={handleInputChange}
      required
      minLength={5}
      className="w-full px-4 py-2 pr-10 rounded-md border focus:outline-none focus:ring-2"
      style={{
        backgroundColor: theme.colors.background.main,
        borderColor: theme.colors.border.light,
        color: theme.colors.text.primary,
      }}
      placeholder="Re-enter password"
    />

    <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="absolute inset-y-0 right-3 flex items-center"
    >
      {showConfirmPassword
        ? <EyeIcon className="w-5 h-5" />
        : <EyeOffIcon className="w-5 h-5" />
      }
    </button>
  </div>
</div>


            <div className="md:col-span-2 flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="accepts_marketing"
                  checked={formData.accepts_marketing}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded"
                  style={{
                    accentColor: theme.colors.accent.primary,
                  }}
                />
                <span
                  className="text-sm"
                  style={{ color: theme.colors.text.secondary }}
                >
                  Accepts Marketing
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="send_email_welcome"
                  checked={formData.send_email_welcome}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded"
                  style={{
                    accentColor: theme.colors.accent.primary,
                  }}
                />
                <span
                  className="text-sm"
                  style={{ color: theme.colors.text.secondary }}
                >
                  Send Welcome Email
                </span>
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BasicInformation;
