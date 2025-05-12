import GradeTable from "@/components/teachingLoad/recordGrade/recordActivity";

export default function ScoreTablePage() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
       
          <GradeTable />
       
      </div>
    </div>
  );
}
