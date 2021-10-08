import { Pgn } from "./Pgn"
import { PgnVariantTree } from "./PgnVariantTree"

describe('Testing PgnVariantTree', () => {

  test('testing fromPgnGame ', () => {
    let data = [
      '1.e4 e5 2.f4 exf4 3.Nf3 *',
      '1.d4 (1.e4 e5 (2...d5 3.exd5) 2.Nf3 Nc6 (2...Nf6 ) 3.Bb5) d5 2.c4 d6 *',
    ]
    let pgnDb = Pgn.load(data)
    let tree = PgnVariantTree.fromPgnGame(pgnDb.games[1])
    let nPaths = tree.getAllTerminalNodeKeyPaths()
    expect(nPaths).toMatchInlineSnapshot(`
Array [
  Array [
    "d4",
    "d5",
    "c4",
    "d6",
  ],
  Array [
    "e4",
    "e5",
    "Nf3",
    "Nc6",
    "Bb5",
  ],
  Array [
    "e4",
    "e5",
    "Nf3",
    "Nf6",
  ],
  Array [
    "e4",
    "d5",
    "exd5",
  ],
]
`)
    let pgnMoves = PgnVariantTree.toPgnGameMoves(tree)
    expect(pgnMoves.map((x) => x.move)).toMatchInlineSnapshot(`
Array [
  "d4",
  "d5",
  "c4",
  "d6",
]
`)

    PgnVariantTree.mergePgnGame(pgnDb.games[0], tree)
    expect(tree.getAllTerminalNodeKeyPaths()).toMatchInlineSnapshot(`
Array [
  Array [
    "d4",
    "d5",
    "c4",
    "d6",
  ],
  Array [
    "e4",
    "e5",
    "Nf3",
    "Nc6",
    "Bb5",
  ],
  Array [
    "e4",
    "e5",
    "Nf3",
    "Nf6",
  ],
  Array [
    "e4",
    "e5",
    "f4",
    "exf4",
    "Nf3",
  ],
  Array [
    "e4",
    "d5",
    "exd5",
  ],
]
`)
    tree.forEach((n) => n.data.comment = 'no comment') // TODO validate
  })
})