import { useParams } from "next/navigation";

export default function ScoreTableHeader() {
  const { categoryName, termName } = useParams();

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
    <div className="mb-2 px-2">
      <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
      Score Breakdown:
      <span
          className={`ml-1 px-2 py-0.5 rounded-full mr-2 ${getCategoryStyle(
            (typeof categoryName === "string" ? categoryName : categoryName?.[0] || "")
          )}`}
        >
          {categoryName}
        </span> 
 |
        <span className="ml-2 px-2 bg-blue-200 rounded-full mr-2 dark:bg-blue-800">{termName}</span>
      </h2>
      Manage your scores here. You can add, edit, or delete scores for each student in the selected category and term.
    </div>
  );
}
