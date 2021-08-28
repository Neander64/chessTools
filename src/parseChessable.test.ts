import { parseChessable as Parser } from "./parseChessable"
import * as chessGame from "./chess-game"

describe('Testing parseChessable2pgn', () => {

    test('testing empty game', () => {
        var game: chessGame.ChessGame = new chessGame.ChessGame;
        var parser: Parser = new Parser(game);
        parser.scanGameText([]);
        expect(game).toMatchInlineSnapshot(`
ChessGame {
  "_isTmpInitial": true,
  "_moveNumber": 1,
  "_nextColor": "white",
  "_tmpMove": ChessHalfMove {
    "moveNumber": 0,
  },
  "black": "?",
  "date": "????.??.??",
  "event": "?",
  "moves": Array [],
  "result": "*",
  "round": "?",
  "site": "?",
  "white": "?",
}
`);
    });

    test('testing syntactically legal move variations', () => {
        var game: chessGame.ChessGame = new chessGame.ChessGame;
        var parser: Parser = new Parser(game);
        parser.scanGameText([
            "1.e4c5", "",
            "2.O-O", "2.b4 is an alternative",
            "2...O-O-O+",
            "3.fxg5h8=Q", "4. some comment",
            "4.gxh8=Na1=R+",
            "5.N1f2!Rhg3#",
            "6.N1f2!!Rgg3?⩲",
            "7.a4"
        ]);
        expect(game).toMatchInlineSnapshot(`
ChessGame {
  "_isTmpInitial": true,
  "_moveNumber": 2,
  "_nextColor": "black",
  "_tmpMove": ChessHalfMove {
    "moveNumber": 0,
  },
  "black": "?",
  "date": "????.??.??",
  "event": "?",
  "moves": Array [
    ChessHalfMove {
      "color": "white",
      "moveNumber": 1,
      "piece": "P",
      "targetField": Object {
        "column": "e",
        "row": "4",
      },
    },
    ChessHalfMove {
      "color": "black",
      "comment": "",
      "moveNumber": 1,
      "piece": "P",
      "targetField": Object {
        "column": "c",
        "row": "5",
      },
    },
    ChessHalfMove {
      "castleShort": true,
      "color": "white",
      "comment": "2.b4 is an alternative2...O-O-O+3.fxg5h8=Q4. some comment4.gxh8=Na1=R+5.N1f2!Rhg3#6.N1f2!!Rgg3?⩲7.a4",
      "moveNumber": 2,
      "piece": "P",
    },
  ],
  "result": "*",
  "round": "?",
  "site": "?",
  "white": "?",
}
`);
    });

    test('testing comment line variations', () => {
        var game: chessGame.ChessGame = new chessGame.ChessGame;
        var parser: Parser = new Parser(game);
        parser.scanGameText([
            "1.e4abce5", // should be a comment
        ]);
        expect(game).toMatchInlineSnapshot(`
ChessGame {
  "_isTmpInitial": true,
  "_moveNumber": 1,
  "_nextColor": "white",
  "_tmpMove": ChessHalfMove {
    "comment": "1.e4abce5",
    "moveNumber": 0,
  },
  "black": "?",
  "date": "????.??.??",
  "event": "?",
  "moves": Array [],
  "result": "*",
  "round": "?",
  "site": "?",
  "white": "?",
}
`);
    });
    test('testing comment line variations', () => {
        var game: chessGame.ChessGame = new chessGame.ChessGame;
        var parser: Parser = new Parser(game);
        parser.scanGameText([
            "1.e4c5", "2.e4sdf" // Characters after move, should be comment
        ]);
        expect(game).toMatchInlineSnapshot(`
ChessGame {
  "_isTmpInitial": true,
  "_moveNumber": 2,
  "_nextColor": "white",
  "_tmpMove": ChessHalfMove {
    "moveNumber": 0,
  },
  "black": "?",
  "date": "????.??.??",
  "event": "?",
  "moves": Array [
    ChessHalfMove {
      "color": "white",
      "moveNumber": 1,
      "piece": "P",
      "targetField": Object {
        "column": "e",
        "row": "4",
      },
    },
    ChessHalfMove {
      "color": "black",
      "comment": "2.e4sdf",
      "moveNumber": 1,
      "piece": "P",
      "targetField": Object {
        "column": "c",
        "row": "5",
      },
    },
  ],
  "result": "*",
  "round": "?",
  "site": "?",
  "white": "?",
}
`);
    });

    test('testing comment line variations', () => {
        var game: chessGame.ChessGame = new chessGame.ChessGame;
        var parser: Parser = new Parser(game);
        parser.scanGameText([
            "1.e4c5", "2.e4sdf", "second comment" // append next comment
        ]);
        expect(game).toMatchInlineSnapshot(`
ChessGame {
  "_isTmpInitial": true,
  "_moveNumber": 2,
  "_nextColor": "white",
  "_tmpMove": ChessHalfMove {
    "moveNumber": 0,
  },
  "black": "?",
  "date": "????.??.??",
  "event": "?",
  "moves": Array [
    ChessHalfMove {
      "color": "white",
      "moveNumber": 1,
      "piece": "P",
      "targetField": Object {
        "column": "e",
        "row": "4",
      },
    },
    ChessHalfMove {
      "color": "black",
      "comment": "2.e4sdfsecond comment",
      "moveNumber": 1,
      "piece": "P",
      "targetField": Object {
        "column": "c",
        "row": "5",
      },
    },
  ],
  "result": "*",
  "round": "?",
  "site": "?",
  "white": "?",
}
`);
    });


    test('testing comment line variations', () => {
        var game: chessGame.ChessGame = new chessGame.ChessGame;
        var parser: Parser = new Parser(game);
        parser.scanGameText([
            "1.e4c5", "2.e4sdf" // Characters after move, should be comment
        ]);
        expect(game).toMatchInlineSnapshot(`
ChessGame {
  "_isTmpInitial": true,
  "_moveNumber": 2,
  "_nextColor": "white",
  "_tmpMove": ChessHalfMove {
    "moveNumber": 0,
  },
  "black": "?",
  "date": "????.??.??",
  "event": "?",
  "moves": Array [
    ChessHalfMove {
      "color": "white",
      "moveNumber": 1,
      "piece": "P",
      "targetField": Object {
        "column": "e",
        "row": "4",
      },
    },
    ChessHalfMove {
      "color": "black",
      "comment": "2.e4sdf",
      "moveNumber": 1,
      "piece": "P",
      "targetField": Object {
        "column": "c",
        "row": "5",
      },
    },
  ],
  "result": "*",
  "round": "?",
  "site": "?",
  "white": "?",
}
`);
    });

    test('testing comment line variations', () => {
        var game: chessGame.ChessGame = new chessGame.ChessGame;
        var parser: Parser = new Parser(game);
        parser.scanGameText([
            "e4Nxc5", // missing line number 
        ]);
        expect(game).toMatchInlineSnapshot(`
ChessGame {
  "_isTmpInitial": true,
  "_moveNumber": 1,
  "_nextColor": "white",
  "_tmpMove": ChessHalfMove {
    "comment": "e4Nxc5",
    "moveNumber": 0,
  },
  "black": "?",
  "date": "????.??.??",
  "event": "?",
  "moves": Array [],
  "result": "*",
  "round": "?",
  "site": "?",
  "white": "?",
}
`);
    });

    test('testing comment line variations', () => {
        var game: chessGame.ChessGame = new chessGame.ChessGame;
        var parser: Parser = new Parser(game);
        parser.scanGameText([
            "1.e4e5", "2.e4Nxc53.", // missing content
        ]);
        expect(game).toMatchInlineSnapshot(`
ChessGame {
  "_isTmpInitial": true,
  "_moveNumber": 2,
  "_nextColor": "white",
  "_tmpMove": ChessHalfMove {
    "moveNumber": 0,
  },
  "black": "?",
  "date": "????.??.??",
  "event": "?",
  "moves": Array [
    ChessHalfMove {
      "color": "white",
      "moveNumber": 1,
      "piece": "P",
      "targetField": Object {
        "column": "e",
        "row": "4",
      },
    },
    ChessHalfMove {
      "color": "black",
      "comment": "2.e4Nxc53.",
      "moveNumber": 1,
      "piece": "P",
      "targetField": Object {
        "column": "e",
        "row": "5",
      },
    },
  ],
  "result": "*",
  "round": "?",
  "site": "?",
  "white": "?",
}
`);
    });

    test('testing comment line variations', () => {
        var game: chessGame.ChessGame = new chessGame.ChessGame;
        var parser: Parser = new Parser(game);
        parser.scanGameText([
            "1.e4e5",
            "2.e4=e5", // promotion without piece
        ]);
        expect(game).toMatchInlineSnapshot(`
ChessGame {
  "_isTmpInitial": true,
  "_moveNumber": 2,
  "_nextColor": "white",
  "_tmpMove": ChessHalfMove {
    "moveNumber": 0,
  },
  "black": "?",
  "date": "????.??.??",
  "event": "?",
  "moves": Array [
    ChessHalfMove {
      "color": "white",
      "moveNumber": 1,
      "piece": "P",
      "targetField": Object {
        "column": "e",
        "row": "4",
      },
    },
    ChessHalfMove {
      "color": "black",
      "comment": "2.e4=e5",
      "moveNumber": 1,
      "piece": "P",
      "targetField": Object {
        "column": "e",
        "row": "5",
      },
    },
  ],
  "result": "*",
  "round": "?",
  "site": "?",
  "white": "?",
}
`);
    });

    test('testing syntactically illegal move variations', () => {
        var game: chessGame.ChessGame = new chessGame.ChessGame;
        var parser: Parser = new Parser(game);
        parser.scanGameText([
            "1.e4e5",
            "2.e4NNxc5N", // handle Novelties is a bit tricky
            "3.e4Nxc5N", // second part is novelty
            "4.e4Nxc5", // no novelty
            "5.e4N1xc5", // no novelty
            "6.e4Nbxc5", // no novelty (ambigous situation "6.e4N bxc5" or "6.e4 Nbxc5")
            "7.e4NNxc5", // first part is novelty
        ]);
        expect(game).toMatchInlineSnapshot(`
ChessGame {
  "_isTmpInitial": true,
  "_moveNumber": 8,
  "_nextColor": "white",
  "_tmpMove": ChessHalfMove {
    "moveNumber": 0,
  },
  "black": "?",
  "date": "????.??.??",
  "event": "?",
  "moves": Array [
    ChessHalfMove {
      "color": "white",
      "moveNumber": 1,
      "piece": "P",
      "targetField": Object {
        "column": "e",
        "row": "4",
      },
    },
    ChessHalfMove {
      "color": "black",
      "moveNumber": 1,
      "piece": "P",
      "targetField": Object {
        "column": "e",
        "row": "5",
      },
    },
    ChessHalfMove {
      "color": "white",
      "isNovelty": true,
      "moveNumber": 2,
      "piece": "P",
      "targetField": Object {
        "column": "e",
        "row": "4",
      },
    },
    ChessHalfMove {
      "color": "black",
      "isCapture": true,
      "isNovelty": true,
      "moveNumber": 2,
      "piece": "N",
      "targetField": Object {
        "column": "c",
        "row": "5",
      },
    },
    ChessHalfMove {
      "color": "white",
      "moveNumber": 3,
      "piece": "P",
      "targetField": Object {
        "column": "e",
        "row": "4",
      },
    },
    ChessHalfMove {
      "color": "black",
      "isCapture": true,
      "isNovelty": true,
      "moveNumber": 3,
      "piece": "N",
      "targetField": Object {
        "column": "c",
        "row": "5",
      },
    },
    ChessHalfMove {
      "color": "white",
      "moveNumber": 4,
      "piece": "P",
      "targetField": Object {
        "column": "e",
        "row": "4",
      },
    },
    ChessHalfMove {
      "color": "black",
      "isCapture": true,
      "moveNumber": 4,
      "piece": "N",
      "targetField": Object {
        "column": "c",
        "row": "5",
      },
    },
    ChessHalfMove {
      "color": "white",
      "moveNumber": 5,
      "piece": "P",
      "targetField": Object {
        "column": "e",
        "row": "4",
      },
    },
    ChessHalfMove {
      "color": "black",
      "isCapture": true,
      "moveNumber": 5,
      "piece": "N",
      "sourceField": Object {
        "row": "1",
      },
      "targetField": Object {
        "column": "c",
        "row": "5",
      },
    },
    ChessHalfMove {
      "color": "white",
      "moveNumber": 6,
      "piece": "P",
      "targetField": Object {
        "column": "e",
        "row": "4",
      },
    },
    ChessHalfMove {
      "color": "black",
      "isCapture": true,
      "moveNumber": 6,
      "piece": "N",
      "sourceField": Object {
        "column": "b",
      },
      "targetField": Object {
        "column": "c",
        "row": "5",
      },
    },
    ChessHalfMove {
      "color": "white",
      "isNovelty": true,
      "moveNumber": 7,
      "piece": "P",
      "targetField": Object {
        "column": "e",
        "row": "4",
      },
    },
    ChessHalfMove {
      "color": "black",
      "isCapture": true,
      "moveNumber": 7,
      "piece": "N",
      "targetField": Object {
        "column": "c",
        "row": "5",
      },
    },
  ],
  "result": "*",
  "round": "?",
  "site": "?",
  "white": "?",
}
`);
    });

    test('testing example game', () => {
        var game: chessGame.ChessGame = new chessGame.ChessGame;
        var parser: Parser = new Parser(game);
        //parser.parseGameText([
        parser.scanGameText([
            "1.e4c5",
            "At this juncture, White's most challenging move by far is2.Nf3, leading to the Open Sicilian. I've always believed that playing anti-Sicilians with White is one of the best possible ways to limit yourself as a chess player because it not only gives up the fight for the opening advantage early on, but also deprives one of the opportunity to play the most beautifully dynamic and complicated middlegames in all of chess. As such, people who avoid 2.Nf3 and 3. d4 on a consistent basis tend to not reach their full potential as chess players. That said, it is our duty to play well with the black pieces regardless of what move comes from our opponents, and there are a lot of Anti-Sicilians to be ready for. In general, I think 2.c3 and 2.Nc3 deserve their own files, and this one will start off with all of the total nonsense.",
            "2.g3",
            "This has almost no independent value.",
            "2...Nc63.Bg2g6",
            "I suspect White would want to transpose to either a Closed Sicilian or a setup with d3+c3. The only try he has that does not transpose would be to setup with Ng1-e2 and try to play c2-c3 and d2-d4 in one move.",
            "4.Ne2Bg75.O-O",
            "This is actually a somewhat annoying move order. Black should not play e7-e6 as then c2-c3 and d2-d4 becomes pretty reasonable, but other moves force him to abandon his ideal setup. Still, I think this is a non-issue.",
            "5...e5!",
            "Black sets up a Botvinnik with Ng8-e7, d7-d6, and O-O next. In general, I am not thrilled about this setup against the Closed Sicilian since I believe White can punish it by setting up with f4, Nf3, and throwing a quick f4-f5, sacrificing a pawn. But a big part of that plan is the knight being on f3 so that it can go to h4 at a moment's notice, or even g5 in some cases. Now, that will not happen.",
            "6.d3Nge77.f4d68.Nbc3",
            "White should prefer a meek move like this one, but after castling, Black is obviously fine.",
            "8...O-O=",
        ]);
        expect(game).toMatchInlineSnapshot(`
ChessGame {
  "_isTmpInitial": true,
  "_moveNumber": 9,
  "_nextColor": "white",
  "_tmpMove": ChessHalfMove {
    "moveNumber": 0,
  },
  "black": "?",
  "date": "????.??.??",
  "event": "?",
  "moves": Array [
    ChessHalfMove {
      "color": "white",
      "moveNumber": 1,
      "piece": "P",
      "targetField": Object {
        "column": "e",
        "row": "4",
      },
    },
    ChessHalfMove {
      "color": "black",
      "comment": "At this juncture, White's most challenging move by far is2.Nf3, leading to the Open Sicilian. I've always believed that playing anti-Sicilians with White is one of the best possible ways to limit yourself as a chess player because it not only gives up the fight for the opening advantage early on, but also deprives one of the opportunity to play the most beautifully dynamic and complicated middlegames in all of chess. As such, people who avoid 2.Nf3 and 3. d4 on a consistent basis tend to not reach their full potential as chess players. That said, it is our duty to play well with the black pieces regardless of what move comes from our opponents, and there are a lot of Anti-Sicilians to be ready for. In general, I think 2.c3 and 2.Nc3 deserve their own files, and this one will start off with all of the total nonsense.",
      "moveNumber": 1,
      "piece": "P",
      "targetField": Object {
        "column": "c",
        "row": "5",
      },
    },
    ChessHalfMove {
      "color": "white",
      "comment": "This has almost no independent value.",
      "moveNumber": 2,
      "piece": "P",
      "targetField": Object {
        "column": "g",
        "row": "3",
      },
    },
    ChessHalfMove {
      "color": "black",
      "moveNumber": 2,
      "piece": "N",
      "targetField": Object {
        "column": "c",
        "row": "6",
      },
    },
    ChessHalfMove {
      "color": "white",
      "moveNumber": 3,
      "piece": "B",
      "targetField": Object {
        "column": "g",
        "row": "2",
      },
    },
    ChessHalfMove {
      "color": "black",
      "comment": "I suspect White would want to transpose to either a Closed Sicilian or a setup with d3+c3. The only try he has that does not transpose would be to setup with Ng1-e2 and try to play c2-c3 and d2-d4 in one move.",
      "moveNumber": 3,
      "piece": "P",
      "targetField": Object {
        "column": "g",
        "row": "6",
      },
    },
    ChessHalfMove {
      "color": "white",
      "moveNumber": 4,
      "piece": "N",
      "targetField": Object {
        "column": "e",
        "row": "2",
      },
    },
    ChessHalfMove {
      "color": "black",
      "moveNumber": 4,
      "piece": "B",
      "targetField": Object {
        "column": "g",
        "row": "7",
      },
    },
    ChessHalfMove {
      "castleShort": true,
      "color": "white",
      "comment": "This is actually a somewhat annoying move order. Black should not play e7-e6 as then c2-c3 and d2-d4 becomes pretty reasonable, but other moves force him to abandon his ideal setup. Still, I think this is a non-issue.",
      "moveNumber": 5,
      "piece": "P",
    },
    ChessHalfMove {
      "color": "black",
      "comment": "Black sets up a Botvinnik with Ng8-e7, d7-d6, and O-O next. In general, I am not thrilled about this setup against the Closed Sicilian since I believe White can punish it by setting up with f4, Nf3, and throwing a quick f4-f5, sacrificing a pawn. But a big part of that plan is the knight being on f3 so that it can go to h4 at a moment's notice, or even g5 in some cases. Now, that will not happen.",
      "moveEvaluation": "!",
      "moveNumber": 5,
      "piece": "P",
      "targetField": Object {
        "column": "e",
        "row": "5",
      },
    },
    ChessHalfMove {
      "color": "white",
      "moveNumber": 6,
      "piece": "P",
      "targetField": Object {
        "column": "d",
        "row": "3",
      },
    },
    ChessHalfMove {
      "color": "black",
      "moveNumber": 6,
      "piece": "N",
      "sourceField": Object {
        "column": "g",
      },
      "targetField": Object {
        "column": "e",
        "row": "7",
      },
    },
    ChessHalfMove {
      "color": "white",
      "moveNumber": 7,
      "piece": "P",
      "targetField": Object {
        "column": "f",
        "row": "4",
      },
    },
    ChessHalfMove {
      "color": "black",
      "moveNumber": 7,
      "piece": "P",
      "targetField": Object {
        "column": "d",
        "row": "6",
      },
    },
    ChessHalfMove {
      "color": "white",
      "comment": "White should prefer a meek move like this one, but after castling, Black is obviously fine.",
      "moveNumber": 8,
      "piece": "N",
      "sourceField": Object {
        "column": "b",
      },
      "targetField": Object {
        "column": "c",
        "row": "3",
      },
    },
    ChessHalfMove {
      "castleShort": true,
      "color": "black",
      "moveNumber": 8,
      "piece": "P",
      "positionalEvaluation": "=",
    },
  ],
  "result": "*",
  "round": "?",
  "site": "?",
  "white": "?",
}
`);

    });


    test('testing pgn generation', () => {
        var game: chessGame.ChessGame = new chessGame.ChessGame;
        var parser: Parser = new Parser(game);
        parser.scanGameText([
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
        expect(game).toMatchInlineSnapshot(`
ChessGame {
  "_isTmpInitial": true,
  "_moveNumber": 7,
  "_nextColor": "black",
  "_tmpMove": ChessHalfMove {
    "moveNumber": 0,
  },
  "black": "?",
  "date": "????.??.??",
  "event": "?",
  "moves": Array [
    ChessHalfMove {
      "color": "white",
      "moveNumber": 1,
      "piece": "P",
      "targetField": Object {
        "column": "d",
        "row": "4",
      },
    },
    ChessHalfMove {
      "color": "black",
      "moveNumber": 1,
      "piece": "P",
      "targetField": Object {
        "column": "d",
        "row": "5",
      },
    },
    ChessHalfMove {
      "color": "white",
      "moveNumber": 2,
      "piece": "P",
      "targetField": Object {
        "column": "c",
        "row": "4",
      },
    },
    ChessHalfMove {
      "color": "black",
      "comment": "The Slav has always been one of Black's most solid choices against 1.d4, and it is the move order I recommended in my Semi-Slav course https://www.chessable.com/lifetime-repertoires-semi-slav/course/31529/. The way I advocate playing does a very good job steering the game into Semi-Slav territory, and it avoids a lot of Black's other options.",
      "moveNumber": 2,
      "piece": "P",
      "targetField": Object {
        "column": "c",
        "row": "6",
      },
    },
    ChessHalfMove {
      "color": "white",
      "comment": "3.Nf3 Is quite a bit more common, but I like this move order.With 3. Nc3 and 4.e3, White avoids all kinds of Bc8 - f5 or g4 options.Black does not HAVE to go for a Semi - Slav, but his other options look pretty soft to me.A key point of understanding these positions is knowing when to take on d5.It's a pretty common move to make whenever Black touches his c8-bishop, as then the b7-pawn will become weak after a subsequent Qd1-b3. It's also generally a good move if Black plays Nb8 - d7, as the knight really belongs on c6 in all of the Exchange Slav structures.",
      "moveNumber": 3,
      "piece": "N",
      "targetField": Object {
        "column": "c",
        "row": "3",
      },
    },
    ChessHalfMove {
      "color": "black",
      "moveNumber": 3,
      "piece": "P",
      "targetField": Object {
        "column": "e",
        "row": "6",
      },
    },
    ChessHalfMove {
      "color": "white",
      "comment": "Black should probably play Ng8 - f6 here, again transposing to the Semi - Slav, but he does have another option.",
      "moveNumber": 4,
      "piece": "P",
      "targetField": Object {
        "column": "e",
        "row": "3",
      },
    },
    ChessHalfMove {
      "color": "black",
      "comment": "This has seen play from time to time.I find it to be a poor version of the Stonewall plan I was advocating in the Semi - Slav course.",
      "moveNumber": 4,
      "piece": "P",
      "targetField": Object {
        "column": "f",
        "row": "5",
      },
    },
    ChessHalfMove {
      "color": "white",
      "moveNumber": 5,
      "piece": "N",
      "targetField": Object {
        "column": "f",
        "row": "3",
      },
    },
    ChessHalfMove {
      "color": "black",
      "comment": "I have also seen this move played with the idea of developing the g8 - knight to h6, but I find it unimpressive.",
      "moveNumber": 5,
      "piece": "N",
      "targetField": Object {
        "column": "d",
        "row": "7",
      },
    },
    ChessHalfMove {
      "color": "white",
      "moveNumber": 6,
      "piece": "B",
      "targetField": Object {
        "column": "d",
        "row": "3",
      },
    },
    ChessHalfMove {
      "color": "black",
      "comment": "Black's play is not totally senseless. He is looking to play Bf8-d6, O-O and will always have Nh6-f7 available to prevent White from landing a knight on e5. But, I think we can take advantage of the knight committing to h6 so soon.",
      "moveNumber": 6,
      "piece": "N",
      "targetField": Object {
        "column": "h",
        "row": "6",
      },
    },
    ChessHalfMove {
      "color": "white",
      "comment": "White prepares castling long.7...Bd68.Bd2O - O9.O - O - OIn general, I think castling long against the Stonewall tends to be unimpressive because a knight landing on e4 will be colossally annoying with f2 hanging.But, Black's knight on h6 is obviously misplaced for such a task! White can look to prepare a kingside attack with h2-h3 and g2-g4, and I think Black is too slow to make anything too annoying happen.",
      "moveEvaluation": "!?",
      "moveNumber": 7,
      "piece": "Q",
      "targetField": Object {
        "column": "c",
        "row": "2",
      },
    },
  ],
  "result": "*",
  "round": "?",
  "site": "?",
  "white": "?",
}
`);

        let pgn = new chessGame.pgn(game);
        expect(pgn.exportPGN()).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "",
  "1. d4 d5 2. c4",
  "c6 { The Slav has always been one of Black's most solid choices against 1.d4,",
  "and it is the move order I recommended in my Semi-Slav course",
  "https://www.chessable.com/lifetime-repertoires-semi-slav/course/31529/. The way",
  "I advocate playing does a very good job steering the game into Semi-Slav",
  "territory, and it avoids a lot of Black's other options. }",
  "3. Nc3 { 3.Nf3 Is quite a bit more common, but I like this move order.With 3.",
  "Nc3 and 4.e3, White avoids all kinds of Bc8 - f5 or g4 options.Black does not",
  "HAVE to go for a Semi - Slav, but his other options look pretty soft to me.A",
  "key point of understanding these positions is knowing when to take on d5.It's a",
  "pretty common move to make whenever Black touches his c8-bishop, as then the",
  "b7-pawn will become weak after a subsequent Qd1-b3. It's also generally a good",
  "move if Black plays Nb8 - d7, as the knight really belongs on c6 in all of the",
  "Exchange Slav structures. } 3... e6",
  "4. e3 { Black should probably play Ng8 - f6 here, again transposing to the Semi",
  "- Slav, but he does have another option. }",
  "4... f5 { This has seen play from time to time.I find it to be a poor version",
  "of the Stonewall plan I was advocating in the Semi - Slav course. } 5. Nf3",
  "Nd7 { I have also seen this move played with the idea of developing the g8 -",
  "knight to h6, but I find it unimpressive. } 6. Bd3",
  "Nh6 { Black's play is not totally senseless. He is looking to play Bf8-d6, O-O",
  "and will always have Nh6-f7 available to prevent White from landing a knight on",
  "e5. But, I think we can take advantage of the knight committing to h6 so soon.",
  "}",
  "7. Qc2!? { White prepares castling long.7...Bd68.Bd2O - O9.O - O - OIn general,",
  "I think castling long against the Stonewall tends to be unimpressive because a",
  "knight landing on e4 will be colossally annoying with f2 hanging.But, Black's",
  "knight on h6 is obviously misplaced for such a task! White can look to prepare",
  "a kingside attack with h2-h3 and g2-g4, and I think Black is too slow to make",
  "anything too annoying happen. } *",
]
`);

    });

});