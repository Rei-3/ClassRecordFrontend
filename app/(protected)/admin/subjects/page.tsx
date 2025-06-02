import SubjectsTable from "@/components/admin/subjectsTable";

export default function SubjectsPage () {
    return (
        <div className="space-y-4">
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                <h1 className="text-2xl font-bold">Subjects Page</h1>
                <p>This is the subjects page.</p>
            </div>
            <SubjectsTable />
        </div>
    );
}