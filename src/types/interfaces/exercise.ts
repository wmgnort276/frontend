export interface ExerciseType {
    id: number,
    name: string,
    checked: boolean
}

export interface ExerciseLevel {
    id: number,
    name: string
}

export interface Exercise {
    id: string,
    name: string,
    exerciseLevelName: string,
    exerciseTypeName: string
}

export interface Submission {
    id: string,
    studentId: string,
    exerciseId: string,
    createdAt: string,
    status: string,
    runtime: string,
}

export interface SubmissionDetail {
    id: string,
    createdAt: string,
    status: string,
    sourceCode: string
}


export interface TestCase {
    input: string,
    output: string,
    expectedOutput: string,
    status: boolean,
    isSubmitted: boolean
}