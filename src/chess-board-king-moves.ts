import { IChessBoardRepresentation, IField, pieceOnBoard } from './chess-board-representation'
import { Piece, pieceKind } from './chess-board-pieces'
import { color } from './chess-color'
import { offsetsEnum } from './chess-board-offsets'

export enum castleType {
    short,
    long
}

export type castleData = {
    castleType: castleType
    kingSource: IField
    kingTarget: IField
    rookSource: IField
    rookTarget: IField
    kingPiece: Piece
    rookPiece: Piece
    row: number
    kingPathCols: { start: number, end: number }
    betweenPathCols: { start: number, end: number }
}


export class CastleFlags {
    canCastleShortBlack: boolean
    canCastleLongBlack: boolean
    canCastleShortWhite: boolean
    canCastleLongWhite: boolean
    //    constructor(canCastleShortBlack_: boolean, canCastleLongBlack_: boolean, canCastleShortWhite_: boolean, canCastleLongWhite_: boolean) {
    constructor(castleFlags?: CastleFlags) {
        if (castleFlags) {
            this.canCastleShortBlack = castleFlags.canCastleShortBlack
            this.canCastleLongBlack = castleFlags.canCastleLongBlack
            this.canCastleShortWhite = castleFlags.canCastleShortWhite
            this.canCastleLongWhite = castleFlags.canCastleLongWhite
        }
        else {
            this.canCastleShortBlack = false
            this.canCastleLongBlack = false
            this.canCastleShortWhite = false
            this.canCastleLongWhite = false
        }
    }
    setFlags(canCastleShortBlack_: boolean, canCastleLongBlack_: boolean, canCastleShortWhite_: boolean, canCastleLongWhite_: boolean) {
        this.canCastleShortBlack = canCastleShortBlack_
        this.canCastleLongBlack = canCastleLongBlack_
        this.canCastleShortWhite = canCastleShortWhite_
        this.canCastleLongWhite = canCastleLongWhite_
    }
    set(castleFlags: CastleFlags) {
        this.canCastleShortBlack = castleFlags.canCastleShortBlack
        this.canCastleLongBlack = castleFlags.canCastleLongBlack
        this.canCastleShortWhite = castleFlags.canCastleShortWhite
        this.canCastleLongWhite = castleFlags.canCastleLongWhite
    }
    noCastle(color_: color) {
        switch (color_) {
            case color.black:
                this.canCastleShortBlack = false
                this.canCastleLongBlack = false
                break
            case color.white:
                this.canCastleShortWhite = false
                this.canCastleLongWhite = false
                break
        }
    }
    setCastleFlag(color_: color, type_: castleType, value: boolean) {
        switch (color_) {
            case color.black:
                switch (type_) {
                    case castleType.short:
                        this.canCastleShortBlack = value
                        break
                    case castleType.long:
                        this.canCastleLongBlack = value
                        break
                }
                break
            case color.white:
                switch (type_) {
                    case castleType.short:
                        this.canCastleShortWhite = value
                        break
                    case castleType.long:
                        this.canCastleLongWhite = value
                        break
                }
        }
    }
    getCastleFlag(color_: color, type_: castleType): boolean {
        switch (color_) {
            case color.black:
                switch (type_) {
                    case castleType.short:
                        return this.canCastleShortBlack
                    case castleType.long:
                        return this.canCastleLongBlack
                }
            case color.white:
                switch (type_) {
                    case castleType.short:
                        return this.canCastleShortWhite
                    case castleType.long:
                        return this.canCastleLongWhite
                }
        }
    }
    none(): boolean { return !this.canCastleShortBlack && !this.canCastleLongBlack && !this.canCastleShortWhite && !this.canCastleLongWhite }
}

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
