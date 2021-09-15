import { Piece, pieceKind, pieceKey } from './Piece'
import { color } from '../../chess-color'

describe('Testing chess-board', () => {

    test('testing Pieces', () => {
        let p = Piece.blackRook()
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Rook)
        expect(p.color).toBe(color.black)

        p = Piece.blackKnight()
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Knight)
        expect(p.color).toBe(color.black)

        p = Piece.blackBishop()
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Bishop)
        expect(p.color).toBe(color.black)

        p = Piece.blackQueen()
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Queen)
        expect(p.color).toBe(color.black)

        p = Piece.blackKing()
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.King)
        expect(p.color).toBe(color.black)

        p = Piece.blackPawn()
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Pawn)
        expect(p.color).toBe(color.black)


        p = Piece.whiteRook()
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Rook)
        expect(p.color).toBe(color.white)

        p = Piece.whiteKnight()
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Knight)
        expect(p.color).toBe(color.white)

        p = Piece.whiteBishop()
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Bishop)
        expect(p.color).toBe(color.white)

        p = Piece.whiteQueen()
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Queen)
        expect(p.color).toBe(color.white)

        p = Piece.whiteKing()
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.King)
        expect(p.color).toBe(color.white)

        p = Piece.whitePawn()
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Pawn)
        expect(p.color).toBe(color.white)

        p = Piece.none()
        expect(p.isNone).toBe(true)
        expect(p.isPiece).toBe(false)
        expect(p.kind).toBe(pieceKind.none)


        // ---
        p = Piece.getPiece(pieceKind.Rook, color.black)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Rook)
        expect(p.color).toBe(color.black)

        p = Piece.getPiece(pieceKind.Knight, color.black)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Knight)
        expect(p.color).toBe(color.black)

        p = Piece.getPiece(pieceKind.Bishop, color.black)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Bishop)
        expect(p.color).toBe(color.black)

        p = Piece.getPiece(pieceKind.Queen, color.black)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Queen)
        expect(p.color).toBe(color.black)

        p = Piece.getPiece(pieceKind.King, color.black)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.King)
        expect(p.color).toBe(color.black)

        p = Piece.getPiece(pieceKind.Pawn, color.black)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Pawn)
        expect(p.color).toBe(color.black)


        p = Piece.getPiece(pieceKind.Rook, color.white)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Rook)
        expect(p.color).toBe(color.white)

        p = Piece.getPiece(pieceKind.Knight, color.white)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Knight)
        expect(p.color).toBe(color.white)

        p = Piece.getPiece(pieceKind.Bishop, color.white)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Bishop)
        expect(p.color).toBe(color.white)

        p = Piece.getPiece(pieceKind.Queen, color.white)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Queen)
        expect(p.color).toBe(color.white)

        p = Piece.getPiece(pieceKind.King, color.white)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.King)
        expect(p.color).toBe(color.white)

        p = Piece.getPiece(pieceKind.Pawn, color.white)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Pawn)
        expect(p.color).toBe(color.white)

        // ---
        p = Piece.getPieceByKey(pieceKey.r)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Rook)
        expect(p.color).toBe(color.black)

        p = Piece.getPieceByKey(pieceKey.n)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Knight)
        expect(p.color).toBe(color.black)

        p = Piece.getPieceByKey(pieceKey.b)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Bishop)
        expect(p.color).toBe(color.black)

        p = Piece.getPieceByKey(pieceKey.q)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Queen)
        expect(p.color).toBe(color.black)

        p = Piece.getPieceByKey(pieceKey.k)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.King)
        expect(p.color).toBe(color.black)

        p = Piece.getPieceByKey(pieceKey.p)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Pawn)
        expect(p.color).toBe(color.black)


        p = Piece.getPieceByKey(pieceKey.R)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Rook)
        expect(p.color).toBe(color.white)

        p = Piece.getPieceByKey(pieceKey.N)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Knight)
        expect(p.color).toBe(color.white)

        p = Piece.getPieceByKey(pieceKey.B)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Bishop)
        expect(p.color).toBe(color.white)

        p = Piece.getPieceByKey(pieceKey.Q)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Queen)
        expect(p.color).toBe(color.white)

        p = Piece.getPieceByKey(pieceKey.K)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.King)
        expect(p.color).toBe(color.white)

        p = Piece.getPieceByKey(pieceKey.P)
        expect(p.isNone).toBe(false)
        expect(p.isPiece).toBe(true)
        expect(p.kind).toBe(pieceKind.Pawn)
        expect(p.color).toBe(color.white)

        p = Piece.getPieceByKey(pieceKey.none)
        expect(p.isNone).toBe(true)
        expect(p.isPiece).toBe(false)
        expect(p.kind).toBe(pieceKind.none)
    })

})