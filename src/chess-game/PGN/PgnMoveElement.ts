
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

    get alternativeMoves(): PgnMoveElement[] {
        // List of all fist moves in variation-chain
        let result: PgnMoveElement[] = []
        let m: PgnMoveElement | undefined = this
        do {
            result.push(m)
            m = PgnMoveElement.firstMoveOfVariation(m)
        } while (m)
        return result
    }
    static firstMoveOfVariation(moveElem: PgnMoveElement): PgnMoveElement | undefined {
        if (moveElem.variation.length > 0) return moveElem.variation[0]
        return undefined
    }
    allVariations(): PgnMoveElement[][] {
        let result: PgnMoveElement[][] = []
        let moveElem: PgnMoveElement = this
        while (moveElem.variation.length > 0) {
            result.push(moveElem.variation)
            moveElem = moveElem.variation[0]
        }
        return result
    }

    appendVariation(variation: PgnMoveElement[]) {
        let moveElem: PgnMoveElement = this
        while (moveElem.variation.length > 0) {
            moveElem = moveElem.variation[0]
        }
        moveElem.variation = variation
    }
    isMoveInAlternatives(move: string): PgnMoveElement[] | undefined {
        let moveElem: PgnMoveElement = this
        let result: PgnMoveElement[] | undefined = undefined
        while (moveElem.variation.length > 0) {
            result = moveElem.variation
            moveElem = moveElem.variation[0]
            if (moveElem.move == move) return result
        }
        return undefined
    }
    removeAlternative(move: string) {
        let moveElem: PgnMoveElement = this
        let prevElem = moveElem
        while (moveElem.variation.length > 0) {
            moveElem = moveElem.variation[0]
            if (moveElem.move == move) {
                prevElem.variation = moveElem.variation
                break
            }
            prevElem = moveElem
        }
    }
}
