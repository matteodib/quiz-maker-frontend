export interface QuestionType {
    id: number,
    name: string,
}
export class StoreQuestionTypeDTO {
    private name: string = ""

    getName() {
        return this.name
    }
    setName(name: string) {
        this.name = name
    }

    getObjectToStore() {
        return {name: this.name}
    }
}