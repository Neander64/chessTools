
export class PgnMoveElement {
    //moveNumber?: number -- removed scanned value, regenerating it on demand, anyways
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
