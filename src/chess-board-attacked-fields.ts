import { pieceOnBoard, boardFieldIdx, sameFields } from './chess-board-internal-types'

type attackedBy = {
    field: boardFieldIdx,  // attacked field
    attackingPieces: pieceOnBoard[]
}
export class AttackedFields {
    private _fields: attackedBy[]
    constructor() {
        this._fields = []
    }
    add(attackedField: boardFieldIdx, attackingPiece: pieceOnBoard) {
        let found = this._fields.find(x => sameFields(x.field, attackedField))
        if (found)
            found.attackingPieces.push(attackingPiece)
        else
            this._fields.push({ field: attackedField, attackingPieces: [attackingPiece] })
    }
    clear() {
        this._fields = []
    }
    isAttacked(field: boardFieldIdx): boolean {
        let found = this._fields.find(x => sameFields(x.field, field))
        return (typeof found !== 'undefined')
    }
    attackersOn(field: boardFieldIdx): pieceOnBoard[] {
        let found = this._fields.find(x => sameFields(x.field, field))
        if (typeof found == 'undefined') return []
        return found!.attackingPieces
    }
    /*
    attackedFields(): boardFieldIdx[] {
        let result: boardFieldIdx[] = []
        for (let attacked of this._fields) {
            result.push(attacked.field)
        }
        return result
    }
    */
    hasData() {
        return this._fields.length > 0
    }
}
