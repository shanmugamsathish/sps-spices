import React, { useState, useCallback, useEffect } from "react";
import theme from "../../lib/theme";
import { createCustomer } from "../../apiCalls/customers";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loaderSlice";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../lib/constant";
import { Plus, Trash2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import AdminAddCustomerForm from "../../Components/AdminAddCustomerComponent/AdminAddCustomerForm";

function AdminAddCustomer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isPaymentPage = location.pathname === "/payment";

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
    <div className={` ${isPaymentPage ? "w-full p-0" : "min-h-screen p-4 sm:p-6 md:p-8 w-full"}`}>
    <div className={` ${isPaymentPage ? "w-full" : "max-w-4xl mx-auto w-full"}`}>
      <div className="max-w-4xl mx-auto w-full">
     {isPaymentPage ? ( 
           null 
         ) : ( 
        <h1
          className="text-3xl md:text-4xl font-bold mb-8"
          style={{ color: theme.colors.text.primary }}
        >
          Add New Customer
        </h1>
         )} 

        <AdminAddCustomerForm formData={formData} handleInputChange={handleInputChange} addresses={addresses} addAddress={addAddress} removeAddress={removeAddress} handleAddressChange={handleAddressChange} isPaymentPage={isPaymentPage} handleSubmit={handleSubmit} />
      </div>
    </div>
  </div>
  );
}

export default AdminAddCustomer;

