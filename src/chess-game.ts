import { ChessMoveEvaluation, ChessPositionalEvaluation } from './common/moveOnBoard';
import { ChessBoardPiece, ChessMoveColor, PgnResult, pgnSTR } from './pgn'

const COLUMNS = 'abcdefgh';
const ROWS = '12345678';

export class ChessBoardField {
    rank?: string;
    file?: string;
}

class ChessHalfMove {
    moveNumber: number = 0;
    color?: ChessMoveColor;
    piece?: ChessBoardPiece;
    sourceField?: ChessBoardField;
    targetField?: ChessBoardField;
    promotionTarget?: ChessBoardPiece;
    castleShort?: boolean;
    castleLong?: boolean;
    isCheck?: boolean;
    isMate?: boolean;
    isCapture?: boolean;
    isNovelty?: boolean;
    moveEvaluation?: ChessMoveEvaluation;
    positionalEvaluation?: ChessPositionalEvaluation;
    comment?: string;
}

export class ChessGame {
    // ChessGame represents a Chess game (or specific line) with all moves (no variants) - at least not yet
    // PGN can be used to import/export such a game
    // it delegates the activities on the board with ChessBoard

    event = "?";
    site = "?";
    date = "????.??.??";
    round = "?";
    white = "?";
    black = "?";
    result = PgnResult.Unknown;

    //ToDo: allow using a startPosition
    private _nextColor: ChessMoveColor = ChessMoveColor.white;
    private _moveNumber: number = 1; // next move number
    private _tmpMove !: ChessHalfMove; // Buffer for the next move to be added
    private _isTmpInitial: boolean = true;

    moves: ChessHalfMove[] = [];

    constructor() {
        this.clearGame();
    }

    public get pgnSTR(): pgnSTR {
        let res = new pgnSTR();
        res.event = this.event;
        res.site = this.site;
        res.date = this.date;
        res.round = this.round;
        res.white = this.white;
        res.black = this.black;
        res.result = this.result;
        return res;
    }
    public get nextColor(): ChessMoveColor {
        return this._nextColor;
    }
    public get moveNumber(): number {
        return this._moveNumber;
    }

    public get isTmpInitial(): boolean {
        return this._isTmpInitial;
    }

    // set Game to initial / empty values
    clearGame() {
        this.event = "?";
        this.site = "?";
        this.date = "????.??.??";
        this.round = "?";
        this.white = "?";
        this.black = "?";
        this.result = PgnResult.Unknown; //["*"];

        this._nextColor = ChessMoveColor.white;
        this._moveNumber = 1;
        this.moves = [];

        this.initMove();
    }

    get isWhiteToMove(): boolean {
        return this._nextColor == ChessMoveColor.white;
    }
    get hasMoves(): boolean {
        return this.moves.length != 0;
    }

    // I don't want to expose the internal representation.
    // Add values to the Move, then addMove() to actually store these.
    setMovePiece(piece: ChessBoardPiece) {
        this._tmpMove.piece = piece;
        this._isTmpInitial = false;
        return this;
    }
    setMoveSourceField(sourceField: ChessBoardField) {
        //ToDo: check piece exist on current board
        //ToDo: check extend missing value
        //ToDo: throw exeption if wrong values
        let colOkay: boolean = true;
        let rowOkay: boolean = true;
        if (sourceField.file) {
            colOkay = this.checkLegalColumns(sourceField.file);
        }
        if (sourceField.rank) {
            rowOkay = this.checkLegalRows(sourceField.rank);
        }
        if (colOkay && rowOkay) {
            this._tmpMove.sourceField = sourceField;
            this._isTmpInitial = false;
        }
        return this;
    }
    setMoveTargetField(targetField: ChessBoardField) {
        //ToDo: throw exception on wrong values
        //ToDo: check if target is capture
        //ToDo: check if Check / Mate
        let colOkay: boolean = true;
        let rowOkay: boolean = true;
        if (targetField.file) {
            colOkay = this.checkLegalColumns(targetField.file);
        }
        if (targetField.rank) {
            rowOkay = this.checkLegalRows(targetField.rank);
        }
        if (colOkay && rowOkay) {
            this._tmpMove.targetField = targetField;
            this._isTmpInitial = false;
        }
        return this;
    }
    setMovePromotionTarget(piece: ChessBoardPiece) {
        /*ToDo: don't throw, yet
        if (piece == ChessBoardPiece.Pawn) {
            throw new Error('Illegal promotion: pawn to pawn');
            //return this;
        }
        */
        this._tmpMove.promotionTarget = piece;
        this._isTmpInitial = false;
        return this;
    }
    setMoveIsCheck() {
        //ToDo: check on current board if it's actually a check
        this._tmpMove.isCheck = true;
        this._isTmpInitial = false;
        return this;
    }
    setMoveIsMate() {
        //ToDo: check on current board if it's actually a mate
        this._tmpMove.isMate = true;
        this._isTmpInitial = false;
        return this;
    }
    setMoveIsCapture() {
        //ToDo: check on current board if it's actually a capture
        this._tmpMove.isCapture = true;
        this._isTmpInitial = false;
        return this;
    }
    setMoveIsNovelty() {
        //ToDo: check on current board if it's actually a capture
        this._tmpMove.isNovelty = true;
        this._isTmpInitial = false;
        return this;
    }
    setMoveEvaluation(evaluation: ChessMoveEvaluation) {
        this._tmpMove.moveEvaluation = evaluation;
        this._isTmpInitial = false;
        return this;
    }
    setMovePositionalEvaluation(evaluation: ChessPositionalEvaluation) {
        this._tmpMove.positionalEvaluation = evaluation;
        this._isTmpInitial = false;
        return this;
    }
    setMoveComment(comment: string) {
        if (this._tmpMove.comment) {
            this._tmpMove.comment += comment; // append further comments to existing one
        }
        else this._tmpMove.comment = comment;
        //this._isTmpInitial = false; Comment move set's no dirty flag to avoid saving a comment only move
        return this;
    }
    setMoveCastleShort() {
        this._tmpMove.castleShort = true;
        this._isTmpInitial = false;
    }
    setMoveCastleLong() {
        this._tmpMove.castleLong = true;
        this._isTmpInitial = false;
    }
    addMove() {
        if (this._isTmpInitial) { // no values set. That is not a move!
            //ToDo Throw Exception
            return this;
        }
        //ToDo: validate move
        if (!this._tmpMove.piece) { // if not defined, must be a pawn
            this._tmpMove.piece = ChessBoardPiece.Pawn;
        }
        this._tmpMove.color = this._nextColor;
        this._tmpMove.moveNumber = this._moveNumber;
        this.moves.push(this._tmpMove);
        this.initMove();
        this.changePlayer();
        return this;
    }

    private checkLegalColumns(column: string): boolean {
        return column.length == 1 &&
            COLUMNS.indexOf(column) >= 0
    }
    private checkLegalRows(row: string): boolean {
        return row.length == 1 &&
            ROWS.indexOf(row) >= 0
    }

    private initMove() {
        this._tmpMove = new ChessHalfMove();
        this._isTmpInitial = true;
    }
    private changePlayer() {
        if (this._nextColor == ChessMoveColor.white) {
            this._nextColor = ChessMoveColor.black;
        }
        else {
            this._nextColor = ChessMoveColor.white;
            this._moveNumber++;
        }
    }
}


