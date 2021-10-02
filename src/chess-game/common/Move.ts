import { CastleFlags } from "./CastleFlags"
import { IField } from "./IField"
import { Piece } from "./Piece"

export class Move {
    piece: Piece
    source: IField
    target: IField
    castleFlags: CastleFlags
    optionals?: MoveOptionals
    constructor(piece: Piece, source: IField, target: IField, castleFlags: CastleFlags, optionals?: MoveOptionals) {
        this.piece = piece
        this.source = source
        this.target = target
        this.castleFlags = castleFlags
        this.optionals = optionals
    }
}

export class MoveOptionals {
    promotionPiece?: Piece
    enPassantCaptureField?: IField
    enPassantField?: IField
    castleRookSource?: IField
    castleRookTarget?: IField
}