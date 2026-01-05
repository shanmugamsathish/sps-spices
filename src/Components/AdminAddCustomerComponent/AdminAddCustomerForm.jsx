import BasicInformation from './BasicInformation'
import Address from './Address'
import { ROUTES } from '../../lib/constant'
import theme from '../../lib/theme'
import { useNavigate } from 'react-router-dom'

function AdminAddCustomerForm({ formData, handleInputChange, addresses, addAddress, removeAddress, handleAddressChange, isPaymentPage, handleSubmit, validationErrors }) {
  const navigate = useNavigate();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
    <BasicInformation formData={formData} handleInputChange={handleInputChange} isPaymentPage={isPaymentPage} validationErrors={validationErrors}/>
    <Address addresses={addresses} addAddress={addAddress} removeAddress={removeAddress} handleAddressChange={handleAddressChange} isPaymentPage={isPaymentPage} validationErrors={validationErrors}/>
    {isPaymentPage ? (
      null
    ) : (
      <>
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
      </>
    )}

  </form>
  )
}

export default AdminAddCustomerForm
