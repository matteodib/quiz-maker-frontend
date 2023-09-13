import type { Category } from "./Category";
import type { QuestionType } from "./QuestionType";
import type { Ranking } from "./Ranking";

export interface Question {
    id: number,
    description: string,
    category: Category,
    questionType: QuestionType,
    ranking: Ranking,
    multipleQuestionChoices: QuestionAnswer[]
}

export interface QuestionAnswer {
    id: number,
    text: string | number | null,
    isCorrect: boolean
}

export class StoreQuestionDTO {
    private description: string = ""
    private categoryId: number = 0
    private rankingId: number = 0
    private typeId: number = 0

    private questionAnswers: QuestionAnswer[] = []
    getDescription() {
        return this.description
    }
    getCategoryId() {
        return this.categoryId
    }
    getRankingId() {
        return this.rankingId
    }
    getTypeId() {
        return this.typeId
    }
    getQuestionAnswers() {
        return this.questionAnswers
    }
    setDescription(description: string) {
        this.description = description
    }
    setCategoryId(categoryId: number) {
        this.categoryId = categoryId
    }
    setRankingId(rankingId: number) {
        this.rankingId = rankingId
    }
    setTypeId(typeId: number) {
        this.typeId = typeId
    }
    setQuestionAnswers(answers: QuestionAnswer[]) {
        this.questionAnswers = answers
    }
    getObjectToStore() {
        return {description: this.description, categoryId: this.categoryId, rankingId: this.rankingId, questionType: this.typeId, multipleQuestionChoices: this.questionAnswers }
    }
}