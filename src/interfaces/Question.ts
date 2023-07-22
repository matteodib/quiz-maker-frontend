import type { Category } from "./Category";

export interface Question {
    id: number,
    description: string,
    category: Category
}