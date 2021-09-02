
export const enum pieceKind {
    Rook,
    Knight,
    Bishop,
    Queen,
    King,
    Pawn,
    none,
}

function isLegalPromotionPiece(kind_: pieceKind): boolean {
    return kind_ != pieceKind.none && kind_ != pieceKind.Pawn && kind_ != pieceKind.King
}

export const enum color {
    black = 'Black',
    white = 'White',
}

function otherColor(color_: color) {
    switch (color_) {
        case color.black: return color.white
        case color.white: return color.black;
    }
}

export class Piece {
    private _kind: pieceKind
    private _color?: color
    constructor(kind_: pieceKind, color_?: color) {
        this._kind = kind_
        this._color = color_
    }
    get kind() { return this._kind }
    get color() { return this._color }
    get isNone() { return this._kind === pieceKind.none }
    get isEmpty() { return this._kind === pieceKind.none }
    get isPiece() { return this._kind !== pieceKind.none }
    same(p: Piece) { return this._kind == p.kind && this._color == p.color }

    private static _none = new Piece(pieceKind.none)
    private static _blackRook = new Piece(pieceKind.Rook, color.black)
    private static _blackKnight = new Piece(pieceKind.Knight, color.black)
    private static _blackBishop = new Piece(pieceKind.Bishop, color.black)
    private static _blackQueen = new Piece(pieceKind.Queen, color.black)
    private static _blackKing = new Piece(pieceKind.King, color.black)
    private static _blackPawn = new Piece(pieceKind.Pawn, color.black)
    private static _whiteRook = new Piece(pieceKind.Rook, color.white)
    private static _whiteKnight = new Piece(pieceKind.Knight, color.white)
    private static _whiteBishop = new Piece(pieceKind.Bishop, color.white)
    private static _whiteQueen = new Piece(pieceKind.Queen, color.white)
    private static _whiteKing = new Piece(pieceKind.King, color.white)
    private static _whitePawn = new Piece(pieceKind.Pawn, color.white)
    static none() { return Piece._none }
    static blackRook() { return Piece._blackRook }
    static blackKnight() { return Piece._blackKnight }
    static blackBishop() { return Piece._blackBishop }
    static blackQueen() { return Piece._blackQueen }
    static blackKing() { return Piece._blackKing }
    static blackPawn() { return Piece._blackPawn }
    static whiteRook() { return Piece._whiteRook }
    static whiteKnight() { return Piece._whiteKnight }
    static whiteBishop() { return Piece._whiteBishop }
    static whiteQueen() { return Piece._whiteQueen }
    static whiteKing() { return Piece._whiteKing }
    static whitePawn() { return Piece._whitePawn }
    static getPiece(kind_: pieceKind, color_: color): Piece {
        switch (color_) {
            case color.black:
                switch (kind_) {
                    case pieceKind.Rook: return Piece.blackRook()
                    case pieceKind.Knight: return Piece.blackKnight()
                    case pieceKind.Bishop: return Piece.blackBishop()
                    case pieceKind.Queen: return Piece.blackQueen()
                    case pieceKind.King: return Piece.blackKing()
                    case pieceKind.Pawn: return Piece.blackPawn()
                }
                break;
            case color.white:
                switch (kind_) {
                    case pieceKind.Rook: return Piece.whiteRook()
                    case pieceKind.Knight: return Piece.whiteKnight()
                    case pieceKind.Bishop: return Piece.whiteBishop()
                    case pieceKind.Queen: return Piece.whiteQueen()
                    case pieceKind.King: return Piece.whiteKing()
                    case pieceKind.Pawn: return Piece.whitePawn()
                }
        }
        return Piece.none()
    }
}

function pieceToChar(p: Piece): string {
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

export function charFENToPiece(pieceStr: string): { valid: boolean, piece: Piece } {

    switch (pieceStr) {
        case 'R': return { valid: true, piece: Piece.whiteRook() }
        case 'N': return { valid: true, piece: Piece.whiteKnight() }
        case 'B': return { valid: true, piece: Piece.whiteBishop() }
        case 'Q': return { valid: true, piece: Piece.whiteQueen() }
        case 'K': return { valid: true, piece: Piece.whiteKing() }
        case 'P': return { valid: true, piece: Piece.whitePawn() }

        case 'r': return { valid: true, piece: Piece.blackRook() }
        case 'n': return { valid: true, piece: Piece.blackKnight() }
        case 'b': return { valid: true, piece: Piece.blackBishop() }
        case 'q': return { valid: true, piece: Piece.blackQueen() }
        case 'k': return { valid: true, piece: Piece.blackKing() }
        case 'p': return { valid: true, piece: Piece.blackPawn() }

        default:
            return { valid: false, piece: Piece.none() }
    }
}
function charPGNToPiece(pieceStr: string, color_: color): { valid: boolean, piece: Piece } {

    switch (pieceStr) {
        case 'R': return { valid: true, piece: (color_ == color.black) ? Piece.blackRook() : Piece.whiteRook() }
        case 'N': return { valid: true, piece: (color_ == color.black) ? Piece.blackKnight() : Piece.whiteKnight() }
        case 'B': return { valid: true, piece: (color_ == color.black) ? Piece.blackBishop() : Piece.whiteBishop() }
        case 'Q': return { valid: true, piece: (color_ == color.black) ? Piece.blackQueen() : Piece.whiteQueen() }
        case 'K': return { valid: true, piece: (color_ == color.black) ? Piece.blackKing() : Piece.whiteKing() }
        case 'P': return { valid: true, piece: (color_ == color.black) ? Piece.blackPawn() : Piece.whitePawn() }

        default:
            return { valid: false, piece: Piece.none() }
    }
}


export function strToFieldIdx(fieldStr: string): boardFieldIdx {
    if (fieldStr.length != 2)
        throw new Error('unexpected string length for field (should be 2)')
    // convert chess notation of field (like e4) to index on board
    const colidx = getColIdx(fieldStr) //(fieldStr[0].charCodeAt(0) - 'a'.charCodeAt(0))
    const rowidx = getRowIdx(fieldStr) //8 - parseInt(fieldStr[1], 10)
    if (colidx < 0 || colidx >= 8)
        throw new Error('unexpected column')
    if (rowidx < 0 || rowidx >= 8)
        throw new Error('unexpected row')
    return { colIdx: colidx, rowIdx: rowidx }
}
function strToFieldIdxQuiet(fieldStr: string): boardFieldIdx | undefined {
    try {
        return strToFieldIdx(fieldStr)
    }
    catch (err) {
        return undefined
    }
}
function getColIdx(str: string, idx: number = 0): number {
    return (str[0].charCodeAt(idx) - 'a'.charCodeAt(idx))
}
function getRowIdx(str: string, idx: number = 1): number {
    return 8 - parseInt(str[idx], 10)
}
function fieldIdxToNotation(field: boardFieldIdx): string {
    // convert internal field representation to normal string representation
    const cols = 'abcdefgh'
    let result = cols[field.colIdx] + (8 - field.rowIdx).toString()
    return result
}

type boardFieldIdx = {
    colIdx: number,
    rowIdx: number
}

type fieldOffset = {
    dCol: number,
    dRow: number
}
const offsets = {
    N: { dCol: 0, dRow: -1 },
    W: { dCol: 1, dRow: 0 },
    S: { dCol: 0, dRow: 1 },
    E: { dCol: -1, dRow: 0 },
    NW: { dCol: 1, dRow: -1 },
    SW: { dCol: 1, dRow: 1 },
    SE: { dCol: -1, dRow: 1 },
    NE: { dCol: -1, dRow: -1 },
    //--- Knight moves
    NNE: { dCol: -1, dRow: -2 },
    NNW: { dCol: 1, dRow: -2 },
    SSE: { dCol: -1, dRow: 2 },
    SSW: { dCol: 1, dRow: 2 },
    WWN: { dCol: 2, dRow: -1 },
    WWS: { dCol: 2, dRow: 1 },
    EEN: { dCol: -2, dRow: -1 },
    EES: { dCol: -2, dRow: 1 },
}
function shiftField(field: boardFieldIdx, offset: fieldOffset, factor: number = 1) {
    return { colIdx: field.colIdx + offset.dCol * factor, rowIdx: field.rowIdx + offset.dRow * factor }
}
function boardFieldsAreEqual(f1: boardFieldIdx, f2: boardFieldIdx): boolean {
    return f1.colIdx == f2.colIdx && f1.rowIdx == f2.rowIdx
}
function fieldIdx(colIdx_: number, rowIdx_: number) {
    return { colIdx: colIdx_, rowIdx: rowIdx_ }
}
function isFieldOnBoard(field: boardFieldIdx) {
    return (field.colIdx >= 0 && field.colIdx < 8 && field.rowIdx >= 0 && field.rowIdx < 8)
}

type pieceOnBoard = {
    piece: Piece,
    field: boardFieldIdx
};

type moveOnBoard = {
    pieceOB: pieceOnBoard,
    target: boardFieldIdx,
    // pawn promotion
    promotionPiece?: pieceKind;
    // castle
    pieceRook?: pieceOnBoard,
    targetRook?: boardFieldIdx,
    // captured/replaced Piece
    pieceCaptured?: pieceOnBoard,
};

type attackedBy = {
    field: boardFieldIdx,  // attacked field
    attackingPieces: pieceOnBoard[]
}
class AttackedFields {
    private _fields: attackedBy[]
    constructor() {
        this._fields = []
    }
    add(attackedField: boardFieldIdx, attackingPiece: pieceOnBoard) {
        let found = this._fields.find(x => (x.field.colIdx == attackedField.colIdx && x.field.rowIdx == attackedField.rowIdx))
        if (found)
            found.attackingPieces.push(attackingPiece)
        else
            this._fields.push({ field: attackedField, attackingPieces: [attackingPiece] })
    }
    clear() {
        this._fields = []
    }
    isAttacked(field: boardFieldIdx): boolean {
        let found = this._fields.find(x => (x.field.colIdx == field.colIdx && x.field.rowIdx == field.rowIdx))
        return (typeof found !== 'undefined')
    }
    attackersOn(field: boardFieldIdx): pieceOnBoard[] {
        let found = this._fields.find(x => (x.field.colIdx == field.colIdx && x.field.rowIdx == field.rowIdx))
        if (typeof found == 'undefined') return []
        return found!.attackingPieces
    }
    attackedFields(): boardFieldIdx[] {
        let result: boardFieldIdx[] = []
        for (let attacked of this._fields) {
            result.push(attacked.field)
        }
        return result
    }
    hasData() {
        return this._fields.length > 0
    }
}

const enum bishopRay { // 1-2,3-4 are opposites
    SW = 'SE',
    NE = 'NE',
    NW = 'NW',
    SE = 'SE',
}
class BishopMovesRaw {
    moves_SW: boardFieldIdx[]
    moves_NE: boardFieldIdx[]
    moves_NW: boardFieldIdx[]
    moves_SE: boardFieldIdx[]
    constructor(startField: boardFieldIdx) {
        this.moves_SW = this.generateRay(startField, offsets.SW)
        this.moves_NE = this.generateRay(startField, offsets.NE)
        this.moves_NW = this.generateRay(startField, offsets.NW)
        this.moves_SE = this.generateRay(startField, offsets.SE)
    }
    private generateRay(startField: boardFieldIdx, offset: fieldOffset): boardFieldIdx[] {
        let moves: boardFieldIdx[] = []
        for (let i = 1; i < 8; i++) {
            let newField = shiftField(startField, offset, i)
            if (isFieldOnBoard(newField)) {
                moves.push(newField)
            }
            else break
        }
        return moves
    }
    getRay(ray: bishopRay): boardFieldIdx[] {
        switch (ray) {
            case bishopRay.SW: return this.moves_SW
            case bishopRay.NE: return this.moves_NE
            case bishopRay.NW: return this.moves_NW
            case bishopRay.SE: return this.moves_SE
        }
        return []; // unreachable
    }
}
/* optional implementation with iterator
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
function isOffsetBishopLike(source: boardFieldIdx, target: boardFieldIdx): { valid: boolean, ray?: bishopRay } {
    if (Math.abs(source.rowIdx - target.rowIdx) == Math.abs(source.colIdx - target.colIdx)) {
        if (source.colIdx > target.colIdx) {
            if (source.rowIdx > target.rowIdx)  // - -
                return { valid: true, ray: bishopRay.NE }
            else                                // - +
                return { valid: true, ray: bishopRay.SE }
        }
        else {
            if (source.rowIdx > target.rowIdx)  // + -
                return { valid: true, ray: bishopRay.NW }
            else                                // + +
                return { valid: true, ray: bishopRay.SW }
        }
    }
    return { valid: false };
}


const enum rookRay {// 1-2,3-4 are opposites
    W = 'W',
    E = 'E',
    S = 'S',
    N = 'N',
}

class RookMovesRaw {
    moves_W: boardFieldIdx[]
    moves_E: boardFieldIdx[]
    moves_S: boardFieldIdx[]
    moves_N: boardFieldIdx[]
    constructor(startField: boardFieldIdx) {
        this.moves_W = this.generateRay(startField, offsets.W)
        this.moves_E = this.generateRay(startField, offsets.E)
        this.moves_S = this.generateRay(startField, offsets.S)
        this.moves_N = this.generateRay(startField, offsets.N)

    }
    private generateRay(startField: boardFieldIdx, offset: fieldOffset): boardFieldIdx[] {
        let moves: boardFieldIdx[] = []
        for (let i = 1; i < 8; i++) {
            let newField = shiftField(startField, offset, i)
            if (isFieldOnBoard(newField)) {
                moves.push(newField)
            }
            else break
        }
        return moves
    }
    getRay(ray: rookRay): boardFieldIdx[] {
        switch (ray) {
            case rookRay.W: return this.moves_W
            case rookRay.E: return this.moves_E
            case rookRay.S: return this.moves_S
            case rookRay.N: return this.moves_N
        }
        //return []; // unreachable
    }
}
/* optional implementation with iterator
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
function isOffsetRookLike(source: boardFieldIdx, target: boardFieldIdx): { valid: boolean, ray?: rookRay } {
    if ((source.rowIdx == target.rowIdx) || (source.colIdx == target.colIdx)) {
        if (source.colIdx == target.colIdx) {
            if (source.rowIdx < target.rowIdx)
                return { valid: true, ray: rookRay.S } // 0 +
            else
                return { valid: true, ray: rookRay.N } // 0 -
        }
        else { // source.rowIdx == target.rowIdx
            if (source.colIdx < target.colIdx)
                return { valid: true, ray: rookRay.W } // + 0
            else
                return { valid: true, ray: rookRay.E } // - 0
        }
    }
    return { valid: false }
}

enum castleType {
    short,
    long
}
const CASTLE_SHORT = 'O-O'
const CASTLE_LONG = 'O-O-O'
const KING_TARGET_COL_CASTLE_SHORT = 6
const KING_TARGET_COL_CASTLE_LONG = 2

type castleData = {
    kingSource: boardFieldIdx
    kingTarget: boardFieldIdx
    rookSource: boardFieldIdx
    rookTarget: boardFieldIdx
    kingPiece: Piece
    rookPiece: Piece
    row: number
    kingPathCols: { start: number, end: number }
    betweenPathCols: { start: number, end: number }
}
class KingMovesRaw {
    moves: boardFieldIdx[]

    constructor(startField: boardFieldIdx) {
        const offsetsKing = [
            offsets.NE,
            offsets.N,
            offsets.NW,
            offsets.E,
            offsets.W,
            offsets.SE,
            offsets.S,
            offsets.SW,
        ];
        this.moves = [];
        for (const f of offsetsKing) {
            let newField = shiftField(startField, f)
            if (isFieldOnBoard(newField)) {
                this.moves.push(newField)
            }
        }
    }

    static castle(color_: color, type_: castleType): castleData {
        let rowIdx_ = (color_ == color.black) ? 0 : 7

        return {
            kingSource: { colIdx: (type_ == castleType.short) ? 4 : 4, rowIdx: rowIdx_ },
            kingTarget: { colIdx: (type_ == castleType.short) ? 6 : 2, rowIdx: rowIdx_ },
            rookSource: { colIdx: (type_ == castleType.short) ? 7 : 0, rowIdx: rowIdx_ },
            rookTarget: { colIdx: (type_ == castleType.short) ? 5 : 3, rowIdx: rowIdx_ },
            kingPiece: (color_ == color.black) ? Piece.blackKing() : Piece.whiteKing(),
            rookPiece: (color_ == color.black) ? Piece.blackRook() : Piece.whiteRook(),
            row: rowIdx_,
            kingPathCols: { start: (type_ == castleType.short) ? 4 : 2, end: (type_ == castleType.short) ? 6 : 4 },
            betweenPathCols: { start: (type_ == castleType.short) ? 5 : 1, end: (type_ == castleType.short) ? 6 : 3 }
        }
    }
}

class KnightMovesRaw {
    moves: boardFieldIdx[]

    constructor(startField: boardFieldIdx) {
        const offsetsKnight = [
            offsets.NNE, offsets.NNW,
            offsets.SSE, offsets.SSW,
            offsets.WWN, offsets.WWS,
            offsets.EEN, offsets.EES
        ];
        this.moves = []
        for (const f of offsetsKnight) {
            let newField = shiftField(startField, f)
            if (isFieldOnBoard(newField)) {
                this.moves.push(newField)
            }
        }
    }
}
/*
class PawnMoves {
    
}
*/
export type ChessBoardData = {
    nextMoveBy: color
    canCastleShortWhite: boolean
    canCastleLongWhite: boolean
    canCastleShortBlack: boolean
    canCastleLongBlack: boolean
    enPassantPossible: boolean
    enPassantField: boardFieldIdx | undefined
    halfMoves50: number
    moveNumber: number
    gameOver: boolean // meaning: no further moves are allowed.
}

export class ChessBoard {

    readonly initialBoardFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

    private board: Piece[][] = [] // col/row : [0][0]="a8" .. [7][7]="h1"
    private history: moveOnBoard[] = []
    private data!: ChessBoardData

    private _emptyBoard: boolean = true
    private _fieldsAttackedByBlack: AttackedFields
    private _fieldsAttackedByWhite: AttackedFields

    constructor(fen?: string) {
        // allocate and initialize a empty board
        for (let col = 0; col < 8; col++) {
            this.board[col] = []
            for (let row = 0; row < 8; row++) {
                this.board[col][row] = Piece.none()
            }
        }
        this._fieldsAttackedByBlack = new AttackedFields()
        this._fieldsAttackedByWhite = new AttackedFields()
        this.clearBoard()
        if (fen) this.loadFEN(fen);
    }

    clearBoard() {
        this._emptyBoard = true
        for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 8; row++) {
                this.board[col][row] = Piece.none()
            }
        }
        this.history = []
        this.data = {
            nextMoveBy: color.white,
            canCastleShortWhite: false,
            canCastleLongWhite: false,
            canCastleShortBlack: false,
            canCastleLongBlack: false,
            enPassantPossible: false,
            enPassantField: undefined,
            halfMoves50: 0,
            moveNumber: 1,
            gameOver: true,
        }
        this.clearAttackedFields()
    }

    loadFEN(fen: string) {
        try {
            this.clearAttackedFields()
            let fenTokens = fen.split(/\s+/)
            if (fenTokens.length !== 6) throw new Error('loadFEN(): unexpected number of FEN-token')
            //1. piece positions
            let boardRows = fenTokens[0].split('/')
            if (boardRows.length !== 8) throw new Error('loadFEN(): unexpected number of rows in position')
            for (let rowIdx = 0; rowIdx < 8; rowIdx++) {
                const fenRow = boardRows[rowIdx]
                if (fenRow.length > 8 || fenRow.length === 0) throw new Error('loadFEN(): unexpected number of columns in position')
                let colIdx = 0
                for (let p = 0; p < fenRow.length; p++) {
                    let digit = parseInt(fenRow[p], 10)
                    if (isNaN(digit)) { // it's a piece
                        let pResult = charFENToPiece(fenRow[p])
                        if (!pResult.valid) throw new Error('loadFEN(): unexpected piece')
                        if (colIdx >= 8) throw new Error('loadFEN(): too many pieces/columns in row')
                        this.board[colIdx++][rowIdx] = pResult.piece
                    }
                    else {
                        if (digit <= 0 || digit > 8) throw new Error('loadFEN(): unexpected digit in position')
                        while (digit > 0) {
                            this.board[colIdx++][rowIdx] = Piece.none()
                            digit--
                        }
                    }
                }
            }
            // board validation
            let blackPieces = this.currentPiecesOnBoard(color.black)
            let blackKings = blackPieces.filter(val => (val.piece.kind == pieceKind.King && val.piece.color == color.black))
            if (blackKings.length != 1) throw new Error('loadFEN(): unexpected number of black kings')
            //this._blackKing = blackKings[0]
            let blackPawns = blackPieces.filter(val => (val.piece.kind == pieceKind.Pawn && val.piece.color == color.black))
            if (blackPawns.length > 8) throw new Error('loadFEN(): too many black pawns')

            let whitePieces = this.currentPiecesOnBoard(color.white)
            let whiteKings = whitePieces.filter(val => (val.piece.kind == pieceKind.King && val.piece.color == color.white))
            if (whiteKings.length != 1) throw new Error('loadFEN(): unexpected number of white kings')
            //this._whiteKing = whiteKings[0]
            let whitePawns = whitePieces.filter(val => (val.piece.kind == pieceKind.Pawn && val.piece.color == color.white))
            if (whitePawns.length > 8) throw new Error('loadFEN(): too many white pawns')

            // TODO check for mate
            // TODO check for stale mate
            // TODO check for GameOver

            //2. player to move next
            switch (fenTokens[1]) {
                case 'w': this.data.nextMoveBy = color.white; break
                case 'b': this.data.nextMoveBy = color.black; break
                default: throw new Error('loadFEN(): illegal player to move')
            }

            //3. castle options
            this.data.canCastleShortWhite = (fenTokens[2].indexOf('K') > -1)
            this.data.canCastleLongWhite = (fenTokens[2].indexOf('Q') > -1)
            this.data.canCastleShortBlack = (fenTokens[2].indexOf('k') > -1)
            this.data.canCastleLongBlack = (fenTokens[2].indexOf('q') > -1)
            // TODO check if none specified must be '-' (strict mode)

            //4. en passant
            this.data.enPassantPossible = (fenTokens[3] !== '-')
            if (this.data.enPassantPossible) {
                if (fenTokens[3].length != 2) throw new Error('loadFEN(): en passant unexpected format')
                this.data.enPassantField = strToFieldIdx(fenTokens[3])
            }

            //5. number of half-moves since last capture or pawn move
            this.data.halfMoves50 = parseInt(fenTokens[4], 10)
            if (isNaN(this.data.halfMoves50)) throw new Error('loadFEN(): number of half-moves NAN')

            //6. next move number
            this.data.moveNumber = parseInt(fenTokens[5], 10)
            if (isNaN(this.data.moveNumber)) throw new Error('loadFEN(): moveNumber NAN')
            if (this.data.moveNumber <= 0) throw new Error('loadFEN(): moveNumber negative/zero')

            this._emptyBoard = false
            this.data.gameOver = this.isGameOver()
        }
        catch (err) {
            this.clearBoard();
            throw err;
        }
    }

    getFEN(): string {
        let fen = ""

        //1. piece positions
        for (let row = 0; row < 8; row++) {
            let emptyCount = 0
            for (let col = 0; col < 8; col++) {
                if (this.board[col][row].isEmpty)
                    emptyCount++
                else {
                    if (emptyCount > 0) {
                        fen += emptyCount
                        emptyCount = 0;
                    }
                    fen += pieceToChar(this.board[col][row])
                }
            }
            if (emptyCount > 0)
                fen += emptyCount
            if (row < 7) fen += '/'
        }
        fen += ' '

        //2. player to move next
        switch (this.data.nextMoveBy) {
            case color.black: fen += 'b'; break
            case color.white: fen += 'w'
        }
        fen += ' '

        //3. castle options
        if (!this.data.canCastleLongBlack && !this.data.canCastleShortBlack && !this.data.canCastleLongWhite && !this.data.canCastleShortWhite)
            fen += '-'
        else {
            if (this.data.canCastleShortWhite) fen += 'K'
            if (this.data.canCastleLongWhite) fen += 'Q'
            if (this.data.canCastleShortBlack) fen += 'k'
            if (this.data.canCastleLongBlack) fen += 'q'
        }
        fen += ' '

        //4. en passant
        if (!this.data.enPassantPossible)
            fen += '-'
        else
            fen += fieldIdxToNotation(this.data.enPassantField!)
        fen += ' '

        //5. number of half-moves since last capture or pawn move
        fen += this.data.halfMoves50 + ' '

        //6. next move number
        fen += this.data.moveNumber

        return fen
    }

    toASCII(): string[] {
        // display board as ascii string array 
        let result: string[] = []

        result.push(' -------------------------------')
        for (let row = 0; row < 8; row++) { // as White
            //for (let row = 7; row >= 0; row--) { // as Black
            let line = "| "
            for (let col = 0; col < 8; col++) {
                line += pieceToChar(this.board[col][row]) + (col < 7 ? ' | ' : ' |')
            }
            result.push(line)
            result.push(' -------------------------------')
        }

        result.push('next move color: ' + ((this.data.nextMoveBy == color.white) ? 'White' : 'Black'))
        result.push('Possible Castle White O-O:' + (this.data.canCastleShortWhite ? 'Y' : 'N') + ', O-O-O:' + (this.data.canCastleLongWhite ? 'Y' : 'N'))
        result.push('Possible Castle Black O-O:' + (this.data.canCastleShortBlack ? 'Y' : 'N') + ', O-O-O:' + (this.data.canCastleLongBlack ? 'Y' : 'N'))
        if (this.data.enPassantPossible) {
            result.push('en passant option at ' + fieldIdxToNotation(this.data.enPassantField!))
        }
        result.push('moves without pawn or capture: ' + this.data.halfMoves50)
        result.push('move number: ' + this.data.moveNumber)
        //TODO add gameOver status
        return result
    }

    peekField(field: boardFieldIdx): Piece {
        return this.board[field.colIdx][field.rowIdx]
    }
    peekFieldPieceOB(field_: boardFieldIdx): pieceOnBoard {
        return { piece: this.peekField(field_), field: field_ }
    }
    isFieldEmpty(field: boardFieldIdx): boolean {
        return this.peekField(field).isEmpty
    }
    isCaptureOn(field_: boardFieldIdx, color_: color): boolean {
        let _piece = this.peekField(field_)
        return _piece.isPiece && _piece.color == otherColor(color_)
    }
    isFieldEmptyOrCapture(field_: boardFieldIdx, color_: color): boolean {
        return this.isFieldEmpty(field_) || this.isCaptureOn(field_, color_)
    }
    isPieceOn(field: boardFieldIdx, p: Piece) {
        return this.peekField(field).same(p)
    }
    canCastle(color_: color, type_: castleType): boolean {
        switch (color_) {
            case color.black:
                switch (type_) {
                    case castleType.short:
                        return this.data.canCastleShortBlack
                    case castleType.long:
                        return this.data.canCastleLongBlack
                }
            case color.white:
                switch (type_) {
                    case castleType.short:
                        return this.data.canCastleShortWhite
                    case castleType.long:
                        return this.data.canCastleLongWhite
                }
        }
    }

    // TODO: add public function of all pieces on board (for the purpose of board display, i.e. public types only)

    currentPiecesOnBoard(color_: color): pieceOnBoard[] {
        let result: pieceOnBoard[] = []
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                let p = this.peekField({ colIdx: c, rowIdx: r })
                if (p.isPiece && p.color == color_) {
                    result.push({ piece: p, field: { colIdx: c, rowIdx: r } })
                }
            }
        }
        return result
    }
    currentKindOfPiecesOnBoard(color_: color, kind_: pieceKind): pieceOnBoard[] {
        let result: pieceOnBoard[] = []
        if (kind_ == pieceKind.none) return []
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                let p = this.peekField({ colIdx: c, rowIdx: r })
                if (p.kind == kind_ && p.color == color_) {
                    result.push({ piece: p, field: { colIdx: c, rowIdx: r } })
                }
            }
        }
        return result
    }

    private getKingField(color_: color): boardFieldIdx {
        if (this._emptyBoard) throw new Error('getKing() operation on empty board')
        let kings = this.currentKindOfPiecesOnBoard(color_, pieceKind.King)
        if (kings.length != 1) throw new Error('getKingField(): unexpected number of kings')
        return kings[0].field
    }

    private getAttackedFieldsByRook(piece: pieceOnBoard): boardFieldIdx[] {
        //TODO handle pins, pinned pieces don't attack (albeit they can check)
        let rookMoves: boardFieldIdx[] = []
        let f: boardFieldIdx
        const rays = [rookRay.W, rookRay.E, rookRay.S, rookRay.N]
        let rookMovesRaw = new RookMovesRaw(piece.field)
        for (const ray of rays) {
            let moveRay = rookMovesRaw.getRay(ray)
            for (f of moveRay) {
                rookMoves.push(f)
                if (!this.isFieldEmpty(f)) break
            }
        }
        return rookMoves;
    }
    private getAttackedFieldsByKnight(piece: pieceOnBoard): boardFieldIdx[] {
        //TODO handle pins
        let knightMoves = new KnightMovesRaw(piece.field)
        return knightMoves.moves
    }
    private getAttackedFieldsByBishop(piece: pieceOnBoard): boardFieldIdx[] {
        //TODO handle pins
        let bishopMoves: boardFieldIdx[] = []
        let f: boardFieldIdx
        const rays = [bishopRay.SW, bishopRay.NE, bishopRay.NW, bishopRay.SE]
        let bishopMovesRaw = new BishopMovesRaw(piece.field)
        for (const ray of rays) {
            let moveRay = bishopMovesRaw.getRay(ray)
            for (f of moveRay) {
                bishopMoves.push(f)
                if (!this.isFieldEmpty(f)) break
            }
        }
        /* optional using iterator
        for (const ray of rays) {
            for (f of new BishopRayIt(piece.field, ray)) {
                bishopMoves.push(f);
                if (this.peekField(f).kind != pieceKind.none) break;
            }
        }
        */
        return bishopMoves
    }
    private getAttackedFieldsByQueen(piece: pieceOnBoard): boardFieldIdx[] {
        //TODO handle pins
        let queenMoves: boardFieldIdx[] = []
        let f: boardFieldIdx

        const raysR = [rookRay.W, rookRay.E, rookRay.S, rookRay.N]
        let rookMovesRaw = new RookMovesRaw(piece.field)
        for (const ray of raysR) {
            let moveRay = rookMovesRaw.getRay(ray)
            for (f of moveRay) {
                queenMoves.push(f);
                if (!this.isFieldEmpty(f)) break
            }
        }

        const raysB = [bishopRay.SW, bishopRay.NE, bishopRay.NW, bishopRay.SE]
        let bishopMovesRaw = new BishopMovesRaw(piece.field)
        for (const ray of raysB) {
            let moveRay = bishopMovesRaw.getRay(ray)
            for (f of moveRay) {
                queenMoves.push(f)
                if (!this.isFieldEmpty(f)) break
            }
        }
        return queenMoves
    }
    private getAttackedFieldsByPawnBlack(piece: pieceOnBoard): boardFieldIdx[] {
        //TODO handle pins
        const offsetsPawn = [offsets.SW, offsets.SE];
        //        const offsetsPawn = [{ colOffset: 1, rowOffset: 1 }, { colOffset: -1, rowOffset: 1 }];
        let pawnCaptureMoves: boardFieldIdx[] = [];
        const startField = piece.field;
        for (const f of offsetsPawn) {
            let newField = shiftField(startField, f)
            //            let newField = { colIdx: startField.colIdx + f.colOffset, rowIdx: startField.rowIdx + f.rowOffset };
            if (isFieldOnBoard(newField)) {
                pawnCaptureMoves.push(newField);
            }
        }
        return pawnCaptureMoves;
    }
    private getAttackedFieldsByPawnWhite(piece: pieceOnBoard): boardFieldIdx[] {
        //TODO handle pins
        const offsetsPawn = [offsets.NW, offsets.NE]
        //        const offsetsPawn = [{ colOffset: 1, rowOffset: -1 }, { colOffset: -1, rowOffset: -1 }]
        let pawnCaptureMoves: boardFieldIdx[] = []
        const startField = piece.field
        for (const f of offsetsPawn) {
            let newField = shiftField(startField, f) // { colIdx: startField.colIdx + f.colOffset, rowIdx: startField.rowIdx + f.rowOffset }
            if (isFieldOnBoard(newField)) {
                pawnCaptureMoves.push(newField)
            }
        }
        // TODO how to handle e.p. here?
        return pawnCaptureMoves
    }
    private getAttackedFieldsByKing(piece: pieceOnBoard): boardFieldIdx[] {
        let kingMoves = new KingMovesRaw(piece.field)
        return kingMoves.moves;
    }

    getAttackedFieldsByPiece(piece: pieceOnBoard): boardFieldIdx[] {
        switch (piece.piece.kind) {
            case pieceKind.Rook:
                return this.getAttackedFieldsByRook(piece)
            case pieceKind.Knight:
                return this.getAttackedFieldsByKnight(piece)
            case pieceKind.Bishop:
                return this.getAttackedFieldsByBishop(piece)
            case pieceKind.Queen:
                return this.getAttackedFieldsByQueen(piece)
            case pieceKind.King:
                return this.getAttackedFieldsByKing(piece)
            case pieceKind.Pawn:
                switch (piece.piece.color) {
                    case color.black:
                        return this.getAttackedFieldsByPawnBlack(piece)
                    case color.white:
                        return this.getAttackedFieldsByPawnWhite(piece)
                }
            case pieceKind.none:
                return []
            // throw new Error('getAttackedFieldsByPiece() empty field???')
        }
    }

    getAttackedFields(attackingColor: color): AttackedFields {
        switch (attackingColor) {
            case color.black:
                if (!this._fieldsAttackedByBlack.hasData()) {
                    let attackingPieces = this.currentPiecesOnBoard(attackingColor)
                    for (let piece of attackingPieces) {
                        for (let field of this.getAttackedFieldsByPiece(piece)) {
                            this._fieldsAttackedByBlack.add(field, piece)
                        }
                    }
                }
                return this._fieldsAttackedByBlack
            case color.white:
                if (!this._fieldsAttackedByWhite.hasData()) {
                    let attackingPieces = this.currentPiecesOnBoard(attackingColor)
                    for (let piece of attackingPieces) {
                        for (let field of this.getAttackedFieldsByPiece(piece)) {
                            this._fieldsAttackedByBlack.add(field, piece)
                        }
                    }
                }
                return this._fieldsAttackedByWhite
        }
    }
    private clearAttackedFields() {
        this._fieldsAttackedByBlack.clear()
        this._fieldsAttackedByWhite.clear()
    }
    /*
        getLegalMovesByKing(pieceOB: pieceOnBoard): boardFieldIdx[] {
            if (pieceOB.piece.kind != pieceKind.King) return [];
            let color_: color = pieceOB.piece.color!;
            let kingMoves = new KingMovesRaw(pieceOB.field).moves;
            let legalMoves: boardFieldIdx[] = [];
            for (let m of kingMoves) {
                let p = this.peekField(m);
                if ((p.kind != pieceKind.none) && (p.color == color_)) continue;
                if (!this.isPieceAttackedOn(m, otherColor(color_))) legalMoves.push(m);
            }
            // TODO hanlde castle
            // castle, if possible
            // not in check, not to be moved over checks and into check
            //
            return legalMoves;
        }
        getLegalMovesByBlackKing(): boardFieldIdx[] {
            return this.getLegalMovesByKing(this._blackKing);
        }
        getLegalMovesByWhiteKing(): boardFieldIdx[] {
            return this.getLegalMovesByKing(this._whiteKing);
    }
    */

    isPieceAttackedOn(field: boardFieldIdx, attackingColor: color): boolean {
        return this.getAttackedFields(attackingColor).isAttacked(field)
    }
    getAttackersOn(field: boardFieldIdx, attackingColor: color): pieceOnBoard[] {
        return this.getAttackedFields(attackingColor).attackersOn(field)
    }

    isCheck(color_: color): boolean {
        if (this._emptyBoard) return false
        return this.isPieceAttackedOn(this.getKingField(color_), otherColor(color_))
    }
    private isMate(color_: color): boolean {
        if (!this.isCheck(color_)) return false
        let kingMoves = new KingMovesRaw(this.getKingField(color_))
        for (let m of kingMoves.moves) {
            let p = this.peekField(m)
            if ((p.kind != pieceKind.none) && (p.color == color_)) continue
            if (!this.isPieceAttackedOn(m, otherColor(color_))) return false
        }
        //TODO check if attackers can be captured.
        return true
    }
    private isStaleMate(): boolean {
        // TODO
        // nothing to move except king
        // not check
        // no legal move for king
        return false
    }
    private check50MovesRule(): boolean {
        // no pawn has moven and no capture for 50 Moves
        // game maybe continued if the player does not claim draw.
        return this.data.halfMoves50 > 100
    }
    private check75MovesRule(): boolean {
        // no pawn has moven and no capture for 75 Moves
        // FIDE Rule (since 1.July 2014) forced and automatic end of game by draw (unless the last move is mate)
        return this.data.halfMoves50 > 100
    }
    private treefoldRepetition(): boolean {
        // 3 identical position (same player to move, same castle rights, same enpassant options, same moves available) each time as the current board
        // game maybe continued if the player does not claim draw.
        return false
    }
    private fivefoldRepetition(): boolean {
        // FIDE Rule (since 1.July 2014) forced and automatic end of game by draw after the 5th positional repetion
        return false
    }
    private drawByDeadPosition(): boolean { // insufficient material
        // no mate possible
        // K vs K
        // K vs K+B
        // K vs K+N
        // K vs K+N+N (option)
        // K+B vs K+B, with Bishops on same color
        return false
    }
    private isGameOver(): boolean {
        // TODO
        //return this.isMate();
        // isStaleMate()
        // fiftyMovesRule()
        // notSufficientMaterial

        // checkThreefoldRepetiton()
        return false
    }

    move(move: string): boolean {
        // allow SAN like formats (not very strict as long as it is parsable, it'll be processed)
        // Strip additional information

        // TODO turn off caste option if a rook is captured
        // TODO use Zobrist Hashing to store positon in History, see https://www.chessprogramming.org/Zobrist_Hashing

        let moveCleanedUp = move.replace(/=/, '').replace(/[+#]?[?!]*$/, '')
        if (moveCleanedUp === CASTLE_SHORT) {
            return this.moveCastle(this.data.nextMoveBy, castleType.short)
        }
        else if (moveCleanedUp === CASTLE_LONG) {
            return this.moveCastle(this.data.nextMoveBy, castleType.long)
        } else {
            var matches = moveCleanedUp.match(
                /([PNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([QRBN])?/
            )
            if (!matches) {
                matches = moveCleanedUp.match(
                    /([PNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([QRBN])?/
                )
            }
            if (matches) {
                var piece = matches[1]
                var from = matches[2]
                var to = matches[3]
                var promotion = matches[4]
                let { valid: validPiece, piece: piece_ } = charPGNToPiece(piece, this.data.nextMoveBy)
                if (!validPiece) { // maybe a pawn
                    piece_ = (this.data.nextMoveBy == color.black) ? Piece.blackPawn() : Piece.whitePawn()
                }
                if (!to) return false
                let target = strToFieldIdxQuiet(to)
                if (!target) return false
                let promotionPiece_: Piece = Piece.none()
                if (!validPiece /* is a pawn */ && promotion) {
                    let { valid: validPiecePromo, piece: promotionPieceIn } = charFENToPiece(promotion);
                    if (!validPiecePromo || (validPiecePromo && !isLegalPromotionPiece(promotionPieceIn.kind)))
                        return false
                    promotionPiece_ = promotionPieceIn
                }
                let source = strToFieldIdxQuiet(from)
                if (source) {
                    let srcPiece = this.peekField(source)
                    if (!validPiece) piece_ = srcPiece
                    else if (!srcPiece.same(piece_)) return false
                }
                else {
                    let { valid: validSource, source: source_ } = this.findSourceByTarget(from, target, piece_, promotionPiece_.kind)
                    if (!validSource) return false
                    source = source_
                }
                return this.moveIdx(source!, target, { promotionPieceKind: promotionPiece_.kind })
            }
        }
        return false
    }

    private findSourceByTarget(from: string, target: boardFieldIdx, piece_: Piece, promotionPiece: pieceKind = pieceKind.none): { valid: boolean, source?: boardFieldIdx } {
        let sourceColIdx: number | undefined = undefined
        let sourceRowIdx: number | undefined = undefined
        if (from.length == 1) {
            sourceColIdx = getColIdx(from, 0)
            sourceRowIdx = getRowIdx(from, 0)
        } else if (from.length == 2) {
            sourceColIdx = getColIdx(from, 0)
            sourceRowIdx = getRowIdx(from, 1)
        }

        switch (piece_.kind) {
            case pieceKind.Rook:
            case pieceKind.Knight:
            case pieceKind.Bishop:
            case pieceKind.Queen:
            case pieceKind.King:
                let candidates = this.currentKindOfPiecesOnBoard(this.data.nextMoveBy, piece_.kind)
                let targetingPieces: pieceOnBoard[] = []
                for (let p of candidates) {
                    if (this.performMovePiece(p, target, /*validateOnly=*/true)) {
                        if ((typeof sourceColIdx !== 'undefined' && p.field.colIdx == sourceColIdx) ||
                            (typeof sourceRowIdx !== 'undefined' && p.field.rowIdx == sourceRowIdx) ||
                            (typeof sourceColIdx === 'undefined' && typeof sourceRowIdx === 'undefined'))
                            targetingPieces.push(p)
                    }
                }
                if (targetingPieces.length != 1) return { valid: false }
                return { valid: true, source: targetingPieces[0].field }
            case pieceKind.Pawn:
                let candidatesP: pieceOnBoard[] = []
                let targetingP: pieceOnBoard[] = []
                let field: boardFieldIdx
                let p: pieceOnBoard
                switch (this.data.nextMoveBy) {
                    case color.black:
                        field = shiftField(target, offsets.N)
                        if (isFieldOnBoard(field)) {
                            p = this.peekFieldPieceOB(field)
                            if (p.piece.kind == pieceKind.Pawn) candidatesP.push(p)
                            else if (target.rowIdx == 3 && p.piece.kind == pieceKind.none) {
                                field = shiftField(field, offsets.N)
                                if (isFieldOnBoard(field)) {
                                    p = this.peekFieldPieceOB(field)
                                    if (p.piece.kind == pieceKind.Pawn) candidatesP.push(p)
                                }
                            }
                        }
                        field = shiftField(target, offsets.NW)
                        if (isFieldOnBoard(field)) {
                            p = this.peekFieldPieceOB(field)
                            if (p.piece.kind == pieceKind.Pawn)
                                if ((typeof sourceColIdx !== 'undefined' && p.field.colIdx == sourceColIdx) || (typeof sourceColIdx == 'undefined'))
                                    candidatesP.push(p)
                        }
                        field = shiftField(target, offsets.NE)
                        if (isFieldOnBoard(field)) {
                            p = this.peekFieldPieceOB(field)
                            if (p.piece.kind == pieceKind.Pawn)
                                if ((typeof sourceColIdx !== 'undefined' && p.field.colIdx == sourceColIdx) || (typeof sourceColIdx == 'undefined'))
                                    candidatesP.push(p)
                        }
                        for (p of candidatesP) {
                            if (this.performMovePawn(p.field, target,/*promotionPiece=*/promotionPiece,/*validateOnly=*/true)) {
                                targetingP.push(p)
                            }
                        }
                        if (targetingP.length != 1) return { valid: false }
                        return { valid: true, source: targetingP[0].field }
                    case color.white:
                        field = shiftField(target, offsets.S)
                        if (isFieldOnBoard(field)) {
                            p = this.peekFieldPieceOB(field)
                            if (p.piece.kind == pieceKind.Pawn) candidatesP.push(p)
                            else if (target.rowIdx == 4 && p.piece.kind == pieceKind.none) {
                                field = shiftField(field, offsets.S)
                                if (isFieldOnBoard(field)) {
                                    p = this.peekFieldPieceOB(field)
                                    if (p.piece.kind == pieceKind.Pawn) candidatesP.push(p)
                                }
                            }
                        }
                        field = shiftField(target, offsets.SW)
                        if (isFieldOnBoard(field)) {
                            p = this.peekFieldPieceOB(field)
                            if (p.piece.kind == pieceKind.Pawn)
                                if ((typeof sourceColIdx !== 'undefined' && p.field.colIdx == sourceColIdx) || (typeof sourceColIdx == 'undefined'))
                                    candidatesP.push(p)
                        }
                        field = shiftField(target, offsets.SE)
                        if (isFieldOnBoard(field)) {
                            p = this.peekFieldPieceOB(field)
                            if (p.piece.kind == pieceKind.Pawn)
                                if ((typeof sourceColIdx !== 'undefined' && p.field.colIdx == sourceColIdx) || (typeof sourceColIdx == 'undefined'))
                                    candidatesP.push(p)
                        }
                        for (p of candidatesP) {
                            if (this.performMovePawn(p.field, target,/*promotionPiece=*/promotionPiece,/*validateOnly=*/true)) {
                                targetingP.push(p)
                            }
                        }
                        if (targetingP.length != 1) return { valid: false }
                        return { valid: true, source: targetingP[0].field }
                }
        }
        return { valid: false };
    }

    private moveIdx(source: boardFieldIdx, target: boardFieldIdx, optionals?: { promotionPieceKind?: pieceKind, validateOnly?: boolean }): boolean {
        let validateOnly = false;
        let promotionPieceKind = pieceKind.none;
        if (optionals && typeof optionals.validateOnly !== 'undefined') validateOnly = optionals.validateOnly
        if (optionals && typeof optionals.promotionPieceKind !== 'undefined') promotionPieceKind = optionals.promotionPieceKind
        let sourcePieceOB = this.peekFieldPieceOB(source)
        if (sourcePieceOB.piece.kind == pieceKind.none) return false
        if (sourcePieceOB.piece.kind == pieceKind.King && Math.abs(target.colIdx - source.colIdx) == 2) { // castle
            if (target.colIdx == KING_TARGET_COL_CASTLE_SHORT)
                return this.moveCastle(sourcePieceOB.piece.color!, castleType.short, validateOnly)
            else if (target.colIdx == KING_TARGET_COL_CASTLE_LONG)
                return this.moveCastle(sourcePieceOB.piece.color!, castleType.long, validateOnly)
            else return false;
        }
        if (sourcePieceOB.piece.kind == pieceKind.Pawn) return this.performMovePawn(source, target, promotionPieceKind, validateOnly)
        return this.performMovePiece(sourcePieceOB, target, validateOnly);
    }

    private performMovePiece(pieceOB: pieceOnBoard, target: boardFieldIdx, validateOnly: boolean = false): boolean {
        if (this.data.gameOver) return false
        let _source = pieceOB.field
        let _piece = pieceOB.piece
        let _isCapture = false

        switch (_piece.kind) {
            case pieceKind.Bishop:
                if (this.data.nextMoveBy != _piece.color) return false
                let bishopLike = isOffsetBishopLike(_source, target)
                if (!bishopLike.valid) return false;
                let bishopMovesRaw = new BishopMovesRaw(_source)
                let moveRayB = bishopMovesRaw.getRay(bishopLike.ray!)
                for (let f of moveRayB) {
                    if (boardFieldsAreEqual(f, target)) break
                    if (!this.isFieldEmpty(f)) return false
                }
                if (!this.isFieldEmptyOrCapture(target, _piece.color)) return false
                if (this.isCaptureOn(target, _piece.color)) _isCapture = true
                break
            case pieceKind.Knight:
                if (this.data.nextMoveBy != _piece.color) return false
                let knightMoves = new KnightMovesRaw(_source)
                let found = knightMoves.moves.find(x => boardFieldsAreEqual(x, target))
                if (typeof found === 'undefined') return false
                if (!this.isFieldEmptyOrCapture(target, _piece.color)) return false
                if (this.isCaptureOn(target, _piece.color)) _isCapture = true
                break
            case pieceKind.Rook:
                if (this.data.nextMoveBy != _piece.color) return false
                let rookLike = isOffsetRookLike(_source, target)
                if (!rookLike.valid) return false;
                let rookMovesRaw = new RookMovesRaw(_source)
                let moveRayR = rookMovesRaw.getRay(rookLike.ray!)
                for (let f of moveRayR) {
                    if (boardFieldsAreEqual(f, target)) break
                    if (!this.isFieldEmpty(f)) return false
                }
                if (!this.isFieldEmptyOrCapture(target, _piece.color)) return false
                if (this.isCaptureOn(target, _piece.color)) _isCapture = true
                if (!validateOnly) {
                    if (_source.colIdx == 7 && _piece.color == color.white) this.data.canCastleShortWhite = false;
                    if (_source.colIdx == 0 && _piece.color == color.white) this.data.canCastleLongWhite = false;
                    if (_source.colIdx == 7 && _piece.color == color.black) this.data.canCastleShortBlack = false;
                    if (_source.colIdx == 0 && _piece.color == color.black) this.data.canCastleLongBlack = false;
                }

                break;
            case pieceKind.Queen:
                if (this.data.nextMoveBy != _piece.color) return false
                let bishopLikeQ = isOffsetBishopLike(_source, target)
                if (bishopLikeQ.valid) {
                    let bishopMovesRawQ = new BishopMovesRaw(_source)
                    let moveRayQ = bishopMovesRawQ.getRay(bishopLikeQ.ray!)
                    for (let f of moveRayQ) {
                        if (boardFieldsAreEqual(f, target)) break
                        if (!this.isFieldEmpty(f)) return false
                    }
                    if (!this.isFieldEmptyOrCapture(target, _piece.color)) return false
                    if (this.isCaptureOn(target, _piece.color)) _isCapture = true
                }
                else {
                    let rookLikeQ = isOffsetRookLike(_source, target)
                    if (rookLikeQ.valid) {
                        let rookMovesRawQ = new RookMovesRaw(_source)
                        let moveRayRQ = rookMovesRawQ.getRay(rookLikeQ.ray!)
                        for (let f of moveRayRQ) {
                            if (boardFieldsAreEqual(f, target)) break
                            if (!this.isFieldEmpty(f)) return false
                        }
                        if (!this.isFieldEmptyOrCapture(target, _piece.color)) return false
                        if (this.isCaptureOn(target, _piece.color)) _isCapture = true
                    }
                    else return false
                }
                break;
            case pieceKind.King: // no castle here
                if (this.data.nextMoveBy != _piece.color) return false
                let kingMovesRaw = new KingMovesRaw(_source)
                let legalKingMove = kingMovesRaw.moves.find(x => boardFieldsAreEqual(x, target))
                if (typeof legalKingMove === 'undefined') return false
                if (!this.isFieldEmptyOrCapture(target, _piece.color)) return false
                if (this.isCaptureOn(target, _piece.color)) _isCapture = true
                if (!validateOnly) {
                    this.data.canCastleShortWhite = false;
                    this.data.canCastleLongWhite = false;
                    this.data.canCastleShortBlack = false;
                    this.data.canCastleLongBlack = false;
                }
                break;
            default:
                return false
        }

        // check if checked after move (i.e. was a pin)
        let tmpBoard = new ChessBoard(this.getFEN())
        tmpBoard.setPiece(pieceOB.piece, target)
        tmpBoard.removePiece(_source)
        if (tmpBoard.isCheck(this.data.nextMoveBy)) return false

        // set the move
        if (!validateOnly) {
            let move: moveOnBoard = { pieceOB: pieceOB, target: target }
            if (_isCapture)
                move.pieceCaptured = this.peekFieldPieceOB(target);
            this.setPiece(pieceOB.piece, target)
            this.removePiece(_source)
            this.history.push(move)
            this.data.enPassantPossible = false;
            this.data.enPassantField = undefined
            if (_isCapture)
                this.data.halfMoves50 = 0
            else
                this.data.halfMoves50++
            this.data.nextMoveBy = otherColor(this.data.nextMoveBy)
            if (this.data.nextMoveBy == color.white) this.data.moveNumber++
            this.clearAttackedFields()
        }
        return true
    }
    private performMovePawn(source: boardFieldIdx, target: boardFieldIdx, promotionPiece: pieceKind = pieceKind.none, validateOnly: boolean = false): boolean {
        if (this.data.gameOver) return false
        let _enPassantPossible: boolean = false
        let _enPassantField: boardFieldIdx | undefined
        let _isCapture: boolean = false
        let _isCaptureEP: boolean = false
        let _isPromotion: boolean = false
        let p = this.peekField(source)
        if (p.kind != pieceKind.Pawn) return false
        if (this.data.nextMoveBy != p.color) return false
        switch (p.color) {
            case color.black: // row ++
                if (target.colIdx == source.colIdx) { // forward move
                    if (source.rowIdx == 1 && (target.rowIdx - source.rowIdx == 2)) { // e.p. possible
                        _enPassantField = { colIdx: source.colIdx, rowIdx: source.rowIdx + 1 }
                        if (!this.isFieldEmpty(_enPassantField)) return false
                        if (!this.isFieldEmpty(target)) return false
                        _enPassantPossible = true
                    }
                    else if (target.rowIdx - source.rowIdx == 1) { // move
                        if (!this.isFieldEmpty(target)) return false
                        if (target.rowIdx == 7) {
                            _isPromotion = true
                            if (promotionPiece == pieceKind.none || promotionPiece == pieceKind.Pawn || promotionPiece == pieceKind.King) return false
                        }
                    }
                    else return false
                }
                else if (Math.abs(target.colIdx - source.colIdx) == 1) { // capture
                    if (target.rowIdx - source.rowIdx == 1) {
                        if (this.data.enPassantPossible && boardFieldsAreEqual(this.data.enPassantField!, target)) {
                            _isCaptureEP = true
                        }
                        else {
                            if (!this.isCaptureOn(target, p.color)) return false
                            if (target.rowIdx == 7) {
                                _isPromotion = true
                                if (promotionPiece == pieceKind.none || promotionPiece == pieceKind.Pawn || promotionPiece == pieceKind.King) return false
                            }
                        }
                        _isCapture = true
                    }
                    else return false;
                }
                else return false
                break;
            case color.white: // row --
                if (target.colIdx == source.colIdx) { // forward move
                    if (source.rowIdx == 6 && (source.rowIdx - target.rowIdx == 2)) { // e.p. possible
                        _enPassantField = { colIdx: source.colIdx, rowIdx: source.rowIdx - 1 }
                        if (!this.isFieldEmpty(_enPassantField)) return false
                        if (!this.isFieldEmpty(target)) return false
                        _enPassantPossible = true
                    }
                    else if (source.rowIdx - target.rowIdx == 1) { // move
                        if (!this.isFieldEmpty(target)) return false;
                        if (target.rowIdx == 0) {
                            _isPromotion = true
                            if (!isLegalPromotionPiece(promotionPiece)) return false
                        }
                    }
                    else return false
                }
                else if (Math.abs(target.colIdx - source.colIdx) == 1) { // capture
                    if (source.rowIdx - target.rowIdx == 1) {
                        if (this.data.enPassantPossible && boardFieldsAreEqual(this.data.enPassantField!, target)) {
                            _isCaptureEP = true
                        }
                        else {
                            if (!this.isCaptureOn(target, p.color)) return false
                            if (target.rowIdx == 0) {
                                _isPromotion = true
                                if (!isLegalPromotionPiece(promotionPiece)) return false
                            }
                            _isCapture = true
                        }
                    }
                    else return false
                }
                else return false
                break
        }

        // check if checked after move (i.e. was a pin)
        let tmpBoard = new ChessBoard(this.getFEN())
        if (_isPromotion)
            tmpBoard.setPiece(Piece.getPiece(promotionPiece, p.color), target)
        else
            tmpBoard.setPiece(p, target)
        tmpBoard.removePiece(source)
        if (_isCaptureEP) {
            switch (p.color) {
                case color.black:
                    tmpBoard.removePiece({ colIdx: this.data.enPassantField!.colIdx, rowIdx: this.data.enPassantField!.rowIdx - 1 })
                    break
                case color.white:
                    tmpBoard.removePiece({ colIdx: this.data.enPassantField!.colIdx, rowIdx: this.data.enPassantField!.rowIdx + 1 })
                    break
            }
        }
        if (tmpBoard.isCheck(this.data.nextMoveBy)) return false;

        // validation complete, perform move
        if (!validateOnly) {
            let move: moveOnBoard = { pieceOB: this.peekFieldPieceOB(source), target: target }
            if (_isCapture)
                move.pieceCaptured = this.peekFieldPieceOB(target);
            if (_isPromotion) {
                move.promotionPiece = promotionPiece
                this.setPiece(Piece.getPiece(promotionPiece, p.color), target)
            }
            else
                this.setPiece(p, target)
            this.removePiece(source)
            if (_isCaptureEP) {
                switch (p.color) {
                    case color.black:
                        move.pieceCaptured = this.peekFieldPieceOB({ colIdx: this.data.enPassantField!.colIdx, rowIdx: this.data.enPassantField!.rowIdx - 1 })
                        this.removePiece({ colIdx: this.data.enPassantField!.colIdx, rowIdx: this.data.enPassantField!.rowIdx - 1 })
                        break
                    case color.white:
                        move.pieceCaptured = this.peekFieldPieceOB({ colIdx: this.data.enPassantField!.colIdx, rowIdx: this.data.enPassantField!.rowIdx + 1 })
                        this.removePiece({ colIdx: this.data.enPassantField!.colIdx, rowIdx: this.data.enPassantField!.rowIdx + 1 })
                        break
                }
            }
            this.history.push(move)

            this.data.enPassantPossible = false
            this.data.enPassantField = undefined
            if (_enPassantPossible) {
                this.data.enPassantPossible = true
                this.data.enPassantField = _enPassantField
            }

            this.data.halfMoves50 = 0
            this.data.nextMoveBy = otherColor(this.data.nextMoveBy)
            if (this.data.nextMoveBy == color.white) this.data.moveNumber++
            this.clearAttackedFields()
        }
        return true
    }
    private moveCastle(color_: color, type_: castleType, validateOnly: boolean = false): boolean {
        if (this.data.gameOver) return false
        let colIdx_: number

        if (!validateOnly && this.data.nextMoveBy != color_) return false
        if (!this.canCastle(color_, type_)) return false
        let castle = KingMovesRaw.castle(color_, type_)
        if (!this.isPieceOn(castle.kingSource, castle.kingPiece)) return false
        if (!this.isPieceOn(castle.rookSource, castle.rookPiece)) return false
        for (colIdx_ = castle.betweenPathCols.start; colIdx_ <= castle.betweenPathCols.end; colIdx_++)
            if (!this.isFieldEmpty(fieldIdx(colIdx_, castle.row))) return false
        for (colIdx_ = castle.kingPathCols.start; colIdx_ <= castle.kingPathCols.end; colIdx_++)
            if (this.isPieceAttackedOn(fieldIdx(colIdx_, castle.row), otherColor(color_))) return false

        if (!validateOnly) {
            // validation complete, perform move
            let move: moveOnBoard = { pieceOB: this.peekFieldPieceOB(castle.kingSource), target: castle.kingTarget }
            move.targetRook = castle.rookTarget
            this.history.push(move)

            this.setPiece(castle.kingPiece, castle.kingTarget)
            this.removePiece(castle.kingSource)
            this.setPiece(castle.rookPiece, castle.rookTarget)
            this.removePiece(castle.rookSource)

            this.data.halfMoves50++
            this.data.enPassantPossible = false
            this.data.enPassantField = undefined
            // next move
            this.data.nextMoveBy = otherColor(this.data.nextMoveBy)
            if (this.data.nextMoveBy == color.white) this.data.moveNumber++
            this.clearAttackedFields()
            // post move evaluation
            // TODO is check / is Mate
            // TODO isGameOver()
            // TODO add move to move list
        }
        return true
    }

    private setPiece(piece_: Piece, field: boardFieldIdx) {
        this.board[field.colIdx][field.rowIdx] = piece_
    }
    private removePiece(field: boardFieldIdx) {
        this.board[field.colIdx][field.rowIdx] = Piece.none()
    }

}