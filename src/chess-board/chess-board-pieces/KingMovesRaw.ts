import { IChessBoardRepresentation } from "../representation/IChessBoardRepresentation"
import { pieceOnBoard } from "../representation/pieceOnBoard"
import { IField } from "../representation/IField"
import { Piece, pieceKind } from './Piece'
import { color } from '../../chess-color'
import { offsetsEnum } from '../chess-board-offsets'
import { castleType, castleData, CastleFlags } from "./CastleFlags"

export class KingMovesRaw {
    static readonly CASTLE_SHORT_STR = 'O-O'
    static readonly CASTLE_LONG_STR = 'O-O-O'
    static readonly kingsTargetColCastleShort = 6
    static readonly kingsTargetColCastleLong = 2
    private static _castleDataMap = new Map<{ color: color, type: castleType }, castleData>()

    moves: IField[]

    constructor(startField: IField) {
        const offsetsKing = [
            offsetsEnum.NE, offsetsEnum.N, offsetsEnum.NW,
            offsetsEnum.E, offsetsEnum.W,
            offsetsEnum.SE, offsetsEnum.S, offsetsEnum.SW,
        ];
        this.moves = [];
        for (const off of offsetsKing) {
            let newField = startField.shift(off)
            if (newField.isOnBoard()) {
                this.moves.push(newField)
            }
        }
    }

    static castle(color_: color, type_: castleType, cbr: IChessBoardRepresentation): castleData {
        let result: castleData
        let result_cached = this._castleDataMap.get({ color: color_, type: type_ })
        if (result_cached) return result_cached

        let rowIdx_ = (color_ == color.black) ? 0 : 7
        result = {
            castleType: type_,
            kingSource: cbr.field((type_ == castleType.short) ? 4 : 4, rowIdx_),
            kingTarget: cbr.field((type_ == castleType.short) ? KingMovesRaw.kingsTargetColCastleShort : KingMovesRaw.kingsTargetColCastleLong, rowIdx_),
            rookSource: cbr.field((type_ == castleType.short) ? 7 : 0, rowIdx_),
            rookTarget: cbr.field((type_ == castleType.short) ? 5 : 3, rowIdx_),
            kingPiece: (color_ == color.black) ? Piece.blackKing() : Piece.whiteKing(),
            rookPiece: (color_ == color.black) ? Piece.blackRook() : Piece.whiteRook(),
            row: rowIdx_,
            kingPathCols: { start: (type_ == castleType.short) ? 4 : 2, end: (type_ == castleType.short) ? 6 : 4 },
            betweenPathCols: { start: (type_ == castleType.short) ? 5 : 1, end: (type_ == castleType.short) ? 6 : 3 }
        }
        this._castleDataMap.set({ color: color_, type: type_ }, result)
        return result
    }

    static isMoveCastle(sourcePieceOB: pieceOnBoard, target: IField, cbr: IChessBoardRepresentation): castleData | undefined {
        if (sourcePieceOB.piece.kind != pieceKind.King) return undefined

        let short = this.castle(sourcePieceOB.piece.color, castleType.short, cbr)
        if (short.kingSource.same(sourcePieceOB.field) && short.kingTarget.same(target)) return short

        let long = this.castle(sourcePieceOB.piece.color, castleType.long, cbr)
        if (long.kingSource.same(sourcePieceOB.field) && long.kingTarget.same(target)) return long

        return undefined
    }

    static adjustCastleRightsAfterCapture(capturedPieceOB: pieceOnBoard, castleFlags_: CastleFlags, cbr: IChessBoardRepresentation) {
        if (capturedPieceOB.piece.kind == pieceKind.Rook) {
            let color = capturedPieceOB.piece.color
            if (castleFlags_.getCastleFlag(color, castleType.short)) {
                let short = this.castle(color, castleType.short, cbr)
                if (short.rookSource.same(capturedPieceOB.field)) {
                    castleFlags_.setCastleFlag(color, short.castleType, false)
                }
            }
            if (castleFlags_.getCastleFlag(color, castleType.long)) {
                let long = this.castle(color, castleType.long, cbr)
                if (long.rookSource.same(capturedPieceOB.field)) {
                    castleFlags_.setCastleFlag(color, long.castleType, false)
                }
            }
        }
    }
    static adjustCastleRightsAfterMove(sourcePieceOB: pieceOnBoard, castleFlags_: CastleFlags, cbr: IChessBoardRepresentation) {
        if (sourcePieceOB.piece.kind == pieceKind.Rook) {
            let color = sourcePieceOB.piece.color
            if (castleFlags_.getCastleFlag(color, castleType.short)) {
                let short = this.castle(color, castleType.short, cbr)
                if (short.rookSource.same(sourcePieceOB.field)) {
                    castleFlags_.setCastleFlag(color, short.castleType, false)
                }
            }
            if (castleFlags_.getCastleFlag(color, castleType.long)) {
                let long = this.castle(color, castleType.long, cbr)
                if (long.rookSource.same(sourcePieceOB.field)) {
                    castleFlags_.setCastleFlag(color, long.castleType, false)
                }
            }
        }
        else if (sourcePieceOB.piece.kind == pieceKind.King) {
            castleFlags_.noCastle(sourcePieceOB.piece.color)
        }
    }

}
