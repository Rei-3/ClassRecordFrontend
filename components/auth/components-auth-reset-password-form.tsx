"use client";
import IconMail from "@/components/icon/icon-mail";
import isFetchBaseQueryError from "@/lib/utils/error";
import { useRegisterTeacherUsernameMutation } from "@/store/api/apiSlice/authApiSlice";
import { UsernanamePassword } from "@/store/api/types/authType";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface FormValues extends UsernanamePassword {
  otp: string;
}

const schema = z.object({
  username: z.string().nonempty({ message: "Username cannot be empty" }),
  password: z.string().nonempty({ message: "Password cannot be empty" }),
  otp: z.string().nonempty({ message: "OTP cannot be empty" }),
});

const ComponentsAuthResetPasswordForm = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [nativeError, setNativeError] = useState<string | undefined>();

  const router = useRouter();

  const [registerTeacherUsername, { isLoading, error }] =
    useRegisterTeacherUsernameMutation();

  const onSubmit = async (data: FormValues) => {
    try {
      const { otp, ...userData } = data;
      const response = await registerTeacherUsername({
        otp,
        userData,
      }).unwrap();

      setSuccessMessage(response.username);
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      reset();
    } catch (err) {
      if (isFetchBaseQueryError(err)) {
        // Type-safe access to error data
        const errorMessage =
          "data" in err
            ? (err.data as { message?: string }).message
            : err.error;

        setErrorMessage(errorMessage);
      } else if (err instanceof Error) {
        setNativeError(err.message);
      }
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="relative text-white-dark">
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
                    <p className="text-sm text-red-500">
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
                    <p className="text-sm text-red-500">{errors.otp.message}</p>
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
                  <p className="text-sm text-red-500">
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
                <p className="text-sm text-red-500">
                  Registration failed {errorMessage} {nativeError}
                </p>
              )}


            </div>
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
      >
         {isLoading ? "Submitting..." : "Submit"}
      </button>
      {showSuccess && (
  <p className="text-sm text-green-500 text-center">{successMessage}</p>
)}

    </form>
    
  );
};

export default ComponentsAuthResetPasswordForm;
