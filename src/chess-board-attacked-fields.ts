import { IField, pieceOnBoard } from './chess-board-representation'

type attackedBy = {
    field: IField,  // attacked field
    attackingPieces: pieceOnBoard[]
}
export class AttackedFields {
    private _fields: attackedBy[]
    constructor() {
        this._fields = []
    }
    add(attackedField: IField, attackingPiece: pieceOnBoard) {
        let found = this._fields.find(x => x.field.same(attackedField))
        if (found)
            found.attackingPieces.push(attackingPiece)
        else
            this._fields.push({ field: attackedField, attackingPieces: [attackingPiece] })
    }
    clear() {
        this._fields = []
    }
    isAttacked(field: IField): boolean {
        let found = this._fields.find(x => x.field.same(field))
        return (typeof found !== 'undefined')
    }
    attackersOn(field: IField): pieceOnBoard[] {
        let found = this._fields.find(x => x.field.same(field))
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
