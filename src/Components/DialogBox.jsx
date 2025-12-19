import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import theme from '../lib/theme';
import { X } from 'lucide-react';

function DialogBox({ isOpen, onClose, title, description, onConfirm }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true"  />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-xl flex flex-col gap-4" >
          <DialogTitle className="text-xl font-semibold mb-2 text-white flex items-center justify-between" style={{ borderBottom: `1px solid ${theme.colors.text.primary}`, color: theme.colors.text.primary, paddingBottom: '10px'}}>
            <span>{title}</span>
            <button style={{ color: theme.colors.text.primary }} onClick={onClose}><X className='w-5 h-5 cursor-pointer' /></button>
          </DialogTitle>
          <Description className="text-md text-gray-600 mb-4" style={{ color: theme.colors.text.primary }}>{description}</Description>
          <div className="flex gap-2 justify-end">
            <button className='border border-gray-500 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100 cursor-pointer' onClick={onClose} >Cancel</button>
            <button className=' text-white px-4 py-2 rounded-md cursor-pointer' onClick={onConfirm} style={{ backgroundColor: theme.colors.accent.primary, hover: theme.colors.accent.hover }}>Confirm</button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default DialogBox;