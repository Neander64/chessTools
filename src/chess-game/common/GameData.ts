import { GameResult } from "./GameResult"

export type gameHeaderDateType = {
    year: number
    month: number
    day: number
}
export class GameHeaderData {
    event!: string
    site!: string
    date!: gameHeaderDateType
    round!: string
    blackPlayer!: string
    whitePlayer!: string
    result!: GameResult
    constructor() {
        this.clear()
    }
    clear() {
        this.event = ''
        this.site = ''
        this.date = { year: 0, month: 0, day: 0 }
        this.round = ''
        this.blackPlayer = ''
        this.whitePlayer = ''
        this.result = GameResult.none
    }
}