import React, { useState, useCallback, useEffect, useRef } from "react";
import { updateCustomer, getCustomerById } from "../../apiCalls/customers";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loaderSlice";
import ScrollableContent from "./EditCustomerModel/ScrollableContent";
import Header from "./EditCustomerModel/Header";
import { validateField } from "../../lib/validation";

function EditCustomerModal({ customerId, isOpen, onClose, onUpdate, title }) {
    const dispatch = useDispatch();
    const modalRef = useRef(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [loadingText, _setLoadingText] = useState(false);
  
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
    const [formErrors, setFormErrors] = useState({
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      password: "",
      password_confirmation: "",
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
    const [addressesErrors, setAddressesErrors] = useState({});
  
    const handleInputChange = useCallback((e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
      setFormErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value, formData),
      }));
      setHasChanges(true);
    }, [formData]);
  
    const handleAddressChange = useCallback((index, field, value) => {
      const updatedAddresses = [...addresses];
      updatedAddresses[index][field] = value;
      setAddresses(updatedAddresses);
      setAddressesErrors((prev) => {
        const newErrors = { ...prev };
        if (!newErrors[index]) {
          newErrors[index] = {};
        }
        newErrors[index] = {
          ...newErrors[index],
          [field]: validateField(field, value),
        };
        return newErrors;
      });
      setHasChanges(true);
    }, [addresses]);

    // Validation functions
    const validateForm = useCallback((email, firstName, lastName, phone) => {
      const errors = {};
      const emailError = validateField("email", email);
      const firstNameError = validateField("first_name", firstName);
      const lastNameError = validateField("last_name", lastName);
      const phoneError = validateField("phone", phone);
      
      if (emailError) errors.email = emailError;
      if (firstNameError) errors.first_name = firstNameError;
      if (lastNameError) errors.last_name = lastNameError;
      if (phoneError) errors.phone = phoneError;
      
      return errors;
    }, []);

    const validateAddresses = useCallback((addresses) => {
      const errors = {};
      addresses.forEach((address, index) => {
        const addressErrors = {};
        const firstNameError = validateField("first_name", address.first_name);
        const lastNameError = validateField("last_name", address.last_name);
        const phoneError = validateField("phone", address.phone);
        const address1Error = validateField("address1", address.address1);
        const cityError = validateField("city", address.city);
        const provinceError = validateField("province", address.province);
        const countryError = validateField("country", address.country);
        const zipError = validateField("zip", address.zip);
        
        if (firstNameError) addressErrors.first_name = firstNameError;
        if (lastNameError) addressErrors.last_name = lastNameError;
        if (phoneError) addressErrors.phone = phoneError;
        if (address1Error) addressErrors.address1 = address1Error;
        if (cityError) addressErrors.city = cityError;
        if (provinceError) addressErrors.province = provinceError;
        if (countryError) addressErrors.country = countryError;
        if (zipError) addressErrors.zip = zipError;
        
        if (Object.keys(addressErrors).length > 0) {
          errors[index] = addressErrors;
        }
      });
      return errors;
    }, []);
    
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
      setAddresses((prev) => [
        ...prev,
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
      setHasChanges(true);
    }, [formData]);
  
    const removeAddress = useCallback((index) => {
      if (addresses.length > 1) {
        setAddresses((prev) => prev.filter((_, i) => i !== index));
        setHasChanges(true);
      }
    }, [addresses]);
  
    const isFormValid = useCallback(() => {
      // Email is required
      if (!formData.email?.trim()) {
        return false;
      }

      // If password is provided, validate confirmation and length
      if (formData.password) {
        if (formData.password !== formData.password_confirmation) {
          return false;
        }
        if (formData.password.length < 5) {
          return false;
        }
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        return false;
      }

      return true;
    }, [formData]);

    const fetchCustomerData = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            const response = await getCustomerById(customerId);
            if (response) {
                // getCustomerById returns the customer object (not wrapped under .customer)
                const customerObj = response || {};
                setFormData(customerObj);
                const defaultAddress = {
                  first_name: customerObj?.first_name || "",
                  last_name: customerObj?.last_name || "",
                  company: "",
                  address1: "",
                  address2: "",
                  city: "",
                  province: "",
                  country: "India",
                  zip: "",
                  phone: customerObj?.phone || "",
                };
                setAddresses(
                  Array.isArray(customerObj?.addresses) && customerObj.addresses.length
                    ? customerObj.addresses
                    : [defaultAddress]
                );
                setHasChanges(false);
            }
        } catch (error) {
            console.error("Error fetching customer data:", error);
            toast.error("Failed to fetch customer data");
        } finally {
            dispatch(setLoading(false));
        }
    }, [customerId, dispatch]);

    useEffect(() => {
      if (isOpen && customerId) {
        fetchCustomerData();
      }
    }, [isOpen, customerId, fetchCustomerData]);
  
    const handleSubmit = useCallback(
      async (e) => {
        e.preventDefault();

        const errors = validateForm(formData.email, formData.first_name, formData.last_name, formData.phone);
        if (Object.keys(errors).length > 0) {
          setFormErrors(errors);
          return;
        }
        
        const addressesErrors = validateAddresses(addresses);
        if (Object.keys(addressesErrors).length > 0) {
          setAddressesErrors(addressesErrors);
          return;
        }

        if (!isFormValid()) {
          if (formData.password && formData.password !== formData.password_confirmation) {
            toast.error("Passwords do not match");
          } else if (formData.password && formData.password.length < 5) {
            toast.error("Password must be at least 5 characters");
          } else {
            toast.error("Please fill in all required fields correctly");
          }
          return;
        }

        dispatch(setLoading(true));

        const customerPayload = {
          customer: {
            email: (formData.email || "").trim(),
            first_name: (formData.first_name || "").trim() || "",
            last_name: (formData.last_name || "").trim() || "",
            phone: (formData.phone || "").trim() || "",
            // Only include password fields if user provided them
            ...(formData.password ? { password: formData.password, password_confirmation: formData.password_confirmation } : {}),
            accepts_marketing: formData.accepts_marketing || false,
            send_email_welcome: formData.send_email_welcome !== false,
            addresses: addresses
              .filter((addr) => addr.address1?.trim()) // Only include addresses with at least address1
              .map((addr) => {
                const addressObj = {
                  first_name: (addr.first_name || "").trim() || (formData.first_name || "").trim() || "",
                  last_name: (addr.last_name || "").trim() || (formData.last_name || "").trim() || "",
                  address1: (addr.address1 || "").trim(),
                  city: (addr.city || "").trim() || "",
                  province: (addr.province || "").trim() || "",
                  zip: (addr.zip || "").trim() || "",
                  country: (addr.country || "").trim() || "India",
                  phone: (addr.phone || "").trim() || (formData.phone || "").trim() || "",
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
          const response = await updateCustomer(customerId, customerPayload);
          if (response) {
            toast.success(response.message || "Customer updated successfully");
            // Let parent refresh the list if provided
            if (typeof onUpdate === "function") {
              onUpdate();
            }
            // close modal
            if (typeof onClose === "function") {
              onClose();
            }
          } else {
            toast.error("Failed to update customer");
          }
        } catch (error) {
          console.error("Error updating customer:", error);
          const errorMessage = 
           'Phone: ' + error.response?.data?.errors?.phone?.[0] ||
            'First Name: ' + error.response?.data?.errors?.first_name?.[0] ||
            'Last Name: ' + error.response?.data?.errors?.last_name?.[0] ||
            'Email: ' + error.response?.data?.errors?.email?.[0] ||
            'Password: ' + error.response?.data?.errors?.password?.[0] ||
            'Password Confirmation: ' + error.response?.data?.errors?.password_confirmation?.[0] ||
            'Accepts Marketing: ' + error.response?.data?.errors?.accepts_marketing?.[0] ||
            'Send Email Welcome: ' + error.response?.data?.errors?.send_email_welcome?.[0] ||
            error.response?.data?.message ||
            error.message ||
            "Failed to update customer";
          toast.error(errorMessage);
        } finally {
          dispatch(setLoading(false));
        }
      },
      [formData, addresses, dispatch, isFormValid, customerId, onUpdate, onClose, validateForm, validateAddresses]
    );

 if (!isOpen) return null;

 // fallback for position if parent didn't pass tablePosition
 const safePosition = { top: 0, left: 0 };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="absolute bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
        style={{
          width: "90%",
          maxWidth: "1000px",
          maxHeight: safePosition.top > 150 
            ? `${safePosition.top - 60}px` 
            : "calc(100vh - 2rem)",
          top: safePosition.top > 150 
            ? `${Math.max(1, safePosition.top - (safePosition.top > 500 ? 500 : safePosition.top - 20))}px` 
            : "1rem",
          left: safePosition.left > 0 ? `${safePosition.left}px` : "50%",
          transform: safePosition.left > 0 ? "none" : "translateX(-50%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <Header onClose={onClose} hasChanges={hasChanges} loading={loadingText} handleSubmit={handleSubmit} title={title} formErrors={formErrors} addressesErrors={addressesErrors}/>

        {/* Scrollable Content */}
        <ScrollableContent 
          formData={formData} 
          addresses={addresses} 
          addAddress={addAddress} 
          removeAddress={removeAddress} 
          handleAddressChange={handleAddressChange} 
          handleInputChange={handleInputChange} 
          handleSubmit={handleSubmit} 
          loading={loadingText}
          formErrors={formErrors}
          addressesErrors={addressesErrors}
        />
      </div>
    </div>
  );
}

export default EditCustomerModal;

