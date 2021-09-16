import { offsetsEnum } from './offsetsEnum';
import { fileIdxType, IField, rankIdxType } from './IField';
import { fieldOffset } from './fieldOffset';

export class Field implements IField {
    private _file: fileIdxType;
    private _rank: rankIdxType;
    constructor(file_: fileIdxType, rank_: rankIdxType) {
        this._file = file_;
        this._rank = rank_;
    }
    shift(offset_: offsetsEnum, factor: number = 1): Field {
        let fieldOffset = Field.offset(offset_);
        return new Field(this._file + fieldOffset.d_file * factor, this._rank + fieldOffset.d_rank * factor);
    }
    same(f: Field): boolean {
        return this._file == f._file && this._rank == f._rank;
    }
    sameI(file_: fileIdxType, rank_: rankIdxType): boolean {
        return this._file == file_ && this._rank == rank_;
    }
    isOnBoard(): boolean {
        return (this._file >= 0 && this._file < 8 && this._rank >= 0 && this._rank < 8);
    }
    fromFieldIdx(file_: fileIdxType, rank_: rankIdxType): Field {
        return new Field(file_, rank_);
    }

    get fileIdx(): fileIdxType { return this._file; }
    get rankIdx(): rankIdxType { return this._rank; }
    get notation(): string {
        return 'abcdefgh'.charAt(this._file) + '87654321'.charAt(this._rank);
    }
    static offset(offset_: offsetsEnum): fieldOffset {
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
    // fieldFromIdx(file/*col*/: fileType, rank/*row*/: rankType): Field {
    // }
    // fieldFrom(file/*col*/: fileNotationType, rank/*row*/: rankType): Field {
    // }
    isDiagonal(target: Field): offsetsEnum | undefined {
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

    isHorizontalVertical(target: Field): offsetsEnum | undefined {
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
