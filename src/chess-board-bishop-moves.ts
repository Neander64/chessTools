import { boardFieldIdx, fieldOffset, offsets, shiftField } from './chess-board-internal-types'
import { IChessBoardRepresentation } from './chess-board'

export const enum bishopRay { // 1-2,3-4 are opposites
    SW = 'SW',
    NE = 'NE',
    NW = 'NW',
    SE = 'SE',
}
export class BishopMovesRaw {
    moves_SW: boardFieldIdx[]
    moves_NE: boardFieldIdx[]
    moves_NW: boardFieldIdx[]
    moves_SE: boardFieldIdx[]
    constructor(startField: boardFieldIdx, board: IChessBoardRepresentation) {
        this.moves_SW = this.generateRay(startField, offsets.SW, board)
        this.moves_NE = this.generateRay(startField, offsets.NE, board)
        this.moves_NW = this.generateRay(startField, offsets.NW, board)
        this.moves_SE = this.generateRay(startField, offsets.SE, board)
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
    getRay(ray: bishopRay): boardFieldIdx[] {
        switch (ray) {
            case bishopRay.SW: return this.moves_SW
            case bishopRay.NE: return this.moves_NE
            case bishopRay.NW: return this.moves_NW
            case bishopRay.SE: return this.moves_SE
        }
        return []; // unreachable
    }
}
/* optional implementation with iterator
export class BishopRayIt implements IterableIterator<boardFieldIdx> {
    private _startField: boardFieldIdx;
    private _curOffset: { colOffset: number, rowOffset: number };
    private _offset: { colOffset: number, rowOffset: number };

    constructor(startField: boardFieldIdx, diag: bishopRay) {
        this._startField = startField;
        switch (diag) {
            case bishopRay.ray1: this._offset = { colOffset: 1, rowOffset: 1 }; break;
            case bishopRay.ray2: this._offset = { colOffset: -1, rowOffset: -1 }; break;
            case bishopRay.ray3: this._offset = { colOffset: 1, rowOffset: -1 }; break;
            case bishopRay.ray4: this._offset = { colOffset: -1, rowOffset: 1 }; break;
        }
        this._curOffset = { colOffset: this._offset.colOffset, rowOffset: this._offset.rowOffset };
    }

    public next(): IteratorResult<boardFieldIdx> {
        let newCol = this._startField.colIdx + this._curOffset.colOffset;
        let newRow = this._startField.rowIdx + this._curOffset.rowOffset;
        this._curOffset.colOffset += this._offset.colOffset;
        this._curOffset.rowOffset += this._offset.rowOffset;
        if (newCol >= 0 && newCol < 8 && newRow >= 0 && newRow < 8) {
            return { done: false, value: { colIdx: newCol, rowIdx: newRow } }
        }
        return { done: true, value: null };
    }

    [Symbol.iterator](): IterableIterator<boardFieldIdx> {
        return this;
    }
}
*/
export function isOffsetBishopLike(source: boardFieldIdx, target: boardFieldIdx): { valid: boolean, ray?: bishopRay } {
    if (Math.abs(source.rowIdx - target.rowIdx) == Math.abs(source.colIdx - target.colIdx)) {
        if (source.colIdx > target.colIdx) {
            if (source.rowIdx > target.rowIdx)  // - -
                return { valid: true, ray: bishopRay.NE }
            else                                // - +
                return { valid: true, ray: bishopRay.SE }
        }
        else {
            if (source.rowIdx > target.rowIdx)  // + -
                return { valid: true, ray: bishopRay.NW }
            else                                // + +
                return { valid: true, ray: bishopRay.SW }
        }
    }
    return { valid: false };
}
