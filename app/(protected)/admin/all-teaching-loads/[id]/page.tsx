import TeachingLoadDetailTable from "@/components/admin/teachingLoadDetailTable";


export default function TeachingLoadDetailPage() {
    return (
        <div className="space-y-4">
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h1 className="text-2xl font-bold">Teaching Details Loads Page</h1>
            <p>This is the teching loads details page.</p>
        </div>
        <TeachingLoadDetailTable/>
        </div>
    );
    }