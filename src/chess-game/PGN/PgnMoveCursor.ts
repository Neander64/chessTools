import { PgnMoveElement } from "./PgnMoveElement"

export class PgnMoveCursor {
    private _rootMoves: PgnMoveElement[]
    private _currentMove?: PgnMoveElement
    private _previousMoves: PgnMoveElement[]
    private _currentLine: PgnMoveElement[]
    private _currentLineIdx: number

    constructor(moves: PgnMoveElement[]) {
        this._rootMoves = moves
        this._currentMove = undefined
        this._previousMoves = []
        this._currentLine = moves
        this._currentLineIdx = 0
    }
    get currentMove() { return this._currentMove }
    get line() { return this._previousMoves }

    move(move: string): boolean {
        if (!this._currentMove) {
            if (this._currentLine.length > 0 && this._currentLine[0].move == move) {
                this._currentMove = this._currentLine[0]
                this._currentLineIdx = 0
                return true
            }
            if (this._currentLine.length == 0) return false
            let tmp = this._currentLine[0]
            while (tmp.variation.length > 0) {
                if (tmp.variation[0].move == move) {
                    this._currentMove = tmp.variation[0]
                    this._currentLine = tmp.variation
                    this._currentLineIdx = 0
                    return true
                }
                tmp = tmp.variation[0]
            }
        }
        else {
            if (this._currentLine.length > this._currentLineIdx + 1) {
                if (this._currentLine[this._currentLineIdx + 1].move == move) {
                    this._previousMoves.push(this._currentMove)
                    this._currentMove = this._currentLine[this._currentLineIdx + 1]
                    this._currentLineIdx++
                    return true
                }
                let tmp = this._currentLine[this._currentLineIdx + 1]
                while (tmp.variation.length > 0) {
                    if (tmp.variation[0].move == move) {
                        this._previousMoves.push(this._currentMove)
                        this._currentMove = tmp.variation[0]
                        this._currentLine = tmp.variation
                        this._currentLineIdx = 0
                        return true
                    }
                    tmp = tmp.variation[0]
                }
            }
        }
        return false
    }
    // back(): boolean {
    // need to save the full state (i.e. currentLine, LineIdx as well), seems like a bit of waste for such a small functionality
    //     this._currentMove = this._previousMoves.pop()
    //     return this._currentMove != undefined
    // }
    root() {
        this._currentLine = this._rootMoves
        this._currentLineIdx = 0
        this._previousMoves = []
        this._currentMove = undefined
    }
    add(moveElem: PgnMoveElement) {
        if (!this.move(moveElem.move)) {
            if (this._currentLine.length <= this._currentLineIdx + 1) {
                if (this._currentMove) this._previousMoves.push(this._currentMove)
                this._currentMove = moveElem
                this._currentLine.push(moveElem)
                this._currentLineIdx++
            }
            else {
                let tmp = this._currentMove ? this._currentMove : this._currentLine[this._currentLineIdx]
                while (tmp.variation.length > 0) {
                    tmp = tmp.variation[0]
                }
                tmp.variation.push(moveElem)
                if (this._currentMove) this._previousMoves.push(this._currentMove)
                this._currentMove = tmp.variation[0]
                this._currentLine = tmp.variation
                this._currentLineIdx = 0
            }
        }
    }
}
