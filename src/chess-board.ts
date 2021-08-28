import { start } from "repl";
import { resourceLimits } from "worker_threads";


export const enum pieceKind {
    Rook,
    Knight,
    Bishop,
    Queen,
    King,
    Pawn,
    none,
    /*    whiteRook = 'R',
        whiteKnight = 'N',
        whiteBishop = 'B',
        whiteQueen = 'Q',
        whiteKing = 'K',
        whitePawn = 'P',
    
        blackRook = 'r',
        blackKnight = 'n',
        blackBishop = 'b',
        blackQueen = 'q',
        blackKing = 'k',
        blackPawn = 'p',
    
        none = ' ',
        */
}

export const enum color {
    black = 'Black',
    white = 'White',
}

function otherColor(color_: color) {
    switch (color_) {
        case color.black: return color.white;
        case color.white: return color.black;
    }
}

export type piece = {
    kind: pieceKind
    color?: color;
}
const NOPIECE: piece = { kind: pieceKind.none };

const whiteRook: piece = { color: color.white, kind: pieceKind.Rook };
const whiteKnight: piece = { color: color.white, kind: pieceKind.Knight };
const whiteBishop: piece = { color: color.white, kind: pieceKind.Bishop };
const whiteQueen: piece = { color: color.white, kind: pieceKind.Queen };
const whiteKing: piece = { kind: pieceKind.King, color: color.white };
const whitePawn: piece = { kind: pieceKind.Pawn, color: color.white };

const blackRook: piece = { color: color.black, kind: pieceKind.Rook };
const blackKnight: piece = { color: color.black, kind: pieceKind.Knight };
const blackBishop: piece = { color: color.black, kind: pieceKind.Bishop };
const blackQueen: piece = { color: color.black, kind: pieceKind.Queen };
const blackKing: piece = { kind: pieceKind.King, color: color.black };
const blackPawn: piece = { kind: pieceKind.Pawn, color: color.black };


function pieceToChar(p: piece): string {
    let result = '';
    switch (p.kind) {
        case pieceKind.Rook:
            if (p.color == color.white) result = 'R'
            else result = 'r';
            break;
        case pieceKind.Knight:
            if (p.color == color.white) result = 'N'
            else result = 'n';
            break;
        case pieceKind.Bishop:
            if (p.color == color.white) result = 'B'
            else result = 'b';
            break;
        case pieceKind.Queen:
            if (p.color == color.white) result = 'Q'
            else result = 'q';
            break;
        case pieceKind.King:
            if (p.color == color.white) result = 'K'
            else result = 'k';
            break;
        case pieceKind.Pawn:
            if (p.color == color.white) result = 'P'
            else result = 'p';
            break;
        case pieceKind.none:
            result = ' ';
            break;
    }
    return result;
}

function charToPiece(pieceStr: string): { valid: boolean, piece: piece } {

    switch (pieceStr) {
        case 'R': return { valid: true, piece: whiteRook };
        case 'N': return { valid: true, piece: whiteKnight };
        case 'B': return { valid: true, piece: whiteBishop };
        case 'Q': return { valid: true, piece: whiteQueen };
        case 'K': return { valid: true, piece: whiteKing };
        case 'P': return { valid: true, piece: whitePawn };

        case 'r': return { valid: true, piece: blackRook };
        case 'n': return { valid: true, piece: blackKnight };
        case 'b': return { valid: true, piece: blackBishop };
        case 'q': return { valid: true, piece: blackQueen };
        case 'k': return { valid: true, piece: blackKing };
        case 'p': return { valid: true, piece: blackPawn };

        default:
            return { valid: false, piece: NOPIECE };
    }
}

type boardFieldIdx = {
    colIdx: number,
    rowIdx: number,
}

type pieceOnBoard = {
    piece: piece,
    field: boardFieldIdx
};

type attackedBy = {
    field: boardFieldIdx,  // attacked field
    attackingPieces: pieceOnBoard[]
}
class AttackedFields {
    private _fields: attackedBy[];
    constructor() {
        this._fields = [];
    }
    add(attackedField: boardFieldIdx, attackingPiece: pieceOnBoard) {
        let found = this._fields.find(x => (x.field.colIdx == attackedField.colIdx && x.field.rowIdx == attackedField.rowIdx));
        if (found)
            found.attackingPieces.push(attackingPiece);
        else
            this._fields.push({ field: attackedField, attackingPieces: [attackingPiece] })
    }
    clear() {
        this._fields = [];
    }
    isAttacked(field: boardFieldIdx): boolean {
        let found = this._fields.find(x => (x.field.colIdx == field.colIdx && x.field.rowIdx == field.rowIdx));
        return (typeof found !== 'undefined');
    }
    attackedFields(): boardFieldIdx[] {
        let result: boardFieldIdx[] = [];
        for (let attacked of this._fields) {
            result.push(attacked.field);
        }
        return result;
    }
    hasData() {
        return this._fields.length > 0;
    }
}

function isFieldOnBoard(colIdx: number, rowIdx: number) {
    return (colIdx >= 0 && colIdx < 8 && rowIdx >= 0 && rowIdx < 8);
}

export const enum bishopRay { // 1-2,3-4 are opposites
    ray1 = 1,
    ray2,
    ray3,
    ray4,
}
class BishopMovesRaw {
    moves_ray1: boardFieldIdx[];
    moves_ray2: boardFieldIdx[];
    moves_ray3: boardFieldIdx[];
    moves_ray4: boardFieldIdx[];
    constructor(startField: boardFieldIdx) {
        this.moves_ray1 = this.generateRay(startField, 1, 1);
        this.moves_ray2 = this.generateRay(startField, -1, -0);
        this.moves_ray3 = this.generateRay(startField, 1, -1);
        this.moves_ray4 = this.generateRay(startField, -1, 1);
    }
    private generateRay(startField: boardFieldIdx, colOffset: number, rowOffset: number): boardFieldIdx[] {
        let moves: boardFieldIdx[] = [];
        //for (let i = startField.colIdx + colOffset; i < 8; i++) 
        for (let i = 1; i < 8; i++) {
            let newField = { colIdx: startField.colIdx + colOffset * i, rowIdx: startField.rowIdx + rowOffset * i };
            if (isFieldOnBoard(newField.colIdx, newField.rowIdx)) {
                moves.push(newField);
            }
            else break;
        }
        return moves;
    }
    getRay(ray: bishopRay): boardFieldIdx[] {
        switch (ray) {
            case bishopRay.ray1: return this.moves_ray1;
            case bishopRay.ray2: return this.moves_ray2;
            case bishopRay.ray3: return this.moves_ray3;
            case bishopRay.ray4: return this.moves_ray4;
        }
        //return []; // unreachable
    }
}
/*
export class BishopRayIt implements IterableIterator<boardFieldIdx> {
    private _startField: boardFieldIdx;
    private _curOffset: { colOffset: number, rowOffset: number };
    private _offset: { colOffset: number, rowOffset: number };

    constructor(startField: boardFieldIdx, diag: bishopRay) {
        this._startField = startField;
        switch (diag) {
            case bishopRay.ray1: this._offset = { colOffset: 1, rowOffset: 1 }; break;
            case bishopRay.ray2: this._offset = { colOffset: -1, rowOffset: -1 }; break;
            case bishopRay.ray3: this._offset = { colOffset: 1, rowOffset: -1 }; break;
            case bishopRay.ray4: this._offset = { colOffset: -1, rowOffset: 1 }; break;
        }
        this._curOffset = { colOffset: this._offset.colOffset, rowOffset: this._offset.rowOffset };
    }

    public next(): IteratorResult<boardFieldIdx> {
        let newCol = this._startField.colIdx + this._curOffset.colOffset;
        let newRow = this._startField.rowIdx + this._curOffset.rowOffset;
        this._curOffset.colOffset += this._offset.colOffset;
        this._curOffset.rowOffset += this._offset.rowOffset;
        if (newCol >= 0 && newCol < 8 && newRow >= 0 && newRow < 8) {
            return { done: false, value: { colIdx: newCol, rowIdx: newRow } }
        }
        return { done: true, value: null };
    }

    [Symbol.iterator](): IterableIterator<boardFieldIdx> {
        return this;
    }
}
*/
export function isOffsetBishopLike(source: boardFieldIdx, target: boardFieldIdx): { valid: boolean, ray?: bishopRay } {
    if (Math.abs(source.rowIdx - target.rowIdx) == Math.abs(source.colIdx - target.colIdx)) {
        if (source.colIdx > target.colIdx) {
            if (source.rowIdx > target.rowIdx)  // - -
                return { valid: true, ray: bishopRay.ray2 };
            else                                // - +
                return { valid: true, ray: bishopRay.ray4 };
        }
        else {
            if (source.rowIdx > target.rowIdx)  // + -
                return { valid: true, ray: bishopRay.ray3 };
            else                                // + +
                return { valid: true, ray: bishopRay.ray1 };
        }
    }
    return { valid: false };
}


export const enum rookRay {// 1-2,3-4 are opposites
    ray1 = 1,
    ray2,
    ray3,
    ray4,
}

class RookMovesRaw {
    moves_ray1: boardFieldIdx[];
    moves_ray2: boardFieldIdx[];
    moves_ray3: boardFieldIdx[];
    moves_ray4: boardFieldIdx[];
    constructor(startField: boardFieldIdx) {
        this.moves_ray1 = this.generateRay(startField, 1, 0);
        this.moves_ray2 = this.generateRay(startField, -1, 0);
        this.moves_ray3 = this.generateRay(startField, 0, 1);
        this.moves_ray4 = this.generateRay(startField, 0, -1);

    }
    private generateRay(startField: boardFieldIdx, colOffset: number, rowOffset: number): boardFieldIdx[] {
        let moves: boardFieldIdx[] = [];
        //for (let i = startField.colIdx + colOffset; i < 8; i++) 
        for (let i = 1; i < 8; i++) {
            let newField = { colIdx: startField.colIdx + colOffset * i, rowIdx: startField.rowIdx + rowOffset * i };
            if (isFieldOnBoard(newField.colIdx, newField.rowIdx)) {
                moves.push(newField);
            }
            else break;
        }
        return moves;
    }
    getRay(ray: rookRay): boardFieldIdx[] {
        switch (ray) {
            case rookRay.ray1: return this.moves_ray1;
            case rookRay.ray2: return this.moves_ray2;
            case rookRay.ray3: return this.moves_ray3;
            case rookRay.ray4: return this.moves_ray4;
        }
        //return []; // unreachable
    }
}
/*
export class RookRayIt implements IterableIterator<boardFieldIdx> {
    private _startField: boardFieldIdx;
    private _curOffset: { colOffset: number, rowOffset: number };
    private _offset: { colOffset: number, rowOffset: number };

    constructor(startField: boardFieldIdx, ray: rookRay) {
        this._startField = startField;
        switch (ray) {
            case rookRay.ray1: this._offset = { colOffset: 1, rowOffset: 0 }; break;
            case rookRay.ray2: this._offset = { colOffset: -1, rowOffset: 0 }; break;
            case rookRay.ray3: this._offset = { colOffset: 0, rowOffset: 1 }; break;
            case rookRay.ray4: this._offset = { colOffset: 0, rowOffset: -1 }; break;
        }
        this._curOffset = { colOffset: this._offset.colOffset, rowOffset: this._offset.rowOffset };
    }
    public next(): IteratorResult<boardFieldIdx> {
        let newCol = this._startField.colIdx + this._curOffset.colOffset;
        let newRow = this._startField.rowIdx + this._curOffset.rowOffset;
        this._curOffset.colOffset += this._offset.colOffset;
        this._curOffset.rowOffset += this._offset.rowOffset;
        if (isFieldOnBoard(newCol, newRow)) {
            return { done: false, value: { colIdx: newCol, rowIdx: newRow } }
        }
        return { done: true, value: null };
    }

    [Symbol.iterator](): IterableIterator<boardFieldIdx> {
        return this;
    }
}
*/
export function isOffsetRookLike(source: boardFieldIdx, target: boardFieldIdx): { valid: boolean, ray?: rookRay } {
    if ((source.rowIdx == target.rowIdx) || (source.colIdx == target.colIdx)) {
        if (source.colIdx == target.colIdx) {
            if (source.rowIdx < target.rowIdx)
                return { valid: true, ray: rookRay.ray3 }; // 0 +
            else
                return { valid: true, ray: rookRay.ray4 }; // 0 -
        }
        else { // source.rowIdx == target.rowIdx
            if (source.colIdx < target.colIdx)
                return { valid: true, ray: rookRay.ray1 }; // + 0
            else
                return { valid: true, ray: rookRay.ray2 }; // - 0
        }
    }
    return { valid: false };
}

export class KingMovesRaw {
    moves: boardFieldIdx[];

    constructor(startField: boardFieldIdx) {
        const offsetsKing = [
            { colOffset: -1, rowOffset: -1 }, { colOffset: 0, rowOffset: -1 }, { colOffset: 1, rowOffset: -1 },
            { colOffset: -1, rowOffset: 0 }, { colOffset: 1, rowOffset: 0 },
            { colOffset: -1, rowOffset: 1 }, { colOffset: 0, rowOffset: 1 }, { colOffset: 1, rowOffset: 1 },
        ];
        this.moves = [];
        for (const f of offsetsKing) {
            let newField = { colIdx: startField.colIdx + f.colOffset, rowIdx: startField.rowIdx + f.rowOffset };
            if (isFieldOnBoard(newField.colIdx, newField.rowIdx)) {
                this.moves.push(newField);
            }
        }
    }
}

export class KnightMovesRaw {
    moves: boardFieldIdx[];

    constructor(startField: boardFieldIdx) {
        const offsetsKnight = [
            { colOffset: -1, rowOffset: -2 }, { colOffset: 1, rowOffset: -2 },
            { colOffset: -2, rowOffset: -1 }, { colOffset: 2, rowOffset: -1 },
            { colOffset: -2, rowOffset: 1 }, { colOffset: 2, rowOffset: 1 },
            { colOffset: -1, rowOffset: 2 }, { colOffset: 1, rowOffset: 2 },
        ];
        this.moves = [];
        for (const f of offsetsKnight) {
            let newField = { colIdx: startField.colIdx + f.colOffset, rowIdx: startField.rowIdx + f.rowOffset };
            if (isFieldOnBoard(newField.colIdx, newField.rowIdx)) {
                this.moves.push(newField);
            }
        }
    }
}

export class ChessBoard {

    readonly initialBoardFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    private board: piece[][] = []; // col/row : [0][0]="a8" .. [7][7]="h1"
    private nextMoveBy: color = color.white;
    private canCastleShortWhite: boolean = true;
    private canCastleLongWhite: boolean = true;
    private canCastleShortBlack: boolean = true;
    private canCastleLongBlack: boolean = true;
    private enPassantPossible: boolean = false;
    private enPassantField: boardFieldIdx | undefined;
    private halfMoves50: number = 0;
    private moveNumber: number = 1;

    private _blackKingPosition!: boardFieldIdx;
    private _whiteKingPosition!: boardFieldIdx;
    private _emptyBoard: boolean = true;
    private _attackedFields!: AttackedFields;

    constructor() {
        // allocate and initialize a empty board
        for (let col = 0; col < 8; col++) {
            this.board[col] = [];
            for (let row = 0; row < 8; row++) {
                this.board[col][row] = NOPIECE;
            }
        }
        this._attackedFields = new AttackedFields();
        this.clearBoard();
    }

    clearBoard() {
        this._emptyBoard = true;
        for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 8; row++) {
                this.board[col][row] = NOPIECE;
            }
        }
        this.nextMoveBy = color.white;
        this.canCastleShortWhite = true;
        this.canCastleLongWhite = true;
        this.canCastleShortBlack = true;
        this.canCastleLongBlack = true;
        this.enPassantPossible = false;
        this.enPassantField = { colIdx: 0, rowIdx: 0 };
        this.halfMoves50 = 0;
        this.moveNumber = 1;
        this.clearAttackedFields();
    }

    loadFEN(fen: string) {
        try {
            this.clearAttackedFields();
            let fenTokens = fen.split(/\s+/);
            if (fenTokens.length !== 6) throw new Error('loadFEN(): unexpected number of FEN-token');
            //1. piece positions
            let boardRows = fenTokens[0].split('/');
            if (boardRows.length !== 8) throw new Error('loadFEN(): unexpected number of rows in position');
            for (let rowIdx = 0; rowIdx < 8; rowIdx++) {
                const fenRow = boardRows[rowIdx];
                if (fenRow.length > 8 || fenRow.length === 0) throw new Error('loadFEN(): unexpected number of columns in position');
                let colIdx = 0;
                for (let p = 0; p < fenRow.length; p++) {
                    let digit = parseInt(fenRow[p], 10);
                    if (isNaN(digit)) { // it's a piece
                        let pResult = charToPiece(fenRow[p]);
                        if (!pResult.valid) throw new Error('loadFEN(): unexpected piece');
                        if (colIdx >= 8) throw new Error('loadFEN(): too many pieces/columns in row');
                        this.board[colIdx++][rowIdx] = pResult.piece;
                    }
                    else {
                        if (digit <= 0 || digit > 8) throw new Error('loadFEN(): unexpected digit in position');
                        while (digit > 0) {
                            this.board[colIdx++][rowIdx] = NOPIECE;
                            digit--;
                        }
                    }
                }
            }
            // board validation
            let blackPieces = this.currentPiecesOnBoard(color.black);
            let blackKings = blackPieces.filter(val => (val.piece.kind == pieceKind.King && val.piece.color == color.black));
            if (blackKings.length != 1) throw new Error('loadFEN(): unexpected number of black kings');
            this._blackKingPosition = blackKings[0].field;
            let blackPawns = blackPieces.filter(val => (val.piece.kind == pieceKind.Pawn && val.piece.color == color.black));
            if (blackPawns.length > 8) throw new Error('loadFEN(): too many black pawns');

            let whitePieces = this.currentPiecesOnBoard(color.white);
            let whiteKings = whitePieces.filter(val => (val.piece.kind == pieceKind.King && val.piece.color == color.white));
            this._whiteKingPosition = whiteKings[0].field;
            if (whiteKings.length != 1) throw new Error('loadFEN(): unexpected number of white kings');
            let whitePawns = whitePieces.filter(val => (val.piece.kind == pieceKind.Pawn && val.piece.color == color.white));
            if (whitePawns.length > 8) throw new Error('loadFEN(): too many white pawns');

            // TODO check for mate
            // TODO check for stale mate

            //2. player to move next
            switch (fenTokens[1]) {
                case 'w': this.nextMoveBy = color.white; break;
                case 'b': this.nextMoveBy = color.black; break;
                default: throw new Error('loadFEN(): illegal player to move');
            }

            //3. castle options
            this.canCastleShortWhite = (fenTokens[2].indexOf('K') > -1);
            this.canCastleLongWhite = (fenTokens[2].indexOf('Q') > -1);
            this.canCastleShortBlack = (fenTokens[2].indexOf('k') > -1);
            this.canCastleLongBlack = (fenTokens[2].indexOf('q') > -1);
            // TODO check if none specified must be '-' (strict mode)

            //4. en passant
            this.enPassantPossible = (fenTokens[3] !== '-');
            if (this.enPassantPossible) {
                if (fenTokens[3].length != 2) throw new Error('loadFEN(): en passant unexpected format');
                this.enPassantField = this.fieldIdx(fenTokens[3][0], fenTokens[3][1]);
            }

            //5. number of half-moves since last capture or pawn move
            this.halfMoves50 = parseInt(fenTokens[4], 10);
            if (isNaN(this.halfMoves50)) throw new Error('loadFEN(): number of half-moves NAN');

            //6. next move number
            this.moveNumber = parseInt(fenTokens[5], 10);
            if (isNaN(this.moveNumber)) throw new Error('loadFEN(): moveNumber NAN');
            if (this.moveNumber <= 0) throw new Error('loadFEN(): moveNumber negative/zero');

            this._emptyBoard = false;
        }
        catch (err) {
            this.clearBoard();
            throw err;
        }
    }



    toASCII(): string[] {
        // display board as ascii string array 
        let result: string[] = [];

        result.push(' -------------------------------');
        for (let row = 0; row < 8; row++) { // as White
            //for (let row = 7; row >= 0; row--) { // as Black
            let line = "| ";
            for (let col = 0; col < 8; col++) {
                line += pieceToChar(this.board[col][row]) + (col < 7 ? ' | ' : ' |');
            }
            result.push(line);
            result.push(' -------------------------------');
        }

        result.push('next move color: ' + ((this.nextMoveBy == color.white) ? 'White' : 'Black'));
        result.push('Possible Castle White O-O:' + (this.canCastleShortWhite ? 'Y' : 'N') + ', O-O-O:' + (this.canCastleLongWhite ? 'Y' : 'N'));
        result.push('Possible Castle Black O-O:' + (this.canCastleShortBlack ? 'Y' : 'N') + ', O-O-O:' + (this.canCastleLongBlack ? 'Y' : 'N'));
        if (this.enPassantPossible) {
            result.push('en passant option at ' + this.fieldNotation(this.enPassantField as boardFieldIdx));
        }
        result.push('moves without pawn or capture: ' + this.halfMoves50);
        result.push('move number: ' + this.moveNumber);

        return result;
    }

    /*private*/move(src: boardFieldIdx, targ: boardFieldIdx, piece: piece) {

    }

    peekField(field: boardFieldIdx): piece {
        return this.board[field.colIdx][field.rowIdx];
    }

    currentPiecesOnBoard(color_: color): pieceOnBoard[] {
        let result: pieceOnBoard[] = [];
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                let p = this.peekField({ colIdx: c, rowIdx: r });
                if (p.kind != pieceKind.none && p.color == color_) {
                    result.push({ piece: p, field: { colIdx: c, rowIdx: r } });
                }
            }
        }
        return result;
    }

    getKingField(color_: color): boardFieldIdx {
        if (this._emptyBoard) throw new Error('getKing() operation on empty board');
        switch (color_) {
            case color.black: return this._blackKingPosition;
            case color.white: return this._whiteKingPosition;
        }
        //throw new Error('getKing() unexpected color'); // unreachable code :-)
    }


    getAttackedFieldsByRook(piece: pieceOnBoard): boardFieldIdx[] {
        let rookMoves: boardFieldIdx[] = [];
        let f: boardFieldIdx;
        const rays = [rookRay.ray1, rookRay.ray2, rookRay.ray3, rookRay.ray4];
        let rookMovesRaw = new RookMovesRaw(piece.field);
        for (const ray of rays) {
            let moveRay = rookMovesRaw.getRay(ray);
            for (f of moveRay) {
                rookMoves.push(f);
                if (this.peekField(f).kind != pieceKind.none) break;
            }
        }
        return rookMoves;
    }
    getAttackedFieldsByKnight(piece: pieceOnBoard): boardFieldIdx[] {
        let knightMoves = new KnightMovesRaw(piece.field);
        return knightMoves.moves;
    }
    getAttackedFieldsByBishop(piece: pieceOnBoard): boardFieldIdx[] {
        let bishopMoves: boardFieldIdx[] = [];
        let f: boardFieldIdx;
        const rays = [bishopRay.ray1, bishopRay.ray2, bishopRay.ray3, bishopRay.ray4];
        let bishopMovesRaw = new BishopMovesRaw(piece.field);
        for (const ray of rays) {
            let moveRay = bishopMovesRaw.getRay(ray);
            for (f of moveRay) {
                bishopMoves.push(f);
                if (this.peekField(f).kind != pieceKind.none) break;
            }
        }
        /*
        for (const ray of rays) {
            for (f of new BishopRayIt(piece.field, ray)) {
                bishopMoves.push(f);
                if (this.peekField(f).kind != pieceKind.none) break;
            }
        }
        */
        return bishopMoves;
    }
    getAttackedFieldsByQueen(piece: pieceOnBoard): boardFieldIdx[] {
        let queenMoves: boardFieldIdx[] = [];
        let f: boardFieldIdx;

        const raysR = [rookRay.ray1, rookRay.ray2, rookRay.ray3, rookRay.ray4];
        let rookMovesRaw = new RookMovesRaw(piece.field);
        for (const ray of raysR) {
            let moveRay = rookMovesRaw.getRay(ray);
            for (f of moveRay) {
                queenMoves.push(f);
                if (this.peekField(f).kind != pieceKind.none) break;
            }
        }

        const raysB = [bishopRay.ray1, bishopRay.ray2, bishopRay.ray3, bishopRay.ray4];
        let bishopMovesRaw = new BishopMovesRaw(piece.field);
        for (const ray of raysB) {
            let moveRay = bishopMovesRaw.getRay(ray);
            for (f of moveRay) {
                queenMoves.push(f);
                if (this.peekField(f).kind != pieceKind.none) break;
            }
        }
        return queenMoves;
    }
    getAttackedFieldsByPawnBlack(piece: pieceOnBoard): boardFieldIdx[] {
        const offsetsPawn = [
            { colOffset: 1, rowOffset: 1 }, { colOffset: -1, rowOffset: 1 }
        ];
        let pawnCaptureMoves: boardFieldIdx[] = [];
        const startField = piece.field;
        for (const f of offsetsPawn) {
            let newField = { colIdx: startField.colIdx + f.colOffset, rowIdx: startField.rowIdx + f.rowOffset };
            if (isFieldOnBoard(newField.colIdx, newField.rowIdx)) {
                pawnCaptureMoves.push(newField);
            }
        }
        return pawnCaptureMoves;
    }
    getAttackedFieldsByPawnWhite(piece: pieceOnBoard): boardFieldIdx[] {
        const offsetsPawn = [
            { colOffset: 1, rowOffset: -1 }, { colOffset: -1, rowOffset: -1 }
        ];
        let pawnCaptureMoves: boardFieldIdx[] = [];
        const startField = piece.field;
        for (const f of offsetsPawn) {
            let newField = { colIdx: startField.colIdx + f.colOffset, rowIdx: startField.rowIdx + f.rowOffset };
            if (isFieldOnBoard(newField.colIdx, newField.rowIdx)) {
                pawnCaptureMoves.push(newField);
            }
        }
        return pawnCaptureMoves;
    }
    getAttackedFieldsByKing(piece: pieceOnBoard): boardFieldIdx[] {
        let kingMoves = new KingMovesRaw(piece.field);
        return kingMoves.moves;
    }

    getAttackedFieldsByPiece(piece: pieceOnBoard): boardFieldIdx[] {
        switch (piece.piece.kind) {
            case pieceKind.Rook:
                return this.getAttackedFieldsByRook(piece);
            case pieceKind.Knight:
                return this.getAttackedFieldsByKnight(piece);
            case pieceKind.Bishop:
                return this.getAttackedFieldsByBishop(piece);
            case pieceKind.Queen:
                return this.getAttackedFieldsByQueen(piece);
            case pieceKind.King:
                return this.getAttackedFieldsByKing(piece);
            case pieceKind.Pawn:
                switch (piece.piece.color) {
                    case color.black:
                        return this.getAttackedFieldsByPawnBlack(piece);
                    case color.white:
                        return this.getAttackedFieldsByPawnWhite(piece);
                }
            case pieceKind.none:
                throw new Error('getAttackedFieldsByPiece() empty field???');
        }
        return [];
    }

    getAttackedFields(attackingColor: color): AttackedFields {
        if (!this._attackedFields.hasData()) {
            let attackingPieces = this.currentPiecesOnBoard(attackingColor);
            for (let piece of attackingPieces) {
                for (let field of this.getAttackedFieldsByPiece(piece)) {
                    this._attackedFields.add(field, piece);
                }
            }
        }
        return this._attackedFields;
    }
    private clearAttackedFields() {
        this._attackedFields.clear();
    }

    isPieceAttackedOn(field: boardFieldIdx, attackingColor: color): boolean {
        return this.getAttackedFields(attackingColor).isAttacked(field);
    }

    isCheck(color_: color): boolean {
        if (this._emptyBoard) return false;
        return this.isPieceAttackedOn(this.getKingField(color_), otherColor(color_));
    }

    /*
    isPossibleRookMove(source: boardFieldIdx, target: boardFieldIdx, piece_: piece): boolean {
        if (source == target) return false; // TODO value comparision
        if (piece_ != piece.whiteRook && piece_ != piece.blackRook && piece_ != piece.whiteQueen && piece_ != piece.blackQueen) return false;
        if (this.peekField(source) != piece_) return false;

        // check nothing in-between
        if (source.colIdx == target.colIdx) {
            for (let i = source.rowIdx; i != target.rowIdx; i += Math.sign(source.rowIdx - target.rowIdx)) {
                if (this.peekField({ colIdx: source.colIdx, rowIdx: i }) != piece.none) return false;
            }
        }

        //TODO: moving away is not a check
        return (source.colIdx == target.colIdx) || (source.rowIdx == target.rowIdx);
    }
    isPossibleBishopMove(source: boardFieldIdx, target: boardFieldIdx, piece_: piece): boolean {
        if (source == target) return false; // TODO value comparision
        if (piece_ != piece.whiteBishop && piece_ != piece.blackBishop && piece_ != piece.whiteQueen && piece_ != piece.blackQueen) return false;
        if (this.peekField(source) != piece_) return false;

        // TODO: check nothing in-between

        //TODO: moving away is not a check

        return Math.abs(source.colIdx - target.colIdx) == Math.abs(source.rowIdx - target.rowIdx);
    }
    isPossibleQueenMove(source: boardFieldIdx, target: boardFieldIdx, piece_: piece): boolean {
        if (source == target) return false; // TODO value comparision
        if (piece_ != piece.whiteQueen && piece_ != piece.blackQueen) return false;
        if (this.peekField(source) != piece_) return false;

        //TODO: moving away is not a check

        return this.isPossibleRookMove(source, target, piece_) || this.isPossibleBishopMove(source, target, piece_);
    }
    isPossibleKnightMove(source: boardFieldIdx, target: boardFieldIdx, piece_: piece): boolean {
        if (source == target) return false; // TODO value comparision
        if (piece_ != piece.whiteKnight && piece_ != piece.blackKnight) return false;
        if (this.peekField(source) != piece_) return false;

        //TODO: moving away is not a check

        return ((Math.abs(source.rowIdx - target.rowIdx) == 2 && Math.abs(source.colIdx - target.colIdx) == 1) ||
            (Math.abs(source.rowIdx - target.rowIdx) == 1 && Math.abs(source.colIdx - target.colIdx) == 2));
    }
     isPossiblePawnMoveWhite(source: boardFieldIdx, target: boardFieldIdx): boolean {
        if (source == target) return false; // TODO value comparision
        if (this.peekField(source) != piece.whitePawn) return false;
        //TODO: moving away is not a check
        return (((source.colIdx == target.colIdx) && (source.rowIdx == target.rowIdx + 1)) && (this.peekField(target) == piece.none)) ||
            (((source.colIdx == target.colIdx) && (source.rowIdx == 6) && (target.rowIdx == 4)) && (this.peekField(target) == piece.none)) ||
            ((Math.abs(source.colIdx - target.colIdx) == 1) && (source.rowIdx - target.rowIdx == 1) && (this.peekField(target) != piece.none)) ||
            (this.enPassantPossible && (target == this.enPassantField));
    }
    isPossiblePawnMoveBlack(source: boardFieldIdx, target: boardFieldIdx): boolean {
        // if (this.peekField(source) != piece.Pawn) return false;
        //TODO: moving away is not a check
        return (((source.colIdx == target.colIdx) && (source.rowIdx == target.rowIdx - 1)) && (this.peekField(target) == piece.none)) ||
            (((source.colIdx == target.colIdx) && (source.rowIdx == 1) && (target.rowIdx == 3)) && (this.peekField(target) == piece.none)) ||
            ((Math.abs(source.colIdx - target.colIdx) == 1) && (source.rowIdx - target.rowIdx == 1) && (this.peekField(target) != piece.none)) ||
            (this.enPassantPossible && (target == this.enPassantField));
    }
    isPossibleKingMove(source: boardFieldIdx, target: boardFieldIdx): boolean {
        // if (this.peekField(source) != piece.King) return false;
        // TODO: target is not in check
        return Math.abs(source.colIdx - target.colIdx) <= 1 && Math.abs(source.rowIdx - target.rowIdx) <= 1;
    }

    // TODO isPossibleCastle..

    */


    setPiece(col: string, row: string, piece: piece) {
        // placement of pieces to set-up a board.
        // TODO validate board in the end of setup.
        const p = this.fieldIdx(col as string, row as string);
        //this.board[p.colIdx][p.rowIdx] = piece;
        this.setPieceIdx(p.colIdx, p.rowIdx, piece);
    }

    private setPieceIdx(col: number, row: number, piece: piece) {
        this.board[col as number][row as number] = piece;
    }

    fieldIdx(col: string, row: string): boardFieldIdx {
        // convert chess notation of field (like e4) to index on board
        const colidx = (col[0].charCodeAt(0) - 'a'.charCodeAt(0));
        const rowidx = 8 - parseInt(row[0], 10)
        if (colidx < 0 || colidx >= 8) throw new Error('unexpected column');
        if (rowidx < 0 || rowidx >= 8) throw new Error('unexpected row');
        return { colIdx: colidx, rowIdx: rowidx };
    }

    private fieldNotation(field: boardFieldIdx): string {
        // convert internal field representation to normal string representation
        const cols = 'abcdefgh';
        let result = cols[field.colIdx] + (8 - field.rowIdx).toString();
        return result;
    }

}