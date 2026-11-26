import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useState } from 'react';

export default function Modal({  children }) {
    const [isClose, setIsClose]=useState(true)
  return (
    <Dialog open={isClose} onClose={() => {}}  className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}