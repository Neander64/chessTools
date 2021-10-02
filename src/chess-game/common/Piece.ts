import { color } from './chess-color'

export type pieceFenType = string
export type piecePgnType = string
export type pieceKeyType = number

export const pieceKey = {
    // 1 bit: color, 3 bits piece
    R: 0b0001,
    N: 0b0010,
    B: 0b0011,
    Q: 0b0100,
    K: 0b0101,
    P: 0b0110,

    r: 0b1001,
    n: 0b1010,
    b: 0b1011,
    q: 0b1100,
    k: 0b1101,
    p: 0b1110,

    none: 0b1111, // avoid 0
}

export const enum pieceKind {
    Rook = 0b001, // 1
    Knight = 0b010, // 2
    Bishop = 0b011, // 3
    Queen = 0b100, // 4
    King = 0b101, // 5
    Pawn = 0b110, // 6
    none = 0b111 // 7
}
//const COLOR_FLAG = 0b1000 // +8
const PIECE_MASK = 0b0111

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

export class Piece {
    // Piece represents a piece on Board
    // with a color and a kind

    // yes, I should separate this type from encoding, But, nay
    private _key: pieceKeyType // encoding kind & color -- value of pieceKey
    private _FEN: string

    constructor(key: number) {
        this._key = key
        this._FEN = pieceKindPGN.get(this.kind) || ' '
        if (this.color == color.black) this._FEN = this._FEN.toLowerCase()
        //        console.log("key: ", key, " FEN:", this._FEN, "color:", (this.color == color.black) ? 'black' : 'white')
    }
    get kind(): pieceKind {
        return this._key & PIECE_MASK
    }
    get color() {
        return (this._key >>> 3 == 1) ? color.black : color.white
        //return ((this._key & COLOR_FLAG) == 1) ? color.black : color.white

    }
    get isNone() { return this._key === pieceKey.none }
    get isEmpty() { return this._key === pieceKey.none }
    get isPiece() { return this._key !== pieceKey.none }
    same(p: Piece) { return this._key == p._key }
    get key() { return this._key }

    get FEN(): string {
        return this._FEN
    }
    get PGN(): string {
        return this._FEN.toUpperCase()
    }

    private static _none = new Piece(pieceKey.none)
    private static _blackRook = new Piece(pieceKey.r)
    private static _blackKnight = new Piece(pieceKey.n)
    private static _blackBishop = new Piece(pieceKey.b)
    private static _blackQueen = new Piece(pieceKey.q)
    private static _blackKing = new Piece(pieceKey.k)
    private static _blackPawn = new Piece(pieceKey.p)
    private static _whiteRook = new Piece(pieceKey.R)
    private static _whiteKnight = new Piece(pieceKey.N)
    private static _whiteBishop = new Piece(pieceKey.B)
    private static _whiteQueen = new Piece(pieceKey.Q)
    private static _whiteKing = new Piece(pieceKey.K)
    private static _whitePawn = new Piece(pieceKey.P)

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
        if (kind_ == pieceKind.none) return Piece.none()
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
    }
    static getPieceByKey(key_: pieceKeyType): Piece {
        if (key_ == pieceKey.none) return Piece.none()
        if ((key_ >>> 3) == 1) { // Black
            switch (key_ & PIECE_MASK) {
                case pieceKind.Rook: return Piece.blackRook()
                case pieceKind.Knight: return Piece.blackKnight()
                case pieceKind.Bishop: return Piece.blackBishop()
                case pieceKind.Queen: return Piece.blackQueen()
                case pieceKind.King: return Piece.blackKing()
                case pieceKind.Pawn: return Piece.blackPawn()
            }
        }
        else {
            switch (key_ & PIECE_MASK) {
                case pieceKind.Rook: return Piece.whiteRook()
                case pieceKind.Knight: return Piece.whiteKnight()
                case pieceKind.Bishop: return Piece.whiteBishop()
                case pieceKind.Queen: return Piece.whiteQueen()
                case pieceKind.King: return Piece.whiteKing()
                case pieceKind.Pawn: return Piece.whitePawn()
            }
        }
        return Piece.none() // unreachable, but TS can't identify we handled none already and issues an error
    }

    static isValidFenPiece(piece: pieceFenType): boolean {
        if (piece.length != 1) return false
        return 'rnbqkpRNBQKP'.indexOf(piece) != -1
    }
    static isValidPgnPiece(piece: pieceFenType): boolean {
        if (piece.length != 1) return false
        return 'RNBQKP'.indexOf(piece) != -1
    }

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
export function charFENToPiece(pieceStr: string): Piece {
    return charFENtoPieceMap.get(pieceStr) || Piece.none()
}
export function charPGNToPiece(pieceStr: string, color_: color): Piece {

    switch (pieceStr) {
        case 'R': return (color_ == color.black) ? Piece.blackRook() : Piece.whiteRook()
        case 'N': return (color_ == color.black) ? Piece.blackKnight() : Piece.whiteKnight()
        case 'B': return (color_ == color.black) ? Piece.blackBishop() : Piece.whiteBishop()
        case 'Q': return (color_ == color.black) ? Piece.blackQueen() : Piece.whiteQueen()
        case 'K': return (color_ == color.black) ? Piece.blackKing() : Piece.whiteKing()
        case 'P': return (color_ == color.black) ? Piece.blackPawn() : Piece.whitePawn()

        default:
            return Piece.none()
    }
}
