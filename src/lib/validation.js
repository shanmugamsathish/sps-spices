// First Name and Last Name validation regex pattern
export const namePattern = /^[a-zA-Z][a-zA-Z\s.'-]{1,29}$/;

// Email validation regex pattern
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Password validation regex pattern
export const passwordPattern = /^.{6,}$/;

// First Name validation regex pattern- Example Joe
export const firstNamePattern = /^[a-zA-Z][a-zA-Z\s.'-]{1,29}$/;

// Last Name validation regex pattern- Example Jane
export const lastNamePattern = /^[a-zA-Z][a-zA-Z\s.'-]{1,29}$/;

// Phone Number validation regex pattern- Example 1234567890
export const phoneNumberPattern = /^[0-9]{10}$/;

// Postal Code validation regex pattern- Example 123456
export const postalCodePattern = /^[0-9]{6}$/;

// Register validation functions
export const validateField = (fieldName, value, formData = {}, isLogin = false) => {
  switch (fieldName) {
    case "firstName":
    case "first_name":
      if (!value || !value.trim()) return "First Name is required";
      if (!namePattern.test(value.trim()))
        return "First Name must be like Mary";
      return "";

    case "lastName":
    case "last_name":
      if (!value || !value.trim()) return "Last Name is required";
      if (!namePattern.test(value.trim()))
        return "Last Name must be like Jane";
      return "";

    case "email":
      if (!value || !value.trim()) return "Email is required";
      if (!emailPattern.test(value.trim())) return "Invalid email format";
      return "";

    case "password":
      if (!value) return "Password is required";
      // For login, only check if password exists (not format)
      if (isLogin) return "";
      // For registration, validate password format
      if (!passwordPattern.test(value))
        return "Password must be at least 6 characters";
      return "";

    case "confirmPassword":
    case "password_confirmation":
      if (!value) return "Confirm Password is required";
      if (value !== formData?.password)
        return "Passwords do not match";
      return "";

    case "phoneNumber":
    case "phone": {
      if (!value || !value.trim()) return "Phone Number is required";
      const phoneValue = value.trim().replace(/[\s-()]/g, ''); // Remove spaces, dashes, parentheses
      if (!phoneNumberPattern.test(phoneValue))
        return "Invalid phone number (must be 10 digits)";
      return "";
    }

    case "postalCode":
    case "zip":
      if (!value || !value.trim()) return "Postal Code is required";
      if (!postalCodePattern.test(value.trim()))
        return "Invalid postal code (must be 6 digits)";
      return "";

    case "address1":
      if (!value || !value.trim()) return "Address Line 1 is required";
      return "";

    case "city":
      if (!value || !value.trim()) return "City is required";
      return "";

    case "province":
      if (!value || !value.trim()) return "State/Province is required";
      return "";

    case "country":
      if (!value || !value.trim()) return "Country is required";
      return "";

    default:
      return "";
  }
};
