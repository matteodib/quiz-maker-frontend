import type { Question } from "./Question";

export interface QuizQuestion {
    id: number,
    answer: string,
    question: Question
}