import { offsetsEnum } from './offsetsEnum';



export type fileType = string // a..h
export type rankType = number // 1..8
export type fieldNType = { file: fileType, rank: rankType }
export type fileIdxType = number // 0:a..7:h 
export type rankIdxType = number // 0:8..7:1
export type fieldIdxType = { fileIdx: fileIdxType, rankIdx: rankIdxType }
export type field063IdxType = number // 0:a8..63:h1
export type fieldNotationType = string // 'a1' .. 'h8'

export interface IField {
    get file(): fileType
    get rank(): rankType
    get fieldN(): fieldNType
    get notation(): fieldNotationType
    get fileIdx(): fileIdxType
    get rankIdx(): rankIdxType
    get fieldIdx(): fieldIdxType
    get field063Idx(): field063IdxType
    get isOnBoard(): boolean
    same(cf: IField): boolean
    sameFR(file: fileType, rank: rankType): boolean
    sameN(field: fieldNType): boolean
    sameNotation(str: fieldNotationType): boolean
    sameI(fileIdx: fileIdxType, rankIdx: rankIdxType): boolean
    sameIdx(field: fieldIdxType): boolean
    same063I(fieldIdx: field063IdxType): boolean

    shift(offset: offsetsEnum, factor?: number): IField
    isDiagonal(target: IField): offsetsEnum | undefined
    isHorizontalVertical(target: IField): offsetsEnum | undefined
}

// TODO complete list of validation for each type
//export function validateFileType
export function validateFieldNotation(field: fieldNotationType): boolean {
    if (field.length != 2) return false
    if ('abcdefgh'.indexOf(field[0]) == -1) return false
    if ('12345678'.indexOf(field[1]) == -1) return false
    return true
}


/*
export interface IField {
    fromFieldIdx(file_: fileIdxType, rank_: rankIdxType): IField

    get notation(): string
    get fileIdx(): fileIdxType
    get rankIdx(): rankIdxType

    same(f: IField): boolean
    sameI(file_: fileIdxType, rank_: rankIdxType): boolean

    isOnBoard(): boolean
    shift(offset: offsetsEnum, factor?: number): IField
    isDiagonal(target: IField): offsetsEnum | undefined
    isHorizontalVertical(target: IField): offsetsEnum | undefined
}
*/