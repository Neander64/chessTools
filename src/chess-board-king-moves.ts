import { boardFieldIdx, sameFields } from './chess-board-internal-types'
import { IField, pieceOnBoard } from './chess-board-representation'
import { Piece, pieceKind } from './chess-board-pieces'
import { color } from './chess-color'
import { offsetsEnum } from './chess-board-offsets'

export enum castleType {
    short,
    long
}

export type castleData = {
    castleType: castleType
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

    static castle(color_: color, type_: castleType): castleData {
        let rowIdx_ = (color_ == color.black) ? 0 : 7
        // TODO make this use static data
        return {
            castleType: type_,
            kingSource: { colIdx: (type_ == castleType.short) ? 4 : 4, rowIdx: rowIdx_ },
            kingTarget: { colIdx: (type_ == castleType.short) ? KingMovesRaw.kingsTargetColCastleShort : KingMovesRaw.kingsTargetColCastleLong, rowIdx: rowIdx_ },
            rookSource: { colIdx: (type_ == castleType.short) ? 7 : 0, rowIdx: rowIdx_ },
            rookTarget: { colIdx: (type_ == castleType.short) ? 5 : 3, rowIdx: rowIdx_ },
            kingPiece: (color_ == color.black) ? Piece.blackKing() : Piece.whiteKing(),
            rookPiece: (color_ == color.black) ? Piece.blackRook() : Piece.whiteRook(),
            row: rowIdx_,
            kingPathCols: { start: (type_ == castleType.short) ? 4 : 2, end: (type_ == castleType.short) ? 6 : 4 },
            betweenPathCols: { start: (type_ == castleType.short) ? 5 : 1, end: (type_ == castleType.short) ? 6 : 3 }
        }
    }

    static isMoveCastle(sourcePieceOB: pieceOnBoard, target: IField): castleData | undefined {
        if (sourcePieceOB.piece.kind != pieceKind.King) return undefined

        let short = this.castle(sourcePieceOB.piece.color, castleType.short)
        if (sameFields(short.kingSource, sourcePieceOB.field.boardFieldIdx()) && sameFields(short.kingTarget, target.boardFieldIdx())) return short

        let long = this.castle(sourcePieceOB.piece.color, castleType.long)
        if (sameFields(long.kingSource, sourcePieceOB.field.boardFieldIdx()) && sameFields(long.kingTarget, target.boardFieldIdx())) return long

        return undefined
    }

    static adjustCastleRightsAfterCapture(capturedPieceOB: pieceOnBoard, castleFlags_: CastleFlags) {
        if (capturedPieceOB.piece.kind == pieceKind.Rook) {
            let color = capturedPieceOB.piece.color
            if (castleFlags_.getCastleFlag(color, castleType.short)) {
                let short = this.castle(color, castleType.short)
                if (sameFields(short.rookSource, capturedPieceOB.field.boardFieldIdx())) {
                    castleFlags_.setCastleFlag(color, short.castleType, false)
                }
            }
            if (castleFlags_.getCastleFlag(color, castleType.long)) {
                let long = this.castle(color, castleType.long)
                if (sameFields(long.rookSource, capturedPieceOB.field.boardFieldIdx())) {
                    castleFlags_.setCastleFlag(color, long.castleType, false)
                }
            }
        }
    }
    static adjustCastleRightsAfterMove(sourcePieceOB: pieceOnBoard, castleFlags_: CastleFlags) {
        if (sourcePieceOB.piece.kind == pieceKind.Rook) {
            let color = sourcePieceOB.piece.color
            if (castleFlags_.getCastleFlag(color, castleType.short)) {
                let short = this.castle(color, castleType.short)
                if (sameFields(short.rookSource, sourcePieceOB.field.boardFieldIdx())) {
                    castleFlags_.setCastleFlag(color, short.castleType, false)
                }
            }
            if (castleFlags_.getCastleFlag(color, castleType.long)) {
                let long = this.castle(color, castleType.long)
                if (sameFields(long.rookSource, sourcePieceOB.field.boardFieldIdx())) {
                    castleFlags_.setCastleFlag(color, long.castleType, false)
                }
            }
        }
        else if (sourcePieceOB.piece.kind == pieceKind.King) {
            castleFlags_.noCastle(sourcePieceOB.piece.color)
        }
    }

}
