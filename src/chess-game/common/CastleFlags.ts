import { IField } from "./IField"
import { Piece } from './Piece'
import { color } from './chess-color'


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
    kingPathCols: { start: number; end: number }
    betweenPathCols: { start: number; end: number }
}

export class CastleFlags {
    private _castleFlags: number
    static readonly SHORT_BLACK = 0b0001
    static readonly LONG_BLACK = 0b0010
    static readonly SHORT_WHITE = 0b0100
    static readonly LONG_WHITE = 0b1000
    static readonly FULL_MASK = 0b1111
    get canCastleShortBlack(): boolean { return (this._castleFlags & CastleFlags.SHORT_BLACK) == CastleFlags.SHORT_BLACK }
    get canCastleLongBlack(): boolean { return (this._castleFlags & CastleFlags.LONG_BLACK) == CastleFlags.LONG_BLACK }
    get canCastleShortWhite(): boolean { return (this._castleFlags & CastleFlags.SHORT_WHITE) == CastleFlags.SHORT_WHITE }
    get canCastleLongWhite(): boolean { return (this._castleFlags & CastleFlags.LONG_WHITE) == CastleFlags.LONG_WHITE }
    set canCastleShortBlack(flag: boolean) { if (flag) this._castleFlags |= CastleFlags.SHORT_BLACK; else this._castleFlags &= (CastleFlags.FULL_MASK ^ CastleFlags.SHORT_BLACK) }
    set canCastleLongBlack(flag: boolean) { if (flag) this._castleFlags |= CastleFlags.LONG_BLACK; else this._castleFlags &= (CastleFlags.FULL_MASK ^ CastleFlags.LONG_BLACK) }
    set canCastleShortWhite(flag: boolean) { if (flag) this._castleFlags |= CastleFlags.SHORT_WHITE; else this._castleFlags &= (CastleFlags.FULL_MASK ^ CastleFlags.SHORT_WHITE) }
    set canCastleLongWhite(flag: boolean) { if (flag) this._castleFlags |= CastleFlags.LONG_WHITE; else this._castleFlags &= (CastleFlags.FULL_MASK ^ CastleFlags.LONG_WHITE) }

    constructor(castleFlags?: CastleFlags) {
        if (castleFlags) {
            this._castleFlags = castleFlags._castleFlags
        }
        else {
            this._castleFlags = CastleFlags.FULL_MASK
        }
    }
    setAll(value: boolean) {
        this._castleFlags = value ? CastleFlags.FULL_MASK : 0
    }
    setFlags(canCastleShortBlack_: boolean, canCastleLongBlack_: boolean, canCastleShortWhite_: boolean, canCastleLongWhite_: boolean) {
        this.canCastleShortBlack = canCastleShortBlack_
        this.canCastleLongBlack = canCastleLongBlack_
        this.canCastleShortWhite = canCastleShortWhite_
        this.canCastleLongWhite = canCastleLongWhite_
    }
    set(castleFlags: CastleFlags) {
        this._castleFlags = castleFlags._castleFlags
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
    get hasNoCastleOption(): boolean { return this._castleFlags == 0 }
}
