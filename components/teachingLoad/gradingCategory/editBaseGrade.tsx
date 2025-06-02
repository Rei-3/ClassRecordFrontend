"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { usePutBaseGradeMutation } from "@/store/api/apiSlice/put/gradesApiSlice";
import { useGetBaseGradeQuery } from "@/store/api/apiSlice/get/gradesApiSlice";
import { BaseGradeMutation } from "@/store/api/types/classRecord";
import ConfirmationModal from "@/components/modals/confirmationModal"; // adjust path if needed

interface EditBaseGradeProps {
  baseGrade: any;
  onSuccess?: () => void;
}

export default function EditBaseGrade({ baseGrade, onSuccess }: EditBaseGradeProps) {
  const { id } = useParams();
  const [formData, setFormData] = useState({ baseGrade: "", percentage: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({ visible: false, isSuccess: false, message: "" });

  const [putGrades] = usePutBaseGradeMutation();
  const { data: baseGradeData } = useGetBaseGradeQuery(
    { tld: Number(id) },
    { refetchOnMountOrArgChange: true }
  );

  const handleInputChange = (field: string, value: string) => {
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      const newFormData = { ...formData, [field]: value };
      setFormData(newFormData);

      const baseGrade = newFormData.baseGrade === "" ? 0 : Number(newFormData.baseGrade);
      const percentage = newFormData.percentage === "" ? 0 : Number(newFormData.percentage);
      validateTotal({ baseGrade, percentage });
    }
  };

  const validateTotal = ({ baseGrade, percentage }: { baseGrade: number; percentage: number }) => {
    const newErrors: Record<string, string> = {};
    const total = baseGrade + percentage;

    if (total !== 100) newErrors.total = "Total of Base Grade and Percentage must equal 100%";
    if (baseGrade < 0 || baseGrade > 100) newErrors.baseGrade = "Base Grade must be between 0 and 100";
    if (percentage < 0 || percentage > 100) newErrors.percentage = "Percentage must be between 0 and 100";

    setErrors(newErrors);
  };

  const baseGradeNum = formData.baseGrade === "" ? 0 : Number(formData.baseGrade);
  const percentageNum = formData.percentage === "" ? 0 : Number(formData.percentage);
  const total = baseGradeNum + percentageNum;
  const isValid = total === 100 && Object.keys(errors).length === 0;

  const confirmSubmit = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    setIsModalOpen(false);
    setIsSubmitting(true);

    const payload = {
      baseGradeId: baseGradeData?.id,
      data: {
        teachingLoadDetailId: Number(id),
        baseGrade: baseGradeNum,
        percentage: percentageNum,
      },
    };

    try {
      await putGrades(payload as { baseGradeId: number; data: BaseGradeMutation }).unwrap();
      setNotification({ visible: true, isSuccess: true, message: "Base grade saved successfully!" });
      onSuccess?.();
    } catch {
      setNotification({ visible: true, isSuccess: false, message: "Failed to save base grade. Try again." });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification({ visible: false, isSuccess: false, message: "" }), 3000);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Edit Base Grade</h2>

      {notification.visible && (
        <p
          className={`text-sm font-medium px-4 py-2 rounded ${
            notification.isSuccess
              ? "text-green-700 bg-green-100"
              : "text-red-700 bg-red-100"
          }`}
        >
          {notification.message}
        </p>
      )}

      <div className="space-y-2">
        <label className="text-sm text-gray-600 dark:text-gray-300">
          Total:{" "}
          <span
            className={`${
              total === 100 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            } font-semibold`}
          >
            {total}%
          </span>
        </label>
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              total === 100 ? "bg-green-500" : "bg-blue-500"
            }`}
            style={{ width: `${Math.min(total, 100)}%` }}
          ></div>
        </div>
        {errors.total && <p className="text-xs text-red-600 dark:text-red-400">{errors.total}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { label: "Base Grade", field: "baseGrade" },
          { label: "Percentage", field: "percentage" },
        ].map(({ label, field }) => (
          <div key={field} className="relative group">
            <input
              type="number"
              id={field}
              value={formData[field as keyof typeof formData]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              min={0}
              max={100}
              className="peer w-full px-4 pt-6 pb-2 text-sm bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="0"
            />
            <label
              htmlFor={field}
              className="absolute left-4 top-2 text-xs text-gray-500 dark:text-gray-400 peer-focus:text-blue-500"
            >
              {label}
            </label>
            {errors[field] && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors[field]}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={confirmSubmit}
          disabled={!isValid || isSubmitting}
          className={`w-full py-3 text-sm font-medium rounded-md transition-colors duration-300 ${
            !isValid || isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Save"
        message="Are you sure you want to save this base grade?"
        onConfirm={handleConfirm}
        onCancel={() => setIsModalOpen(false)}
        confirmText="Yes, Save"
        cancelText="Cancel"
      />
    </div>
  );
}
