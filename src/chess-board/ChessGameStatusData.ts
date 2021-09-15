import { color } from '../chess-color';
import { castleType, CastleFlags } from "./chess-board-pieces/CastleFlags";
import { IField } from "./representation/IField";
import { GameResult } from './GameResult';


export class ChessGameStatusData {
    get isWhitesMove() { return this.nextMoveBy == color.white; }
    castleFlags: CastleFlags;
    get enPassantPossible(): boolean { return typeof this.enPassantField !== 'undefined'; }
    enPassantField?: IField;

    firstMoveBy!: color;
    nextMoveBy!: color;
    halfMoves50!: number;
    firstHalfMoves50!: number;
    moveNumber!: number;
    firstMoveNumber!: number;

    gameOver!: boolean; // meaning: no further moves are allowed.
    gameResult!: GameResult;
    drawPossible50MovesRule!: boolean;
    drawPossibleThreefoldRepetion!: boolean;
    isCheck!: boolean;
    isMate!: boolean;
    constructor() {
        this.castleFlags = new CastleFlags();
        this.init();
    }
    init() {
        this.nextMoveBy = color.white;
        this.firstMoveBy = color.white;
        this.castleFlags.noCastle(color.white);
        this.castleFlags.noCastle(color.black);
        this.enPassantField = undefined;
        this.halfMoves50 = 0;
        this.firstHalfMoves50 = 0;
        this.moveNumber = 1;
        this.firstMoveNumber = 1;
        this.gameOver = true;
        this.gameResult = GameResult.none;
        this.drawPossible50MovesRule = false;
        this.drawPossibleThreefoldRepetion = false;
        this.isCheck = false;
        this.isMate = false;
    }
    canCastle(color_: color, type_: castleType): boolean { return this.castleFlags.getCastleFlag(color_, type_); }
    copy(): ChessGameStatusData {
        let result = new ChessGameStatusData();
        result.castleFlags = new CastleFlags(this.castleFlags);
        result.enPassantField = this.enPassantField;
        result.firstMoveBy = this.firstMoveBy;
        result.nextMoveBy = this.nextMoveBy;
        result.halfMoves50 = this.halfMoves50;
        result.firstHalfMoves50 = this.firstHalfMoves50;
        result.moveNumber = this.moveNumber;
        result.firstMoveNumber = this.firstMoveNumber;
        result.gameOver = this.gameOver;
        result.gameResult = this.gameResult;
        result.drawPossible50MovesRule = this.drawPossible50MovesRule;
        result.drawPossibleThreefoldRepetion = this.drawPossibleThreefoldRepetion;
        result.isCheck = this.isCheck;
        result.isMate = this.isMate;
        return result;
    }
}
