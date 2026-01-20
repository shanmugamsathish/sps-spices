import React from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from "lucide-react";

function AddressSelectionModal({ isPaymentPage, isAddressModalOpen, setIsAddressModalOpen, handleSelectAddress, addresses, theme }) {
  return (
    <div>
        {isPaymentPage && isAddressModalOpen && setIsAddressModalOpen && handleSelectAddress && (
        <Dialog open={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="mx-auto max-w-2xl w-full max-h-[80vh] rounded-lg bg-white shadow-xl flex flex-col">
              <DialogTitle className="text-xl font-semibold p-6 pb-4 flex items-center justify-between border-b"
                style={{ borderColor: theme.colors.border.light, color: theme.colors.text.primary }}>
                <span>Choose Shipping Address</span>
                <button 
                  style={{ color: theme.colors.text.primary }} 
                  onClick={() => setIsAddressModalOpen(false)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <X className="w-5 h-5 cursor-pointer" />
                </button>
              </DialogTitle>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {addresses.map((address, index) => {
                    const isCurrentAddress = index === 0;
                    const addressString = [
                      address.address1,
                      address.address2,
                      address.city,
                      address.province,
                      address.country,
                      address.zip
                    ].filter(Boolean).join(", ");

                    return (
                      <div
                        key={index}
                        onClick={() => handleSelectAddress(index)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          isCurrentAddress ? 'ring-2' : ''
                        }`}
                        style={{
                          backgroundColor: isCurrentAddress 
                            ? theme.colors.accent.primary + "10" 
                            : theme.colors.background.main,
                          borderColor: isCurrentAddress 
                            ? theme.colors.accent.primary 
                            : theme.colors.border.light,
                          borderWidth: isCurrentAddress ? '2px' : '1px',
                        }}
                        onMouseEnter={(e) => {
                          if (!isCurrentAddress) {
                            e.currentTarget.style.backgroundColor = theme.colors.background.main;
                            e.currentTarget.style.borderColor = theme.colors.accent.primary;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isCurrentAddress) {
                            e.currentTarget.style.backgroundColor = theme.colors.background.main;
                            e.currentTarget.style.borderColor = theme.colors.border.light;
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3
                                className="text-md font-semibold"
                                style={{ color: theme.colors.text.primary }}
                              >
                                {address.first_name} {address.last_name}
                              </h3>
                              {isCurrentAddress && (
                                <span
                                  className="text-xs px-2 py-1 rounded"
                                  style={{
                                    backgroundColor: theme.colors.accent.primary,
                                    color: "#FFFFFF",
                                  }}
                                >
                                  Current
                                </span>
                              )}
                            </div>
                            {address.company && (
                              <p
                                className="text-sm mb-1"
                                style={{ color: theme.colors.text.secondary }}
                              >
                                {address.company}
                              </p>
                            )}
                            <p
                              className="text-sm mb-1"
                              style={{ color: theme.colors.text.secondary }}
                            >
                              {addressString}
                            </p>
                            {address.phone && (
                              <p
                                className="text-sm"
                                style={{ color: theme.colors.text.secondary }}
                              >
                                Phone: {address.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </div>
  )
}

export default AddressSelectionModal
