'use client'

import { useDispatch } from "react-redux";
import { AppDispatch, IRootState } from "@/store";
import { useSelector } from "react-redux";
import { setSearchValue } from "@/store/api/slices/searchSice";

interface SearchBarProps {
    value: string;
    onChange : (value: string) => void;
    placeholder?: string;
   
}

export default function SearchBar({
    value,
    onChange,
    placeholder,
}: SearchBarProps) {

    const dispatch = useDispatch<AppDispatch>();
    const searchVal = useSelector((state: IRootState) => state.search.searchValue);
    
    return (
        <div className="relative max-w-md flex-grow">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className="h-5 w-5 text-gray-400 dark:text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex space-x-6">
          <input
            type="text"
            placeholder= {placeholder || "Search..."}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-700 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            value={searchVal}
            onChange={(e) => dispatch(setSearchValue(e.target.value))}
          />

          
        </div>
      </div>
    )
}