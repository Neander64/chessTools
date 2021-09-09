import { boardFieldIdx, offsets, shiftField } from './chess-board-internal-types'
import { IChessBoardRepresentation } from './chess-board-representation'

export class KnightMovesRaw {
    moves: boardFieldIdx[]

    constructor(startField: boardFieldIdx, board: IChessBoardRepresentation) {
        const offsetsKnight = [
            offsets.NNE, offsets.NNW,
            offsets.SSE, offsets.SSW,
            offsets.WWN, offsets.WWS,
            offsets.EEN, offsets.EES
        ];
        this.moves = []
        for (const f of offsetsKnight) {
            let newField = shiftField(startField, f)
            if (board.isFieldOnBoard(newField)) {
                this.moves.push(newField)
            }
        }
    }
}
