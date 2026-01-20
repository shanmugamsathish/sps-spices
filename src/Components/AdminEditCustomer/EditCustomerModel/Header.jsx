import React from "react";
import theme from "../../../lib/theme";
import { X, Save } from "lucide-react";

function Header({ onClose, hasChanges, loading, handleSubmit, title, formErrors = {}, addressesErrors = {} }) {
  const hasFormErrors = Object.values(formErrors).some(error => error && error.trim() !== '');
  
  const hasAddressesErrors = Object.values(addressesErrors).some(addressError => {
    if (typeof addressError === 'object' && addressError !== null) {
      return Object.values(addressError).some(error => error && error.trim() !== '');
    }
    return false;
  });
  const hasErrors = hasFormErrors || hasAddressesErrors;
  console.log(formErrors, addressesErrors, hasFormErrors, hasAddressesErrors, hasErrors);

  return (
    <div
      className="flex items-center justify-between p-4 border-b sticky top-0 z-10"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: theme.colors.border.light,
      }}
    >
      <button
        onClick={onClose}
        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        title="Close"
      >
        <X className="w-5 h-5" style={{ color: theme.colors.text.primary }} />
      </button>
      <h2
        className="text-xl font-semibold flex-1 text-center"
        style={{ color: theme.colors.text.primary }}
      >
        {title}
      </h2>
      <button
        onClick={handleSubmit}
        disabled={!hasChanges || loading || hasErrors}
        className="flex items-center gap-2 px-4 py-2 rounded-md text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: hasChanges && !hasErrors
            ? theme.colors.accent.primary
            : theme.colors.border.light,
          color: hasChanges && !hasErrors ? "#FFFFFF" : theme.colors.text.secondary,
        }}
        onMouseEnter={(e) => {
          if (hasChanges && !loading && !hasErrors) {
            e.target.style.backgroundColor = theme.colors.accent.hover;
          }
        }}
        onMouseLeave={(e) => {
          if (hasChanges && !loading && !hasErrors) {
            e.target.style.backgroundColor = theme.colors.accent.primary;
          }
        }}
      >
        <Save className="w-4 h-4" />
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

export default Header;
