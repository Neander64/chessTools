import { pieceKind } from './chess-board-pieces/Piece';
import { pieceOnBoard } from "./representation/pieceOnBoard";
import { IField } from "./representation/IField";
import { ChessGameStatusData } from "./ChessGameStatusData";


export type moveOnBoard = {
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
};
