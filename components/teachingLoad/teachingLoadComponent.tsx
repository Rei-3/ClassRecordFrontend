import IconPlus from "@/components/icon/icon-plus";
import Link from "next/link";
import React from "react";

// Page Component
export default function TeachingLoadsPage() {
  return (
    <div className="p-4 py-0 pb-0 md:p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            List of Your Subjects
          </h1>
          <p className="text-muted-foreground">Manage your Subjects</p>
        </div>
        <Link 
        href="/teaching-loads/add-teaching-load"
        className="mt-4 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 md:mt-0"
        >
          <IconPlus className="mr-2 h-4 w-4" />
          Add Subjects In a Teaching Load
        </Link>
      </div>
    </div>
  );
}
