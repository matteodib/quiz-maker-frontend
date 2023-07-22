export interface Category {
    id: number,
    name: string,
}
export class StoreCategoryDTO {
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