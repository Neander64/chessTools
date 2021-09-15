import { IField } from '../representation/chess-board-representation'
import { offsetsEnum } from '../chess-board-offsets'

export class KnightMovesRaw {
    moves: IField[]

    constructor(startField: IField) {
        const offsetsKnight = [
            offsetsEnum.NNE, offsetsEnum.NNW,
            offsetsEnum.SSE, offsetsEnum.SSW,
            offsetsEnum.WWN, offsetsEnum.WWS,
            offsetsEnum.EEN, offsetsEnum.EES
        ];
        this.moves = []
        for (const f of offsetsKnight) {
            let newField = startField.shift(f)
            if (newField.isOnBoard()) {
                this.moves.push(newField)
            }
        }
    }
}
