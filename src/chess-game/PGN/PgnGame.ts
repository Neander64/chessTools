import { Fen } from "../FEN/Fen"
import { PgnMoveElement } from "./PgnMoveElement"
import { PgnTags } from "./PgnTags"

export class PgnGame {
    header: PgnTags
    moves: PgnMoveElement[]
    private _fen?: Fen
    constructor() {
        this.header = new PgnTags()
        this.moves = []
    }
    get startFen(): Fen {
        this._fen = this.header.fen || new Fen(Fen.initialBoardFEN)
        return this._fen
    }
    get mainLine(): string {
        return this.moves.reduce((p, a) => { return p + a.move + ' ' }, '')
    }
}
