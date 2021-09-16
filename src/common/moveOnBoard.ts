import { pieceKind } from './Piece';
import { pieceOnBoard } from "./pieceOnBoard";
import { IField } from "./IField";
import { ChessGameStatusData } from "./ChessGameStatusData";

export const enum ChessMoveEvaluation {
    // move evaluation
    blunder = '??',         // $4
    mistake = '?',          // $2
    dubious = '?!',         // $6
    interesting = '!?',     // $5
    good = '!',             // $1
    brilliant = '!!',       // $3
}


export const enum ChessPositionalEvaluation {
    // positional
    equal = '=',                    // $10
    slightAdvantageWhite = '⩲',   // $14 ⩲
    slightAdvantageBlack = '⩱',   // $15 ⩱
    clearAdvantageWhite = '±',    // $16 ± moderate
    clearAdvantageBlack = '∓',    // $17 ∓
    decisiveAdvantageWhite = '+-',  // $18 +-
    decisiveAdvantageBlack = '-+',  // $19 -+
    unclear = '∞',                  // $13 ∞
    // ToDo: add further evaluations
}


export class MoveOnBoard {
    // represents a move on the board
    pieceOB: pieceOnBoard;
    target: IField;
    // pawn promotion
    promotionPiece?: pieceKind;
    // castle
    pieceRook?: pieceOnBoard;
    targetRook?: IField;
    // captured/replaced Piece
    pieceCaptured?: pieceOnBoard;

    // position key to check for move repetition
    boardKey?: BigInt;

    isCheck?: boolean;
    isMate?: boolean;
    notationLong?: string;
    notation?: string; // SAN
    previousStatus?: ChessGameStatusData;

    isNovelty?: boolean;
    moveEvaluation?: ChessMoveEvaluation;
    positionalEvaluation?: ChessPositionalEvaluation;
    comment?: string;

    constructor(pieceOB: pieceOnBoard, target: IField) {
        this.pieceOB = pieceOB
        this.target = target
    }
    get isCapture() { return typeof this.pieceCaptured !== 'undefined' }
    get color() { return this.pieceOB.piece.color }
    get piece() { return this.pieceOB.piece }
};
