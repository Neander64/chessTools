import { fieldOffset } from "./fieldOffset"
import { offsetsEnum } from "./offsetsEnum"

export type fileType = string // a..h
export type rankType = number // 1..8
export type fieldNType = { file: fileType, rank: rankType }
export type fileIdxType = number // 0:a..7:h 
export type rankIdxType = number // 0:8..7:1
export type fieldIdxType = { fileIdx: fileIdxType, rankIdx: rankIdxType }
export type field063IdxType = number // 0:a8..63:h1
export type fieldNotationType = string // 'a1' .. 'h8'

export interface ICommonField {
    get file(): fileType
    get rank(): rankType
    get fieldN(): fieldNType
    get notation(): fieldNotationType
    get fileIdx(): fileIdxType
    get rankIdx(): rankIdxType
    get fieldIdx(): fieldIdxType
    get field063Idx(): field063IdxType
    get isOnBoard(): boolean
    same(cf: ICommonField): boolean
    sameFR(file: fileType, rank: rankType): boolean
    sameN(field: fieldNType): boolean
    sameNotation(str: fieldNotationType): boolean
    sameI(fileIdx: fileIdxType, rankIdx: rankIdxType): boolean
    sameIdx(field: fieldIdxType): boolean
    same063I(fieldIdx: field063IdxType): boolean

    shift(offset: offsetsEnum, factor?: number): ICommonField
    isDiagonal(target: ICommonField): offsetsEnum | undefined
    isHorizontalVertical(target: ICommonField): offsetsEnum | undefined
}
function offset(offset_: offsetsEnum): fieldOffset {
    const mapOffsets: Map<offsetsEnum, fieldOffset> = new Map([
        [offsetsEnum.N, { d_file: 0, d_rank: -1 }],
        [offsetsEnum.W, { d_file: -1, d_rank: 0 }],
        [offsetsEnum.S, { d_file: 0, d_rank: 1 }],
        [offsetsEnum.E, { d_file: 1, d_rank: 0 }],
        [offsetsEnum.NW, { d_file: -1, d_rank: -1 }],
        [offsetsEnum.SW, { d_file: -1, d_rank: 1 }],
        [offsetsEnum.SE, { d_file: 1, d_rank: 1 }],
        [offsetsEnum.NE, { d_file: 1, d_rank: -1 }],

        [offsetsEnum.NNE, { d_file: 1, d_rank: -2 }],
        [offsetsEnum.NNW, { d_file: -1, d_rank: -2 }],
        [offsetsEnum.SSE, { d_file: 1, d_rank: 2 }],
        [offsetsEnum.SSW, { d_file: -1, d_rank: 2 }],
        [offsetsEnum.WWN, { d_file: -2, d_rank: -1 }],
        [offsetsEnum.WWS, { d_file: -2, d_rank: 1 }],
        [offsetsEnum.EEN, { d_file: 2, d_rank: -1 }],
        [offsetsEnum.EES, { d_file: 2, d_rank: 1 }],
        [offsetsEnum.none, { d_file: 0, d_rank: 0 }],
    ]);
    return mapOffsets.get(offset_) || { d_file: 0, d_rank: 0 };
}

export class CommonField implements ICommonField {
    // CommonField specifies a Field 
    // it handles various transformation to different representations of a field
    // here i use fieldIdx values
    // dependent on the implementation of a board representation it might be more 
    // performant to have another internal representations and avoid some transformations/mappings
    // I'll use an interface to abstract the implementation, 
    // yet I'll use the CommonField implementation specifically whith-in this project

    // We allow to create with invalid values, for the sake of simpler calculations
    // If invalid the isOnBoard() property tells you
    // Only if you try to access values they must be valid
    private _fileIdx?: fileIdxType
    private _rankIdx?: rankIdxType

    constructor(fileIdx_?: fileIdxType, rankIdx_?: rankIdxType) {
        this._fileIdx = fileIdx_
        this._rankIdx = rankIdx_
        //if (!this.isOnBoard) throw new Error('out of range')
    }
    static fromFR(file: fileType, rank: rankType): CommonField {
        return new CommonField(file.charCodeAt(0) - 'a'.charCodeAt(0), 8 - rank)
    }
    static fromN(field: fieldNType): CommonField {
        return new CommonField(field.file.charCodeAt(0) - 'a'.charCodeAt(0), 8 - field.rank)
    }
    static fromNotation(str: fieldNotationType): CommonField {
        return new CommonField(str.charCodeAt(0) - 'a'.charCodeAt(0), 8 - parseInt(str[1], 10))
    }
    static fromI(fileIdx: fileIdxType, rankIdx: rankIdxType): CommonField {
        //if (typeof file == 'undefined') throw new Error('out of range')
        return new CommonField(fileIdx, rankIdx)
    }
    static fromFieldIdx(field: fieldIdxType): CommonField {
        let file = 'abcdefgh'[field.fileIdx]
        //if (typeof file == 'undefined') throw new Error('out of range')
        return new CommonField(field.fileIdx, field.rankIdx)
    }
    static fromField063Idx(fieldIdx: field063IdxType): CommonField {
        let fileIdx = fieldIdx % 8
        let rankIdx = Math.floor(fieldIdx / 8)
        return this.fromI(fileIdx, rankIdx)
    }

    shift(offset_: offsetsEnum, factor: number = 1): CommonField {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        let fieldOffset = offset(offset_);
        return new CommonField(this._fileIdx! + fieldOffset.d_file * factor, this._rankIdx! + fieldOffset.d_rank * factor);
    }

    get file(): fileType {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        return 'abcdefgh'[this._fileIdx!]
    }
    get rank(): rankType {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        return 8 - this._rankIdx!
    }
    get fieldN(): fieldNType {
        return { file: this.file, rank: this.rank }
    }
    get notation(): fieldNotationType {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        return this.file + this.rank
    }
    get fileIdx(): fileIdxType {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        return this._fileIdx!
    }
    get rankIdx(): rankIdxType {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        return this._rankIdx!
    }
    get fieldIdx(): fieldIdxType {
        return { fileIdx: this.fileIdx, rankIdx: this.rankIdx }
    }
    get field063Idx(): field063IdxType {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        return this._rankIdx! * 8 + this._fileIdx!
    }
    get isOnBoard(): boolean {
        if (typeof this._fileIdx == 'undefined' || this._fileIdx < 0 || this._fileIdx > 7) return false
        if (typeof this._rankIdx == 'undefined' || this._rankIdx < 0 || this._rankIdx > 7) return false
        return true
    }

    same(cf: CommonField): boolean {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        return this._fileIdx == cf._fileIdx && this._rankIdx == cf._rankIdx
    }
    sameFR(file: fileType, rank: rankType): boolean {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        return this.file == file && this.rank == rank
    }
    sameN(field: fieldNType): boolean {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        let fieldN = this.fieldN
        return fieldN.file == field.file && fieldN.rank == field.rank
    }
    sameNotation(str: fieldNotationType): boolean {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        return str == this.notation
    }
    sameI(fileIdx: fileIdxType, rankIdx: rankIdxType): boolean {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        return fileIdx == this.fileIdx && rankIdx == this.rankIdx
    }
    sameIdx(field: fieldIdxType): boolean {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        let fieldIdx = this.fieldIdx
        return fieldIdx.fileIdx == field.fileIdx && fieldIdx.rankIdx == field.rankIdx
    }
    same063I(fieldIdx: field063IdxType): boolean {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        return fieldIdx == this.field063Idx
    }

    isDiagonal(target: CommonField): offsetsEnum | undefined {
        if (Math.abs(this.rankIdx - target.rankIdx) == Math.abs(this.fileIdx - target.fileIdx)) {
            if (this.fileIdx > target.fileIdx) {
                if (this.rankIdx > target.rankIdx) // - -
                    return offsetsEnum.NW;
                else // - +
                    return offsetsEnum.SW;
            }
            else {
                if (this.rankIdx > target.rankIdx) // + -
                    return offsetsEnum.NE;
                else // + +
                    return offsetsEnum.SE;
            }
        }
        return undefined;
    }

    isHorizontalVertical(target: CommonField): offsetsEnum | undefined {
        if ((this.rankIdx == target.rankIdx) || (this.fileIdx == target.fileIdx)) {
            if (this.fileIdx == target.fileIdx) {
                if (this.rankIdx < target.rankIdx)
                    return offsetsEnum.S; // 0 +

                else
                    return offsetsEnum.N; // 0 -
            }
            else { // source.rowIdx == target.rowIdx
                if (this.fileIdx < target.fileIdx)
                    return offsetsEnum.E; // + 0

                else
                    return offsetsEnum.W; // - 0
            }
        }
        return undefined;
    }
}


export class CommonFieldFR implements ICommonField {
    // CommonField specifies a Field 
    // it handles various transformation to different representations of a field
    // here i use chess notation type to use internal representation
    // dependent on the implementation of a board representation it might be more 
    // performant to have another internal representations and avoid some transformations/mappings
    // I'll use an interface to abstract the implementation, 
    // yet I'll use the CommonField implementation specifically whith-in this project

    // We allow to create with invalid values, for the sake of simpler calculations
    // If invalid the isOnBoard() property tells you
    // Only if you try to access values they must be valid
    private _file?: fileType
    private _rank?: rankType

    constructor(file_?: fileType, rank_?: rankType) {
        this._file = file_
        this._rank = rank_
        //if (!this.isOnBoard) throw new Error('out of range')
    }
    static fromNotation(str: fieldNotationType): CommonFieldFR {
        return new CommonFieldFR(str.charAt(0), parseInt(str[1], 10))
    }
    static fromFieldIdx(fileIdx: fileIdxType, rankIdx: rankIdxType): CommonFieldFR {
        let file = 'abcdefgh'[fileIdx]
        //if (typeof file == 'undefined') throw new Error('out of range')
        return new CommonFieldFR(file, 8 - rankIdx)
    }
    static fromField063Idx(fieldIdx: field063IdxType): CommonFieldFR {
        let fileIdx = fieldIdx % 8
        let rankIdx = Math.floor(fieldIdx / 8)
        return this.fromFieldIdx(fileIdx, rankIdx)
    }
    shift(offset_: offsetsEnum, factor: number = 1): CommonFieldFR {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        let fieldOffset = offset(offset_);
        return CommonFieldFR.fromFieldIdx(this.fileIdx! + fieldOffset.d_file * factor, this.rankIdx! + fieldOffset.d_rank * factor);
    }

    get file(): fileType {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        return this._file!
    }
    get rank(): rankType {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        return this._rank!
    }
    get fieldN(): fieldNType {
        return { file: this.file, rank: this.rank }
    }
    get notation(): fieldNotationType {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        return this._file![0] + this._rank
    }
    get fileIdx(): fileIdxType {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        return this._file!.charCodeAt(0) - 'a'.charCodeAt(0)
    }
    get rankIdx(): rankIdxType {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        return 8 - this._rank!
    }
    get fieldIdx(): fieldIdxType {
        return { fileIdx: this.fileIdx, rankIdx: this.rankIdx }
    }
    get field063Idx(): field063IdxType {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        return this.rankIdx * 8 + this.fileIdx
    }
    get isOnBoard(): boolean {
        if (typeof this._file == 'undefined' || this._file < 'a' || this._file > 'h') return false
        if (typeof this._rank == 'undefined' || this._rank < 1 || this._rank > 8) return false
        return true
    }

    same(cf: CommonFieldFR): boolean {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        return this._file == cf._file && this._rank == cf._rank
    }
    sameFR(file: fileType, rank: rankType): boolean {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        return this._file == file && this._rank == rank
    }
    sameN(field: fieldNType): boolean {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        let fieldN = this.fieldN
        return fieldN.file == field.file && fieldN.rank == field.rank
    }
    sameNotation(str: fieldNotationType): boolean {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        return str == this.notation
    }
    sameI(fileIdx: fileIdxType, rankIdx: rankIdxType): boolean {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        return fileIdx == this.fileIdx && rankIdx == this.rankIdx
    }
    sameIdx(field: fieldIdxType): boolean {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        let fieldIdx = this.fieldIdx
        return fieldIdx.fileIdx == field.fileIdx && fieldIdx.rankIdx == field.rankIdx
    }
    same063I(fieldIdx: field063IdxType): boolean {
        if (!this.isOnBoard) throw new Error('Field values not on Board')
        return fieldIdx == this.field063Idx
    }


    isDiagonal(target: CommonField): offsetsEnum | undefined {
        if (Math.abs(this.rankIdx - target.rankIdx) == Math.abs(this.fileIdx - target.fileIdx)) {
            if (this.fileIdx > target.fileIdx) {
                if (this.rankIdx > target.rankIdx) // - -
                    return offsetsEnum.NW;
                else // - +
                    return offsetsEnum.SW;
            }
            else {
                if (this.rankIdx > target.rankIdx) // + -
                    return offsetsEnum.NE;
                else // + +
                    return offsetsEnum.SE;
            }
        }
        return undefined;
    }

    isHorizontalVertical(target: CommonField): offsetsEnum | undefined {
        if ((this.rankIdx == target.rankIdx) || (this.fileIdx == target.fileIdx)) {
            if (this.fileIdx == target.fileIdx) {
                if (this.rankIdx < target.rankIdx)
                    return offsetsEnum.S; // 0 +

                else
                    return offsetsEnum.N; // 0 -
            }
            else { // source.rowIdx == target.rowIdx
                if (this.fileIdx < target.fileIdx)
                    return offsetsEnum.E; // + 0

                else
                    return offsetsEnum.W; // - 0
            }
        }
        return undefined;
    }
}
