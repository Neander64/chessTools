import { color, otherColor } from "../common/chess-color"
import { MoveX } from "../common/MoveX"
import { Piece, pieceKind } from "../common/Piece"
import { Fen } from "./Fen"

export class FenMove extends Fen {

    updateByMove(move: MoveX) {
        // expecting a validated and legal move here (no need to repeat validations done by move generation)
        let isCapture = this.fenBoard.setPiece(move.target, move.optionals?.promotionPiece ? move.optionals?.promotionPiece.FEN : move.piece.FEN)
        this.fenBoard.setPiece(move.source)
        if (move.isCastle) {
            this.fenBoard.setPiece(move.optionals?.castleRookTarget!, Piece.getPiece(pieceKind.Rook, move.moveColor).FEN)
            this.fenBoard.setPiece(move.optionals?.castleRookSource!)
        }
        if (move.isEnpassant) {
            this.fenBoard.setPiece(move.optionals?.enPassantCaptureField!)
            isCapture = true
        }
        this.castleFlags.set(move.castleFlags)
        if (move.optionals?.enPassantField) this.enPassantField = move.optionals?.enPassantField.notation
        this.plyCount = (isCapture || move.piece.kind == pieceKind.Pawn) ? 0 : (this.plyCount + 1)
        this.moveNumber += ((this.activeColor == color.black) ? 1 : 0)
        this.activeColor = otherColor(this.activeColor)
    }
}