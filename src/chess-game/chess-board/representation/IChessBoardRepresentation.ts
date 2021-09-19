import { Piece, pieceKeyType, pieceKind } from '../../common/Piece';
import { color } from '../../common/chess-color';
import { MoveOnBoard } from "../../common/MoveOnBoard";
import { fileIdxType, rankIdxType, IField } from '../../common/IField';
import { pieceOnBoard } from '../../common/pieceOnBoard';
import { ValidatedMove } from './ValidatedMove';
import { pieceStat } from './ChessBoardRepresentation';


export interface IChessBoardRepresentation {
    isPieceI(file: fileIdxType, rank: rankIdxType): boolean;
    pieceKeyI(file: fileIdxType, rank: rankIdxType): pieceKeyType;

    isFieldOnBoard(field: IField): boolean; // check validity of boardFieldIdx
    setPiece(piece_: Piece, field: IField): void;
    setPieceI(piece_: Piece, file: fileIdxType, rank: rankIdxType): void;
    removePiece(field: IField): void;
    peekField(field: IField): Piece;
    peekFieldI(file: fileIdxType, rank: rankIdxType): Piece;
    peekFieldPieceOB(field_: IField): pieceOnBoard;
    isFieldEmpty(field: IField): boolean;
    field(file_: fileIdxType, rank_: rankIdxType): IField;
    fieldFromNotation(s: string): IField;
    fieldFromNotationQuiet(fieldStr: string): IField | undefined;

    clearBoard(): void;
    setBoard(board: Piece[][]): void;
    isCaptureOn(field_: IField, color_: color): boolean;
    currentPieceSpectrum(): pieceStat;

    isPieceAttackedOn(field: IField, attackingColor: color): boolean;
    getAttackersOn(field: IField, attackingColor: color): pieceOnBoard[];
    getAttackersOfKindOn(field: IField, kind: pieceKind, attackingColor: color): pieceOnBoard[];
    getLegalMovesOfPiece(piece_: pieceOnBoard): MoveOnBoard[];
    getLegalMoves(): MoveOnBoard[];
    validateMove(sourcePieceOB: pieceOnBoard, target: IField, promotionPieceKind?: pieceKind): ValidatedMove;
    move(source: IField, target: IField, optionals?: { promotionPieceKind?: pieceKind; validateOnly?: boolean; }): MoveOnBoard | undefined;
    //doMove(validatedMove: ValidatedMove): void
    //undoMove(validatedMove: ValidatedMove): void
    revokeMove(moveOb: MoveOnBoard): void;

    isCheck(): boolean;
    isMate(): boolean;
    isStaleMate(): boolean;
}
