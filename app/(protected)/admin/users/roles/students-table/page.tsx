import StudentsTable from "@/components/admin/studentsTable";

export default function StudentsTablePage() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h1 className="text-2xl font-bold">Verified Students Table</h1>
        <p>This is the table for verified Students.</p>
        <StudentsTable/>
      </div>
    </div>
  );
}
