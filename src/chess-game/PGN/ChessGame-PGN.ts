import { ChessGame } from "../ChessGame"
import { castleType } from "../common/CastleFlags"
import { color, otherColor } from "../common/chess-color"
import { gameHeaderDateType } from "../common/GameData"
import { GameResult } from "../common/GameResult"
import { ChessMoveEvaluation, ChessPositionalEvaluation } from "../common/MoveOnBoard"
import { Fen } from "../FEN/Fen"
import { Pgn } from "./Pgn"
import { PgnResult } from "./PgnResult"


export class ChessGamePgn {

    static generate(game: ChessGame, options?: { noComments?: boolean, useNAG?: boolean }): string[] {
        // generate a PGN string array from given ChessGame (which contains just on line of moves)
        // TODO seperate from this PGN only class
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
        gamePGN.push('');

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
                moveToken += ' ' + (useNAG ? ' ' + this.positionalEvalNAG(move.positionalEvaluation, move.color) : move.positionalEvaluation);
            if (move.isNovelty)
                moveToken += ' N'

            // handle comments
            if (!noComments && move.comment) {
                moveToken += ' { ' + move.comment + ' }'
                isFirstMoveOrAfterComment = true
            }

            if (lineStr.length + moveToken.length <= Pgn.PGN_MAX_LINELEN) {
                lineStr += ((lineStr.length > 0) ? ' ' : '') + moveToken
            }
            else {
                // comments can be very long, split them to lines of maxlength at the last space char
                // there are surely better (more principled) ways to handle this. 
                // but I'm relativly new to TS&JS so I'm using a stright forward one.
                // Looking for simplification later.
                gamePGN.push(lineStr)
                while (moveToken.length > Pgn.PGN_MAX_LINELEN) {
                    for (var i = Pgn.PGN_MAX_LINELEN; i >= 0; i--) {
                        if (moveToken[i] == ' ') break
                    }
                    if (i == 0) {
                        lineStr = moveToken.substring(0, Pgn.PGN_MAX_LINELEN) // no spaces found, cut hard
                        gamePGN.push(lineStr)
                        moveToken = moveToken.substring(Pgn.PGN_MAX_LINELEN)
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
        if (lineStr.length + resultStr.length + 1 <= Pgn.PGN_MAX_LINELEN) {
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
    private static positionalEvalNAG(evaluation: string, activeColor: color): string {
        let result = ''
        let m = mapPositionalEvaluation2NAG.find(e => e.eval == evaluation && (!e.activeColor || e.activeColor == activeColor))
        if (m)
            result = m.nag
        return result
    }

}

export const enum PgnNAG {
    null_annotation = "$0",
    good_move = "$1",                           // !
    poor_move = "$2",                           // ?
    very_good_move = "$3",                      // !!
    very_poor_move = "$4",                      // ??
    speculative_move = "$5",                    // !?
    questionable_move = "$6",                   // ?!
    forced_move = "$7",                         // □        []
    singular_move = "$8",                       // 
    worst_move = "$9",                          //
    drawish_position = "$10",                   // =
    equal_chances_quiet_position = "$11",       //
    equal_chances_active_position = "$12",      //
    unclear_position = "$13",                   // ∞        ~~
    White_has_a_slight_advantage = "$14",       // ⩲        +/=
    Black_has_a_slight_advantage = "$15",       // ⩱        =/+
    White_has_a_moderate_advantage = "$16",     // ±        +/-
    Black_has_a_moderate_advantage = "$17",     // ∓        -/+
    White_has_a_decisive_advantage = "$18",     // +−
    Black_has_a_decisive_advantage = "$19",     // −+
    White_has_a_crushing_advantage = "$20",     // (Black should resign)
    Black_has_a_crushing_advantage = "$",       // (White should resign)
    White_is_in_zugzwang = "$22",               // ⨀        (.)
    Black_is_in_zugzwang = "$23",               // ⨀        (.)
    White_has_a_slight_space_advantage = "$24",
    Black_has_a_slight_space_advantage = "$25",
    White_has_a_moderate_space_advantage = "$26",               // ○
    Black_has_a_moderate_space_advantage = "$27",               // ○
    White_has_a_decisive_space_advantage = "$28",
    Black_has_a_decisive_space_advantage = "$29",
    White_has_a_slight_time_development_advantage = "$30",
    Black_has_a_slight_time_development_advantage = "$31",
    White_has_a_moderate_time_development_advantage = "$32",    // ⟳            @
    Black_has_a_moderate_time_development_advantage = "$33",    // ⟳
    White_has_a_decisive_time_development_advantage = "$34",
    Black_has_a_decisive_time_development_advantage = "$35",
    White_has_the_initiative = "$36",                           // ↑            |^
    Black_has_the_initiative = "$37",                           // ↑
    White_has_a_lasting_initiative = "$38",
    Black_has_a_lasting_initiative = "$39",
    White_has_the_attack = "$40",                               // →            ->
    Black_has_the_attack = "$41",                               // →
    White_has_insufficient_compensation_for_material_deficit = "$42",
    Black_has_insufficient_compensation_for_material_deficit = "$43",
    White_has_sufficient_compensation_for_material_deficit = "$44",             // ~/=
    Black_has_sufficient_compensation_for_material_deficit = "$45",             // 
    White_has_more_than_adequate_compensation_for_material_deficit = "$46",     // =/∞
    Black_has_more_than_adequate_compensation_for_material_deficit = "$47",     //
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
    White_has_moderate_counterplay = "$132",                        // ⇆        <=>
    Black_has_moderate_counterplay = "$133",                        // ⇆
    White_has_decisive_counterplay = "$134",
    Black_has_decisive_counterplay = "$135",
    White_has_moderate_time_control_pressure = "$136",
    Black_has_moderate_time_control_pressure = "$137",
    White_has_severe_time_control_pressure = "$138",                // ⨁        (+)
    Black_has_severe_time_control_pressure = "$139",                // ⨁
    With_the_idea = "$140", //     ∆   /\      With the idea...
    Aimed_against = "$141", //     ∇   \/      Aimed against...
    Better_is = "$142", //     ⌓   >=      Better is...
    Worse_is = "$143", //        <=      Worse is...
    Equivalent_is = "$144", //         ==      Equivalent is...
    Editorial_comment = "$145", //         RR      Editorial comment
    Novelty = "$146", //         N       Novelty
}

export const mapAnnotationToNAG: { annotation: string, activeColor?: color, nag: PgnNAG }[] = [
    { annotation: '□', nag: PgnNAG.forced_move },
    { annotation: '[]', nag: PgnNAG.forced_move },
    { annotation: '∞', nag: PgnNAG.unclear_position },
    { annotation: '~~', nag: PgnNAG.equal_chances_quiet_position },
    { annotation: '⩲', nag: PgnNAG.White_has_a_slight_advantage },
    { annotation: '+/=', nag: PgnNAG.White_has_a_slight_advantage },
    { annotation: '⩱', nag: PgnNAG.Black_has_a_slight_advantage },
    { annotation: '=/+', nag: PgnNAG.Black_has_a_slight_advantage },
    { annotation: '±', nag: PgnNAG.White_has_a_moderate_advantage },
    { annotation: '+/-', nag: PgnNAG.White_has_a_moderate_advantage },
    { annotation: '∓', nag: PgnNAG.Black_has_a_moderate_advantage },
    { annotation: '-/+', nag: PgnNAG.Black_has_a_moderate_advantage },
    { annotation: '+-', nag: PgnNAG.White_has_a_decisive_advantage },
    { annotation: '-+', nag: PgnNAG.Black_has_a_decisive_advantage },

    // use activeColor 
    { annotation: '⨀', activeColor: color.white, nag: PgnNAG.White_is_in_zugzwang },
    { annotation: '(.)', activeColor: color.white, nag: PgnNAG.White_is_in_zugzwang },
    { annotation: '⨀', activeColor: color.black, nag: PgnNAG.Black_is_in_zugzwang },
    { annotation: '(.)', activeColor: color.black, nag: PgnNAG.Black_is_in_zugzwang },
    { annotation: '○', activeColor: color.white, nag: PgnNAG.White_has_a_moderate_space_advantage },
    { annotation: '○', activeColor: color.black, nag: PgnNAG.Black_has_a_moderate_space_advantage },
    { annotation: '⟳', activeColor: color.white, nag: PgnNAG.White_has_a_moderate_time_development_advantage },
    { annotation: '@', activeColor: color.white, nag: PgnNAG.White_has_a_moderate_time_development_advantage },
    { annotation: '⟳', activeColor: color.black, nag: PgnNAG.Black_has_a_moderate_time_development_advantage },
    { annotation: '@', activeColor: color.black, nag: PgnNAG.Black_has_a_moderate_time_development_advantage },
    { annotation: '↑', activeColor: color.white, nag: PgnNAG.White_has_the_initiative },
    { annotation: '|^', activeColor: color.white, nag: PgnNAG.White_has_the_initiative },
    { annotation: '↑', activeColor: color.black, nag: PgnNAG.Black_has_the_initiative },
    { annotation: '|^', activeColor: color.black, nag: PgnNAG.Black_has_the_initiative },
    { annotation: '→', activeColor: color.white, nag: PgnNAG.White_has_the_attack },
    { annotation: '->', activeColor: color.white, nag: PgnNAG.White_has_the_attack },
    { annotation: '→', activeColor: color.black, nag: PgnNAG.Black_has_the_attack },
    { annotation: '->', activeColor: color.black, nag: PgnNAG.Black_has_the_attack },
    { annotation: '~/=', activeColor: color.white, nag: PgnNAG.White_has_sufficient_compensation_for_material_deficit },
    { annotation: '~/=', activeColor: color.black, nag: PgnNAG.Black_has_sufficient_compensation_for_material_deficit },
    { annotation: '=/∞', activeColor: color.white, nag: PgnNAG.White_has_more_than_adequate_compensation_for_material_deficit },
    { annotation: '=/∞', activeColor: color.black, nag: PgnNAG.Black_has_more_than_adequate_compensation_for_material_deficit },
    { annotation: '⇆', activeColor: color.white, nag: PgnNAG.White_has_moderate_counterplay },
    { annotation: '<=>', activeColor: color.white, nag: PgnNAG.White_has_moderate_counterplay },
    { annotation: '⇆', activeColor: color.black, nag: PgnNAG.Black_has_moderate_counterplay },
    { annotation: '<=>', activeColor: color.black, nag: PgnNAG.Black_has_moderate_counterplay },
    { annotation: '⨁', activeColor: color.white, nag: PgnNAG.White_has_severe_time_control_pressure },
    { annotation: '(+)', activeColor: color.white, nag: PgnNAG.White_has_severe_time_control_pressure },
    { annotation: '⨁', activeColor: color.black, nag: PgnNAG.Black_has_severe_time_control_pressure },
    { annotation: '(+)', activeColor: color.black, nag: PgnNAG.Black_has_severe_time_control_pressure },
    // special annotations by some PGN Software (none standard)
    { annotation: '∆', nag: PgnNAG.With_the_idea },
    { annotation: '/\\', nag: PgnNAG.With_the_idea },
    { annotation: '∇', nag: PgnNAG.Aimed_against },
    { annotation: '\\/', nag: PgnNAG.Aimed_against },
    { annotation: '⌓', nag: PgnNAG.Better_is },
    { annotation: '>=', nag: PgnNAG.Better_is },
    { annotation: '<=', nag: PgnNAG.Worse_is },
    { annotation: '==', nag: PgnNAG.Equivalent_is },
    { annotation: 'RR', nag: PgnNAG.Editorial_comment },
    { annotation: 'N', nag: PgnNAG.Novelty },

]


// Evaluations that are part of the move token
export const mapMoveEvaluation2NAG: { eval: ChessMoveEvaluation, nag: PgnNAG }[] = [
    { eval: ChessMoveEvaluation.blunder, nag: PgnNAG.very_poor_move },
    { eval: ChessMoveEvaluation.mistake, nag: PgnNAG.poor_move },
    { eval: ChessMoveEvaluation.dubious, nag: PgnNAG.questionable_move },
    { eval: ChessMoveEvaluation.interesting, nag: PgnNAG.speculative_move },
    { eval: ChessMoveEvaluation.good, nag: PgnNAG.good_move },
    { eval: ChessMoveEvaluation.brilliant, nag: PgnNAG.very_good_move },
]

// Evaluations that are seperated from move token
export const mapPositionalEvaluation2NAG: { eval: ChessPositionalEvaluation, activeColor?: color, nag: PgnNAG }[] = [
    { eval: ChessPositionalEvaluation.equal, nag: PgnNAG.equal_chances_quiet_position },
    { eval: ChessPositionalEvaluation.slightAdvantageWhite, nag: PgnNAG.White_has_a_slight_advantage },
    { eval: ChessPositionalEvaluation.slightAdvantageBlack, nag: PgnNAG.Black_has_a_slight_advantage },
    { eval: ChessPositionalEvaluation.clearAdvantageWhite, nag: PgnNAG.White_has_a_moderate_advantage },
    { eval: ChessPositionalEvaluation.clearAdvantageBlack, nag: PgnNAG.Black_has_a_moderate_advantage },
    { eval: ChessPositionalEvaluation.decisiveAdvantageWhite, nag: PgnNAG.White_has_a_decisive_advantage },
    { eval: ChessPositionalEvaluation.decisiveAdvantageBlack, nag: PgnNAG.Black_has_a_decisive_advantage },
    { eval: ChessPositionalEvaluation.unclear, nag: PgnNAG.unclear_position },
    // use activeColor 
    { eval: ChessPositionalEvaluation.counterPlay, activeColor: color.white, nag: PgnNAG.White_has_moderate_counterplay },
    { eval: ChessPositionalEvaluation.counterPlay, activeColor: color.black, nag: PgnNAG.Black_has_moderate_counterplay },
]
