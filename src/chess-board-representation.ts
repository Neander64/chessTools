import { Piece, pieceKeyType, pieceKind } from './chess-board-pieces'
import { pieceOnBoard, boardFieldIdx, sameFields, fieldIdx } from './chess-board-internal-types'
import { color, otherColor } from './chess-color'
import { AttackedFields } from './chess-board-attacked-fields'
import { BishopMovesRaw, isOffsetBishopLike } from './chess-board-bishop-moves'
import { RookMovesRaw, isOffsetRookLike } from './chess-board-rook-moves'
import { CastleFlags, castleType, KingMovesRaw } from './chess-board-king-moves'
import { KnightMovesRaw } from './chess-board-knight-moves'
import { PawnMovesRaw } from './chess-board-pawn-moves'
import { moveOnBoard, IChessBoardData } from './chess-board'
// TODO replace MoveOnBoard by an internal representation
// TODO decouple boardFieldIdx from Representation, introduce internal boardIdx

export type fileType = number
export type rankType = number

export class ValidatedMove { // Data to do/undo moves
    isValid: boolean
    sourcePieceOB: pieceOnBoard
    target: boardFieldIdx
    // pawn promotion
    isPromotion: boolean
    promotionPieceKind?: pieceKind;
    captureEP: boolean

    // castle
    isCastle: boolean
    pieceRook?: pieceOnBoard
    targetRook?: boardFieldIdx
    // captured/replaced Piece
    pieceCaptured?: pieceOnBoard

    // data to be updated
    castleFlags: CastleFlags
    enPassantField: boardFieldIdx | undefined
    halfMoves50: number


    constructor(pieceOB_: pieceOnBoard, target_: boardFieldIdx, data_: IChessBoardData) {
        this.isValid = false
        this.sourcePieceOB = pieceOB_
        this.target = target_
        this.captureEP = false
        this.isPromotion = false
        this.isCastle = false
        this.castleFlags = new CastleFlags(data_.castleFlags)
        this.enPassantField = data_.enPassantField
        this.halfMoves50 = data_.halfMoves50
    }
    get color(): color { return this.sourcePieceOB.piece.color }
    get source(): boardFieldIdx { return this.sourcePieceOB.field }
    get kind(): pieceKind { return this.sourcePieceOB.piece.kind }
    get piece(): Piece { return this.sourcePieceOB.piece }
    get capturedKind(): pieceKind { return this.pieceCaptured?.piece.kind! }
    get capturedColor(): color { return this.pieceCaptured?.piece.color! }
    get capturedField(): boardFieldIdx { return this.pieceCaptured?.field! }

    updateData(data_: IChessBoardData) {
        data_.castleFlags.set(this.castleFlags)
        data_.enPassantField = this.enPassantField
        data_.halfMoves50 = this.halfMoves50
    }
    get moveOnBoard(): moveOnBoard {
        return {
            pieceOB: this.sourcePieceOB,
            target: this.target,
            promotionPiece: this.promotionPieceKind,
            pieceRook: this.pieceRook,
            targetRook: this.targetRook,
            pieceCaptured: this.pieceCaptured
        }
    }
};


// TODO change pieceStat to a map of piece to number, remove evaluation
export type pieceStat = {
    black: Map<Piece, number>,
    white: Map<Piece, number>
}

export interface IChessBoardRepresentation {
    isPiece(file: fileType, rank: rankType): boolean
    pieceKey(file: fileType, rank: rankType): pieceKeyType

    isFieldOnBoard(field: boardFieldIdx): boolean // check validity of boardFieldIdx
    setPiece(piece_: Piece, field: boardFieldIdx): void
    removePiece(field: boardFieldIdx): void
    peekField(field: boardFieldIdx): Piece
    peekFieldPieceOB(field_: boardFieldIdx): pieceOnBoard
    isFieldEmpty(field: boardFieldIdx): boolean

    clearBoard(): void
    setBoard(board: Piece[][]): void
    isCaptureOn(field_: boardFieldIdx, color_: color): boolean
    currentPieceSpectrum(): pieceStat

}
export class ChessBoardRepresentation implements IChessBoardRepresentation {

    private _board: Piece[][] = [] // col/row : [0][0]="a8" .. [7][7]="h1"
    private _fieldsAttackedByBlack: AttackedFields
    private _fieldsAttackedByWhite: AttackedFields
    private _data: IChessBoardData

    constructor(data: IChessBoardData) {
        this._data = data
        for (let file = 0; file < 8; file++) {
            this._board[file] = []
            for (let rank = 0; rank < 8; rank++) {
                this._board[file][rank] = Piece.none()
            }
        }
        this._fieldsAttackedByBlack = new AttackedFields()
        this._fieldsAttackedByWhite = new AttackedFields()
    }

    // Interface implementation
    isPiece(file: fileType, rank: rankType) { return this._board[file][rank].isPiece }
    pieceKey(file: fileType, rank: rankType) { return this._board[file][rank].key }
    isFieldOnBoard(field: boardFieldIdx) { return (field.colIdx >= 0 && field.colIdx < 8 && field.rowIdx >= 0 && field.rowIdx < 8) }
    setPiece(piece_: Piece, field: boardFieldIdx) { this._board[field.colIdx][field.rowIdx] = piece_ }
    removePiece(field: boardFieldIdx) { this._board[field.colIdx][field.rowIdx] = Piece.none() }
    peekField(field: boardFieldIdx): Piece { return this._board[field.colIdx][field.rowIdx] }
    peekFieldPieceOB(field_: boardFieldIdx): pieceOnBoard { return { piece: this.peekField(field_), field: field_ } }
    isFieldEmpty(field: boardFieldIdx): boolean { return this.peekField(field).isEmpty }

    clearBoard() {
        for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 8; row++) {
                this._board[col][row] = Piece.none()
            }
        }
        this.clearAttackedFields()
    }
    setBoard(board: Piece[][]) {
        for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 8; row++) {
                this._board[col][row] = board[col][row]
            }
        }
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
        let result = {
            black: new Map<Piece, number>(),
            white: new Map<Piece, number>()
        }

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                let p = this.peekField({ colIdx: c, rowIdx: r })
                if (p.isPiece)
                    switch (p.color) {
                        case color.black:
                            const countB = result.black.get(p) || 0
                            result.black.set(p, countB + 1)
                            break
                        case color.white:
                            const countW = result.white.get(p) || 0
                            result.white.set(p, countW + 1)
                    }
            }
        }
        return result;
    }

    getKingField(color_: color): boardFieldIdx {
        //if (this._emptyBoard) throw new Error('getKing() operation on empty board')
        let kings = this.currentKindOfPiecesOnBoard(color_, pieceKind.King)
        if (kings.length != 1) throw new Error('getKingField(): unexpected number of kings (' + kings.length + ')')
        return kings[0].field
    }

    // ------------------ Attacks -------------------

    private getAttackedFieldsByRook(pieceOB_: pieceOnBoard): boardFieldIdx[] {
        let rookMoves: boardFieldIdx[] = []
        let f: boardFieldIdx
        let rookMovesRaw = new RookMovesRaw(pieceOB_.field, this)
        for (const ray of RookMovesRaw.rays) {
            for (f of rookMovesRaw.getRay(ray)) {
                rookMoves.push(f)
                if (!this.isFieldEmpty(f)) break
            }
        }
        return rookMoves;
    }
    private getAttackedFieldsByKnight(pieceOB_: pieceOnBoard): boardFieldIdx[] {
        let knightMoves = new KnightMovesRaw(pieceOB_.field, this)
        return knightMoves.moves
    }
    private getAttackedFieldsByBishop(pieceOB_: pieceOnBoard): boardFieldIdx[] {
        let bishopMoves: boardFieldIdx[] = []
        let f: boardFieldIdx
        let bishopMovesRaw = new BishopMovesRaw(pieceOB_.field, this)
        for (const ray of BishopMovesRaw.rays) {
            for (f of bishopMovesRaw.getRay(ray)) {
                bishopMoves.push(f)
                if (!this.isFieldEmpty(f)) break
            }
        }
        return bishopMoves
    }
    private getAttackedFieldsByQueen(pieceOB_: pieceOnBoard): boardFieldIdx[] {
        let queenMoves: boardFieldIdx[] = []
        let f: boardFieldIdx
        let rookMovesRaw = new RookMovesRaw(pieceOB_.field, this)
        for (const ray of RookMovesRaw.rays) {
            for (f of rookMovesRaw.getRay(ray)) {
                queenMoves.push(f);
                if (!this.isFieldEmpty(f)) break
            }
        }
        let bishopMovesRaw = new BishopMovesRaw(pieceOB_.field, this)
        for (const ray of BishopMovesRaw.rays) {
            for (f of bishopMovesRaw.getRay(ray)) {
                queenMoves.push(f)
                if (!this.isFieldEmpty(f)) break
            }
        }
        return queenMoves
    }
    private getAttackedFieldsByPawn(pieceOB_: pieceOnBoard): boardFieldIdx[] {
        let pawnMovesRaw = new PawnMovesRaw(pieceOB_.field, pieceOB_.piece.color, this)
        return pawnMovesRaw.attacks.map(x => x.target)
    }
    private getAttackedFieldsByKing(pieceOB_: pieceOnBoard): boardFieldIdx[] {
        let kingMoves = new KingMovesRaw(pieceOB_.field, this)
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
                return this.getAttackedFieldsByPawn(pieceOB_)
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

    // ------------------ Legal Moves -------------------

    private getLegalMovesOfRook(pieceOB_: pieceOnBoard): moveOnBoard[] {
        let result: moveOnBoard[] = []
        let target: boardFieldIdx
        let rookMovesRaw = new RookMovesRaw(pieceOB_.field, this)
        for (const ray of RookMovesRaw.rays) {
            for (target of rookMovesRaw.getRay(ray)) {
                let m = this.validateMove(pieceOB_, target)
                if (m.isValid) result.push(m.moveOnBoard)
                if (!this.isFieldEmpty(target)) break
            }
        }
        return result
    }
    private getLegalMovesOfKnight(pieceOB_: pieceOnBoard): moveOnBoard[] {
        let result: moveOnBoard[] = []
        let knightMoves = new KnightMovesRaw(pieceOB_.field, this)
        for (let target of knightMoves.moves) {
            let m = this.validateMove(pieceOB_, target)
            if (m.isValid) result.push(m.moveOnBoard)
        }
        return result
    }
    private getLegalMovesOfBishop(pieceOB_: pieceOnBoard): moveOnBoard[] {
        let result: moveOnBoard[] = []
        let target: boardFieldIdx
        let bishopMovesRaw = new BishopMovesRaw(pieceOB_.field, this)
        for (const ray of BishopMovesRaw.rays) {
            for (target of bishopMovesRaw.getRay(ray)) {
                let m = this.validateMove(pieceOB_, target)
                if (m.isValid) result.push(m.moveOnBoard)
                if (!this.isFieldEmpty(target)) break
            }
        }
        return result
    }
    private getLegalMovesOfQueen(pieceOB_: pieceOnBoard): moveOnBoard[] {
        let result: moveOnBoard[] = []
        let target: boardFieldIdx
        let rookMovesRaw = new RookMovesRaw(pieceOB_.field, this)
        for (const ray of RookMovesRaw.rays) {
            for (target of rookMovesRaw.getRay(ray)) {
                let m = this.validateMove(pieceOB_, target)
                if (m.isValid) result.push(m.moveOnBoard)
                if (!this.isFieldEmpty(target)) break
            }
        }
        let bishopMovesRaw = new BishopMovesRaw(pieceOB_.field, this)
        for (const ray of BishopMovesRaw.rays) {
            for (target of bishopMovesRaw.getRay(ray)) {
                let m = this.validateMove(pieceOB_, target)
                if (m.isValid) result.push(m.moveOnBoard)
                if (!this.isFieldEmpty(target)) break
            }
        }
        return result
    }
    getLegalMovesOfKing(pieceOB_: pieceOnBoard): moveOnBoard[] {
        let result: moveOnBoard[] = []
        let kingMoves = new KingMovesRaw(pieceOB_.field, this)
        for (let target of kingMoves.moves) {
            let m = this.validateMove(pieceOB_, target)
            if (m.isValid) result.push(m.moveOnBoard)
        }
        let castleDataShort = KingMovesRaw.castle(pieceOB_.piece.color!, castleType.short)
        if (pieceOB_.field == castleDataShort.kingSource) {
            let m = this.validateMove(pieceOB_, castleDataShort.kingTarget)
            if (m.isValid) result.push(m.moveOnBoard)
        }
        let castleDataLong = KingMovesRaw.castle(pieceOB_.piece.color!, castleType.short)
        if (pieceOB_.field == castleDataLong.kingSource) {
            let m = this.validateMove(pieceOB_, castleDataLong.kingTarget)
            if (m.isValid) result.push(m.moveOnBoard)
        }
        return result
    }
    getLegalMovesOfPawn(pieceOB_: pieceOnBoard): moveOnBoard[] {
        let result: moveOnBoard[] = []
        let pawnMovesRaw = new PawnMovesRaw(pieceOB_.field, pieceOB_.piece.color!, this)
        for (let pawnMove of pawnMovesRaw.moves) {
            if (pawnMove.isPromotion) {
                for (let promoKind of PawnMovesRaw.promotionPieces) {
                    let m = this.validateMove(pieceOB_, pawnMove.target, promoKind)
                    if (m.isValid) result.push(m.moveOnBoard)
                }
            }
            else { // no promotion
                let m = this.validateMove(pieceOB_, pawnMove.target)
                if (m.isValid) result.push(m.moveOnBoard)
            }
        }
        for (let pawnAttack of pawnMovesRaw.attacks) {
            if (pawnAttack.isPromotion) {
                for (let promoKind of PawnMovesRaw.promotionPieces) {
                    let m = this.validateMove(pieceOB_, pawnAttack.target, promoKind)
                    if (m.isValid) result.push(m.moveOnBoard)
                }
            }
            else {
                let m = this.validateMove(pieceOB_, pawnAttack.target)
                if (m.isValid) result.push(m.moveOnBoard)
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


    // ------------------ Validate Move -----------------

    private validateMoveOfPiece(validatedMove: ValidatedMove): boolean {
        // no castle or pawn move here!
        if (validatedMove.kind == pieceKind.Pawn || validatedMove.kind == pieceKind.none) return false
        let tmpBoard = new ChessBoardRepresentation(this._data)
        tmpBoard.setBoard(this._board)
        tmpBoard.doMove(validatedMove)
        // tmpBoard.setPiece(validatedMove.piece, validatedMove.target)
        // tmpBoard.removePiece(validatedMove.source)
        if (tmpBoard.isCheck()) return false

        if (this.isCaptureOn(validatedMove.target, validatedMove.color)) {
            validatedMove.pieceCaptured = this.peekFieldPieceOB(validatedMove.target)
            if (validatedMove.capturedKind == pieceKind.Rook) {
                KingMovesRaw.adjustCastleRightsAfterCapture(validatedMove.pieceCaptured, validatedMove.castleFlags)
            }
            validatedMove.halfMoves50 = 0
        }
        else {
            validatedMove.halfMoves50++
        }
        validatedMove.enPassantField = undefined

        return true
    }
    private validateMoveOfRook(validatedMove: ValidatedMove): boolean {
        if (validatedMove.kind != pieceKind.Rook) return false

        let rookLike = isOffsetRookLike(validatedMove.source, validatedMove.target)
        if (!rookLike.valid) return false;
        let rookMovesRaw = new RookMovesRaw(validatedMove.source, this)
        for (let f of rookMovesRaw.getRay(rookLike.ray!)) {
            if (sameFields(f, validatedMove.target)) break
            if (!this.isFieldEmpty(f)) return false
        }
        if (!this.isFieldEmptyOrCapture(validatedMove.target, validatedMove.color)) return false

        if (!this.validateMoveOfPiece(validatedMove)) return false
        KingMovesRaw.adjustCastleRightsAfterMove(validatedMove.sourcePieceOB, validatedMove.castleFlags)

        validatedMove.isValid = true
        return true
    }
    private validateMoveOfKnight(validatedMove: ValidatedMove): boolean {
        if (validatedMove.kind != pieceKind.Knight) return false

        let knightMoves = new KnightMovesRaw(validatedMove.source, this)
        let found = knightMoves.moves.find(x => sameFields(x, validatedMove.target))
        if (typeof found === 'undefined') return false
        if (!this.isFieldEmptyOrCapture(validatedMove.target, validatedMove.color)) return false
        if (!this.validateMoveOfPiece(validatedMove)) return false

        validatedMove.isValid = true
        return true
    }
    private validateMoveOfBishop(validatedMove: ValidatedMove): boolean {
        if (validatedMove.kind != pieceKind.Bishop) return false

        let bishopLike = isOffsetBishopLike(validatedMove.source, validatedMove.target)
        if (!bishopLike.valid) return false;
        let bishopMovesRaw = new BishopMovesRaw(validatedMove.source, this)
        for (let f of bishopMovesRaw.getRay(bishopLike.ray!)) {
            if (sameFields(f, validatedMove.target)) break
            if (!this.isFieldEmpty(f)) return false
        }
        if (!this.isFieldEmptyOrCapture(validatedMove.target, validatedMove.color)) return false
        if (!this.validateMoveOfPiece(validatedMove)) return false

        validatedMove.isValid = true
        return true
    }
    private validateMoveOfQueen(validatedMove: ValidatedMove): boolean {
        if (validatedMove.kind != pieceKind.Queen) return false

        let bishopLikeQ = isOffsetBishopLike(validatedMove.source, validatedMove.target)
        if (bishopLikeQ.valid) {
            let bishopMovesRawQ = new BishopMovesRaw(validatedMove.source, this)
            for (let f of bishopMovesRawQ.getRay(bishopLikeQ.ray!)) {
                if (sameFields(f, validatedMove.target)) break
                if (!this.isFieldEmpty(f)) return false
            }
            if (!this.isFieldEmptyOrCapture(validatedMove.target, validatedMove.color)) return false
        }
        else {
            let rookLikeQ = isOffsetRookLike(validatedMove.source, validatedMove.target)
            if (rookLikeQ.valid) {
                let rookMovesRawQ = new RookMovesRaw(validatedMove.source, this)
                for (let f of rookMovesRawQ.getRay(rookLikeQ.ray!)) {
                    if (sameFields(f, validatedMove.target)) break
                    if (!this.isFieldEmpty(f)) return false
                }
                if (!this.isFieldEmptyOrCapture(validatedMove.target, validatedMove.color)) return false
            }
            else return false
        }
        if (!this.validateMoveOfPiece(validatedMove)) return false

        validatedMove.isValid = true
        return true
    }
    private validateMoveOfKing(validatedMove: ValidatedMove): boolean {
        if (validatedMove.kind != pieceKind.King) return false

        let castle = KingMovesRaw.isMoveCastle(validatedMove.sourcePieceOB, validatedMove.target)
        if (typeof castle !== 'undefined') {
            if (!validatedMove.castleFlags.getCastleFlag(validatedMove.color, castle.castleType)) return false
            if (!this.isPieceOn(castle.kingSource, castle.kingPiece)) return false
            if (!this.isPieceOn(castle.rookSource, castle.rookPiece)) return false
            for (let colIdx_ = castle.betweenPathCols.start; colIdx_ <= castle.betweenPathCols.end; colIdx_++)
                if (!this.isFieldEmpty(fieldIdx(colIdx_, castle.row))) return false
            for (let colIdx_ = castle.kingPathCols.start; colIdx_ <= castle.kingPathCols.end; colIdx_++)
                if (this.isPieceAttackedOn(fieldIdx(colIdx_, castle.row), otherColor(validatedMove.color))) return false

            validatedMove.pieceRook = this.peekFieldPieceOB(castle.rookSource)
            validatedMove.targetRook = castle.rookTarget
            validatedMove.halfMoves50++
            validatedMove.enPassantField = undefined
            validatedMove.isCastle = true
        }
        else {
            let kingMovesRaw = new KingMovesRaw(validatedMove.source, this)
            let legalKingMove = kingMovesRaw.moves.find(x => sameFields(x, validatedMove.target))
            if (typeof legalKingMove === 'undefined') return false
            if (!this.isFieldEmptyOrCapture(validatedMove.target, validatedMove.color)) return false
            if (!this.validateMoveOfPiece(validatedMove)) return false
        }
        KingMovesRaw.adjustCastleRightsAfterMove(validatedMove.sourcePieceOB, validatedMove.castleFlags)

        validatedMove.isValid = true
        return true
    }
    private validateMoveOfPawn(validatedMove: ValidatedMove): boolean {
        if (validatedMove.kind != pieceKind.Pawn) return false

        validatedMove.enPassantField = undefined
        let pawnMove = PawnMovesRaw.checkPawnMove(validatedMove.source, validatedMove.target, validatedMove.color)
        if (typeof pawnMove == 'undefined') return false
        if (typeof pawnMove.enPassantField != 'undefined') {
            if (!this.isFieldEmpty(pawnMove.enPassantField)) return false
            if (!this.isFieldEmpty(validatedMove.target)) return false
            validatedMove.enPassantField = pawnMove.enPassantField
        }
        else if (pawnMove.isCapture) {
            if (typeof this._data.enPassantField != 'undefined' && sameFields(this._data.enPassantField, validatedMove.target)) {
                // capturing e.p.
                if (!this.isFieldEmpty(validatedMove.target)) return false // e.p. target should always be empty
                validatedMove.pieceCaptured = this.peekFieldPieceOB(PawnMovesRaw.getPawnFieldOfCaptureEP(validatedMove.target, validatedMove.color))
                validatedMove.captureEP = true
            }
            else if (this.isCaptureOn(validatedMove.target, validatedMove.color)) {
                validatedMove.pieceCaptured = this.peekFieldPieceOB(validatedMove.target)
                if (validatedMove.capturedKind == pieceKind.Rook) {
                    KingMovesRaw.adjustCastleRightsAfterCapture(validatedMove.pieceCaptured, validatedMove.castleFlags)
                }
            }
            else return false
        }
        else // normal move
            if (!this.isFieldEmpty(validatedMove.target)) return false

        if (pawnMove.isPromotion) {
            if (!validatedMove.promotionPieceKind) return false
            if (!PawnMovesRaw.isLegalPromotionPieceKind(validatedMove.promotionPieceKind)) return false
            validatedMove.isPromotion = true
        }

        let tmpBoard = new ChessBoardRepresentation(this._data)
        tmpBoard.setBoard(this._board)
        tmpBoard.doMove(validatedMove)
        if (tmpBoard.isCheck()) return false
        validatedMove.halfMoves50 = 0

        validatedMove.isValid = true
        return true
    }
    validateMove(sourcePieceOB: pieceOnBoard, target: boardFieldIdx, promotionPieceKind?: pieceKind): ValidatedMove {
        let validatedMove = new ValidatedMove(sourcePieceOB, target, this._data)
        validatedMove.isValid = false
        if (!sameFields(validatedMove.source, validatedMove.target)) {
            switch (sourcePieceOB.piece.kind) {
                case pieceKind.Rook:
                    this.validateMoveOfRook(validatedMove)
                    break
                case pieceKind.Knight:
                    this.validateMoveOfKnight(validatedMove)
                    break
                case pieceKind.Bishop:
                    this.validateMoveOfBishop(validatedMove)
                    break
                case pieceKind.Queen:
                    this.validateMoveOfQueen(validatedMove)
                    break
                case pieceKind.King:
                    this.validateMoveOfKing(validatedMove)
                    break
                case pieceKind.Pawn:
                    validatedMove.promotionPieceKind = promotionPieceKind
                    this.validateMoveOfPawn(validatedMove)
                    break
                case pieceKind.none:
            }
        }

        return validatedMove
    }

    // ------------------ Board Moves -------------------

    move(source: boardFieldIdx, target: boardFieldIdx, optionals?: { promotionPieceKind?: pieceKind, validateOnly?: boolean }): moveOnBoard | undefined {
        let validateOnly = false;
        let promotionPieceKind = undefined;
        if (optionals && typeof optionals.validateOnly !== 'undefined') validateOnly = optionals.validateOnly
        if (optionals && typeof optionals.promotionPieceKind !== 'undefined') promotionPieceKind = optionals.promotionPieceKind

        let sourcePieceOB = this.peekFieldPieceOB(source)
        if (sourcePieceOB.piece.kind == pieceKind.none) return undefined

        let validatedMove = this.validateMove(sourcePieceOB, target, promotionPieceKind)
        if (validatedMove.isValid && !validateOnly) {
            this.doMove(validatedMove)

            validatedMove.updateData(this._data)
            this._data.nextMoveBy = otherColor(this._data.nextMoveBy)
            if (this._data.nextMoveBy == color.white) this._data.moveNumber++
            this.clearAttackedFields()

        }
        return validatedMove.isValid ? validatedMove.moveOnBoard : undefined
    }

    moveCastle(castleType: castleType): moveOnBoard | undefined {
        let castleData = KingMovesRaw.castle(this._data.nextMoveBy, castleType)
        return this.move(castleData.kingSource, castleData.kingTarget)
    }

    // ------------------ Move on Board -------------------

    doMove(validatedMove: ValidatedMove) {
        if (validatedMove.isCastle) {
            this.setPiece(validatedMove.piece, validatedMove.target)
            this.removePiece(validatedMove.source)
            this.setPiece(validatedMove.pieceRook?.piece!, validatedMove.targetRook!)
            this.removePiece(validatedMove.pieceRook?.field!)
        }
        else {
            if (validatedMove.isPromotion)
                this.setPiece(Piece.getPiece(validatedMove.promotionPieceKind!, validatedMove.color), validatedMove.target)
            else
                this.setPiece(validatedMove.piece, validatedMove.target)
            this.removePiece(validatedMove.source)
            if (validatedMove.captureEP)
                this.removePiece(validatedMove.pieceCaptured?.field!)

        }
    }
    undoMove(validatedMove: ValidatedMove) {
    }


    // ------------------ Board Status -------------------

    isCheck(): boolean {
        return this.isPieceAttackedOn(this.getKingField(this._data.nextMoveBy), otherColor(this._data.nextMoveBy))
    }
    isMate(): boolean {
        let color = this._data.nextMoveBy
        //if (!this.isCheck(color_)) return false
        let kingField = this.getKingField(color)
        // check if the King can move unattacked
        let tmpBoard = new ChessBoardRepresentation(this._data)
        tmpBoard.setBoard(this._board)
        tmpBoard.removePiece(kingField) // avoid the king blocking checks by itself
        let kingMoves = new KingMovesRaw(kingField, this)
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
    isStaleMate(): boolean {
        // TODO: a specific hasLegalMoves could be more performant
        return !this.isCheck() && this.getLegalMoves().length == 0
    }

}
