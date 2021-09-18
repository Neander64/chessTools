import { ChessGame } from "../ChessGame";
import { ChessMoveEvaluation, ChessPositionalEvaluation, MoveOnBoard } from "../common/MoveOnBoard";
import { lineParser, parseResult } from "../parser/lineParser";

// a parsing module to scan texts that i have on chessable.
// seems like it could be used to read other text files as well
// The specific format:
//  * each line contains either comments or moves
//  * there is no whitespace between black and whites move
// I'll make a parse and tokenize run (to identify comment lines) 
// then use these tokens to build up the game in a second run

// TODO maybe, just maybe, RegEx could simplify...
// TODO allow spaces between move token, so you can parse other sources as well.


// Mappint Chessable => Board const
const MOVE_EVALS = [
    { str: '??', id: ChessMoveEvaluation.blunder },
    { str: '?!', id: ChessMoveEvaluation.dubious },
    { str: '!?', id: ChessMoveEvaluation.interesting },
    { str: '!!', id: ChessMoveEvaluation.brilliant },
    { str: '?', id: ChessMoveEvaluation.mistake },
    { str: '!', id: ChessMoveEvaluation.good },
]
const POSITIONAL_EVALS = [
    { str: '⩲', id: ChessPositionalEvaluation.slightAdvantageWhite },
    { str: '⩱', id: ChessPositionalEvaluation.slightAdvantageBlack },
    { str: '±', id: ChessPositionalEvaluation.clearAdvantageWhite },
    { str: '∓', id: ChessPositionalEvaluation.clearAdvantageBlack },
    { str: '+-', id: ChessPositionalEvaluation.decisiveAdvantageWhite },
    { str: '-+', id: ChessPositionalEvaluation.decisiveAdvantageBlack },
    //    { str : '=/∞', id : chessGame.ChessPositionalEvaluation.compensation },
    { str: '=', id: ChessPositionalEvaluation.equal },
    { str: '∞', id: ChessPositionalEvaluation.unclear },
]

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

    private static readonly CASTLE_LONG = 'O-O-O';
    private static readonly CASTLE_SHORT = 'O-O';
    private static readonly PIECE = 'RNBKQ';
    private static readonly COLUMNS = 'abcdefgh';
    private static readonly ROWS = '12345678';
    private static readonly CAPTURE = 'x';
    private static readonly CHECK = '+';
    private static readonly MATE = '#';
    private static readonly NOVELTY = 'N';
    private static readonly PROMOTE = '=';

    private _game: ChessGame;
    private _scanData: ScanData;

    constructor(game: ChessGame) {
        this._game = game;
        this._scanData = new ScanData();
        //this.inititializeParser();
    }
    scanGameText(lines: string[]) { // Tokenize per Line
        this.initializeScan();
        lines.forEach(l => this.scanGameLine(l));
        //console.log("scan result",this._scanData.tokens);
        this.createGameFromTokens();
    }
    private initializeScan() {
        this._scanData.currentMoveNumber = 1;
        this._scanData.whiteNext = true;
        this._scanData.tokens = [];
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
                    lineTokens = lineTokens.concat(moveToken);
                    lineTokens.push({ key: Token.MoveNumber, value: moveNum + '' });
                }
                else if (!parser.endOfString) { // if not empty last block move
                    let rest = parser.restOfLine();
                    lineTokens.push({ key: Token.MoveBlock, value: rest });

                    let tokenParser: lineParser = new lineParser(rest);
                    let moveToken = this.scanMove(tokenParser);
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
        let r = tokenParser.parsingString(parseChessable.CASTLE_LONG);
        if (r.found) {
            lineTokens.push({ key: Token.CastleLong, value: '' });
        }
        else {
            r = tokenParser.parsingString(parseChessable.CASTLE_SHORT);
            if (r.found) {
                lineTokens.push({ key: Token.CastleShort, value: '' });
            }
            else {
                let isPawn = true;
                r = tokenParser.parsingCharSet(parseChessable.PIECE);
                if (r.found) {
                    lineTokens.push({ key: Token.Piece, value: r.token || '' });
                    isPawn = false;
                }
                let x1 = tokenParser.parsingCharSet(parseChessable.CAPTURE);
                if (isPawn && x1.found) throw new ScanValidationError('Syntax Error in line');
                let c1 = tokenParser.parsingCharSet(parseChessable.COLUMNS);
                if (isPawn && !c1.found) throw new ScanValidationError('Syntax Error in line');
                let r1 = tokenParser.parsingCharSet(parseChessable.ROWS);
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
                    } else {
                        lineTokens.push({ key: Token.Source, value: ' ' + (r1.token || ' ') });
                    }
                    let x2 = tokenParser.parsingCharSet(parseChessable.CAPTURE);
                    let c2 = tokenParser.parsingCharSet(parseChessable.COLUMNS);
                    let r2 = tokenParser.parsingCharSet(parseChessable.ROWS);
                    if (c2.found && r2.found) {
                        if (x2.found) {
                            lineTokens.push({ key: Token.Captures, value: '' });
                        }
                        lineTokens.push({ key: Token.Target, value: (c2.token || ' ') + (r2.token || ' ') });
                    }
                    else throw new ScanValidationError('Syntax Error in line');
                }
                if (isPawn) { // handle pawn promotion
                    r = tokenParser.parsingChar(parseChessable.PROMOTE);
                    if (r.found) {
                        r = tokenParser.parsingCharSet(parseChessable.PIECE);
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
            r = tokenParser.parsingChar(parseChessable.CHECK);
            if (r.found) {
                lineTokens.push({ key: Token.Check, value: r.token || '' });
            }
            else {
                r = tokenParser.parsingChar(parseChessable.MATE);
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

        // handle Novelty (it's a bit tricky, since not unique)
        r = tokenParser.parsingChar(parseChessable.NOVELTY, false); // peek, no shift
        if (r.found) { // well, could be a novelty if the rest of the line is syntactical okay
            let oldWhiteNextValue = this._scanData.whiteNext; // damn, 'global' value..
            try {
                let restParser = new lineParser(tokenParser.restOfLine(false, r.parsePos))
                if (restParser.endOfString) {
                    // Empty after N, this is a Novelty indicator
                    r = tokenParser.parsingChar(parseChessable.NOVELTY); // consume char
                    lineTokens.push({ key: Token.Novelty, value: '' });
                }
                else {
                    let { found: isPiece } = restParser.parsingCharSet(parseChessable.PIECE, false);
                    this.scanHalfMove(restParser);
                    this._scanData.whiteNext = oldWhiteNextValue;
                    // the issue, now if it is a Knightmove that is a legal Pawnmove after that piece indicator,
                    // we can not distinguish between these (could be reduced by consideration of possible board moves).
                    // I'll NOT treat it as novelty (as those are more rare than such Knight moves)
                    if (isPiece) {
                        r = tokenParser.parsingChar(parseChessable.NOVELTY); // consume char (shift)
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
        // 2nd Run build the game from list of token
        // basically it is re-creating the single half-move token
        this._game.startPosition();
        let move: MoveOnBoard | undefined = undefined
        let moveToken: string = ''
        let firstComment: string = ''
        let moveEvaluation: ChessMoveEvaluation | undefined = undefined
        let positionalEvaluation: ChessPositionalEvaluation | undefined = undefined
        let isNovelty: boolean | undefined = undefined
        for (let token of this._scanData.tokens) {
            switch (token.key) {
                case Token.MoveNumberBlack:
                    if (moveToken != '') {
                        if (!this._game.chessBoard.move(moveToken)) throw new Error('illegal move')
                        move = this._game.chessBoard.currentMove
                        if (!move) throw new Error('illegal move')
                        move.moveEvaluation = moveEvaluation
                        move.positionalEvaluation = positionalEvaluation
                        move.isNovelty = isNovelty
                        if (firstComment != '') {
                            move!.comment = firstComment
                            firstComment = ''
                        }
                        moveToken = ''
                        moveEvaluation = undefined
                        positionalEvaluation = undefined
                        isNovelty = undefined
                    }
                    break
                case Token.MoveNumber: // ignore
                    break
                case Token.Comment:
                    if (move) {
                        if (moveToken) {
                            let r = this._game.chessBoard.move(moveToken)
                            if (!r) throw new Error('illegal move')
                            move = this._game.chessBoard.currentMove
                            if (!move) throw new Error('illegal move')
                            move.moveEvaluation = moveEvaluation
                            move.positionalEvaluation = positionalEvaluation
                            move.isNovelty = isNovelty
                            moveToken = ''
                            moveEvaluation = undefined
                            positionalEvaluation = undefined
                            isNovelty = undefined
                            if (firstComment != '') {
                                move.comment = firstComment + token.value
                                firstComment = ''
                            }
                            else
                                move.comment = token.value
                        }
                        else { // this move has already been set
                            move.comment = token.value
                        }
                    }
                    else // if this is a comment without a move before append it to the next move
                        firstComment = token.value
                    break
                case Token.MoveBlock: // ignore
                    break;
                case Token.BlacksMove:
                    if (moveToken != '') {
                        let r = this._game.chessBoard.move(moveToken)
                        if (!r) throw new Error('illegal move')
                        move = this._game.chessBoard.currentMove
                        if (!move) throw new Error('illegal move')
                        move.moveEvaluation = moveEvaluation
                        move.positionalEvaluation = positionalEvaluation
                        move.isNovelty = isNovelty
                        moveToken = ''
                        moveEvaluation = undefined
                        positionalEvaluation = undefined
                        isNovelty = undefined
                    }
                    break
                case Token.WhitesMove:
                    if (moveToken != '') {
                        if (!this._game.chessBoard.move(moveToken)) throw new Error('illegal move')
                        move = this._game.chessBoard.currentMove
                        if (!move) throw new Error('illegal move')
                        move.moveEvaluation = moveEvaluation
                        move.positionalEvaluation = positionalEvaluation
                        move.isNovelty = isNovelty
                        if (firstComment != '') {
                            move!.comment = firstComment
                            firstComment = ''
                        }
                        moveToken = ''
                        moveEvaluation = undefined
                        positionalEvaluation = undefined
                        isNovelty = undefined
                    }
                    break;
                case Token.CastleLong:
                    moveToken = 'O-O-O'
                    break;
                case Token.CastleShort:
                    moveToken = 'O-O'
                    break;
                case Token.Piece:
                    moveToken = token.value
                    break;
                case Token.Source:
                    moveToken += token.value.trimStart()
                    break;
                case Token.Target:
                    moveToken += token.value
                    break;
                case Token.Captures: // ignore, Board keeps track of it
                    break;
                case Token.Promotes:
                    moveToken += ('=' + token.value)
                    break;
                case Token.Check:
                    moveToken += '+'
                    break;
                case Token.Mate:
                    moveToken += '#'
                    break;
                case Token.MoveEval:
                    moveEvaluation = MOVE_EVALS.find(x => x.str == token.value)?.id
                    break;
                case Token.PositionalEval:
                    positionalEvaluation = POSITIONAL_EVALS.find(x => x.str == token.value)?.id
                    break;
                case Token.Novelty:
                    //this._game.setMoveIsNovelty();
                    break;
            }
        }
        if (moveToken != '') {
            if (!this._game.chessBoard.move(moveToken)) throw new Error('illegal move')
            move = this._game.chessBoard.currentMove
            if (!move) throw new Error('illegal move')
            move.moveEvaluation = moveEvaluation
            move.positionalEvaluation = positionalEvaluation
            move.isNovelty = isNovelty
            if (firstComment != '') {
                move!.comment = firstComment
                firstComment = ''
            }
            moveToken = ''
            moveEvaluation = undefined
            positionalEvaluation = undefined
            isNovelty = undefined
        }
    }
}