import { CastleFlags } from "../common/CastleFlags"
import { color } from "../common/chess-color"
import { fieldNotationType, validateFieldNotation } from "../common/IField"
import { FenBoard } from "./FenBoard"
import { FenError } from "./FenError"

// TODO add a save from an abstract Board instance

export class Fen {
    static readonly initialBoardFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

    fenBoard: FenBoard = new FenBoard()
    activeColor: color = color.white
    castleFlags: CastleFlags = new CastleFlags()
    enPassantField?: fieldNotationType
    plyCount: number = NaN
    moveNumber: number = NaN

    // TODO allow call-back function

    constructor(fen?: string) {
        if (fen) this.load(fen)
    }
    isEnPassantPossible(): boolean {
        return typeof this.enPassantField !== 'undefined'
    }
    get canCastleShortWhite(): boolean { return this.castleFlags.canCastleShortWhite }
    get canCastleLongWhite(): boolean { return this.castleFlags.canCastleLongWhite }
    get canCastleShortBlack(): boolean { return this.castleFlags.canCastleShortBlack }
    get canCastleLongBlack(): boolean { return this.castleFlags.canCastleLongBlack }
    initialBoard() {
        this.load(Fen.initialBoardFEN)
        this.activeColor = color.white
        this.castleFlags.setAll(true)
        this.enPassantField = undefined
        this.plyCount = 0
        this.moveNumber = 1
    }
    load(fen: string): void {
        let fenTokens = fen.split(/\s+/)
        if (fenTokens.length !== 6) throw new FenError('unexpected number of FEN-token. Expected 6, got:' + fenTokens.length)

        //1. piece positions
        this.fenBoard.setBoard(fenTokens[0])

        //2. player to move next
        switch (fenTokens[1]) {
            case 'w': this.activeColor = color.white; break
            case 'b': this.activeColor = color.black; break
            default: throw new FenError('illegal player to move. should be "w" or "b", got:' + fenTokens[1])
        }

        //3. castle options
        if (fenTokens[2].length < 1 || fenTokens[2].length > 4) throw new FenError('castle option invalid. length:' + fenTokens[2].length)
        this.castleFlags.canCastleShortWhite = (fenTokens[2].indexOf('K') != -1)
        this.castleFlags.canCastleLongWhite = (fenTokens[2].indexOf('Q') != -1)
        this.castleFlags.canCastleShortBlack = (fenTokens[2].indexOf('k') != -1)
        this.castleFlags.canCastleLongBlack = (fenTokens[2].indexOf('q') != -1)
        if (this.castleFlags.hasNoCastleOption && fenTokens[2] != '-') throw new FenError('no castle option. Expected "-", got:' + fenTokens[2])

        //4. en passant
        if (fenTokens[3] !== '-') {
            if (!Fen.validateEnpassantField(fenTokens[3], this.activeColor)) throw new FenError('en passant unexpected format. got:' + fenTokens[3])
            this.enPassantField = fenTokens[3]
        }
        else this.enPassantField = undefined

        //5. number of half-moves since last capture or pawn move
        this.plyCount = +fenTokens[4]
        if (isNaN(this.plyCount) || this.plyCount < 0) throw new FenError('number of half-moves NAN, got:' + fenTokens[4])

        //6. next move number
        this.moveNumber = +fenTokens[5]
        if (isNaN(this.moveNumber) || this.moveNumber <= 0) throw new FenError('moveNumber invalid, got:' + fenTokens[5])
    }

    private static validateEnpassantField(field: string, activeColor: color): boolean {
        if (!validateFieldNotation(field)) return false
        if (field[1] != ((activeColor == color.white) ? '6' : '3')) return false
        return true
    }
}
