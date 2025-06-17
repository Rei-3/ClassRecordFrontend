'use client';

import { useState } from 'react';
import { Calendar, User, Check, X, ChevronLeft, ChevronRight, Search, BookOpen, Loader2 } from 'lucide-react';
import { 
  useGetAllTeachingLoadQuery, 
  useGetAllTeachingLoadIdItsIdOnlyAndTlIdQuery,
  usePutStatusTeachingLoadMutation 
} from '@/store/api/apiSlice/get/adminApiSlice';
import Link from 'next/link';

interface TeachingLoad {
  id: number;
  semName: string;
  status: boolean;
  teacherName: string;
  addedOn: string;
  academicYear: string;
}

interface TeachingLoadDetail {
  id: number;
  teachingLoadId: number;
}

const TeachingLoadsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState<{id: number, currentStatus: boolean} | null>(null);
  const itemsPerPage = 5;
  
  const { data: teachingLoads = [], isLoading, isError } = useGetAllTeachingLoadQuery();
  const { data: teachingLoadDetails = [] } = useGetAllTeachingLoadIdItsIdOnlyAndTlIdQuery();
  const [updateStatus, { isLoading: isUpdating }] = usePutStatusTeachingLoadMutation();

  // Create a map of teachingLoadId to subject count
  const subjectCountMap = teachingLoadDetails.reduce((acc: { [x: string]: any; }, detail: { teachingLoadId: string | number; }) => {
    acc[detail.teachingLoadId] = (acc[detail.teachingLoadId] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Handle status change click
  const handleStatusChangeClick = (id: number, currentStatus: boolean) => {
    setSelectedLoad({id, currentStatus});
    setShowConfirmDialog(true);
  };

  // Handle confirmed status change
  const handleConfirmedStatusChange = async () => {
    if (!selectedLoad) return;
    
    try {
      await updateStatus({
        teachingLoadId: selectedLoad.id,
        status: selectedLoad.currentStatus ? "false" : "true"
      }).unwrap();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setShowConfirmDialog(false);
    }
  };

  // Filter teaching loads based on search term
  const filteredTeachingLoads = teachingLoads.filter((load: { teacherName: string; semName: string; academicYear: string; status: { toString: () => string; }; }) =>
    load.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    load.semName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    load.academicYear.toLowerCase().includes(searchTerm.toLowerCase()) ||
    load.status.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredTeachingLoads.length / itemsPerPage);
  const currentItems = filteredTeachingLoads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-12 w-12 text-blue-500" /></div>;
  if (isError) return <div className="rounded-xl bg-red-50 dark:bg-red-900/10 p-6 text-red-600 dark:text-red-400 text-center">Failed to load teaching loads</div>;

  return (
    <>
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Confirm Status Change
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to change the status of this teaching load to {selectedLoad?.currentStatus ? 'Inactive' : 'Active'}?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmedStatusChange}
                disabled={isUpdating}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 flex items-center"
              >
                {isUpdating && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-800">
        {/* Table Header with Search */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Teaching Loads</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search teaching loads..."
                className="pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Search teaching loads"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
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
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Teacher
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Semester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Academic Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Nunmber of Subjects
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Added On
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentItems.length > 0 ? (
                currentItems.map((load:any) => (
                  <tr key={load.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">

                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300 hover:underline hover:text-blue-600">
                      <Link
                      href={`/admin/all-teaching-loads/${load.id}`}
                      >
                      {load.id}
                      </Link>
                    </td>
                   
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800 dark:text-white">
                      {load.teacherName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      {load.semName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      {load.academicYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs font-medium">
                        {subjectCountMap[load.id] || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusChangeClick(load.id, load.status)}
                        disabled={isUpdating}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          load.status 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800'
                        }`}
                      >
                        {isUpdating && selectedLoad?.id === load.id ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : load.status ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      {formatDate(load.addedOn)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <Calendar className="w-12 h-12 mb-4 opacity-50" />
                      <p className="text-lg font-medium">No teaching loads found</p>
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
        {filteredTeachingLoads.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredTeachingLoads.length)}</span> of{' '}
              <span className="font-medium">{filteredTeachingLoads.length}</span> records
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
    </>
  );
};

export default TeachingLoadsTable;