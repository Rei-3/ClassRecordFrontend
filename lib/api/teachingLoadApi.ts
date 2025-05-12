import { TeachingLoad } from "@/store/api/types/teachingLoadTypes";
import { getAuthToken } from "../utils/authUtil";

export async function fetchTeachingLoads(): Promise<TeachingLoad[]> {
  const token = getAuthToken();
  if (!token) throw new Error("No auth token");

  const response = await fetch("http://localhost:8080/api/class-record/teaching-load", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch teaching loads");
  }

  return response.json();
}
