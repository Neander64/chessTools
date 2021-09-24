import { pieceKind } from './Piece';
import { pieceOnBoard } from "./pieceOnBoard";
import { IField } from "./IField";
import { ChessGameStatusData } from "./ChessGameStatusData";
import { castleType } from './CastleFlags';


export class MoveOnBoard {
    // represents a move on the board
    pieceOB: pieceOnBoard
    target: IField
    // pawn promotion
    promotionPiece?: pieceKind
    // castle
    castleType?: castleType
    pieceRook?: pieceOnBoard
    targetRook?: IField
    // captured/replaced Piece
    pieceCaptured?: pieceOnBoard

    // position key to check for move repetition
    boardKey?: BigInt;

    isCheck?: boolean
    isMate?: boolean
    notationLong?: string
    notation?: string // SAN
    previousStatus?: ChessGameStatusData;

    isNovelty?: boolean
    moveEvaluation?: ChessMoveEvaluation
    positionalEvaluation?: ChessPositionalEvaluation
    comment?: string

    constructor(pieceOB: pieceOnBoard, target: IField) {
        this.pieceOB = pieceOB
        this.target = target
    }
    get isCapture() { return typeof this.pieceCaptured !== 'undefined' }
    get color() { return this.pieceOB.piece.color }
    get piece() { return this.pieceOB.piece }
    get isCastle() { return typeof this.castleType != 'undefined' }
}

export const enum ChessMoveEvaluation {
    // move evaluation
    good = '!',             // $1
    mistake = '?',          // $2
    brilliant = '!!',       // $3
    blunder = '??',         // $4
    interesting = '!?',     // $5
    dubious = '?!',         // $6
    onlyMove = '[]',        // $8
    zugzwang = '(.)',       // $22
}

export const enum ChessPositionalEvaluation {
    // positional
    decisiveAdvantageWhite = '+-',  // $18 +-
    clearAdvantageWhite = '±',      // $16 ± moderate
    slightAdvantageWhite = '⩲',     // $14 ⩲
    equal = '=',                    // $11
    unclear = '∞',                  // $13 ∞
    slightAdvantageBlack = '⩱',     // $15 ⩱
    clearAdvantageBlack = '∓',      // $17 ∓
    decisiveAdvantageBlack = '-+',  // $19 -+

    counterPlay = '⇆',              // 132
    // TODO: add further evaluations
}
