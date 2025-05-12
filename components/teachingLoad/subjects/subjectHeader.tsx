import DefaultModal from "@/components/modals/defaultModal";
import { useGetGradingCompositionQuery } from "@/store/api/apiSlice/get/gradesApiSlice";
import { useParams } from "next/navigation";
import AddGradingComposition from "@/components/teachingLoad/gradingCategory/addGradingCompostion";
import { unSlug, unslugSchedule } from "@/lib/utils/utils";
import EditGradingComposition from "../gradingCategory/editGradingComposition";

export default function SubjectClassRecordHeader() {
  const { id } = useParams();

  const params = useParams();

  const { subject, sem, ay, section } = params;
  const subjectName = typeof subject === "string" ? unSlug(subject) : "";
  const semesterName = typeof sem === "string"? unSlug(sem): "";

  const sched = typeof params.sched === "string" ? unslugSchedule(params.sched) : "N/A"; 

  
  const { data: gradingComposition, refetch } = useGetGradingCompositionQuery(
    {teachingLoadDetailId: Number(id)},
    {refetchOnMountOrArgChange: true}
  );

  const getCategoryStyle = (name: string) => {
    switch (name.toLowerCase()) {
      case "attendance":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200";
      case "quiz":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "exam":
        return "bg-amber-100 text-yellow-700 dark:bg-amber-900 dark:text-amber-200";
      default:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    }
  };

  return (
    <div className="mb-4">
      <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
        Class Record: {subjectName} | {semesterName} |{" "}
        {ay}
      </h2>

      <div className="space-y-6">
        {/* Section and Schedule Info */}
        <div className="space-y-2">
          <h3 className="flex text-lg font-semibold text-gray-700 dark:text-gray-300">
            Section:
            <span className="ml-3 rounded-md bg-primary px-2 py-0.5 text-sm text-white">
              {section}
            </span>
          </h3>
          <h3 className="flex text-lg font-semibold text-gray-700 dark:text-gray-300">
            Schedule:
            <span className="ml-3 rounded-md bg-primary px-2 py-0.5 text-sm text-white">
              {sched}
            </span>
          </h3>
        </div>

        {/* Grading Composition - Placed below Schedule */}
        <div>
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
            Grading Composition
          </h4>
          <div className="flex flex-wrap gap-4">
            {gradingComposition?.composition?.length ? (
              <div className="m-0 p-0">
                <div className="flex flex-wrap gap-4">
                  {gradingComposition.composition
                    .slice()
                    .sort((a, b) => {
                      const order = ["quiz", "activity", "exa", "attendance"];
                      return (
                        order.indexOf(a.category.categoryName) -
                        order.indexOf(b.category.categoryName)
                      );
                    })
                    .map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium ${getCategoryStyle(item.category.categoryName)}`}
                      >
                        <span className="text-base font-medium">
                          {item.category.categoryName}:
                        </span>
                        <span className="font-bold">{item.percentage}%</span>
                      </div>
                    ))}
                </div>
                <div className="mt-4">
                <DefaultModal title="Edit Grading Composition">
                 <EditGradingComposition
                  gradingComposition={gradingComposition}
                  onSuccess={refetch}
                 />
                </DefaultModal>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-base italic text-gray-600 dark:text-gray-400">
                  No grading composition yet.
                </p>

                <DefaultModal title="Add Grading Composition">
                   <AddGradingComposition />
                </DefaultModal>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




//////////////////Teaching Load Detail Title
  // const teachingLoad = teachingLoadData?.find((load) =>
  //   load.teachingLoadId.some((subject) => subject.id === Number(id))
  // );

  // if (!teachingLoad) {
  //   return <div className="p-4">Teaching Load not found</div>;
  // }

  // const semDetail = semData?.find(
  //   (sem) => sem.id === teachingLoad.semId
  // )?.semName;

  // const subjectDetail = teachingLoad.teachingLoadId.find(
  //   (subject) => subject.id === Number(id)
  // );

  // if (!subjectDetail) {
  //   return <div className="p-4">Subject Detail not found</div>;
  // }

  // if (loadingGrades) {
  //   return <div className="p-4">Loading grades...</div>;
  // }
  //////////////////////////////////////////