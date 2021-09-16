import { MoveOnBoard } from "../common/moveOnBoard"
import { pieceOnBoard } from "../common/pieceOnBoard"

export class LegalMovesCache {
    private _legalMovesCached: Map<pieceOnBoard, MoveOnBoard[]>
    private _allMoves?: MoveOnBoard[]

    constructor() {
        this._legalMovesCached = new Map<pieceOnBoard, MoveOnBoard[]>()
        this._allMoves = undefined
    }
    clear() {
        this._allMoves = undefined
    }

    getMovesOfPiece(piece_: pieceOnBoard): MoveOnBoard[] | undefined {
        return this._legalMovesCached.get(piece_)
    }
    setMovesOfPiece(piece_: pieceOnBoard, moves: MoveOnBoard[]) {
        return this._legalMovesCached.set(piece_, moves)
    }
    setAllMoves(moves: MoveOnBoard[]) {
        this._allMoves = moves
    }
    getAllMoves(): MoveOnBoard[] | undefined {
        return this._allMoves
    }
    // getAllMoves(): moveOnBoard[] {
    //     //if (!this.hasAllPieces) throw new Error('LegalMovesCache: Update/Set all pieces before calling getAllMoves()')
    //     if (typeof this._allMoves != 'undefined') return this._allMoves
    //     this._allMoves = []
    //     for (let p of this._legalMovesCached.keys()) {
    //         this._allMoves = this._allMoves?.concat(this._legalMovesCached.get(p)!)
    //     }
    //     return this._allMoves
    // }
}