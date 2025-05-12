"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  code?: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, message, code }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" open={isOpen} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 z-[999]" />
        </Transition.Child>

        <div className="fixed inset-0 z-[999] overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
              <div className="flex items-center justify-between bg-[#fbfbfb] dark:bg-[#121c2c] px-5 py-3">
                <h5 className="font-bold text-lg text-red-600 dark:text-red-400">Error {code}</h5>
                <button onClick={onClose} type="button" className="text-white-dark hover:text-dark">
                  <svg width="24" height="24" fill="none" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-5">
                <p className="whitespace-pre-line text-base">
                  {message || "An unexpected error occurred. Please try again."}
                </p>
                <div className="flex justify-end items-center mt-8">
                  <button
                    onClick={onClose}
                    type="button"
                    className="btn btn-outline-danger"
                  >
                    Close
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ErrorModal;
