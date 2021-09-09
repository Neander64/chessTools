import { boardFieldIdx, offsets, sameFields, shiftField } from './chess-board-internal-types'
import { IChessBoardRepresentation } from './chess-board-representation'
import { pieceKind } from './chess-board-pieces'
import { color, otherColor } from './chess-color'

export type pawnTarget = {
    target: boardFieldIdx,
    isPromotion: boolean
}
export type pawnMove = {
    isPromotion: boolean,
    enPassantField: boardFieldIdx | undefined
    isCapture: boolean

}


export class PawnMovesRaw {
    static readonly startRowBlack = 1
    static readonly startRowWhite = 6
    static readonly promotionRowBlack = 7
    static readonly promotionRowWhite = 0
    static readonly promotionPieces = [pieceKind.Bishop, pieceKind.Knight, pieceKind.Queen, pieceKind.Rook]
    static readonly config = {
        Black: {
            direction: offsets.S,
            startRow: PawnMovesRaw.startRowBlack,
            promotionRow: PawnMovesRaw.promotionRowBlack,
            capture_left: offsets.SE,
            capture_right: offsets.SW,
        },
        White: {
            direction: offsets.N,
            startRow: PawnMovesRaw.startRowWhite,
            promotionRow: PawnMovesRaw.promotionRowWhite,
            capture_left: offsets.NW,
            capture_right: offsets.NE,
        }
    }
    moves: pawnTarget[]
    bigMove: boardFieldIdx | undefined
    attacks: pawnTarget[]

    constructor(startField: boardFieldIdx, color_: color, board: IChessBoardRepresentation) {
        this.moves = []
        this.attacks = []
        this.bigMove = undefined

        let cfg = PawnMovesRaw.config[color_]
        let target: boardFieldIdx
        if (startField.rowIdx == cfg.startRow) {
            target = shiftField(startField, cfg.direction, 2)
            this.bigMove = target
        }
        target = shiftField(startField, cfg.direction)
        if (board.isFieldOnBoard(target))
            this.moves.push({ target: target, isPromotion: target.rowIdx == cfg.promotionRow })

        target = shiftField(startField, cfg.capture_left)
        if (board.isFieldOnBoard(target))
            this.attacks.push({ target: target, isPromotion: target.rowIdx == cfg.promotionRow })

        target = shiftField(startField, cfg.capture_right)
        if (board.isFieldOnBoard(target))
            this.attacks.push({ target: target, isPromotion: target.rowIdx == cfg.promotionRow })

    }

    static isLegalPromotionPieceKind(kind_: pieceKind): boolean {
        for (let k of PawnMovesRaw.promotionPieces)
            if (k == kind_) return true
        return false
    }

    static checkPawnMove(source: boardFieldIdx, target: boardFieldIdx, color_: color): pawnMove | undefined {
        // prepare to validate
        let _isPromotion = false
        let _enPassantField: boardFieldIdx | undefined = undefined
        let _isCapture = false
        let cfg = PawnMovesRaw.config[color_]
        if (source.colIdx == target.colIdx) { // forward
            let t1 = shiftField(source, cfg.direction) // 1-step
            if (sameFields(target, t1)) {
                if (target.rowIdx == cfg.promotionRow) _isPromotion = true
            }
            else if (source.rowIdx == cfg.startRow) {
                let t2 = shiftField(source, cfg.direction, 2) // 2-step
                if (sameFields(target, t2)) {
                    _enPassantField = t1
                }
                else return undefined
            }
            else return undefined
        }
        else {
            let tl = shiftField(source, cfg.capture_left)
            let tr = shiftField(source, cfg.capture_right)
            if (sameFields(target, tl) || sameFields(target, tr)) {
                _isCapture = true
                if (target.rowIdx == cfg.promotionRow) _isPromotion = true
            }
            else return undefined
        }
        return { isPromotion: _isPromotion, enPassantField: _enPassantField, isCapture: _isCapture }
    }

    static getPawnFieldOfCaptureEP(targetEP: boardFieldIdx, colorOfAttacker: color): boardFieldIdx {
        // no validation here, we assume this to be a valid e.p. capture
        let cfg = PawnMovesRaw.config[otherColor(colorOfAttacker)]
        return shiftField(targetEP, cfg.direction) // that is the place where the pawn should stand
    }
}


