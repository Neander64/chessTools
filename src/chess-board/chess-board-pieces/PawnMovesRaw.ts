import { IField } from "../representation/IField"
import { pieceKind } from './Piece'
import { color, otherColor } from '../../chess-color'
import { offsetsEnum } from '../chess-board-offsets'

export type pawnTarget = {
    target: IField,
    isPromotion: boolean
}
export type pawnMove = {
    isPromotion: boolean,
    enPassantField: IField | undefined
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
            direction: offsetsEnum.S,
            startRow: PawnMovesRaw.startRowBlack,
            promotionRow: PawnMovesRaw.promotionRowBlack,
            capture_left: offsetsEnum.SE,
            capture_right: offsetsEnum.SW,
        },
        White: {
            direction: offsetsEnum.N,
            startRow: PawnMovesRaw.startRowWhite,
            promotionRow: PawnMovesRaw.promotionRowWhite,
            capture_left: offsetsEnum.NW,
            capture_right: offsetsEnum.NE,
        }
    }
    moves: pawnTarget[]
    bigMove: IField | undefined
    attacks: pawnTarget[]

    constructor(startField: IField, color_: color) {
        this.moves = []
        this.attacks = []
        this.bigMove = undefined

        let cfg = PawnMovesRaw.config[color_]
        let target: IField
        if (startField.rank == cfg.startRow) {
            target = startField.shift(cfg.direction, 2)
            this.bigMove = target
        }
        target = startField.shift(cfg.direction)
        if (target.isOnBoard())
            this.moves.push({ target: target, isPromotion: target.rank == cfg.promotionRow })

        target = startField.shift(cfg.capture_left)
        if (target.isOnBoard())
            this.attacks.push({ target: target, isPromotion: target.rank == cfg.promotionRow })

        target = startField.shift(cfg.capture_right)
        if (target.isOnBoard())
            this.attacks.push({ target: target, isPromotion: target.rank == cfg.promotionRow })

    }

    static isLegalPromotionPieceKind(kind_: pieceKind): boolean {
        for (let k of PawnMovesRaw.promotionPieces)
            if (k == kind_) return true
        return false
    }

    static checkPawnMove(source: IField, target: IField, color_: color): pawnMove | undefined {
        // prepare to validate
        let _isPromotion = false
        let _enPassantField: IField | undefined = undefined
        let _isCapture = false
        let cfg = PawnMovesRaw.config[color_]
        if (source.file == target.file) { // forward
            let t1 = source.shift(cfg.direction) // 1-step
            if (target.same(t1)) {
                if (target.rank == cfg.promotionRow) _isPromotion = true
            }
            else if (source.rank == cfg.startRow) {
                let t2 = source.shift(cfg.direction, 2) // 2-step
                if (target.same(t2)) {
                    _enPassantField = t1
                }
                else return undefined
            }
            else return undefined
        }
        else {
            let tl = source.shift(cfg.capture_left)
            let tr = source.shift(cfg.capture_right)
            if (target.same(tl) || target.same(tr)) {
                _isCapture = true
                if (target.rank == cfg.promotionRow) _isPromotion = true
            }
            else return undefined
        }
        return { isPromotion: _isPromotion, enPassantField: _enPassantField, isCapture: _isCapture }
    }

    static getPawnFieldOfCaptureEP(targetEP: IField, colorOfAttacker: color): IField {
        // no validation here, we assume this to be a valid e.p. capture
        let cfg = PawnMovesRaw.config[otherColor(colorOfAttacker)]
        return targetEP.shift(cfg.direction) // that is the place where the pawn should stand
    }
}


