import { ChessGame } from "./chess-game";
import { ChessMoveEvaluation, ChessPositionalEvaluation } from "./common/moveOnBoard";

export const CASTLE_LONG = 'O-O-O';
export const CASTLE_SHORT = 'O-O';


export const enum ChessMoveColor {
    white = 'white',
    black = 'black',
}
export const enum ChessBoardPiece {
    Pawn = 'P',
    Rook = 'R',
    Knight = 'N',
    Bishop = 'B',
    Queen = 'Q',
    King = 'K',
}


export class pgn {
    static readonly ESCAPE = '%';
    static readonly UNKNOWN = '?';
    static readonly PGN_MAX_LINELEN = 79;

    private _game: ChessGame;

    constructor(g: ChessGame) {
        this._game = g;
    }

    set game(g: ChessGame) {
        this._game = g;
    }

    private moveEvalNAG(evaluation: string): string {
        let result = '';
        let m = mapMoveEvaluation2NAG.find(e => e.eval == evaluation);
        if (m)
            result = m.nag;
        return result;
    }
    private positionalEvalNAG(evaluation: string): string {
        let result = '';
        let m = mapPositionalEvaluation2NAG.find(e => e.eval == evaluation);
        if (m)
            result = m.nag;
        return result;
    }

    exportPGN(noComments = false, useNAG = false): string[] {
        let gamePGN: string[] = [];

        // STR - Seven Tag Roster
        let str = this._game.pgnSTR;
        gamePGN.push(`[Event "${str.event}"]`);
        gamePGN.push(`[Site "${str.site}"]`);
        gamePGN.push(`[Date "${str.date}"]`);
        gamePGN.push(`[Round "${str.round}"]`);
        gamePGN.push(`[White "${str.white}"]`);
        gamePGN.push(`[Black "${str.black}"]`);
        gamePGN.push(`[Result "${str.result}"]`);
        gamePGN.push("");

        // move section
        let isFirstMoveOrAfterComment = true;
        let lineStr = "";
        for (let move of this._game.moves) {
            let moveToken = "";
            if (move.color == ChessMoveColor.white)
                moveToken += move.moveNumber + ". ";
            else if (isFirstMoveOrAfterComment && move.color == ChessMoveColor.black)
                moveToken += move.moveNumber + "... ";
            isFirstMoveOrAfterComment = false;

            if (move.castleShort)
                moveToken += CASTLE_SHORT;
            else if (move.castleLong)
                moveToken += CASTLE_LONG;
            else {
                if (move.piece != ChessBoardPiece.Pawn)
                    moveToken += move.piece;
                if (move.sourceField?.file)
                    moveToken += move.sourceField.file;
                if (move.sourceField?.rank)
                    moveToken += move.sourceField.rank;
                if (move.isCapture)
                    moveToken += 'x';
                if (move.targetField) {
                    moveToken += ((move.targetField.file || '') + (move.targetField.rank || ''));
                }
                if (move.isCheck)
                    moveToken += '+';
                else if (move.isMate)
                    moveToken += '#';
            }

            // evaluations (optional NAG format)
            if (move.moveEvaluation)
                moveToken += useNAG ? ' ' + this.moveEvalNAG(move.moveEvaluation) : move.moveEvaluation;
            if (move.positionalEvaluation)
                moveToken += ' ' + (useNAG ? ' ' + this.positionalEvalNAG(move.positionalEvaluation) : move.positionalEvaluation);
            if (move.isNovelty)
                moveToken += ' N';

            // handle comments
            if (!noComments && move.comment) {
                moveToken += ' { ' + move.comment + ' }';
                isFirstMoveOrAfterComment = true;
            }

            if (lineStr.length + moveToken.length <= pgn.PGN_MAX_LINELEN) {
                lineStr += ((lineStr.length > 0) ? ' ' : '') + moveToken;
            }
            else {
                // comments can be very long, split them to lines of maxlength at the last space char
                // there are surely better (more principled) ways to handle this. 
                // but I'm relativly new to TS&JS so I'm using a stright forward one.
                // Looking for simplification later.
                gamePGN.push(lineStr);
                while (moveToken.length > pgn.PGN_MAX_LINELEN) {
                    for (var i = pgn.PGN_MAX_LINELEN; i >= 0; i--) {
                        if (moveToken[i] == ' ') {
                            break;
                        }
                    }
                    if (i == 0) {
                        lineStr = moveToken.substring(0, pgn.PGN_MAX_LINELEN); // no spaces found, cut hard
                        gamePGN.push(lineStr);
                        moveToken = moveToken.substring(pgn.PGN_MAX_LINELEN);
                    }
                    else {
                        lineStr = moveToken.substring(0, i);
                        gamePGN.push(lineStr);
                        moveToken = moveToken.substring(i + 1);
                    }
                }
                lineStr = moveToken;
            }
        }
        // add result token at the end
        let resultStr = str.result;
        if (lineStr.length + resultStr.length <= pgn.PGN_MAX_LINELEN) {
            lineStr += ' ' + resultStr;
        }
        else {
            gamePGN.push(lineStr);
            lineStr = resultStr;
        }

        if (lineStr.length > 0) {
            gamePGN.push(lineStr);
        }
        return gamePGN;
    }

}
export const enum PgnResult {
    WhiteWins = "1-0",
    BlackWins = "0-1",
    Draw = "1/2-1/2",
    Unknown = "*",
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
};

export const mapMoveEvaluation2NAG: { eval: ChessMoveEvaluation, nag: PgnNAG }[] = [
    { eval: ChessMoveEvaluation.blunder, nag: PgnNAG.very_poor_move },
    { eval: ChessMoveEvaluation.mistake, nag: PgnNAG.poor_move },
    { eval: ChessMoveEvaluation.dubious, nag: PgnNAG.questionable_move },
    { eval: ChessMoveEvaluation.interesting, nag: PgnNAG.speculative_move },
    { eval: ChessMoveEvaluation.good, nag: PgnNAG.good_move },
    { eval: ChessMoveEvaluation.brilliant, nag: PgnNAG.very_good_move },
];

export const mapPositionalEvaluation2NAG: { eval: ChessPositionalEvaluation, nag: PgnNAG }[] = [
    { eval: ChessPositionalEvaluation.equal, nag: PgnNAG.drawish_position },
    { eval: ChessPositionalEvaluation.slightAdvantageWhite, nag: PgnNAG.White_has_a_slight_advantage },
    { eval: ChessPositionalEvaluation.slightAdvantageBlack, nag: PgnNAG.Black_has_a_slight_advantage },
    { eval: ChessPositionalEvaluation.clearAdvantageWhite, nag: PgnNAG.White_has_a_moderate_advantage },
    { eval: ChessPositionalEvaluation.clearAdvantageBlack, nag: PgnNAG.Black_has_a_moderate_advantage },
    { eval: ChessPositionalEvaluation.decisiveAdvantageWhite, nag: PgnNAG.White_has_a_decisive_advantage },
    { eval: ChessPositionalEvaluation.decisiveAdvantageBlack, nag: PgnNAG.Black_has_a_decisive_advantage },
    { eval: ChessPositionalEvaluation.unclear, nag: PgnNAG.unclear_position },
];


export class pgnSTR {
    static readonly UNKNOWN = '?';
    static readonly DATE_UNKNOWN = "????.??.??";

    private _event !: string;
    private _site !: string;
    private _date !: string;
    private _round !: string;
    private _white !: string;
    private _black !: string;
    private _result !: PgnResult;

    constructor() {
        this.init();
    }

    init() {
        this._event = pgnSTR.UNKNOWN;
        this._site = pgnSTR.UNKNOWN;
        this._date = pgnSTR.DATE_UNKNOWN;
        this._round = pgnSTR.UNKNOWN;
        this._white = pgnSTR.UNKNOWN;
        this._black = pgnSTR.UNKNOWN;
        this._result = PgnResult.Unknown;
    }

    private validated(s: string): string {
        let result = pgnSTR.UNKNOWN;
        //ToDo remove special chars "] newline tab etc, cut to acceptable line length
        return s == '' ? result : s;
    }
    private validatedDate(s: string): string {
        let result = pgnSTR.DATE_UNKNOWN;
        //ToDo remove special chars "] newline tab etc, cut to acceptable line length
        return s == '' ? result : s;
    }
    set event(e: string) { this._event = this.validated(e); }
    set site(e: string) { this._site = this.validated(e); }
    set date(e: string) { this._date = this.validatedDate(e); }
    set round(e: string) { this._round = this.validated(e); }
    set white(e: string) { this._white = this.validated(e); }
    set black(e: string) { this._black = this.validated(e); }
    set result(e: PgnResult) { this._result = e; }

    get event() { return this._event; }
    get site() { return this._site; }
    get date() { return this._date; }
    get round() { return this._round; }
    get white() { return this._white; }
    get black() { return this._black; }
    get result() { return this._result; }

}

