export interface Subjects {
    id: number;
    subjectDesc: string;
    subjectName: string;
    units: number;
}

export interface SubjectsWithCourse {

    id: number;
    subjectDesc: string;
    subjectName: string;
    units: number;
    courseId: number;
    courseName: string;
    
}

export interface Sem {
    id: number;
    semName: string;
}

export interface SubjectPost {
    id: number;
    SubjectId: number;
    schedule: string;
    section: string;
}

export interface Terms {
    id: number;
    termType: string;
}

export interface Category {
    id: number;
    categoryName: string;
}