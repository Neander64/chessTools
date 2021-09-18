import { Piece, pieceKind } from '../../common/Piece'
import { color } from '../../common/chess-color'
import { KingMovesRaw } from '../pieces/KingMovesRaw'
import { CastleFlags, castleType } from "../../common/CastleFlags"
import { ChessGameStatusData } from "../../common/ChessGameStatusData"
import { MoveOnBoard } from "../../common/MoveOnBoard"
import { IField } from '../../common/IField'
import { pieceOnBoard } from '../../common/pieceOnBoard'
import { IChessBoardRepresentation } from "./IChessBoardRepresentation"


export class ValidatedMove {
    isValid: boolean
    sourcePieceOB: pieceOnBoard
    target: IField
    // pawn promotion
    isPromotion: boolean
    promotionPieceKind?: pieceKind
    captureEP: boolean

    // castle
    isCastle: boolean
    castleType?: castleType
    pieceRook?: pieceOnBoard
    targetRook?: IField
    // captured/replaced Piece
    pieceCaptured?: pieceOnBoard

    // data to be updated (in GameStatus)
    castleFlags: CastleFlags
    enPassantField?: IField
    halfMoves50: number
    _notation: string

    constructor(pieceOB_: pieceOnBoard, target_: IField, data_: ChessGameStatusData) {
        this.isValid = false
        this.sourcePieceOB = pieceOB_
        this.target = target_
        this.captureEP = false
        this.isPromotion = false
        this.isCastle = false
        this.castleType = undefined
        this.castleFlags = new CastleFlags(data_.castleFlags)
        this.enPassantField = data_.enPassantField
        this.halfMoves50 = data_.halfMoves50
        this._notation = ''
    }
    get color(): color { return this.sourcePieceOB.piece.color }
    get source(): IField { return this.sourcePieceOB.field }
    get kind(): pieceKind { return this.sourcePieceOB.piece.kind }
    get piece(): Piece { return this.sourcePieceOB.piece }
    get capturedKind(): pieceKind { return this.pieceCaptured?.piece.kind! }
    get capturedColor(): color { return this.pieceCaptured?.piece.color! }
    get capturedField(): IField { return this.pieceCaptured?.field! }
    get isPawn(): boolean { return this.sourcePieceOB.piece.kind == pieceKind.Pawn }
    get isCapture(): boolean { return (typeof this.pieceCaptured != 'undefined') }
    updateData(data_: ChessGameStatusData, cbr: IChessBoardRepresentation) {
        data_.castleFlags.set(this.castleFlags)
        data_.enPassantField = this.enPassantField
        data_.halfMoves50 = this.halfMoves50
        this._notation = this.notation(cbr)
    }
    get moveOnBoard(): MoveOnBoard {
        let mob = new MoveOnBoard(this.sourcePieceOB, this.target)
        mob.promotionPiece = this.promotionPieceKind
        mob.castleType = this.castleType
        mob.pieceRook = this.pieceRook
        mob.targetRook = this.targetRook
        mob.pieceCaptured = this.pieceCaptured
        mob.notationLong = this.notationLong
        mob.notation = this._notation
        return mob
    }
    private get notationLong(): string {
        let result = ''
        if (this.isCastle) {
            switch (this.castleType) {
                case castleType.short: return KingMovesRaw.CASTLE_SHORT_STR
                case castleType.long: return KingMovesRaw.CASTLE_LONG_STR
            }
            // return 'invalid castle'
        }
        else {
            if (!this.isPawn) {
                result += this.sourcePieceOB.piece.PGN
            }
            result += this.sourcePieceOB.field.notation
            result += (this.isCapture || this.captureEP) ? 'x' : '-'
            result += this.target.notation
            if (this.isPawn && this.isPromotion) {
                result += '=' + Piece.getPiece(this.promotionPieceKind!, this.color).PGN
            }
        }
        return result
    }
    private notation(cbr: IChessBoardRepresentation): string {
        let result = ''
        if (this.isCastle) {
            switch (this.castleType) {
                case castleType.short: return KingMovesRaw.CASTLE_SHORT_STR
                case castleType.long: return KingMovesRaw.CASTLE_LONG_STR
            }
            // return 'invalid castle'
        }
        else {
            if (!this.isPawn) {
                result += this.piece.PGN
                let sourceNota = this.source.notation
                let others = cbr.getAttackersOfKindOn(this.target, this.kind, this.color)
                let unifier_rank = ''
                let unifier_file = ''
                for (let a of others) {
                    if (a.field.same(this.source))
                        continue;
                    if (a.field.rankIdx == this.source.rankIdx)
                        unifier_rank = sourceNota.charAt(0); // add file
                    if (a.field.fileIdx == this.source.fileIdx)
                        unifier_file = sourceNota.charAt(1); // add rank
                    if (unifier_rank == '' && unifier_file == '') // not specific on file nor rank
                        unifier_file = sourceNota.charAt(0); // add file
                    if (unifier_rank != '' && unifier_file != '') break // fully specified
                }
                let unifier = unifier_rank + unifier_file
                result += unifier + ((this.isCapture || this.captureEP) ? 'x' : '')
            }
            else {
                if (this.isCapture || this.captureEP)
                    result += this.source.notation.charAt(0) + 'x'
            }
            result += this.target.notation
            if (this.isPawn && this.isPromotion) {
                result += '=' + Piece.getPiece(this.promotionPieceKind!, this.color).PGN
            }
        }
        return result
    }
}
