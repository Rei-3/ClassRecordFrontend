'use client';

import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  PlusCircle,
  X,
} from 'lucide-react';
import { useGetCoursesQuery } from '@/store/api/apiSlice/get/semApiSlice';
import ConfirmationModal from '../modals/confirmationModal';

interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  department: string;
}

const CoursesTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 5;
  const { data: courses = [] } = useGetCoursesQuery();

  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [department, setDepartment] = useState('');

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<{
    courseCode: string;
    courseName: string;
    department: string;
  } | null>(null);

  const filteredCourses: Course[] = courses.filter((course: Course) =>
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const currentItems = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getDepartmentColor = (department: string | null | undefined) => {
    if (!department) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    switch (department.toLowerCase()) {
      case 'computer studies':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'engineering':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'architecture':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  const handleEdit = (course: Course) => {
    setCourseCode(course.courseCode);
    setCourseName(course.courseName);
    setDepartment(course.department);
    setSelectedCourse(course);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDelete = (course: Course) => {
    setSelectedCourse(course);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    if (selectedCourse) {
      console.log('Deleting course:', selectedCourse.id);
      // deleteCourse(selectedCourse.id); ← Replace with actual API
    }
    setShowConfirmation(false);
    setSelectedCourse(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPendingSubmitData({ courseCode, courseName, department });
    setShowSaveConfirmation(true);
  };

  const confirmSave = () => {
    if (!pendingSubmitData) return;

    const payload = {
      courseCode: pendingSubmitData.courseCode,
      courseName: pendingSubmitData.courseName,
      department: pendingSubmitData.department,
    };

    if (isEditMode && selectedCourse) {
      console.log('Editing course:', selectedCourse.id, payload);
      // updateCourse(selectedCourse.id, payload); ← Replace with API
    } else {
      console.log('Adding new course:', payload);
      // addCourse(payload); ← Replace with API
    }

    // Reset form
    setCourseCode('');
    setCourseName('');
    setDepartment('');
    setShowModal(false);
    setIsEditMode(false);
    setSelectedCourse(null);
    setPendingSubmitData(null);
    setShowSaveConfirmation(false);
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Courses Catalog</h2>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search courses..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </span>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Add Course
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Course Code</th>
              <th className="px-6 py-3">Course Name</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentItems.length > 0 ? (
              currentItems.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">{course.id}</td>
                  <td className="px-6 py-4 font-mono">{course.courseCode}</td>
                  <td className="px-6 py-4">{course.courseName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDepartmentColor(course.department)}`}>
                      {course.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="rounded-md bg-blue-100 px-2 py-1 text-blue-600 transition-colors duration-200 hover:bg-blue-200 hover:text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course)}
                      className="rounded-md bg-red-100 px-2 py-1 text-red-600 transition-colors duration-200 hover:bg-red-200 hover:text-red-700 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center px-6 py-12 text-gray-500 dark:text-gray-400">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredCourses.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredCourses.length)} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredCourses.length)} of {filteredCourses.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md border text-gray-500 hover:text-gray-700 dark:hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border text-gray-500 hover:text-gray-700 dark:hover:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-lg relative">
            <button
              onClick={() => {
                setShowModal(false);
                setIsEditMode(false);
                setSelectedCourse(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              {isEditMode ? 'Edit Course' : 'Add New Course'}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Course Code"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                required
                className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
              <input
                type="text"
                placeholder="Course Name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
                className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                <option value="">Select Department</option>
                <option value="CAS">College of Arts and Sciences</option>
               
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {isEditMode ? 'Update Course' : 'Save Course'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showConfirmation}
        title="Delete Course"
        message={`Are you sure you want to delete "${selectedCourse?.courseCode}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmation(false)}
      />
      <ConfirmationModal
        isOpen={showSaveConfirmation}
        title={isEditMode ? 'Confirm Update' : 'Confirm Save'}
        message={`Are you sure you want to ${isEditMode ? 'update' : 'add'} the course "${pendingSubmitData?.courseCode}"?`}
        onConfirm={confirmSave}
        onCancel={() => {
          setShowSaveConfirmation(false);
          setPendingSubmitData(null);
        }}
      />
    </div>
  );
};

export default CoursesTable;
