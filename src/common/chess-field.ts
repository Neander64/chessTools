export type fileType = string; // a..h
export type rankType = number; // 1..8
export type fileIdxType = number; // 0:a..7:h 
export type rankIdxType = number; // 0:8..7:1
export type fieldIdx = number // 0:a8..63:h1

export class CommonField {
    file?: fileType
    rank?: rankType
    constructor(file?: fileType, rank?: rankType) {
        if (file && (file < 'a' || file > 'h')) throw new Error('out of range')
        if (typeof rank != 'undefined' && (rank < 1 || rank > 8)) throw new Error('out of range')
        this.file = file
        this.rank = rank
    }
    static fromNotation(str: string): CommonField {
        return new CommonField(str.charAt(0), parseInt(str[1], 10))
    }
    static fromIdx(fileIdx: fileIdxType, rankIdx: rankIdxType) {
        let file = 'abcdefgh'[fileIdx]
        if (typeof file == 'undefined') throw new Error('out of range')
        return new CommonField(file, 8 - rankIdx)
    }
    static fromFieldIdx(fieldIdx: fileIdxType) {
        let fileIdx = fieldIdx % 8
        let rankIdx = Math.floor(fieldIdx / 8)
        return CommonField.fromIdx(fileIdx, rankIdx)
    }
    get notation(): string {
        if (!this.file || !this.rank) throw new Error('Field values not set')
        return this.file[0] + this.rank;
    }
    get fileIdx(): fileIdxType {
        if (!this.file || !this.rank) throw new Error('Field values not set')
        return this.file!.charCodeAt(0) - 'a'.charCodeAt(0)
    }
    get rankIdx(): rankIdxType {
        if (!this.file || !this.rank) throw new Error('Field values not set')
        return 8 - this.rank!;
    }
    get fieldIdx(): fieldIdx {
        if (!this.file || !this.rank) throw new Error('Field values not set')
        return this.rankIdx * 8 + this.fileIdx
    }
}
