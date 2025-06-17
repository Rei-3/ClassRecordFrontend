'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, User, Mail, Calendar, Key, VenusAndMars, Book, Hash, UserRound, UserCircle, UserCircle2 } from 'lucide-react';
import { useGetAllStudentsQuery } from '@/store/api/apiSlice/get/adminApiSlice';

const StudentsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState('');
  const {data: students = []} = useGetAllStudentsQuery();

  // Sample student data including your provided example
  // const students = [
  //   {
  //     id: 2,
  //     fname: "Jemes",
  //     mname: "",
  //     lname: "Born",
  //     gender: true,
  //     username: "202120752",
  //     email: "qqqqqqq@gmail.com",
  //     dob: "2002-02-02",
  //     otp: "M2MKGT",
  //     role: "student",
  //     studentId: "202120752",
  //     courseName: "BSCS"
  //   },
  //   {
  //     id: 3,
  //     fname: "Sarah",
  //     mname: "Marie",
  //     lname: "Johnson",
  //     gender: false,
  //     username: "202120753",
  //     email: "sarah.j@example.com",
  //     dob: "2001-05-15",
  //     otp: "X3Y4Z5",
  //     role: "student",
  //     studentId: "202120753",
  //     courseName: "BSIT"
  //   },
  //   {
  //     id: 4,
  //     fname: "Michael",
  //     mname: "James",
  //     lname: "Williams",
  //     gender: true,
  //     username: "202120754",
  //     email: "michael.w@example.com",
  //     dob: "2000-11-30",
  //     otp: "A1B2C3",
  //     role: "student",
  //     studentId: "202120754",
  //     courseName: "BSIS"
  //   },
  //   {
  //     id: 5,
  //     fname: "Emily",
  //     mname: "Rose",
  //     lname: "Brown",
  //     gender: false,
  //     username: "202120755",
  //     email: "emily.b@example.com",
  //     dob: "2002-07-22",
  //     otp: "D4E5F6",
  //     role: "student",
  //     studentId: "202120755",
  //     courseName: "BSCS"
  //   },
  //   {
  //     id: 6,
  //     fname: "David",
  //     mname: "Thomas",
  //     lname: "Miller",
  //     gender: true,
  //     username: "202120756",
  //     email: "david.m@example.com",
  //     dob: "2001-03-10",
  //     otp: "G7H8I9",
  //     role: "student",
  //     studentId: "202120756",
  //     courseName: "BSIT"
  //   },
  //   {
  //     id: 7,
  //     fname: "Jessica",
  //     mname: "Anne",
  //     lname: "Davis",
  //     gender: false,
  //     username: "202120757",
  //     email: "jessica.d@example.com",
  //     dob: "2000-09-18",
  //     otp: "J1K2L3",
  //     role: "student",
  //     studentId: "202120757",
  //     courseName: "BSIS"
  //   }
  // ];

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    return students
      .filter((student: any) => student !== null)  // Remove null entries first
      .filter((student: { fname: string; lname: string; email: string; studentId: string; courseName: string; }) => {
        const term = searchTerm.toLowerCase();
        return (
          student.fname?.toLowerCase().includes(term) ||
          student.lname?.toLowerCase().includes(term) ||
          student.email?.toLowerCase().includes(term) ||
          student.studentId?.toLowerCase().includes(term) ||
          student.courseName?.toLowerCase().includes(term)
        );
      });
  }, [students, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const currentItems = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Format date of birth
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get course color
  const getCourseColor = (course: string) => {
    switch(course.toUpperCase()) {
      case 'BSCS': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'BSIT': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'BSVC': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-800">
      {/* Table Header with Search */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Student Records</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <User className="w-5 h-5" />
            </span>
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
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Student Name
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                <div className="flex items-center">
                  <VenusAndMars className="w-4 h-4 mr-2" />
                  Gender
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                <div className="flex items-center">
                  <UserCircle2 className="w-4 h-4 mr-2" />
                  Username
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Date of Birth
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                <div className="flex items-center">
                  <Book className="w-4 h-4 mr-2" />
                  Course
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                <div className="flex items-center">
                  <Key className="w-4 h-4 mr-2" />
                  Student ID
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                <div className="flex items-center">
                  <Key className="w-4 h-4 mr-2" />
                  Action
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentItems.length > 0 ? (
              currentItems.map((student:any) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {student.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-800 dark:text-white">
                      {student.fname} {student.mname && `${student.mname.charAt(0)}. `}{student.lname}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">@{student.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.gender ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' : 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100'
                    }`}>
                      {student.gender ? 'Male' : 'Female'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {student.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {formatDate(student.dob)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCourseColor(student.courseName)}`}>
                      {student.courseName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300 font-mono">
                    {student.studentId}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-mono text-gray-600 dark:text-gray-300">
                  <button className="rounded-md bg-blue-100 px-2 py-1 text-blue-600 transition-colors duration-200 hover:bg-blue-200 hover:blue-red-700 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                        >
                          Edit
                        </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
          <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredStudents.length)}</span> of{' '}
          <span className="font-medium">{filteredStudents.length}</span> students
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
    </div>
  );
};

export default StudentsTable;