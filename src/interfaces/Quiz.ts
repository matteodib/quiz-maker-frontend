import type { Category } from "./Category";
import type { Question } from "./Question";

export interface Quiz {
    id: number,
    title: string,
    description: string,
    categories: Category[],
    session: string,
    questions: Question[],
    active: boolean,
    firstOpening: Date,
    sendingDate: Date
}

export class StoreQuizDTO {
    private title: string = ""
    private description: string = ""
    private categoryIds: number[] = []
    private addRandomQuestions: boolean = false
    private numberOfQuestions: number = 4
    private juniorSeniority: number = 0
    private middleSeniority: number = 0
    private seniorSeniority: number = 0
    getTitle() {
        return this.title
    }
    getDescription() {
        return this.description
    }
    getCategoryIds() {
        return this.categoryIds
    }
    getAddRandomQuestions() {
        return this.addRandomQuestions
    }
    getNumberOfQuestions() {
        return this.numberOfQuestions
    }
    getJuniorSeniority() {
        return this.juniorSeniority
    }
    getMiddleSeniority() {
        return this.middleSeniority
    }
    getSeniorSeniority() {
        return this.seniorSeniority
    }
    setTitle(title: string) {
        this.title = title
    }
    setDescription(description: string) {
        this.description = description
    }
    setCategoryIds(categoryIds: number[]) {
        this.categoryIds = categoryIds
    }
    setAddRandomQuestions(boolean: boolean) {
        this.addRandomQuestions = boolean
    }
    setNumberOfQuestions(number: number) {
        this.numberOfQuestions = number
    }
    setJuniorSeniority(number: number) {
        this.juniorSeniority = number
    }
    setMiddleSeniority(number: number) {
        this.middleSeniority = number
    }
    setSeniorSeniority(number: number) {
        this.seniorSeniority = number
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
        return {title: this.title, description: this.description, categoryIds: this.categoryIds, session, active: true, addQuestions: this.addRandomQuestions, numberOfQuestions:this.numberOfQuestions, 
            juniorSeniority: this.juniorSeniority, middleSeniority: this.middleSeniority, seniorSeniority: this.seniorSeniority}
    }
}