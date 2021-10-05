import { Pgn } from "./Pgn"
import { PgnDatabase } from "./PgnDatabase"
import { PgnLinesStr } from "./Tools/PgnLines"

describe('Testing PgnDatabase', () => {

  test('testing merge Games ', () => {
    let data = [
      '1.d4 *',
      '1.d4 e4 *',
    ]
    let pgnDb = Pgn.load(data)
    pgnDb.games[0].mergeGame(pgnDb.games[1])
    expect(PgnLinesStr.generateLinesForGame(pgnDb.games[0])).toMatchInlineSnapshot(`
Array [
  "d4 e4 ",
]
`)
    expect(PgnLinesStr.generateLinesForGame(pgnDb.games[1])).toMatchInlineSnapshot(`
Array [
  "d4 e4 ",
]
`)

    data = [
      '1.d4 e4 *',
      '1.d4 *',
    ]
    pgnDb = Pgn.load(data)
    pgnDb.games[0].mergeGame(pgnDb.games[1])
    expect(PgnLinesStr.generateLinesForGame(pgnDb.games[0])).toMatchInlineSnapshot(`
Array [
  "d4 e4 ",
]
`)
    expect(PgnLinesStr.generateLinesForGame(pgnDb.games[1])).toMatchInlineSnapshot(`
Array [
  "d4 ",
]
`)

    data = [
      '1.d4 d5 *',
      '1.e4 (1. c4 e5) *',
    ]
    pgnDb = Pgn.load(data)
    pgnDb.games[0].mergeGame(pgnDb.games[1])
    expect(PgnLinesStr.generateLinesForGame(pgnDb.games[0])).toMatchInlineSnapshot(`
Array [
  "d4 d5 ",
  "e4 ",
  "c4 e5 ",
]
`)
    expect(PgnLinesStr.generateLinesForGame(pgnDb.games[1])).toMatchInlineSnapshot(`
Array [
  "e4 ",
  "c4 e5 ",
]
`)


    data = [
      '1.e4 (1. c3 e5) e5 Nf3 Nf6 *',
      '1.d4 d5 c4 *',
    ]
    pgnDb = Pgn.load(data)
    pgnDb.games[0].mergeGame(pgnDb.games[1])
    expect(PgnLinesStr.generateLinesForGame(pgnDb.games[0])).toMatchInlineSnapshot(`
Array [
  "e4 e5 Nf3 Nf6 ",
  "c3 e5 ",
  "d4 d5 c4 ",
]
`)
    expect(PgnLinesStr.generateLinesForGame(pgnDb.games[1])).toMatchInlineSnapshot(`
Array [
  "d4 d5 c4 ",
]
`)

    data = [
      '1.d4 e5 *',
      '1.d4 (1.e4 e5 2.f4) d5 2. c4 *',
    ]
    pgnDb = Pgn.load(data)
    pgnDb.games[0].mergeGame(pgnDb.games[1])
    expect(PgnLinesStr.generateLinesForGame(pgnDb.games[0])).toMatchInlineSnapshot(`
Array [
  "d4 e5 ",
  "e4 e5 f4 ",
  "d4 d5 c4 ",
]
`)
    expect(PgnLinesStr.generateLinesForGame(pgnDb.games[1])).toMatchInlineSnapshot(`
Array [
  "d4 d5 c4 ",
  "e4 e5 f4 ",
]
`)

    data = [
      '1.d4 e5  *',
      '1.d4 (1.e4 e5 2.f4) d5 (1...e5 2.dxe5 Qxe5) 2. c4 *',
    ]
    pgnDb = Pgn.load(data)
    pgnDb.games[0].mergeGame(pgnDb.games[1])
    expect(PgnLinesStr.generateLinesForGame(pgnDb.games[0])).toMatchInlineSnapshot(`
Array [
  "d4 e5 dxe5 Qxe5 ",
  "e4 e5 f4 ",
  "d4 d5 c4 ",
]
`)
    expect(PgnLinesStr.generateLinesForGame(pgnDb.games[1])).toMatchInlineSnapshot(`
Array [
  "d4 d5 c4 ",
  "e4 e5 f4 ",
  "d4 e5 dxe5 Qxe5 ",
]
`)

    data = [
      '1.d4 (1.e4 c5) c5 (1...e5 (1...d5 2.Nf3) 2.e4) 2. dxc5  *',
      '1.d4 (1.e4 e5 2.f4) d5 (1...e5 2.dxe5 Qxe5) 2. c4 *',
    ]
    pgnDb = Pgn.load(data)
    pgnDb.games[0].mergeGame(pgnDb.games[1])
    expect(PgnLinesStr.generateLinesForGame(pgnDb.games[0])).toMatchInlineSnapshot(`
Array [
  "d4 c5 dxc5 ",
  "e4 c5 ",
  "e5 f4 ",
  "d4 e5 e4 ",
  "d4 d5 Nf3 ",
  "d4 d5 c4 ",
  "d4 e5 dxe5 Qxe5 ",
]
`)
    expect(PgnLinesStr.generateLinesForGame(pgnDb.games[1])).toMatchInlineSnapshot(`
Array [
  "d4 d5 c4 ",
  "e4 e5 f4 ",
  "d4 e5 dxe5 Qxe5 ",
]
`)


  })

  test('testing sorting Database ', () => {
    let data = [
      '[Date "1971.11.22"][Event "XYZ"][Site "XYZ"]',
      '',
      '1.d4 *',
      '',
      '[Date "1971.11.22"][Event "XYZ"][Site "ABC"]',
      '',
      '1.d4 *',
      '',
      '[Date "1971.11.22"][Event "XYZ"][Site "CDEF"]',
      '',
      '1.d4 *',
      '',
      '[Date "1971.11.22"][Event "XYZ"][Site "CDEF"]',
      '',
      '1.d4 *',
      '',

      '[Date "1971.11.22"][Event "XYZ"][Site "ABC"][Round "CD"][White "CD"][Black "Black CD"]',
      '',
      '1.d4 *',
      '',
      '[Date "1971.11.22"][Event "XYZ"][Site "ABC"][Round "CD"][White "CD"][Black "Black XYZV"]',
      '',
      '1.d4 *',
      '',
      '[Date "1971.11.22"][Event "XYZ"][Site "ABC"][Round "CD"][White "CD"][Black "Black CD2"]',
      '',
      '1.d4 *',
      '',
      '[Date "1971.11.22"][Event "XYZ"][Site "ABC"][Round "CD"][White "CD"][Black "Black ABC"]',
      '',
      '1.d4 *',
      '',

      '[Date "1971.11.22"][Event "XYZ"][Site "ABC"][Round "CD"][White "CD"][Black "Black CD"]',
      '',
      '1.d4 1-0',
      '',
      '[Date "1971.11.22"][Event "XYZ"][Site "ABC"][Round "CD"][White "CD"][Black "Black CD"]',
      '',
      '1.d4 *',
      '',
      '[Date "1971.11.22"][Event "XYZ"][Site "ABC"][Round "CD"][White "CD"][Black "Black CD"]',
      '',
      '1.d4 0-1',
      '',
      '[Date "1971.11.22"][Event "XYZ"][Site "ABC"][Round "CD"][White "CD"][Black "Black CD"]',
      '',
      '1.d4 1/2-1/2',
      '',

      '[Date "1971.11.22"][Event "XYZ"][Site "ABC"][Round "CD"]',
      '',
      '1.d4 *',
      '',
      '[Date "1971.11.22"][Event "XYZ"][Site "ABC"][Round "XYZEF"]',
      '',
      '1.d4 *',
      '',
      '[Date "1971.11.22"][Event "XYZ"][Site "ABC"][Round "CDA"]',
      '',
      '1.d4 *',
      '',
      '[Date "1971.11.22"][Event "XYZ"][Site "ABC"][Round "ABC"]',
      '',
      '1.d4 *',
      '',

      '[Date "1971.11.22"][Event "XYZ"][Site "ABC"][Round "CD"][White "CD"]',
      '',
      '1.d4 *',
      '',
      '[Date "1971.11.22"][Event "XYZ"][Site "ABC"][Round "CD"][White "XYZEF"]',
      '',
      '1.d4 *',
      '',
      '[Date "1971.11.22"][Event "XYZ"][Site "ABC"][Round "CD"][White "CD2"]',
      '',
      '1.d4 *',
      '',
      '[Date "1971.11.22"][Event "XYZ"][Site "ABC"][Round "CD"][White "ABC"]',
      '',
      '1.d4 *',
      '',

      '[Date "1971.11.22"][Event "XYZ"][Site "ABC"][Round "CD"][White "CD"][Black "Black CD"]',
      '',
      '1.d4 1-0',
      '',
      '[Date "1971.11.22"][Event "XYZ"][Site "ABC"][Round "CD"][White "CD"][Black "Black CD"]',
      '',
      '1.d4   d5 2.c4 1-0',
      '',
      '[Date "1971.11.22"][Event "XYZ"][Site "ABC"][Round "CD"][White "CD"][Black "Black CD"]',
      '',
      '1.d4 d5 2.c4 1-0',
      '',
      '[Date "1971.11.22"][Event "XYZ"][Site "ABC"][Round "CD"][White "CD"][Black "Black CD"]',
      '',
      '1.d4 d5  2.c4 e6 1-0',
      '',
      '[Date "1971.11.22"][Event "XYZ"][Site "ABC"][Round "CD"][White "CD"][Black "Black CD"]',
      '',
      '1.d4 d5 2.c4  c6 1-0',
      '',
      '[Date "1971.11.22"][Event "XYZ"][Site "ABC"][Round "CD"][White "CD"][Black "Black CD"]',
      '',
      '1.d4 1-0',
      '',

      '[Date "1971.11.22"][Event "XYZ"]',
      '',
      '1.d4 *',
      '',
      '[Date "1971.11.22"][Event "ABC"]',
      '',
      '1.d4 *',
      '',
      '[Date "1971.11.22"][Event "CDEF"]',
      '',
      '1.d4 *',
      '',
      '[Date "1971.11.22"][Event "CDEF"]',
      '',
      '1.d4 *',
      '',

      '[Date "1971.11.22"]',
      '',
      '1.d4 *',
      '',
      '[Date "1973.??.??"]',
      '',
      '1.d4 *',
      '',
      '[Date "1971.??.??"]',
      '',
      '1.d4 *',
      '',
      '[Date "1973.12.30"]',
      '',
      '1.d4 *',
      '',
      '[Date "1971.11.22"]',
      '',
      '1.d4 *',
      '',
    ]
    let pgnDb = Pgn.load(data)
    pgnDb.sort()
    let sortValues = pgnDb.games.map((game) => {
      return [
        game.header.Date.year,
        game.header.Date.month,
        game.header.Date.day,
        game.header.Event,
        game.header.Site,
        game.header.Round,
        game.header.White,
        game.header.Black,
        game.header.Result.result,
        game.mainLine,
      ]
    })
    expect(sortValues).toMatchInlineSnapshot(`
Array [
  Array [
    1971,
    undefined,
    undefined,
    "?",
    "?",
    "?",
    "?",
    "?",
    "*",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "?",
    "?",
    "?",
    "?",
    "?",
    "*",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "?",
    "?",
    "?",
    "?",
    "?",
    "*",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "ABC",
    "?",
    "?",
    "?",
    "?",
    "*",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "CDEF",
    "?",
    "?",
    "?",
    "?",
    "*",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "CDEF",
    "?",
    "?",
    "?",
    "?",
    "*",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "?",
    "?",
    "?",
    "?",
    "*",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "ABC",
    "?",
    "?",
    "?",
    "*",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "ABC",
    "ABC",
    "?",
    "?",
    "*",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "ABC",
    "CD",
    "?",
    "?",
    "*",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "ABC",
    "CD",
    "ABC",
    "?",
    "*",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "ABC",
    "CD",
    "CD",
    "?",
    "*",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "ABC",
    "CD",
    "CD",
    "Black ABC",
    "*",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "ABC",
    "CD",
    "CD",
    "Black CD",
    "*",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "ABC",
    "CD",
    "CD",
    "Black CD",
    "*",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "ABC",
    "CD",
    "CD",
    "Black CD",
    "0-1",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "ABC",
    "CD",
    "CD",
    "Black CD",
    "1-0",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "ABC",
    "CD",
    "CD",
    "Black CD",
    "1-0",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "ABC",
    "CD",
    "CD",
    "Black CD",
    "1-0",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "ABC",
    "CD",
    "CD",
    "Black CD",
    "1-0",
    "d4 d5 c4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "ABC",
    "CD",
    "CD",
    "Black CD",
    "1-0",
    "d4 d5 c4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "ABC",
    "CD",
    "CD",
    "Black CD",
    "1-0",
    "d4 d5 c4 c6 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "ABC",
    "CD",
    "CD",
    "Black CD",
    "1-0",
    "d4 d5 c4 e6 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "ABC",
    "CD",
    "CD",
    "Black CD",
    "1/2-1/2",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "ABC",
    "CD",
    "CD",
    "Black CD2",
    "*",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "ABC",
    "CD",
    "CD",
    "Black XYZV",
    "*",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "ABC",
    "CD",
    "CD2",
    "?",
    "*",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "ABC",
    "CD",
    "XYZEF",
    "?",
    "*",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "ABC",
    "CDA",
    "?",
    "?",
    "*",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "ABC",
    "XYZEF",
    "?",
    "?",
    "*",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "CDEF",
    "?",
    "?",
    "?",
    "*",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "CDEF",
    "?",
    "?",
    "?",
    "*",
    "d4 ",
  ],
  Array [
    1971,
    11,
    22,
    "XYZ",
    "XYZ",
    "?",
    "?",
    "?",
    "*",
    "d4 ",
  ],
  Array [
    1973,
    undefined,
    undefined,
    "?",
    "?",
    "?",
    "?",
    "?",
    "*",
    "d4 ",
  ],
  Array [
    1973,
    12,
    30,
    "?",
    "?",
    "?",
    "?",
    "?",
    "*",
    "d4 ",
  ],
]
`)
  })

  test('testing addGame, merge Database ', () => {
    let data = [
      '1.d4 Nf6 2.c4 ( d5 ( e4 e5 ) Nh6 ) *',
      '',
    ]
    let pgn = Pgn.load(data)
    let pdb = new PgnDatabase()
    pdb.merge(pgn)
    pdb.merge(pgn)
    expect(pdb).toMatchInlineSnapshot(`
PgnDatabase {
  "games": Array [
    PgnGame {
      "header": PgnTags {
        "Black": "?",
        "Date": PgnDate {},
        "Event": "?",
        "Result": PgnResult {
          "_result": "*",
        },
        "Round": "?",
        "Site": "?",
        "White": "?",
        "otherTags": Array [],
      },
      "moves": Array [
        PgnMoveElement {
          "annotation": Array [],
          "comment": Array [],
          "move": "d4",
          "variation": Array [],
        },
        PgnMoveElement {
          "annotation": Array [],
          "comment": Array [],
          "move": "Nf6",
          "variation": Array [],
        },
        PgnMoveElement {
          "annotation": Array [],
          "comment": Array [],
          "move": "c4",
          "variation": Array [
            PgnMoveElement {
              "annotation": Array [],
              "comment": Array [],
              "move": "d5",
              "variation": Array [
                PgnMoveElement {
                  "annotation": Array [],
                  "comment": Array [],
                  "move": "e4",
                  "variation": Array [],
                },
                PgnMoveElement {
                  "annotation": Array [],
                  "comment": Array [],
                  "move": "e5",
                  "variation": Array [],
                },
              ],
            },
            PgnMoveElement {
              "annotation": Array [],
              "comment": Array [],
              "move": "Nh6",
              "variation": Array [],
            },
          ],
        },
      ],
    },
    PgnGame {
      "header": PgnTags {
        "Black": "?",
        "Date": PgnDate {},
        "Event": "?",
        "Result": PgnResult {
          "_result": "*",
        },
        "Round": "?",
        "Site": "?",
        "White": "?",
        "otherTags": Array [],
      },
      "moves": Array [
        PgnMoveElement {
          "annotation": Array [],
          "comment": Array [],
          "move": "d4",
          "variation": Array [],
        },
        PgnMoveElement {
          "annotation": Array [],
          "comment": Array [],
          "move": "Nf6",
          "variation": Array [],
        },
        PgnMoveElement {
          "annotation": Array [],
          "comment": Array [],
          "move": "c4",
          "variation": Array [
            PgnMoveElement {
              "annotation": Array [],
              "comment": Array [],
              "move": "d5",
              "variation": Array [
                PgnMoveElement {
                  "annotation": Array [],
                  "comment": Array [],
                  "move": "e4",
                  "variation": Array [],
                },
                PgnMoveElement {
                  "annotation": Array [],
                  "comment": Array [],
                  "move": "e5",
                  "variation": Array [],
                },
              ],
            },
            PgnMoveElement {
              "annotation": Array [],
              "comment": Array [],
              "move": "Nh6",
              "variation": Array [],
            },
          ],
        },
      ],
    },
  ],
}
`)

  })
})
