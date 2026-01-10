// First Name and Last Name validation regex pattern
export const namePattern = /^[a-zA-Z][a-zA-Z\s.'-]{1,29}$/;

// Email validation regex pattern
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Password validation regex pattern
export const passwordPattern = /^.{6,}$/;

// Register validation functions
export const validateField = (fieldName, value, formData = {}, isLogin = false) => {
  switch (fieldName) {
    case "firstName":
      if (!value) return "First Name is required";
      if (!namePattern.test(value))
        return "First Name must be like Mary";
      return "";

    case "lastName":
      if (!value) return "Last Name is required";
      if (!namePattern.test(value))
        return "Last Name must be like Jane";
      return "";

    case "email":
      if (!value) return "Email is required";
      if (!emailPattern.test(value)) return "Invalid email format";
      return "";

    case "password":
      if (!value) return "Password is required";
      // For login, only check if password exists (not format)
      if (isLogin) return "";
      // For registration, validate password format
      if (!passwordPattern.test(value))
        return "Password must be at least 8 characters";
      return "";

    case "confirmPassword":
      if (!value) return "Confirm Password is required";
      if (value !== formData?.password)
        return "Passwords do not match";
      return "";

    default:
      return "";
  }
};
