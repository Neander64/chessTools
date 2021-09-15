import { debug } from "console";
import * as chessGame from "./chess-game"
import { lineParser, parseResult } from "./parser/lineParser"

// TODO maybe, just maybe, RegEx could simplify some topic...
// TODO allow spaces between move token, so you can parse other sources as well.

const CASTLE_LONG = 'O-O-O';
const CASTLE_SHORT = 'O-O';
const PIECE = 'RNBKQ';
const COLUMNS = 'abcdefgh';
const ROWS = '12345678';
const CAPTURE = 'x';
const CHECK = '+';
const MATE = '#';
const NOVELTY = 'N';
const PROMOTE = '=';

const MOVE_EVALS = [
    { str: '??', id: chessGame.ChessMoveEvaluation.blunder },
    { str: '?!', id: chessGame.ChessMoveEvaluation.dubious },
    { str: '!?', id: chessGame.ChessMoveEvaluation.interesting },
    { str: '!!', id: chessGame.ChessMoveEvaluation.brilliant },
    { str: '?', id: chessGame.ChessMoveEvaluation.mistake },
    { str: '!', id: chessGame.ChessMoveEvaluation.good },
];
const POSITIONAL_EVALS = [
    { str: '⩲', id: chessGame.ChessPositionalEvaluation.slightAdvantageWhite },
    { str: '⩱', id: chessGame.ChessPositionalEvaluation.slightAdvantageBlack },
    { str: '±', id: chessGame.ChessPositionalEvaluation.clearAdvantageWhite },
    { str: '∓', id: chessGame.ChessPositionalEvaluation.clearAdvantageBlack },
    { str: '+-', id: chessGame.ChessPositionalEvaluation.decisiveAdvantageWhite },
    { str: '-+', id: chessGame.ChessPositionalEvaluation.decisiveAdvantageBlack },
    //    { str : '=/∞', id : chessGame.ChessPositionalEvaluation.compensation },
    { str: '=', id: chessGame.ChessPositionalEvaluation.equal },
    { str: '∞', id: chessGame.ChessPositionalEvaluation.unclear },
];
const PIECE_CB = [
    { str: 'R', id: chessGame.ChessBoardPiece.Rook },
    { str: 'N', id: chessGame.ChessBoardPiece.Knight },
    { str: 'B', id: chessGame.ChessBoardPiece.Bishop },
    { str: 'K', id: chessGame.ChessBoardPiece.King },
    { str: 'Q', id: chessGame.ChessBoardPiece.Queen },
];
const enum Token {
    MoveNumberBlack = 'MoveNumberBlack',
    MoveNumber = 'MoveNumber',
    Comment = 'Comment',
    MoveBlock = 'MoveBlock',
    BlacksMove = 'BlacksMove',
    WhitesMove = 'WhitesMove',
    CastleLong = 'CastleLong',
    CastleShort = 'CastleShort',

    Piece = 'Piece',
    Source = 'Source',
    Target = 'Target',
    Captures = 'Captures',
    Promotes = 'Promotes',

    Check = 'Check',
    Mate = 'Mate',
    MoveEval = 'MoveEval',
    PositionalEval = 'PosEval',
    Novelty = 'Novelty',
}
type tokenType = { key: Token, value: string };
class ScanValidationError extends Error {
    constructor(message: any) {
        super(message);
        this.name = "ScanValidationError";
    }
}
class ScanData {
    tokens: tokenType[] = [];
    currentMoveNumber: number = 0;
    whiteNext = true; // else black
}

export class parseChessable {

    private _game: chessGame.ChessGame;
    private _scanData: ScanData;

    constructor(game: chessGame.ChessGame) {
        this._game = game;
        this._scanData = new ScanData();
        //this.inititializeParser();
    }
    private initializeScan() {
        this._scanData.currentMoveNumber = 1;
        this._scanData.whiteNext = true;
        this._scanData.tokens = [];
    }
    scanGameText(lines: string[]) { // Tokenize per Line
        this.initializeScan();
        lines.forEach(l => this.scanGameLine(l));
        //console.log("scan result",this._scanData.tokens);
        this.createGameFromTokens();
    }
    private scanGameLine(line: string) {

        let parser: lineParser = new lineParser(line);
        let r: parseResult;
        let lineTokens: tokenType[] = [];
        let moveNum = this._scanData.currentMoveNumber;
        let oldWhiteNextValue = this._scanData.whiteNext;

        try {
            // parse first number: (<num>...<half-move>)|(<num>.<half-move>[<half-move>])[<num>.<half-move>[<half-move>]]
            let numStr = this._scanData.whiteNext ? moveNum + '.' : moveNum + '...';
            r = parser.parsingStopString(numStr);
            if (r.found && r.token == '') { // if token is not empty the line starts with is garbage
                if (this._scanData.whiteNext) {
                    lineTokens.push({ key: Token.MoveNumber, value: moveNum + '' });
                }
                else { // black half move
                    lineTokens.push({ key: Token.MoveNumberBlack, value: moveNum + '' });
                }
            }
            else { // line start not with an expected nummeration, must be a comment.
                throw new ScanValidationError('Syntax Error in line');
            }

            // read token to the next move number
            do {
                r = parser.parsingStopString((moveNum + 1) + '.');
                moveNum++;
                if (r.found) {
                    if (parser.endOfString) throw new ScanValidationError('Syntax Error in line');
                    lineTokens.push({ key: Token.MoveBlock, value: r.token || '' });

                    let tokenParser: lineParser = new lineParser(r.token || '');
                    let moveToken = this.scanMove(tokenParser);
                    //moveToken.forEach(v => lineTokens.push(v));
                    lineTokens = lineTokens.concat(moveToken);
                    lineTokens.push({ key: Token.MoveNumber, value: moveNum + '' });
                }
                else if (!parser.endOfString) { // if not empty last block move
                    let rest = parser.restOfLine();
                    lineTokens.push({ key: Token.MoveBlock, value: rest });

                    let tokenParser: lineParser = new lineParser(rest);
                    let moveToken = this.scanMove(tokenParser);
                    //moveToken.forEach(v => lineTokens.push(v));
                    lineTokens = lineTokens.concat(moveToken);
                }
                else {
                    throw new ScanValidationError('Syntax Error in line');
                }
            }
            while (!parser.endOfString);
            this._scanData.currentMoveNumber = this._scanData.whiteNext ? moveNum : moveNum - 1;
        } catch (e) {
            if (e instanceof ScanValidationError) {
                lineTokens = []; // ignore your results, it's a comment.
                lineTokens.push({ key: Token.Comment, value: line });
                // restore color to move
                this._scanData.whiteNext = oldWhiteNextValue;
            }
            else throw e; // was not me
        }
        // append new line tokens
        //lineTokens.forEach(v => this._scanData.tokens.push(v));
        this._scanData.tokens = this._scanData.tokens.concat(lineTokens);
    }

    private scanMove(tokenParser: lineParser): tokenType[] {
        let lineTokens: tokenType[] = [];
        if (this._scanData.whiteNext) {
            lineTokens.push({ key: Token.WhitesMove, value: '' });
            //this.scanHalfMove(tokenParser).forEach(v => lineTokens.push(v));
            lineTokens = lineTokens.concat(this.scanHalfMove(tokenParser));
            this._scanData.whiteNext = false;
        }
        if (!tokenParser.endOfString) {
            lineTokens.push({ key: Token.BlacksMove, value: '' });
            //this.scanHalfMove(tokenParser).forEach(v => lineTokens.push(v));
            lineTokens = lineTokens.concat(this.scanHalfMove(tokenParser));

            // String must be consumed otherwise unrecognized values left.
            if (!tokenParser.endOfString) throw new ScanValidationError('Syntax Error in line');

            this._scanData.whiteNext = true;
        }
        return lineTokens;
    }

    private scanHalfMove(tokenParser: lineParser): tokenType[] {
        // O-O|O-O-O|[<piece>][<col>|<row>][x]<col><row>[+|#][<move_eval>][<pos_eval>][N]
        //                         src          target 
        let lineTokens: tokenType[] = [];
        let r = tokenParser.parsingString(CASTLE_LONG);
        if (r.found) {
            lineTokens.push({ key: Token.CastleLong, value: '' });
        }
        else {
            r = tokenParser.parsingString(CASTLE_SHORT);
            if (r.found) {
                lineTokens.push({ key: Token.CastleShort, value: '' });
            }
            else {
                let isPawn = true;
                r = tokenParser.parsingCharSet(PIECE);
                if (r.found) {
                    lineTokens.push({ key: Token.Piece, value: r.token || '' });
                    isPawn = false;
                }
                let x1 = tokenParser.parsingCharSet(CAPTURE);
                if (isPawn && x1.found) throw new ScanValidationError('Syntax Error in line');
                let c1 = tokenParser.parsingCharSet(COLUMNS);
                if (isPawn && !c1.found) throw new ScanValidationError('Syntax Error in line');
                let r1 = tokenParser.parsingCharSet(ROWS);
                if (c1.found && r1.found) {
                    if (x1.found) {
                        lineTokens.push({ key: Token.Captures, value: '' });
                    }
                    lineTokens.push({ key: Token.Target, value: (c1.token || ' ') + (r1.token || ' ') });
                }
                else {
                    if (x1.found) throw new ScanValidationError('Syntax Error in line');
                    if (c1.found) {
                        lineTokens.push({ key: Token.Source, value: (c1.token || ' ') + ' ' });
                    } else /*if (r1.found)*/ {
                        lineTokens.push({ key: Token.Source, value: ' ' + (r1.token || ' ') });
                    }
                    let x2 = tokenParser.parsingCharSet(CAPTURE);
                    let c2 = tokenParser.parsingCharSet(COLUMNS);
                    let r2 = tokenParser.parsingCharSet(ROWS);
                    if (c2.found && r2.found) {
                        if (x2.found) {
                            lineTokens.push({ key: Token.Captures, value: '' });
                        }
                        lineTokens.push({ key: Token.Target, value: (c2.token || ' ') + (r2.token || ' ') });
                    }
                    else throw new ScanValidationError('Syntax Error in line');
                }
                if (isPawn) { // handle pawn promotion
                    r = tokenParser.parsingChar(PROMOTE);
                    if (r.found) {
                        r = tokenParser.parsingCharSet(PIECE);
                        if (r.found) {
                            lineTokens.push({ key: Token.Promotes, value: r.token || '' });
                        }
                        else throw new ScanValidationError('Syntax Error in line');
                    }
                }
            }
        }
        // '+' or '+-' ?
        r = tokenParser.parsingChar('+-', false);
        if (!r.found) {
            r = tokenParser.parsingChar(CHECK);
            if (r.found) {
                lineTokens.push({ key: Token.Check, value: r.token || '' });
            }
            else {
                r = tokenParser.parsingChar(MATE);
                if (r.found) {
                    lineTokens.push({ key: Token.Mate, value: r.token || '' });
                }
            }
        }

        // Move Evaluation
        for (let tmp of MOVE_EVALS) {
            r = tokenParser.parsingString(tmp.str);
            if (r.found) {
                lineTokens.push({ key: Token.MoveEval, value: tmp.id });
                break;
            }
        }

        // Positional Evaluation
        for (let tmp of POSITIONAL_EVALS) {
            r = tokenParser.parsingString(tmp.str);
            if (r.found) {
                lineTokens.push({ key: Token.PositionalEval, value: tmp.id });
                break;
            }
        }

        // handle Novelty (is a bit tricky)
        r = tokenParser.parsingChar(NOVELTY, false); // peek, no shift
        if (r.found) { // well, could be a novelty if the rest of the line is syntactical okay
            let oldWhiteNextValue = this._scanData.whiteNext; // damn, 'global' value..
            try {
                let restParser = new lineParser(tokenParser.restOfLine(false, r.parsePos))
                if (restParser.endOfString) {
                    // Empty after N, this is a Novelty indicator
                    r = tokenParser.parsingChar(NOVELTY); // consume char
                    lineTokens.push({ key: Token.Novelty, value: '' });
                }
                else {
                    let { found: isPiece } = restParser.parsingCharSet(PIECE, false);
                    this.scanHalfMove(restParser);
                    this._scanData.whiteNext = oldWhiteNextValue;
                    // issue, now if it is a Knightmove that is a legal Pawnmove after that piece indicator,
                    // we can not distinguish between these (could be reduced by consideration of possible board moves).
                    // I'll NOT treat it as novelty (as those are more rare than such Knight moves)
                    if (isPiece) {
                        r = tokenParser.parsingChar(NOVELTY); // consume char (shift)
                        lineTokens.push({ key: Token.Novelty, value: '' });
                    }
                    else {
                        //console.log('WRN: possible novelity indicator ignored (Knight or N?)');
                    }
                }
            }
            catch (e) {
                if (e instanceof ScanValidationError) {
                    // not a N for Novelty
                    this._scanData.whiteNext = oldWhiteNextValue;
                }
                else throw e; // was not me    
            }
        }

        return lineTokens;
    }

    private createGameFromTokens() {
        this._game.clearGame();
        for (let tmp of this._scanData.tokens) {
            switch (tmp.key) {
                case Token.MoveNumberBlack:
                    //this._game.addMove(); // store move
                    break;
                case Token.MoveNumber:
                    break;
                case Token.Comment:
                    this._game.setMoveComment(tmp.value as string);
                    //this._game.addMove(); // store move
                    break;
                case Token.MoveBlock: break; // ignore
                case Token.BlacksMove:
                    this._game.addMove(); // store move
                    break;  // ignore
                case Token.WhitesMove:
                    this._game.addMove(); // store move
                    break;  // ignore
                case Token.CastleLong:
                    this._game.setMoveCastleLong();
                    break;
                case Token.CastleShort:
                    this._game.setMoveCastleShort();
                    break;
                case Token.Piece:
                    let p_cb = PIECE_CB.find(x => x.str == tmp.value);
                    if (p_cb) this._game.setMovePiece(p_cb.id);
                    break;
                case Token.Source:
                    if (tmp.value[1] == ' ') // only one value will be set
                        this._game.setMoveSourceField({ column: tmp.value[0] });
                    else
                        this._game.setMoveSourceField({ row: tmp.value[1] });
                    break;
                case Token.Target:
                    this._game.setMoveTargetField({ column: tmp.value[0], row: tmp.value[1] });
                    break;
                case Token.Captures:
                    this._game.setMoveIsCapture();
                    break;
                case Token.Promotes:
                    let p_cb1 = PIECE_CB.find(x => x.str == tmp.value);
                    if (p_cb1) this._game.setMovePiece(p_cb1.id);
                    break;
                case Token.Check:
                    this._game.setMoveIsCheck();
                    break;
                case Token.Mate:
                    this._game.setMoveIsMate();
                    break;
                case Token.MoveEval:
                    let p_cb2 = MOVE_EVALS.find(x => x.str == tmp.value);
                    if (p_cb2) this._game.setMoveEvaluation(p_cb2.id);
                    break;
                case Token.PositionalEval:
                    let p_cb3 = POSITIONAL_EVALS.find(x => x.str == tmp.value);
                    if (p_cb3) this._game.setMovePositionalEvaluation(p_cb3.id);
                    break;
                case Token.Novelty:
                    this._game.setMoveIsNovelty();
                    break;
            }
        }
        if (!this._game.isTmpInitial) {
            this._game.addMove(); // store former move, initializes new one
        }
    }

    //// Old version
    /*   
        private inititializeParser() {
            this._game.clearGame();
            //this._status.moveNumber = this._game.moveNumber.toString();
        }
        private finishParser() {
            // add last open move.
            if (!this._game.isTmpInitial) {
                this._game.addMove(); // store former move, initializes new one
            }
        }
    
        parseGameText( lines : string[] ) {
            this.inititializeParser();
            // moves and comment lines alternate, first line is always a move line
            // Input might have to be prepared for that
            lines.forEach((l,i) => this.parseLine(l, i%2==1));
            this.finishParser();
        }
    
        private parseLine( line : string, isComment : boolean ) {
            let parser : lineParser = new lineParser(line);
            let r : parseResult;
    
            if (isComment) {
                this._game.setMoveComment(line);
                this._game.addMove(); // store the move
            }
            else {
                this.parseFirstMoveNumber(parser);
                do {
                    if (this.parseCastleLong(parser)) { // parse long before short (overlapping matches)
                        // O-O-O
                    } 
                    else if (this.parseCastleShort(parser)) {
                        // O-O
                    }
                    else {
                        let p = this.parsePiece(parser); // optional, default: pawn
                        let isPawn = (!p.found);
                        if (isPawn) { // e5, exd5 etc.
                            let pawn_c1 = this.parseColumn(parser);
                            if (this.parseCapture(parser)) {
                                let pawn_c2 = this.parseColumn(parser);
                                let pawn_r1 = this.parseRow(parser);
                                if (pawn_c1.found && pawn_c2.found && pawn_r1.found) { 
                                    this._game.setMoveSourceField({column:pawn_c1.token});
                                    this._game.setMoveTargetField({column:pawn_c2.token,row:pawn_r1.token});
                                }
                                else throw new Error ('Syntax Error - Illegal pawn move');
                            }
                            else {
                                let pawn_r1 = this.parseRow(parser);
                                if (pawn_c1.found && pawn_r1.found) { // normal target coords
                                    this._game.setMoveTargetField({column:pawn_c1.token,row:pawn_r1.token});
                                }
                                else throw new Error ('Syntax Error - Illegal pawn move');
                            }
                        }
                        else { // Ne5, Qxd4, Nbd7, Nbxd7 , N5d7
                            if (this.parseCapture(parser)) { // Qxd4
                                let c1 = this.parseColumn(parser);
                                let r1 = this.parseRow(parser);
                                if (c1.found && r1.found) { // normal target coords
                                    this._game.setMoveTargetField({column:c1.token,row:r1.token});
                                }    
                                else throw new Error ('Syntax Error - Illegal move');    
                            }
                            else {
                                let c1 = this.parseColumn(parser);
                                if (c1.found) {
                                    if (this.parseCapture(parser)) { // Nbxd7
                                        let c2 = this.parseColumn(parser);
                                        let r1 = this.parseRow(parser);
                                        if (c2.found && r1.found) { // normal target coords
                                            this._game.setMoveSourceField({column:c1.token});
                                            this._game.setMoveTargetField({column:c2.token,row:r1.token});
                                        }    
                                        else throw new Error ('Syntax Error - Illegal move');    
                                    }
                                    else { // Nc6, Ncd6
                                        let c2 = this.parseColumn(parser);
                                        let r1 = this.parseRow(parser);
                                        if (c2.found && r1.found) {
                                            this._game.setMoveSourceField({column:c1.token});
                                            this._game.setMoveTargetField({column:c2.token,row:r1.token});
                                        }
                                        else if (!c2.found && r1.found) { // Nc6
                                            this._game.setMoveTargetField({column:c1.token,row:r1.token});
                                        }
                                        else throw new Error ('Syntax Error - Illegal move');    
                                    }        
                                }
                                else { // N5d7 or N5xd7
                                    let r1 = this.parseRow(parser);
                                    if (!r1.found) throw new Error ('Syntax Error - Illegal move');
                                    this.parseCapture(parser);
                                    let c1 = this.parseColumn(parser);
                                    let r2 = this.parseRow(parser);
                                    if (c1.found && r2.found) {
                                        this._game.setMoveSourceField({row:r1.token});
                                        this._game.setMoveTargetField({column:c1.token,row:r2.token});
                                    }
                                    else throw new Error ('Syntax Error - Illegal move');    
                                }
                            }
                        }
                    }
                    this.parseCheck(parser);
                    this.parseMate(parser);
                    this.parseMoveEvaluation(parser);
                    this.parsePositionalEvaluation(parser);
    
                    // ToDo parsing for 'N' as novelty is not unique, can solve that?
                    // example 1.d4Nf6, could mean 1. d4N f6 or 1. d4 Nf6
                    //this.parseNovelty(parser);
    
                    //next move?    
                    if (!parser.endOfString) { // okay, more moves to come
                        this.parseNextMoveNumber(parser); // throws exception, if not a valid number
                    }
                    // the last move of a line stays open, as there could be a comment comming next line.
                }
                while(!parser.endOfString)
            }
        }
    
        private parseFirstMoveNumber(parser:lineParser) : boolean { 
            //  * <LineNumber>. (if its white move) or <LineNumber>... (if its black move)
            let moveNumberStr = this._game.moveNumber.toString() + (this._game.isWhiteToMove ? '.':'...'); 
            let r = parser.parsingString(moveNumberStr);
            if (r.found) { // new move starts here
                if (!this._game.isTmpInitial) {
                    this._game.addMove(); // store former move, initializes new one
                }
                return true;
            }
            return false;
        }
    
        private parseNextMoveNumber(parser:lineParser) : boolean { 
            //  * <LineNumber>. (if its white move) or <LineNumber>... (if its black move)
            // store the current move
            if (this._game.isTmpInitial) throw new Error('Empty move');
            this._game.addMove(); // store former move, initializes new one
            if (this._game.isWhiteToMove) { // having new numbers for white only
                let moveNumberStr = this._game.moveNumber.toString() + '.'; 
                let r = parser.parsingString(moveNumberStr);
                if (!r.found) throw new Error('Syntax error: expected move number');
            }
            return true;
        }
    
    
        private parsePiece(parser:lineParser) : parseResult { 
            let r = parser.parsingCharSet('RNBKQ'); 
            //console.log('parsePiece: ', r);
            if (r.found) {
                let piece : chessGame.ChessBoardPiece = chessGame.ChessBoardPiece.Pawn; // not possible
                switch(r.token) {
                    case 'R': piece = chessGame.ChessBoardPiece.Rook; break;
                    case 'N': piece = chessGame.ChessBoardPiece.Knight; break;
                    case 'B': piece = chessGame.ChessBoardPiece.Bishop; break;
                    case 'K': piece = chessGame.ChessBoardPiece.King; break;
                    case 'Q': piece = chessGame.ChessBoardPiece.Queen; break;
                    //default: //ToDo Exception
                }
                this._game.setMovePiece(piece);
            }
            return r;
        }
    
        private parseColumn(parser:lineParser) : parseResult {
            let r = parser.parsingCharSet('abcdefgh');
            return r;
        }
        private parseRow(parser:lineParser) : parseResult {
            let r = parser.parsingCharSet('123456789');
            return r;
        }
    
        private parseCapture(parser:lineParser) : boolean {
            let r = parser.parsingChar('x');
            if (r.found) {
                this._game.setMoveIsCapture();
                return true;
            }
            return false;
        }
        private parseCheck(parser:lineParser) : boolean {
            let r = parser.parsingChar('+');
            if (r.found) {
                this._game.setMoveIsCheck();
                return true;
            }
            return false;
        }
        private parseMate(parser:lineParser) : boolean {
            let r = parser.parsingChar('#');
            if (r.found) {
                this._game.setMoveIsMate();
                return true;
            }
            return false;
        }
        private parseCastleShort(parser:lineParser) : boolean {
            let r = parser.parsingString('O-O');
            if (r.found) {
                this._game.setMoveCastleShort();
                return true;
            }
            return false;
        }
        private parseCastleLong(parser:lineParser) : boolean {
            let r = parser.parsingString('O-O-O');
            if (r.found) {
                this._game.setMoveCastleLong();
                return true;
            }
            return false;
        }
        private parseMoveEvaluation(parser:lineParser) {
            let r : parseResult;
            r = parser.parsingString('??');
            if (r.found) {
                this._game.setMoveEvaluation(chessGame.ChessMoveEvaluation.blunder);
                return;
            }
            r = parser.parsingString('?!');
            if (r.found) {
                this._game.setMoveEvaluation(chessGame.ChessMoveEvaluation.dubious);
                return;
            }
            r = parser.parsingString('!?');
            if (r.found) {
                this._game.setMoveEvaluation(chessGame.ChessMoveEvaluation.interesting);
                return;
            }
            r = parser.parsingString('!!');
            if (r.found) {
                this._game.setMoveEvaluation(chessGame.ChessMoveEvaluation.brilliant);
                return;
            }
            r = parser.parsingString('?');
            if (r.found) {
                this._game.setMoveEvaluation(chessGame.ChessMoveEvaluation.mistake);
                return;
            }
            r = parser.parsingString('!');
            if (r.found) {
                this._game.setMoveEvaluation(chessGame.ChessMoveEvaluation.good);
                return;
            }
        }
        private parseNovelty(parser:lineParser) {
            let r = parser.parsingString('N');
            if (r.found) {
                this._game.setMoveIsNovelty();
            }    
        }
        private parsePositionalEvaluation(parser:lineParser) {
            let r : parseResult;
            r = parser.parsingString('⩲');
            if (r.found) {
                this._game.setMovePositionalEvaluation(chessGame.ChessPositionalEvaluation.slightAdvantageWhite);
                return;
            }
            r = parser.parsingString('⩱');
            if (r.found) {
                this._game.setMovePositionalEvaluation(chessGame.ChessPositionalEvaluation.slightAdvantageBlack);
                return;
            }
            r = parser.parsingString('±');
            if (r.found) {
                this._game.setMovePositionalEvaluation(chessGame.ChessPositionalEvaluation.clearAdvantageWhite);
                return;
            }
            r = parser.parsingString('∓'); 
            if (r.found) {
                this._game.setMovePositionalEvaluation(chessGame.ChessPositionalEvaluation.clearAdvantageBlack);
                return;
            }
            r = parser.parsingString('+-');
            if (r.found) {
                this._game.setMovePositionalEvaluation(chessGame.ChessPositionalEvaluation.decisiveAdvantageWhite);
                return;
            }
            r = parser.parsingString('-+');
            if (r.found) {
                this._game.setMovePositionalEvaluation(chessGame.ChessPositionalEvaluation.decisiveAdvantageBlack);
                return;
            }
            r = parser.parsingString('=/∞');
            if (r.found) {
                this._game.setMovePositionalEvaluation(chessGame.ChessPositionalEvaluation.compensation);
                return;
            }
            r = parser.parsingString('=');
            if (r.found) {
                this._game.setMovePositionalEvaluation(chessGame.ChessPositionalEvaluation.equal);
                return;
            }
            r = parser.parsingString('∞');
            if (r.found) {
                this._game.setMovePositionalEvaluation(chessGame.ChessPositionalEvaluation.unclear);
                return;
            }
        }
        */
}
