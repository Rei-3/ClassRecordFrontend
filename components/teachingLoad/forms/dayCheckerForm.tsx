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
    { value: 'Daily', label: 'Daily' },
    { value: 'MWF', label: 'MWF' },
    { value: 'TTH', label: 'TTH' },
    { value: 'Saturday', label: 'Saturday' },
  ];

  const handleChange = (selectedOption: DayOption | null) => {
    dispatch(clearSelectedDays());

    if (selectedOption) {
      dispatch(addSelectedDay(selectedOption.value));
      onChange?.(selectedOption.value); // optional callback
    }
  };

  const selectedValue = days.find((day) =>
    selectedDays.includes(day.value)
  ) || null;

  return (
    <div className="w-full">
      <Select
        placeholder="Select a Day"
        className="text-black"
        onChange={handleChange}
        value={selectedValue}
        options={days}
        isSearchable={false}
        // isMulti removed
      />
    </div>
  );
}
