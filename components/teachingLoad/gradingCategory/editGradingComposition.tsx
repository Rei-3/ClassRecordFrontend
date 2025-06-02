"use client";

import { useState } from "react";
import { useGetGradeCategoryQuery } from "@/store/api/apiSlice/get/gradesApiSlice";
import { usePutGradingCompositionMutation } from "@/store/api/apiSlice/put/gradesApiSlice";
import ConfirmationModal from "@/components/modals/confirmationModal";
// Adjust the import path as needed

interface EditGradingCompositionProps {
  gradingComposition: any;
  onSuccess?: () => void;
}

export default function EditGradingComposition({ gradingComposition, onSuccess }: EditGradingCompositionProps) {
  const [formData, setFormData] = useState({ quiz: 0, activity: 0, exam: 0, attendance: 0 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ visible: false, isSuccess: false, message: "" });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { data: categoryData } = useGetGradeCategoryQuery();
  const [putGradingComposition] = usePutGradingCompositionMutation();

  const handleInputChange = (field: string, value: string) => {
    const numValue = Number(value);
    setFormData((prev) => ({ ...prev, [field]: numValue }));
    validateField(field, numValue);
  };

  const validateField = (field: string, value: number) => {
    const newErrors: Record<string, string> = { ...errors };
    delete newErrors[field];

    if (value < 0) newErrors[field] = "Must be at least 0%";
    else if (value > 100) newErrors[field] = "Cannot exceed 100%";

    const total = Object.entries({ ...formData, [field]: value }).reduce((sum, [, v]) => sum + Number(v), 0);
    if (total > 100) newErrors.total = "Total cannot exceed 100%";
    else delete newErrors.total;

    setErrors(newErrors);
  };

  const handleSubmitConfirmation = async () => {
    setShowConfirmation(false);
    const total = Object.values(formData).reduce((sum, v) => sum + Number(v), 0);
    if (total !== 100) {
      setErrors((prev) => ({ ...prev, total: "Total must equal exactly 100%" }));
      return;
    }

    if (!categoryData) return;

    setIsSubmitting(true);

    const updatedEntries = Object.entries(formData).map(([key, value]) => {
      const comp = gradingComposition.composition.find((item: any) =>
        item.category.categoryName.toLowerCase() === key.toLowerCase()
      );

      return {
        gradingCompositionId: comp?.id,
        percentage: value,
      };
    });

    try {
      await Promise.all(updatedEntries.map((entry) => putGradingComposition(entry).unwrap()));
      setNotification({ visible: true, isSuccess: true, message: "Saved successfully!" });
      onSuccess?.();
    } catch {
      setNotification({ visible: true, isSuccess: false, message: "Failed to save. Try again." });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification({ visible: false, isSuccess: false, message: "" }), 3000);
    }
  };

  const total = Object.values(formData).reduce((sum, v) => sum + Number(v), 0);
  const isValid = total === 100 && Object.keys(errors).length === 0;

  // Generate confirmation message showing all values
  

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Grading Composition</h2>

      {notification.visible && (
        <div className={`rounded-md p-3 transition-all ${notification.isSuccess ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'}`}>
          {notification.message}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm text-gray-600 dark:text-gray-300">Total: <span className={`${total === 100 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} font-semibold`}>{total}%</span></label>
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-500 ${total === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(total, 100)}%` }}></div>
        </div>
        {errors.total && <p className="text-xs text-red-600 dark:text-red-400">{errors.total}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {["quiz", "activity", "exam", "attendance"].map((field) => (
          <div key={field} className="relative group">
            <input
              type="number"
              id={field}
              placeholder={gradingComposition.composition.find((item: any) => item.category.categoryName.toLowerCase() === field)?.percentage}
              onChange={(e) => handleInputChange(field, e.target.value)}
              min={0}
              max={100}
              className="peer w-full px-4 pt-6 pb-2 text-sm bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
            <label htmlFor={field} className="absolute left-4 top-2 text-xs text-gray-500 dark:text-gray-400 transition-all peer-focus:top-1 peer-focus:text-blue-600 dark:peer-focus:text-blue-400">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            {errors[field] && <p className="text-xs mt-1 text-red-500 dark:text-red-400">{errors[field]}</p>}
          </div>
        ))}
      </div>

      <button
        disabled={!isValid || isSubmitting}
        onClick={() => setShowConfirmation(true)}
        className={`w-full py-3 text-sm font-medium rounded-md transition-colors duration-300 ${
          !isValid || isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {isSubmitting ? "Submitting..." : "Save Composition"}
      </button>

      <ConfirmationModal
        isOpen={showConfirmation}
        title="Confirm Grading Composition Changes"
        message={"Are you sure you want to make these changes?\n\n"}
        onConfirm={handleSubmitConfirmation}
        onCancel={() => setShowConfirmation(false)}
        confirmText="Confirm Changes"
        cancelText="Cancel"
        danger={false}
      />
    </div>
  );
}