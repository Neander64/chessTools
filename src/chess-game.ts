
const PIECE = 'RNBKQ';
const COLUMNS = 'abcdefgh';
const ROWS = '12345678';
const CASTLE_LONG = 'O-O-O';
const CASTLE_SHORT = 'O-O';


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
export const enum ChessMoveEvaluation {
    // move evaluation
    blunder = '??',         // $4
    mistake = '?',          // $2
    dubious = '?!',         // $6
    interesting = '!?',     // $5
    good = '!',             // $1
    brilliant = '!!',       // $3
}


export const enum ChessPositionalEvaluation {
    // positional
    equal = '=',                    // $10
    slightAdvantageWhite = '⩲',   // $14 ⩲
    slightAdvantageBlack = '⩱',   // $15 ⩱
    clearAdvantageWhite = '±',    // $16 ± moderate
    clearAdvantageBlack = '∓',    // $17 ∓
    decisiveAdvantageWhite = '+-',  // $18 +-
    decisiveAdvantageBlack = '-+',  // $19 -+
    unclear = '∞',                  // $13 ∞
    // ToDo: add further evaluations
}



export class ChessBoardField {
    row?: string;
    column?: string;
}

class ChessHalfMove {
    moveNumber: number = 0;
    color?: ChessMoveColor;
    piece?: ChessBoardPiece;
    sourceField?: ChessBoardField;
    targetField?: ChessBoardField;
    promotionTarget?: ChessBoardPiece;
    castleShort?: boolean;
    castleLong?: boolean;
    isCheck?: boolean;
    isMate?: boolean;
    isCapture?: boolean;
    isNovelty?: boolean;
    moveEvaluation?: ChessMoveEvaluation;
    positionalEvaluation?: ChessPositionalEvaluation;
    comment?: string;
}

export class ChessGame {

    event = "?";
    site = "?";
    date = "????.??.??";
    round = "?";
    white = "?";
    black = "?";
    result = PgnResult.Unknown;

    //ToDo: allow using a startPosition
    private _nextColor: ChessMoveColor = ChessMoveColor.white;
    private _moveNumber: number = 1; // next move number
    private _tmpMove !: ChessHalfMove; // Buffer for the next move to be added
    private _isTmpInitial: boolean = true;

    moves: ChessHalfMove[] = [];

    constructor() {
        this.clearGame();
    }

    public get pgnSTR(): pgnSTR {
        let res = new pgnSTR();
        res.event = this.event;
        res.site = this.site;
        res.date = this.date;
        res.round = this.round;
        res.white = this.white;
        res.black = this.black;
        res.result = this.result;
        return res;
    }
    public get nextColor(): ChessMoveColor {
        return this._nextColor;
    }
    public get moveNumber(): number {
        return this._moveNumber;
    }

    public get isTmpInitial(): boolean {
        return this._isTmpInitial;
    }

    // set Game to initial / empty values
    clearGame() {
        this.event = "?";
        this.site = "?";
        this.date = "????.??.??";
        this.round = "?";
        this.white = "?";
        this.black = "?";
        this.result = PgnResult.Unknown; //["*"];

        this._nextColor = ChessMoveColor.white;
        this._moveNumber = 1;
        this.moves = [];

        this.initMove();
    }

    get isWhiteToMove(): boolean {
        return this._nextColor == ChessMoveColor.white;
    }
    get hasMoves(): boolean {
        return this.moves.length != 0;
    }

    // I don't want to expose the internal representation.
    // Add values to the Move, then addMove() to actually store these.
    setMovePiece(piece: ChessBoardPiece) {
        this._tmpMove.piece = piece;
        this._isTmpInitial = false;
        return this;
    }
    setMoveSourceField(sourceField: ChessBoardField) {
        //ToDo: check piece exist on current board
        //ToDo: check extend missing value
        //ToDo: throw exeption if wrong values
        let colOkay: boolean = true;
        let rowOkay: boolean = true;
        if (sourceField.column) {
            colOkay = this.checkLegalColumns(sourceField.column);
        }
        if (sourceField.row) {
            rowOkay = this.checkLegalRows(sourceField.row);
        }
        if (colOkay && rowOkay) {
            this._tmpMove.sourceField = sourceField;
            this._isTmpInitial = false;
        }
        return this;
    }
    setMoveTargetField(targetField: ChessBoardField) {
        //ToDo: throw exception on wrong values
        //ToDo: check if target is capture
        //ToDo: check if Check / Mate
        let colOkay: boolean = true;
        let rowOkay: boolean = true;
        if (targetField.column) {
            colOkay = this.checkLegalColumns(targetField.column);
        }
        if (targetField.row) {
            rowOkay = this.checkLegalRows(targetField.row);
        }
        if (colOkay && rowOkay) {
            this._tmpMove.targetField = targetField;
            this._isTmpInitial = false;
        }
        return this;
    }
    setMovePromotionTarget(piece: ChessBoardPiece) {
        /*ToDo: don't throw, yet
        if (piece == ChessBoardPiece.Pawn) {
            throw new Error('Illegal promotion: pawn to pawn');
            //return this;
        }
        */
        this._tmpMove.promotionTarget = piece;
        this._isTmpInitial = false;
        return this;
    }
    setMoveIsCheck() {
        //ToDo: check on current board if it's actually a check
        this._tmpMove.isCheck = true;
        this._isTmpInitial = false;
        return this;
    }
    setMoveIsMate() {
        //ToDo: check on current board if it's actually a mate
        this._tmpMove.isMate = true;
        this._isTmpInitial = false;
        return this;
    }
    setMoveIsCapture() {
        //ToDo: check on current board if it's actually a capture
        this._tmpMove.isCapture = true;
        this._isTmpInitial = false;
        return this;
    }
    setMoveIsNovelty() {
        //ToDo: check on current board if it's actually a capture
        this._tmpMove.isNovelty = true;
        this._isTmpInitial = false;
        return this;
    }
    setMoveEvaluation(evaluation: ChessMoveEvaluation) {
        this._tmpMove.moveEvaluation = evaluation;
        this._isTmpInitial = false;
        return this;
    }
    setMovePositionalEvaluation(evaluation: ChessPositionalEvaluation) {
        this._tmpMove.positionalEvaluation = evaluation;
        this._isTmpInitial = false;
        return this;
    }
    setMoveComment(comment: string) {
        if (this._tmpMove.comment) {
            this._tmpMove.comment += comment; // append further comments to existing one
        }
        else this._tmpMove.comment = comment;
        //this._isTmpInitial = false; Comment move set's no dirty flag to avoid saving a comment only move
        return this;
    }
    setMoveCastleShort() {
        this._tmpMove.castleShort = true;
        this._isTmpInitial = false;
    }
    setMoveCastleLong() {
        this._tmpMove.castleLong = true;
        this._isTmpInitial = false;
    }
    addMove() {
        if (this._isTmpInitial) { // no values set. That is not a move!
            //ToDo Throw Exception
            return this;
        }
        //ToDo: validate move
        if (!this._tmpMove.piece) { // if not defined, must be a pawn
            this._tmpMove.piece = ChessBoardPiece.Pawn;
        }
        this._tmpMove.color = this._nextColor;
        this._tmpMove.moveNumber = this._moveNumber;
        this.moves.push(this._tmpMove);
        this.initMove();
        this.changePlayer();
        return this;
    }

    private checkLegalColumns(column: string): boolean {
        return column.length == 1 &&
            COLUMNS.indexOf(column) >= 0
    }
    private checkLegalRows(row: string): boolean {
        return row.length == 1 &&
            ROWS.indexOf(row) >= 0
    }

    private initMove() {
        this._tmpMove = new ChessHalfMove();
        this._isTmpInitial = true;
    }
    private changePlayer() {
        if (this._nextColor == ChessMoveColor.white) {
            this._nextColor = ChessMoveColor.black;
        }
        else {
            this._nextColor = ChessMoveColor.white;
            this._moveNumber++;
        }
    }
}

const enum PgnResult {
    WhiteWins = "1-0",
    BlackWins = "0-1",
    Draw = "1/2-1/2",
    Unknown = "*",
}
const enum PgnNAG { // $0, $16,..
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

const mapMoveEvaluation2NAG: { eval: ChessMoveEvaluation, nag: PgnNAG }[] = [
    { eval: ChessMoveEvaluation.blunder, nag: PgnNAG.very_poor_move },
    { eval: ChessMoveEvaluation.mistake, nag: PgnNAG.poor_move },
    { eval: ChessMoveEvaluation.dubious, nag: PgnNAG.questionable_move },
    { eval: ChessMoveEvaluation.interesting, nag: PgnNAG.speculative_move },
    { eval: ChessMoveEvaluation.good, nag: PgnNAG.good_move },
    { eval: ChessMoveEvaluation.brilliant, nag: PgnNAG.very_good_move },
];

const mapPositionalEvaluation2NAG: { eval: ChessPositionalEvaluation, nag: PgnNAG }[] = [
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
        if (m) result = m.nag;
        return result;
    }
    private positionalEvalNAG(evaluation: string): string {
        let result = '';
        let m = mapPositionalEvaluation2NAG.find(e => e.eval == evaluation);
        if (m) result = m.nag;
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
                if (move.sourceField?.column)
                    moveToken += move.sourceField.column;
                if (move.sourceField?.row)
                    moveToken += move.sourceField.row;
                if (move.isCapture)
                    moveToken += 'x';
                if (move.targetField) {
                    moveToken += ((move.targetField.column || '') + (move.targetField.row || ''));
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

