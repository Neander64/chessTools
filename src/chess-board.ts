
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

export type piece = {
    kind: pieceKind
    color?: color
}
const NOPIECE: piece = { kind: pieceKind.none };

const whiteRook: piece = { color: color.white, kind: pieceKind.Rook }
const whiteKnight: piece = { color: color.white, kind: pieceKind.Knight }
const whiteBishop: piece = { color: color.white, kind: pieceKind.Bishop }
const whiteQueen: piece = { color: color.white, kind: pieceKind.Queen }
const whiteKing: piece = { kind: pieceKind.King, color: color.white }
const whitePawn: piece = { kind: pieceKind.Pawn, color: color.white }

const blackRook: piece = { color: color.black, kind: pieceKind.Rook }
const blackKnight: piece = { color: color.black, kind: pieceKind.Knight }
const blackBishop: piece = { color: color.black, kind: pieceKind.Bishop }
const blackQueen: piece = { color: color.black, kind: pieceKind.Queen }
const blackKing: piece = { kind: pieceKind.King, color: color.black }
const blackPawn: piece = { kind: pieceKind.Pawn, color: color.black }


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

export function charToPiece(pieceStr: string): { valid: boolean, piece: piece } {

    switch (pieceStr) {
        case 'R': return { valid: true, piece: whiteRook }
        case 'N': return { valid: true, piece: whiteKnight }
        case 'B': return { valid: true, piece: whiteBishop }
        case 'Q': return { valid: true, piece: whiteQueen }
        case 'K': return { valid: true, piece: whiteKing }
        case 'P': return { valid: true, piece: whitePawn }

        case 'r': return { valid: true, piece: blackRook }
        case 'n': return { valid: true, piece: blackKnight }
        case 'b': return { valid: true, piece: blackBishop }
        case 'q': return { valid: true, piece: blackQueen }
        case 'k': return { valid: true, piece: blackKing }
        case 'p': return { valid: true, piece: blackPawn }

        default:
            return { valid: false, piece: NOPIECE }
    }
}

export function strToFieldIdx(fieldStr: string): boardFieldIdx {
    if (fieldStr.length != 2) throw new Error('unexpedted string length for field (should be 2)')
    // convert chess notation of field (like e4) to index on board
    const colidx = (fieldStr[0].charCodeAt(0) - 'a'.charCodeAt(0))
    const rowidx = 8 - parseInt(fieldStr[1], 10)
    if (colidx < 0 || colidx >= 8) throw new Error('unexpected column')
    if (rowidx < 0 || rowidx >= 8) throw new Error('unexpected row')
    return { colIdx: colidx, rowIdx: rowidx }
}

function fieldIdxToNotation(field: boardFieldIdx): string {
    // convert internal field representation to normal string representation
    const cols = 'abcdefgh'
    let result = cols[field.colIdx] + (8 - field.rowIdx).toString()
    return result
}

type boardFieldIdx = {
    colIdx: number,
    rowIdx: number,
}

function boardFieldsAreEqual(f1: boardFieldIdx, f2: boardFieldIdx): boolean {
    return f1.colIdx == f2.colIdx && f1.rowIdx == f2.rowIdx
}

function fieldIdx(colIdx_: number, rowIdx_: number) {
    return { colIdx: colIdx_, rowIdx: rowIdx_ }
}

type pieceOnBoard = {
    piece: piece,
    field: boardFieldIdx
};


export enum castleType {
    short,
    long
}
type moveOnBoard = {
    pieceOB: pieceOnBoard,
    target: boardFieldIdx,
    // pawn promotion
    promotionPiece?: pieceKind;
    // castle
    pieceRook?: pieceOnBoard,
    targetRook?: boardFieldIdx,
    // captured Piece
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

function isFieldOnBoard(colIdx: number, rowIdx: number) {
    return (colIdx >= 0 && colIdx < 8 && rowIdx >= 0 && rowIdx < 8)
}

export const enum bishopRay { // 1-2,3-4 are opposites
    ray1 = 1,
    ray2,
    ray3,
    ray4,
}
class BishopMovesRaw {
    moves_ray1: boardFieldIdx[]
    moves_ray2: boardFieldIdx[]
    moves_ray3: boardFieldIdx[]
    moves_ray4: boardFieldIdx[]
    constructor(startField: boardFieldIdx) {
        this.moves_ray1 = this.generateRay(startField, 1, 1)
        this.moves_ray2 = this.generateRay(startField, -1, -1)
        this.moves_ray3 = this.generateRay(startField, 1, -1)
        this.moves_ray4 = this.generateRay(startField, -1, 1)
    }
    private generateRay(startField: boardFieldIdx, colOffset: number, rowOffset: number): boardFieldIdx[] {
        let moves: boardFieldIdx[] = []
        //for (let i = startField.colIdx + colOffset; i < 8; i++) 
        for (let i = 1; i < 8; i++) {
            let newField = { colIdx: startField.colIdx + colOffset * i, rowIdx: startField.rowIdx + rowOffset * i }
            if (isFieldOnBoard(newField.colIdx, newField.rowIdx)) {
                moves.push(newField)
            }
            else break
        }
        return moves
    }
    getRay(ray: bishopRay): boardFieldIdx[] {
        switch (ray) {
            case bishopRay.ray1: return this.moves_ray1
            case bishopRay.ray2: return this.moves_ray2
            case bishopRay.ray3: return this.moves_ray3
            case bishopRay.ray4: return this.moves_ray4
        }
        //return []; // unreachable
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
export function isOffsetBishopLike(source: boardFieldIdx, target: boardFieldIdx): { valid: boolean, ray?: bishopRay } {
    if (Math.abs(source.rowIdx - target.rowIdx) == Math.abs(source.colIdx - target.colIdx)) {
        if (source.colIdx > target.colIdx) {
            if (source.rowIdx > target.rowIdx)  // - -
                return { valid: true, ray: bishopRay.ray2 }
            else                                // - +
                return { valid: true, ray: bishopRay.ray4 }
        }
        else {
            if (source.rowIdx > target.rowIdx)  // + -
                return { valid: true, ray: bishopRay.ray3 }
            else                                // + +
                return { valid: true, ray: bishopRay.ray1 }
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
    moves_ray1: boardFieldIdx[]
    moves_ray2: boardFieldIdx[]
    moves_ray3: boardFieldIdx[]
    moves_ray4: boardFieldIdx[]
    constructor(startField: boardFieldIdx) {
        this.moves_ray1 = this.generateRay(startField, 1, 0)
        this.moves_ray2 = this.generateRay(startField, -1, 0)
        this.moves_ray3 = this.generateRay(startField, 0, 1)
        this.moves_ray4 = this.generateRay(startField, 0, -1)

    }
    private generateRay(startField: boardFieldIdx, colOffset: number, rowOffset: number): boardFieldIdx[] {
        let moves: boardFieldIdx[] = []
        //for (let i = startField.colIdx + colOffset; i < 8; i++) 
        for (let i = 1; i < 8; i++) {
            let newField = { colIdx: startField.colIdx + colOffset * i, rowIdx: startField.rowIdx + rowOffset * i }
            if (isFieldOnBoard(newField.colIdx, newField.rowIdx)) {
                moves.push(newField)
            }
            else break
        }
        return moves
    }
    getRay(ray: rookRay): boardFieldIdx[] {
        switch (ray) {
            case rookRay.ray1: return this.moves_ray1
            case rookRay.ray2: return this.moves_ray2
            case rookRay.ray3: return this.moves_ray3
            case rookRay.ray4: return this.moves_ray4
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
export function isOffsetRookLike(source: boardFieldIdx, target: boardFieldIdx): { valid: boolean, ray?: rookRay } {
    if ((source.rowIdx == target.rowIdx) || (source.colIdx == target.colIdx)) {
        if (source.colIdx == target.colIdx) {
            if (source.rowIdx < target.rowIdx)
                return { valid: true, ray: rookRay.ray3 } // 0 +
            else
                return { valid: true, ray: rookRay.ray4 } // 0 -
        }
        else { // source.rowIdx == target.rowIdx
            if (source.colIdx < target.colIdx)
                return { valid: true, ray: rookRay.ray1 } // + 0
            else
                return { valid: true, ray: rookRay.ray2 } // - 0
        }
    }
    return { valid: false }
}

export class KingMovesRaw {
    moves: boardFieldIdx[]

    constructor(startField: boardFieldIdx) {
        const offsetsKing = [
            { colOffset: -1, rowOffset: -1 }, { colOffset: 0, rowOffset: -1 }, { colOffset: 1, rowOffset: -1 },
            { colOffset: -1, rowOffset: 0 }, { colOffset: 1, rowOffset: 0 },
            { colOffset: -1, rowOffset: 1 }, { colOffset: 0, rowOffset: 1 }, { colOffset: 1, rowOffset: 1 },
        ];
        this.moves = [];
        for (const f of offsetsKing) {
            let newField = { colIdx: startField.colIdx + f.colOffset, rowIdx: startField.rowIdx + f.rowOffset }
            if (isFieldOnBoard(newField.colIdx, newField.rowIdx)) {
                this.moves.push(newField)
            }
        }
    }
}

export class KnightMovesRaw {
    moves: boardFieldIdx[]

    constructor(startField: boardFieldIdx) {
        const offsetsKnight = [
            { colOffset: -1, rowOffset: -2 }, { colOffset: 1, rowOffset: -2 },
            { colOffset: -2, rowOffset: -1 }, { colOffset: 2, rowOffset: -1 },
            { colOffset: -2, rowOffset: 1 }, { colOffset: 2, rowOffset: 1 },
            { colOffset: -1, rowOffset: 2 }, { colOffset: 1, rowOffset: 2 },
        ];
        this.moves = []
        for (const f of offsetsKnight) {
            let newField = { colIdx: startField.colIdx + f.colOffset, rowIdx: startField.rowIdx + f.rowOffset }
            if (isFieldOnBoard(newField.colIdx, newField.rowIdx)) {
                this.moves.push(newField)
            }
        }
    }
}

export class ChessBoard {

    readonly initialBoardFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

    private board: piece[][] = [] // col/row : [0][0]="a8" .. [7][7]="h1"
    private history: moveOnBoard[] = []
    private nextMoveBy: color = color.white
    private canCastleShortWhite: boolean = true
    private canCastleLongWhite: boolean = true
    private canCastleShortBlack: boolean = true
    private canCastleLongBlack: boolean = true
    private enPassantPossible: boolean = false
    private enPassantField: boardFieldIdx | undefined
    private halfMoves50: number = 0
    private moveNumber: number = 1
    private gameOver = false

    private _blackKing!: pieceOnBoard
    private _whiteKing!: pieceOnBoard
    private _emptyBoard: boolean = true
    private _fieldsAttackedByBlack: AttackedFields
    private _fieldsAttackedByWhite: AttackedFields

    constructor(fen: string = '') {
        // allocate and initialize a empty board
        for (let col = 0; col < 8; col++) {
            this.board[col] = []
            for (let row = 0; row < 8; row++) {
                this.board[col][row] = NOPIECE
            }
        }
        this._fieldsAttackedByBlack = new AttackedFields()
        this._fieldsAttackedByWhite = new AttackedFields()
        this.clearBoard()
        if (fen != '') this.loadFEN(fen);
    }

    clearBoard() {
        this._emptyBoard = true
        for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 8; row++) {
                this.board[col][row] = NOPIECE
            }
        }
        this.history = []
        this.nextMoveBy = color.white
        this.canCastleShortWhite = true
        this.canCastleLongWhite = true
        this.canCastleShortBlack = true
        this.canCastleLongBlack = true
        this.enPassantPossible = false
        this.enPassantField = { colIdx: 0, rowIdx: 0 }
        this.halfMoves50 = 0
        this.moveNumber = 1
        this.gameOver = true
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
                        let pResult = charToPiece(fenRow[p])
                        if (!pResult.valid) throw new Error('loadFEN(): unexpected piece')
                        if (colIdx >= 8) throw new Error('loadFEN(): too many pieces/columns in row')
                        this.board[colIdx++][rowIdx] = pResult.piece
                    }
                    else {
                        if (digit <= 0 || digit > 8) throw new Error('loadFEN(): unexpected digit in position')
                        while (digit > 0) {
                            this.board[colIdx++][rowIdx] = NOPIECE
                            digit--
                        }
                    }
                }
            }
            // board validation
            let blackPieces = this.currentPiecesOnBoard(color.black)
            let blackKings = blackPieces.filter(val => (val.piece.kind == pieceKind.King && val.piece.color == color.black))
            if (blackKings.length != 1) throw new Error('loadFEN(): unexpected number of black kings')
            this._blackKing = blackKings[0]
            let blackPawns = blackPieces.filter(val => (val.piece.kind == pieceKind.Pawn && val.piece.color == color.black))
            if (blackPawns.length > 8) throw new Error('loadFEN(): too many black pawns')

            let whitePieces = this.currentPiecesOnBoard(color.white)
            let whiteKings = whitePieces.filter(val => (val.piece.kind == pieceKind.King && val.piece.color == color.white))
            if (whiteKings.length != 1) throw new Error('loadFEN(): unexpected number of white kings')
            this._whiteKing = whiteKings[0]
            let whitePawns = whitePieces.filter(val => (val.piece.kind == pieceKind.Pawn && val.piece.color == color.white))
            if (whitePawns.length > 8) throw new Error('loadFEN(): too many white pawns')

            // TODO check for mate
            // TODO check for stale mate
            // TODO check for GameOver

            //2. player to move next
            switch (fenTokens[1]) {
                case 'w': this.nextMoveBy = color.white; break
                case 'b': this.nextMoveBy = color.black; break
                default: throw new Error('loadFEN(): illegal player to move')
            }

            //3. castle options
            this.canCastleShortWhite = (fenTokens[2].indexOf('K') > -1)
            this.canCastleLongWhite = (fenTokens[2].indexOf('Q') > -1)
            this.canCastleShortBlack = (fenTokens[2].indexOf('k') > -1)
            this.canCastleLongBlack = (fenTokens[2].indexOf('q') > -1)
            // TODO check if none specified must be '-' (strict mode)

            //4. en passant
            this.enPassantPossible = (fenTokens[3] !== '-')
            if (this.enPassantPossible) {
                if (fenTokens[3].length != 2) throw new Error('loadFEN(): en passant unexpected format')
                this.enPassantField = strToFieldIdx(fenTokens[3])
            }

            //5. number of half-moves since last capture or pawn move
            this.halfMoves50 = parseInt(fenTokens[4], 10)
            if (isNaN(this.halfMoves50)) throw new Error('loadFEN(): number of half-moves NAN')

            //6. next move number
            this.moveNumber = parseInt(fenTokens[5], 10)
            if (isNaN(this.moveNumber)) throw new Error('loadFEN(): moveNumber NAN')
            if (this.moveNumber <= 0) throw new Error('loadFEN(): moveNumber negative/zero')

            this._emptyBoard = false
            this.gameOver = this.isGameOver()
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
                if (this.board[col][row] == NOPIECE)
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
        switch (this.nextMoveBy) {
            case color.black: fen += 'b'; break
            case color.white: fen += 'w'
        }
        fen += ' '

        //3. castle options
        if (!this.canCastleLongBlack && !this.canCastleShortBlack && !this.canCastleLongWhite && !this.canCastleShortWhite)
            fen += '-'
        else {
            if (this.canCastleShortWhite) fen += 'K'
            if (this.canCastleLongWhite) fen += 'Q'
            if (this.canCastleShortBlack) fen += 'k'
            if (this.canCastleLongBlack) fen += 'q'
        }
        fen += ' '

        //4. en passant
        if (!this.enPassantPossible)
            fen += '-'
        else
            fen += fieldIdxToNotation(this.enPassantField!)
        fen += ' '

        //5. number of half-moves since last capture or pawn move
        fen += this.halfMoves50 + ' '

        //6. next move number
        fen += this.moveNumber

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

        result.push('next move color: ' + ((this.nextMoveBy == color.white) ? 'White' : 'Black'))
        result.push('Possible Castle White O-O:' + (this.canCastleShortWhite ? 'Y' : 'N') + ', O-O-O:' + (this.canCastleLongWhite ? 'Y' : 'N'))
        result.push('Possible Castle Black O-O:' + (this.canCastleShortBlack ? 'Y' : 'N') + ', O-O-O:' + (this.canCastleLongBlack ? 'Y' : 'N'))
        if (this.enPassantPossible) {
            result.push('en passant option at ' + fieldIdxToNotation(this.enPassantField as boardFieldIdx))
        }
        result.push('moves without pawn or capture: ' + this.halfMoves50)
        result.push('move number: ' + this.moveNumber)
        //TODO add gameOver status
        return result
    }

    peekField(field: boardFieldIdx): piece {
        return this.board[field.colIdx][field.rowIdx]
    }
    peekFieldPiece(field_: boardFieldIdx): pieceOnBoard {
        return { piece: this.peekField({ colIdx: field_.colIdx, rowIdx: field_.rowIdx }), field: field_ }
    }
    isFieldEmpty(field: boardFieldIdx): boolean {
        return this.peekField(field).kind == pieceKind.none
    }
    isCaptureOn(field_: boardFieldIdx, color_: color): boolean {
        let _piece = this.peekField(field_)
        return _piece.kind != pieceKind.none && _piece.color == otherColor(color_)
    }
    isFieldEmptyOrCapture(field_: boardFieldIdx, color_: color): boolean {
        return this.isFieldEmpty(field_) || this.isCaptureOn(field_, color_)
    }
    isPieceOn(field: boardFieldIdx, p: piece) {
        let _p = this.peekField(field)
        return _p.kind == p.kind && _p.color == p.color
    }

    currentPiecesOnBoard(color_: color): pieceOnBoard[] {
        let result: pieceOnBoard[] = []
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                let p = this.peekField({ colIdx: c, rowIdx: r })
                if (p.kind != pieceKind.none && p.color == color_) {
                    result.push({ piece: p, field: { colIdx: c, rowIdx: r } })
                }
            }
        }
        return result
    }

    private getKingField(color_: color): boardFieldIdx {
        if (this._emptyBoard) throw new Error('getKing() operation on empty board')
        switch (color_) {
            case color.black: return this._blackKing.field
            case color.white: return this._whiteKing.field
        }
        //throw new Error('getKing() unexpected color'); // unreachable code :-)
    }

    private getAttackedFieldsByRook(piece: pieceOnBoard): boardFieldIdx[] {
        let rookMoves: boardFieldIdx[] = []
        let f: boardFieldIdx
        const rays = [rookRay.ray1, rookRay.ray2, rookRay.ray3, rookRay.ray4]
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
        let knightMoves = new KnightMovesRaw(piece.field)
        return knightMoves.moves
    }
    private getAttackedFieldsByBishop(piece: pieceOnBoard): boardFieldIdx[] {
        let bishopMoves: boardFieldIdx[] = []
        let f: boardFieldIdx
        const rays = [bishopRay.ray1, bishopRay.ray2, bishopRay.ray3, bishopRay.ray4]
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
        let queenMoves: boardFieldIdx[] = []
        let f: boardFieldIdx

        const raysR = [rookRay.ray1, rookRay.ray2, rookRay.ray3, rookRay.ray4]
        let rookMovesRaw = new RookMovesRaw(piece.field)
        for (const ray of raysR) {
            let moveRay = rookMovesRaw.getRay(ray)
            for (f of moveRay) {
                queenMoves.push(f);
                if (!this.isFieldEmpty(f)) break
            }
        }

        const raysB = [bishopRay.ray1, bishopRay.ray2, bishopRay.ray3, bishopRay.ray4]
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
    private getAttackedFieldsByPawnWhite(piece: pieceOnBoard): boardFieldIdx[] {
        const offsetsPawn = [{ colOffset: 1, rowOffset: -1 }, { colOffset: -1, rowOffset: -1 }]
        let pawnCaptureMoves: boardFieldIdx[] = []
        const startField = piece.field
        for (const f of offsetsPawn) {
            let newField = { colIdx: startField.colIdx + f.colOffset, rowIdx: startField.rowIdx + f.rowOffset }
            if (isFieldOnBoard(newField.colIdx, newField.rowIdx)) {
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
        // return [] -- unreachable code
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
    isMate(color_: color): boolean {
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
    isStaleMate(): boolean {
        // TODO
        // nothing to move except king
        // not check
        // no legal move for king
        return false
    }
    checkFiftyMovesRule(): boolean {
        return this.halfMoves50 > 100;
    }
    private isGameOver(): boolean {
        // TODO
        //return this.isMate();
        // isStaleMate()
        // fiftyMovesRule()
        // notSufficientMaterial
        return false
    }

    performMovePiece(pieceOB: pieceOnBoard, target: boardFieldIdx): boolean {
        if (this.gameOver) return false
        let _source = pieceOB.field
        let _piece = pieceOB.piece
        let _isCapture = false

        switch (_piece.kind) {
            case pieceKind.Bishop:
                if (this.nextMoveBy != _piece.color) return false
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
                if (this.nextMoveBy != _piece.color) return false
                let knightMoves = new KnightMovesRaw(_source)
                let found = knightMoves.moves.find(x => boardFieldsAreEqual(x, target))
                if (typeof found === 'undefined') return false
                if (!this.isFieldEmptyOrCapture(target, _piece.color)) return false
                if (this.isCaptureOn(target, _piece.color)) _isCapture = true
                break
            case pieceKind.Rook:
                if (this.nextMoveBy != _piece.color) return false
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
                break;
            case pieceKind.Queen:
                if (this.nextMoveBy != _piece.color) return false
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
                            console.log(f)
                            if (boardFieldsAreEqual(f, target)) break
                            if (!this.isFieldEmpty(f)) return false
                        }
                        if (!this.isFieldEmptyOrCapture(target, _piece.color)) return false
                        if (this.isCaptureOn(target, _piece.color)) _isCapture = true
                    }
                    else return false
                }
                break;
            default:
                return false
        }

        // check if checked after move (i.e. was a pin)
        let tmpBoard = new ChessBoard(this.getFEN())
        tmpBoard.setPiece(pieceOB.piece, target)
        tmpBoard.removePiece(_source)
        if (tmpBoard.isCheck(this.nextMoveBy)) return false;

        // set the move
        let move: moveOnBoard = { pieceOB: pieceOB, target: target }
        if (_isCapture)
            move.pieceCaptured = this.peekFieldPiece(target);
        this.setPiece(pieceOB.piece, target)
        this.removePiece(_source)
        this.history.push(move)

        if (_isCapture)
            this.halfMoves50 = 0
        else
            this.halfMoves50++
        this.nextMoveBy = otherColor(this.nextMoveBy)
        if (this.nextMoveBy == color.white) this.moveNumber++
        this.clearAttackedFields()

        return true
    }
    performMovePawn(source: boardFieldIdx, target: boardFieldIdx, promotionPiece: pieceKind = pieceKind.none): boolean {
        if (this.gameOver) return false
        let _enPassantPossible: boolean = false
        let _enPassantField: boardFieldIdx | undefined
        let _isCapture: boolean = false
        let _isCaptureEP: boolean = false
        let _isPromotion: boolean = false

        let p = this.peekField(source)
        if (p.kind != pieceKind.Pawn) return false
        if (this.nextMoveBy != p.color) return false
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
                        if (this.enPassantPossible && (this.enPassantField!.colIdx == target.colIdx && this.enPassantField!.rowIdx == target.rowIdx)) {
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
                        if (this.enPassantPossible && (this.enPassantField!.colIdx == target.colIdx && this.enPassantField!.rowIdx == target.rowIdx)) {
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
                }
                else return false
                break
        }

        // check if checked after move (i.e. was a pin)
        let tmpBoard = new ChessBoard(this.getFEN())
        if (_isPromotion)
            tmpBoard.setPiece({ color: p.color, kind: promotionPiece }, target)
        else
            tmpBoard.setPiece(p, target)
        tmpBoard.removePiece(source)
        if (_isCaptureEP) {
            switch (p.color) {
                case color.black:
                    tmpBoard.removePiece({ colIdx: this.enPassantField!.colIdx, rowIdx: this.enPassantField!.rowIdx - 1 })
                    break
                case color.white:
                    tmpBoard.removePiece({ colIdx: this.enPassantField!.colIdx, rowIdx: this.enPassantField!.rowIdx + 1 })
                    break
            }
        }
        if (tmpBoard.isCheck(this.nextMoveBy)) return false;

        // validation complete, perform move
        let move: moveOnBoard = { pieceOB: this.peekFieldPiece(source), target: target }
        if (_isCapture)
            move.pieceCaptured = this.peekFieldPiece(target);
        if (_isPromotion) {
            move.promotionPiece = promotionPiece
            this.setPiece({ color: p.color, kind: promotionPiece }, target)
        }
        else
            this.setPiece(p, target)
        this.removePiece(source)
        if (_isCaptureEP) {
            switch (p.color) {
                case color.black:
                    move.pieceCaptured = this.peekFieldPiece({ colIdx: this.enPassantField!.colIdx, rowIdx: this.enPassantField!.rowIdx - 1 })
                    this.removePiece({ colIdx: this.enPassantField!.colIdx, rowIdx: this.enPassantField!.rowIdx - 1 })
                    break
                case color.white:
                    move.pieceCaptured = this.peekFieldPiece({ colIdx: this.enPassantField!.colIdx, rowIdx: this.enPassantField!.rowIdx + 1 })
                    this.removePiece({ colIdx: this.enPassantField!.colIdx, rowIdx: this.enPassantField!.rowIdx + 1 })
                    break
            }
        }
        this.history.push(move)

        if (_enPassantPossible) {
            this.enPassantPossible = true
            this.enPassantField = _enPassantField
        }

        this.halfMoves50 = 0
        this.nextMoveBy = otherColor(this.nextMoveBy)
        if (this.nextMoveBy == color.white) this.moveNumber++
        this.clearAttackedFields()

        return true
    }
    moveCastle(color_: color, type_: castleType, validateOnly: boolean = false): boolean {
        if (this.gameOver) return false
        // TODO color should only be necessary if in validationMode
        let king: piece
        let rook: piece
        let rowIdx_: number
        let colIdx_: number
        let kingTarget: boardFieldIdx
        let kingSource: boardFieldIdx
        let rookTarget: boardFieldIdx
        let rookSource: boardFieldIdx

        if (!validateOnly && this.nextMoveBy != color_) return false

        switch (color_) {
            case color.black:
                king = blackKing
                rook = blackRook
                rowIdx_ = 0
                switch (type_) {
                    case castleType.short:
                        if (!this.canCastleShortBlack) return false // throw new Error('illegal move');
                        kingSource = { colIdx: 4, rowIdx: rowIdx_ }
                        kingTarget = { colIdx: 6, rowIdx: rowIdx_ }
                        rookSource = { colIdx: 7, rowIdx: rowIdx_ }
                        rookTarget = { colIdx: 5, rowIdx: rowIdx_ }
                        if (!this.isPieceOn(kingSource, blackKing)) return false
                        if (!this.isPieceOn(rookSource, blackRook)) return false
                        for (colIdx_ = 5; colIdx_ < 7; colIdx_++) { // any pieces in between?
                            if (!this.isFieldEmpty(fieldIdx(colIdx_, rowIdx_))) return false
                        }
                        for (colIdx_ = 4; colIdx_ <= 6; colIdx_++) { // any check on path of king fields
                            if (this.isPieceAttackedOn(fieldIdx(colIdx_, rowIdx_), otherColor(color_))) return false
                        }
                        if (!validateOnly) this.canCastleShortBlack = false
                        break;
                    case castleType.long:
                        if (!this.canCastleLongBlack) return false // throw new Error('illegal move');
                        kingSource = { colIdx: 4, rowIdx: rowIdx_ }
                        kingTarget = { colIdx: 2, rowIdx: rowIdx_ }
                        rookSource = { colIdx: 0, rowIdx: rowIdx_ }
                        rookTarget = { colIdx: 3, rowIdx: rowIdx_ }
                        if (!this.isPieceOn(kingSource, blackKing)) return false
                        if (!this.isPieceOn(rookSource, blackRook)) return false
                        for (colIdx_ = 1; colIdx_ < 4; colIdx_++) { // any pieces in between?
                            if (!this.isFieldEmpty(fieldIdx(colIdx_, rowIdx_))) return false
                        }
                        for (colIdx_ = 2; colIdx_ < 4; colIdx_++) { // any check on path of king fields
                            if (this.isPieceAttackedOn(fieldIdx(colIdx_, rowIdx_), otherColor(color_))) return false
                        }
                        if (!validateOnly) this.canCastleLongBlack = false
                        break
                }
                break
            case color.white:
                king = whiteKing
                rook = whiteRook
                rowIdx_ = 7
                switch (type_) {
                    case castleType.short:
                        if (!this.canCastleShortWhite) return false // throw new Error('illegal move');
                        kingSource = { colIdx: 4, rowIdx: rowIdx_ }
                        kingTarget = { colIdx: 6, rowIdx: rowIdx_ }
                        rookSource = { colIdx: 7, rowIdx: rowIdx_ }
                        rookTarget = { colIdx: 5, rowIdx: rowIdx_ }
                        kingSource = { colIdx: 4, rowIdx: rowIdx_ }
                        kingTarget = { colIdx: 6, rowIdx: rowIdx_ }
                        rookSource = { colIdx: 7, rowIdx: rowIdx_ }
                        rookTarget = { colIdx: 5, rowIdx: rowIdx_ }
                        if (!this.isPieceOn(kingSource, whiteKing)) return false
                        if (!this.isPieceOn(rookSource, whiteRook)) return false
                        for (colIdx_ = 5; colIdx_ < 7; colIdx_++) { // any pieces in between?
                            if (!this.isFieldEmpty(fieldIdx(colIdx_, rowIdx_))) return false
                        }
                        for (colIdx_ = 4; colIdx_ <= 6; colIdx_++) { // any check on path of king fields
                            if (this.isPieceAttackedOn(fieldIdx(colIdx_, rowIdx_), otherColor(color_))) return false
                        }
                        if (!validateOnly) this.canCastleShortWhite = false
                        break
                    case castleType.long:
                        if (!this.canCastleLongWhite) return false // throw new Error('illegal move');
                        kingSource = { colIdx: 4, rowIdx: rowIdx_ }
                        kingTarget = { colIdx: 2, rowIdx: rowIdx_ }
                        rookSource = { colIdx: 0, rowIdx: rowIdx_ }
                        rookTarget = { colIdx: 3, rowIdx: rowIdx_ }
                        if (!this.isPieceOn(kingSource, whiteKing)) return false
                        if (!this.isPieceOn(rookSource, whiteRook)) return false
                        for (colIdx_ = 1; colIdx_ < 4; colIdx_++) { // any pieces in between?
                            if (!this.isFieldEmpty(fieldIdx(colIdx_, rowIdx_))) return false
                        }
                        for (colIdx_ = 2; colIdx_ < 4; colIdx_++) { // any check on path of king fields
                            if (this.isPieceAttackedOn(fieldIdx(colIdx_, rowIdx_), otherColor(color_))) return false
                        }
                        if (!validateOnly) this.canCastleLongWhite = false
                        break
                }
                break
        }
        if (!validateOnly) {
            // validation complete, perform move
            let move: moveOnBoard = { pieceOB: this.peekFieldPiece(kingSource), target: kingTarget }
            move.targetRook = rookTarget
            this.history.push(move)

            this.setPiece(king, kingTarget)
            this.removePiece(kingSource)
            this.setPiece(rook, rookTarget)
            this.removePiece(rookSource)
            this.halfMoves50++
            this.enPassantPossible = false
            this.enPassantField = undefined
            // next move
            this.nextMoveBy = otherColor(this.nextMoveBy)
            if (this.nextMoveBy == color.white) this.moveNumber++
            this.clearAttackedFields()
            // post move evaluation
            // TODO is check / is Mate
            // TODO isGameOver()
            // TODO add move to move list
        }
        return true
    }

    private setPiece(piece_: piece, field: boardFieldIdx) {
        this.board[field.colIdx][field.rowIdx] = piece_
    }
    private removePiece(field: boardFieldIdx) {
        this.board[field.colIdx][field.rowIdx] = NOPIECE
    }

}