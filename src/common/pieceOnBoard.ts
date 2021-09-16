import { Piece } from './Piece';
import { IField } from './IField';


export type pieceOnBoard = {
    piece: Piece;
    field: IField;
};
export function createPieceOB(piece_: Piece, field_: IField) { return { piece: piece_, field: field_ }; }
