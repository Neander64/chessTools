//import * as yargs from 'yargs'
//import * as fsp from "fs/promises"
import { writeFile } from "fs"
import { Fen, FenBoard } from "./chess-game/FEN/Fen"
import { ChessGamePgn } from "./chess-game/PGN/ChessGame-PGN"
import { PgnDatabase } from "./chess-game/PGN/PgnDatabase"
import { PgnDate } from "./chess-game/PGN/PgnDate"
import { PgnTimeControl } from "./chess-game/PGN/PgnTimeControl"
//import * as os from "os"
//import * as path from "path"
//import * as chessGame from "./chess-game"
//import { parseChessable as Parser } from "./parseChessable"
//import * as chessBoard from "./chess-game/chess-board/ChessBoard"
//import { Piece, pieceKind } from './chess-board-pieces'

//import * as repl from "repl"
//import { ChessGame } from "./chess-game/ChessGame"
//import { parseChessable } from "./fromText/parseChessable"
import { chessable } from "./fromText/chessable"
// import { readdir } from "fs/promises"
// import { resolve } from "path"

//let args = yargs.option('input', { alias: 'i', demand: true }).argv;
//console.log(JSON.stringify(args));

let pgnDate = new PgnTimeControl()
pgnDate.set('400:-')
console.log(pgnDate.get())
//chessable.generateEmptyTextFiles2("Sam Black Semi-Slav", 18, "Cambridge Springs (7.Nd2 Bb4)", 1, 28)
//chessable.generateEmptyTextFiles(chessable.DATA_PATH + "/Sam I 1.d4 Sidelines/22 Englund Gambit/orig", "Englund Gambit", 1, 23)

//chessable.convertTxt2PGNRecursive(chessable.DATA_PATH + '/Sam Black Classical Sicilian/')
//chessable.convertTxt2PGNRecursive(chessable.DATA_PATH + '/Sam Black Semi-Slav/')
//chessable.convertTxt2PGNRecursive('/data/Sam Black Semi-Slav/19 Botvinnik System (alternative)/orig/')



/*
process.exit()



const prompt = 'ChessTools >'
let cb = new chessBoard.ChessBoard()
cb.loadFEN(cb.initialBoardFEN);
const replServer = repl.start({ prompt: prompt, useColors: true }) // .context.m = msg

replServer.defineCommand('move', {
    help: 'move <SAN>',
    action(m) {
        this.clearBufferedCommand()
        console.log(cb.move(m))
        console.log(cb.toASCII())
        this.displayPrompt()
    }
})
replServer.defineCommand('FEN', {
    help: 'FEN <FEN-String>',
    action(fen) {
        this.clearBufferedCommand()
        console.log(cb.loadFEN(fen))
        console.log(cb.toASCII())
        this.displayPrompt()
    }
})
replServer.defineCommand('getFEN', function getFEN() {
    this.clearBufferedCommand()
    console.log(cb.getFEN())
    this.displayPrompt()
})
replServer.defineCommand('board', function display() {
    this.clearBufferedCommand()
    console.log(cb.toASCII())
    this.displayPrompt()
})
replServer.defineCommand('clear', function display() {
    this.clearBufferedCommand()
    console.log(cb.clearBoard())
    this.displayPrompt()
})

replServer.defineCommand('test', function getFEN() {
    this.clearBufferedCommand()
    cb.loadFEN("rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PPP/R1BQ1RK1 b kq e3 4 8")
    console.log(cb.toASCII())
    this.displayPrompt()
})

replServer.on('exit', () => {
    process.exit()
})
*/

/*
var cb = new chessBoard.ChessBoard("rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PP1/R1BQ1RK1 b kq e3 4 8");
cb.loadFEN(cb.initialBoardFEN);
console.log(cb.move('Nf3'))
console.log(cb.move('Nf6'))
console.log(cb.move('Ng1'))
console.log(cb.move('Ng8'), '#1')

console.log(cb.move('Nf3'))
console.log(cb.move('Nf6'))
console.log(cb.move('Ng1'))
console.log(cb.move('Ng8'), '#2')

console.log('rep', cb.data.drawPossibleThreefoldRepetion) // false
console.log(cb.move('Nf3'))
console.log('rep', cb.data.drawPossibleThreefoldRepetion) // true
console.log(cb.move('Nf6'))
console.log(cb.move('Ng1'))
console.log(cb.move('Ng8'), '#3')

console.log(cb.move('Nf3'))
console.log(cb.move('Nf6'))
console.log(cb.move('Ng1'))
console.log(cb.move('Ng8'), '#4')

console.log(cb.move('Nf3')) // game ends #5 repetition
console.log(cb.move('Nf6')) // false
*/

/*
let b = chessBoard.EncodedPositionKey.encodeBoard(cb.board, cb.data, chessBoard.encodeType.Simple) as number[]
//console.log(b)
for (let x of b)
    console.log(x.toString(2).padStart(10, '0'))
console.log(b.length)
let a = chessBoard.EncodedPositionKey.encodeBoard(cb.board, cb.data, chessBoard.encodeType.BoardLikeBigInt)
console.log("BigInt:", a.toString(2))
console.log("BigInt:", a.toString(16))

let b2 = chessBoard.EncodedPositionKey.encodeBoard(cb.board, cb.data, chessBoard.encodeType.BoardLike) as number[]
//console.log(b2)
for (let x of b2)
    console.log(x.toString(2).padStart(32, '0'))
console.log(b2.length)

let b3 = chessBoard.EncodedPositionKey.encodeBoard(cb.board, cb.data, chessBoard.encodeType.FENlikeLong) as number[]
//console.log(b2)
for (let x of b3)
    console.log(x.toString(2).padStart(32, '0'))
console.log(b3.length)
let a3 = chessBoard.EncodedPositionKey.encodeBoard(cb.board, cb.data, chessBoard.encodeType.FENlikeLongBigInt) as BigInt
console.log("BigInt:", a3.toString(2))
console.log("BigInt:", a3.toString(16))
*/

/*
let sourceValues: number[] = []
// bValues.push((piece.R << 6) | field.a1)
// bValues.push((piece.N << 6) | field.b1)
// bValues.push((piece.B << 6) | field.c1)
// bValues.push((piece.Q << 6) | field.d1)
// bValues.push((piece.K << 6) | field.e1)
sourceValues.push(0x3ff)
sourceValues.push(0x00)
sourceValues.push(0x3ff)
sourceValues.push(0x00)
sourceValues.push(0x3ff)
sourceValues.push(0x00)
sourceValues.push(0x3ff)
sourceValues.push(0x00)
sourceValues.push(0x3ff)

const bitLenSource = 10
for (let x of sourceValues)
    console.log(x.toString(2).padStart(bitLenSource, '0'))

const bytesPerTarget = 4
const bitLenTarget = bytesPerTarget * 8
const byteLenTarget = Math.ceil((sourceValues.length * bitLenSource) / bitLenTarget) * bytesPerTarget
console.log("Source length", sourceValues.length, bitLenSource, bitLenTarget)
console.log("byteLenTarget: ", byteLenTarget)
let dataTarget = new ArrayBuffer(byteLenTarget)
let view = new DataView(dataTarget)

let pos = 0
let leftVal = 0x00
let rightVal = 0x00
let availableBits = bitLenTarget
let nextTargetVal = 0x00
let leftOverSource = 0
let hasData = false
for (let x of sourceValues) {
    let leftOverTarget = availableBits - bitLenSource
    console.log("source value", x, leftOverTarget)
    if (leftOverTarget >= 0) {
        nextTargetVal |= (x << leftOverTarget)
        availableBits = leftOverTarget
        hasData = true
    }
    else {
        leftOverSource = bitLenSource - availableBits
        leftVal = x >> leftOverSource
        rightVal = x ^ (leftVal << leftOverSource)
        nextTargetVal |= leftVal
        availableBits = 0
        hasData = true
    }
    if (availableBits == 0) {
        console.log("writing: ", nextTargetVal.toString(2).padStart(bitLenTarget, '0'), pos * bytesPerTarget)
        view.setUint32(pos++ * bytesPerTarget, nextTargetVal)
        nextTargetVal = 0x00
        availableBits = bitLenTarget
        if (leftOverSource > 0) {
            availableBits = bitLenTarget - leftOverSource
            nextTargetVal |= rightVal << availableBits
            leftOverSource = 0
            hasData = true
        }
    }
}
if (hasData) {
    console.log("writing: ", nextTargetVal.toString(2).padStart(bitLenTarget, '0'), pos * bytesPerTarget)
    view.setUint32(pos++ * bytesPerTarget, nextTargetVal)
}

console.log("Uint16 written: ", pos)
for (let i = 0; i < byteLenTarget / bytesPerTarget; i++) {
    let r = view.getUint32(i * bytesPerTarget)
    console.log(r.toString(2).padStart(bitLenTarget, '0'), i * bytesPerTarget)
}
*/
/*
const data = new Uint16Array(bValues)
bValues.forEach(x => console.log(x, x.toString(2), x.toString(16)))
console.log(data)
console.log(data.length)
console.log(data.byteLength, data.BYTES_PER_ELEMENT)
*/
// (6pieces + color + field(64)) * 32 (ordered white, r,n,b,q,k,p, black ...) = (4+6) * 32 bit = 40 Byte
// 0b0010 : R
// 0b0100 : N
// 0b0110 : B
// 0b1000 : Q
// 0b1010 : K
// 0b1100 : P
// 0b0011 : r
// 0b0101 : n
// 0b0111 : b
// 0b1001 : q
// 0b1011 : k
// 0b1101 : p
// Fields: 6 bit
// 0b


// var cb = new chessBoard.ChessBoard("rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PP1/R1BQ1RK1 b kq e3 4 8");
// cb.loadFEN(cb.initialBoardFEN);
// cb.loadFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPP1/RNBQKBNR w KQkq - 0 1")
// console.log(cb.toASCII())
// console.log(cb.getLegalMoves())
// console.log(cb.move('Rh4'))
//cb.loadFEN("8/8/8/7R/pkp5/Pn6/1P6/K7 b - - 0 100")
//cb.loadFEN("5rk1/5p1p/5B2/8/8/8/8/K5R1 b - - 0 100")
//cb.loadFEN("5rk1/5p1p/5p1B/8/8/8/8/K6R w - - 0 100")
//console.log(cb.isPieceAttackedOn({ colIdx: 4, rowIdx: 2 }, chessBoard.color.white))
//console.log(chessBoard.fieldIdxArrToNotation(cb.getAttackedFields(chessBoard.color.white).attackedFields()))
// console.log(cb.data)
// console.log(cb.isCheck())
// console.log(cb.isMate())
// console.log(cb.isGameOver())
//console.log(cb.toASCII())
//console.log(cb.getAttackersOn({ colIdx: 7, rowIdx: 1 }, chessBoard.color.white))
//cb.loadFEN("k7/7P/8/8/8/8/8/K7 w K - 4 50")

//console.log(cb.move('h8=Q'))
//console.log(cb.toASCII())
//console.log(cb.currentPieceSpectrum())
//console.log(cb.getFEN())
//cb.loadFEN("r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5n2/PPPP1PPP/RnBQKB1R w KQkq - 2 3")
//console.log(cb.move('Bb5'))
//console.log(cb.move("e2e4"))
//console.log(cb.move("ee5"))
//console.log(cb.move("N1f3"))

//cb.loadFEN("rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PPP/R1BQ1RK1 b kq - 4 8");
//cb.loadFEN(cb.initialBoardFEN);
//cb._movePiece(cb.peekFieldPiece(chessBoard.strToFieldIdx('e2')), chessBoard.strToFieldIdx('e4'));
//cb._movePiece(cb.peekFieldPiece(chessBoard.strToFieldIdx('e7')), chessBoard.strToFieldIdx('e5'));

//cb._moveWithPromotion(cb.peekFieldPiece(chessBoard.strToFieldIdx('d7')), chessBoard.strToFieldIdx('d8'), chessBoard.charToPiece('Q').piece);
//cb.moveCastle(chessBoard.color.black, chessBoard.castleType.short);

//cb.loadFEN("7k/8/8/2p1b3/8/8/8/7K b - b3 4 50");
//cb.setPiece('e', '5', chessBoard.piece.whitePawn);
//cb.loadFEN("k7/8/8/8/6p1/8/7P/K7 w K - 4 50");
//cb.loadFEN("k7/8/8/8/8/p7/P7/K7 w K - 4 50");
//cb.loadFEN("k7/8/8/8/7p/8/6P1/K7 w K - 4 50");
//cb.loadFEN("k7/8/8/8/7p/8/6P1/K7 w K - 4 50");
//cb.loadFEN("k7/8/6P1/8/7N/8/8/K7 w K - 4 50");
//cb.loadFEN("k7/8/6P1/8/6Q1/8/8/K7 w K - 4 50");
//console.log(cb.performMovePiece(cb.peekFieldPiece(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('g1')));

/*
console.log(cb.toASCII())
console.log(cb.getFEN())
console.log(cb.move(chessBoard.strToFieldIdx('e5'), chessBoard.strToFieldIdx('a1')))
//console.log(cb.move(chessBoard.strToFieldIdx('h1'), chessBoard.strToFieldIdx('h2')))
console.log(cb.move(chessBoard.strToFieldIdx('h1'), chessBoard.strToFieldIdx('h2')))
console.log(cb.move(chessBoard.strToFieldIdx('a1'), chessBoard.strToFieldIdx('e5')))
console.log(cb.move(chessBoard.strToFieldIdx('h2'), chessBoard.strToFieldIdx('h3'), { validateOnly: true }))
console.log(cb.toASCII())
console.log(cb.getFEN())
*/
/*
cb.loadFEN("7k/8/8/2p1b3/8/7K/8/8 w - - 7 52");
console.log(cb.toASCII())
console.log(cb.isCheck(chessBoard.color.white))
*/
//console.log(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, false));
//console.log(cb.performMovePawn(chessBoard.strToFieldIdx('g2'), chessBoard.strToFieldIdx('g4')));
//console.log(cb.performMovePawn(chessBoard.strToFieldIdx('h4'), chessBoard.strToFieldIdx('g3')));
//console.log(cb.toASCII());

//console.log(cb.field('h', '8'));
//console.log(cb.isPossibleKingMove(cb.fieldIdx('e', '7'), cb.fieldIdx('e', '8')));
//let cpb = cb.currentPiecesOnBoard(chessBoard.color.white);
//console.log(cpb);

//let it = new chessBoard.KnightMovesRaw({ colIdx: 0, rowIdx: 0 });
//console.log(it.moves);
//let source = cb.fieldIdx('f', '8');
//let target = cb.fieldIdx('h', '2');
//console.log(cb.getAttackedFields(chessBoard.color.black).attackedFields());
//console.log(cb.isMate(chessBoard.color.white));
//console.log(target,cb.attackersOn(target,chessBoard.color.black));
//console.log(cb.getLegalMovesByWhiteKing())
//console.log(cb.getLegalMovesByBlackKing())

/*
let ray = chessBoard.isOffsetRookLike(source, target);
console.log(source, target, ray);
if (ray.valid) {
    let it = new chessBoard.RookRayIt(source, ray.ray as chessBoard.rookRay);
    console.log(Array.from(it));
}
*/

/*
const dirPath = path.join(process.cwd(), 'data/Sam I 1.d4 Sidelines');
async function readdirRecursive(dir: string): Promise<string[]> {
    var result: string[] = [];
    try {
        const files = await fsp.readdir(dir);
        for await (const file of files) {
            const f = path.join(dir, file);
            const stat = await fsp.stat(f);
            if (stat.isDirectory()) {
                let subFiles = await readdirRecursive(f);
                result = result.concat(subFiles);
            }
            else {
                result.push(f);
            }
        }
    } catch (err) {
        console.error(err);
    }
    return result;
}
let result = readdirRecursive(dirPath);
result.then(data => {
    for (const f of data) {
        convertTxt2Pgn(f);
    }
});

function convertTxt2Pgn(file: string) {
    const ext = path.extname(file);
    if (ext == '.txt') {
        const newFile = path.join(path.dirname(file), path.basename(file, '.txt') + '.pgn');
        console.log("processing " + newFile + '...');
        var gameArray = fs.readFileSync(file).toString().split("\n");
        var game: chessGame.ChessGame = new chessGame.ChessGame;
        var p: Parser = new Parser(game);
        p.scanGameText(gameArray);
        let pgn = new chessGame.pgn(game);
        var pgnArray = pgn.exportPGN();
        var pgnFile = fs.createWriteStream(newFile, { flags: 'w' });
        for (let a of pgnArray) {
            pgnFile.write(a + os.EOL);
        }
        pgnFile.end();
    }
}
/*


/*
var gameArray = fs.readFileSync('data/slav#3.txt').toString().split("\n");
var game: chessGame.ChessGame = new chessGame.ChessGame;
var p: Parser = new Parser(game);
let result = p.scanGameText(gameArray);
let pgn = new chessGame.pgn(game);

var pgnArray = pgn.exportPGN();

const EOL = '\n'; // ToDo verify this works for other systems (like windows), os.EOL!!
var pgnFile = fs.createWriteStream('data/slav#3.pgn', { flags: 'w' });
for (let a of pgnArray) {
pgnFile.write(a + EOL);
console.log(a);
}
pgnFile.end();
*/

//var args = process.argv.slice(2);
/*
var game: chessGame.ChessGame = new chessGame.ChessGame;
var p: Parser = new Parser(game);
//let result = p.scanGameText(["1.e4e5","comment"," another comment","2.Nf3"]);
let result = p.scanGameText([
    "1.d4d52.c4c6",
    "The Slav has always been one of Black's most solid choices against 1.d4, and it is the move order I recommended in my Semi-Slav course https://www.chessable.com/lifetime-repertoires-semi-slav/course/31529/. The way I advocate playing does a very good job steering the game into Semi-Slav territory, and it avoids a lot of Black's other options.",
    "3.Nc3",
    "3.Nf3 Is quite a bit more common, but I like this move order.With 3. Nc3 and 4.e3, White avoids all kinds of Bc8 - f5 or g4 options.Black does not HAVE to go for a Semi - Slav, but his other options look pretty soft to me.A key point of understanding these positions is knowing when to take on d5.It's a pretty common move to make whenever Black touches his c8-bishop, as then the b7-pawn will become weak after a subsequent Qd1-b3. It's also generally a good move if Black plays Nb8 - d7, as the knight really belongs on c6 in all of the Exchange Slav structures.",
    "3...e64.e3",
    "Black should probably play Ng8 - f6 here, again transposing to the Semi - Slav, but he does have another option.",
    "4...f5",
    "This has seen play from time to time.I find it to be a poor version of the Stonewall plan I was advocating in the Semi - Slav course.",
    "5.Nf3Nd7",
    "I have also seen this move played with the idea of developing the g8 - knight to h6, but I find it unimpressive.",
    "6.Bd3Nh6",
    "Black's play is not totally senseless. He is looking to play Bf8-d6, O-O and will always have Nh6-f7 available to prevent White from landing a knight on e5. But, I think we can take advantage of the knight committing to h6 so soon.",
    "7.Qc2!?",
    "White prepares castling long.",
    "7...Bd68.Bd2O - O9.O - O - O",
    "In general, I think castling long against the Stonewall tends to be unimpressive because a knight landing on e4 will be colossally annoying with f2 hanging.But, Black's knight on h6 is obviously misplaced for such a task! White can look to prepare a kingside attack with h2-h3 and g2-g4, and I think Black is too slow to make anything too annoying happen.",
]);
console.log(game);
let pgn = new chessGame.pgn(game);
console.log(pgn.exportPGN());
*/