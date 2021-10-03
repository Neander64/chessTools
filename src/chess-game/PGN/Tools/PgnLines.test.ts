import { Pgn } from "../Pgn"
import { PgnLines, PgnLinesStr } from "./PgnLines"

describe('Testing PgnLines', () => {

    test('testing line generation ', () => {
        let data = [
            '1.d4 Nf6 2.c4 ( d5 ( e4 e5 ) Nh6 ) *',
            '1.e4 Nf6 2.d4 ( d5 ( e4 e5 ) Nh6 ) *',
            '',
        ]
        let pgn = Pgn.load(data)
        expect(PgnLinesStr.generateLinesForDatabase(pgn)).toMatchInlineSnapshot(`
Array [
  "d4 Nf6 c4 ",
  "d4 Nf6 d5 Nh6 ",
  "d4 Nf6 e4 e5 ",
  "e4 Nf6 d4 ",
  "e4 Nf6 d5 Nh6 ",
  "e4 Nf6 e4 e5 ",
]
`)
        expect(PgnLines.generateLinesForDatabase(pgn)).toMatchInlineSnapshot(`
Array [
  Array [
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
      "variation": Array [],
    },
  ],
  Array [
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
      "move": "d5",
      "variation": Array [],
    },
    PgnMoveElement {
      "annotation": Array [],
      "comment": Array [],
      "move": "Nh6",
      "variation": Array [],
    },
  ],
  Array [
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
  Array [
    PgnMoveElement {
      "annotation": Array [],
      "comment": Array [],
      "move": "e4",
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
      "move": "d4",
      "variation": Array [],
    },
  ],
  Array [
    PgnMoveElement {
      "annotation": Array [],
      "comment": Array [],
      "move": "e4",
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
      "move": "d5",
      "variation": Array [],
    },
    PgnMoveElement {
      "annotation": Array [],
      "comment": Array [],
      "move": "Nh6",
      "variation": Array [],
    },
  ],
  Array [
    PgnMoveElement {
      "annotation": Array [],
      "comment": Array [],
      "move": "e4",
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
]
`)
    })
})
