import { Field } from "../representation/Field"
import { KnightMovesRaw } from './KnightMovesRaw'

describe('Testing chess-board-bishop-moves', () => {

    test('testing knight moves', () => {
        let source = new Field(0, 0)
        let b = new KnightMovesRaw(source)
        let test: boolean[][] = []
        let v = b.moves
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = (v.find(x => x.sameI(c, r))) ? true : false

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

        source = new Field(4, 4)
        b = new KnightMovesRaw(source)
        test = []
        v = b.moves
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = (v.find(x => x.sameI(c, r))) ? true : false

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