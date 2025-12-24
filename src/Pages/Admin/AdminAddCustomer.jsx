import React, { useState, useCallback, useEffect } from "react";
import theme from "../../lib/theme";
import { createCustomer } from "../../apiCalls/customers";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loaderSlice";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../lib/constant";
import { Plus, Trash2 } from "lucide-react";

function AdminAddCustomer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    password: "",
    password_confirmation: "",
    accepts_marketing: false,
    send_email_welcome: true,
  });

  const [addresses, setAddresses] = useState([
    {
      first_name: "",
      last_name: "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      province: "",
      country: "India",
      zip: "",
      phone: "",
    },
  ]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleAddressChange = useCallback((index, field, value) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index][field] = value;
    setAddresses(updatedAddresses);
  }, [addresses]);

  useEffect(() => {
    if (formData.first_name) {
      setAddresses((prev) => 
        prev.map((addr, idx) => 
          idx === 0 && !addr.first_name ? { ...addr, first_name: formData.first_name } : addr
        )
      );
    }
    if (formData.last_name) {
      setAddresses((prev) => 
        prev.map((addr, idx) => 
          idx === 0 && !addr.last_name ? { ...addr, last_name: formData.last_name } : addr
        )
      );
    }
    if (formData.phone) {
      setAddresses((prev) => 
        prev.map((addr, idx) => 
          idx === 0 && !addr.phone ? { ...addr, phone: formData.phone } : addr
        )
      );
    }
  }, [formData.first_name, formData.last_name, formData.phone]);

  const addAddress = useCallback(() => {
    setAddresses([
      ...addresses,
      {
        first_name: formData.first_name || "",
        last_name: formData.last_name || "",
        company: "",
        address1: "",
        address2: "",
        city: "",
        province: "",
        country: "India",
        zip: "",
        phone: formData.phone || "",
      },
    ]);
  }, [addresses, formData]);

  const removeAddress = useCallback((index) => {
    if (addresses.length > 1) {
      setAddresses(addresses.filter((_, i) => i !== index));
    }
  }, [addresses]);

  const isFormValid = useCallback(() => {
    // Email and password are required
    if (!formData.email?.trim() || !formData.password?.trim()) {
      return false;
    }

    // Password confirmation must match
    if (formData.password !== formData.password_confirmation) {
      return false;
    }

    // Password should be at least 5 characters
    if (formData.password.length < 5) {
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return false;
    }

    return true;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!isFormValid()) {
        if (formData.password !== formData.password_confirmation) {
          toast.error("Passwords do not match");
        } else if (formData.password.length < 5 || formData.password_confirmation.length < 5) {
          toast.error("Password must be at least 5 characters");
        } else {
          toast.error("Please fill in all required fields correctly");
        }
        return;
      }

      dispatch(setLoading(true));

      const customerData = {
        customer: {
          email: formData.email.trim(),
          first_name: formData.first_name.trim() || "",
          last_name: formData.last_name.trim() || "",
          phone: formData.phone.trim() || "",
          password: formData.password,
          password_confirmation: formData.password_confirmation,
          accepts_marketing: formData.accepts_marketing || false,
          send_email_welcome: formData.send_email_welcome !== false,
          addresses: addresses
            .filter((addr) => addr.address1?.trim()) // Only include addresses with at least address1
            .map((addr) => {
              const addressObj = {
                first_name: addr.first_name.trim() || formData.first_name.trim() || "",
                last_name: addr.last_name.trim() || formData.last_name.trim() || "",
                address1: addr.address1.trim(),
                city: addr.city.trim() || "",
                province: addr.province.trim() || "",
                zip: addr.zip.trim() || "",
                country: addr.country.trim() || "India",
                phone: addr.phone.trim() || formData.phone.trim() || "",
              };

              // Include optional fields only if they have values
              if (addr.company?.trim()) {
                addressObj.company = addr.company.trim();
              }
              if (addr.address2?.trim()) {
                addressObj.address2 = addr.address2.trim();
              }

              return addressObj;
            }),
        },
      };

      try {
        const response = await createCustomer(customerData);
        if (response) {
          toast.success(response.message || "Customer created successfully");
          navigate(ROUTES.ADMIN_CUSTOMERS);
        } else {
          toast.error("Failed to create customer");
        }
      } catch (error) {
        console.error("Error creating customer:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to create customer";
        toast.error(errorMessage);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [formData, addresses, dispatch, navigate, isFormValid]
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl md:text-4xl font-bold mb-8"
          style={{ color: theme.colors.text.primary }}
        >
          Add New Customer
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Customer Information */}
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
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: theme.colors.background.main,
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
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: theme.colors.background.main,
                    borderColor: theme.colors.border.light,
                    color: theme.colors.text.primary,
                  }}
                  placeholder="Enter last name"
                />
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
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: theme.colors.background.main,
                    borderColor: theme.colors.border.light,
                    color: theme.colors.text.primary,
                  }}
                  placeholder="+91 1234567890"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.colors.text.secondary }}
                >
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={5}
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: theme.colors.background.main,
                    borderColor: theme.colors.border.light,
                    color: theme.colors.text.primary,
                  }}
                  placeholder="Minimum 5 characters"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.colors.text.secondary }}
                >
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  required
                  minLength={5}
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: theme.colors.background.main,
                    borderColor: theme.colors.border.light,
                    color: theme.colors.text.primary,
                  }}
                  placeholder="Re-enter password"
                />
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
            </div>
          </div>

          {/* Addresses */}
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

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(ROUTES.ADMIN_CUSTOMERS)}
              className="px-6 py-3 rounded-md font-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: theme.colors.border.light,
                color: theme.colors.text.primary,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
            //   disabled={!isFormValid()}
              className="px-6 py-3 rounded-md text-white font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
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
                  e.target.style.backgroundColor = theme.colors.accent.primary;
                }
              }}
            >
              Add Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminAddCustomer;

