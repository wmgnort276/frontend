export interface UserExercise {
    id: string,
    status: boolean,
    createdAt: string,
    studentId: string,
    exerciseId: string,
    exerciseName: string,
    exerciseLevelName: string,
    exerciseTypeName: string
}

export interface ExerciseCategoryStatistic {
    exerciseTypeName: string,
    count: number
}

export interface UserStatistic {
    userName: string,
    score: number
}