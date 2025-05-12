"use client";

import { useState, useMemo, useEffect } from "react";
import { StudentSemRecord, StudentFinal } from "@/store/api/types/classRecord"; // Assuming this is the correct import path
import { useParams } from "next/navigation";
import { useGetFinalGradesQuery } from "@/store/api/apiSlice/get/gradesApiSlice"; // Make sure this API slice fetches the final grades correctly
import { useSelector } from "react-redux";
import { IRootState } from "@/store";

// Sorting Keys
type SortableKeys = keyof StudentFinal;

type FinalGradesProps = {
  finalGrades: any;
  isLoading: boolean;
  isError: boolean;
}

export default function SubjectFinalGradeCard({finalGrades, isLoading, isError}: FinalGradesProps) {
  // State for term filtering
  const [selectedTerm, setSelectedTerm] = useState<number>(1);

  const searchTerm = useSelector(
    (state: IRootState) => state.search.searchValue
  );

  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "asc" | "desc";
  }>({
    key: "semesterGrade",
    direction: "desc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40;

  // API call with dynamic termId
  const { id } = useParams();

  // const {
  //   data: finalGrades,
  //   isLoading,
  //   isError,
  //   refetch: refetchFinalGrades,
  // } = useGetFinalGradesQuery({ teachingLoadDetailId: Number(id) });

  // Filtering with term support
  const filteredStudents = useMemo(() => {
    if (!finalGrades) return [];

    let filtered = [...finalGrades];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.studentName.toLowerCase().includes(term) ||
          student.studentId.toString().includes(term)
      );
    }
    return filtered;
  }, [finalGrades, searchTerm]);

  // Sorting
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      const key = sortConfig.key;
      const direction = sortConfig.direction;
      const aValue = a[key];
      const bValue = b[key];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }, [filteredStudents, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedStudents.slice(start, start + itemsPerPage);
  }, [sortedStudents, currentPage]);

  const requestSort = (key: SortableKeys) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTerm]);

  const getSortIcon = (key: SortableKeys) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="ml-1 h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="ml-1 h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data.</div>;
  }

  return (
    <>
      <h1 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
        Semester Grade
      </h1>

      {/* Table - unchanged */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="flex cursor-pointer items-center px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                onClick={() => requestSort("studentId")}
              >
                <span>Student ID</span>
                {getSortIcon("studentId")}
              </th>
              <th
                scope="col"
                className="cursor-pointer px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                onClick={() => requestSort("studentName")}
              >
                <div className="flex items-center">
                  <span>Student Name</span>
                  {getSortIcon("studentName")}
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Midterm
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Midterm
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Semester Grade
              </th>
              <th
                scope="col"
                className="cursor-pointer px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                onClick={() => requestSort("message")}
              >
                <div className="flex items-center">
                  <span>Remarks</span>
                  {getSortIcon("message")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((student) => (
                <tr
                  key={student.studentId}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {student.studentId}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {student.studentName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {student.termGrades.Midterm}%
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {student.termGrades.Finals || 0}%
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                      {student.semesterGrade}%
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {student.message === "Passed" ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                        {student.message}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                        {student.message}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing{" "}
          <span className="font-medium">
            {filteredStudents.length > 0
              ? (currentPage - 1) * itemsPerPage + 1
              : 0}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {Math.min(currentPage * itemsPerPage, filteredStudents.length)}
          </span>{" "}
          of <span className="font-medium">{filteredStudents.length}</span>{" "}
          students
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-md border border-gray-300 bg-white p-2 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 dark:text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`flex h-8 w-8 items-center justify-center rounded-md ${
                  pageNum === currentPage
                    ? "bg-blue-600 text-white dark:bg-blue-500"
                    : "border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="rounded-md border border-gray-300 bg-white p-2 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 dark:text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
