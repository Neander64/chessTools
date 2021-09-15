import { IField } from '../representation/chess-board-representation'
import { offsetsEnum } from '../chess-board-offsets'


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
