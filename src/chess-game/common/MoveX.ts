import { Move, MoveOptionals } from "./Move"
import { IField } from "./IField"
import { Piece } from "./Piece"
import { color } from "./chess-color"

export class MoveX extends Move {
    constructor(piece: Piece, source: IField, target: IField, optionals: MoveOptionals) {
        super(piece, source, target, optionals)
    }
    get moveColor(): color {
        return this.piece.color
    }
    get isEnpassant(): boolean {
        return typeof this.optionals?.promotionPiece != 'undefined'
    }
    get isCastle(): boolean {
        return typeof this.optionals?.castleRookSource != 'undefined' && typeof this.optionals?.castleRookTarget != 'undefined'
    }
}