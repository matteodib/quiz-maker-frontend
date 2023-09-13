export interface Ranking {
    id: number,
    name: string,
}
export class StoreRankingDTO {
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