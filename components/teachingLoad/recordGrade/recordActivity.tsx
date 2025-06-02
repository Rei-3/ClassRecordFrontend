'use client'
import { useParams, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetGradingDetailQuery,
  useGetGradingQuery,
} from "@/store/api/apiSlice/get/gradesApiSlice";
import { useGetEnrolledQuery } from "@/store/api/apiSlice/get/teachingLoadApiSlice";
import { usePostRecordGradesMutation } from "@/store/api/apiSlice/post/gradesApiSlice";
import { usePutEditScoreMutation } from "@/store/api/apiSlice/put/gradesApiSlice";

import ScoreTableHeader from "./gradesHeader";
import { clearScores, setScores } from "@/store/api/slices/scoreSlice";
import { AppDispatch, IRootState } from "@/store";
import { useState } from "react";

export default function ScoreTable() {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const [selectedNumberOfItems, setSelectedNumberOfItems] = useState<number | null>(null);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<number | null>(null);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [selectedGradingDetailId, setSelectedGradingDetailId] = useState<number | null>(null);

  const { teachingLoadDetailId, termId, categoryId, categoryName } = useParams();

  const searchParams = useSearchParams();
  
  // Get search values from both Redux and URL
  const searchValue = useSelector((state: IRootState) => state.search.searchValue);
  const urlSearch = searchParams.get("search")?.toLowerCase() || '';
  
  // Determine effective search term (Redux takes precedence over URL)
  const effectiveSearch = searchValue || urlSearch;

  const { data: gradingData } = useGetGradingQuery(
    {
      teachingLoadDetailId: Number(teachingLoadDetailId),
      termId: Number(termId),
      categoryId: Number(categoryId),
    },
    { refetchOnMountOrArgChange: true }
  );

  const { data: enrolledStudents, isLoading: isLoadingStudents } = useGetEnrolledQuery(
    Number(teachingLoadDetailId),
    { refetchOnMountOrArgChange: true }
  );

  const { data: gradingDetail, refetch: refetchScore } = useGetGradingDetailQuery(
    {
      teachingLoadDetailId: Number(teachingLoadDetailId),
      termId: Number(termId),
      categoryId: Number(categoryId),
    },
    { refetchOnMountOrArgChange: true }
  );

  const [recordActivity] = usePostRecordGradesMutation();
  const [updateScore] = usePutEditScoreMutation();

  const localScores = useSelector((state: IRootState) => state.score.scores);

  // Filter and sort students based on effective search term
  const filteredStudents = (enrolledStudents || [])
    .filter(student => {
      if (!effectiveSearch) return true;
      
      return (
        student.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
        student.studentId.toString().includes(effectiveSearch)
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name)); // Sort by name alphabetically

  const handleRecordGrades = async () => {
    if (localScores.length === 0) return;

    try {
      await recordActivity(localScores).unwrap();
      dispatch(clearScores());
      refetchScore();
    } catch (error: any) {
      window.alert(`Error recording grades: ${error}`);
    }
  };

  const totalItems = gradingData?.reduce((sum, item) => sum + item.numberOfItems, 0) || 0;

  const handleScoreChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    activityId: number,
    studentId: number,
    maxItems: number
  ) => {
    const score = Math.min(Number(e.target.value), maxItems);
    dispatch(
      setScores({
        gradingId: activityId,
        enrollmentId: studentId,
        score,
      })
    );
  };

  const handleCellClick = (
    activityId: number,
    items: number,
    enrollmentId: number,
    score: number,
    gradingDetailId: number
  ) => {
    setSelectedActivityId(activityId);
    setSelectedNumberOfItems(items);
    setSelectedEnrollmentId(enrollmentId);
    setSelectedScore(score);
    setSelectedGradingDetailId(gradingDetailId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedActivityId(null);
    setSelectedEnrollmentId(null);
    setSelectedNumberOfItems(null);
    setSelectedScore(null);
    setSelectedGradingDetailId(null);
  };

  const handleEditScore = async () => {
    if (selectedGradingDetailId && selectedScore !== null && selectedNumberOfItems !== null) {
      try {
        await updateScore({
          gradingDetailId: selectedGradingDetailId,
          score: Math.min(selectedScore, selectedNumberOfItems),
        }).unwrap();
        refetchScore();
        handleCloseModal();
      } catch (error: any) {
        alert("Error updating score");
      }
    }
  };

  // Helper function to calculate total score for a student
  const calculateTotalScore = (enrollmentId: number) => {
    return gradingData?.reduce((sum, activity) => {
      const score =
        gradingDetail?.find(
          (detail) =>
            detail.gradingId === activity.id &&
            detail.enrollmentId === enrollmentId
        )?.score ??
        localScores.find(
          (s: any) =>
            s.gradingId === activity.id &&
            s.enrollmentId === enrollmentId
        )?.score ??
        0;
      return sum + score;
    }, 0);
  };

  // Helper function to highlight search matches
  const highlightMatch = (text: string, search: string) => {
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === search.toLowerCase() ? 
      <span key={i} className="bg-yellow-200 dark:bg-yellow-600">{part}</span> : 
      part
    );
  };
  
  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
   
      return dateString.slice(0, 10); // Fallback to simple slice if parsing fails
    
  };

  return (
    <div>
      <ScoreTableHeader />
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Student ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Name of Students
              </th>

              {gradingData && gradingData.length > 0 ? (
                gradingData.map((activity, index) => (
                  <th
                    key={activity.id}
                    className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                  >
                    <div className="flex flex-col">
                      <span>
                        {categoryName?.toString().charAt(0)}
                        {index + 1} = {activity.numberOfItems}
                      </span>
                      {activity.date && (
                        <span className="text-xs font-normal mt-1">
                          {formatDate(activity.date)}
                        </span>
                      )}
                    </div>
                  </th>
                ))
              ) : (
                <th
                  colSpan={3}
                  className="px-4 py-3 text-center text-xs font-medium italic tracking-wider text-gray-400 dark:text-gray-400"
                >
                  <span className="text-red-500">
                    No Activities Created for this Category
                  </span>
                </th>
              )}

              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Total = {totalItems}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {isLoadingStudents ? (
              <tr>
                <td colSpan={gradingData ? gradingData.length + 3 : 4} className="p-4 text-center">
                  Loading students...
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={gradingData ? gradingData.length + 3 : 4} className="p-4 text-center">
                  {effectiveSearch ? `No students found matching "${effectiveSearch}"` : "No students enrolled"}
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, index) => (
                <tr
                  key={student.enrollmentId}
                  className={`
                    ${index % 2 === 0 ? 
                      'bg-slate-200 dark:bg-gray-900' : 
                      'bg-gray-50 dark:bg-gray-800'
                    }
                    hover:bg-gray-100 dark:hover:bg-gray-700 
                    transition-colors duration-150`}                >
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {student.studentId}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {effectiveSearch ? highlightMatch(student.name, effectiveSearch) : student.name}
                  </td>

                  {gradingData?.map((activity) => {
                    const recordFromApi = gradingDetail?.find(
                      (detail) =>
                        detail.gradingId === activity.id &&
                        detail.enrollmentId === student.enrollmentId
                    );

                    const localScore = localScores.find(
                      (s: any) =>
                        s.gradingId === activity.id &&
                        s.enrollmentId === student.enrollmentId
                    )?.score;

                    const score = recordFromApi?.score ?? localScore;

                    const gradingDetailId = recordFromApi?.gradingDetailId;

                    return (
                      <td
                        key={activity.id}
                        className="whitespace-nowrap px-4 py-4 text-center hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-gray-100"
                        onClick={() =>
                          recordFromApi &&
                          handleCellClick(
                            activity.id,
                            activity.numberOfItems,
                            student.enrollmentId,
                            score ?? 0,
                            gradingDetailId!
                          )
                        }
                      >
                        {recordFromApi ? (
                          score
                        ) : (
                          <input
                            type="text"
                            min={0}
                            max={activity.numberOfItems}
                            placeholder="Missing"
                            className="w-16 rounded border px-1 py-0.5 text-center dark:bg-gray-700"
                            value={localScore ?? ""}
                            onChange={(e) =>
                              handleScoreChange(
                                e,
                                activity.id,
                                student.enrollmentId,
                                activity.numberOfItems
                              )
                            }
                          />
                        )}
                      </td>
                    );
                  })}

                  <td className="whitespace-nowrap px-4 py-4 text-center text-sm">
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {calculateTotalScore(student.enrollmentId)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 dark:text-gray-100 w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Score</h2>
            <div>
              <p>Activity ID: {selectedActivityId}</p>
              <p>Max Score: {selectedNumberOfItems}</p>
              <p>Student ID: {selectedEnrollmentId}</p>

              <input
                type="text"
                value={selectedScore ?? ""}
                onChange={(e) => setSelectedScore(Number(e.target.value))}
                className="mt-2 px-4 py-2 border rounded w-full"
                placeholder="Enter new score"
                max={selectedNumberOfItems || undefined}
              />
            </div>

            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleEditScore}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {localScores.length > 0 && (
        <div className="mt-4 text-right">
          <button
            onClick={handleRecordGrades}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Submit Missing Scores
          </button>
        </div>
      )}
    </div>
  );
}