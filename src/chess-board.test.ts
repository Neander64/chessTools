import * as chessBoard from './chess-board'


describe('Testing chess-board', () => {

  test('testing pawn moves', () => {
    var cb = new chessBoard.ChessBoard();
    cb.loadFEN("k7/8/8/8/8/8/7P/K7 w K - 4 50");
    expect(cb.performMovePawn(chessBoard.strToFieldIdx('h2'), chessBoard.strToFieldIdx('h4'))).toBe(true);
    cb.loadFEN("k7/8/8/8/8/8/7P/K7 w K - 4 50");
    expect(cb.performMovePawn(chessBoard.strToFieldIdx('h2'), chessBoard.strToFieldIdx('h3'))).toBe(true);
    expect(cb.performMovePawn(chessBoard.strToFieldIdx('h3'), chessBoard.strToFieldIdx('h4'))).toBe(true);
    cb.loadFEN("k7/8/8/8/8/8/7P/K7 w K - 4 50");
    expect(cb.performMovePawn(chessBoard.strToFieldIdx('h2'), chessBoard.strToFieldIdx('h5'))).toBe(false);
    cb.loadFEN("k7/8/8/8/8/8/7P/K7 w K - 4 50");
    expect(cb.performMovePawn(chessBoard.strToFieldIdx('h4'), chessBoard.strToFieldIdx('h5'))).toBe(false);

    cb.loadFEN("k7/7p/8/8/8/8/8/K7 b K - 4 50");
    expect(cb.performMovePawn(chessBoard.strToFieldIdx('h7'), chessBoard.strToFieldIdx('h5'))).toBe(true);
    cb.loadFEN("k7/7p/8/8/8/8/8/K7 b K - 4 50");
    expect(cb.performMovePawn(chessBoard.strToFieldIdx('h7'), chessBoard.strToFieldIdx('h6'))).toBe(true);
    expect(cb.performMovePawn(chessBoard.strToFieldIdx('h6'), chessBoard.strToFieldIdx('h5'))).toBe(true);
    cb.loadFEN("k7/7p/8/8/8/8/8/K7 b K - 4 50");
    expect(cb.performMovePawn(chessBoard.strToFieldIdx('h7'), chessBoard.strToFieldIdx('h4'))).toBe(false);
    cb.loadFEN("k7/7p/8/8/8/8/8/K7 b K - 4 50");
    expect(cb.performMovePawn(chessBoard.strToFieldIdx('h4'), chessBoard.strToFieldIdx('h3'))).toBe(false);
  });

  test('testing castle moves 1', () => {
    let cb = new chessBoard.ChessBoard();
    cb.loadFEN(cb.initialBoardFEN);
    expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.short)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.short, true)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.long)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.long, true)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.long)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.long, true)).toBe(false);
  });
  test('testing castle moves', () => {
    let cb = new chessBoard.ChessBoard();
    cb.loadFEN("7k/8/8/8/8/8/8/4K2R w - b3 4 50");
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(false);
    cb.loadFEN("7k/8/8/8/8/8/8/4K2R w K b3 4 50");
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(true);
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short)).toBe(true);
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.long, true)).toBe(false);
    cb.loadFEN("7k/8/8/8/8/8/8/4K1BR w K b3 4 50");
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short)).toBe(false);

    // all castles possible
    cb.loadFEN("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 4 50");
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(true);
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.long, true)).toBe(true);
    expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.short, true)).toBe(true);
    expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.long, true)).toBe(true);

    // Piece in between
    cb.loadFEN("r3kb1r/8/8/8/8/8/8/R3K1BR w KQkq - 4 50");
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.long, true)).toBe(true);
    expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.short, true)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.short, false)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.long, true)).toBe(true);
    cb.loadFEN("rn2k2r/8/8/8/8/8/8/R2QK2R w KQkq - 4 50");
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(true);
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.long, true)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.long)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.short, true)).toBe(true);
    expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.long, true)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.long, false)).toBe(false);

    // check in between check
    cb.loadFEN("r3k2r/8/3Q4/8/8/3q4/8/R3K2R w K b3 4 50");
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.long, true)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.short, true)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.long, true)).toBe(false);
    // king is checked
    cb.loadFEN("r3k2r/8/4Q3/8/8/4q3/8/R3K2R w K b3 4 50");
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.long, true)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.short, true)).toBe(false);
    expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.long, true)).toBe(false);

  });

  test('testing AttackedFields', () => {
    let cb = new chessBoard.ChessBoard();

    cb.loadFEN("7k/8/8/2pb4/8/8/8/7K b - - 4 50");
    expect(cb.isCheck(chessBoard.color.white)).toBe(true);
    expect(cb.isCheck(chessBoard.color.black)).toBe(false);
    let a1 = cb.getAttackedFields(chessBoard.color.black);
    a1.clear();
    expect(a1).toMatchInlineSnapshot(`
AttackedFields {
  "_fields": Array [],
}
`);
    let a2 = cb.getAttackedFields(chessBoard.color.black).attackedFields();
    expect(a2).toMatchInlineSnapshot(`
Array [
  Object {
    "colIdx": 6,
    "rowIdx": 0,
  },
  Object {
    "colIdx": 6,
    "rowIdx": 1,
  },
  Object {
    "colIdx": 7,
    "rowIdx": 1,
  },
  Object {
    "colIdx": 3,
    "rowIdx": 4,
  },
  Object {
    "colIdx": 1,
    "rowIdx": 4,
  },
  Object {
    "colIdx": 4,
    "rowIdx": 4,
  },
  Object {
    "colIdx": 5,
    "rowIdx": 5,
  },
  Object {
    "colIdx": 6,
    "rowIdx": 6,
  },
  Object {
    "colIdx": 7,
    "rowIdx": 7,
  },
  Object {
    "colIdx": 2,
    "rowIdx": 3,
  },
  Object {
    "colIdx": 4,
    "rowIdx": 2,
  },
  Object {
    "colIdx": 5,
    "rowIdx": 1,
  },
  Object {
    "colIdx": 2,
    "rowIdx": 4,
  },
  Object {
    "colIdx": 1,
    "rowIdx": 5,
  },
  Object {
    "colIdx": 0,
    "rowIdx": 6,
  },
]
`);

    cb.loadFEN(cb.initialBoardFEN);
    let a = cb.getAttackedFields(chessBoard.color.black);
    expect(a).toMatchInlineSnapshot(`
AttackedFields {
  "_fields": Array [
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 0,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 0,
          },
        },
        Object {
          "field": Object {
            "colIdx": 2,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 2,
          },
        },
      ],
      "field": Object {
        "colIdx": 1,
        "rowIdx": 0,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 0,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 0,
          },
        },
      ],
      "field": Object {
        "colIdx": 0,
        "rowIdx": 1,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 1,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 1,
          },
        },
        Object {
          "field": Object {
            "colIdx": 2,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 2,
          },
        },
        Object {
          "field": Object {
            "colIdx": 3,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 3,
          },
        },
        Object {
          "field": Object {
            "colIdx": 4,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 4,
          },
        },
      ],
      "field": Object {
        "colIdx": 3,
        "rowIdx": 1,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 1,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 1,
          },
        },
        Object {
          "field": Object {
            "colIdx": 1,
            "rowIdx": 1,
          },
          "piece": Object {
            "color": "Black",
            "kind": 5,
          },
        },
      ],
      "field": Object {
        "colIdx": 0,
        "rowIdx": 2,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 1,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 1,
          },
        },
        Object {
          "field": Object {
            "colIdx": 1,
            "rowIdx": 1,
          },
          "piece": Object {
            "color": "Black",
            "kind": 5,
          },
        },
        Object {
          "field": Object {
            "colIdx": 3,
            "rowIdx": 1,
          },
          "piece": Object {
            "color": "Black",
            "kind": 5,
          },
        },
      ],
      "field": Object {
        "colIdx": 2,
        "rowIdx": 2,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 2,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 2,
          },
        },
      ],
      "field": Object {
        "colIdx": 1,
        "rowIdx": 1,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 3,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 3,
          },
        },
        Object {
          "field": Object {
            "colIdx": 5,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 2,
          },
        },
      ],
      "field": Object {
        "colIdx": 4,
        "rowIdx": 0,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 3,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 3,
          },
        },
        Object {
          "field": Object {
            "colIdx": 3,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 3,
          },
        },
      ],
      "field": Object {
        "colIdx": 2,
        "rowIdx": 0,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 3,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 3,
          },
        },
        Object {
          "field": Object {
            "colIdx": 4,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 4,
          },
        },
        Object {
          "field": Object {
            "colIdx": 5,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 2,
          },
        },
        Object {
          "field": Object {
            "colIdx": 6,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 1,
          },
        },
      ],
      "field": Object {
        "colIdx": 4,
        "rowIdx": 1,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 3,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 3,
          },
        },
      ],
      "field": Object {
        "colIdx": 2,
        "rowIdx": 1,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 4,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 4,
          },
        },
      ],
      "field": Object {
        "colIdx": 3,
        "rowIdx": 0,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 4,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 4,
          },
        },
      ],
      "field": Object {
        "colIdx": 5,
        "rowIdx": 0,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 4,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 4,
          },
        },
      ],
      "field": Object {
        "colIdx": 5,
        "rowIdx": 1,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 5,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 2,
          },
        },
      ],
      "field": Object {
        "colIdx": 6,
        "rowIdx": 1,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 6,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 1,
          },
        },
        Object {
          "field": Object {
            "colIdx": 4,
            "rowIdx": 1,
          },
          "piece": Object {
            "color": "Black",
            "kind": 5,
          },
        },
        Object {
          "field": Object {
            "colIdx": 6,
            "rowIdx": 1,
          },
          "piece": Object {
            "color": "Black",
            "kind": 5,
          },
        },
      ],
      "field": Object {
        "colIdx": 5,
        "rowIdx": 2,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 6,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 1,
          },
        },
        Object {
          "field": Object {
            "colIdx": 6,
            "rowIdx": 1,
          },
          "piece": Object {
            "color": "Black",
            "kind": 5,
          },
        },
      ],
      "field": Object {
        "colIdx": 7,
        "rowIdx": 2,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 7,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 0,
          },
        },
      ],
      "field": Object {
        "colIdx": 6,
        "rowIdx": 0,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 7,
            "rowIdx": 0,
          },
          "piece": Object {
            "color": "Black",
            "kind": 0,
          },
        },
      ],
      "field": Object {
        "colIdx": 7,
        "rowIdx": 1,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 0,
            "rowIdx": 1,
          },
          "piece": Object {
            "color": "Black",
            "kind": 5,
          },
        },
        Object {
          "field": Object {
            "colIdx": 2,
            "rowIdx": 1,
          },
          "piece": Object {
            "color": "Black",
            "kind": 5,
          },
        },
      ],
      "field": Object {
        "colIdx": 1,
        "rowIdx": 2,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 2,
            "rowIdx": 1,
          },
          "piece": Object {
            "color": "Black",
            "kind": 5,
          },
        },
        Object {
          "field": Object {
            "colIdx": 4,
            "rowIdx": 1,
          },
          "piece": Object {
            "color": "Black",
            "kind": 5,
          },
        },
      ],
      "field": Object {
        "colIdx": 3,
        "rowIdx": 2,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 3,
            "rowIdx": 1,
          },
          "piece": Object {
            "color": "Black",
            "kind": 5,
          },
        },
        Object {
          "field": Object {
            "colIdx": 5,
            "rowIdx": 1,
          },
          "piece": Object {
            "color": "Black",
            "kind": 5,
          },
        },
      ],
      "field": Object {
        "colIdx": 4,
        "rowIdx": 2,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 5,
            "rowIdx": 1,
          },
          "piece": Object {
            "color": "Black",
            "kind": 5,
          },
        },
        Object {
          "field": Object {
            "colIdx": 7,
            "rowIdx": 1,
          },
          "piece": Object {
            "color": "Black",
            "kind": 5,
          },
        },
      ],
      "field": Object {
        "colIdx": 6,
        "rowIdx": 2,
      },
    },
  ],
}
`);
  });

  test('testing FEN', () => {
    let cb = new chessBoard.ChessBoard();
    cb.loadFEN(cb.initialBoardFEN);
    let b1 = cb.toASCII();
    expect(b1).toMatchInlineSnapshot(`
Array [
  " -------------------------------",
  "| r | n | b | q | k | b | n | r |",
  " -------------------------------",
  "| p | p | p | p | p | p | p | p |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "| P | P | P | P | P | P | P | P |",
  " -------------------------------",
  "| R | N | B | Q | K | B | N | R |",
  " -------------------------------",
  "next move color: White",
  "Possible Castle White O-O:Y, O-O-O:Y",
  "Possible Castle Black O-O:Y, O-O-O:Y",
  "moves without pawn or capture: 0",
  "move number: 1",
]
`);

    cb.loadFEN("r1bqkb1r/1p1n1ppp/p1n1p3/2ppP3/3P4/2P2N2/PP2NPPP/R1BQKB1R w KQkq - 1 8");
    let b3 = cb.toASCII();
    expect(b3).toMatchInlineSnapshot(`
Array [
  " -------------------------------",
  "| r |   | b | q | k | b |   | r |",
  " -------------------------------",
  "|   | p |   | n |   | p | p | p |",
  " -------------------------------",
  "| p |   | n |   | p |   |   |   |",
  " -------------------------------",
  "|   |   | p | p | P |   |   |   |",
  " -------------------------------",
  "|   |   |   | P |   |   |   |   |",
  " -------------------------------",
  "|   |   | P |   |   | N |   |   |",
  " -------------------------------",
  "| P | P |   |   | N | P | P | P |",
  " -------------------------------",
  "| R |   | B | Q | K | B |   | R |",
  " -------------------------------",
  "next move color: White",
  "Possible Castle White O-O:Y, O-O-O:Y",
  "Possible Castle Black O-O:Y, O-O-O:Y",
  "moves without pawn or capture: 1",
  "move number: 8",
]
`);


    cb.loadFEN("rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PPP/R1BQ1RK1 b kq - 4 8");
    let b4 = cb.toASCII();
    expect(b4).toMatchInlineSnapshot(`
Array [
  " -------------------------------",
  "| r | n |   | q | k |   |   | r |",
  " -------------------------------",
  "|   | b | p | p | b | p | p | p |",
  " -------------------------------",
  "| p |   |   |   | p | n |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "| P | p |   | P | P |   |   |   |",
  " -------------------------------",
  "|   |   |   | B |   | N |   |   |",
  " -------------------------------",
  "|   | P | P | N |   | P | P | P |",
  " -------------------------------",
  "| R |   | B | Q |   | R | K |   |",
  " -------------------------------",
  "next move color: Black",
  "Possible Castle White O-O:N, O-O-O:N",
  "Possible Castle Black O-O:Y, O-O-O:Y",
  "moves without pawn or capture: 4",
  "move number: 8",
]
`);

    cb.loadFEN("rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PPP/R1BQ1RK1 b kq e3 4 8");
    let b5 = cb.toASCII();
    expect(b5).toMatchInlineSnapshot(`
Array [
  " -------------------------------",
  "| r | n |   | q | k |   |   | r |",
  " -------------------------------",
  "|   | b | p | p | b | p | p | p |",
  " -------------------------------",
  "| p |   |   |   | p | n |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "| P | p |   | P | P |   |   |   |",
  " -------------------------------",
  "|   |   |   | B |   | N |   |   |",
  " -------------------------------",
  "|   | P | P | N |   | P | P | P |",
  " -------------------------------",
  "| R |   | B | Q |   | R | K |   |",
  " -------------------------------",
  "next move color: Black",
  "Possible Castle White O-O:N, O-O-O:N",
  "Possible Castle Black O-O:Y, O-O-O:Y",
  "en passant option at e3",
  "moves without pawn or capture: 4",
  "move number: 8",
]
`);

  });
  // testing for illegal input

  test('testing illegal FEN', () => {
    let cb = new chessBoard.ChessBoard();
    expect(() => cb.loadFEN("")).toThrow('loadFEN(): unexpected number of FEN-token');
    expect(() => cb.loadFEN("rn1qk2r/1bpp/bppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PPP/R1BQ1RK1 w kq - 4 8")).toThrow('loadFEN(): unexpected number of rows in position');
    expect(() => cb.loadFEN("rn1qk2r/1bpppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PPP/R1BQ1RK1 w kq - 4 8")).toThrow('loadFEN(): unexpected number of columns in position');
    expect(() => cb.loadFEN("rn1qk2r/1bppbppp/p3pn2/9/Pp1PP3/3B1N2/1PPN1PPP/R1BQ1RK1 w kq - 4 8")).toThrow('loadFEN(): unexpected digit in position');
    expect(() => cb.loadFEN("rn1qk2r/1bppbppp/p3pn2/0/Pp1PP3/3B1N2/1PPN1PPP/R1BQ1RK1 w kq - 4 8")).toThrow('loadFEN(): unexpected digit in position');
    expect(() => cb.loadFEN("rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PPP/R1BQ1RK1 g kq - 4 8")).toThrow('loadFEN(): illegal player to move');
    expect(() => cb.loadFEN("rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PPP/R1BQ1RK1 w kq ee5 4 8")).toThrow('loadFEN(): en passant unexpected format');
    expect(() => cb.loadFEN("rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPK1PPP/R1BQ1RK1 b kq - 4 8")).toThrow('loadFEN(): unexpected number of white kings');
    expect(() => cb.loadFEN("rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1k2/1PPN1PPP/R1BQ1RK1 b kq - 4 8")).toThrow('loadFEN(): unexpected number of black kings');
    expect(() => cb.loadFEN("rnbqkbnp/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")).toThrow('loadFEN(): too many black pawns');
    expect(() => cb.loadFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RPBQKBNR w KQkq - 0 1")).toThrow('loadFEN(): too many white pawns');

    let b4 = cb.toASCII(); // empty board after error
    expect(b4).toMatchInlineSnapshot(`
Array [
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "next move color: White",
  "Possible Castle White O-O:Y, O-O-O:Y",
  "Possible Castle Black O-O:Y, O-O-O:Y",
  "moves without pawn or capture: 0",
  "move number: 1",
]
`);
  });



});
