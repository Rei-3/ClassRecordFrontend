"use client";

import { useState, useMemo, useEffect } from "react";
import { StudentSemRecord } from "@/store/api/types/classRecord";
import { useParams } from "next/navigation";
import { useGetTermQuery } from "@/store/api/apiSlice/get/semApiSlice";
import {
  useGetFinalGradesQuery,
  useGetSemGradesQuery,
} from "@/store/api/apiSlice/get/gradesApiSlice";
import SubjectClassRecordHeader from "./subjectHeader";
import SearchBar from "@/components/ui/seachBar";
import { useSelector } from "react-redux";
import { AppDispatch, IRootState } from "@/store";
import { useDispatch } from "react-redux";
import { setSearchValue } from "@/store/api/slices/searchSice";
import AddAcitivityModal from "@/components/modals/addActivityModal";
import AddActivity from "../recordGrade/addActivity";
import SubjectFinalGradeCard from "./subjectsCardFinal";
import Link from "next/link";
import { useGetGradeCategoryQuery } from "@/store/api/apiSlice/get/gradesApiSlice";

// Sorting Keys
type SortableKeys = keyof StudentSemRecord;

export default function SubjectClassRecordTable() {
  // State for term filtering
  const [selectedTerm, setSelectedTerm] = useState<number>(1);

  //Redux search
  const searchTerm = useSelector(
    (state: IRootState) => state.search.searchValue
  );
  const dispatch = useDispatch<AppDispatch>();

  //   const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "asc" | "desc";
  }>({
    key: "finalGrade",
    direction: "desc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40;

  // API call with dynamic termId
  const { id } = useParams();

  const { data: semGrades, refetch: refetchSemGrades } = useGetSemGradesQuery({
    teachingLoadDetailId: Number(id),
    termId: selectedTerm,
  });
  const { data: categoryData } = useGetGradeCategoryQuery();

  const {
    data: finalGrades,
    isLoading,
    isError,
    refetch: refetchFinalGrades,
  } = useGetFinalGradesQuery({ teachingLoadDetailId: Number(id) });

  const { data: termData } = useGetTermQuery();



  // Filtering with term support
  const filteredStudents = useMemo(() => {
    if (!semGrades) return [];

    let filtered = [...semGrades];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(term) ||
          student.studentId.toString().includes(term)
      );
    }
    return filtered;
  }, [semGrades, searchTerm, selectedTerm]);

  // Sorting (unchanged)
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

  // Pagination (unchanged)
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

  const cats = categoryData?.map((cat) => ({
    id: cat.id,
    name: cat.categoryName,
  }));

  const currentTerm = termData?.find((term) => term.id === selectedTerm);
  const termType = currentTerm?.termType;

  const colorClasses = [
    'text-cyan-800 dark:text-cyan-300',
    'text-blue-800 dark:text-blue-400',
    'text-purple-800 dark:text-purple-500',
    'text-amber-800 dark:text-amber-600',
  ];

  return (
    <>
      {/* Rest of your UI remains exactly the same */}
      <SubjectClassRecordHeader />
      <p className="mb-2 text-gray-500 dark:text-gray-400">
        Manage and view your class records efficiently
      </p>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input - unchanged */}

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
            <SearchBar
              value={searchTerm}
              onChange={(term) => dispatch(setSearchValue(term))}
              placeholder="Search by Student Name or ID"
            />

            <span className="float-right flex items-center space-x-2">
              {termData?.map((term) => (
                <button
                  key={term.id}
                  onClick={() => setSelectedTerm(term.id)}
                  className={`rounded-md px-3 py-1 text-sm  ${
                    selectedTerm === term.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {term.termType}
                </button>
              ))}
            </span>
          </div>
        </div>

        <div>
          <AddAcitivityModal>
            <AddActivity
              onSuccess={() => {
                refetchSemGrades();
                refetchFinalGrades();
              }}
              termId={selectedTerm}
            />
          </AddAcitivityModal>
        </div>
      </div>

      {/* Table - unchanged */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-f ull divide-y divide-gray-200 dark:divide-gray-700">
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
                onClick={() => requestSort("name")}
              >
                <div className="flex items-center">
                  <span>Student Name</span>
                  {getSortIcon("name")}
                </div>
              </th>

              {cats?.map((cat) => (
                <th
                  key={cat.id}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                >
                  <Link
                    href={`/subjects/score-table/${Number(id)}/${selectedTerm}/${cat.id}/${cat.name}/${termType}?search=${encodeURIComponent(searchTerm)}`}
                    className={`${colorClasses[cat.id % colorClasses.length]} hover:underline`}

                  >
                    {cat.name}
                  </Link>
                </th>
              ))}

              <th
                scope="col"
                className="cursor-pointer px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                onClick={() => requestSort("finalGrade")}
              >
                <div className="flex items-center">
                  <span>Final Grade</span>
                  {getSortIcon("finalGrade")}
                </div>
              </th>
              <th
                scope="col"
                className="cursor-pointer px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                onClick={() => requestSort("remarks")}
              >
                <div className="flex items-center">
                  <span>Remarks</span>
                  {getSortIcon("remarks")}
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
                    {student.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {student.scores.Quiz || 0}%
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {student.scores.Activity || 0}%
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                      {student.scores.Exam || 0}%
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    <span className="inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-sm font-medium text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                      {student.scores.Attendance || 0}%
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {student.finalGrade || 0}%
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-center text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                        student.remarks === "Passed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {student.remarks}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No students found. Try adjusting your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - unchanged */}
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
      <SubjectFinalGradeCard
        finalGrades={finalGrades}
        isLoading={isLoading}
        isError={isError}
      />
    </>
  );
}
