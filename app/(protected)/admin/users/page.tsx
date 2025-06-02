import UserTable from "@/components/admin/usersTable";

export default function UsersPage() {
    return (
        <div className="space-y-4">
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h1 className="text-2xl font-bold">Users Page</h1>
            <p>This is the users page.</p>
        </div>
        <UserTable />
        </div>
    );
    }