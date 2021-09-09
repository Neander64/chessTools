import { ChessBoardRepresentation } from './chess-board-representation'
import { ChessBoardData } from './chess-board'
import { KnightMovesRaw } from './chess-board-knight-moves'
import { sameFields } from './chess-board-internal-types'

describe('Testing chess-board-bishop-moves', () => {

    test('testing knight moves', () => {
        let source = { colIdx: 0, rowIdx: 0 }
        let data = new ChessBoardData()
        let cbr = new ChessBoardRepresentation(data)
        let b = new KnightMovesRaw(source, cbr)
        let test: boolean[][] = []
        let v = b.moves
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = (v.find(x => sameFields(x, { colIdx: c, rowIdx: r }))) ? true : false

            }
        }
        let result: string[] = []
        for (let c = 0; c < 8; c++) {
            result[c] = ''
            for (let r = 0; r < 8; r++)
                result[c] += (test[c][r]) ? ' X ' : '   '
        }
        expect(result).toMatchInlineSnapshot(`
Array [
  "                        ",
  "       X                ",
  "    X                   ",
  "                        ",
  "                        ",
  "                        ",
  "                        ",
  "                        ",
]
`)

        source = { colIdx: 4, rowIdx: 4 }
        b = new KnightMovesRaw(source, cbr)
        test = []
        v = b.moves
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = (v.find(x => sameFields(x, { colIdx: c, rowIdx: r }))) ? true : false

            }
        }
        result = []
        for (let c = 0; c < 8; c++) {
            result[c] = ''
            for (let r = 0; r < 8; r++)
                result[c] += (test[c][r]) ? ' X ' : '   '
        }
        expect(result).toMatchInlineSnapshot(`
Array [
  "                        ",
  "                        ",
  "          X     X       ",
  "       X           X    ",
  "                        ",
  "       X           X    ",
  "          X     X       ",
  "                        ",
]
`)

    })
})