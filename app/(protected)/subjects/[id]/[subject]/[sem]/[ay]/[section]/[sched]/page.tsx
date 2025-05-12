import SubjectClassRecordTable from "@/components/teachingLoad/subjects/subjectGrades";
import SubjectFinalGradeCard from "@/components/teachingLoad/subjects/subjectsCardFinal";

export default function ClassRecordPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <SubjectClassRecordTable />
      </div>
    </div>
  );
}
