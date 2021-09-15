import { moveOnBoard } from "./moveOnBoard"
import { pieceOnBoard } from "./representation/pieceOnBoard"

export class LegalMovesCache {
    private _legalMovesCached: Map<pieceOnBoard, moveOnBoard[]>
    private _allMoves?: moveOnBoard[]

    constructor() {
        this._legalMovesCached = new Map<pieceOnBoard, moveOnBoard[]>()
        this._allMoves = undefined
    }
    clear() {
        this._allMoves = undefined
    }

    getMovesOfPiece(piece_: pieceOnBoard): moveOnBoard[] | undefined {
        return this._legalMovesCached.get(piece_)
    }
    setMovesOfPiece(piece_: pieceOnBoard, moves: moveOnBoard[]) {
        return this._legalMovesCached.set(piece_, moves)
    }
    setAllMoves(moves: moveOnBoard[]) {
        this._allMoves = moves
    }
    getAllMoves(): moveOnBoard[] | undefined {
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