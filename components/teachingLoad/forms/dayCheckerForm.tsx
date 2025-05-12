'use client'

import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import {
  addSelectedDay,
  clearSelectedDays,
} from '@/store/api/slices/teachingLoadSlice';

interface DayOption {
  value: string;
  label: string;
}

interface DayCheckerFormProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function DayCheckerForm({ value, onChange }: DayCheckerFormProps) {
  const dispatch = useDispatch();
  const selectedDays = useSelector(
    (state: any) => state.teachingLoad.SelectedDays
  );

  const days: DayOption[] = [
    { value: 'M', label: 'Monday' },
    { value: 'T', label: 'Tuesday' },
    { value: 'W', label: 'Wednesday' },
    { value: 'TH', label: 'Thursday' },
    { value: 'F', label: 'Friday' },
    { value: 'Sat', label: 'Saturday' },
    { value: 'Sun', label: 'Sunday' },
  ];

  const handleChange = (selectedOptions: readonly DayOption[] | null) => {
    dispatch(clearSelectedDays());

    if (selectedOptions) {
      selectedOptions.forEach((option) => {
        dispatch(addSelectedDay(option.value));
      });
    }
  };

  // Map selected day strings from Redux to DayOption[]
  const selectedValues = days.filter((day) =>
    selectedDays.includes(day.value)
  );

  return (
    <div className="w-full">
      <Select
        placeholder="Select Days"
        className="text-black"
        onChange={handleChange}
        value={selectedValues} // controlled!
        options={days}
        isMulti
        isSearchable={false}
      />
    </div>
  );
}
