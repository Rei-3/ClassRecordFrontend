"use client";

import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Key,
  Hash,
  CircleUser,
  UserRoundPen,
  Users,
} from "lucide-react";
import { useGetAllUsersQuery } from "@/store/api/apiSlice/get/adminApiSlice";
import ConfirmationModal from "../modals/confirmationModal";

// Mock user data
// const mockUsers = [
//   { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
//   { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
//   { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer' },
//   { id: 4, name: 'David Lee', email: 'david@example.com', role: 'Editor' },
//   { id: 5, name: 'Eva Green', email: 'eva@example.com', role: 'Viewer' },
//   { id: 6, name: 'Frank Martin', email: 'frank@example.com', role: 'Admin' },
//   { id: 7, name: 'Grace Kim', email: 'grace@example.com', role: 'Viewer' },
//   { id: 8, name: 'Henry Wilson', email: 'henry@example.com', role: 'Editor' },
//   { id: 9, name: 'Ivy Chen', email: 'ivy@example.com', role: 'Viewer' },
//   { id: 10, name: 'Jack Brown', email: 'jack@example.com', role: 'Admin' },
// ];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const { data: allUser } = useGetAllUsersQuery();
  const [isModalOpen, setModalOpen] = useState(false);

  function handleDeleteClick() {
    setModalOpen(true);
  }

  // Confirm delete
  function handleConfirm() {
    // onDelete(user.id); // Call parent delete logic
    setModalOpen(false);
  }

  // Cancel delete
  function handleCancel() {
    setModalOpen(false);
  }

  const users = allUser || [];

  // Calculate statistics
  const totalUsers = users.length;
  // const adminCount = users.filter((user) => user.role === "admin").length;
  const teacherCount = users.filter((user) => user.role === "teacher").length;
  const studentCount = users.filter((user) => user.role === "student").length;

  const roleDistribution = useMemo(() => {
    const roleCount: Record<string, number> = {};
    users.forEach((user) => {
      roleCount[user.role] = (roleCount[user.role] || 0) + 1;
    });
    return Object.entries(roleCount).map(([role, count]) => ({
      name: role,
      value: count,
    }));
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const getRoleColor = (role: string) => {
    switch (role) {
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
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            User Management Dashboard
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {totalUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <UserRoundPen className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Students
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {studentCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                <User className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Teachers
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {teacherCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
          <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
            User Role Distribution
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {roleDistribution.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Table Section */}
        <div className="overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800">
          <div className="border-b border-gray-200 p-6 dark:border-gray-700">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                User Directory
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="bg-background text-foreground w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 dark:border-gray-600 md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    <div className="flex items-center">
                      <Hash className="mr-2 h-4 w-4" />
                      ID
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Name
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    <div className="flex items-center">
                      <CircleUser className="mr-2 h-4 w-4" />
                      Username
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
                      <Key className="mr-2 h-4 w-4" />
                      Role
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
                  currentItems.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="rounded-md bg-gray-100 px-2 py-1 text-gray-800 dark:bg-gray-600 dark:text-gray-100">
                          {user.id}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-800 dark:text-white">
                        {user.fname} {user.mname} {user.lname}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {user.username ? (
                          <span className="text-gray-600 dark:text-gray-300">
                            {user.username}
                          </span>
                        ) : (
                          <span className="rounded-md bg-red-100 px-2 py-1 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                            UNVERIFIED
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <button className="rounded-md bg-red-100 px-2 py-1 text-red-600 transition-colors duration-200 hover:bg-red-200 hover:text-red-700 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900 dark:hover:text-red-300"
                        onClick={handleDeleteClick}
                        >
                          Delete
                        </button>
                        <ConfirmationModal
                          isOpen={isModalOpen}
                          title="Confirm Delete"
                          message={`Are you sure you want to delete user  This action cannot be undone.`}
                          // "${user.name}"?
                          danger={true}
                          onConfirm={handleConfirm}
                          onCancel={handleCancel}
                          confirmText="Delete"
                          cancelText="Cancel"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
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
              of <span className="font-medium">{filteredUsers.length}</span>{" "}
              results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`rounded-md border p-2 ${
                  currentPage === 1
                    ? "border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-500"
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
                    ? "border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-500"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
