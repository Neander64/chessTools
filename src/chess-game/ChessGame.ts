import { ChessBoard } from './chess-board/ChessBoard'
import { GameHeaderData } from './common/GameData'
import { ChessGamePgn } from './PGN/ChessGame-PGN'

export class ChessGame {
    gameHeaderData: GameHeaderData
    chessBoard: ChessBoard
    optionsPGN: { noComments?: boolean, useNAG?: boolean } = { noComments: false, useNAG: false }

    constructor() {
        this.gameHeaderData = new GameHeaderData()
        this.chessBoard = new ChessBoard()
    }

    startPosition() {
        this.gameHeaderData.clear()
        this.chessBoard.startPosition()
    }

    get PGN(): string[] {
        return ChessGamePgn.generate(this, this.optionsPGN)
    }
}