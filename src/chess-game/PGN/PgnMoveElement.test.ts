import { PgnMoveElement } from './PgnMoveElement'
describe('Testing PgnMoveElement', () => {

    test('testing PgnMoves moves ', () => {
        let root = new PgnMoveElement('e4')
        let v1 = new PgnMoveElement('d4')
        let v2 = new PgnMoveElement('c4')
        let v3 = new PgnMoveElement('Nf3')
        root.variation.push(v1)
        v1.variation.push(v2)
        v2.variation.push(v3)

        expect(root.allVariations()).toMatchInlineSnapshot(`
Array [
  Array [
    PgnMoveElement {
      "annotation": Array [],
      "comment": Array [],
      "move": "d4",
      "variation": Array [
        PgnMoveElement {
          "annotation": Array [],
          "comment": Array [],
          "move": "c4",
          "variation": Array [
            PgnMoveElement {
              "annotation": Array [],
              "comment": Array [],
              "move": "Nf3",
              "variation": Array [],
            },
          ],
        },
      ],
    },
  ],
  Array [
    PgnMoveElement {
      "annotation": Array [],
      "comment": Array [],
      "move": "c4",
      "variation": Array [
        PgnMoveElement {
          "annotation": Array [],
          "comment": Array [],
          "move": "Nf3",
          "variation": Array [],
        },
      ],
    },
  ],
  Array [
    PgnMoveElement {
      "annotation": Array [],
      "comment": Array [],
      "move": "Nf3",
      "variation": Array [],
    },
  ],
]
`)


        expect(root.alternativeMoves).toMatchInlineSnapshot(`
Array [
  PgnMoveElement {
    "annotation": Array [],
    "comment": Array [],
    "move": "e4",
    "variation": Array [
      PgnMoveElement {
        "annotation": Array [],
        "comment": Array [],
        "move": "d4",
        "variation": Array [
          PgnMoveElement {
            "annotation": Array [],
            "comment": Array [],
            "move": "c4",
            "variation": Array [
              PgnMoveElement {
                "annotation": Array [],
                "comment": Array [],
                "move": "Nf3",
                "variation": Array [],
              },
            ],
          },
        ],
      },
    ],
  },
  PgnMoveElement {
    "annotation": Array [],
    "comment": Array [],
    "move": "d4",
    "variation": Array [
      PgnMoveElement {
        "annotation": Array [],
        "comment": Array [],
        "move": "c4",
        "variation": Array [
          PgnMoveElement {
            "annotation": Array [],
            "comment": Array [],
            "move": "Nf3",
            "variation": Array [],
          },
        ],
      },
    ],
  },
  PgnMoveElement {
    "annotation": Array [],
    "comment": Array [],
    "move": "c4",
    "variation": Array [
      PgnMoveElement {
        "annotation": Array [],
        "comment": Array [],
        "move": "Nf3",
        "variation": Array [],
      },
    ],
  },
  PgnMoveElement {
    "annotation": Array [],
    "comment": Array [],
    "move": "Nf3",
    "variation": Array [],
  },
]
`)
    })
})
