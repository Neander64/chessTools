
import { EncodedPositionKey, encodeType } from './encode-position-key'
import { Piece, pieceKind } from './chess-board-pieces'
import { color, otherColor } from './chess-color'
import { boardFieldIdx } from './chess-board-internal-types'
import { castleType, CastleFlags, KingMovesRaw } from './chess-board-king-moves'
import { PawnMovesRaw } from './chess-board-pawn-moves'
import { ChessBoardRepresentation, Field, IField, pieceOnBoard } from './chess-board-representation'
import { offsetsEnum } from './chess-board-offsets'

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
/*
function isLegalPromotionPiece(kind_: pieceKind): boolean {
    //return kind_ != pieceKind.none && kind_ != pieceKind.Pawn && kind_ != pieceKind.King
    return kind_ < pieceKind.King
}
*/
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



export type moveOnBoard = { // Data to do/undo moves
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
    castleFlags: CastleFlags
    get enPassantPossible(): boolean
    enPassantField: IField | undefined

    nextMoveBy: color // not sure if this or isWhitsMove should be in the interface...
    halfMoves50: number
    moveNumber: number
    gameOver: boolean // meaning: no further moves are allowed.
    canCastle(color_: color, type_: castleType): boolean
}

export class ChessBoardData implements IChessBoardData {
    nextMoveBy!: color
    castleFlags: CastleFlags
    //enPassantPossible!: boolean
    enPassantField: IField | undefined
    halfMoves50!: number
    moveNumber!: number
    gameOver!: boolean // meaning: no further moves are allowed.
    gameResult!: GameResult
    drawPossible50MovesRule!: boolean
    drawPossibleThreefoldRepetion!: boolean
    constructor() {
        this.castleFlags = new CastleFlags()
        this.init()
    }
    get enPassantPossible(): boolean { return typeof this.enPassantField !== 'undefined' }
    init() {
        this.nextMoveBy = color.white
        this.castleFlags.noCastle(color.white)
        this.castleFlags.noCastle(color.black)
        // this.canCastleShortWhite = false
        // this.canCastleLongWhite = false
        // this.canCastleShortBlack = false
        // this.canCastleLongBlack = false
        // this.enPassantPossible = false
        this.enPassantField = undefined
        this.halfMoves50 = 0
        this.moveNumber = 1
        this.gameOver = true
        this.gameResult = GameResult.none
        this.drawPossible50MovesRule = false
        this.drawPossibleThreefoldRepetion = false
    }
    get isWhitesMove() { return this.nextMoveBy == color.white }
    canCastle(color_: color, type_: castleType): boolean { return this.castleFlags.getCastleFlag(color_, type_) }
}
export class ChessBoard {

    readonly initialBoardFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

    //private _board: Piece[][] = [] // col/row : [0][0]="a8" .. [7][7]="h1"
    private _b: ChessBoardRepresentation
    private _history: moveOnBoard[] = []
    private _data: ChessBoardData


    constructor(fen?: string) {
        this._data = new ChessBoardData()
        this._b = new ChessBoardRepresentation(this._data)
        this.clearBoard()
        if (fen) this.loadFEN(fen);
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
        this.board.clearBoard()
        this._history = []
        this._data.init()
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
                        this.board.setPiece(pResult.piece, this.board.field(colIdx++, rowIdx))
                        //this._board[colIdx++][rowIdx] = pResult.piece
                    }
                    else {
                        if (digit <= 0 || digit > 8 - colIdx) throw new Error('loadFEN(): unexpected digit in position')
                        while (digit > 0 && colIdx < 8) {
                            this.board.setPiece(Piece.none(), this.board.field(colIdx++, rowIdx))
                            //this._board[colIdx++][rowIdx] = Piece.none()
                            digit--
                        }
                    }
                }
            }
            // board validation
            let blackPieces = this.board.currentPiecesOnBoard(color.black)
            let blackKings = blackPieces.filter(val => (val.piece.kind == pieceKind.King && val.piece.color == color.black))
            if (blackKings.length != 1) throw new Error('loadFEN(): unexpected number of black kings')
            //this._blackKing = blackKings[0]
            let blackPawns = blackPieces.filter(val => (val.piece.kind == pieceKind.Pawn && val.piece.color == color.black))
            if (blackPawns.length > 8) throw new Error('loadFEN(): too many black pawns')

            let whitePieces = this.board.currentPiecesOnBoard(color.white)
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
            this._data.castleFlags.canCastleShortWhite = (fenTokens[2].indexOf('K') > -1)
            this._data.castleFlags.canCastleLongWhite = (fenTokens[2].indexOf('Q') > -1)
            this._data.castleFlags.canCastleShortBlack = (fenTokens[2].indexOf('k') > -1)
            this._data.castleFlags.canCastleLongBlack = (fenTokens[2].indexOf('q') > -1)
            // TODO check if none specified must be '-' (strict mode)

            //4. en passant
            //this._data.enPassantPossible = (fenTokens[3] !== '-')
            if (fenTokens[3] !== '-') {
                if (fenTokens[3].length != 2) throw new Error('loadFEN(): en passant unexpected format')
                this._data.enPassantField = this.board.fieldFromNotation(fenTokens[3])
            }
            else this._data.enPassantField = undefined

            //5. number of half-moves since last capture or pawn move
            this._data.halfMoves50 = parseInt(fenTokens[4], 10)
            if (isNaN(this._data.halfMoves50)) throw new Error('loadFEN(): number of half-moves NAN')

            //6. next move number
            this._data.moveNumber = parseInt(fenTokens[5], 10)
            if (isNaN(this._data.moveNumber)) throw new Error('loadFEN(): moveNumber NAN')
            if (this._data.moveNumber <= 0) throw new Error('loadFEN(): moveNumber negative/zero')

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
                if (!this.board.isPiece(col, row))//this._board[col][row].isEmpty)
                    emptyCount++
                else {
                    if (emptyCount > 0) {
                        fen += emptyCount
                        emptyCount = 0
                    }
                    fen += pieceToChar(this.board.peekField(this.board.field(col, row)))
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
        if (this._data.castleFlags.none())
            fen += '-'
        else {
            if (this._data.castleFlags.canCastleShortWhite) fen += 'K'
            if (this._data.castleFlags.canCastleLongWhite) fen += 'Q'
            if (this._data.castleFlags.canCastleShortBlack) fen += 'k'
            if (this._data.castleFlags.canCastleLongBlack) fen += 'q'
        }
        fen += ' '

        //4. en passant
        if (!this._data.enPassantPossible)
            fen += '-'
        else
            fen += this._data.enPassantField!.notation
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
                line += pieceToChar(this.board.peekField(this.board.field(col, row))) + (col < 7 ? ' | ' : ' |')
            }
            result.push(line)
            result.push(' -------------------------------')
        }

        result.push('next move color: ' + colorStr(this._data.nextMoveBy))
        result.push('Possible Castle White O-O:' + (this._data.castleFlags.canCastleShortWhite ? 'Y' : 'N') + ', O-O-O:' + (this._data.castleFlags.canCastleLongWhite ? 'Y' : 'N'))
        result.push('Possible Castle Black O-O:' + (this._data.castleFlags.canCastleShortBlack ? 'Y' : 'N') + ', O-O-O:' + (this._data.castleFlags.canCastleLongBlack ? 'Y' : 'N'))
        if (this._data.enPassantPossible) {
            result.push('en passant option at ' + this._data.enPassantField!.notation)
        }
        result.push('moves without pawn or capture: ' + this._data.halfMoves50)
        result.push('move number: ' + this._data.moveNumber)
        //TODO add gameOver status
        result.push('Game Result: ' + gameResult(this._data.gameResult))
        return result
    }



    // TODO: add public function of all pieces on board (for the purpose of board display, i.e. public types only)




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
        let spec = this.board.currentPieceSpectrum()
        // K vs K
        if (spec.black.size == 1 && spec.white.size == 1) return true;
        if (spec.black.size + spec.white.size == 3) {
            // K vs K+B
            if (spec.black.get(Piece.blackBishop()) == 1 || spec.white.get(Piece.whiteBishop()) == 1) return true;
            // K vs K+N
            if (spec.black.get(Piece.blackKnight()) == 1 || spec.white.get(Piece.whiteKnight()) == 1) return true;
        }
        if (spec.black.size == 2 && spec.white.size == 1 &&
            spec.black.get(Piece.blackBishop()) == 1 && spec.white.get(Piece.whiteBishop()) == 1) {
            // K+B vs K+B, with Bishops on same color
            //TODO: check if both have the same colored field
            return true;

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
    isMate(): boolean {
        return this.board.isMate()
    }
    isCheck(): boolean {
        return this.board.isCheck()
    }
    isGameOver(): boolean {
        let color_ = this._data.nextMoveBy
        let kingField = this.board.getKingField(otherColor(color_))
        if (this.board.isPieceAttackedOn(kingField, color_)) { // we have the move and it's already check. NOPE, we consider this as finished
            this.setWinningColor(color_)
            return true
        }
        if (this.board.isMate()) {
            this.setWinningColor(otherColor(color_))
            return true
        }
        if (this.board.isStaleMate()) {
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

        let result = false
        let moveOB: moveOnBoard | undefined
        if (this._data.gameOver) return false // no moves on a finished game

        let moveCleanedUp = move.replace(/=/, '').replace(/[+#]?[?!]*$/, '')
        if (moveCleanedUp === KingMovesRaw.CASTLE_SHORT_STR) {
            moveOB = this.board.moveCastle(castleType.short)
            result = (moveOB !== undefined)
            if (result) {
                this.addMoveToHistory(moveOB!)
                this._data.gameOver = this.isGameOver()
            }
        }
        else if (moveCleanedUp === KingMovesRaw.CASTLE_LONG_STR) {
            moveOB = this.board.moveCastle(castleType.long)
            result = (moveOB !== undefined)
            if (result) {
                this.addMoveToHistory(moveOB!)
                this._data.gameOver = this.isGameOver()
            }
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
                let target = this.board.fieldFromNotationQuiet(to)
                if (!target) return false
                let promotionPiece_: Piece = Piece.none()
                if (!validPiece /* is a pawn */ && promotion) {
                    let { valid: validPiecePromo, piece: promotionPieceIn } = charFENToPiece(promotion);
                    if (!validPiecePromo || (validPiecePromo && !PawnMovesRaw.isLegalPromotionPieceKind(promotionPieceIn.kind)))
                        return false
                    promotionPiece_ = promotionPieceIn
                }
                let source = this.board.fieldFromNotationQuiet(from)
                if (source) {
                    let srcPiece = this.board.peekField(source)
                    if (!validPiece) piece_ = srcPiece
                    else if (!srcPiece.same(piece_)) return false
                }
                else {
                    let source_ = this.findSourceByTarget(from, target, piece_, promotionPiece_.kind)
                    if (typeof source_ === 'undefined') return false
                    source = source_ as Field
                }
                moveOB = this.board.move(source!, target, { promotionPieceKind: promotionPiece_.kind })
                result = (moveOB !== undefined)
                if (result) {
                    this.addMoveToHistory(moveOB!)
                    this._data.gameOver = this.isGameOver()
                }
            }
        }
        return result
    }

    private findSourceByTarget(from: string, target: IField, piece_: Piece, promotionPiece: pieceKind = pieceKind.none): IField | undefined {
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
                let candidates = this.board.currentKindOfPiecesOnBoard(this._data.nextMoveBy, piece_.kind)
                let targetingPieces: pieceOnBoard[] = []
                for (let p of candidates) {
                    if (this.board.validateMove(p, target).isValid) {
                        if ((typeof sourceColIdx !== 'undefined' && p.field.file == sourceColIdx) ||
                            (typeof sourceRowIdx !== 'undefined' && p.field.rank == sourceRowIdx) ||
                            (typeof sourceColIdx === 'undefined' && typeof sourceRowIdx === 'undefined'))
                            targetingPieces.push(p)
                    }
                }
                if (targetingPieces.length != 1) return undefined
                return targetingPieces[0].field

            case pieceKind.Pawn:
                // TODO shift this to PawnMovesRaw class
                let candidatesP: pieceOnBoard[] = []
                let targetingP: pieceOnBoard[] = []
                let field: Field
                let p: pieceOnBoard
                switch (this._data.nextMoveBy) {
                    case color.black:
                        field = target.shift(offsetsEnum.N) as Field
                        if (this.board.isFieldOnBoard(field)) {
                            p = this.board.peekFieldPieceOB(field)
                            if (p.piece.kind == pieceKind.Pawn) candidatesP.push(p)
                            else if (target.rank == 3 && p.piece.kind == pieceKind.none) {
                                field = field.shift(offsetsEnum.N)
                                if (this.board.isFieldOnBoard(field)) {
                                    p = this.board.peekFieldPieceOB(field)
                                    if (p.piece.kind == pieceKind.Pawn) candidatesP.push(p)
                                }
                            }
                        }
                        field = target.shift(offsetsEnum.NW) as Field
                        if (this.board.isFieldOnBoard(field)) {
                            p = this.board.peekFieldPieceOB(field)
                            if (p.piece.kind == pieceKind.Pawn)
                                if ((typeof sourceColIdx !== 'undefined' && p.field.file == sourceColIdx) || (typeof sourceColIdx == 'undefined'))
                                    candidatesP.push(p)
                        }
                        field = target.shift(offsetsEnum.NE) as Field
                        if (this.board.isFieldOnBoard(field)) {
                            p = this.board.peekFieldPieceOB(field)
                            if (p.piece.kind == pieceKind.Pawn)
                                if ((typeof sourceColIdx !== 'undefined' && p.field.file == sourceColIdx) || (typeof sourceColIdx == 'undefined'))
                                    candidatesP.push(p)
                        }
                        for (p of candidatesP) {
                            if (this.board.validateMove(p, target,/*promotionPiece=*/promotionPiece).isValid) {
                                targetingP.push(p)
                            }
                        }
                        if (targetingP.length != 1) return undefined
                        return targetingP[0].field

                    case color.white:
                        field = target.shift(offsetsEnum.S) as Field
                        if (this.board.isFieldOnBoard(field)) {
                            p = this.board.peekFieldPieceOB(field)
                            if (p.piece.kind == pieceKind.Pawn) candidatesP.push(p)
                            else if (target.rank == 4 && p.piece.kind == pieceKind.none) {
                                field = field.shift(offsetsEnum.S)
                                if (this.board.isFieldOnBoard(field)) {
                                    p = this.board.peekFieldPieceOB(field)
                                    if (p.piece.kind == pieceKind.Pawn) candidatesP.push(p)
                                }
                            }
                        }
                        field = target.shift(offsetsEnum.SW) as Field
                        if (this.board.isFieldOnBoard(field)) {
                            p = this.board.peekFieldPieceOB(field)
                            if (p.piece.kind == pieceKind.Pawn)
                                if ((typeof sourceColIdx !== 'undefined' && p.field.file == sourceColIdx) || (typeof sourceColIdx == 'undefined'))
                                    candidatesP.push(p)
                        }
                        field = target.shift(offsetsEnum.SE) as Field
                        if (this.board.isFieldOnBoard(field)) {
                            p = this.board.peekFieldPieceOB(field)
                            if (p.piece.kind == pieceKind.Pawn)
                                if ((typeof sourceColIdx !== 'undefined' && p.field.file == sourceColIdx) || (typeof sourceColIdx == 'undefined'))
                                    candidatesP.push(p)
                        }
                        for (p of candidatesP) {
                            if (this.board.validateMove(p, target,/*promotionPiece=*/promotionPiece).isValid) {
                                targetingP.push(p)
                            }
                        }
                        if (targetingP.length != 1) return undefined
                        return targetingP[0].field
                }
        }
        return undefined
    }


    //TODO doMove, undoMove using moveOnBoard structure

}