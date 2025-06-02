"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useGetGradeCategoryQuery } from "@/store/api/apiSlice/get/gradesApiSlice";
import { usePostAddActivityMutation } from "@/store/api/apiSlice/post/gradesApiSlice";
import ConfirmationModal from "@/components/modals/confirmationModal";
import SuccessModal from "@/components/modals/successModal";

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  numberOfItems: z.number().min(1, "Must be greater than 0"),
  categoryId: z.number().min(1, "Please select a category"),
});

type FormData = z.infer<typeof formSchema>;

type AddActivityProps = {
  termId: number;
  onSuccess?: () => void;
  onClose: () => void;
};

export default function AddActivity({
  termId,
  onSuccess,
  onClose,
}: AddActivityProps) {
  const { id } = useParams();
  const { data: categoryData = [] } = useGetGradeCategoryQuery();
  const [postAddActivity, { isLoading }] = usePostAddActivityMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [formValues, setFormValues] = useState<FormData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    setFormValues(data);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (!formValues) return;

    postAddActivity({
      ...formValues,
      teachingLoadDetailId: Number(id),
      termId: termId,
    })
      .unwrap()
      .then(() => {
        onSuccess?.();
        setIsSuccessOpen(true);
        reset();
        onClose?.(); // Clear form after success
      })
      .catch((error) => {
        // handle error if needed
      })
      .finally(() => {
        setIsModalOpen(false);
        setFormValues(null);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFormValues(null);
    onClose?.();
  };

  return (
    <>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Activity Creation"
        message="Are you sure you want to create this activity?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmText="Yes, Confirm"
        cancelText="Cancel"
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        message={formValues?.description}
        desc="Activity has been successfully created!"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-lg space-y-6 rounded-3xl bg-white p-2 duration-300 dark:bg-gray-800"
      >
        {isLoading && (
          <div className="flex h-screen items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-zinc-800 dark:text-white">
          Create an Activity
        </h2>

        {/* Category */}
        <div>
          <label className="mb-1 block font-medium text-zinc-700 dark:text-zinc-200">
            Category
          </label>
          <select
            {...register("categoryId", { valueAsNumber: true })}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          >
            <option value="">Select a category</option>
            {categoryData
              ?.filter((cat: any) => cat.id !== 4)
              .map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </option>
              ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-500">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block font-medium text-zinc-700 dark:text-zinc-200">
            Description
          </label>
          <input
            type="text"
            {...register("description")}
            placeholder="Enter activity description"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Number of Items */}
        <div>
          <label className="mb-1 block font-medium text-zinc-700 dark:text-zinc-200">
            Number of Items
          </label>
          <input
            type="number"
            {...register("numberOfItems", { valueAsNumber: true })}
            placeholder="e.g., 10"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
          {errors.numberOfItems && (
            <p className="mt-1 text-sm text-red-500">
              {errors.numberOfItems.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white shadow-md transition-transform duration-150 hover:bg-blue-700 active:scale-95"
        >
          Submit
        </button>
      </form>
    </>
  );
}
