
export class PgnMoveElement {
    //moveNumber?: number
    move: string
    annotation: string[]
    comment: string[]
    variation: PgnMoveElement[]
    constructor(move: string) {
        this.move = move
        this.comment = []
        this.annotation = []
        this.variation = []
    }
}
