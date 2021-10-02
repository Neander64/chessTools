
import { EncodedPositionKey, encodeType } from './encode-position-key'
import { charFENToPiece, charPGNToPiece, Piece, pieceKind } from '../common/Piece'
import { color, otherColor, colorStr } from '../common/chess-color'
import { KingMovesRaw } from './pieces/KingMovesRaw'
import { castleType } from "../common/CastleFlags"
import { PawnMovesRaw } from './pieces/PawnMovesRaw'
import { ChessBoardRepresentation } from './representation/ChessBoardRepresentation'
import { Field } from "../common/Field"
import { pieceOnBoard } from "../common/pieceOnBoard"
import { fileTypeDomain, IField, rankTypeDomain } from "../common/IField"
import { offsetsEnum } from '../common/offsetsEnum'
import { AttackedFields } from './AttackedFields'
import { MoveOnBoard } from '../common/MoveOnBoard'
import { GameResult, gameResult } from '../common/GameResult'
import { ChessGameStatusData } from '../common/ChessGameStatusData'
import { Fen } from '../FEN/Fen'

// TODO remove, it's superfluid now
function getColIdx(str: string, idx: number = 0): number {
    return (str[0].charCodeAt(idx) - 'a'.charCodeAt(idx))
}
function getRowIdx(str: string, idx: number = 1): number {
    return 8 - parseInt(str[idx], 10)
}

export class ChessBoard {
    // ChessBoard is a Position on the board
    // it allows to use a FEN-String to set it up
    // it evaluates the status on the board (check, mate, stalemate, 50-moves-rule, etc.)
    // it keeps track of moves on the board (to find out repetitions), thus it is almost a game (but not quite)
    // it delegates activities on the board to the board implementation

    readonly initialBoardFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

    //private _board: Piece[][] = [] // col/row : [0][0]="a8" .. [7][7]="h1"
    private _cbr: ChessBoardRepresentation
    private _moves: MoveOnBoard[] = []
    private _gameStatus: ChessGameStatusData
    private _currentMove?: MoveOnBoard


    constructor(fen?: string) {
        this._gameStatus = new ChessGameStatusData()
        this._cbr = new ChessBoardRepresentation(this._gameStatus)
        this.clearBoard()
        this.loadFEN(fen ? fen : this.initialBoardFEN)
    }
    get board(): ChessBoardRepresentation {
        return this._cbr
    }
    get gameStatus(): ChessGameStatusData {
        return this._gameStatus
    }
    private addMoveToGame(move_: MoveOnBoard) {
        move_.boardKey = EncodedPositionKey.encodeBoard(this.board, this.gameStatus, encodeType.FENlikeLongBigInt) as BigInt
        move_.isCheck = this.board.isCheck()
        move_.isMate = this.board.isMate()
        this._currentMove = move_
        this._moves.push(move_)
    }
    get currentMove() { return this._currentMove }

    startPosition() {
        this.clearBoard()
        this.loadFEN(this.initialBoardFEN)
    }
    clearBoard() {
        this.board.clearBoard()
        this._moves = []
        this._gameStatus.init()
    }
    loadFEN(fen: string) {
        try {
            this.clearBoard()
            let fen_ = new Fen(fen)
            // TODO use IBoard to be used in Fen class
            for (let rank of rankTypeDomain) {
                for (let file of fileTypeDomain) {
                    let fen_piece = fen_.fenBoard.getPiece(this.board.fieldFromNotation(file + rank))
                    let piece = charFENToPiece(fen_piece)
                    this.board.setPiece(piece, Field.fromNotation(file + rank))
                }
            }
            // let blackPieces = this.board.currentPiecesOnBoard(color.black)
            // let blackKings = blackPieces.filter(val => (val.piece.kind == pieceKind.King && val.piece.color == color.black))
            // if (blackKings.length != 1) throw new Error('loadFEN(): unexpected number of black kings')
            // //this._blackKing = blackKings[0]
            // let blackPawns = blackPieces.filter(val => (val.piece.kind == pieceKind.Pawn && val.piece.color == color.black))
            // if (blackPawns.length > 8) throw new Error('loadFEN(): too many black pawns')

            // let whitePieces = this.board.currentPiecesOnBoard(color.white)
            // let whiteKings = whitePieces.filter(val => (val.piece.kind == pieceKind.King && val.piece.color == color.white))
            // if (whiteKings.length != 1) throw new Error('loadFEN(): unexpected number of white kings')
            // //this._whiteKing = whiteKings[0]
            // let whitePawns = whitePieces.filter(val => (val.piece.kind == pieceKind.Pawn && val.piece.color == color.white))
            // if (whitePawns.length > 8) throw new Error('loadFEN(): too many white pawns')

            this._gameStatus.nextMoveBy = fen_.activeColor
            this._gameStatus.firstMoveBy = this._gameStatus.nextMoveBy

            this._gameStatus.castleFlags.canCastleShortWhite = fen_.canCastleShortWhite
            this._gameStatus.castleFlags.canCastleLongWhite = fen_.canCastleLongWhite
            this._gameStatus.castleFlags.canCastleShortBlack = fen_.canCastleShortBlack
            this._gameStatus.castleFlags.canCastleLongBlack = fen_.canCastleLongBlack

            if (fen_.isEnPassantPossible())
                this._gameStatus.enPassantField = this.board.fieldFromNotation(fen_.enPassantField!)

            this._gameStatus.halfMoves50 = fen_.plyCount
            this._gameStatus.firstHalfMoves50 = fen_.plyCount

            this._gameStatus.moveNumber = fen_.moveNumber
            this._gameStatus.firstMoveNumber = fen_.moveNumber

            // let fenTokens = fen.split(/\s+/)
            // if (fenTokens.length !== 6) throw new Error('loadFEN(): unexpected number of FEN-token')
            // //1. piece positions
            // let boardRows = fenTokens[0].split('/')
            // if (boardRows.length !== 8) throw new Error('loadFEN(): unexpected number of rows in position')
            // for (let rank = 0; rank < 8; rank++) {
            //     const fenRow = boardRows[rank]
            //     if (fenRow.length > 8 || fenRow.length === 0) throw new Error('loadFEN(): unexpected number of columns in position')
            //     let file = 0
            //     for (let p = 0; p < fenRow.length; p++) {
            //         let digit = parseInt(fenRow[p], 10)
            //         if (isNaN(digit)) { // it's a piece
            //             let piece = charFENToPiece(fenRow[p])
            //             if (typeof piece == 'undefined') throw new Error('loadFEN(): unexpected piece')
            //             if (file >= 8) throw new Error('loadFEN(): too many pieces/columns in row')
            //             this.board.setPieceI(piece, file++, rank)
            //         }
            //         else {
            //             if (digit <= 0 || digit > 8 - file) throw new Error('loadFEN(): unexpected digit in position')
            //             while (digit > 0 && file < 8) {
            //                 this.board.setPieceI(Piece.none(), file++, rank)
            //                 digit--
            //             }
            //         }
            //     }
            // }
            // // board validation
            // let blackPieces = this.board.currentPiecesOnBoard(color.black)
            // let blackKings = blackPieces.filter(val => (val.piece.kind == pieceKind.King && val.piece.color == color.black))
            // if (blackKings.length != 1) throw new Error('loadFEN(): unexpected number of black kings')
            // //this._blackKing = blackKings[0]
            // let blackPawns = blackPieces.filter(val => (val.piece.kind == pieceKind.Pawn && val.piece.color == color.black))
            // if (blackPawns.length > 8) throw new Error('loadFEN(): too many black pawns')

            // let whitePieces = this.board.currentPiecesOnBoard(color.white)
            // let whiteKings = whitePieces.filter(val => (val.piece.kind == pieceKind.King && val.piece.color == color.white))
            // if (whiteKings.length != 1) throw new Error('loadFEN(): unexpected number of white kings')
            // //this._whiteKing = whiteKings[0]
            // let whitePawns = whitePieces.filter(val => (val.piece.kind == pieceKind.Pawn && val.piece.color == color.white))
            // if (whitePawns.length > 8) throw new Error('loadFEN(): too many white pawns')

            // //2. player to move next
            // switch (fenTokens[1]) {
            //     case 'w': this._gameStatus.nextMoveBy = color.white; break
            //     case 'b': this._gameStatus.nextMoveBy = color.black; break
            //     default: throw new Error('loadFEN(): illegal player to move')
            // }
            // this._gameStatus.firstMoveBy = this._gameStatus.nextMoveBy

            // //3. castle options
            // this._gameStatus.castleFlags.canCastleShortWhite = (fenTokens[2].indexOf('K') > -1)
            // this._gameStatus.castleFlags.canCastleLongWhite = (fenTokens[2].indexOf('Q') > -1)
            // this._gameStatus.castleFlags.canCastleShortBlack = (fenTokens[2].indexOf('k') > -1)
            // this._gameStatus.castleFlags.canCastleLongBlack = (fenTokens[2].indexOf('q') > -1)
            // // TODO check if none specified must be '-' (strict mode)

            // //4. en passant
            // //this._data.enPassantPossible = (fenTokens[3] !== '-')
            // if (fenTokens[3] !== '-') {
            //     if (fenTokens[3].length != 2) throw new Error('loadFEN(): en passant unexpected format')
            //     this._gameStatus.enPassantField = this.board.fieldFromNotation(fenTokens[3])
            // }
            // else this._gameStatus.enPassantField = undefined

            // //5. number of half-moves since last capture or pawn move
            // this._gameStatus.halfMoves50 = parseInt(fenTokens[4], 10)
            // this._gameStatus.firstHalfMoves50 = this._gameStatus.halfMoves50
            // if (isNaN(this._gameStatus.halfMoves50)) throw new Error('loadFEN(): number of half-moves NAN')

            // //6. next move number
            // this._gameStatus.moveNumber = parseInt(fenTokens[5], 10)
            // this._gameStatus.firstMoveNumber = this._gameStatus.moveNumber
            // if (isNaN(this._gameStatus.moveNumber)) throw new Error('loadFEN(): moveNumber NAN')
            // if (this._gameStatus.moveNumber <= 0) throw new Error('loadFEN(): moveNumber negative/zero')

            this._gameStatus.gameOver = this.isGameOver()
        }
        catch (err) {
            this.clearBoard()
            throw err
        }
    }

    getFEN(): string {
        // TODO use FEN class
        let fen = ""

        //1. piece positions
        for (let row = 0; row < 8; row++) {
            let emptyCount = 0
            for (let col = 0; col < 8; col++) {
                if (!this.board.isPieceI(col, row))
                    emptyCount++
                else {
                    if (emptyCount > 0) {
                        fen += emptyCount
                        emptyCount = 0
                    }
                    fen += this.board.peekFieldI(col, row).FEN
                }
            }
            if (emptyCount > 0)
                fen += emptyCount
            if (row < 7) fen += '/'
        }
        fen += ' '

        //2. player to move next
        switch (this._gameStatus.nextMoveBy) {
            case color.black: fen += 'b'; break
            case color.white: fen += 'w'
        }
        fen += ' '

        //3. castle options
        if (this._gameStatus.castleFlags.hasNoCastleOption)
            fen += '-'
        else {
            if (this._gameStatus.castleFlags.canCastleShortWhite) fen += 'K'
            if (this._gameStatus.castleFlags.canCastleLongWhite) fen += 'Q'
            if (this._gameStatus.castleFlags.canCastleShortBlack) fen += 'k'
            if (this._gameStatus.castleFlags.canCastleLongBlack) fen += 'q'
        }
        fen += ' '

        //4. en passant
        if (!this._gameStatus.enPassantPossible)
            fen += '-'
        else
            fen += this._gameStatus.enPassantField!.notation
        fen += ' '

        //5. number of half-moves since last capture or pawn move
        fen += this._gameStatus.halfMoves50 + ' '

        //6. next move number
        fen += this._gameStatus.moveNumber

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
                line += this.board.peekFieldI(col, row).FEN + (col < 7 ? ' | ' : ' |')
            }
            result.push(line)
            result.push(' -------------------------------')
        }

        result.push('next move color: ' + colorStr(this._gameStatus.nextMoveBy))
        result.push('Possible Castle White O-O:' + (this._gameStatus.castleFlags.canCastleShortWhite ? 'Y' : 'N') + ', O-O-O:' + (this._gameStatus.castleFlags.canCastleLongWhite ? 'Y' : 'N'))
        result.push('Possible Castle Black O-O:' + (this._gameStatus.castleFlags.canCastleShortBlack ? 'Y' : 'N') + ', O-O-O:' + (this._gameStatus.castleFlags.canCastleLongBlack ? 'Y' : 'N'))
        if (this._gameStatus.enPassantPossible) {
            result.push('en passant option at ' + this._gameStatus.enPassantField!.notation)
        }
        result.push('moves without pawn or capture: ' + this._gameStatus.halfMoves50)
        result.push('move number: ' + this._gameStatus.moveNumber)
        //TODO add gameOver status
        result.push('Game Result: ' + gameResult(this._gameStatus.gameResult))
        return result
    }

    setWinningColor(color_: color) {
        switch (color_) {
            case color.black:
                this._gameStatus.gameResult = GameResult.black_wins
                break
            case color.white:
                this._gameStatus.gameResult = GameResult.white_wins
                break
        }
    }
    private check50MovesRule(): boolean {
        // no pawn has moved and no capture for 50 Moves
        // game maybe continued if the player does not claim draw.
        return this._gameStatus.halfMoves50 >= 50 * 2
    }
    private check75MovesRule(): boolean {
        // no pawn has moven and no capture for 75 Moves
        // FIDE Rule (since 1.July 2014) forced and automatic end of game by draw (unless the last move is mate)
        return this._gameStatus.halfMoves50 >= 75 * 2
    }
    private threefoldRepetition(): boolean {
        // 3 identical position (same player to move, same castle rights, same enpassant options, same moves available) each time as the current board
        // game maybe continued if the player does not claim draw.
        // TODO: This could be done, when inserting a new move (i.e. store repetition count there)
        let positionCount: { key: BigInt, count: number }[] = []
        for (let m of this._moves) {
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
        for (let m of this._moves) {
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
        if (spec.black.size == 1 && spec.white.size == 1) return true
        if (spec.black.size + spec.white.size == 3) {
            // K vs K+B
            if (spec.black.get(Piece.blackBishop()) == 1 || spec.white.get(Piece.whiteBishop()) == 1) return true
            // K vs K+N
            if (spec.black.get(Piece.blackKnight()) == 1 || spec.white.get(Piece.whiteKnight()) == 1) return true
        }
        if (spec.black.size == 2 && spec.white.size == 1 &&
            spec.black.get(Piece.blackBishop()) == 1 && spec.white.get(Piece.whiteBishop()) == 1) {
            // K+B vs K+B, with Bishops on same color
            //TODO: check if both have the same colored field
            return true

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
        let color_ = this._gameStatus.nextMoveBy
        let kingField = this.board.getKingField(otherColor(color_))
        if (this.board.isPieceAttackedOn(kingField, color_)) { // we have the move and it's already check. NOPE, we consider this as finished
            this.setWinningColor(color_)
            this.gameStatus.isMate = true
            return true
        }
        if (this.board.isMate()) {
            this.setWinningColor(otherColor(color_))
            this.gameStatus.isMate = true
            return true
        }
        if (this.board.isCheck()) {
            this.gameStatus.isCheck = true
        }
        if (this.board.isStaleMate()) {
            this._gameStatus.gameResult = GameResult.draw
            return true
        }
        if (this.drawByDeadPosition()) {
            this._gameStatus.gameResult = GameResult.draw
            return true
        }
        if (this.check50MovesRule()) {
            this._gameStatus.drawPossible50MovesRule = true
        }
        if (this.check75MovesRule()) { // FIDE: is forced draw
            this._gameStatus.gameResult = GameResult.draw
            return true
        }
        if (this.threefoldRepetition()) {
            this._gameStatus.drawPossibleThreefoldRepetion = true
        }
        if (this.fivefoldRepetition()) { // FIDE: is forced draw
            this._gameStatus.gameResult = GameResult.draw
            return true
        }
        return false
    }

    get moves() { return this._moves }

    movesToStrings(): string[] { // for debugging
        let result: string[] = []
        for (let m of this._moves) {
            let s = m.notation || ''
            if (m.isMate) s += '#'
            else if (m.isCheck) s += '+'
            result.push(s)

        }
        return result
    }
    legalMoves(): MoveOnBoard[] {
        return this._cbr.getLegalMoves()
    }
    legalMovesNotationLong(): string[] {
        return this._cbr.getLegalMoves().map(x => x.notationLong!)
    }
    attackedMoves(): AttackedFields {
        return this._cbr.getAttackedFields()
    }

    undoMove() {
        let lastMove = this._moves.pop()
        if (!lastMove) return
        this._cbr.revokeMove(lastMove)
        this._gameStatus = lastMove.previousStatus! // TODO: I don't like this double adjustment of values, see representation
    }
    move(move: string): boolean {
        // allow SAN like formats (not very strict as long as it is parsable, it'll be processed)
        // Strip additional information
        let result = false
        let moveOB: MoveOnBoard | undefined
        let previousStatus = this._gameStatus.copy()
        if (this._gameStatus.gameOver) return false // no moves on a finished game

        let moveCleanedUp = move.replace(/=/, '').replace(/[+#]?[?!]*$/, '')
        if (moveCleanedUp === KingMovesRaw.CASTLE_SHORT_STR) {
            moveOB = this.board.moveCastle(castleType.short)
            result = (moveOB !== undefined)
            if (result) {
                moveOB!.previousStatus = previousStatus
                this.addMoveToGame(moveOB!)
                this._gameStatus.gameOver = this.isGameOver()
            }
        }
        else if (moveCleanedUp === KingMovesRaw.CASTLE_LONG_STR) {
            moveOB = this.board.moveCastle(castleType.long)
            result = (moveOB !== undefined)
            if (result) {
                moveOB!.previousStatus = previousStatus
                this.addMoveToGame(moveOB!)
                this._gameStatus.gameOver = this.isGameOver()
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
                let piece_ = charPGNToPiece(piece, this._gameStatus.nextMoveBy)
                let validPiece = piece_.isPiece
                if (!validPiece) { // maybe a pawn
                    piece_ = (this._gameStatus.nextMoveBy == color.black) ? Piece.blackPawn() : Piece.whitePawn()
                }
                if (!to) return false
                let target = this.board.fieldFromNotationQuiet(to)
                if (!target) return false
                let promotionPiece_ = Piece.none()
                if (!validPiece /* is a pawn */ && promotion) {
                    let promotionPieceIn = charFENToPiece(promotion)
                    let validPiecePromo = promotionPieceIn.isPiece
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
                    source = source_ as Field // TODO this should be possible without cast
                }
                moveOB = this.board.move(source!, target, { promotionPieceKind: promotionPiece_.kind })
                result = (moveOB !== undefined)
                if (result) {
                    moveOB!.previousStatus = previousStatus
                    this.addMoveToGame(moveOB!)
                    this._gameStatus.gameOver = this.isGameOver()
                }
            }
        }
        return result
    }

    private findSourceByTarget(from: string, target: IField, piece_: Piece, promotionPiece: pieceKind = pieceKind.none): IField | undefined {
        // TODO move this mainly to the board implementation
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
                let candidates = this.board.currentKindOfPiecesOnBoard(this._gameStatus.nextMoveBy, piece_.kind)
                let targetingPieces: pieceOnBoard[] = []
                for (let p of candidates) {
                    if (this.board.validateMove(p, target).isValid) {
                        if ((typeof sourceColIdx !== 'undefined' && p.field.fileIdx == sourceColIdx) ||
                            (typeof sourceRowIdx !== 'undefined' && p.field.rankIdx == sourceRowIdx) ||
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
                switch (this._gameStatus.nextMoveBy) {
                    case color.black:
                        field = target.shift(offsetsEnum.N) as Field
                        if (this.board.isFieldOnBoard(field)) {
                            p = this.board.peekFieldPieceOB(field)
                            if (p.piece.kind == pieceKind.Pawn) candidatesP.push(p)
                            else if (target.rankIdx == 3 && p.piece.kind == pieceKind.none) {
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
                                if ((typeof sourceColIdx !== 'undefined' && p.field.fileIdx == sourceColIdx) || (typeof sourceColIdx == 'undefined'))
                                    candidatesP.push(p)
                        }
                        field = target.shift(offsetsEnum.NE) as Field
                        if (this.board.isFieldOnBoard(field)) {
                            p = this.board.peekFieldPieceOB(field)
                            if (p.piece.kind == pieceKind.Pawn)
                                if ((typeof sourceColIdx !== 'undefined' && p.field.fileIdx == sourceColIdx) || (typeof sourceColIdx == 'undefined'))
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
                            else if (target.rankIdx == 4 && p.piece.kind == pieceKind.none) {
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
                                if ((typeof sourceColIdx !== 'undefined' && p.field.fileIdx == sourceColIdx) || (typeof sourceColIdx == 'undefined'))
                                    candidatesP.push(p)
                        }
                        field = target.shift(offsetsEnum.SE) as Field
                        if (this.board.isFieldOnBoard(field)) {
                            p = this.board.peekFieldPieceOB(field)
                            if (p.piece.kind == pieceKind.Pawn)
                                if ((typeof sourceColIdx !== 'undefined' && p.field.fileIdx == sourceColIdx) || (typeof sourceColIdx == 'undefined'))
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
}