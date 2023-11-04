export interface ExerciseType {
    id: number,
    name: string
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