import { Piece } from './chess-board-pieces'

//TODO decouple from implementation
// TODO mapping to Notation
export type boardFieldIdx = {
    colIdx: number,
    rowIdx: number
}

export function sameFields(f1: boardFieldIdx, f2: boardFieldIdx): boolean {
    return f1.colIdx == f2.colIdx && f1.rowIdx == f2.rowIdx
}

export function fieldIdx(colIdx_: number, rowIdx_: number): boardFieldIdx {
    return { colIdx: colIdx_, rowIdx: rowIdx_ }
}

export type fieldOffset = {
    dCol: number,
    dRow: number
}

export const offsets = {
    N: { dCol: 0, dRow: -1 },
    W: { dCol: -1, dRow: 0 },
    S: { dCol: 0, dRow: 1 },
    E: { dCol: 1, dRow: 0 },
    NW: { dCol: -1, dRow: -1 },
    SW: { dCol: -1, dRow: 1 },
    SE: { dCol: 1, dRow: 1 },
    NE: { dCol: 1, dRow: -1 },
    //--- Knight moves
    NNE: { dCol: 1, dRow: -2 },
    NNW: { dCol: -1, dRow: -2 },
    SSE: { dCol: 1, dRow: 2 },
    SSW: { dCol: -1, dRow: 2 },
    WWN: { dCol: -2, dRow: -1 },
    WWS: { dCol: -2, dRow: 1 },
    EEN: { dCol: 2, dRow: -1 },
    EES: { dCol: 2, dRow: 1 },
}

export function shiftField(field: boardFieldIdx, offset: fieldOffset, factor: number = 1): boardFieldIdx {
    return { colIdx: field.colIdx + offset.dCol * factor, rowIdx: field.rowIdx + offset.dRow * factor }
}

export type pieceOnBoard = {
    piece: Piece,
    field: boardFieldIdx
};