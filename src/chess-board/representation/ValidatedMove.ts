import { Piece, pieceKind } from '../chess-board-pieces/Piece';
import { color } from '../../chess-color';
import { KingMovesRaw } from '../chess-board-pieces/KingMovesRaw';
import { CastleFlags, castleType } from "../chess-board-pieces/CastleFlags";
import { ChessGameStatusData } from "../ChessGameStatusData";
import { moveOnBoard } from "../moveOnBoard";
import { IField } from './IField';
import { pieceOnBoard } from './pieceOnBoard';
import { IChessBoardRepresentation } from "./IChessBoardRepresentation";


export class ValidatedMove {
    isValid: boolean;
    sourcePieceOB: pieceOnBoard;
    target: IField;
    // pawn promotion
    isPromotion: boolean;
    promotionPieceKind?: pieceKind;
    captureEP: boolean;

    // castle
    isCastle: boolean;
    castleType?: castleType;
    pieceRook?: pieceOnBoard;
    targetRook?: IField;
    // captured/replaced Piece
    pieceCaptured?: pieceOnBoard;

    // data to be updated
    castleFlags: CastleFlags;
    enPassantField?: IField;
    halfMoves50: number;
    _notation: string;

    constructor(pieceOB_: pieceOnBoard, target_: IField, data_: ChessGameStatusData) {
        this.isValid = false;
        this.sourcePieceOB = pieceOB_;
        this.target = target_;
        this.captureEP = false;
        this.isPromotion = false;
        this.isCastle = false;
        this.castleType = undefined;
        this.castleFlags = new CastleFlags(data_.castleFlags);
        this.enPassantField = data_.enPassantField;
        this.halfMoves50 = data_.halfMoves50;
        this._notation = '';
    }
    get color(): color { return this.sourcePieceOB.piece.color; }
    get source(): IField { return this.sourcePieceOB.field; }
    get kind(): pieceKind { return this.sourcePieceOB.piece.kind; }
    get piece(): Piece { return this.sourcePieceOB.piece; }
    get capturedKind(): pieceKind { return this.pieceCaptured?.piece.kind!; }
    get capturedColor(): color { return this.pieceCaptured?.piece.color!; }
    get capturedField(): IField { return this.pieceCaptured?.field!; }
    get isPawn(): boolean { return this.sourcePieceOB.piece.kind == pieceKind.Pawn; }
    get isCapture(): boolean { return (typeof this.pieceCaptured != 'undefined'); }
    updateData(data_: ChessGameStatusData, cbr: IChessBoardRepresentation) {
        data_.castleFlags.set(this.castleFlags);
        data_.enPassantField = this.enPassantField;
        data_.halfMoves50 = this.halfMoves50;
        this._notation = this.notation(cbr);
    }
    get moveOnBoard(): moveOnBoard {
        return {
            pieceOB: this.sourcePieceOB,
            target: this.target,
            promotionPiece: this.promotionPieceKind,
            pieceRook: this.pieceRook,
            targetRook: this.targetRook,
            pieceCaptured: this.pieceCaptured,
            notationLong: this.notationLong,
            notation: this._notation
        };
    }
    private get notationLong(): string {
        let result = '';
        if (this.isCastle) {
            switch (this.castleType) {
                case castleType.short: return KingMovesRaw.CASTLE_SHORT_STR;
                case castleType.long: return KingMovesRaw.CASTLE_LONG_STR;
            }
            // return 'invalid castle'
        }
        else {
            if (!this.isPawn) {
                result += this.sourcePieceOB.piece.PGN;
            }
            result += this.sourcePieceOB.field.notation;
            result += (this.isCapture || this.captureEP) ? 'x' : '-';
            result += this.target.notation;
            if (this.isPawn && this.isPromotion) {
                result += '=' + Piece.getPiece(this.promotionPieceKind!, this.color).PGN;
            }
        }
        return result;
    }
    private notation(cbr: IChessBoardRepresentation): string {
        let result = '';
        if (this.isCastle) {
            switch (this.castleType) {
                case castleType.short: return KingMovesRaw.CASTLE_SHORT_STR;
                case castleType.long: return KingMovesRaw.CASTLE_LONG_STR;
            }
            // return 'invalid castle'
        }
        else {
            if (!this.isPawn) {
                result += this.piece.PGN;
                let sourceNota = this.source.notation;
                let others = cbr.getAttackersOfKindOn(this.target, this.kind, this.color);
                let unifier = '';
                for (let a of others) {
                    if (a.field.same(this.source))
                        continue;
                    if (a.field.rank == this.source.rank)
                        unifier += sourceNota.charAt(0); // add file
                    if (a.field.file == this.source.file)
                        unifier += sourceNota.charAt(1); // add rank
                }
                result += unifier + ((this.isCapture || this.captureEP) ? 'x' : '');
            }
            else {
                if (this.isCapture || this.captureEP)
                    result += this.source.notation.charAt(0) + 'x';
            }
            result += this.target.notation;
            if (this.isPawn && this.isPromotion) {
                result += '=' + Piece.getPiece(this.promotionPieceKind!, this.color).PGN;
            }
        }
        return result;
    }
}
