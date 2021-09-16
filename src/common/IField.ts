import { offsetsEnum } from './offsetsEnum';
// TODO Obsolete ?
export type fileIdxType = number
export type fileNotationType = string
export type rankIdxType = number

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
