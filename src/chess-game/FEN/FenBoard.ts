import { Field } from "../common/Field"
import { fieldNotationType, validateFieldNotation } from "../common/IField"

// TODO create a Interface to a simple Board representation

export class FenBoard {
    static readonly EMPTY_FIELD = ' '

    //private _boardRows: string[] = []
    private _board: string[][] = [];

    constructor() {
        this.clear()
    }
    setBoard(fenBoard: string) {
        let boardRows = fenBoard.split('/')
        if (boardRows.length !== 8)
            throw new FenError('unexpected number of rows in position. Expected 8, got:' + boardRows.length)
        //this._boardRows = boardRows
        let kingCountBlack = 0
        let kingCountWhite = 0
        for (let rankIdx = 0; rankIdx < 8; rankIdx++) {
            const fenRow = boardRows[rankIdx]
            if (fenRow.length > 8 || fenRow.length === 0)
                throw new FenError('unexpected number of columns in position, got:' + fenRow.length + ', row' + fenRow)
            let fileIdx = 0
            for (let p = 0; p < fenRow.length; p++) {
                let digit = +fenRow[p]
                if (fileIdx >= 8)
                    throw new FenError('too many pieces/columns in row:' + fenRow)
                if (isNaN(digit)) { // it's a piece
                    if (!this.validatePiece(fenRow[p]))
                        throw new FenError('invalid piece, got:' + fenRow[p])
                    if (fenRow[p] == 'k')
                        kingCountBlack++
                    if (fenRow[p] == 'K')
                        kingCountWhite++
                    this._board[rankIdx][fileIdx++] = fenRow[p]
                }
                else { // number of empty fields
                    if (digit <= 0 || digit > 8 - fileIdx)
                        throw new FenError('unexpected digit in position, got:' + digit)
                    while (digit > 0 && fileIdx < 8) {
                        this._board[rankIdx][fileIdx++] = FenBoard.EMPTY_FIELD
                        digit--
                    }
                }
            }
            if (fileIdx < 8)
                throw new FenError('not enough pieces/columns in elements :' + fileIdx + ', row:' + fenRow)
        }
        // validate number of kings (could do futher checks, but I don't want to actually prevent artificial positions, like with 9 pawns, 10 Queens etc.)
        if (kingCountBlack != 1)
            throw new FenError('unexpected number of black kings, got:' + kingCountBlack)
        if (kingCountWhite != 1)
            throw new FenError('nexpected number of white kings, got:' + kingCountWhite)

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
            if (emptyCount > 0)
                fen += emptyCount
            if (rankIdx < 7)
                fen += '/'
        }
        return fen
    }
    getPiece(field: fieldNotationType): string | undefined {
        if (!validateFieldNotation(field))
            return undefined
        let f = Field.fromNotation(field)
        let piece = this._board[f.rankIdx][f.fileIdx]
        return piece
    }
    setPiece(field: fieldNotationType, piece: string): boolean {
        if (piece != FenBoard.EMPTY_FIELD && !this.validatePiece(piece))
            return false
        if (!validateFieldNotation(field))
            return false
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
        if (piece.length != 1)
            return false
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
