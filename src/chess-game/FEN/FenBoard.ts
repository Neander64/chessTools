import { IField } from "../common/IField"
import { Piece, pieceFenType } from "../common/Piece"
import { FenError } from "./FenError"

// TODO create a Interface to a simple Board representation

export class FenBoard {
    static readonly EMPTY_FIELD = ' '

    //private _boardRows: string[] = []
    private _board: pieceFenType[][] = [];

    constructor() {
        this.clear()
    }
    setBoard(fenBoard: string) {
        this.clear()
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
                    if (!Piece.isValidFenPiece(fenRow[p]))
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
    getPiece(field: IField): pieceFenType {
        return this._board[field.rankIdx][field.fileIdx]
    }
    setPiece(field: IField, piece?: pieceFenType): boolean {
        let emptyTarget = this._board[field.rankIdx][field.fileIdx] != FenBoard.EMPTY_FIELD
        this._board[field.rankIdx][field.fileIdx] = piece ? piece : FenBoard.EMPTY_FIELD
        return emptyTarget
    }
    clearBoard() {
        this.clear()
        for (let rankIdx = 0; rankIdx < 8; rankIdx++) {
            for (let fileIdx = 0; fileIdx < 8; fileIdx++) {
                this._board[rankIdx][fileIdx] = FenBoard.EMPTY_FIELD
            }
        }
    }
    clear() {
        //this._boardRows = []
        for (let rankIdx = 0; rankIdx < 8; rankIdx++) {
            this._board[rankIdx] = []
        }
    }
}
