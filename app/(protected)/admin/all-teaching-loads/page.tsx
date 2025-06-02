import TeachingLoadsTable from "@/components/admin/teachingLoadTable";

export default function TeachingLoadsPage() {
    return (
        <div className="space-y-4">
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h1 className="text-2xl font-bold">Teaching Loads Page</h1>
            <p>This is the teaching loads page.</p>
        </div>
        <TeachingLoadsTable/>
        </div>
    );
    }