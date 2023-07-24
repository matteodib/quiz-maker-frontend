import type { Category } from "./Category";
import type { Question } from "./Question";

export interface Quiz {
    id: number,
    title: string,
    description: string,
    category: Category,
    session: string,
    questions: Question[],
    active: boolean,
    firstOpening: Date,
    sendingDate: Date
}

export class StoreQuizDTO {
    private title: string = ""
    private description: string = ""
    private categoryId: number = 0

    getTitle() {
        return this.title
    }
    getDescription() {
        return this.description
    }
    getCategoryId() {
        return this.categoryId
    }
    setTitle(title: string) {
        this.title = title
    }
    setDescription(description: string) {
        this.description = description
    }
    setCategoryId(categoryId: number) {
        this.categoryId = categoryId
    }

    getObjectToStore() {
        function makeid(length: number) {
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$!-_';
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < length) {
              result += characters.charAt(Math.floor(Math.random() * charactersLength));
              counter += 1;
            }
            return result;
        }

        const session = makeid(30)
        return {title: this.title, description: this.description, categoryId: this.categoryId, session, active: true}
    }
}