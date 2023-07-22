import type { Category } from "./Category";

export interface Question {
    id: number,
    description: string,
    category: Category
}

export class StoreQuestionDTO {
    private description: string = ""
    private categoryId: number = 0

    getDescription() {
        return this.description
    }
    getCategoryId() {
        return this.categoryId
    }
    setDescription(description: string) {
        this.description = description
    }
    setCategoryId(categoryId: number) {
        this.categoryId = categoryId
    }
    getObjectToStore() {
        return {description: this.description, categoryId: this.categoryId }
    }
}