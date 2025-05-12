export interface Subjects {
    id: number;
    subjectDesc: string;
    subjectName: string;
    units: number;
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