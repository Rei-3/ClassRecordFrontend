"use client";
import IconX from "@/components/icon/icon-x";
import { useRegisterTeacherUsernameMutation } from "@/store/api/apiSlice/authApiSlice";
import { UsernanamePassword } from "@/store/api/types/authType";
import { Transition, Dialog } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Fragment, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SuccessModal from "@/components/modals/successModal";
import isFetchBaseQueryError from "@/lib/utils/error";

interface FormValues extends UsernanamePassword {
  otp: string;
}

const schema = z.object({
  username: z.string().nonempty({ message: "Username cannot be empty" }),
  password: z.string().nonempty({ message: "Password cannot be empty" }),
  otp: z.string().nonempty({ message: "OTP cannot be empty" }),
});

interface RegisterModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen ?? true);

  useEffect(() => {
    if (isOpen !== undefined) {
      setIsModalOpen(isOpen);
    }
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [nativeError, setNativeError] = useState<string | undefined>();

  const [registerTeacherUsername, { isLoading, error }] =
    useRegisterTeacherUsernameMutation();

  const onSubmit = async (data: FormValues) => {
    try {
      const { otp, ...userData } = data;
      const response = await registerTeacherUsername({ 
        otp, 
        userData 
      }).unwrap();
      
      setSuccessMessage(response.username);
      setShowSuccess(true);
      reset();
      handleClose();

    } catch (err) {
    
      if (isFetchBaseQueryError(err)) {
        // Type-safe access to error data
        const errorMessage = 'data' in err ? (err.data as { message?: string }).message : err.error;
       
        setErrorMessage(errorMessage);

      } else if (err instanceof Error) {
        setNativeError(err.message);
      }
    }
  };


  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" open={isModalOpen} onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0" />
          </Transition.Child>
          <div className="fixed inset-0 z-[999] overflow-y-auto bg-black/60">
            <div className="flex min-h-screen items-start justify-center px-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="panel my-8 w-full max-w-sm overflow-hidden rounded-lg border-0 px-4 py-1 text-black dark:text-white-dark">
                  <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                    <div className="flex items-center justify-between p-5 text-lg font-semibold dark:text-white">
                      <h5>Verification if you are REAL</h5>
                      <button
                        type="button"
                        onClick={handleClose}
                        className="text-white-dark hover:text-dark"
                      >
                        <IconX />
                      </button>
                    </div>

                    <div className="p-5">
                      <div className="space-y-5">
                        <div className="flex space-x-2">
                          <div className="relative w-full text-white-dark">
                            <label htmlFor="username">Username</label>
                            <input
                              id="username"
                              type="text"
                              placeholder="Enter Username"
                              className="form-input ps-4 placeholder:text-white-dark"
                              {...register("username")}
                            />
                            {errors.username && (
                              <p className="text-red-500 text-sm">
                                {errors.username.message}
                              </p>
                            )}
                          </div>

                          <div className="relative w-full text-white-dark">
                            <label htmlFor="otp">OTP</label>
                            <input
                              id="otp"
                              type="text"
                              placeholder="Enter OTP"
                              className="form-input ps-4 placeholder:text-white-dark"
                              {...register("otp")}
                            />
                            {errors.otp && (
                              <p className="text-red-500 text-sm">
                                {errors.otp.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="relative text-white-dark">
                          <label htmlFor="password">Password</label>
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            className="form-input ps-4 placeholder:text-white-dark"
                            {...register("password")}
                          />
                          {errors.password && (
                            <p className="text-red-500 text-sm">
                              {errors.password.message}
                            </p>
                          )}
                          <div className="mt-2 flex items-center">
                            <input
                              id="showPassword"
                              type="checkbox"
                              checked={showPassword}
                              onChange={() => setShowPassword(!showPassword)}
                              className="form-checkbox bg-white dark:bg-black"
                            />
                            <label
                              htmlFor="showPassword"
                              className="ml-2 mt-2 text-white-dark"
                            >
                              Show Password
                            </label>
                          </div>
                        </div>

                        {error && (
                          <p className="text-red-500 text-sm">
                            Registration failed {errorMessage} {nativeError}
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="btn btn-primary w-full"
                        >
                          {isLoading ? "Submitting..." : "Submit"}
                        </button>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <SuccessModal 
        isOpen={showSuccess} 
        onClose={() => setShowSuccess(false)}
        message={successMessage}
      />
    </>
  );
};

export default RegisterModal;