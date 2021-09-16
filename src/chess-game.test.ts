import { ChessGame } from "./chess-game"
import { ChessBoardPiece, ChessMoveColor, pgn } from "./pgn";
import { parseChessable as Parser } from "./parseChessable"
import { ChessPositionalEvaluation, ChessMoveEvaluation } from "./common/moveOnBoard";

describe('Testing chess-game', () => {
  test('testing general features', () => {
    var gameArray = [
      "1.d4!!d5??2.c4?c6N",
      "The Slav has always been one of Black's most solid choices against 1.d4, and it is the move order I recommended in my Semi-Slav course https://www.chessable.com/lifetime-repertoires-semi-slav/course/31529/. The way I advocate playing does a very good job steering the game into Semi-Slav territory, and it avoids a lot of Black's other options.",
      "3.Nc3=",
      "3.Nf3 Is quite a bit more common, but I like this move order.With 3. Nc3 and 4.e3, White avoids all kinds of Bc8 - f5 or g4 options.Black does not HAVE to go for a Semi - Slav, but his other options look pretty soft to me.A key point of understanding these positions is knowing when to take on d5.It's a pretty common move to make whenever Black touches his c8-bishop, as then the b7-pawn will become weak after a subsequent Qd1-b3. It's also generally a good move if Black plays Nb8 - d7, as the knight really belongs on c6 in all of the Exchange Slav structures.",
      "3...Nf6⩲",
      "This is the main move by far.",
      "4.e3⩱",
      "Now, I strongly believe that Black's best move here is e7-e6, transposing back into a Semi-Slav where White is forced to play e3 instead of Bg5. Since this was our plan anyway, I do not find it to be troubling.",
      "4...Bf5±",
      "This move was recommended by Boris Avrukh in his 2014 book 'The Classical Slav' for Quality Chess.It's a very enterprising idea, sacrificing a pawn for quick development and hopefully attacking chances, but I have a hard time believing in it.",
      "5.cxd5cxd56.Qb3∓",
      "Black has a hard time defending the b7 - pawn, and Avrukh's recommendation is to let it go.",
      "6...Nc6!7.Qxb7Bd78.Qb3+-Rb89.Qd1-+",
      "White got his queen back home and will remain a healthy pawn up if he can complete his development.Black should be very direct.",
      "9...e5!10.dxe5Nxe511.Be2Bd6",
      "This position has seen a fair amount of play, and Black's results have not been terrible. He has reasonably attacking chances connected with O-O, Rb8-b6, lifting a rook, and hoping for mate. I only played the White side of this position once, though I won, it was a very stressful game. I think I can cause Black some more issues than present theory can.",
      "12.Nf3O-O13.O-OQc7?!",
      "Avrukh correctly points out that this is not best.The queen is misplaced here and will be vulnerable to a knight landing on b5, and White has a very nice counter sacrifice.",
      "14.Nd4!Nc415.b3!Bxh2+16.Kh1∞",
      "Material has been equalized, but Black's coordination is horrendous, his pieces are loose, and White will easily complete his development with Bc1-b2 once the c4-knight leaves. The machines are claiming White is much better, and I won't argue with them.",
    ];
    var game: ChessGame = new ChessGame;
    var p: Parser = new Parser(game);
    p.scanGameText(gameArray);
    let pgn_ = new pgn(game);
    var pgnArray = pgn_.exportPGN();
    expect(pgnArray).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "",
  "1. d4!! d5?? 2. c4?",
  "c6 N { The Slav has always been one of Black's most solid choices against 1.d4,",
  "and it is the move order I recommended in my Semi-Slav course",
  "https://www.chessable.com/lifetime-repertoires-semi-slav/course/31529/. The way",
  "I advocate playing does a very good job steering the game into Semi-Slav",
  "territory, and it avoids a lot of Black's other options. }",
  "3. Nc3 = { 3.Nf3 Is quite a bit more common, but I like this move order.With 3.",
  "Nc3 and 4.e3, White avoids all kinds of Bc8 - f5 or g4 options.Black does not",
  "HAVE to go for a Semi - Slav, but his other options look pretty soft to me.A",
  "key point of understanding these positions is knowing when to take on d5.It's a",
  "pretty common move to make whenever Black touches his c8-bishop, as then the",
  "b7-pawn will become weak after a subsequent Qd1-b3. It's also generally a good",
  "move if Black plays Nb8 - d7, as the knight really belongs on c6 in all of the",
  "Exchange Slav structures. } 3... Nf6 ⩲ { This is the main move by far. }",
  "4. e3 ⩱ { Now, I strongly believe that Black's best move here is e7-e6,",
  "transposing back into a Semi-Slav where White is forced to play e3 instead of",
  "Bg5. Since this was our plan anyway, I do not find it to be troubling. }",
  "4... Bf5 ± { This move was recommended by Boris Avrukh in his 2014 book 'The",
  "Classical Slav' for Quality Chess.It's a very enterprising idea, sacrificing a",
  "pawn for quick development and hopefully attacking chances, but I have a hard",
  "time believing in it. } 5. cxd5 cxd5",
  "6. Qb3 ∓ { Black has a hard time defending the b7 - pawn, and Avrukh's",
  "recommendation is to let it go. } 6... Nc6! 7. Qxb7 Bd7 8. Qb3 +- Rb8",
  "9. Qd1 -+ { White got his queen back home and will remain a healthy pawn up if",
  "he can complete his development.Black should be very direct. } 9... e5! 10. dxe5",
  "Nxe5 11. Be2",
  "Bd6 { This position has seen a fair amount of play, and Black's results have",
  "not been terrible. He has reasonably attacking chances connected with O-O,",
  "Rb8-b6, lifting a rook, and hoping for mate. I only played the White side of",
  "this position once, though I won, it was a very stressful game. I think I can",
  "cause Black some more issues than present theory can. } 12. Nf3 O-O 13. O-O",
  "Qc7?! { Avrukh correctly points out that this is not best.The queen is",
  "misplaced here and will be vulnerable to a knight landing on b5, and White has",
  "a very nice counter sacrifice.14.Nd4!Nc415.b3!Bxh2+16.Kh1∞Material has been",
  "equalized, but Black's coordination is horrendous, his pieces are loose, and",
  "White will easily complete his development with Bc1-b2 once the c4-knight",
  "leaves. The machines are claiming White is much better, and I won't argue with",
  "them. } *",
]
`);

    var pgnArray = pgn_.exportPGN(true);
    expect(pgnArray).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "",
  "1. d4!! d5?? 2. c4? c6 N 3. Nc3 = Nf6 ⩲ 4. e3 ⩱ Bf5 ± 5. cxd5 cxd5 6. Qb3 ∓ Nc6!",
  "7. Qxb7 Bd7 8. Qb3 +- Rb8 9. Qd1 -+ e5! 10. dxe5 Nxe5 11. Be2 Bd6 12. Nf3 O-O",
  "13. O-O Qc7?! *",
]
`);

    var pgnArray = pgn_.exportPGN(true, true);
    expect(pgnArray).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "",
  "1. d4 $3 d5 $4 2. c4 $2 c6 N 3. Nc3  $10 Nf6  $14 4. e3  $15 Bf5  $16 5. cxd5",
  "cxd5 6. Qb3  $17 Nc6 $1 7. Qxb7 Bd7 8. Qb3  $18 Rb8 9. Qd1  $19 e5 $1 10. dxe5",
  "Nxe5 11. Be2 Bd6 12. Nf3 O-O 13. O-O Qc7 $6 *",
]
`);

    expect(game).toMatchInlineSnapshot(`
ChessGame {
  "_isTmpInitial": true,
  "_moveNumber": 14,
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
      "moveEvaluation": "!!",
      "moveNumber": 1,
      "piece": "P",
      "targetField": Object {
        "file": "d",
        "rank": "4",
      },
    },
    ChessHalfMove {
      "color": "black",
      "moveEvaluation": "??",
      "moveNumber": 1,
      "piece": "P",
      "targetField": Object {
        "file": "d",
        "rank": "5",
      },
    },
    ChessHalfMove {
      "color": "white",
      "moveEvaluation": "?",
      "moveNumber": 2,
      "piece": "P",
      "targetField": Object {
        "file": "c",
        "rank": "4",
      },
    },
    ChessHalfMove {
      "color": "black",
      "comment": "The Slav has always been one of Black's most solid choices against 1.d4, and it is the move order I recommended in my Semi-Slav course https://www.chessable.com/lifetime-repertoires-semi-slav/course/31529/. The way I advocate playing does a very good job steering the game into Semi-Slav territory, and it avoids a lot of Black's other options.",
      "isNovelty": true,
      "moveNumber": 2,
      "piece": "P",
      "targetField": Object {
        "file": "c",
        "rank": "6",
      },
    },
    ChessHalfMove {
      "color": "white",
      "comment": "3.Nf3 Is quite a bit more common, but I like this move order.With 3. Nc3 and 4.e3, White avoids all kinds of Bc8 - f5 or g4 options.Black does not HAVE to go for a Semi - Slav, but his other options look pretty soft to me.A key point of understanding these positions is knowing when to take on d5.It's a pretty common move to make whenever Black touches his c8-bishop, as then the b7-pawn will become weak after a subsequent Qd1-b3. It's also generally a good move if Black plays Nb8 - d7, as the knight really belongs on c6 in all of the Exchange Slav structures.",
      "moveNumber": 3,
      "piece": "N",
      "positionalEvaluation": "=",
      "targetField": Object {
        "file": "c",
        "rank": "3",
      },
    },
    ChessHalfMove {
      "color": "black",
      "comment": "This is the main move by far.",
      "moveNumber": 3,
      "piece": "N",
      "positionalEvaluation": "⩲",
      "targetField": Object {
        "file": "f",
        "rank": "6",
      },
    },
    ChessHalfMove {
      "color": "white",
      "comment": "Now, I strongly believe that Black's best move here is e7-e6, transposing back into a Semi-Slav where White is forced to play e3 instead of Bg5. Since this was our plan anyway, I do not find it to be troubling.",
      "moveNumber": 4,
      "piece": "P",
      "positionalEvaluation": "⩱",
      "targetField": Object {
        "file": "e",
        "rank": "3",
      },
    },
    ChessHalfMove {
      "color": "black",
      "comment": "This move was recommended by Boris Avrukh in his 2014 book 'The Classical Slav' for Quality Chess.It's a very enterprising idea, sacrificing a pawn for quick development and hopefully attacking chances, but I have a hard time believing in it.",
      "moveNumber": 4,
      "piece": "B",
      "positionalEvaluation": "±",
      "targetField": Object {
        "file": "f",
        "rank": "5",
      },
    },
    ChessHalfMove {
      "color": "white",
      "isCapture": true,
      "moveNumber": 5,
      "piece": "P",
      "sourceField": Object {
        "file": "c",
      },
      "targetField": Object {
        "file": "d",
        "rank": "5",
      },
    },
    ChessHalfMove {
      "color": "black",
      "isCapture": true,
      "moveNumber": 5,
      "piece": "P",
      "sourceField": Object {
        "file": "c",
      },
      "targetField": Object {
        "file": "d",
        "rank": "5",
      },
    },
    ChessHalfMove {
      "color": "white",
      "comment": "Black has a hard time defending the b7 - pawn, and Avrukh's recommendation is to let it go.",
      "moveNumber": 6,
      "piece": "Q",
      "positionalEvaluation": "∓",
      "targetField": Object {
        "file": "b",
        "rank": "3",
      },
    },
    ChessHalfMove {
      "color": "black",
      "moveEvaluation": "!",
      "moveNumber": 6,
      "piece": "N",
      "targetField": Object {
        "file": "c",
        "rank": "6",
      },
    },
    ChessHalfMove {
      "color": "white",
      "isCapture": true,
      "moveNumber": 7,
      "piece": "Q",
      "targetField": Object {
        "file": "b",
        "rank": "7",
      },
    },
    ChessHalfMove {
      "color": "black",
      "moveNumber": 7,
      "piece": "B",
      "targetField": Object {
        "file": "d",
        "rank": "7",
      },
    },
    ChessHalfMove {
      "color": "white",
      "moveNumber": 8,
      "piece": "Q",
      "positionalEvaluation": "+-",
      "targetField": Object {
        "file": "b",
        "rank": "3",
      },
    },
    ChessHalfMove {
      "color": "black",
      "moveNumber": 8,
      "piece": "R",
      "targetField": Object {
        "file": "b",
        "rank": "8",
      },
    },
    ChessHalfMove {
      "color": "white",
      "comment": "White got his queen back home and will remain a healthy pawn up if he can complete his development.Black should be very direct.",
      "moveNumber": 9,
      "piece": "Q",
      "positionalEvaluation": "-+",
      "targetField": Object {
        "file": "d",
        "rank": "1",
      },
    },
    ChessHalfMove {
      "color": "black",
      "moveEvaluation": "!",
      "moveNumber": 9,
      "piece": "P",
      "targetField": Object {
        "file": "e",
        "rank": "5",
      },
    },
    ChessHalfMove {
      "color": "white",
      "isCapture": true,
      "moveNumber": 10,
      "piece": "P",
      "sourceField": Object {
        "file": "d",
      },
      "targetField": Object {
        "file": "e",
        "rank": "5",
      },
    },
    ChessHalfMove {
      "color": "black",
      "isCapture": true,
      "moveNumber": 10,
      "piece": "N",
      "targetField": Object {
        "file": "e",
        "rank": "5",
      },
    },
    ChessHalfMove {
      "color": "white",
      "moveNumber": 11,
      "piece": "B",
      "targetField": Object {
        "file": "e",
        "rank": "2",
      },
    },
    ChessHalfMove {
      "color": "black",
      "comment": "This position has seen a fair amount of play, and Black's results have not been terrible. He has reasonably attacking chances connected with O-O, Rb8-b6, lifting a rook, and hoping for mate. I only played the White side of this position once, though I won, it was a very stressful game. I think I can cause Black some more issues than present theory can.",
      "moveNumber": 11,
      "piece": "B",
      "targetField": Object {
        "file": "d",
        "rank": "6",
      },
    },
    ChessHalfMove {
      "color": "white",
      "moveNumber": 12,
      "piece": "N",
      "targetField": Object {
        "file": "f",
        "rank": "3",
      },
    },
    ChessHalfMove {
      "castleShort": true,
      "color": "black",
      "moveNumber": 12,
      "piece": "P",
    },
    ChessHalfMove {
      "castleShort": true,
      "color": "white",
      "moveNumber": 13,
      "piece": "P",
    },
    ChessHalfMove {
      "color": "black",
      "comment": "Avrukh correctly points out that this is not best.The queen is misplaced here and will be vulnerable to a knight landing on b5, and White has a very nice counter sacrifice.14.Nd4!Nc415.b3!Bxh2+16.Kh1∞Material has been equalized, but Black's coordination is horrendous, his pieces are loose, and White will easily complete his development with Bc1-b2 once the c4-knight leaves. The machines are claiming White is much better, and I won't argue with them.",
      "moveEvaluation": "?!",
      "moveNumber": 13,
      "piece": "Q",
      "targetField": Object {
        "file": "c",
        "rank": "7",
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

  test('testing general features', () => {
    var game: ChessGame = new ChessGame;
    // empty game
    expect(game.hasMoves).toBe(false);
    expect(game.isTmpInitial).toBe(true);
    expect(game.isWhiteToMove).toBe(true);
    expect(game.nextColor).toBe(ChessMoveColor.white);
    expect(game.moveNumber).toBe(1);
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

    // set move attributes
    game.setMovePiece(ChessBoardPiece.King);
    expect(game.isTmpInitial).toBe(false);
    game.setMoveSourceField({ rank: '5', file: 'h' });
    game.setMoveTargetField({ rank: '6', file: 'h' });
    game.setMovePromotionTarget(ChessBoardPiece.Bishop);
    game.setMoveIsCapture();
    game.setMoveIsCheck();
    game.setMoveIsMate();
    game.setMoveIsNovelty();
    game.setMovePositionalEvaluation(ChessPositionalEvaluation.clearAdvantageBlack);
    game.setMoveEvaluation(ChessMoveEvaluation.interesting);
    game.setMoveComment("comment text");
    expect(game.isTmpInitial).toBe(false);
    game.addMove();
    expect(game.hasMoves).toBe(true);
    expect(game.isTmpInitial).toBe(true);
    expect(game.isWhiteToMove).toBe(false);
    expect(game.nextColor).toBe(ChessMoveColor.black);
    expect(game.moveNumber).toBe(1);
    expect(game).toMatchInlineSnapshot(`
ChessGame {
  "_isTmpInitial": true,
  "_moveNumber": 1,
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
      "comment": "comment text",
      "isCapture": true,
      "isCheck": true,
      "isMate": true,
      "isNovelty": true,
      "moveEvaluation": "!?",
      "moveNumber": 1,
      "piece": "K",
      "positionalEvaluation": "∓",
      "promotionTarget": "B",
      "sourceField": Object {
        "file": "h",
        "rank": "5",
      },
      "targetField": Object {
        "file": "h",
        "rank": "6",
      },
    },
  ],
  "result": "*",
  "round": "?",
  "site": "?",
  "white": "?",
}
`);

    // black move
    game.setMovePiece(ChessBoardPiece.King);
    expect(game.isTmpInitial).toBe(false);
    game.setMoveTargetField({ rank: '6', file: 'h' });
    expect(game.isTmpInitial).toBe(false);
    game.addMove();
    expect(game.hasMoves).toBe(true);
    expect(game.isTmpInitial).toBe(true);
    expect(game.isWhiteToMove).toBe(true);
    expect(game.isWhiteToMove).toBe(true);
    expect(game.nextColor).toBe(ChessMoveColor.white);
    expect(game.moveNumber).toBe(2);
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
      "comment": "comment text",
      "isCapture": true,
      "isCheck": true,
      "isMate": true,
      "isNovelty": true,
      "moveEvaluation": "!?",
      "moveNumber": 1,
      "piece": "K",
      "positionalEvaluation": "∓",
      "promotionTarget": "B",
      "sourceField": Object {
        "file": "h",
        "rank": "5",
      },
      "targetField": Object {
        "file": "h",
        "rank": "6",
      },
    },
    ChessHalfMove {
      "color": "black",
      "moveNumber": 1,
      "piece": "K",
      "targetField": Object {
        "file": "h",
        "rank": "6",
      },
    },
  ],
  "result": "*",
  "round": "?",
  "site": "?",
  "white": "?",
}
`);

    // add white move
    game.setMoveCastleLong();
    expect(game.isTmpInitial).toBe(false);
    game.addMove();
    expect(game.isTmpInitial).toBe(true);
    expect(game.isWhiteToMove).toBe(false);
    expect(game.nextColor).toBe(ChessMoveColor.black);
    expect(game.hasMoves).toBe(true);
    expect(game.moveNumber).toBe(2);
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
      "comment": "comment text",
      "isCapture": true,
      "isCheck": true,
      "isMate": true,
      "isNovelty": true,
      "moveEvaluation": "!?",
      "moveNumber": 1,
      "piece": "K",
      "positionalEvaluation": "∓",
      "promotionTarget": "B",
      "sourceField": Object {
        "file": "h",
        "rank": "5",
      },
      "targetField": Object {
        "file": "h",
        "rank": "6",
      },
    },
    ChessHalfMove {
      "color": "black",
      "moveNumber": 1,
      "piece": "K",
      "targetField": Object {
        "file": "h",
        "rank": "6",
      },
    },
    ChessHalfMove {
      "castleLong": true,
      "color": "white",
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

    // 
    game.clearGame();
    expect(game.hasMoves).toBe(false);
    expect(game.isTmpInitial).toBe(true);
    expect(game.isWhiteToMove).toBe(true);
    expect(game.nextColor).toBe(ChessMoveColor.white);
    expect(game.moveNumber).toBe(1);
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
    // add empty move
    game.addMove();
    expect(game.hasMoves).toBe(false);
    expect(game.isTmpInitial).toBe(true);
    expect(game.isWhiteToMove).toBe(true);
    expect(game.nextColor).toBe(ChessMoveColor.white);
    expect(game.moveNumber).toBe(1);
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
  // testing for illegal input
});
