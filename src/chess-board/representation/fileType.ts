import { offsetsEnum } from '../chess-board-offsets';
import { IField } from './IField';
import { fieldOffsetN } from './fieldOffsetN';


export type fileType = number;
export type fileNotationType = string;
export type rankType = number;

export class Field implements IField {
    private _file: fileType;
    private _rank: rankType;
    constructor(file_: fileType, rank_: rankType) {
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
    sameI(file_: fileType, rank_: rankType): boolean {
        return this._file == file_ && this._rank == rank_;
    }
    isOnBoard(): boolean {
        return (this._file >= 0 && this._file < 8 && this._rank >= 0 && this._rank < 8);
    }
    createField(file_: fileType, rank_: rankType): Field {
        return new Field(file_, rank_);
    }

    get file(): fileType { return this._file; }
    get rank(): rankType { return this._rank; }
    get notation(): string {
        return 'abcdefgh'.charAt(this._file) + '87654321'.charAt(this._rank);
    }
    static offset(offset_: offsetsEnum): fieldOffsetN {
        const mapOffsets: Map<offsetsEnum, fieldOffsetN> = new Map([
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
        if (Math.abs(this.rank - target.rank) == Math.abs(this.file - target.file)) {
            if (this.file > target.file) {
                if (this.rank > target.rank) // - -
                    return offsetsEnum.NW;
                else // - +
                    return offsetsEnum.SW;
            }
            else {
                if (this.rank > target.rank) // + -
                    return offsetsEnum.NE;
                else // + +
                    return offsetsEnum.SE;
            }
        }
        return undefined;
    }

    isHorizontalVertical(target: Field): offsetsEnum | undefined {
        if ((this.rank == target.rank) || (this.file == target.file)) {
            if (this.file == target.file) {
                if (this.rank < target.rank)
                    return offsetsEnum.S; // 0 +

                else
                    return offsetsEnum.N; // 0 -
            }
            else { // source.rowIdx == target.rowIdx
                if (this.file < target.file)
                    return offsetsEnum.E; // + 0

                else
                    return offsetsEnum.W; // - 0
            }
        }
        return undefined;
    }
}
