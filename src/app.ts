//import * as yargs from 'yargs'
import * as fsp from "fs/promises"
import * as fs from "fs"
import * as os from "os"
import * as path from "path"
import * as chessGame from "./chess-game"
import { parseChessable as Parser } from "./parseChessable"
import * as chessBoard from "./chess-board"

//let args = yargs.option('input', { alias: 'i', demand: true }).argv;
//console.log(JSON.stringify(args));


var cb = new chessBoard.ChessBoard();
//cb.loadFEN("rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PPP/R1BQ1RK1 b kq - 4 8");
cb.loadFEN(cb.initialBoardFEN);
//cb.loadFEN("7k/8/8/2pb4/8/8/8/7K b - - 4 50");
//cb.setPiece('e', '5', chessBoard.piece.whitePawn);
console.log(cb.toASCII());
//console.log(cb.field('h', '8'));
//console.log(cb.isPossibleKingMove(cb.fieldIdx('e', '7'), cb.fieldIdx('e', '8')));
//let cpb = cb.currentPiecesOnBoard(chessBoard.color.white);
//console.log(cpb);

//let it = new chessBoard.KnightMovesRaw({ colIdx: 0, rowIdx: 0 });
//console.log(it.moves);
let source = cb.fieldIdx('f', '8');
let target = cb.fieldIdx('h', '2');
console.log(cb.getAttackedFields(chessBoard.color.black).attackedFields());
console.log(cb.isCheck(chessBoard.color.white));

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