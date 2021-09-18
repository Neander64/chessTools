import { IField } from "../../common/IField"
import { offsetsEnum } from '../../common/offsetsEnum'

export const enum bishopRay { // 1-2,3-4 are opposites
    SW = offsetsEnum.SW,
    NE = offsetsEnum.NE,
    NW = offsetsEnum.NW,
    SE = offsetsEnum.SE,
}

export class BishopMovesRaw {

    private moves_SW: IField[]
    private moves_NE: IField[]
    private moves_NW: IField[]
    private moves_SE: IField[]

    static readonly rays = [bishopRay.SW, bishopRay.NE, bishopRay.NW, bishopRay.SE]

    constructor(startField: IField) {
        this.moves_SW = this.generateRay(startField, offsetsEnum.SW)
        this.moves_NE = this.generateRay(startField, offsetsEnum.NE)
        this.moves_NW = this.generateRay(startField, offsetsEnum.NW)
        this.moves_SE = this.generateRay(startField, offsetsEnum.SE)
    }
    private generateRay(startField: IField, offset: offsetsEnum): IField[] {
        let moves: IField[] = []
        for (let i = 1; i < 8; i++) {
            let newField = startField.shift(offset, i)
            if (newField.isOnBoard) {
                moves.push(newField)
            }
            else break
        }
        return moves
    }
    getRay(ray: bishopRay): IField[] {
        switch (ray) {
            case bishopRay.SW: return this.moves_SW
            case bishopRay.NE: return this.moves_NE
            case bishopRay.NW: return this.moves_NW
            case bishopRay.SE: return this.moves_SE
        }
        return []; // unreachable
    }
}

export function isOffsetBishopLike(source: IField, target: IField): bishopRay | undefined {
    let dir = source.isDiagonal(target)
    switch (dir) {
        case offsetsEnum.NW: return bishopRay.NW
        case offsetsEnum.SW: return bishopRay.SW
        case offsetsEnum.NE: return bishopRay.NE
        case offsetsEnum.SE: return bishopRay.SE
    }
    return undefined;
}
