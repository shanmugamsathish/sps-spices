import React, { useState, useCallback, useEffect, useRef } from "react";
import { updateCustomer, getCustomerById } from "../../apiCalls/customers";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loaderSlice";
import ScrollableContent from "./EditCustomerModel/ScrollableContent";
import Header from "./EditCustomerModel/Header";

function EditCustomerModal({ customerId, isOpen, onClose, onUpdate, tableWidth, tablePosition, title }) {
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
      setHasChanges(true);
    }, []);
  
    const handleAddressChange = useCallback((index, field, value) => {
      const updatedAddresses = [...addresses];
      updatedAddresses[index][field] = value;
      setAddresses(updatedAddresses);
      setHasChanges(true);
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
                // freshly loaded data = no unsaved changes
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
          console.log("handleSubmit", response);
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
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Failed to update customer";
          toast.error(errorMessage);
        } finally {
          dispatch(setLoading(false));
        }
      },
      [formData, addresses, dispatch, isFormValid, customerId, onUpdate, onClose]
    );

 if (!isOpen) return null;

 // fallback for position if parent didn't pass tablePosition
 const safePosition = tablePosition || { top: 0, left: 0 };

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
          width: tableWidth ? `${tableWidth}px` : "90%",
          maxWidth: "1400px",
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
        <Header onClose={onClose} hasChanges={hasChanges} loading={loadingText} handleSubmit={handleSubmit} title={title} />

        {/* Scrollable Content */}
        <ScrollableContent formData={formData} addresses={addresses} addAddress={addAddress} removeAddress={removeAddress} handleAddressChange={handleAddressChange} handleInputChange={handleInputChange} handleSubmit={handleSubmit} loading={loadingText} />
      </div>
    </div>
  );
}

export default EditCustomerModal;

