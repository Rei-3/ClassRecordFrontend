import DefaultModal from "@/components/modals/defaultModal";
import {
  useGetBaseGradeQuery,
  useGetGradingCompositionQuery,
} from "@/store/api/apiSlice/get/gradesApiSlice";
import { useParams } from "next/navigation";
import AddGradingComposition from "@/components/teachingLoad/gradingCategory/addGradingCompostion";
import { unSlug, unslugSchedule } from "@/lib/utils/utils";
import EditGradingComposition from "../gradingCategory/editGradingComposition";
import AddBaseGrade from "../gradingCategory/addBaseGrade";
import ModalPlain from "@/components/modals/modalPlain";
import EditBaseGrade from "../gradingCategory/editBaseGrade";

export default function SubjectClassRecordHeader() {
  const { id } = useParams();
  const params = useParams();
  const { subject, sem, ay, section } = params;

  const subjectName = typeof subject === "string" ? unSlug(subject) : "";
  const semesterName = typeof sem === "string" ? unSlug(sem) : "";
  const sched =
    typeof params.sched === "string" ? unslugSchedule(params.sched) : "N/A";

  const { 
    data: gradingComposition, 
    refetch,
    isLoading: isLoadingComposition 
  } = useGetGradingCompositionQuery(
    { teachingLoadDetailId: Number(id) },
    { refetchOnMountOrArgChange: true }
  );

  const { 
    data: baseGade,
    isLoading: isLoadingBaseGrade 
  } = useGetBaseGradeQuery(
    { tld: Number(id) },
    { refetchOnMountOrArgChange: true }
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

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-3/4"></div>
      <div className="flex gap-4">
        <div className="h-8 bg-gray-200 rounded dark:bg-gray-700 w-24"></div>
        <div className="h-8 bg-gray-200 rounded dark:bg-gray-700 w-24"></div>
        <div className="h-8 bg-gray-200 rounded dark:bg-gray-700 w-24"></div>
      </div>
    </div>
  );

  return (
    <div className="mb-4">
      <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
        Class Record: {subjectName} | {semesterName} | {ay}
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

        {/* Grading Composition */}
        <div>
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
            Grading Composition
          </h4>

          <div className="flex flex-wrap gap-4">
            {isLoadingComposition || isLoadingBaseGrade ? (
              <LoadingSkeleton />
            ) : !gradingComposition?.composition?.length && !baseGade ? (
              <div className="space-y-4 rounded border border-red-400 bg-red-100 p-4 text-red-700 dark:bg-red-900 dark:text-red-300">
                <p className="text-base font-semibold">
                  No grading composition and base grade found. Please add
                  grading composition first, then add the base grade.
                </p>
                <DefaultModal title="Add Grading Composition">
                  <AddGradingComposition />
                </DefaultModal>
              </div>
            ) : gradingComposition?.composition?.length ? (
              <div>
                <div className="flex flex-wrap gap-4">
                  {gradingComposition.composition
                    .slice()
                    .sort((a, b) => {
                      const order = ["quiz", "activity", "exam", "attendance"];
                      return (
                        order.indexOf(a.category.categoryName.toLowerCase()) -
                        order.indexOf(b.category.categoryName.toLowerCase())
                      );
                    })
                    .map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium ${getCategoryStyle(
                          item.category.categoryName
                        )}`}
                      >
                        <span className="text-base font-medium">
                          {item.category.categoryName}:
                        </span>
                        <span className="font-bold">{item.percentage}%</span>
                      </div>
                    ))}
                </div>

                {/* Base Grade Info or Add Base Grade */}
                {baseGade ? (
                  <div className="mt-4">
                     <DefaultModal title="Edit Grading Composition">
                      <EditGradingComposition
                        gradingComposition={gradingComposition}
                        onSuccess={refetch}
                      />
                    </DefaultModal>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                      <div className="rounded-lg bg-gray-100 px-3 py-1 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        Base Grade: {baseGade.baseGrade}
                      </div>
                      <div className="rounded-lg bg-gray-100 px-3 py-1 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        Base Percentage: {baseGade.percentage}%
                      </div>
                      <ModalPlain title="Edit">
                        <EditBaseGrade
                          baseGrade={baseGade}
                          onSuccess={refetch}
                        />
                      </ModalPlain>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4">
                    <p className="mb-4 text-base italic text-red-600 dark:text-gray-400">
                      No Base Grade yet. Please Add
                    </p>
                    <DefaultModal title="Add Base Grade">
                      <button className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                        Add Base Grade
                      </button>
                      <AddBaseGrade />
                    </DefaultModal>
                  </div>
                )}
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