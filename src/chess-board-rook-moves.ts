import { boardFieldIdx, fieldOffset, offsets, shiftField } from './chess-board-internal-types'
import { IChessBoardRepresentation, IField, Field, offsetsEnum } from './chess-board-representation'


export const enum rookRay {
    W = offsetsEnum.W,
    E = offsetsEnum.E,
    S = offsetsEnum.S,
    N = offsetsEnum.N,
}

export class RookMovesRaw {

    moves_W: IField[]
    moves_E: IField[]
    moves_S: IField[]
    moves_N: IField[]

    static readonly rays = [rookRay.W, rookRay.E, rookRay.S, rookRay.N]

    constructor(startField: IField) {
        this.moves_W = this.generateRay(startField, offsetsEnum.W)
        this.moves_E = this.generateRay(startField, offsetsEnum.E)
        this.moves_S = this.generateRay(startField, offsetsEnum.S)
        this.moves_N = this.generateRay(startField, offsetsEnum.N)

    }
    private generateRay(startField: IField, offset: offsetsEnum): IField[] {
        let moves: IField[] = []
        for (let i = 1; i < 8; i++) {
            let newField = startField.shift(offset, i)
            if (newField.isOnBoard()) {
                moves.push(newField)
            }
            else break
        }
        return moves
    }
    getRay(ray: rookRay): IField[] {
        switch (ray) {
            case rookRay.W: return this.moves_W
            case rookRay.E: return this.moves_E
            case rookRay.S: return this.moves_S
            case rookRay.N: return this.moves_N
        }
        return []; // unreachable
    }
}
/* optional experimental implementation with iterator
export class RookRayIt implements IterableIterator<boardFieldIdx> {
    private _startField: boardFieldIdx;
    private _curOffset: { colOffset: number, rowOffset: number };
    private _offset: { colOffset: number, rowOffset: number };

    constructor(startField: boardFieldIdx, ray: rookRay) {
        this._startField = startField;
        switch (ray) {
            case rookRay.ray1: this._offset = { colOffset: 1, rowOffset: 0 }; break;
            case rookRay.ray2: this._offset = { colOffset: -1, rowOffset: 0 }; break;
            case rookRay.ray3: this._offset = { colOffset: 0, rowOffset: 1 }; break;
            case rookRay.ray4: this._offset = { colOffset: 0, rowOffset: -1 }; break;
        }
        this._curOffset = { colOffset: this._offset.colOffset, rowOffset: this._offset.rowOffset };
    }
    public next(): IteratorResult<boardFieldIdx> {
        let newCol = this._startField.colIdx + this._curOffset.colOffset;
        let newRow = this._startField.rowIdx + this._curOffset.rowOffset;
        this._curOffset.colOffset += this._offset.colOffset;
        this._curOffset.rowOffset += this._offset.rowOffset;
        if (isFieldOnBoard(newCol, newRow)) {
            return { done: false, value: { colIdx: newCol, rowIdx: newRow } }
        }
        return { done: true, value: null };
    }

    [Symbol.iterator](): IterableIterator<boardFieldIdx> {
        return this;
    }
}
*/
export function isOffsetRookLike(source: IField, target: IField): rookRay | undefined {
    let dir = source.isHorizontalVertical(target)
    switch (dir) {
        case offsetsEnum.N: return rookRay.N
        case offsetsEnum.S: return rookRay.S
        case offsetsEnum.W: return rookRay.W
        case offsetsEnum.E: return rookRay.E
    }
    return undefined
}
