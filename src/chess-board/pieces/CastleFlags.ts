import { IField } from "../representation/IField";
import { Piece } from './Piece';
import { color } from '../../common/chess-color';


export enum castleType {
    short,
    long
}

export type castleData = {
    castleType: castleType;
    kingSource: IField;
    kingTarget: IField;
    rookSource: IField;
    rookTarget: IField;
    kingPiece: Piece;
    rookPiece: Piece;
    row: number;
    kingPathCols: { start: number; end: number; };
    betweenPathCols: { start: number; end: number; };
};


export class CastleFlags {
    canCastleShortBlack: boolean;
    canCastleLongBlack: boolean;
    canCastleShortWhite: boolean;
    canCastleLongWhite: boolean;
    //    constructor(canCastleShortBlack_: boolean, canCastleLongBlack_: boolean, canCastleShortWhite_: boolean, canCastleLongWhite_: boolean) {
    constructor(castleFlags?: CastleFlags) {
        if (castleFlags) {
            this.canCastleShortBlack = castleFlags.canCastleShortBlack;
            this.canCastleLongBlack = castleFlags.canCastleLongBlack;
            this.canCastleShortWhite = castleFlags.canCastleShortWhite;
            this.canCastleLongWhite = castleFlags.canCastleLongWhite;
        }
        else {
            this.canCastleShortBlack = false;
            this.canCastleLongBlack = false;
            this.canCastleShortWhite = false;
            this.canCastleLongWhite = false;
        }
    }
    setFlags(canCastleShortBlack_: boolean, canCastleLongBlack_: boolean, canCastleShortWhite_: boolean, canCastleLongWhite_: boolean) {
        this.canCastleShortBlack = canCastleShortBlack_;
        this.canCastleLongBlack = canCastleLongBlack_;
        this.canCastleShortWhite = canCastleShortWhite_;
        this.canCastleLongWhite = canCastleLongWhite_;
    }
    set(castleFlags: CastleFlags) {
        this.canCastleShortBlack = castleFlags.canCastleShortBlack;
        this.canCastleLongBlack = castleFlags.canCastleLongBlack;
        this.canCastleShortWhite = castleFlags.canCastleShortWhite;
        this.canCastleLongWhite = castleFlags.canCastleLongWhite;
    }
    noCastle(color_: color) {
        switch (color_) {
            case color.black:
                this.canCastleShortBlack = false;
                this.canCastleLongBlack = false;
                break;
            case color.white:
                this.canCastleShortWhite = false;
                this.canCastleLongWhite = false;
                break;
        }
    }
    setCastleFlag(color_: color, type_: castleType, value: boolean) {
        switch (color_) {
            case color.black:
                switch (type_) {
                    case castleType.short:
                        this.canCastleShortBlack = value;
                        break;
                    case castleType.long:
                        this.canCastleLongBlack = value;
                        break;
                }
                break;
            case color.white:
                switch (type_) {
                    case castleType.short:
                        this.canCastleShortWhite = value;
                        break;
                    case castleType.long:
                        this.canCastleLongWhite = value;
                        break;
                }
        }
    }
    getCastleFlag(color_: color, type_: castleType): boolean {
        switch (color_) {
            case color.black:
                switch (type_) {
                    case castleType.short:
                        return this.canCastleShortBlack;
                    case castleType.long:
                        return this.canCastleLongBlack;
                }
            case color.white:
                switch (type_) {
                    case castleType.short:
                        return this.canCastleShortWhite;
                    case castleType.long:
                        return this.canCastleLongWhite;
                }
        }
    }
    none(): boolean { return !this.canCastleShortBlack && !this.canCastleLongBlack && !this.canCastleShortWhite && !this.canCastleLongWhite; }
}
