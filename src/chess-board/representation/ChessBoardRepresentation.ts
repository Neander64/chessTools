import { Piece, pieceKind } from '../../common/Piece'
import { color, otherColor } from '../../common/chess-color'
import { AttackedFields } from '../AttackedFields'
import { BishopMovesRaw, isOffsetBishopLike } from '../pieces/BishopMovesRaw'
import { RookMovesRaw, isOffsetRookLike } from '../pieces/RookMovesRaw'
import { KingMovesRaw } from '../pieces/KingMovesRaw'
import { castleType } from "../../common/CastleFlags"
import { KnightMovesRaw } from '../pieces/KnightMovesRaw'
import { PawnMovesRaw } from '../pieces/PawnMovesRaw'
import { ChessGameStatusData } from "../../common/ChessGameStatusData"
import { MoveOnBoard } from "../../common/MoveOnBoard"
import { LegalMovesCache } from '../LegalMovesCache'
import { fileIdxType, rankIdxType, IField } from '../../common/IField'
import { pieceOnBoard, createPieceOB } from '../../common/pieceOnBoard'
import { Field } from '../../common/Field'
import { ValidatedMove } from './ValidatedMove'
import { IChessBoardRepresentation } from './IChessBoardRepresentation'

export type pieceStat = {
    black: Map<Piece, number>,
    white: Map<Piece, number>
}

export class ChessBoardRepresentation implements IChessBoardRepresentation {

    private _board: Piece[][] = [] // col/row : [0][0]="a8" .. [7][7]="h1"
    private _data: ChessGameStatusData
    // internal caches, avoid re-evaluation
    private _fieldsAttackedByBlack: AttackedFields
    private _fieldsAttackedByWhite: AttackedFields
    private _legalMoveCache: LegalMovesCache

    constructor(data: ChessGameStatusData) {
        this._data = data
        for (let file = 0; file < 8; file++) {
            this._board[file] = []
            for (let rank = 0; rank < 8; rank++) {
                this._board[file][rank] = Piece.none()
            }
        }
        this._fieldsAttackedByBlack = new AttackedFields()
        this._fieldsAttackedByWhite = new AttackedFields()
        this._legalMoveCache = new LegalMovesCache()
    }

    // Interface implementation
    isPieceI(file: fileIdxType, rank: rankIdxType) { return this._board[file][rank].isPiece }
    pieceKeyI(file: fileIdxType, rank: rankIdxType) { return this._board[file][rank].key }
    isFieldOnBoard(field: Field) { return field.isOnBoard }
    setPiece(piece_: Piece, field: Field) { this._board[field.fileIdx][field.rankIdx] = piece_ }
    setPieceI(piece_: Piece, file: fileIdxType, rank: rankIdxType) { this._board[file][rank] = piece_ }
    removePiece(field: Field) { this._board[field.fileIdx][field.rankIdx] = Piece.none() }
    peekField(field: Field): Piece { return this._board[field.fileIdx][field.rankIdx] }
    peekFieldI(file: fileIdxType, rank: rankIdxType): Piece { return this._board[file][rank] }
    peekFieldPieceOB(field_: Field): pieceOnBoard { return createPieceOB(this.peekField(field_), field_) }
    isFieldEmpty(field: Field): boolean { return this.peekField(field).isEmpty }
    field(file_: fileIdxType, rank_: rankIdxType): Field { return new Field(file_, rank_) }
    fieldF(f: Field): Field { return new Field(f.fileIdx, f.rankIdx) }
    fieldFromNotation(fieldStr: string): Field {
        if (fieldStr.length != 2)
            throw new Error('unexpected string length for field (should be 2)')
        // convert chess notation of field (like e4) to index on board
        const field = this.field(fieldStr[0].charCodeAt(0) - 'a'.charCodeAt(0), 8 - parseInt(fieldStr[1], 10))
        if (!this.isFieldOnBoard(field)) throw new Error('unexpecte values (col,row)')
        return field

    }
    fieldFromNotationQuiet(fieldStr: string): Field | undefined {
        if (fieldStr.length != 2) return undefined
        // convert chess notation of field (like e4) to index on board
        const field = this.field(fieldStr[0].charCodeAt(0) - 'a'.charCodeAt(0), 8 - parseInt(fieldStr[1], 10))
        if (!this.isFieldOnBoard(field)) return undefined
        return field

    }

    clearBoard() {
        for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 8; row++) {
                this._board[col][row] = Piece.none()
            }
        }
        this.clearAttackedFields()
        this._legalMoveCache.clear()
    }
    setBoard(board: Piece[][]) {
        for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 8; row++) {
                this._board[col][row] = board[col][row]
            }
        }
    }
    isCaptureOn(field_: Field, color_: color): boolean {
        let _piece = this.peekField(field_)
        return _piece.isPiece && _piece.color == otherColor(color_)
    }
    isFieldEmptyOrCapture(field_: Field, color_: color): boolean {
        return this.isFieldEmpty(field_) || this.isCaptureOn(field_, color_)
    }
    isPieceOn(field: Field, p: Piece) {
        return this.peekField(field).same(p)
    }
    currentPiecesOnBoard(color_: color): pieceOnBoard[] {
        let result: pieceOnBoard[] = []
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                let p = this.peekField(this.field(c, r))
                if (p.isPiece && p.color == color_) {
                    result.push(createPieceOB(p, this.field(c, r)))
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
                let p = this.peekField(this.field(c, r))
                if (p.kind == kind_ && p.color == color_) {
                    result.push(createPieceOB(p, this.field(c, r)))
                }
            }
        }
        return result
    }
    currentPieceSpectrum(): pieceStat {
        let result: pieceStat = {
            black: new Map<Piece, number>(),
            white: new Map<Piece, number>()
        }

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                let p = this.peekField(this.field(c, r))
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

    getKingField(color_: color): IField {
        //if (this._emptyBoard) throw new Error('getKing() operation on empty board')
        let kings = this.currentKindOfPiecesOnBoard(color_, pieceKind.King)
        if (kings.length != 1) throw new Error('getKingField(): unexpected number of kings (' + kings.length + ')')
        return kings[0].field
    }

    // ------------------ Attacks -------------------

    private getAttackedFieldsByRook(pieceOB_: pieceOnBoard): IField[] {
        let rookMoves: IField[] = []
        let rookMovesRaw = new RookMovesRaw(pieceOB_.field)
        for (const ray of RookMovesRaw.rays) {
            for (let f of rookMovesRaw.getRay(ray)) {
                rookMoves.push(f)
                if (!this.isFieldEmpty(f as Field)) break
            }
        }
        return rookMoves;
    }
    private getAttackedFieldsByKnight(pieceOB_: pieceOnBoard): IField[] {
        let knightMoves = new KnightMovesRaw(pieceOB_.field)
        return knightMoves.moves
    }
    private getAttackedFieldsByBishop(pieceOB_: pieceOnBoard): IField[] {
        let bishopMoves: IField[] = []
        let bishopMovesRaw = new BishopMovesRaw(pieceOB_.field)
        for (const ray of BishopMovesRaw.rays) {
            for (let f of bishopMovesRaw.getRay(ray)) {
                bishopMoves.push(f)
                if (!this.isFieldEmpty(f as Field)) break
            }
        }
        return bishopMoves
    }
    private getAttackedFieldsByQueen(pieceOB_: pieceOnBoard): IField[] {
        let queenMoves: IField[] = []
        let rookMovesRaw = new RookMovesRaw(pieceOB_.field)
        for (const ray of RookMovesRaw.rays) {
            for (let f of rookMovesRaw.getRay(ray)) {
                queenMoves.push(f);
                if (!this.isFieldEmpty(f as Field)) break
            }
        }
        let bishopMovesRaw = new BishopMovesRaw(pieceOB_.field)
        for (const ray of BishopMovesRaw.rays) {
            for (let f of bishopMovesRaw.getRay(ray)) {
                queenMoves.push(f)
                if (!this.isFieldEmpty(f as Field)) break
            }
        }
        return queenMoves
    }
    private getAttackedFieldsByPawn(pieceOB_: pieceOnBoard): IField[] {
        let pawnMovesRaw = new PawnMovesRaw(pieceOB_.field, pieceOB_.piece.color)
        return pawnMovesRaw.attacks.map(x => x.target)
    }
    private getAttackedFieldsByKing(pieceOB_: pieceOnBoard): IField[] {
        let kingMoves = new KingMovesRaw(pieceOB_.field)
        return kingMoves.moves;
    }
    getAttackedFieldsByPiece(pieceOB_: pieceOnBoard): IField[] {
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

    getAttackedFieldsByColor(attackingColor: color): AttackedFields {
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

    getAttackedFields(): AttackedFields {
        return this.getAttackedFieldsByColor(this._data.nextMoveBy)
    }

    isPieceAttackedOn(field: IField, attackingColor: color): boolean {
        return this.getAttackedFieldsByColor(attackingColor).isAttacked(field)
    }
    getAttackersOn(field: IField, attackingColor: color): pieceOnBoard[] {
        return this.getAttackedFieldsByColor(attackingColor).attackersOn(field)
    }
    getAttackersOfKindOn(field: IField, kind: pieceKind, attackingColor: color): pieceOnBoard[] {
        return this.getAttackedFieldsByColor(attackingColor).attackersOn(field).filter(x => x.piece.kind == kind)
    }

    // ------------------ Legal Moves -------------------

    private getLegalMovesOfRook(pieceOB_: pieceOnBoard): MoveOnBoard[] {
        let result: MoveOnBoard[] = []
        let rookMovesRaw = new RookMovesRaw(pieceOB_.field)
        for (const ray of RookMovesRaw.rays) {
            for (let target of rookMovesRaw.getRay(ray)) {
                let m = this.validateMove(pieceOB_, target)
                if (m.isValid) result.push(m.moveOnBoard)
                if (!this.isFieldEmpty(target as Field)) break
            }
        }
        return result
    }
    private getLegalMovesOfKnight(pieceOB_: pieceOnBoard): MoveOnBoard[] {
        let result: MoveOnBoard[] = []
        let knightMoves = new KnightMovesRaw(pieceOB_.field)
        for (let target of knightMoves.moves) {
            let m = this.validateMove(pieceOB_, target) // TODO adjust after migration
            if (m.isValid) result.push(m.moveOnBoard)
        }
        return result
    }
    private getLegalMovesOfBishop(pieceOB_: pieceOnBoard): MoveOnBoard[] {
        let result: MoveOnBoard[] = []
        let bishopMovesRaw = new BishopMovesRaw(pieceOB_.field)
        for (const ray of BishopMovesRaw.rays) {
            for (let target of bishopMovesRaw.getRay(ray)) {
                let m = this.validateMove(pieceOB_, target)
                if (m.isValid) result.push(m.moveOnBoard)
                if (!this.isFieldEmpty(target as Field)) break
            }
        }
        return result
    }
    private getLegalMovesOfQueen(pieceOB_: pieceOnBoard): MoveOnBoard[] {
        let result: MoveOnBoard[] = []
        let rookMovesRaw = new RookMovesRaw(pieceOB_.field)
        for (const ray of RookMovesRaw.rays) {
            for (let target of rookMovesRaw.getRay(ray)) {
                let m = this.validateMove(pieceOB_, target)
                if (m.isValid) result.push(m.moveOnBoard)
                if (!this.isFieldEmpty(target as Field)) break
            }
        }
        let bishopMovesRaw = new BishopMovesRaw(pieceOB_.field)
        for (const ray of BishopMovesRaw.rays) {
            for (let target of bishopMovesRaw.getRay(ray)) {
                let m = this.validateMove(pieceOB_, target)
                if (m.isValid) result.push(m.moveOnBoard)
                if (!this.isFieldEmpty(target as Field)) break
            }
        }
        return result
    }
    private getLegalMovesOfKing(pieceOB_: pieceOnBoard): MoveOnBoard[] {
        let result: MoveOnBoard[] = []
        let kingMoves = new KingMovesRaw(pieceOB_.field)
        for (let target of kingMoves.moves) {
            let m = this.validateMove(pieceOB_, target)
            if (m.isValid) result.push(m.moveOnBoard)
        }
        let castleDataShort = KingMovesRaw.castle(pieceOB_.piece.color!, castleType.short, this)
        if (pieceOB_.field.same(castleDataShort.kingSource)) {
            let m = this.validateMove(pieceOB_, castleDataShort.kingTarget)
            if (m.isValid) result.push(m.moveOnBoard)
        }
        let castleDataLong = KingMovesRaw.castle(pieceOB_.piece.color!, castleType.short, this)
        if (pieceOB_.field.same(castleDataLong.kingSource)) {
            let m = this.validateMove(pieceOB_, castleDataLong.kingTarget)
            if (m.isValid) result.push(m.moveOnBoard)
        }
        return result
    }
    private getLegalMovesOfPawn(pieceOB_: pieceOnBoard): MoveOnBoard[] {
        let result: MoveOnBoard[] = []
        let pawnMovesRaw = new PawnMovesRaw(pieceOB_.field, pieceOB_.piece.color!)
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
        if (pawnMovesRaw.bigMove) {
            let m = this.validateMove(pieceOB_, pawnMovesRaw.bigMove)
            if (m.isValid) result.push(m.moveOnBoard)
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
    getLegalMovesOfPiece(piece_: pieceOnBoard): MoveOnBoard[] {
        let result: MoveOnBoard[] = []
        let cached = this._legalMoveCache.getMovesOfPiece(piece_)
        if (cached) return cached
        switch (piece_.piece.kind) {
            case pieceKind.Rook:
                result = this.getLegalMovesOfRook(piece_)
                break
            case pieceKind.Knight:
                result = this.getLegalMovesOfKnight(piece_)
                break
            case pieceKind.Bishop:
                result = this.getLegalMovesOfBishop(piece_)
                break
            case pieceKind.Queen:
                result = this.getLegalMovesOfQueen(piece_)
                break
            case pieceKind.King:
                result = this.getLegalMovesOfKing(piece_)
                break
            case pieceKind.Pawn:
                result = this.getLegalMovesOfPawn(piece_)
                break
            //case pieceKind.none:
        }
        this._legalMoveCache.setMovesOfPiece(piece_, result)
        return result
    }
    getLegalMoves(): MoveOnBoard[] {
        let result: MoveOnBoard[] = []
        let cached = this._legalMoveCache.getAllMoves()
        if (cached) return cached
        let movingPieces = this.currentPiecesOnBoard(this._data.nextMoveBy)
        for (let piece_ of movingPieces) {
            result = result.concat(this.getLegalMovesOfPiece(piece_))
        }
        this._legalMoveCache.setAllMoves(result)
        return result
    }
    hasLegalMoves(): boolean {
        return this.getLegalMoves().length != 0
    }


    // ------------------ Validate Move -----------------
    // Legal moves use these validations, so don't use legalmoves in this section!

    private validateMoveOfPiece(validatedMove: ValidatedMove): boolean {
        // no castle or pawn move here!
        if (validatedMove.kind == pieceKind.Pawn || validatedMove.kind == pieceKind.none) return false
        let tmpBoard = new ChessBoardRepresentation(this._data)
        tmpBoard.setBoard(this._board)
        tmpBoard.doMove(validatedMove)
        if (tmpBoard.isCheck()) return false

        if (this.isCaptureOn(validatedMove.target as Field, validatedMove.color)) {
            validatedMove.pieceCaptured = this.peekFieldPieceOB(validatedMove.target as Field)
            if (validatedMove.capturedKind == pieceKind.Rook) {
                KingMovesRaw.adjustCastleRightsAfterCapture(validatedMove.pieceCaptured, validatedMove.castleFlags, this)
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
        if (typeof rookLike == 'undefined') return false;
        let rookMovesRaw = new RookMovesRaw(validatedMove.source)
        for (let f of rookMovesRaw.getRay(rookLike)) {
            if (f.same(validatedMove.target)) break
            if (!this.isFieldEmpty(f as Field)) return false
        }
        if (!this.isFieldEmptyOrCapture(validatedMove.target as Field, validatedMove.color)) return false

        if (!this.validateMoveOfPiece(validatedMove)) return false
        KingMovesRaw.adjustCastleRightsAfterMove(validatedMove.sourcePieceOB, validatedMove.castleFlags, this)

        validatedMove.isValid = true
        return true
    }
    private validateMoveOfKnight(validatedMove: ValidatedMove): boolean {
        if (validatedMove.kind != pieceKind.Knight) return false

        let knightMoves = new KnightMovesRaw(validatedMove.source)
        let found = knightMoves.moves.find(x => x.same(validatedMove.target))
        if (typeof found === 'undefined') return false
        if (!this.isFieldEmptyOrCapture(validatedMove.target as Field, validatedMove.color)) return false
        if (!this.validateMoveOfPiece(validatedMove)) return false

        validatedMove.isValid = true
        return true
    }
    private validateMoveOfBishop(validatedMove: ValidatedMove): boolean {
        if (validatedMove.kind != pieceKind.Bishop) return false

        let bishopLike = isOffsetBishopLike(validatedMove.source, validatedMove.target)
        if (typeof bishopLike === 'undefined') return false;
        let bishopMovesRaw = new BishopMovesRaw(validatedMove.source)
        for (let f of bishopMovesRaw.getRay(bishopLike)) {
            if (f.same(validatedMove.target)) break
            if (!this.isFieldEmpty(f as Field)) return false
        }
        if (!this.isFieldEmptyOrCapture(validatedMove.target as Field, validatedMove.color)) return false
        if (!this.validateMoveOfPiece(validatedMove)) return false

        validatedMove.isValid = true
        return true
    }
    private validateMoveOfQueen(validatedMove: ValidatedMove): boolean {
        if (validatedMove.kind != pieceKind.Queen) return false

        let bishopLikeQ = isOffsetBishopLike(validatedMove.source, validatedMove.target)
        if (typeof bishopLikeQ !== 'undefined') {
            let bishopMovesRawQ = new BishopMovesRaw(validatedMove.source)
            for (let f of bishopMovesRawQ.getRay(bishopLikeQ)) {
                if (f.same(validatedMove.target)) break
                if (!this.isFieldEmpty(f as Field)) return false
            }
            if (!this.isFieldEmptyOrCapture(validatedMove.target as Field, validatedMove.color)) return false
        }
        else {
            let rookLikeQ = isOffsetRookLike(validatedMove.source, validatedMove.target)
            if (typeof rookLikeQ !== 'undefined') {
                let rookMovesRawQ = new RookMovesRaw(validatedMove.source)
                for (let f of rookMovesRawQ.getRay(rookLikeQ)) {
                    if (f.same(validatedMove.target)) break
                    if (!this.isFieldEmpty(f as Field)) return false
                }
                if (!this.isFieldEmptyOrCapture(validatedMove.target as Field, validatedMove.color)) return false
            }
            else return false
        }
        if (!this.validateMoveOfPiece(validatedMove)) return false

        validatedMove.isValid = true
        return true
    }
    private validateMoveOfKing(validatedMove: ValidatedMove): boolean {
        if (validatedMove.kind != pieceKind.King) return false

        let castle = KingMovesRaw.isMoveCastle(validatedMove.sourcePieceOB, validatedMove.target, this)
        if (typeof castle !== 'undefined') {
            if (!validatedMove.castleFlags.getCastleFlag(validatedMove.color, castle.castleType)) return false
            if (!this.isPieceOn(castle.kingSource as Field, castle.kingPiece)) return false
            if (!this.isPieceOn(castle.rookSource as Field, castle.rookPiece)) return false
            for (let colIdx_ = castle.betweenPathCols.start; colIdx_ <= castle.betweenPathCols.end; colIdx_++)
                if (!this.isFieldEmpty(this.field(colIdx_, castle.row))) return false
            for (let colIdx_ = castle.kingPathCols.start; colIdx_ <= castle.kingPathCols.end; colIdx_++)
                if (this.isPieceAttackedOn(this.field(colIdx_, castle.row), otherColor(validatedMove.color))) return false

            validatedMove.pieceRook = this.peekFieldPieceOB(castle.rookSource as Field)
            validatedMove.targetRook = castle.rookTarget
            validatedMove.halfMoves50++
            validatedMove.enPassantField = undefined
            validatedMove.isCastle = true
            validatedMove.castleType = castle.castleType
        }
        else {
            let kingMovesRaw = new KingMovesRaw(validatedMove.source)
            let legalKingMove = kingMovesRaw.moves.find(x => x.same(validatedMove.target))
            if (typeof legalKingMove === 'undefined') return false
            if (!this.isFieldEmptyOrCapture(validatedMove.target as Field, validatedMove.color)) return false
            if (!this.validateMoveOfPiece(validatedMove)) return false
        }
        KingMovesRaw.adjustCastleRightsAfterMove(validatedMove.sourcePieceOB, validatedMove.castleFlags, this)

        validatedMove.isValid = true
        return true
    }
    private validateMoveOfPawn(validatedMove: ValidatedMove): boolean {
        if (validatedMove.kind != pieceKind.Pawn) return false

        validatedMove.enPassantField = undefined
        let pawnMove = PawnMovesRaw.checkPawnMove(validatedMove.source, validatedMove.target, validatedMove.color)
        if (typeof pawnMove == 'undefined') return false
        if (typeof pawnMove.enPassantField != 'undefined') {
            if (!this.isFieldEmpty(pawnMove.enPassantField as Field)) return false
            if (!this.isFieldEmpty(validatedMove.target as Field)) return false
            validatedMove.enPassantField = pawnMove.enPassantField
        }
        else if (pawnMove.isCapture) {
            if (typeof this._data.enPassantField != 'undefined' && validatedMove.target.same(this._data.enPassantField)) {
                // capturing e.p.
                if (!this.isFieldEmpty(validatedMove.target as Field)) return false // e.p. target should always be empty
                validatedMove.pieceCaptured = this.peekFieldPieceOB(PawnMovesRaw.getPawnFieldOfCaptureEP(validatedMove.target, validatedMove.color) as Field)
                validatedMove.captureEP = true
            }
            else if (this.isCaptureOn(validatedMove.target as Field, validatedMove.color)) {
                validatedMove.pieceCaptured = this.peekFieldPieceOB(validatedMove.target as Field)
                if (validatedMove.capturedKind == pieceKind.Rook) {
                    KingMovesRaw.adjustCastleRightsAfterCapture(validatedMove.pieceCaptured, validatedMove.castleFlags, this)
                }
            }
            else return false
        }
        else // normal move
            if (!this.isFieldEmpty(validatedMove.target as Field)) return false

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
    validateMove(sourcePieceOB: pieceOnBoard, target: IField, promotionPieceKind?: pieceKind): ValidatedMove {
        let validatedMove = new ValidatedMove(sourcePieceOB, target, this._data)
        validatedMove.isValid = false
        if (!validatedMove.source.same(validatedMove.target)) {
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
                //case pieceKind.none:
            }
        }
        return validatedMove
    }

    // ------------------ Board Moves -------------------

    move(source: IField, target: IField, optionals?: { promotionPieceKind?: pieceKind, validateOnly?: boolean }): MoveOnBoard | undefined {
        let validateOnly = false;
        let promotionPieceKind = undefined;
        if (optionals && typeof optionals.validateOnly !== 'undefined') validateOnly = optionals.validateOnly
        if (optionals && typeof optionals.promotionPieceKind !== 'undefined') promotionPieceKind = optionals.promotionPieceKind

        let sourcePieceOB = this.peekFieldPieceOB(source as Field)
        if (sourcePieceOB.piece.kind == pieceKind.none) return undefined

        let validatedMove = this.validateMove(sourcePieceOB, target, promotionPieceKind)
        if (validatedMove.isValid && !validateOnly) {
            validatedMove.updateData(this._data, this)
            this.doMove(validatedMove)
            this._data.nextMoveBy = otherColor(this._data.nextMoveBy)
            if (this._data.nextMoveBy == color.white) this._data.moveNumber++
            this.clearAttackedFields()
            this._legalMoveCache.clear()
        }
        return validatedMove.isValid ? validatedMove.moveOnBoard : undefined
    }

    moveCastle(castleType: castleType): MoveOnBoard | undefined {
        let castleData = KingMovesRaw.castle(this._data.nextMoveBy, castleType, this)
        return this.move(castleData.kingSource, castleData.kingTarget)
    }

    revokeMove(moveOb: MoveOnBoard) {
        let validatedMove = this.validateMove(moveOb.pieceOB, moveOb.target, moveOb.promotionPiece)
        this.undoMove(validatedMove)
        this._data = moveOb.previousStatus! // TODO: I don't like this double adjustment of values, see chess-board
        this.clearAttackedFields()
        this._legalMoveCache.clear()
    }

    // ------------------ Move on Board -------------------

    private doMove(validatedMove: ValidatedMove) {
        if (validatedMove.isCastle) {
            this.setPiece(validatedMove.piece, validatedMove.target as Field)
            this.removePiece(validatedMove.source as Field)
            this.setPiece(validatedMove.pieceRook?.piece!, validatedMove.targetRook! as Field)
            this.removePiece(validatedMove.pieceRook?.field as Field)
        }
        else {
            if (validatedMove.isPromotion)
                this.setPiece(Piece.getPiece(validatedMove.promotionPieceKind!, validatedMove.color), validatedMove.target as Field)
            else
                this.setPiece(validatedMove.piece, validatedMove.target as Field)
            this.removePiece(validatedMove.source as Field)
            if (validatedMove.captureEP)
                this.removePiece(validatedMove.pieceCaptured?.field! as Field)

        }
    }
    private undoMove(validatedMove: ValidatedMove) {
        if (validatedMove.isCastle) {
            this.setPiece(validatedMove.piece, validatedMove.source as Field)
            this.removePiece(validatedMove.target as Field)
            this.setPiece(validatedMove.pieceRook?.piece!, validatedMove.pieceRook?.field as Field)
            this.removePiece(validatedMove.targetRook! as Field)
        }
        else {
            this.setPiece(validatedMove.piece, validatedMove.source as Field)
            this.removePiece(validatedMove.target as Field)
            if (validatedMove.captureEP)
                this.setPiece(validatedMove.pieceCaptured?.piece!, validatedMove.pieceCaptured?.field! as Field)
        }
    }


    // ------------------ Board Status -------------------

    isCheck(): boolean {
        return this.isPieceAttackedOn(this.getKingField(this._data.nextMoveBy), otherColor(this._data.nextMoveBy))
    }
    isMate(): boolean {
        // TODO enhance performance
        return this.isCheck() && !this.hasLegalMoves()
    }
    isStaleMate(): boolean {
        // TODO: a specific hasLegalMoves could be more performant
        return !this.isCheck() && !this.hasLegalMoves()
    }

}
