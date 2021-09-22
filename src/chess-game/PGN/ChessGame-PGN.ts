import { ChessGame } from "../ChessGame"
import { castleType } from "../common/CastleFlags"
import { color } from "../common/chess-color"
import { gameHeaderDateType } from "../common/GameData"
import { GameResult } from "../common/GameResult"
import { ChessMoveEvaluation, ChessPositionalEvaluation } from "../common/MoveOnBoard"

//TODO use FEN as start position
//TODO allow to parse PGN,

// Implementaton based on http://www.saremba.de/chessgml/standards/pgn/pgn-complete.htm

type PgnTimeControlPeriod = {
    Unknown?: boolean //= "?",
    none?: boolean //= "-",
    //Formated: 40/9000 : 40 Moves in 2 1/5 hours
    numberOfMovesInPeriod?: number // '/'
    durationOfPeriod?: number // in seconds
    //Formated: 300 : sudden death (always the final Period tag)
    suddenDeath?: number // in seconds
    //Formated: 4500+60 : incremental (always the last tag)
    //durationOfPeriod
    incrementPerMove?: number // in seconds
    //Formated: *180 :Sandclock (always the last tag)
    sandclockPeriod?: number // in seconds
}
type PgnTimeControl = {
    periods: PgnTimeControlPeriod[] // ':' separted in tag
}
class PgnDate {
    year?: number
    month?: number
    day?: number
    set(value: string) {
        let values = value.split('.')
        if (values.length != 3) throw new PgnError('invalid Date')
        if (values[0] != '????') {
            let year = +values[0]
            if (year == NaN || year < 1500) throw new PgnError('invalid Date-Year')
            this.year = year
        }
        if (values[1] != '??') {
            let month = +value[1]
            if (month == NaN || month < 1 || month > 12) throw new PgnError('invalid Date-Month')
            this.month = month
        }
        if (values[2] != '??') {
            let day = +values[2]
            if (day == NaN || day < 1 || day > 31) throw new PgnError('invalid Date-Day')
            this.day = day
        }
    }
    get(): string {
        return (this.year ? this.year : '????') + '.' + (this.month ? this.month : '??') + '.' + (this.day ? this.day : '??')
    }
}
class PgnResult {
    static readonly WhiteWins = "1-0"
    static readonly BlackWins = "0-1"
    static readonly Draw = "1/2-1/2"
    static readonly Unknown = "*"
    private _result: string
    constructor() {
        this._result = PgnResult.Unknown
    }
    set result(value: string) {
        let r = PgnResult.checkResult(value)
        if (!r) throw new PgnError('invalid result value:' + value)
        this._result = r
    }
    get result() {
        return this._result
    }
    static checkResult(value: string): string | undefined {
        switch (value) {
            case PgnResult.WhiteWins:
            case PgnResult.BlackWins:
            case PgnResult.Draw:
            case PgnResult.Unknown:
                return value
            default:
                return undefined
        }
    }
}
class PgnMoveElement {
    moveNumber?: number
    move: string
    annotation: string[]
    comment: string[]
    variation: PgnMoveElement[]
    constructor(move: string) {
        this.move = move
        this.comment = []
        this.annotation = []
        this.variation = []
    }
}
class PgnTags {
    Event: string
    Site: string
    Date: PgnDate
    Round: string
    White: string
    Black: string
    Result: PgnResult

    WhiteTitle?: string
    BlackTitle?: string
    WhiteElo?: string
    BlackElo?: string
    WhiteUSCF?: string
    BlackUSCF?: string
    WhiteNA?: string
    BlackNA?: string
    WhiteType?: string
    BlackType?: string

    EventData?: string
    EventSponsor?: string
    Section?: string
    Stage?: string
    Board?: string

    Opening?: string
    Variation?: string
    SubVariation?: string
    ECO?: string
    NIC?: string

    Time?: string
    UTCTime?: string
    UTCDate?: string

    TimeControl?: PgnTimeControl
    SetUp?: number
    FEN?: string
    Termination?: string

    Annotator?: string
    Mode?: string
    PlyCount?: string

    constructor() {
        this.Event = '?'
        this.Site = '?'
        this.Date = new PgnDate()
        this.Round = '?'
        this.White = '?'
        this.Black = '?'
        this.Result = new PgnResult()
    }
    addTag(name: string, value: string) {
        switch (name) {
            case 'Event': this.Event = value
                break
            case 'Site': this.Site = value
                break
            case 'Date': this.Date.set(value)
                break
            case 'Round': this.Round = value
                break
            case 'White': this.White = value
                break
            case 'Black': this.Black = value
                break
            case 'Result': this.Result.result = value
                break
            case 'WhiteTitle': this.WhiteTitle = value
                break
            case 'BlackTitle': this.BlackTitle = value
                break
            case 'WhiteElo': this.WhiteElo = value
                break
            case 'BlackElo': this.BlackElo = value
                break
            case 'WhiteUSCF': this.WhiteUSCF = value
                break
            case 'BlackUSCF': this.BlackUSCF = value
                break
            case 'WhiteType': this.WhiteType = value
                break
            case 'BlackType': this.BlackType = value
                break

            case 'EventData': this.EventData = value
                break
            case 'EventSponsor': this.EventSponsor = value
                break
            case 'Section': this.Section = value
                break
            case 'Stage': this.Stage = value
                break
            case 'Board': this.Board = value
                break

            case 'Opening': this.Opening = value
                break
            case 'Variation': this.Variation = value
                break
            case 'SubVariation': this.SubVariation = value
                break
            case 'ECO': this.ECO = value
                break
            case 'NIC': this.NIC = value
                break

            case 'TimeControl': //TODO this.TimeControl = value
                break
            case 'SetUp':
                if (+value == NaN) throw new PgnError('Tag SetUP invalid value')
                this.SetUp = +value
                break
            case 'FEN': this.FEN = value
                break
            case 'Termination': this.Termination = value
                break

            case 'Annotator': this.Annotator = value
                break
            case 'Mode': this.Mode = value
                break
            case 'PlyCount': this.PlyCount = value
                break
        }
    }
}
class PgnGame {
    header: PgnTags
    moves: PgnMoveElement[]
    constructor() {
        this.header = new PgnTags()
        this.moves = []
    }
}
class PgnDatabase {
    game: PgnGame[]
    constructor() {
        this.game = []
    }
}
class PgnError extends Error {
    constructor(message: any) {
        super(message)
        this.name = "PgnError"
    }
}

type pgnParseData = {
    db: PgnDatabase
    game?: PgnGame
    isParsingTags: boolean
    currentMove?: PgnMoveElement
    parsingMultiLineComment: boolean
    variantTargetMoves: PgnMoveElement[]
    currentVariant?: PgnMoveElement
}

export class Pgn {
    static readonly ESCAPE = '%'
    static readonly UNKNOWN = '?'
    static readonly PGN_MAX_LINELEN = 79

    static load(pgnData: string[]): PgnDatabase {
        // convert a given array of pgnData (like from a file) to a representation of pgn
        // TODO this could be turned into a version to handle data from a stream
        let parseData: pgnParseData = {
            db: new PgnDatabase(),
            game: undefined,
            isParsingTags: true,
            currentMove: undefined,
            parsingMultiLineComment: false,
            variantTargetMoves: [],
            currentVariant: undefined
        }
        for (let line of pgnData) {
            if (line.length == 0) continue
            if (line[0] == this.ESCAPE) continue
            if (parseData.isParsingTags) {
                // importing PGN is a bit relaxed, allowing whitespaces and multiple tags in a line
                // but I didn't implement allowing to spread a tag over multiple lines
                if (!parseData.game) parseData.game = new PgnGame()
                const headerMatches = Array.from(line.matchAll(/\[\s*(\w*)\s*\"(.*?)\"\s*\]/g))
                for (const m of headerMatches) {
                    parseData.game.header.addTag(m[1], m[2])
                }
                if (headerMatches.length == 0) {
                    parseData.isParsingTags = false
                }
            }
            if (!parseData.isParsingTags) { // parsing moves
                if (parseData.parsingMultiLineComment) {
                    const commentFinish = line.match(/(?<commentEnd>^.*?)\}(?<restBlock>.*$)/)
                    if (commentFinish?.groups) {
                        if (commentFinish.groups.commentEnd) {
                            if (commentFinish.groups.commentEnd.includes('{')) {
                                throw new PgnError('nested comments')
                            }
                            console.log('add comment (end)', commentFinish.groups.commentEnd)
                            parseData.currentMove?.comment.push(commentFinish.groups.commentEnd)
                            parseData.parsingMultiLineComment = false
                            line = commentFinish.groups.restBlock // Parse rest of the line
                        }
                        else {
                            console.log('full line comment')
                        }
                    }
                }
                if (!parseData.parsingMultiLineComment) {
                    const commentSplit = Array.from(line.matchAll(/(?<seq>.*?)\{(?<comment>.*?)\}|(?<seq2>.*?)\{(?<commentStart>.*$)|(?<rest>.*$)/g))
                    for (const block of commentSplit) {
                        if (block.groups) {
                            if (block.groups.comment) {
                                if (block.groups.seq) {
                                    console.log('parse seq:', block.groups.seq)
                                    this.parseMoveSequence(block.groups.seq, parseData)
                                }
                                parseData.currentMove?.comment.push(block.groups.comment)
                                console.log('add comment', block.groups.comment)

                            }
                            if (block.groups.commentStart) {
                                if (block.groups.seq2) {
                                    console.log('parse seq:', block.groups.seq2)
                                    this.parseMoveSequence(block.groups.seq2, parseData)
                                }
                                parseData.currentMove?.comment.push(block.groups.commentStart)
                                console.log('add comment(Start)', block.groups.commentStart)
                                parseData.parsingMultiLineComment = true
                            }
                            if (block.groups.rest) {
                                console.log('parse rest:', block.groups.rest)
                                this.parseMoveSequence(block.groups.rest, parseData)
                            }
                        }
                    }
                }
            }
        }
        // TODO validate moves on board
        return parseData.db
    }
    private static parseMoveSequence(lineSegment: string, parseData: pgnParseData) {
        const moveTokens = lineSegment.split(/\s/)
        console.log('tokens', moveTokens)
        for (const token of moveTokens) {
            if (token == '') continue
            //PgnMoveElement
            let gameResult = PgnResult.checkResult(token) // game terminator 
            if (gameResult) {
                //if (parseData.currentMove) parseData.game!.moves.push(parseData.currentMove)
                if (parseData.currentVariant) throw new PgnError('game terminated in variant')
                this.pushCurrentMove(parseData)
                parseData.game!.header.Result.result = gameResult
                parseData.db.game.push(parseData.game!)
                parseData.game = undefined
                parseData.isParsingTags = true
                parseData.currentMove = undefined
            }
            else if (this.isAnnotation(token)) {
                parseData.currentMove!.annotation.push(token)
            }
            else if (token == '(') { // variant begins
                if (!parseData.currentMove) throw new PgnError('variant without move')
                this.pushCurrentMove(parseData)
                parseData.variantTargetMoves.push(parseData.currentMove)
                parseData.currentVariant = parseData.currentMove
                parseData.currentMove = undefined
                console.log('start variant')
            }
            else if (token == ')') { // variant ends
                console.log('finish variant')
                let tmp = parseData.variantTargetMoves.pop()
                if (!tmp) throw new PgnError('variant closing mismatch')
                if (parseData.variantTargetMoves.length == 0)
                    parseData.currentVariant = undefined
                else {
                    parseData.currentVariant = parseData.variantTargetMoves[parseData.variantTargetMoves.length - 1]
                }
            }
            else {
                //if (parseData.currentMove) parseData.game!.moves.push(parseData.currentMove)
                this.pushCurrentMove(parseData)
                let numSplit = token.match(/^((?<number>\d{1,})\.{1,3})?(?<move>.*)/)
                if (numSplit?.groups) {
                    if (numSplit?.groups.move) {
                        if (!this.checkMove(numSplit.groups.move)) {
                            throw new PgnError('invalid move:' + numSplit.groups.move)
                        }
                        parseData.currentMove = new PgnMoveElement(numSplit.groups.move)
                    }
                    if (numSplit?.groups.number) { // <number>.<move>
                        parseData.currentMove!.moveNumber = +numSplit.groups.number
                    }
                }
                else
                    throw new PgnError('invalid move token:' + token)
            }
        }
    }
    private static pushCurrentMove(parseData: pgnParseData) {
        if (parseData.currentMove) {
            if (parseData.currentVariant) {
                console.log('push to variant', parseData.currentMove)
                parseData.currentVariant.variation.push(parseData.currentMove)
            }
            else {
                parseData.game!.moves.push(parseData.currentMove)
            }
        }
    }
    static checkMove(move: string): boolean {
        // syntactical validation of a move string
        return move.match(/^(\d{1,}.{1,3})?(O(-O){1,2}|[RNBQK]?[a-h]?[1-8]?[x]?[a-h][1-8](\=[RNBQ])?)[+#]?]?]?[!\?]?[!\?]?$/) != null
    }
    static isAnnotation(annotation: string): boolean {
        return annotation.match(/(\$\d{2})|[=⩲⩱±∓∞]|(\+-)|(-\+)/) != null
    }

    static generate(game: ChessGame, options?: { noComments?: boolean, useNAG?: boolean }): string[] {
        // generate a PGN string array from given ChessGame (which contains just on line of moves)
        let gamePGN: string[] = []
        let _options = options || { noComments: false, useNAG: false }
        let noComments = _options.noComments || false
        let useNAG = _options.useNAG || false

        // STR - Seven Tag Roster
        gamePGN.push(`[Event "${this.prepareHeaderString(game.gameHeaderData.event)}"]`)
        gamePGN.push(`[Site "${this.prepareHeaderString(game.gameHeaderData.site)}"]`)
        gamePGN.push(`[Date "${this.prepareHeaderDate(game.gameHeaderData.date)}"]`)
        gamePGN.push(`[Round "${this.prepareHeaderString(game.gameHeaderData.round)}"]`)
        gamePGN.push(`[White "${this.prepareHeaderString(game.gameHeaderData.whitePlayer)}"]`)
        gamePGN.push(`[Black "${this.prepareHeaderString(game.gameHeaderData.blackPlayer)}"]`)
        gamePGN.push(`[Result "${this.mapGameResult(game.gameHeaderData.result)}"]`)
        gamePGN.push("");

        // move section
        let isFirstMoveOrAfterComment = true
        let lineStr = ''
        let moveNumber = game.chessBoard.gameStatus.firstMoveNumber
        for (let move of game.chessBoard.moves) {
            let moveToken = ''
            if (move.color == color.white) {
                moveToken += moveNumber + '. '
                moveNumber++
            }
            else if (isFirstMoveOrAfterComment && move.color == color.black)
                moveToken += moveNumber + '... '
            isFirstMoveOrAfterComment = false

            if (move.isCastle) {
                switch (move.castleType) {
                    case castleType.short:
                        moveToken += 'O-O'
                        break
                    case castleType.long:
                        moveToken += 'O-O-O'
                }
            }
            else {
                moveToken += move.notation
            }
            if (move.isMate)
                moveToken += '#'
            else if (move.isCheck)
                moveToken += '+'

            // evaluations (optional NAG format)
            if (move.moveEvaluation)
                moveToken += useNAG ? ' ' + this.moveEvalNAG(move.moveEvaluation) : move.moveEvaluation
            if (move.positionalEvaluation)
                moveToken += ' ' + (useNAG ? ' ' + this.positionalEvalNAG(move.positionalEvaluation) : move.positionalEvaluation);
            if (move.isNovelty)
                moveToken += ' N'

            // handle comments
            if (!noComments && move.comment) {
                moveToken += ' { ' + move.comment + ' }';
                isFirstMoveOrAfterComment = true
            }

            if (lineStr.length + moveToken.length <= this.PGN_MAX_LINELEN) {
                lineStr += ((lineStr.length > 0) ? ' ' : '') + moveToken
            }
            else {
                // comments can be very long, split them to lines of maxlength at the last space char
                // there are surely better (more principled) ways to handle this. 
                // but I'm relativly new to TS&JS so I'm using a stright forward one.
                // Looking for simplification later.
                gamePGN.push(lineStr);
                while (moveToken.length > this.PGN_MAX_LINELEN) {
                    for (var i = this.PGN_MAX_LINELEN; i >= 0; i--) {
                        if (moveToken[i] == ' ') {
                            break;
                        }
                    }
                    if (i == 0) {
                        lineStr = moveToken.substring(0, this.PGN_MAX_LINELEN); // no spaces found, cut hard
                        gamePGN.push(lineStr);
                        moveToken = moveToken.substring(this.PGN_MAX_LINELEN);
                    }
                    else {
                        lineStr = moveToken.substring(0, i)
                        gamePGN.push(lineStr)
                        moveToken = moveToken.substring(i + 1)
                    }
                }
                lineStr = moveToken
            }
        }
        // add result token at the end
        let resultStr = this.mapGameResult(game.gameHeaderData.result)
        if (lineStr.length + resultStr.length <= this.PGN_MAX_LINELEN) {
            lineStr += ' ' + resultStr
            lineStr = lineStr.trimStart()
        }
        else {
            gamePGN.push(lineStr)
            lineStr = resultStr
        }

        if (lineStr.length > 0) {
            gamePGN.push(lineStr)
        }

        return gamePGN
    }
    private static prepareHeaderString(str: string) {
        // TODO remove special char ], tab, etc, trunc length?
        return str == '' ? '?' : str
    }
    private static prepareHeaderDate(date: gameHeaderDateType) {
        let year = ((date.year <= 0 || date.year > 9999) ? '????' : '' + date.year)
        let month = ((date.month < 1 || date.month > 32) ? '??' : '' + date.month)
        let day = ((date.day < 1 || date.day > 32) ? '??' : '' + date.day)
        return year + '.' + month + '.' + day
    }
    private static mapGameResult(res: GameResult): string {
        switch (res) {
            case GameResult.black_wins: return PgnResult.BlackWins
            case GameResult.white_wins: return PgnResult.WhiteWins
            case GameResult.draw: return PgnResult.Draw
            case GameResult.none: return PgnResult.Unknown
        }
    }

    private static moveEvalNAG(evaluation: string): string {
        let result = ''
        let m = mapMoveEvaluation2NAG.find(e => e.eval == evaluation)
        if (m)
            result = m.nag
        return result
    }
    private static positionalEvalNAG(evaluation: string): string {
        let result = ''
        let m = mapPositionalEvaluation2NAG.find(e => e.eval == evaluation)
        if (m)
            result = m.nag
        return result
    }

}

export const enum PgnNAG { // $0, $16,..
    null_annotation = "$0",
    good_move = "$1",           // (traditional "!")
    poor_move = "$2",           // (traditional "?")
    very_good_move = "$3",      // (traditional "!!")
    very_poor_move = "$4",      // (traditional "??")
    speculative_move = "$5",    // (traditional "!?")
    questionable_move = "$6",   // (traditional "?!")
    forced_move = "$7",         // (all others lose quickly)
    singular_move = "$8",       // (no reasonable alternatives)
    worst_move = "$9",
    drawish_position = "$10",
    equal_chances_quiet_position = "$11",
    equal_chances_active_position = "$12",
    unclear_position = "$13",
    White_has_a_slight_advantage = "$14",
    Black_has_a_slight_advantage = "$15",
    White_has_a_moderate_advantage = "$16",
    Black_has_a_moderate_advantage = "$17",
    White_has_a_decisive_advantage = "$18",
    Black_has_a_decisive_advantage = "$19",
    White_has_a_crushing_advantage = "$20", // (Black should resign)
    Black_has_a_crushing_advantage = "$", // (White should resign)
    White_is_in_zugzwang = "$22",
    Black_is_in_zugzwang = "$23",
    White_has_a_slight_space_advantage = "$24",
    Black_has_a_slight_space_advantage = "$25",
    White_has_a_moderate_space_advantage = "$26",
    Black_has_a_moderate_space_advantage = "$27",
    White_has_a_decisive_space_advantage = "$28",
    Black_has_a_decisive_space_advantage = "$29",
    White_has_a_slight_time_development_advantage = "$30",
    Black_has_a_slight_time_development_advantage = "$31",
    White_has_a_moderate_time_development_advantage = "$32",
    Black_has_a_moderate_time_development_advantage = "$33",
    White_has_a_decisive_time_development_advantage = "$34",
    Black_has_a_decisive_time_development_advantage = "$35",
    White_has_the_initiative = "$36",
    Black_has_the_initiative = "$37",
    White_has_a_lasting_initiative = "$38",
    Black_has_a_lasting_initiative = "$39",
    White_has_the_attack = "$40",
    Black_has_the_attack = "$41",
    White_has_insufficient_compensation_for_material_deficit = "$42",
    Black_has_insufficient_compensation_for_material_deficit = "$43",
    White_has_sufficient_compensation_for_material_deficit = "$44",
    Black_has_sufficient_compensation_for_material_deficit = "$45",
    White_has_more_than_adequate_compensation_for_material_deficit = "$46",
    Black_has_more_than_adequate_compensation_for_material_deficit = "$47",
    White_has_a_slight_center_control_advantage = "$48",
    Black_has_a_slight_center_control_advantage = "$49",
    White_has_a_moderate_center_control_advantage = "$50",
    Black_has_a_moderate_center_control_advantage = "$51",
    White_has_a_decisive_center_control_advantage = "$52",
    Black_has_a_decisive_center_control_advantage = "$53",
    White_has_a_slight_kingside_control_advantage = "$54",
    Black_has_a_slight_kingside_control_advantage = "$55",
    White_has_a_moderate_kingside_control_advantage = "$56",
    Black_has_a_moderate_kingside_control_advantage = "$57",
    White_has_a_decisive_kingside_control_advantage = "$58",
    Black_has_a_decisive_kingside_control_advantage = "$59",
    White_has_a_slight_queenside_control_advantage = "$60",
    Black_has_a_slight_queenside_control_advantage = "$61",
    White_has_a_moderate_queenside_control_advantage = "$62",
    Black_has_a_moderate_queenside_control_advantage = "$63",
    White_has_a_decisive_queenside_control_advantage = "$64",
    Black_has_a_decisive_queenside_control_advantage = "$65",
    White_has_a_vulnerable_first_rank = "$66",
    Black_has_a_vulnerable_first_rank = "$67",
    White_has_a_well_protected_first_rank = "$68",
    Black_has_a_well_protected_first_rank = "$69",
    White_has_a_poorly_protected_king = "$70",
    Black_has_a_poorly_protected_king = "$71",
    White_has_a_well_protected_king = "$72",
    Black_has_a_well_protected_king = "$73",
    White_has_a_poorly_placed_king = "$74",
    Black_has_a_poorly_placed_king = "$75",
    White_has_a_well_placed_king = "$76",
    Black_has_a_well_placed_king = "$77",
    White_has_a_very_weak_pawn_structure = "$78",
    Black_has_a_very_weak_pawn_structure = "$79",
    White_has_a_moderately_weak_pawn_structure = "$80",
    Black_has_a_moderately_weak_pawn_structure = "$81",
    White_has_a_moderately_strong_pawn_structure = "$82",
    Black_has_a_moderately_strong_pawn_structure = "$83",
    White_has_a_very_strong_pawn_structure = "$84",
    Black_has_a_very_strong_pawn_structure = "$85",
    White_has_poor_knight_placement = "$86",
    Black_has_poor_knight_placement = "$87",
    White_has_good_knight_placement = "$88",
    Black_has_good_knight_placement = "$89",
    White_has_poor_bishop_placement = "$90",
    Black_has_poor_bishop_placement = "$91",
    White_has_good_bishop_placement = "$92",
    Black_has_good_bishop_placement = "$93",
    White_has_poor_rook_placement = "$94",
    Black_has_poor_rook_placement = "$95",
    White_has_good_rook_placement = "$96",
    Black_has_good_rook_placement = "$97",
    White_has_poor_queen_placement = "$98",
    Black_has_poor_queen_placement = "$99",
    White_has_good_queen_placement = "$100",
    Black_has_good_queen_placement = "$101",
    White_has_poor_piece_coordination = "$102",
    Black_has_poor_piece_coordination = "$103",
    White_has_good_piece_coordination = "$104",
    Black_has_good_piece_coordination = "$105",
    White_has_played_the_opening_very_poorly = "$106",
    Black_has_played_the_opening_very_poorly = "$107",
    White_has_played_the_opening_poorly = "$108",
    Black_has_played_the_opening_poorly = "$109",
    White_has_played_the_opening_well = "$110",
    Black_has_played_the_opening_well = "$111",
    White_has_played_the_opening_very_well = "$112",
    Black_has_played_the_opening_very_well = "$113",
    White_has_played_the_middlegame_very_poorly = "$114",
    Black_has_played_the_middlegame_very_poorly = "$115",
    White_has_played_the_middlegame_poorly = "$116",
    Black_has_played_the_middlegame_poorly = "$117",
    White_has_played_the_middlegame_well = "$118",
    Black_has_played_the_middlegame_well = "$119",
    White_has_played_the_middlegame_very_well = "$120",
    Black_has_played_the_middlegame_very_well = "$121",
    White_has_played_the_ending_very_poorly = "$122",
    Black_has_played_the_ending_very_poorly = "$123",
    White_has_played_the_ending_poorly = "$124",
    Black_has_played_the_ending_poorly = "$125",
    White_has_played_the_ending_well = "$126",
    Black_has_played_the_ending_well = "$127",
    White_has_played_the_ending_very_well = "$128",
    Black_has_played_the_ending_very_well = "$129",
    White_has_slight_counterplay = "$130",
    Black_has_slight_counterplay = "$131",
    White_has_moderate_counterplay = "$132",
    Black_has_moderate_counterplay = "$133",
    White_has_decisive_counterplay = "$134",
    Black_has_decisive_counterplay = "$135",
    White_has_moderate_time_control_pressure = "$136",
    Black_has_moderate_time_control_pressure = "$137",
    White_has_severe_time_control_pressure = "$138",
    Black_has_severe_time_control_pressure = "$139",
}

export const mapMoveEvaluation2NAG: { eval: ChessMoveEvaluation, nag: PgnNAG }[] = [
    { eval: ChessMoveEvaluation.blunder, nag: PgnNAG.very_poor_move },
    { eval: ChessMoveEvaluation.mistake, nag: PgnNAG.poor_move },
    { eval: ChessMoveEvaluation.dubious, nag: PgnNAG.questionable_move },
    { eval: ChessMoveEvaluation.interesting, nag: PgnNAG.speculative_move },
    { eval: ChessMoveEvaluation.good, nag: PgnNAG.good_move },
    { eval: ChessMoveEvaluation.brilliant, nag: PgnNAG.very_good_move },
]

export const mapPositionalEvaluation2NAG: { eval: ChessPositionalEvaluation, nag: PgnNAG }[] = [
    { eval: ChessPositionalEvaluation.equal, nag: PgnNAG.drawish_position },
    { eval: ChessPositionalEvaluation.slightAdvantageWhite, nag: PgnNAG.White_has_a_slight_advantage },
    { eval: ChessPositionalEvaluation.slightAdvantageBlack, nag: PgnNAG.Black_has_a_slight_advantage },
    { eval: ChessPositionalEvaluation.clearAdvantageWhite, nag: PgnNAG.White_has_a_moderate_advantage },
    { eval: ChessPositionalEvaluation.clearAdvantageBlack, nag: PgnNAG.Black_has_a_moderate_advantage },
    { eval: ChessPositionalEvaluation.decisiveAdvantageWhite, nag: PgnNAG.White_has_a_decisive_advantage },
    { eval: ChessPositionalEvaluation.decisiveAdvantageBlack, nag: PgnNAG.Black_has_a_decisive_advantage },
    { eval: ChessPositionalEvaluation.unclear, nag: PgnNAG.unclear_position },
]
