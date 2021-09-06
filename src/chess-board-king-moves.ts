import { boardFieldIdx, offsets, shiftField } from './chess-board-internal-types'
import { IChessBoardRepresentation } from './chess-board'
import { Piece } from './chess-board-pieces'
import { color } from './chess-color'

export enum castleType {
    short,
    long
}

type castleData = {
    kingSource: boardFieldIdx
    kingTarget: boardFieldIdx
    rookSource: boardFieldIdx
    rookTarget: boardFieldIdx
    kingPiece: Piece
    rookPiece: Piece
    row: number
    kingPathCols: { start: number, end: number }
    betweenPathCols: { start: number, end: number }
}

export class KingMovesRaw {
    static readonly CASTLE_SHORT_STR = 'O-O'
    static readonly CASTLE_LONG_STR = 'O-O-O'
    static readonly kingsTargetColCastleShort = 6
    static readonly kingsTargetColCastleLong = 2

    moves: boardFieldIdx[]

    constructor(startField: boardFieldIdx, board: IChessBoardRepresentation) {
        const offsetsKing = [
            offsets.NE,
            offsets.N,
            offsets.NW,
            offsets.E,
            offsets.W,
            offsets.SE,
            offsets.S,
            offsets.SW,
        ];
        this.moves = [];
        for (const f of offsetsKing) {
            let newField = shiftField(startField, f)
            if (board.isFieldOnBoard(newField)) {
                this.moves.push(newField)
            }
        }
    }

    static castle(color_: color, type_: castleType): castleData {
        let rowIdx_ = (color_ == color.black) ? 0 : 7

        return {
            kingSource: { colIdx: (type_ == castleType.short) ? 4 : 4, rowIdx: rowIdx_ },
            kingTarget: { colIdx: (type_ == castleType.short) ? 6 : 2, rowIdx: rowIdx_ },
            rookSource: { colIdx: (type_ == castleType.short) ? 7 : 0, rowIdx: rowIdx_ },
            rookTarget: { colIdx: (type_ == castleType.short) ? 5 : 3, rowIdx: rowIdx_ },
            kingPiece: (color_ == color.black) ? Piece.blackKing() : Piece.whiteKing(),
            rookPiece: (color_ == color.black) ? Piece.blackRook() : Piece.whiteRook(),
            row: rowIdx_,
            kingPathCols: { start: (type_ == castleType.short) ? 4 : 2, end: (type_ == castleType.short) ? 6 : 4 },
            betweenPathCols: { start: (type_ == castleType.short) ? 5 : 1, end: (type_ == castleType.short) ? 6 : 3 }
        }
    }
}
