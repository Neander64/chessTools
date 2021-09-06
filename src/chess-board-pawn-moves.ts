import { boardFieldIdx, offsets, shiftField } from './chess-board-internal-types'
import { IChessBoardRepresentation } from './chess-board'
import { pieceKind } from './chess-board-pieces'
import { color } from './chess-color'

export type pawnTarget = {
    target: boardFieldIdx,
    isPromotion: boolean
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
}

