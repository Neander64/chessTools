import { boardFieldIdx, fieldOffset, offsets, shiftField } from './chess-board-internal-types'
import { IChessBoardRepresentation } from './chess-board-representation'


export const enum rookRay {
    W = 'W',
    E = 'E',
    S = 'S',
    N = 'N',
}

export class RookMovesRaw {

    moves_W: boardFieldIdx[]
    moves_E: boardFieldIdx[]
    moves_S: boardFieldIdx[]
    moves_N: boardFieldIdx[]

    static readonly rays = [rookRay.W, rookRay.E, rookRay.S, rookRay.N]

    constructor(startField: boardFieldIdx, board: IChessBoardRepresentation) {
        this.moves_W = this.generateRay(startField, offsets.W, board)
        this.moves_E = this.generateRay(startField, offsets.E, board)
        this.moves_S = this.generateRay(startField, offsets.S, board)
        this.moves_N = this.generateRay(startField, offsets.N, board)

    }
    private generateRay(startField: boardFieldIdx, offset: fieldOffset, board: IChessBoardRepresentation): boardFieldIdx[] {
        let moves: boardFieldIdx[] = []
        for (let i = 1; i < 8; i++) {
            let newField = shiftField(startField, offset, i)
            if (board.isFieldOnBoard(newField)) {
                moves.push(newField)
            }
            else break
        }
        return moves
    }
    getRay(ray: rookRay): boardFieldIdx[] {
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
export function isOffsetRookLike(source: boardFieldIdx, target: boardFieldIdx): { valid: boolean, ray?: rookRay } {
    if ((source.rowIdx == target.rowIdx) || (source.colIdx == target.colIdx)) {
        if (source.colIdx == target.colIdx) {
            if (source.rowIdx < target.rowIdx)
                return { valid: true, ray: rookRay.S } // 0 +
            else
                return { valid: true, ray: rookRay.N } // 0 -
        }
        else { // source.rowIdx == target.rowIdx
            if (source.colIdx < target.colIdx)
                return { valid: true, ray: rookRay.W } // + 0
            else
                return { valid: true, ray: rookRay.E } // - 0
        }
    }
    return { valid: false }
}
