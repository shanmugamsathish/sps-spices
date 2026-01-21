import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Mail, Phone, MapPin, User2, ShoppingBag, IndianRupee, Home, Pencil } from "lucide-react";
import { getUserProfile } from "../../apiCalls/users";
import { getCustomerById } from "../../apiCalls/customers";
import theme from "../../lib/theme";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/loaderSlice";
import EditCustomerModal from "../../Components/AdminEditCustomer/EditCustomerModel";

function MyProfile() {
  const [customerId, setCustomerId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loader.loading);
  const [error, setError] = useState("");
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    try {
      setError("");
      const res = await getUserProfile();
      setCustomerId(res?.customer?.id || null);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Unable to load your profile. Please try again.");
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const fetchCustomer = useCallback(async () => {
    if (!customerId) return;
    try {
      dispatch(setLoading(true));
      setError("");
      const res = await getCustomerById(customerId);
      setUserProfile(res);
    } catch (err) {
      console.error("Error fetching customer by id:", err);
      setError("Unable to load customer details. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  }, [customerId, dispatch]);

  useEffect(() => {
    if (!customerId) return;
    fetchCustomer();
  }, [customerId, fetchCustomer]);

  const handleCustomerUpdate = useCallback(() => {
    setIsEditCustomerModalOpen(false);
    fetchUserProfile();
    fetchCustomer();
  }, [fetchUserProfile, fetchCustomer]);

  const customer = userProfile;
  const defaultAddress = customer?.default_address;
  const addresses = customer?.addresses || [];

  const quickStats = useMemo(() => {
    return [
      {
        label: "Orders",
        value: customer?.orders_count ?? 0,
        icon: ShoppingBag,
      },
      {
        label: "Total Spent",
        value: `₹${customer?.total_spent || "0.00"}`,
        icon: IndianRupee,
      },
      {
        label: "Currency",
        value: customer?.currency || "-",
        icon: IndianRupee,
      },
      {
        label: "Account Status",
        value: customer?.state ? String(customer.state).toUpperCase() : "-",
        icon: User2,
      },
    ];
  }, [customer]);

  const displayName =
    customer?.name ||
    [customer?.first_name, customer?.last_name].filter(Boolean).join(" ") ||
    "Customer";

  return (
    <div
      className="w-full py-6 sm:py-8"
      style={{ backgroundColor: theme.colors.background.main }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-xl shadow-sm"
            style={{ backgroundColor: theme.colors.accent.primary, color: "#fff" }}
          >
            <User2 className="w-5 h-5" />
          </div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: theme.colors.text.primary }}
          >
            My Profile
          </h1>
          </div>
          <div className="cursor-pointer p-2.5 rounded-xl shadow-sm hover:bg-gray-100 transition-all duration-300" style={{ backgroundColor: theme.colors.accent.primary, color: "#fff" }} onClick={() => setIsEditCustomerModalOpen(true)}>
          <Pencil className="w-5 h-5" />
          </div>
        </div>

        {loading && (
          <div
            className="rounded-2xl border shadow-sm p-6 animate-pulse"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: theme.colors.border.light,
            }}
          >
            <div className="h-6 w-48 rounded bg-gray-200 mb-3" />
            <div className="h-4 w-64 rounded bg-gray-200 mb-6" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-gray-100 border" />
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            className="rounded-2xl border p-4"
            style={{
              backgroundColor: "#fff",
              borderColor: theme.colors.border.light,
              color: theme.colors.text.primary,
            }}
          >
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && customer && (
          <div
            className="rounded-2xl border shadow-sm overflow-hidden"
            style={{ backgroundColor: "#FFFFFF", borderColor: theme.colors.border.light }}
          >
            {/* Header */}
            <div className="p-6 sm:p-8 border-b" style={{ borderColor: theme.colors.border.light }}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: theme.colors.accent.primary, color: "#fff" }}
                  >
                    <User2 className="w-6 h-6" />
                  </div>

                  <div>
                    <h2
                      className="text-xl sm:text-2xl font-bold"
                      style={{ color: theme.colors.text.primary }}
                    >
                      {displayName}
                    </h2>

                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-sm" style={{ color: theme.colors.text.secondary }}>
                        <Mail className="w-4 h-4" />
                        <span className="break-all">{customer?.email || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm" style={{ color: theme.colors.text.secondary }}>
                        <Phone className="w-4 h-4" />
                        <span>{customer?.phone || "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <span
                  className="w-fit px-3 py-1.5 text-xs font-semibold rounded-full border"
                  style={{
                    borderColor: theme.colors.border.light,
                    backgroundColor:
                      customer?.state === "enabled" ? "#dcfce7" : "#fef2f2",
                    color: customer?.state === "enabled" ? "#166534" : "#991b1b",
                  }}
                >
                  {customer?.state === "enabled" ? "Active Member" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="rounded-xl border p-4"
                      style={{
                        borderColor: theme.colors.border.light,
                        backgroundColor: theme.colors.background.main,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="p-2 rounded-lg"
                          style={{
                            backgroundColor: theme.colors.accent.primary,
                            color: "#fff",
                          }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-medium" style={{ color: theme.colors.text.secondary }}>
                          {stat.label}
                        </p>
                      </div>
                      <p className="mt-3 text-lg sm:text-xl font-bold" style={{ color: theme.colors.text.primary }}>
                        {stat.value}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Addresses */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Default Address */}
                <div
                  className="rounded-2xl border p-5"
                  style={{
                    borderColor: theme.colors.border.light,
                    backgroundColor: theme.colors.background.main,
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: theme.colors.accent.primary, color: "#fff" }}
                    >
                      <Home className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold" style={{ color: theme.colors.text.primary }}>
                      Default Address
                    </h3>
                  </div>

                  {defaultAddress ? (
                    <div className="text-sm space-y-1" style={{ color: theme.colors.text.secondary }}>
                      <p className="font-semibold" style={{ color: theme.colors.text.primary }}>
                        {defaultAddress?.name || displayName}
                      </p>
                      <p>{defaultAddress?.address1}</p>
                      {defaultAddress?.address2 && <p>{defaultAddress.address2}</p>}
                      <p>
                        {defaultAddress?.city}, {defaultAddress?.province}
                      </p>
                      <p>
                        {defaultAddress?.country} • {defaultAddress?.zip}
                      </p>
                      {defaultAddress?.phone && (
                        <p className="flex items-center gap-2 pt-2" style={{ color: theme.colors.text.primary }}>
                          <Phone className="w-4 h-4" />
                          <span className="font-medium">{defaultAddress.phone}</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
                      No default address found.
                    </p>
                  )}
                </div>

                {/* Saved Addresses */}
                <div
                  className="rounded-2xl border p-5"
                  style={{
                    borderColor: theme.colors.border.light,
                    backgroundColor: theme.colors.background.main,
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: theme.colors.accent.primary, color: "#fff" }}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold" style={{ color: theme.colors.text.primary }}>
                      Saved Addresses
                    </h3>
                  </div>

                  {addresses?.length > 0 ? (
                    <div className="space-y-3">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className="rounded-xl border p-4"
                          style={{ borderColor: theme.colors.border.light, backgroundColor: "#fff" }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="text-sm" style={{ color: theme.colors.text.secondary }}>
                              <p className="font-semibold" style={{ color: theme.colors.text.primary }}>
                                {addr?.name || displayName}
                              </p>
                              <p>{addr?.address1}</p>
                              {addr?.address2 && <p>{addr.address2}</p>}
                              <p>
                                {addr?.city}, {addr?.province}
                              </p>
                              <p>
                                {addr?.country} • {addr?.zip}
                              </p>
                              {addr?.phone && (
                                <p className="flex items-center gap-2 pt-2" style={{ color: theme.colors.text.primary }}>
                                  <Phone className="w-4 h-4" />
                                  <span className="font-medium">{addr.phone}</span>
                                </p>
                              )}
                            </div>

                            {addr?.default && (
                              <span
                                className="shrink-0 text-xs px-2 py-1 rounded-full border font-semibold"
                                style={{
                                  backgroundColor: "#dcfce7",
                                  color: "#166534",
                                  borderColor: theme.colors.border.light,
                                }}
                              >
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
                      No saved addresses found.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <EditCustomerModal
        customerId={customerId}
        isOpen={isEditCustomerModalOpen}
        onClose={() => setIsEditCustomerModalOpen(false)}
        onUpdate={handleCustomerUpdate}
        title="Edit Profile"
      />
    </div>
  );
}

export default MyProfile;
