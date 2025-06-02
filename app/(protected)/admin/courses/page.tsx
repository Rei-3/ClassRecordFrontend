import CoursesTable from "@/components/admin/coursesTable";

export default function CoursesPage() {
    return (
        <div className="space-y-4">
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                <h1 className="text-2xl font-bold">Courses Page</h1>
                <p>This is the courses page.</p>
            </div>
            <CoursesTable />
        </div>
    );
}