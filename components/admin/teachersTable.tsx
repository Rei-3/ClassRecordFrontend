'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, User, Mail, Calendar, Key, VenusAndMars, Award, Hash, Loader2 } from 'lucide-react';
import { useGetAllTeachersQuery } from '@/store/api/apiSlice/get/adminApiSlice';

interface Teacher {
  id: number;
  fname: string;
  mname: string | null;
  lname: string;
  gender: boolean;
  username: string | null; // Made nullable
  email: string;
  dob: string;
  otp: string;
  role: string;
  teacherId: string | null;
}

const TeachersTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 5;
  
  const { data: teachers = [], isLoading, isError } = useGetAllTeachersQuery();

  const filteredTeachers = useMemo(() => {
    return teachers
      // Filter out null teachers and those with null username
      .filter((teacher: { username: any; } | any) => teacher !== null && teacher.username !== null)
      .filter((teacher: { fname: string; lname: string; email: string; teacherId: string; }) => {
        const term = searchTerm.toLowerCase();
        return (
          teacher.fname?.toLowerCase().includes(term) ||
          teacher.lname?.toLowerCase().includes(term) ||
          teacher.email?.toLowerCase().includes(term) ||
          (teacher.teacherId && teacher.teacherId.toLowerCase().includes(term))
        );
      });
  }, [teachers, searchTerm]);

  const getTeacherColor = (teacherId: string | null) => {
    if (!teacherId) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    
    try {
      const lastChar = teacherId.slice(-1);
      const lastDigit = parseInt(lastChar) || 0;
      
      if (lastDigit % 3 === 0) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      if (lastDigit % 3 === 1) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
    } catch {
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const currentItems = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-12 w-12 text-blue-500" /></div>;
  if (isError) return <div className="rounded-xl bg-red-50 dark:bg-red-900/10 p-6 text-red-600 dark:text-red-400 text-center">Failed to load teacher data</div>;

  return (
    <div className="rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-800">
      {/* Table Header with Search */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Faculty Directory</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search teachers..."
              className="pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Search teachers"
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
                  Teacher Name
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
                  <Award className="w-4 h-4 mr-2" />
                  Teacher ID
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                <div className="flex items-center">
                  <Key className="w-4 h-4 mr-2" />
                  OTP
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
              currentItems.map((teacher:Teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {teacher.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-800 dark:text-white">
                      {teacher.fname} {teacher.mname && `${teacher.mname.charAt(0)}. `}{teacher.lname}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">@{teacher.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      teacher.gender 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' 
                        : 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100'
                    }`}>
                      {teacher.gender ? 'Male' : 'Female'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {teacher.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {new Date(teacher.dob).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTeacherColor(teacher.teacherId)}`}>
                      {teacher.teacherId || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300 font-mono">
                    {teacher.otp}
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
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <User className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium">No teachers found</p>
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
      {filteredTeachers.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredTeachers.length)}</span> of{' '}
            <span className="font-medium">{filteredTeachers.length}</span> teachers
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

export default TeachersTable;