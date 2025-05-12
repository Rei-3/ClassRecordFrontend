"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import IconUser from "@/components/icon/icon-user";
import IconMail from "@/components/icon/icon-mail";
import { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { useSelector } from 'react-redux';
import { IRootState } from "@/store";
import { useRegisterTeacherMutation } from "@/store/api/apiSlice/authApiSlice";
import { Register } from "@/store/api/types/authType";
import RegisterModal from "../modals/registerModal";

// Define the validation schema using Zod
const schema = z.object({
  fname: z.string().nonempty({ message: "First Name is required" }),
  mname: z.string().optional(),
  lname: z.string().nonempty({ message: "Last Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  teacher_id: z.string().nonempty({ message: "Teacher ID is required" }),
  gender: z
    .enum(["true", "false"], { message: "Please select your sex" })
    .transform((val) => val === "true"),
  dob: z
    .preprocess((val) => (typeof val === "string" || val instanceof Date ? new Date(val) : undefined), z.date())
    .refine((date) => !isNaN(date.getDate()), { message: "Invalid date" }),
});

const ComponentsAuthRegisterForm: React.FC = () => {
  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const [isModalOpen, setIsModalOpen] = useState(false);

  const defaultDate = new Date();
  const year = defaultDate.getFullYear();
  const month = defaultDate.getMonth();
  const day = defaultDate.getDate(); 

  const formatDate = () => {
    return new Date(year, month, day);
  };

  const [date1, setDate1] = useState<Date>(formatDate);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Register>({
    resolver: zodResolver(schema),
    defaultValues: {
      dob: new Date(),
    },
  });

  const [registerTeacher, { isLoading }] = useRegisterTeacherMutation();

  const onSubmit = async (data: Register) => {
    try {
      const response = await registerTeacher(data).unwrap();
      console.log(response);
      setIsModalOpen(true);
    } catch (e: any) {
      console.log(e);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <form
        className="space-y-5 dark:text-white"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* First Name */}
        <div>
          <label htmlFor="fname">First Name</label>
          <div className="relative text-white-dark">
            <input
              id="fname"
              {...register("fname")}
              type="text"
              placeholder="First Name"
              className="form-input ps-10 placeholder:text-white-dark"
            />
            <span className="absolute start-4 top-1/2 -translate-y-1/2">
              <IconUser fill={true} />
            </span>
          </div>
          {errors.fname && <p className="text-red-500">{errors.fname.message}</p>}
        </div>

        {/* Middle Name */}
        <div>
          <label htmlFor="mname">Middle Name (Optional)</label>
          <div className="relative text-white-dark">
            <input
              id="mname"
              {...register("mname")}
              type="text"
              placeholder="Middle Name (Optional)"
              className="form-input ps-10 placeholder:text-white-dark"
            />
            <span className="absolute start-4 top-1/2 -translate-y-1/2">
              <IconUser fill={true} />
            </span>
          </div>
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lname">Last Name</label>
          <div className="relative text-white-dark">
            <input
              id="lname"
              {...register("lname")}
              type="text"
              placeholder="Last Name"
              className="form-input ps-10 placeholder:text-white-dark"
            />
            <span className="absolute start-4 top-1/2 -translate-y-1/2">
              <IconUser fill={true} />
            </span>
          </div>
          {errors.lname && <p className="text-red-500">{errors.lname.message}</p>}
        </div>

        {/* Email & Teacher ID */}
        <div className="flex space-x-2">
          {/* Email */}
          <div>
            <label htmlFor="email">Email</label>
            <div className="relative text-white-dark">
              <input
                id="email"
                {...register("email")}
                type="email"
                placeholder="Enter Email"
                className="form-input ps-10 placeholder:text-white-dark"
              />
              <span className="absolute start-4 top-1/2 -translate-y-1/2">
                <IconMail fill={true} />
              </span>
            </div>
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Teacher ID */}
          <div>
            <label htmlFor="teacherId">Teacher ID</label>
            <div className="relative text-white-dark">
              <input
                id="teacherId"
                {...register("teacher_id")}
                type="text"
                placeholder="Enter Teacher ID"
                className="form-input ps-10 placeholder:text-white-dark"
              />
              <span className="absolute start-4 top-1/2 -translate-y-1/2">
                <IconUser fill={true} />
              </span>
            </div>
            {errors.teacher_id && (
              <p className="text-red-500">{errors.teacher_id.message}</p>
            )}
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dob">Date of Birth</label>
          <Flatpickr
            value={date1}
            options={{ dateFormat: "Y-m-d", position: isRtl ? "auto right" : "auto left" }}
            className="form-input"
            onChange={(selectedDates) => {
              const selectedDate = selectedDates[0];
              setDate1(selectedDate);
              setValue("dob", selectedDate);
            }}
          />
          {errors.dob && <p className="text-red-500">{errors.dob.message}</p>}
        </div>

        {/* Gender Selection */}
        <div className="flex space-x-5">
          <label htmlFor="gender">Sex: </label>
          <label className="flex cursor-pointer items-center">
            <input
              type="radio"
              {...register("gender")}
              value="true"
              className="form-radio bg-white dark:bg-black"
            />
            <span className="text-white-dark">Male</span>
          </label>
          <label className="flex cursor-pointer items-center">
            <input
              type="radio"
              {...register("gender")}
              value="false"
              className="form-radio bg-white dark:bg-black"
            />
            <span className="text-white-dark">Female</span>
          </label>
        </div>
        {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
        <div className="flex">
           {/* Open Modal Button - Separate from form submission */}

            <h1 >
            Already submitted a registration request?
            </h1>

        <button
          type="button"
          onClick={handleOpenModal}
          className="btn btn-info w-full"
        >
          Open Verification Modal
        </button>
        
        </div>
       
      </form>
      
      {/* Always render the modal component, but control visibility with isOpen */}
      <RegisterModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default ComponentsAuthRegisterForm;