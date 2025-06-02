"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Calendar,
  Key,
  VenusAndMars,
  BookOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGetAllUsersQuery } from "@/store/api/apiSlice/get/adminApiSlice";

const UserTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");

  const { data: allUsers = [] } = useGetAllUsersQuery();
  
  // Filter out users with no username
  const users = allUsers.filter(user => user.username);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentItems = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Format date of birth
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "teacher":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "student":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    }
  };

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800">
      {/* Table Header with Search */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            User Management
          </h2>
          <div className="flex-row-2 flex space-x-6">
            <Link
              href="/admin/users/roles/teachers-table"
              className="flex h-10 px-4 items-center justify-center rounded-lg bg-blue-500 text-white shadow-lg hover:bg-red-600"
            >
              Teachers List
            </Link>
            <Link
              href="/admin/users/roles/students-table"
              className="flex h-10 px-4 items-center justify-center rounded-lg bg-blue-500 text-white shadow-lg hover:bg-red-600"
            >
              Students List
            </Link>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400">
              <User className="h-5 w-5" />
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
                  <User className="mr-2 h-4 w-4" />
                  Name
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                <div className="flex items-center">
                  <VenusAndMars className="mr-2 h-4 w-4" />
                  Gender
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Date of Birth
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                <div className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Role
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                <div className="flex items-center">
                  <Key className="mr-2 h-4 w-4" />
                  OTP
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                <div className="flex items-center">
                  <Key className="mr-2 h-4 w-4" />
                  Action
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentItems.length > 0 ? (
              currentItems.map((user, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="font-medium text-gray-800 dark:text-white">
                      {user.fname} {user.mname && `${user.mname.charAt(0)}. `}
                      {user.lname}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      @{user.username}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        user.gender
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                          : "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100"
                      }`}
                    >
                      {user.gender ? "Male" : "Female"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">
                    {formatDate(user.dob)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-mono text-gray-600 dark:text-gray-300">
                    {user.otp}
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
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-medium">
            {(currentPage - 1) * itemsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
          </span>{" "}
          of <span className="font-medium">{filteredUsers.length}</span> users
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`rounded-md border p-2 ${
              currentPage === 1
                ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-500"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0}
            className={`rounded-md border p-2 ${
              currentPage === totalPages || totalPages === 0
                ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-500"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;