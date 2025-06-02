import TeachersTable from "@/components/admin/teachersTable";

export default function TeachersTablePage() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h1 className="text-2xl font-bold">Verified Teachers Table</h1>
        <p>This is the verified teachers table.</p>
     
      </div>
      <TeachersTable/>
    </div>
  );
}