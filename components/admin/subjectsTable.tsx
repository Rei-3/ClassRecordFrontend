'use client';

import { useState } from 'react';
import { BookOpen, Hash, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useGetSubjectWithCourseQuery } from '@/store/api/apiSlice/get/subjectApiSlice';

export interface SubjectsWithCourse {
  id: number;
  subjectDesc: string;
  subjectName: string;
  units: number;
  courseId: number;
  courseName: string;
}

const SubjectsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<number | 'all'>('all');
  const itemsPerPage = 5;

  const { data: subjects = [] } = useGetSubjectWithCourseQuery();

  // Get unique course options for dropdown
  const courseOptions = Array.from(
    new Map(subjects.map(subject => [subject.courseId, subject.courseName]))
  ).map(([id, name]) => ({ id, name }));

  // Filter subjects based on search and course selection
  const filteredSubjects = subjects.filter(subject =>
    (selectedCourseId === 'all' || subject.courseId === selectedCourseId) &&
    (
      subject.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.subjectDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.units.toString().includes(searchTerm)
    )
  );

  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);
  const currentItems = filteredSubjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-800">
      {/* Header Controls */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Subject Catalog</h2>
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search subjects..."
                className="pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search subjects"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <BookOpen className="w-5 h-5" />
              </span>
            </div>

            {/* Course Filter Dropdown */}
            <select
              value={selectedCourseId}
              onChange={(e) =>
                setSelectedCourseId(e.target.value === 'all' ? 'all' : parseInt(e.target.value))
              }
              className="py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
            >
              <option value="all">All Courses</option>
              {courseOptions.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>

            {/* Add Subject Button */}
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              onClick={() => alert('Add Subject clicked')} // Replace with actual logic
            >
              <Plus className="w-4 h-4" />
              Add Subject
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                <div className="flex items-center">
                  <Hash className="w-4 h-4 mr-2" />
                  ID
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Subject Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Units
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Course
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentItems.length > 0 ? (
              currentItems.map((subject) => (
                <tr key={subject.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{subject.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800 dark:text-white">{subject.subjectName}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{subject.subjectDesc}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      subject.units >= 4
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                    }`}>
                      {subject.units} unit{subject.units !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{subject.courseName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <BookOpen className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium">No subjects found</p>
                    {searchTerm && (
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredSubjects.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredSubjects.length)}</span> of{' '}
            <span className="font-medium">{filteredSubjects.length}</span> subjects
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-md border ${
                currentPage === 1 
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600 cursor-not-allowed' 
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-500'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`p-2 rounded-md border ${
                currentPage === totalPages || totalPages === 0
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600 cursor-not-allowed' 
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-500'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectsTable;
