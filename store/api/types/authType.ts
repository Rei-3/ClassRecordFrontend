export interface Register {
    fname: string,
    mname?: string,
    lname: string,
    email: string,
    teacher_id: string,
    gender: boolean,
    dob: Date,
}

export interface AuthResponse {
    username: string,
    fname: string,
    lname: string,
    role: string,
}

export interface Login {
    username: string,
    password: string,
}

export interface UsernanamePassword {
    username: string,
    password: string,
}