
import { Category } from "./choices";

export interface StudentSemRecord  {
    studentId: number;
    name: string;
    scores: Grade
    finalGrade: number;
    remarks: string;
  };

   interface Grade {
    Quiz: number;
    Activity: number;
    Attendance: number;
    Exam: number;
  }

export interface StudentFinal{
    studentId: number;
    studentName: string;
    termGrades: TermGrades;
    semesterGrade: number;
    message: string;
  }

 interface TermGrades {
    Midterm: number;
    Final: number;
  }

export interface GradingComposition {

    teachingLoadDetailId: number;
    composition: Composition[];
  }

  interface Composition {
    id: number;
    percentage: number;
    category: Category;
  }

export interface Grading {
  id: number;
  desc: string;
  numberOfItems: number;
  catId: number;
  termId: number; 
  teachingLoadDetailId: number; 
  date: string;
}

export interface GradingDetail {
  gradingDetailId: number;
  gradingId: number;
  enrollmentId: number;
  description: string;
  conductedOn: string;
  numberOfItems: number;
  score: number;
  recordedOn: string;
}

export interface PostGradingComposition {
    percentage: number;
    categoryId: number;
    teachingLoadDetailId: number;
  }

export interface PutGradingComposition {
  gradingCompositionId: number;
  percentage: number;
  }

export interface PostAddActivity {
    description: string;
    numberOfItems: number;
    categoryId: number;
    teachingLoadDetailId: number;
    termId: number;
}

export interface RecordScore {
  enrollmentId: number;
  gradingId: number;
  score: number;
}

export interface Editscore {
  gradingDetailId: number;
  score: number;
}

export interface TeachingLoadStatusEdit{
  teachingLoadId: number;
  status: string;
}

export interface BaseGradeMutation {
  teachingLoadDetailId: number;
  baseGrade: number;
  percentage: number
}

export interface BaseGrade {
  id: number;
  baseGrade: number;
  percentage: number;
}

export interface AttendanceSheet{
  teachingLoadDetailId: number;
  termId: number;
  categoryId: number;
}