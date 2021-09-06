
import { EncodedPositionKey, encodeType } from './encode-position-key'
import { Piece, pieceKind, pieceKeyType } from './chess-board-pieces'
import { color, otherColor } from './chess-color'
import { pieceOnBoard, boardFieldIdx, sameFields, fieldIdx, fieldOffset, offsets, shiftField } from './chess-board-internal-types'
import { AttackedFields } from './chess-board-attacked-fields'
import { BishopMovesRaw, bishopRay, isOffsetBishopLike } from './chess-board-bishop-moves'
import { RookMovesRaw, rookRay, isOffsetRookLike } from './chess-board-rook-moves'
import { castleType, KingMovesRaw } from './chess-board-king-moves'
import { KnightMovesRaw } from './chess-board-knight-moves'
import { PawnMovesRaw } from './chess-board-pawn-moves'

// TODO split into several files (resolve circular references)
// TODO push FEN / PGN into a separate structure/class
// TODO moveToSAN
// TODO getLegalMoves -> SAN
// TODO getAttackedFields -> Notation
// TODO generate PGN

function colorStr(color_: color) {
    return color_.toString()
}

const pieceKindPGN = new Map<number, string>([
    // map piece to string, usage: pieceKindPGN.get(p /*:pieceKind*/)
    [pieceKind.Rook, 'R'],
    [pieceKind.Knight, 'N'],
    [pieceKind.Bishop, 'B'],
    [pieceKind.Queen, 'Q'],
    [pieceKind.King, 'K'],
    [pieceKind.Pawn, 'P'],
    [pieceKind.none, ' '],
])
function isLegalPromotionPiece(kind_: pieceKind): boolean {
    //return kind_ != pieceKind.none && kind_ != pieceKind.Pawn && kind_ != pieceKind.King
    return kind_ < pieceKind.King
}

/*
function doForColor(color_: color, blackFct: () => void, whiteFct: () => void) {
    switch (color_) {
        case color.black: blackFct(); break
        case color.white: whiteFct(); break
    }
}
*/

function pieceToChar(p: Piece): string {
    let result = pieceKindPGN.get(p.kind) || ' '
    if (p.isPiece) {
        if (p.color == color.black) result = result.toLocaleLowerCase()
        //doForColor(p.color!, () => { result = _kindStr!.toLocaleLowerCase() }, () => result = _kindStr!.toUpperCase())
    }
    /*
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
    */
    return result;
}

const charFENtoPieceMap = new Map<string, Piece>([
    ['R', Piece.whiteRook()],
    ['N', Piece.whiteKnight()],
    ['B', Piece.whiteBishop()],
    ['Q', Piece.whiteQueen()],
    ['K', Piece.whiteKing()],
    ['P', Piece.whitePawn()],

    ['r', Piece.blackRook()],
    ['n', Piece.blackKnight()],
    ['b', Piece.blackBishop()],
    ['q', Piece.blackQueen()],
    ['k', Piece.blackKing()],
    ['p', Piece.blackPawn()],
])
export function charFENToPiece(pieceStr: string): { valid: boolean, piece: Piece } {
    if (charFENtoPieceMap.has(pieceStr))
        return { valid: true, piece: charFENtoPieceMap.get(pieceStr)! }
    /*
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
    }*/
    return { valid: false, piece: Piece.none() }
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

type pieceStat = {
    black: {
        rooks: number,
        knights: number,
        bishops: number,
        queens: number,
        kings: number,
        pawns: number,
        total: number,
        materialEvaluaton: number,
    },
    white: {
        rooks: number,
        knights: number,
        bishops: number,
        queens: number,
        kings: number,
        pawns: number,
        total: number
        materialEvaluaton: number,
    }
    total: number
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
export function fieldIdxArrToNotation(fields: boardFieldIdx[]): string[] {
    let result: string[] = []
    for (let f of fields) result.push(fieldIdxToNotation(f))
    return result
}



type moveOnBoard = { // Data to do/undo moves
    pieceOB: pieceOnBoard,
    target: boardFieldIdx,
    // pawn promotion
    promotionPiece?: pieceKind;
    // castle
    pieceRook?: pieceOnBoard,
    targetRook?: boardFieldIdx,
    // captured/replaced Piece
    pieceCaptured?: pieceOnBoard,

    // position key to check for move repetition
    boardKey?: /*number[] |*/ BigInt,
};



export const enum GameResult {
    white_wins = "1-0",
    black_wins = "0-1",
    draw = "1/2-1/2",
    none = "*"
}
function gameResult(r: GameResult): string {
    return r.toString()
    /*    switch (r) {
            case GameResult.white_wins: return "1-0"
            case GameResult.black_wins: return "0-1"
            case GameResult.draw: return "1/2-1/2"
            case GameResult.none: return "*"
        }*/
}

export interface IChessBoardData {
    isWhitesMove: boolean
    canCastleShortWhite: boolean
    canCastleLongWhite: boolean
    canCastleShortBlack: boolean
    canCastleLongBlack: boolean
    enPassantPossible: boolean
    enPassantField: boardFieldIdx | undefined
}

export class ChessBoardData implements IChessBoardData {
    nextMoveBy!: color
    canCastleShortWhite!: boolean
    canCastleLongWhite!: boolean
    canCastleShortBlack!: boolean
    canCastleLongBlack!: boolean
    enPassantPossible!: boolean
    enPassantField: boardFieldIdx | undefined
    halfMoves50!: number
    moveNumber!: number
    gameOver!: boolean // meaning: no further moves are allowed.
    gameResult!: GameResult
    drawPossible50MovesRule!: boolean
    drawPossibleThreefoldRepetion!: boolean
    constructor() {
        this.init()
    }
    init() {
        this.nextMoveBy = color.white
        this.canCastleShortWhite = false
        this.canCastleLongWhite = false
        this.canCastleShortBlack = false
        this.canCastleLongBlack = false
        this.enPassantPossible = false
        this.enPassantField = undefined
        this.halfMoves50 = 0
        this.moveNumber = 1
        this.gameOver = true
        this.gameResult = GameResult.none
        this.drawPossible50MovesRule = false
        this.drawPossibleThreefoldRepetion = false
    }
    get isWhitesMove() { return this.nextMoveBy == color.white }

}
export type fileType = number
export type rankType = number
export interface IChessBoardRepresentation {
    isPiece(file: fileType, rank: rankType): boolean
    pieceKey(file: fileType, rank: rankType): pieceKeyType

    isFieldOnBoard(field: boardFieldIdx): boolean
}
class ChessBoardRepresentation implements IChessBoardRepresentation {
    private _board: Piece[][] = [] // col/row : [0][0]="a8" .. [7][7]="h1"
    isPiece(file: fileType, rank: rankType) { return this._board[file][rank].isPiece }
    pieceKey(file: fileType, rank: rankType) { return this._board[file][rank].key }
    constructor() {
        for (let file = 0; file < 8; file++) {
            this._board[file] = []
            for (let rank = 0; rank < 8; rank++) {
                this._board[file][rank] = Piece.none()
            }
        }
    }
    // TODO keep implementation hidden
    get board() { return this._board }
    isFieldOnBoard(field: boardFieldIdx) {
        return (field.colIdx >= 0 && field.colIdx < 8 && field.rowIdx >= 0 && field.rowIdx < 8)
    }
}
export class ChessBoard {

    readonly initialBoardFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

    //private _board: Piece[][] = [] // col/row : [0][0]="a8" .. [7][7]="h1"
    private _b: ChessBoardRepresentation
    private _history: moveOnBoard[] = []
    private _data: ChessBoardData

    private _emptyBoard: boolean = true
    private _fieldsAttackedByBlack: AttackedFields
    private _fieldsAttackedByWhite: AttackedFields

    constructor(fen?: string) {
        this._b = new ChessBoardRepresentation()
        this._data = new ChessBoardData()
        this._fieldsAttackedByBlack = new AttackedFields()
        this._fieldsAttackedByWhite = new AttackedFields()
        this.clearBoard()
        if (fen) this.loadFEN(fen);
    }
    private setBoard(board: Piece[][]) {
        for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 8; row++) {
                this._board[col][row] = board[col][row]
            }
        }
        this._emptyBoard = false
    }
    private get _board(): Piece[][] {
        return this._b.board
    }
    get board(): ChessBoardRepresentation {
        return this._b
    }
    get data(): ChessBoardData {
        return this._data
    }
    private addMoveToHistory(move_: moveOnBoard) {
        move_.boardKey = EncodedPositionKey.encodeBoard(this.board, this.data, encodeType.FENlikeLongBigInt) as BigInt
        this._history.push(move_)
    }

    clearBoard() {
        this._emptyBoard = true
        for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 8; row++) {
                this._board[col][row] = Piece.none()
            }
        }
        this._history = []
        this._data.init()
        this.clearAttackedFields()
    }

    loadFEN(fen: string) {
        try {
            this.clearBoard()
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
                        this._board[colIdx++][rowIdx] = pResult.piece
                    }
                    else {
                        if (digit <= 0 || digit > 8 - colIdx) throw new Error('loadFEN(): unexpected digit in position')
                        while (digit > 0 && colIdx < 8) {
                            this._board[colIdx++][rowIdx] = Piece.none()
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

            //2. player to move next
            switch (fenTokens[1]) {
                case 'w': this._data.nextMoveBy = color.white; break
                case 'b': this._data.nextMoveBy = color.black; break
                default: throw new Error('loadFEN(): illegal player to move')
            }

            //3. castle options
            this._data.canCastleShortWhite = (fenTokens[2].indexOf('K') > -1)
            this._data.canCastleLongWhite = (fenTokens[2].indexOf('Q') > -1)
            this._data.canCastleShortBlack = (fenTokens[2].indexOf('k') > -1)
            this._data.canCastleLongBlack = (fenTokens[2].indexOf('q') > -1)
            // TODO check if none specified must be '-' (strict mode)

            //4. en passant
            this._data.enPassantPossible = (fenTokens[3] !== '-')
            if (this._data.enPassantPossible) {
                if (fenTokens[3].length != 2) throw new Error('loadFEN(): en passant unexpected format')
                this._data.enPassantField = strToFieldIdx(fenTokens[3])
            }
            else this._data.enPassantField = undefined

            //5. number of half-moves since last capture or pawn move
            this._data.halfMoves50 = parseInt(fenTokens[4], 10)
            if (isNaN(this._data.halfMoves50)) throw new Error('loadFEN(): number of half-moves NAN')

            //6. next move number
            this._data.moveNumber = parseInt(fenTokens[5], 10)
            if (isNaN(this._data.moveNumber)) throw new Error('loadFEN(): moveNumber NAN')
            if (this._data.moveNumber <= 0) throw new Error('loadFEN(): moveNumber negative/zero')

            this._emptyBoard = false
            this._data.gameOver = this.isGameOver()
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
                if (this._board[col][row].isEmpty)
                    emptyCount++
                else {
                    if (emptyCount > 0) {
                        fen += emptyCount
                        emptyCount = 0
                    }
                    fen += pieceToChar(this._board[col][row])
                }
            }
            if (emptyCount > 0)
                fen += emptyCount
            if (row < 7) fen += '/'
        }
        fen += ' '

        //2. player to move next
        switch (this._data.nextMoveBy) {
            case color.black: fen += 'b'; break
            case color.white: fen += 'w'
        }
        fen += ' '

        //3. castle options
        if (!this._data.canCastleLongBlack && !this._data.canCastleShortBlack && !this._data.canCastleLongWhite && !this._data.canCastleShortWhite)
            fen += '-'
        else {
            if (this._data.canCastleShortWhite) fen += 'K'
            if (this._data.canCastleLongWhite) fen += 'Q'
            if (this._data.canCastleShortBlack) fen += 'k'
            if (this._data.canCastleLongBlack) fen += 'q'
        }
        fen += ' '

        //4. en passant
        if (!this._data.enPassantPossible)
            fen += '-'
        else
            fen += fieldIdxToNotation(this._data.enPassantField!)
        fen += ' '

        //5. number of half-moves since last capture or pawn move
        fen += this._data.halfMoves50 + ' '

        //6. next move number
        fen += this._data.moveNumber

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
                line += pieceToChar(this._board[col][row]) + (col < 7 ? ' | ' : ' |')
            }
            result.push(line)
            result.push(' -------------------------------')
        }

        result.push('next move color: ' + colorStr(this._data.nextMoveBy))
        result.push('Possible Castle White O-O:' + (this._data.canCastleShortWhite ? 'Y' : 'N') + ', O-O-O:' + (this._data.canCastleLongWhite ? 'Y' : 'N'))
        result.push('Possible Castle Black O-O:' + (this._data.canCastleShortBlack ? 'Y' : 'N') + ', O-O-O:' + (this._data.canCastleLongBlack ? 'Y' : 'N'))
        if (this._data.enPassantPossible) {
            result.push('en passant option at ' + fieldIdxToNotation(this._data.enPassantField!))
        }
        result.push('moves without pawn or capture: ' + this._data.halfMoves50)
        result.push('move number: ' + this._data.moveNumber)
        //TODO add gameOver status
        result.push('Game Result: ' + gameResult(this._data.gameResult))
        return result
    }

    peekField(field: boardFieldIdx): Piece {
        return this._board[field.colIdx][field.rowIdx]
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
                        return this._data.canCastleShortBlack
                    case castleType.long:
                        return this._data.canCastleLongBlack
                }
            case color.white:
                switch (type_) {
                    case castleType.short:
                        return this._data.canCastleShortWhite
                    case castleType.long:
                        return this._data.canCastleLongWhite
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

    currentPieceSpectrum(): pieceStat {
        let result: pieceStat = {
            black: { rooks: 0, knights: 0, bishops: 0, queens: 0, kings: 0, pawns: 0, total: 0, materialEvaluaton: 0 },
            white: { rooks: 0, knights: 0, bishops: 0, queens: 0, kings: 0, pawns: 0, total: 0, materialEvaluaton: 0 },
            total: 0
        }
        const evaluation = { // Centipawns, Larry Kaufman 2012
            rooks: 525, knights: 350, bishops: 350, queens: 1000, kings: 10000, pawns: 100
        }
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                let p = this.peekField({ colIdx: c, rowIdx: r })
                if (p.isPiece) {
                    switch (p.color) {
                        case color.black:
                            switch (p.kind) {
                                case pieceKind.Rook:
                                    result.black.rooks++
                                    result.black.materialEvaluaton += evaluation.rooks
                                    break
                                case pieceKind.Knight:
                                    result.black.knights++
                                    result.black.materialEvaluaton += evaluation.knights
                                    break
                                case pieceKind.Bishop:
                                    result.black.bishops++
                                    result.black.materialEvaluaton += evaluation.bishops
                                    break
                                case pieceKind.Queen:
                                    result.black.queens++
                                    result.black.materialEvaluaton += evaluation.queens
                                    break
                                case pieceKind.King:
                                    result.black.kings++
                                    result.black.materialEvaluaton += evaluation.kings
                                    break
                                case pieceKind.Pawn:
                                    result.black.pawns++
                                    result.black.materialEvaluaton += evaluation.pawns
                                    break
                            }
                            result.black.total++
                            break
                        case color.white:
                            switch (p.kind) {
                                case pieceKind.Rook:
                                    result.white.rooks++
                                    result.white.materialEvaluaton += evaluation.rooks
                                    break
                                case pieceKind.Knight:
                                    result.white.knights++
                                    result.white.materialEvaluaton += evaluation.knights
                                    break
                                case pieceKind.Bishop:
                                    result.white.bishops++
                                    result.white.materialEvaluaton += evaluation.bishops
                                    break
                                case pieceKind.Queen:
                                    result.white.queens++
                                    result.white.materialEvaluaton += evaluation.queens
                                    break
                                case pieceKind.King:
                                    result.white.kings++
                                    result.white.materialEvaluaton += evaluation.kings
                                    break
                                case pieceKind.Pawn:
                                    result.white.pawns++
                                    result.white.materialEvaluaton += evaluation.pawns
                                    break
                            }
                            result.white.total++
                            break
                    }
                    result.total++
                }
            }
        }
        return result;
    }

    private getKingField(color_: color): boardFieldIdx {
        if (this._emptyBoard) throw new Error('getKing() operation on empty board')
        let kings = this.currentKindOfPiecesOnBoard(color_, pieceKind.King)
        if (kings.length != 1) throw new Error('getKingField(): unexpected number of kings')
        return kings[0].field
    }

    private getAttackedFieldsByRook(pieceOB_: pieceOnBoard): boardFieldIdx[] {
        let rookMoves: boardFieldIdx[] = []
        let f: boardFieldIdx
        const rays = [rookRay.W, rookRay.E, rookRay.S, rookRay.N]
        let rookMovesRaw = new RookMovesRaw(pieceOB_.field, this.board)
        for (const ray of rays) {
            let moveRay = rookMovesRaw.getRay(ray)
            for (f of moveRay) {
                rookMoves.push(f)
                if (!this.isFieldEmpty(f)) break
            }
        }
        return rookMoves;
    }
    private getAttackedFieldsByKnight(pieceOB_: pieceOnBoard): boardFieldIdx[] {
        let knightMoves = new KnightMovesRaw(pieceOB_.field, this.board)
        return knightMoves.moves
    }
    private getAttackedFieldsByBishop(pieceOB_: pieceOnBoard): boardFieldIdx[] {
        let bishopMoves: boardFieldIdx[] = []
        let f: boardFieldIdx
        const rays = [bishopRay.SW, bishopRay.NE, bishopRay.NW, bishopRay.SE]
        let bishopMovesRaw = new BishopMovesRaw(pieceOB_.field, this.board)
        for (const ray of rays) {
            let moveRay = bishopMovesRaw.getRay(ray)
            for (f of moveRay) {
                bishopMoves.push(f)
                if (!this.isFieldEmpty(f)) break
            }
        }
        return bishopMoves
    }
    private getAttackedFieldsByQueen(pieceOB_: pieceOnBoard): boardFieldIdx[] {
        let queenMoves: boardFieldIdx[] = []
        let f: boardFieldIdx

        const raysR = [rookRay.W, rookRay.E, rookRay.S, rookRay.N]
        let rookMovesRaw = new RookMovesRaw(pieceOB_.field, this.board)
        for (const ray of raysR) {
            let moveRay = rookMovesRaw.getRay(ray)
            for (f of moveRay) {
                queenMoves.push(f);
                if (!this.isFieldEmpty(f)) break
            }
        }

        const raysB = [bishopRay.SW, bishopRay.NE, bishopRay.NW, bishopRay.SE]
        let bishopMovesRaw = new BishopMovesRaw(pieceOB_.field, this.board)
        for (const ray of raysB) {
            let moveRay = bishopMovesRaw.getRay(ray)
            for (f of moveRay) {
                queenMoves.push(f)
                if (!this.isFieldEmpty(f)) break
            }
        }
        return queenMoves
    }
    private getAttackedFieldsByPawnBlack(pieceOB_: pieceOnBoard): boardFieldIdx[] {
        //TODO refactoring by using PawnMovesRaw class
        const offsetsPawn = [offsets.SW, offsets.SE];
        let pawnCaptureMoves: boardFieldIdx[] = [];
        const startField = pieceOB_.field;
        for (const f of offsetsPawn) {
            let newField = shiftField(startField, f)
            if (this.board.isFieldOnBoard(newField)) {
                pawnCaptureMoves.push(newField);
            }
        }
        return pawnCaptureMoves;
    }
    private getAttackedFieldsByPawnWhite(pieceOB_: pieceOnBoard): boardFieldIdx[] {
        //TODO refactoring by using PawnMovesRaw class
        const offsetsPawn = [offsets.NW, offsets.NE]
        let pawnCaptureMoves: boardFieldIdx[] = []
        const startField = pieceOB_.field
        for (const f of offsetsPawn) {
            let newField = shiftField(startField, f)
            if (this.board.isFieldOnBoard(newField)) {
                pawnCaptureMoves.push(newField)
            }
        }
        // TODO how to handle e.p. here?
        return pawnCaptureMoves
    }
    private getAttackedFieldsByKing(pieceOB_: pieceOnBoard): boardFieldIdx[] {
        let kingMoves = new KingMovesRaw(pieceOB_.field, this.board)
        return kingMoves.moves;
    }

    getAttackedFieldsByPiece(pieceOB_: pieceOnBoard): boardFieldIdx[] {
        switch (pieceOB_.piece.kind) {
            case pieceKind.Rook:
                return this.getAttackedFieldsByRook(pieceOB_)
            case pieceKind.Knight:
                return this.getAttackedFieldsByKnight(pieceOB_)
            case pieceKind.Bishop:
                return this.getAttackedFieldsByBishop(pieceOB_)
            case pieceKind.Queen:
                return this.getAttackedFieldsByQueen(pieceOB_)
            case pieceKind.King:
                return this.getAttackedFieldsByKing(pieceOB_)
            case pieceKind.Pawn:
                switch (pieceOB_.piece.color) {
                    case color.black:
                        return this.getAttackedFieldsByPawnBlack(pieceOB_)
                    case color.white:
                        return this.getAttackedFieldsByPawnWhite(pieceOB_)
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
                            this._fieldsAttackedByWhite.add(field, piece)
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

    isPieceAttackedOn(field: boardFieldIdx, attackingColor: color): boolean {
        return this.getAttackedFields(attackingColor).isAttacked(field)
    }
    getAttackersOn(field: boardFieldIdx, attackingColor: color): pieceOnBoard[] {
        return this.getAttackedFields(attackingColor).attackersOn(field)
    }

    isCheckAfterMove(move_: moveOnBoard): boolean {
        let tmpBoard = new ChessBoard()
        tmpBoard.setBoard(this._board)
        tmpBoard.setPiece(move_.pieceOB.piece, move_.target)
        tmpBoard.removePiece(move_.pieceOB.field)
        // TODO move capture logic here
        // TODO handle capture, e.p. (no castle)
        return tmpBoard.isCheck()
    }

    private getLegalMovesOfRook(pieceOB_: pieceOnBoard): moveOnBoard[] {
        let result: moveOnBoard[] = []
        let target: boardFieldIdx
        const rays = [rookRay.W, rookRay.E, rookRay.S, rookRay.N]
        let rookMovesRaw = new RookMovesRaw(pieceOB_.field, this.board)
        for (const ray of rays) {
            let moveRay = rookMovesRaw.getRay(ray)
            for (target of moveRay) {
                let m = this.moveIdx(pieceOB_.field, target, { validateOnly: true })
                if (m !== undefined) result.push(m)
                if (!this.isFieldEmpty(target)) break
            }
        }
        return result
    }
    getLegalMovesOfKnight(pieceOB_: pieceOnBoard): moveOnBoard[] {
        let result: moveOnBoard[] = []
        let knightMoves = new KnightMovesRaw(pieceOB_.field, this.board)
        for (let target of knightMoves.moves) {
            let m = this.moveIdx(pieceOB_.field, target, { validateOnly: true })
            if (m !== undefined) result.push(m)
        }
        return result
    }
    getLegalMovesOfBishop(pieceOB_: pieceOnBoard): moveOnBoard[] {
        let result: moveOnBoard[] = []
        let target: boardFieldIdx
        const rays = [bishopRay.SW, bishopRay.NE, bishopRay.NW, bishopRay.SE]
        let bishopMovesRaw = new BishopMovesRaw(pieceOB_.field, this.board)
        for (const ray of rays) {
            let moveRay = bishopMovesRaw.getRay(ray)
            for (target of moveRay) {
                let m = this.moveIdx(pieceOB_.field, target, { validateOnly: true })
                if (m !== undefined) result.push(m)
                if (!this.isFieldEmpty(target)) break
            }
        }
        return result
    }
    getLegalMovesOfQueen(pieceOB_: pieceOnBoard): moveOnBoard[] {
        let result: moveOnBoard[] = []
        let target: boardFieldIdx
        const raysR = [rookRay.W, rookRay.E, rookRay.S, rookRay.N]
        let rookMovesRaw = new RookMovesRaw(pieceOB_.field, this.board)
        for (const ray of raysR) {
            let moveRay = rookMovesRaw.getRay(ray)
            for (target of moveRay) {
                let m = this.moveIdx(pieceOB_.field, target, { validateOnly: true })
                if (m !== undefined) result.push(m)
                if (!this.isFieldEmpty(target)) break
            }
        }
        const raysB = [bishopRay.SW, bishopRay.NE, bishopRay.NW, bishopRay.SE]
        let bishopMovesRaw = new BishopMovesRaw(pieceOB_.field, this.board)
        for (const ray of raysB) {
            let moveRay = bishopMovesRaw.getRay(ray)
            for (target of moveRay) {
                let m = this.moveIdx(pieceOB_.field, target, { validateOnly: true })
                if (m !== undefined) result.push(m)
                if (!this.isFieldEmpty(target)) break
            }
        }
        return result
    }
    getLegalMovesOfKing(pieceOB_: pieceOnBoard): moveOnBoard[] {
        let result: moveOnBoard[] = []
        let kingMoves = new KingMovesRaw(pieceOB_.field, this.board)
        for (let target of kingMoves.moves) {
            let m = this.moveIdx(pieceOB_.field, target, { validateOnly: true })
            if (m !== undefined) result.push(m)
        }
        let castleDataShort = KingMovesRaw.castle(pieceOB_.piece.color!, castleType.short)
        if (pieceOB_.field == castleDataShort.kingSource) {
            let m = this.moveIdx(pieceOB_.field, castleDataShort.kingTarget, { validateOnly: true })
            if (m !== undefined) result.push(m)
        }
        let castleDataLong = KingMovesRaw.castle(pieceOB_.piece.color!, castleType.short)
        if (pieceOB_.field == castleDataLong.kingSource) {
            let m = this.moveIdx(pieceOB_.field, castleDataLong.kingTarget, { validateOnly: true })
            if (m !== undefined) result.push(m)
        }
        return result
    }
    getLegalMovesOfPawn(pieceOB_: pieceOnBoard): moveOnBoard[] {
        let result: moveOnBoard[] = []
        let pawnMovesRaw = new PawnMovesRaw(pieceOB_.field, pieceOB_.piece.color!, this.board)
        for (let pawnMove of pawnMovesRaw.moves) {
            if (pawnMove.isPromotion) {
                for (let promoKind of PawnMovesRaw.promotionPieces) {
                    let m = this.moveIdx(pieceOB_.field, pawnMove.target, { promotionPieceKind: promoKind, validateOnly: true })
                    if (m !== undefined) result.push(m)
                }
            }
            else { // no promotion
                let m = this.moveIdx(pieceOB_.field, pawnMove.target, { validateOnly: true })
                if (m !== undefined) result.push(m)
            }
        }
        for (let pawnAttack of pawnMovesRaw.attacks) {
            if (pawnAttack.isPromotion) {
                for (let promoKind of PawnMovesRaw.promotionPieces) {
                    let m = this.moveIdx(pieceOB_.field, pawnAttack.target, { promotionPieceKind: promoKind, validateOnly: true })
                    if (m !== undefined) result.push(m)
                }
            }
            else {
                let m = this.moveIdx(pieceOB_.field, pawnAttack.target, { validateOnly: true })
                if (m !== undefined) result.push(m)
            }
        }
        return result
    }
    getLegalMovesOfPiece(piece_: pieceOnBoard): moveOnBoard[] {
        let result: moveOnBoard[] = []
        switch (piece_.piece.kind) {
            case pieceKind.Rook:
                return this.getLegalMovesOfRook(piece_)
            case pieceKind.Knight:
                return this.getLegalMovesOfKnight(piece_)
            case pieceKind.Bishop:
                return this.getLegalMovesOfBishop(piece_)
            case pieceKind.Queen:
                return this.getLegalMovesOfQueen(piece_)
            case pieceKind.King:
                return this.getLegalMovesOfKing(piece_)
            case pieceKind.Pawn:
                return this.getLegalMovesOfPawn(piece_)
            case pieceKind.none:
        }
        return result
    }
    getLegalMoves(): moveOnBoard[] {
        let result: moveOnBoard[] = []
        let movingPieces = this.currentPiecesOnBoard(this._data.nextMoveBy)
        for (let piece_ of movingPieces) {
            result = result.concat(this.getLegalMovesOfPiece(piece_))
        }
        return result
    }

    setWinningColor(color_: color) {
        switch (color_) {
            case color.black:
                this._data.gameResult = GameResult.black_wins
                break
            case color.white:
                this._data.gameResult = GameResult.white_wins
                break
        }
    }
    isCheck(): boolean {
        return this.isPieceAttackedOn(this.getKingField(this._data.nextMoveBy), otherColor(this._data.nextMoveBy))
    }
    isMate(): boolean {
        let color = this._data.nextMoveBy
        //if (!this.isCheck(color_)) return false
        let kingField = this.getKingField(color)
        // check if the King can move unattacked
        let tmpBoard = new ChessBoard()
        tmpBoard.setBoard(this._board)
        tmpBoard.removePiece(kingField) // avoid the king blocking checks by itself
        let kingMoves = new KingMovesRaw(kingField, this.board)
        for (let m of kingMoves.moves) {
            let p = this.peekField(m)
            if (p.isPiece && p.color == color) continue // field is block by own piece
            if (!tmpBoard.isPieceAttackedOn(m, otherColor(color))) {
                return false // could move here
            }
        }
        let attackers = this.getAttackersOn(kingField, otherColor(color))
        if (attackers.length == 0) return false // no check
        if (attackers.length > 1) return true // double check
        // check if attackers can be captured.
        let attackersAttackers = this.getAttackersOn(attackers[0].field, color)
        if (attackersAttackers.length > 0) {
            if (attackersAttackers.length == 1) {
                if (attackersAttackers[0].piece.kind == pieceKind.King) {
                    // so if the king is the only one attacking that checking piece, it must be protected
                    if (!this.isPieceAttackedOn(attackers[0].field, color)) return false
                }
                else return false;
            }
            else return false // attacker could be captured
        }
        //TODO handle:  moving something in between 
        return true
    }
    private isStaleMate(): boolean {
        // TODO: a specific hasLegalMoves could be more performant
        return !this.isCheck() && this.getLegalMoves().length == 0
    }
    private check50MovesRule(): boolean {
        // no pawn has moven and no capture for 50 Moves
        // game maybe continued if the player does not claim draw.
        return this._data.halfMoves50 >= 50 * 2
    }
    private check75MovesRule(): boolean {
        // no pawn has moven and no capture for 75 Moves
        // FIDE Rule (since 1.July 2014) forced and automatic end of game by draw (unless the last move is mate)
        return this._data.halfMoves50 >= 75 * 2
    }
    private threefoldRepetition(): boolean {
        // 3 identical position (same player to move, same castle rights, same enpassant options, same moves available) each time as the current board
        // game maybe continued if the player does not claim draw.
        // TODO: This could be done, when inserting a new move (i.e. store repetition count there)
        let positionCount: { key: BigInt, count: number }[] = []
        for (let m of this._history) {
            let found = positionCount.find(x => x.key == m.boardKey)
            if (found) {
                found.count++
                if (found.count >= 3) return true
            }
            else {
                positionCount.push({ key: m.boardKey!, count: 1 })
            }
        }
        return false
    }
    private fivefoldRepetition(): boolean {
        // FIDE Rule (since 1.July 2014) forced and automatic end of game by draw after the 5th positional repetion
        let positionCount: { key: BigInt, count: number }[] = []
        for (let m of this._history) {
            let found = positionCount.find(x => x.key == m.boardKey)
            if (found) {
                found.count++
                if (found.count >= 5) return true
            }
            else {
                positionCount.push({ key: m.boardKey!, count: 1 })
            }
        }
        return false
    }
    private drawByDeadPosition(): boolean { // insufficient material
        let spec = this.currentPieceSpectrum()
        // K vs K
        if (spec.total == 2) return true;
        if (spec.total == 3) {
            // K vs K+B
            if (spec.black.bishops == 1 || spec.white.bishops == 1) return true;
            // K vs K+N
            if (spec.black.knights == 1 || spec.white.knights == 1) return true;
        }
        if (spec.black.total == 2 && spec.white.total == 2) {
            // K+B vs K+B, with Bishops on same color
            if (spec.black.bishops == 1 && spec.white.bishops == 1) {
                //TODO: check if both have the same colored field
                return true;

            }
        }
        // TODO add check funtion for : almost certain draws
        // K vs K+N+N
        // K+N vs K+N
        // K+B vs K+N
        // K+B vs K+N+N
        // K+B vs K+N+B
        // K+B+N vs K+R
        // ...
        // rule of thumb: Side without pawns has to have +4 pawnUnits material to win
        return false
    }
    isGameOver(): boolean {
        let color_ = this._data.nextMoveBy
        let kingField = this.getKingField(otherColor(color_))
        if (this.isPieceAttackedOn(kingField, color_)) { // we have the move and it's already check. NOPE, we consider this as finished
            this.setWinningColor(color_)
            return true
        }
        if (this.isMate()) {
            this.setWinningColor(otherColor(color_))
            return true
        }
        if (this.isStaleMate()) {
            this._data.gameResult = GameResult.draw
            return true
        }
        if (this.drawByDeadPosition()) {
            this._data.gameResult = GameResult.draw
            return true
        }
        if (this.check50MovesRule()) {
            this._data.drawPossible50MovesRule = true
        }
        if (this.check75MovesRule()) { // FIDE: is forced draw
            this._data.gameResult = GameResult.draw
            return true
        }
        if (this.threefoldRepetition()) {
            this._data.drawPossibleThreefoldRepetion = true
        }
        if (this.fivefoldRepetition()) { // FIDE: is forced draw
            this._data.gameResult = GameResult.draw
            return true
        }
        return false// this.
    }

    move(move: string): boolean {
        // allow SAN like formats (not very strict as long as it is parsable, it'll be processed)
        // Strip additional information

        // TODO turn off caste option if a rook is captured
        // TODO use Zobrist Hashing to store positon in History, see https://www.chessprogramming.org/Zobrist_Hashing

        if (this._data.gameOver) return false // no moves on a finished game

        let moveCleanedUp = move.replace(/=/, '').replace(/[+#]?[?!]*$/, '')
        if (moveCleanedUp === KingMovesRaw.CASTLE_SHORT_STR) {
            return this.moveCastle(this._data.nextMoveBy, castleType.short) !== undefined
        }
        else if (moveCleanedUp === KingMovesRaw.CASTLE_LONG_STR) {
            return this.moveCastle(this._data.nextMoveBy, castleType.long) !== undefined
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
                let { valid: validPiece, piece: piece_ } = charPGNToPiece(piece, this._data.nextMoveBy)
                if (!validPiece) { // maybe a pawn
                    piece_ = (this._data.nextMoveBy == color.black) ? Piece.blackPawn() : Piece.whitePawn()
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
                return this.moveIdx(source!, target, { promotionPieceKind: promotionPiece_.kind }) !== undefined
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
                let candidates = this.currentKindOfPiecesOnBoard(this._data.nextMoveBy, piece_.kind)
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
                switch (this._data.nextMoveBy) {
                    case color.black:
                        field = shiftField(target, offsets.N)
                        if (this.board.isFieldOnBoard(field)) {
                            p = this.peekFieldPieceOB(field)
                            if (p.piece.kind == pieceKind.Pawn) candidatesP.push(p)
                            else if (target.rowIdx == 3 && p.piece.kind == pieceKind.none) {
                                field = shiftField(field, offsets.N)
                                if (this.board.isFieldOnBoard(field)) {
                                    p = this.peekFieldPieceOB(field)
                                    if (p.piece.kind == pieceKind.Pawn) candidatesP.push(p)
                                }
                            }
                        }
                        field = shiftField(target, offsets.NW)
                        if (this.board.isFieldOnBoard(field)) {
                            p = this.peekFieldPieceOB(field)
                            if (p.piece.kind == pieceKind.Pawn)
                                if ((typeof sourceColIdx !== 'undefined' && p.field.colIdx == sourceColIdx) || (typeof sourceColIdx == 'undefined'))
                                    candidatesP.push(p)
                        }
                        field = shiftField(target, offsets.NE)
                        if (this.board.isFieldOnBoard(field)) {
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
                        if (this.board.isFieldOnBoard(field)) {
                            p = this.peekFieldPieceOB(field)
                            if (p.piece.kind == pieceKind.Pawn) candidatesP.push(p)
                            else if (target.rowIdx == 4 && p.piece.kind == pieceKind.none) {
                                field = shiftField(field, offsets.S)
                                if (this.board.isFieldOnBoard(field)) {
                                    p = this.peekFieldPieceOB(field)
                                    if (p.piece.kind == pieceKind.Pawn) candidatesP.push(p)
                                }
                            }
                        }
                        field = shiftField(target, offsets.SW)
                        if (this.board.isFieldOnBoard(field)) {
                            p = this.peekFieldPieceOB(field)
                            if (p.piece.kind == pieceKind.Pawn)
                                if ((typeof sourceColIdx !== 'undefined' && p.field.colIdx == sourceColIdx) || (typeof sourceColIdx == 'undefined'))
                                    candidatesP.push(p)
                        }
                        field = shiftField(target, offsets.SE)
                        if (this.board.isFieldOnBoard(field)) {
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

    private moveIdx(source: boardFieldIdx, target: boardFieldIdx, optionals?: { promotionPieceKind?: pieceKind, validateOnly?: boolean }): moveOnBoard | undefined {
        let validateOnly = false;
        let promotionPieceKind = pieceKind.none;
        if (optionals && typeof optionals.validateOnly !== 'undefined') validateOnly = optionals.validateOnly
        if (optionals && typeof optionals.promotionPieceKind !== 'undefined') promotionPieceKind = optionals.promotionPieceKind
        let sourcePieceOB = this.peekFieldPieceOB(source)
        if (sourcePieceOB.piece.kind == pieceKind.none) return undefined
        if (sourcePieceOB.piece.kind == pieceKind.King && Math.abs(target.colIdx - source.colIdx) == 2) { // castle
            if (target.colIdx == KingMovesRaw.kingsTargetColCastleShort)
                return this.moveCastle(sourcePieceOB.piece.color!, castleType.short, validateOnly)
            else if (target.colIdx == KingMovesRaw.kingsTargetColCastleLong)
                return this.moveCastle(sourcePieceOB.piece.color!, castleType.long, validateOnly)
            else return undefined;
        }
        if (sourcePieceOB.piece.kind == pieceKind.Pawn) return this.performMovePawn(source, target, promotionPieceKind, validateOnly)
        return this.performMovePiece(sourcePieceOB, target, validateOnly);
    }

    private performMovePiece(pieceOB: pieceOnBoard, target: boardFieldIdx, validateOnly: boolean = false): moveOnBoard | undefined {
        let _source = pieceOB.field
        let _piece = pieceOB.piece
        let _isCapture = false

        switch (_piece.kind) {
            case pieceKind.Bishop:
                if (this._data.nextMoveBy != _piece.color) return undefined
                let bishopLike = isOffsetBishopLike(_source, target)
                if (!bishopLike.valid) return undefined;
                let bishopMovesRaw = new BishopMovesRaw(_source, this.board)
                let moveRayB = bishopMovesRaw.getRay(bishopLike.ray!)
                for (let f of moveRayB) {
                    if (sameFields(f, target)) break
                    if (!this.isFieldEmpty(f)) return undefined
                }
                if (!this.isFieldEmptyOrCapture(target, _piece.color)) return undefined
                if (this.isCaptureOn(target, _piece.color)) _isCapture = true
                break
            case pieceKind.Knight:
                if (this._data.nextMoveBy != _piece.color) return undefined
                let knightMoves = new KnightMovesRaw(_source, this.board)
                let found = knightMoves.moves.find(x => sameFields(x, target))
                if (typeof found === 'undefined') return undefined
                if (!this.isFieldEmptyOrCapture(target, _piece.color)) return undefined
                if (this.isCaptureOn(target, _piece.color)) _isCapture = true
                break
            case pieceKind.Rook:
                if (this._data.nextMoveBy != _piece.color) return undefined
                let rookLike = isOffsetRookLike(_source, target)
                if (!rookLike.valid) return undefined;
                let rookMovesRaw = new RookMovesRaw(_source, this.board)
                let moveRayR = rookMovesRaw.getRay(rookLike.ray!)
                for (let f of moveRayR) {
                    if (sameFields(f, target)) break
                    if (!this.isFieldEmpty(f)) return undefined
                }
                if (!this.isFieldEmptyOrCapture(target, _piece.color)) return undefined
                if (this.isCaptureOn(target, _piece.color)) _isCapture = true
                if (!validateOnly) {
                    if (_source.colIdx == 7 && _piece.color == color.white) this._data.canCastleShortWhite = false;
                    if (_source.colIdx == 0 && _piece.color == color.white) this._data.canCastleLongWhite = false;
                    if (_source.colIdx == 7 && _piece.color == color.black) this._data.canCastleShortBlack = false;
                    if (_source.colIdx == 0 && _piece.color == color.black) this._data.canCastleLongBlack = false;
                }

                break;
            case pieceKind.Queen:
                if (this._data.nextMoveBy != _piece.color) return undefined
                let bishopLikeQ = isOffsetBishopLike(_source, target)
                if (bishopLikeQ.valid) {
                    let bishopMovesRawQ = new BishopMovesRaw(_source, this.board)
                    let moveRayQ = bishopMovesRawQ.getRay(bishopLikeQ.ray!)
                    for (let f of moveRayQ) {
                        if (sameFields(f, target)) break
                        if (!this.isFieldEmpty(f)) return undefined
                    }
                    if (!this.isFieldEmptyOrCapture(target, _piece.color)) return undefined
                    if (this.isCaptureOn(target, _piece.color)) _isCapture = true
                }
                else {
                    let rookLikeQ = isOffsetRookLike(_source, target)
                    if (rookLikeQ.valid) {
                        let rookMovesRawQ = new RookMovesRaw(_source, this.board)
                        let moveRayRQ = rookMovesRawQ.getRay(rookLikeQ.ray!)
                        for (let f of moveRayRQ) {
                            if (sameFields(f, target)) break
                            if (!this.isFieldEmpty(f)) return undefined
                        }
                        if (!this.isFieldEmptyOrCapture(target, _piece.color)) return undefined
                        if (this.isCaptureOn(target, _piece.color)) _isCapture = true
                    }
                    else return undefined
                }
                break;
            case pieceKind.King: // no castle here
                if (this._data.nextMoveBy != _piece.color) return undefined
                let kingMovesRaw = new KingMovesRaw(_source, this.board)
                let legalKingMove = kingMovesRaw.moves.find(x => sameFields(x, target))
                if (typeof legalKingMove === 'undefined') return undefined
                if (!this.isFieldEmptyOrCapture(target, _piece.color)) return undefined
                if (this.isCaptureOn(target, _piece.color)) _isCapture = true
                if (!validateOnly) {
                    this._data.canCastleShortWhite = false;
                    this._data.canCastleLongWhite = false;
                    this._data.canCastleShortBlack = false;
                    this._data.canCastleLongBlack = false;
                }
                break;
            default:
                return undefined
        }

        // check if checked after move (i.e. was a pin)
        // TODO use isCheckAfterMove()
        let tmpBoard = new ChessBoard()
        tmpBoard.setBoard(this._board)
        tmpBoard.setPiece(pieceOB.piece, target)
        tmpBoard.removePiece(_source)
        if (tmpBoard.isCheck()) return undefined

        // set the move
        let move: moveOnBoard = { pieceOB: pieceOB, target: target }
        if (_isCapture)
            move.pieceCaptured = this.peekFieldPieceOB(target);

        if (!validateOnly) {
            this.setPiece(pieceOB.piece, target)
            this.removePiece(_source)
            this.addMoveToHistory(move)
            this._data.enPassantPossible = false;
            this._data.enPassantField = undefined
            if (_isCapture)
                this._data.halfMoves50 = 0
            else
                this._data.halfMoves50++
            this._data.nextMoveBy = otherColor(this._data.nextMoveBy)
            if (this._data.nextMoveBy == color.white) this._data.moveNumber++
            this.clearAttackedFields()
            this._data.gameOver = this.isGameOver()
        }
        return move
    }
    private performMovePawn(source: boardFieldIdx, target: boardFieldIdx, promotionPiece: pieceKind = pieceKind.none, validateOnly: boolean = false): moveOnBoard | undefined {
        let _enPassantPossible: boolean = false
        let _enPassantField: boardFieldIdx | undefined
        let _isCapture: boolean = false
        let _isCaptureEP: boolean = false
        let _isPromotion: boolean = false
        let p = this.peekField(source)
        if (p.kind != pieceKind.Pawn) return undefined
        if (this._data.nextMoveBy != p.color) return undefined
        // TODO refactorize using the PawnRaw class
        switch (p.color) {
            case color.black: // row ++
                if (target.colIdx == source.colIdx) { // forward move
                    if (source.rowIdx == 1 && (target.rowIdx - source.rowIdx == 2)) { // e.p. possible
                        _enPassantField = { colIdx: source.colIdx, rowIdx: source.rowIdx + 1 }
                        if (!this.isFieldEmpty(_enPassantField)) return undefined
                        if (!this.isFieldEmpty(target)) return undefined
                        _enPassantPossible = true
                    }
                    else if (target.rowIdx - source.rowIdx == 1) { // move
                        if (!this.isFieldEmpty(target)) return undefined
                        if (target.rowIdx == 7) {
                            _isPromotion = true
                            if (promotionPiece == pieceKind.none || promotionPiece == pieceKind.Pawn || promotionPiece == pieceKind.King) return undefined
                        }
                    }
                    else return undefined
                }
                else if (Math.abs(target.colIdx - source.colIdx) == 1) { // capture
                    if (target.rowIdx - source.rowIdx == 1) {
                        if (this._data.enPassantPossible && sameFields(this._data.enPassantField!, target)) {
                            _isCaptureEP = true
                        }
                        else {
                            if (!this.isCaptureOn(target, p.color)) return undefined
                            if (target.rowIdx == 7) {
                                _isPromotion = true
                                if (promotionPiece == pieceKind.none || promotionPiece == pieceKind.Pawn || promotionPiece == pieceKind.King) return undefined
                            }
                        }
                        _isCapture = true
                    }
                    else return undefined
                }
                else return undefined
                break;
            case color.white: // row --
                if (target.colIdx == source.colIdx) { // forward move
                    if (source.rowIdx == 6 && (source.rowIdx - target.rowIdx == 2)) { // e.p. possible
                        _enPassantField = { colIdx: source.colIdx, rowIdx: source.rowIdx - 1 }
                        if (!this.isFieldEmpty(_enPassantField)) return undefined
                        if (!this.isFieldEmpty(target)) return undefined
                        _enPassantPossible = true
                    }
                    else if (source.rowIdx - target.rowIdx == 1) { // move
                        if (!this.isFieldEmpty(target)) return undefined
                        if (target.rowIdx == 0) {
                            _isPromotion = true
                            if (!isLegalPromotionPiece(promotionPiece)) return undefined
                        }
                    }
                    else return undefined
                }
                else if (Math.abs(target.colIdx - source.colIdx) == 1) { // capture
                    if (source.rowIdx - target.rowIdx == 1) {
                        if (this._data.enPassantPossible && sameFields(this._data.enPassantField!, target)) {
                            _isCaptureEP = true
                        }
                        else {
                            if (!this.isCaptureOn(target, p.color)) return undefined
                            if (target.rowIdx == 0) {
                                _isPromotion = true
                                if (!isLegalPromotionPiece(promotionPiece)) return undefined
                            }
                            _isCapture = true
                        }
                    }
                    else return undefined
                }
                else return undefined
                break
        }

        // check if checked after move (i.e. was a pin)
        // TODO use isCheckAfterMove()
        let tmpBoard = new ChessBoard()
        tmpBoard.setBoard(this._board)
        if (_isPromotion)
            tmpBoard.setPiece(Piece.getPiece(promotionPiece, p.color), target)
        else
            tmpBoard.setPiece(p, target)
        tmpBoard.removePiece(source)
        if (_isCaptureEP) {
            switch (p.color) {
                case color.black:
                    tmpBoard.removePiece({ colIdx: this._data.enPassantField!.colIdx, rowIdx: this._data.enPassantField!.rowIdx - 1 })
                    break
                case color.white:
                    tmpBoard.removePiece({ colIdx: this._data.enPassantField!.colIdx, rowIdx: this._data.enPassantField!.rowIdx + 1 })
                    break
            }
        }
        if (tmpBoard.isCheck()) return undefined;

        // validation complete, create move
        let move: moveOnBoard = { pieceOB: this.peekFieldPieceOB(source), target: target }
        if (_isCapture)
            move.pieceCaptured = this.peekFieldPieceOB(target);
        if (_isPromotion) {
            move.promotionPiece = promotionPiece
        }
        if (_isCaptureEP) {
            switch (p.color) {
                case color.black:
                    move.pieceCaptured = this.peekFieldPieceOB({ colIdx: this._data.enPassantField!.colIdx, rowIdx: this._data.enPassantField!.rowIdx - 1 })
                    break
                case color.white:
                    move.pieceCaptured = this.peekFieldPieceOB({ colIdx: this._data.enPassantField!.colIdx, rowIdx: this._data.enPassantField!.rowIdx + 1 })
                    break
            }
        }

        // validation complete, perform move
        if (!validateOnly) {
            if (_isPromotion) {
                this.setPiece(Piece.getPiece(promotionPiece, p.color), target)
            }
            else
                this.setPiece(p, target)
            this.removePiece(source)
            if (_isCaptureEP) {
                switch (p.color) {
                    case color.black:
                        this.removePiece({ colIdx: this._data.enPassantField!.colIdx, rowIdx: this._data.enPassantField!.rowIdx - 1 })
                        break
                    case color.white:
                        this.removePiece({ colIdx: this._data.enPassantField!.colIdx, rowIdx: this._data.enPassantField!.rowIdx + 1 })
                        break
                }
            }
            this.addMoveToHistory(move)

            this._data.enPassantPossible = false
            this._data.enPassantField = undefined
            if (_enPassantPossible) {
                this._data.enPassantPossible = true
                this._data.enPassantField = _enPassantField
            }

            this._data.halfMoves50 = 0
            this._data.nextMoveBy = otherColor(this._data.nextMoveBy)
            if (this._data.nextMoveBy == color.white) this._data.moveNumber++
            this.clearAttackedFields()
            this._data.gameOver = this.isGameOver()
        }
        return move
    }
    private moveCastle(color_: color, type_: castleType, validateOnly: boolean = false): moveOnBoard | undefined {
        let colIdx_: number

        if (!validateOnly && this._data.nextMoveBy != color_) return undefined
        if (!this.canCastle(color_, type_)) return undefined
        let castle = KingMovesRaw.castle(color_, type_)
        if (!this.isPieceOn(castle.kingSource, castle.kingPiece)) return undefined
        if (!this.isPieceOn(castle.rookSource, castle.rookPiece)) return undefined
        for (colIdx_ = castle.betweenPathCols.start; colIdx_ <= castle.betweenPathCols.end; colIdx_++)
            if (!this.isFieldEmpty(fieldIdx(colIdx_, castle.row))) return undefined
        for (colIdx_ = castle.kingPathCols.start; colIdx_ <= castle.kingPathCols.end; colIdx_++)
            if (this.isPieceAttackedOn(fieldIdx(colIdx_, castle.row), otherColor(color_))) return undefined

        let move: moveOnBoard = { pieceOB: this.peekFieldPieceOB(castle.kingSource), target: castle.kingTarget }
        move.targetRook = castle.rookTarget

        if (!validateOnly) {
            // validation complete, perform move
            this.addMoveToHistory(move)

            this.setPiece(castle.kingPiece, castle.kingTarget)
            this.removePiece(castle.kingSource)
            this.setPiece(castle.rookPiece, castle.rookTarget)
            this.removePiece(castle.rookSource)

            this._data.halfMoves50++
            this._data.enPassantPossible = false
            this._data.enPassantField = undefined

            // next move
            this._data.nextMoveBy = otherColor(this._data.nextMoveBy)
            if (this._data.nextMoveBy == color.white) this._data.moveNumber++
            this.clearAttackedFields()
            this._data.gameOver = this.isGameOver()
        }
        return move
    }

    //TODO doMove, undoMove using moveOnBoard structure

    private setPiece(piece_: Piece, field: boardFieldIdx) {
        this._board[field.colIdx][field.rowIdx] = piece_
    }
    private removePiece(field: boardFieldIdx) {
        this._board[field.colIdx][field.rowIdx] = Piece.none()
    }

}