'use client';
import { useState, useEffect, useMemo } from 'react';
import { useGetTeachingLoadQuery } from '@/store/api/apiSlice/get/teachingLoadApiSlice';
import { Subject } from '@/store/api/types/teachingLoadTypes';
import Link from 'next/link';
import { useGetSemQuery } from '@/store/api/apiSlice/get/semApiSlice';
import { slugifySchedule, toSlug } from '@/lib/utils/utils';

// Enhanced type to include all necessary properties for display
type DisplaySubject = Subject & {
  teachingLoadId: number;
  teachingLoadDetailId: number; // The ID from the teaching load detail
  semId: number;
  academicYear: string;
  status: boolean;
  section: string;
  schedule: string;
  teachingLoadIdDisplay: number;
};

// Define the keys used for sorting
type SortableKeys = keyof Subject | 'teachingLoadId' | 'academicYear' | 'semId' | 'status' | 'teachingLoadIdDisplay' | 'section' | 'schedule';

export default function SubjectTable() {
  const { data: teachingLoads = [], isLoading, isError, refetch } = useGetTeachingLoadQuery();
  const { data: semData, isLoading: isSemLoading } = useGetSemQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: 'asc' | 'desc';
  }>({ key: 'teachingLoadIdDisplay', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSemId, setSelectedSemId] = useState<number | 'all'>('all');
  const [selectedTeachingLoadId, setSelectedTeachingLoadId] = useState<number | 'all'>('all');
  const itemsPerPage = 10;

  // Static Mapping for Filter Dropdown
  const staticTeachingLoadMapping = useMemo(() => {
    const sortedLoadIds = [...new Set(teachingLoads.map(load => load.id))].sort((a, b) => a - b);
    return Object.fromEntries(sortedLoadIds.map((id, index) => [id, index + 1]));
  }, [teachingLoads]);

  // Flatten subjects with teaching load info - accommodating the actual data structure
  const allSubjects: Omit<DisplaySubject, 'teachingLoadIdDisplay'>[] = useMemo(() => {
    return teachingLoads.flatMap(load => {
      // Check if teachingLoadId is an array (based on your data example)
      if (Array.isArray(load.teachingLoadId)) {
        return load.teachingLoadId.flatMap(detail => {
          // If subjects is directly available in the detail
          if (detail.subjects) {
            // Handle when subjects is a single object or an array
            const subjectsArray = Array.isArray(detail.subjects) ? detail.subjects : [detail.subjects];
            
            return subjectsArray.map(subject => ({
              ...subject,
              teachingLoadId: load.id,
              teachingLoadDetailId: detail.id,
              semId: load.semId,
              academicYear: load.academicYear,
              status: load.status,
              section: detail.section,
              schedule: detail.schedule,
            }));
          }
          return [];
        });
      }
      return [];
    });
  }, [teachingLoads]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Reset page to 1 when filters or search term change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSemId, selectedTeachingLoadId, searchTerm]);

  // Get unique semesters and teaching load IDs for filters
  const uniqueSemesters = useMemo(() => {
    const semesters = new Set<number>();
    teachingLoads.forEach(load => semesters.add(load.semId));
    return Array.from(semesters).sort((a, b) => {
      const semA = semData?.find(sem => sem.id === a);
      const semB = semData?.find(sem => sem.id === b);
      const nameA = semA?.semName ?? `ID ${a}`;
      const nameB = semB?.semName ?? `ID ${b}`;
      return nameA.localeCompare(nameB);
    });
  }, [teachingLoads, semData]);

  const uniqueTeachingLoadIdsForFilter = useMemo(() => {
    return Object.entries(staticTeachingLoadMapping)
      .map(([id, count]) => ({ id: Number(id), count }))
      .sort((a, b) => a.count - b.count);
  }, [staticTeachingLoadMapping]);

  // Apply filters and create the base filtered list
  const filteredSubjects = useMemo(() => {
    let filtered = [...allSubjects];

    // Apply semester filter
    if (selectedSemId !== 'all') {
      filtered = filtered.filter(subject => subject.semId === selectedSemId);
    }

    // Apply teaching load filter
    if (selectedTeachingLoadId !== 'all') {
      filtered = filtered.filter(subject => subject.teachingLoadId === selectedTeachingLoadId);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(subject =>
        subject.subjectDesc.toLowerCase().includes(term) ||
        subject.subjectName.toLowerCase().includes(term) ||
        subject.section.toLowerCase().includes(term) ||
        subject.schedule.toLowerCase().includes(term)
      );
    }
    return filtered;
  }, [allSubjects, searchTerm, selectedSemId, selectedTeachingLoadId]);

  // Dynamic Mapping for Table Display
  const dynamicTeachingLoadMapping = useMemo(() => {
    const uniqueFilteredLoadIds = [
      ...new Set(filteredSubjects.map(subject => subject.teachingLoadId))
    ];
    uniqueFilteredLoadIds.sort((a, b) => a - b);

    const mapping = new Map<number, number>();
    uniqueFilteredLoadIds.forEach((id, index) => {
      mapping.set(id, index + 1);
    });
    return mapping;
  }, [filteredSubjects]);

  // Apply sorting to the filtered list and add the dynamic display number
  const displayedSubjects: DisplaySubject[] = useMemo(() => {
    const subjectsWithDisplayNumber = filteredSubjects.map(subject => ({
      ...subject,
      teachingLoadIdDisplay: dynamicTeachingLoadMapping.get(subject.teachingLoadId) ?? 0
    }));

    return subjectsWithDisplayNumber.sort((a, b) => {
      const key = sortConfig.key;
      const direction = sortConfig.direction;

      if (key === 'teachingLoadIdDisplay') {
        return direction === 'desc'
          ? b.teachingLoadIdDisplay - a.teachingLoadIdDisplay
          : a.teachingLoadIdDisplay - b.teachingLoadIdDisplay;
      }

      if (key === 'teachingLoadId') {
        return direction === 'desc'
          ? b.teachingLoadId - a.teachingLoadId
          : a.teachingLoadId - b.teachingLoadId;
      }

      const aValue = a[key as keyof DisplaySubject];
      const bValue = b[key as keyof DisplaySubject];

      if (aValue === bValue) return 0;
      if (aValue == null) return direction === 'asc' ? -1 : 1;
      if (bValue == null) return direction === 'asc' ? 1 : -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }

      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return direction === 'asc'
          ? (aValue === bValue ? 0 : aValue ? 1 : -1)
          : (aValue === bValue ? 0 : aValue ? -1 : 1)
      }

      return 0;
    });
  }, [filteredSubjects, sortConfig, dynamicTeachingLoadMapping]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = displayedSubjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(displayedSubjects.length / itemsPerPage);

  const requestSort = (key: SortableKeys) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === 'asc'
        ? 'desc'
        : 'asc';
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  // Display Loading / Error States
  if (isLoading || isSemLoading) return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-gray-600 dark:text-gray-400">Loading data...</span>
    </div>
  );
  if (isError) return <div className="p-4 text-center text-red-600 dark:text-red-400 font-semibold">Error loading teaching load data. Please try refreshing.</div>;

  return (
    <div className="p-4 pt-0 max-w-full mx-auto">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
        <div>
          <label htmlFor="semester-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Semester</label>
          <select
            id="semester-filter"
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedSemId}
            onChange={(e) => setSelectedSemId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          >
            <option value="all">All Semesters</option>
            {uniqueSemesters.map(semId => {
              const semester = semData?.find(sem => sem.id === semId);
              return (
                <option key={semId} value={semId}>
                  {semester ? semester.semName : `Semester ID ${semId}`}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label htmlFor="load-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teaching Load</label>
          <select
            id="load-filter"
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedTeachingLoadId}
            onChange={(e) => setSelectedTeachingLoadId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          >
            <option value="all">All Teaching Loads</option>
            {uniqueTeachingLoadIdsForFilter.map(({ id, count }) => (
              <option key={id} value={id}>Load #{count}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="search-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
          <input
            id="search-filter"
            type="text"
            placeholder="Search code, name, section..."
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150" onClick={() => requestSort('subjectDesc')}>
                <div className="flex items-center">Code {sortConfig.key === 'subjectDesc' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150" onClick={() => requestSort('subjectName')}>
                <div className="flex items-center">Name {sortConfig.key === 'subjectName' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150" onClick={() => requestSort('section')}>
                <div className="flex items-center">Section {sortConfig.key === 'section' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150" onClick={() => requestSort('schedule')}>
                <div className="flex items-center">Schedule {sortConfig.key === 'schedule' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Semester</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150" onClick={() => requestSort('academicYear')}>
                <div className="flex items-center">Acad. Yr {sortConfig.key === 'academicYear' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150" onClick={() => requestSort('teachingLoadIdDisplay')}>
                <div className="flex items-center">Teaching Load {sortConfig.key === 'teachingLoadIdDisplay' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150" onClick={() => requestSort('status')}>
                <div className="flex items-center">Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
            {currentItems.length > 0 ? (
              currentItems.map((subject) => (
                <tr key={`${subject.id}-${subject.teachingLoadDetailId}-${subject.teachingLoadId}`} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">

                  {/* Subject Code */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    <Link
                     href={`/subjects/${subject.teachingLoadDetailId}/${
                      toSlug(subject.subjectName || '')
                    }/${
                      toSlug(semData?.find(sem => sem.id === subject.semId)?.semName || '')
                    }/${
                      toSlug(subject.academicYear || '')
                    }/${
                      toSlug(subject.section || '')
                    }/${
                      slugifySchedule(subject.schedule || '')
                    }`}
                    title={subject.subjectName}
                  >
                      {subject.subjectDesc}
                    </Link>
                  </td>

                  {/* Subject Name */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{subject.subjectName}</td>

                  {/* Section */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{subject.section}</td>

                  {/* Schedule */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{subject.schedule}</td>

                  {/* Semester */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {semData?.find(sem => sem.id === subject.semId)?.semName || 'Unknown'}
                  </td>

                  {/* Academic Year */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{subject.academicYear}</td>

                  {/* Teaching Load (Dynamic Count) */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    <Link href={`/teaching-loads/${subject.teachingLoadId}/${toSlug(` ${semData?.find(sem => sem.id === subject.semId)?.semName} ${subject.academicYear}`)}`} title={`View Teaching Load ID ${subject.teachingLoadId}`}>
                      #{dynamicTeachingLoadMapping.get(subject.teachingLoadId) ?? 'N/A'}
                    </Link>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      subject.status
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-300 dark:border-green-700'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-300 dark:border-red-700'
                    }`}>
                      {subject.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                  {searchTerm || selectedSemId !== 'all' || selectedTeachingLoadId !== 'all'
                    ? 'No subjects found matching your criteria.'
                    : 'No subjects available.'
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {displayedSubjects.length > itemsPerPage && (
        <div className="flex items-center justify-between mt-4 px-2 text-gray-700 dark:text-gray-300">
          <div className="text-sm">
            Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(indexOfLastItem, displayedSubjects.length)}
            </span>{' '}
            of <span className="font-medium">{displayedSubjects.length}</span> subjects
          </div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-3 py-1 rounded-l-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150`}
            >
              Previous
            </button>
            <span className="relative inline-flex items-center px-4 py-1 border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-3 py-1 rounded-r-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}