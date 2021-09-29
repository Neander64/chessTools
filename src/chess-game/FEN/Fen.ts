import { color } from "../common/chess-color"
import { Field } from "../common/Field"
import { fieldNotationType, validateFieldNotation } from "../common/IField"

export class FenBoard {
    static readonly EMPTY_FIELD = ' '

    //private _boardRows: string[] = []
    private _board: string[][] = []

    constructor() {
        this.clear()
    }
    setBoard(fenBoard: string) {
        let boardRows = fenBoard.split('/')
        if (boardRows.length !== 8) throw new FenError('FenBoard.setByFEN(): unexpected number of rows in position. Expected 8, got:' + boardRows.length)
        //this._boardRows = boardRows

        for (let rankIdx = 0; rankIdx < 8; rankIdx++) {
            const fenRow = boardRows[rankIdx]
            if (fenRow.length > 8 || fenRow.length === 0) throw new FenError('loadFEN(): unexpected number of columns in position, got:' + fenRow.length)
            let fileIdx = 0
            for (let p = 0; p < fenRow.length; p++) {
                let digit = parseInt(fenRow[p], 10)
                if (isNaN(digit)) { // it's a piece
                    if (!this.validatePiece(fenRow[p])) throw new FenError('loadFEN(): invalid piece, got:' + fenRow[p])
                    if (fileIdx >= 8) throw new FenError('loadFEN(): too many pieces/columns in row')
                    this._board[rankIdx][fileIdx++] = fenRow[p]
                }
                else { // number of empty fields
                    if (digit <= 0 || digit > 8 - fileIdx) throw new FenError('loadFEN(): unexpected digit in position, got:' + digit)
                    while (digit > 0 && fileIdx < 8) {
                        this._board[rankIdx][fileIdx++] = FenBoard.EMPTY_FIELD
                        digit--
                    }
                }
            }
        }
        // TODO validate number of kings and pawns
    }
    getBoard(): string {
        let fen = ''
        for (let rankIdx = 0; rankIdx < 8; rankIdx++) {
            let emptyCount = 0
            for (let fileIdx = 0; fileIdx < 8; fileIdx++) {
                if (this._board[rankIdx][fileIdx] == FenBoard.EMPTY_FIELD) {
                    emptyCount++
                }
                else {
                    if (emptyCount > 0) {
                        fen += emptyCount
                        emptyCount = 0
                    }
                    fen += this._board[rankIdx][fileIdx]
                }
            }
            if (emptyCount > 0) fen += emptyCount
            if (rankIdx < 7) fen += '/'
        }
        return fen
    }
    getPiece(field: fieldNotationType): string | undefined {
        if (!validateFieldNotation(field)) return undefined
        let f = Field.fromNotation(field)
        let piece = this._board[f.rankIdx][f.fileIdx]
        return piece
    }
    setPiece(field: fieldNotationType, piece: string): boolean {
        if (piece != FenBoard.EMPTY_FIELD && !this.validatePiece(piece)) return false
        if (!validateFieldNotation(field)) return false
        let f = Field.fromNotation(field)
        this._board[f.rankIdx][f.fileIdx] = piece
        return true
    }
    clearBoard() {
        this.clear()
        for (let rankIdx = 0; rankIdx < 8; rankIdx++) {
            for (let fileIdx = 0; fileIdx < 8; fileIdx++) {
                this._board[rankIdx][fileIdx] = FenBoard.EMPTY_FIELD
            }
        }
    }
    validatePiece(piece: string): boolean {
        if (piece.length != 1) return false
        return 'rnbqkpRNBQKP'.indexOf(piece) != -1
    }
    clear() {
        //this._boardRows = []
        for (let rankIdx = 0; rankIdx < 8; rankIdx++) {
            this._board[rankIdx] = []
        }
    }
}
export class FenError extends Error {
    constructor(message: any) {
        super(message)
        this.name = "FenError"
    }
}

export class Fen {
    static readonly initialBoardFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

    fenBoard: FenBoard = new FenBoard()
    activeColor: color = color.white
    canCastleShortWhite: boolean = true
    canCastleLongWhite: boolean = true
    canCastleShortBlack: boolean = true
    canCastleLongBlack: boolean = true
    enPassantField?: string
    plyCount: number = NaN
    moveNumber: number = NaN

    // TODO allow call-back function

    constructor() {
        this.clear()
    }
    isEnPassantPossible(): boolean {
        return typeof this.enPassantField !== 'undefined'
    }
    clear() {
        this.fenBoard.clear()
        this.activeColor = color.white
        this.canCastleShortWhite = true
        this.canCastleLongWhite = true
        this.canCastleShortBlack = true
        this.canCastleLongBlack = true
        this.enPassantField = undefined
        this.plyCount = NaN
        this.moveNumber = NaN
    }
    load(fen: string): void {
        let fenTokens = fen.split(/\s+/)
        if (fenTokens.length !== 6) throw new FenError('fen.load(): unexpected number of FEN-token. Expected 6, got:' + fenTokens.length)

        //1. piece positions
        this.fenBoard.setBoard(fenTokens[0])

        //2. player to move next
        switch (fenTokens[1]) {
            case 'w': this.activeColor = color.white; break
            case 'b': this.activeColor = color.black; break
            default: throw new FenError('fen.load(): illegal player to move. should be "w" or "b", got:' + fenTokens[1])
        }

        //3. castle options
        if (fenTokens[2].length < 1 || fenTokens[2].length > 4) throw new FenError('fen.load(): castle option invalid. length:' + fenTokens[2].length)
        this.canCastleShortWhite = (fenTokens[2].indexOf('K') > -1)
        this.canCastleLongWhite = (fenTokens[2].indexOf('Q') > -1)
        this.canCastleShortBlack = (fenTokens[2].indexOf('k') > -1)
        this.canCastleLongBlack = (fenTokens[2].indexOf('q') > -1)
        let hasCastleOption = (this.canCastleShortWhite && this.canCastleLongWhite && this.canCastleShortBlack && this.canCastleLongBlack)
        if (!hasCastleOption && fenTokens[2] != '-') throw new FenError('fen.load(): no castle option. Expected "-", got:' + fenTokens[2])

        //4. en passant
        if (fenTokens[3] !== '-') {
            if (!Fen.validateEnpassantField(fenTokens[3], this.activeColor)) throw new FenError('loadFEN(): en passant unexpected format. got:' + fenTokens[3])
            this.enPassantField = fenTokens[3]
        }
        else this.enPassantField = undefined

        //5. number of half-moves since last capture or pawn move
        this.plyCount = +fenTokens[4]
        if (isNaN(this.plyCount) || this.plyCount < 0) throw new FenError('loadFEN(): number of half-moves NAN, got:' + fenTokens[4])

        //6. next move number
        this.moveNumber = +fenTokens[5]
        if (isNaN(this.moveNumber) || this.moveNumber <= 0) throw new FenError('loadFEN(): moveNumber invalid, got:' + fenTokens[5])
    }

    private static validateEnpassantField(field: string, activeColor: color): boolean {
        if (!validateFieldNotation(field)) return false
        if (field[1] != ((activeColor == color.white) ? '6' : '3')) return false
        return true
    }


}