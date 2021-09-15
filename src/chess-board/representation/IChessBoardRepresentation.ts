import { Piece, pieceKeyType, pieceKind } from '../pieces/Piece';
import { color } from '../../common/chess-color';
import { moveOnBoard } from "../moveOnBoard";
import { fileType, rankType, IField } from './IField';
import { pieceOnBoard } from './pieceOnBoard';
import { ValidatedMove } from './ValidatedMove';
import { pieceStat } from './ChessBoardRepresentation';


export interface IChessBoardRepresentation {
    isPieceI(file: fileType, rank: rankType): boolean;
    pieceKeyI(file: fileType, rank: rankType): pieceKeyType;

    isFieldOnBoard(field: IField): boolean; // check validity of boardFieldIdx
    setPiece(piece_: Piece, field: IField): void;
    setPieceI(piece_: Piece, file: fileType, rank: rankType): void;
    removePiece(field: IField): void;
    peekField(field: IField): Piece;
    peekFieldI(file: fileType, rank: rankType): Piece;
    peekFieldPieceOB(field_: IField): pieceOnBoard;
    isFieldEmpty(field: IField): boolean;
    field(file_: fileType, rank_: rankType): IField;
    fieldFromNotation(s: string): IField;
    fieldFromNotationQuiet(fieldStr: string): IField | undefined;

    clearBoard(): void;
    setBoard(board: Piece[][]): void;
    isCaptureOn(field_: IField, color_: color): boolean;
    currentPieceSpectrum(): pieceStat;

    isPieceAttackedOn(field: IField, attackingColor: color): boolean;
    getAttackersOn(field: IField, attackingColor: color): pieceOnBoard[];
    getAttackersOfKindOn(field: IField, kind: pieceKind, attackingColor: color): pieceOnBoard[];
    getLegalMovesOfPiece(piece_: pieceOnBoard): moveOnBoard[];
    getLegalMoves(): moveOnBoard[];
    validateMove(sourcePieceOB: pieceOnBoard, target: IField, promotionPieceKind?: pieceKind): ValidatedMove;
    move(source: IField, target: IField, optionals?: { promotionPieceKind?: pieceKind; validateOnly?: boolean; }): moveOnBoard | undefined;
    //doMove(validatedMove: ValidatedMove): void
    //undoMove(validatedMove: ValidatedMove): void
    revokeMove(moveOb: moveOnBoard): void;

    isCheck(): boolean;
    isMate(): boolean;
    isStaleMate(): boolean;
}
