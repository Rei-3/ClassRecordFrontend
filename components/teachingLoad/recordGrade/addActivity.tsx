'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useGetGradeCategoryQuery } from '@/store/api/apiSlice/get/gradesApiSlice';
import { usePostAddActivityMutation } from '@/store/api/apiSlice/post/gradesApiSlice';

const formSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  numberOfItems: z.number().min(1, 'Must be greater than 0'),
  categoryId: z.number().min(1, 'Please select a category'),
});

type FormData = z.infer<typeof formSchema>;


type AddActivityProps = {
    termId: number;
    onSuccess?: () => void;
}
export default function AddActivity({termId, onSuccess}: AddActivityProps) {

    const { id } = useParams();
    
    const {data: categoryData = [] } = useGetGradeCategoryQuery();
    const [postAddActivity] = usePostAddActivityMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    postAddActivity({
        ...data,
        teachingLoadDetailId: Number(id),
        termId: termId,
    })
        .unwrap()
        .then(() => {
           onSuccess?.();
        })
        .catch((error) => {
            // Handle error (e.g., show an error message)
        }
    )
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg mx-auto space-y-6 p-2 bg-white dark:bg-gray-800 rounded-3xl duration-300"
    >
      <h2 className="text-2xl font-bold text-zinc-800 dark:text-white">Create an Activity</h2>
           {/* Category */}
           <div>
        <label className="block font-medium text-zinc-700 dark:text-zinc-200 mb-1">Category</label>
        <select
          {...register('categoryId', { valueAsNumber: true })}
          className="w-full px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="">Select a category</option>
         {categoryData?.map((cat : any) => (
            <option key={cat.id} value={cat.id}>
              {cat.categoryName}
            </option>
        ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-500">{errors.categoryId.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium text-zinc-700 dark:text-zinc-200 mb-1">Description</label>
        <input
          type="text"
          {...register('description')}
          placeholder="Enter activity description"
          className="w-full px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Number of Items */}
      <div>
        <label className="block font-medium text-zinc-700 dark:text-zinc-200 mb-1">Number of Items</label>
        <input
          type="number"
          {...register('numberOfItems', { valueAsNumber: true })}
          placeholder="e.g., 10"
          className="w-full px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        {errors.numberOfItems && (
          <p className="mt-1 text-sm text-red-500">{errors.numberOfItems.message}</p>
        )}
      </div>

 

      <button
        type="submit"
        className="w-full py-2.5 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-transform duration-150 shadow-md"
      >
        Submit
      </button>
    </form>
  );
}


