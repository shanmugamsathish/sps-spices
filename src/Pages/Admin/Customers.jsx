import React, { useEffect, useCallback, useState } from 'react';
import { getAllCustomers, deleteCustomer } from '../../apiCalls/customers';
import theme from '../../lib/theme';
import { Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import DialogBox from '../../Components/DialogBox';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../redux/loaderSlice';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loadingText, setLoadingText] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState(null);
  const dispatch = useDispatch();

  const fetchCustomers = useCallback(async () => {
    try {
      setLoadingText(true);
      dispatch(setLoading(true));
      const customersData = await getAllCustomers();
      setCustomers(Array.isArray(customersData) ? customersData : []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch customers');
      setCustomers([]);
    } finally {
      setLoadingText(false);
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Format customer name
  const getCustomerName = (customer) => {
    const firstName = customer.first_name || '';
    const lastName = customer.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'N/A';
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return `₹0.00`;
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return `₹0.00`;
    return `₹${numAmount.toFixed(2)}`;
  };

  // Handle edit customer (placeholder - can be expanded later)
  // eslint-disable-next-line no-unused-vars
  const handleEdit = (customerId) => {
    toast.info('Edit functionality coming soon');
    // TODO: Implement edit modal similar to EditProductModal
  };

  // Handle delete dialog
  const handleDeleteDialog = (customerId, customerName) => {
    setIsDialogOpen(true);
    setSelectedCustomerId(customerId);
    setSelectedCustomerName(customerName);
  };

  // Handle delete customer
  const handleDelete = useCallback(async (customerId) => {
    try {
      dispatch(setLoading(true));
      const response = await deleteCustomer(customerId);
      if (response) {
        toast.success(response.message || 'Customer deleted successfully');
      }
      fetchCustomers();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error(error.response?.data?.message || 'Failed to delete customer');
      setIsDialogOpen(false);
    } finally {
      dispatch(setLoading(false));
    }
  }, [fetchCustomers, dispatch]);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{ color: theme.colors.text.primary }}
        >
          Customers
        </h1>
      </div>

      {customers.length === 0 && !loadingText ? (
        <div
          className="p-8 text-center rounded-lg"
          style={{
            backgroundColor: '#FFFFFF',
            border: `1px solid ${theme.colors.border.light}`,
          }}
        >
          <p style={{ color: theme.colors.text.secondary }}>
            No customers found.
          </p>
        </div>
      ) : (
        <div
          className="rounded-lg overflow-hidden shadow-sm"
          style={{
            backgroundColor: '#FFFFFF',
            border: `1px solid ${theme.colors.border.light}`,
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  style={{
                    backgroundColor: theme.colors.background.main,
                    borderBottom: `2px solid ${theme.colors.border.light}`,
                  }}
                >
                  <th
                    className="px-4 py-3 text-left text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Customer Name
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Email
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Orders
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Total Spent
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => {
                  const customerName = getCustomerName(customer);
                  return (
                    <tr
                      key={customer.id}
                      className="hover:bg-gray-50 transition-colors"
                      style={{
                        borderBottom:
                          index < customers.length - 1
                            ? `1px solid ${theme.colors.border.light}`
                            : 'none',
                      }}
                    >
                      <td className="px-4 py-3">
                        <span
                          className="font-medium"
                          style={{ color: theme.colors.text.primary }}
                        >
                          {customerName}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span style={{ color: theme.colors.text.secondary }}>
                          {customer.email || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="font-medium"
                          style={{ color: theme.colors.text.primary }}
                        >
                          {customer.orders_count || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="font-medium"
                          style={{ color: theme.colors.text.primary }}
                        >
                          {formatCurrency(customer.total_spent)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleEdit(customer.id)}
                            className="p-2 rounded-md transition-colors cursor-pointer"
                            style={{
                              backgroundColor: theme.colors.accent.primary,
                              color: '#FFFFFF',
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = theme.colors.accent.hover;
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = theme.colors.accent.primary;
                            }}
                            title="Edit Customer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDialog(customer.id, customerName)}
                            className="p-2 rounded-md text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Customer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <DialogBox
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={selectedCustomerName}
        description={`Are you sure you want to delete "${selectedCustomerName}"?`}
        onConfirm={() => handleDelete(selectedCustomerId)}
      />
    </div>
  );
}

export default Customers;
