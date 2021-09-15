import { BishopMovesRaw, isOffsetBishopLike, bishopRay } from './BishopMovesRaw'
import { Field } from "../representation/Field"

describe('Testing chess-board-bishop-moves', () => {

    test('testing bishop moves', () => {
        let source = new Field(0, 0)
        let test: boolean[][] = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                let v = isOffsetBishopLike(source, new Field(c, r))
                test[c][r] = (typeof v !== 'undefined')
            }
        }
        let result: string[] = []
        for (let r = 0; r < 8; r++) {
            result[r] = ''
            for (let c = 0; c < 8; c++)
                result[r] += (test[c][r]) ? ' X ' : '   '
        }
        expect(result).toMatchInlineSnapshot(`
Array [
  " X                      ",
  "    X                   ",
  "       X                ",
  "          X             ",
  "             X          ",
  "                X       ",
  "                   X    ",
  "                      X ",
]
`)

        source = new Field(0, 7)
        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                let v = isOffsetBishopLike(source, new Field(c, r))
                test[c][r] = (typeof v !== 'undefined')
            }
        }
        result = []
        for (let r = 0; r < 8; r++) {
            result[r] = ''
            for (let c = 0; c < 8; c++)
                result[r] += (test[c][r]) ? ' X ' : '   '
        }
        expect(result).toMatchInlineSnapshot(`
Array [
  "                      X ",
  "                   X    ",
  "                X       ",
  "             X          ",
  "          X             ",
  "       X                ",
  "    X                   ",
  " X                      ",
]
`)


        source = new Field(5, 5)
        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                let v = isOffsetBishopLike(source, new Field(c, r))
                test[c][r] = (typeof v != 'undefined')
            }
        }
        result = []
        for (let r = 0; r < 8; r++) {
            result[r] = ''
            for (let c = 0; c < 8; c++)
                result[r] += (test[c][r]) ? ' X ' : '   '
        }
        expect(result).toMatchInlineSnapshot(`
Array [
  " X                      ",
  "    X                   ",
  "       X                ",
  "          X           X ",
  "             X     X    ",
  "                X       ",
  "             X     X    ",
  "          X           X ",
]
`)

        source = new Field(4, 5)
        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                let v = isOffsetBishopLike(source, new Field(c, r))
                test[c][r] = (typeof v !== 'undefined')
            }
        }
        result = []
        for (let r = 0; r < 8; r++) {
            result[r] = ''
            for (let c = 0; c < 8; c++)
                result[r] += (test[c][r]) ? ' X ' : '   '
        }
        expect(result).toMatchInlineSnapshot(`
Array [
  "                        ",
  " X                      ",
  "    X                 X ",
  "       X           X    ",
  "          X     X       ",
  "             X          ",
  "          X     X       ",
  "       X           X    ",
]
`)

        source = new Field(5, 5)
        let b = new BishopMovesRaw(source)
        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = false
            }
        }
        let r = b.getRay(bishopRay.NE)
        for (let x of r) {
            test[x.file][x.rank] = true
        }
        result = []
        for (let r = 0; r < 8; r++) {
            result[r] = ''
            for (let c = 0; c < 8; c++)
                result[r] += (test[c][r]) ? ' X ' : '   '
        }
        expect(result).toMatchInlineSnapshot(`
Array [
  "                        ",
  "                        ",
  "                        ",
  "                      X ",
  "                   X    ",
  "                        ",
  "                        ",
  "                        ",
]
`)

        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = false
            }
        }
        r = b.getRay(bishopRay.SE)
        for (let x of r) {
            test[x.file][x.rank] = true
        }
        result = []
        for (let r = 0; r < 8; r++) {
            result[r] = ''
            for (let c = 0; c < 8; c++)
                result[r] += (test[c][r]) ? ' X ' : '   '
        }
        expect(result).toMatchInlineSnapshot(`
Array [
  "                        ",
  "                        ",
  "                        ",
  "                        ",
  "                        ",
  "                        ",
  "                   X    ",
  "                      X ",
]
`)

        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = false
            }
        }
        r = b.getRay(bishopRay.NW)
        for (let x of r) {
            test[x.file][x.rank] = true
        }
        result = []
        for (let r = 0; r < 8; r++) {
            result[r] = ''
            for (let c = 0; c < 8; c++)
                result[r] += (test[c][r]) ? ' X ' : '   '
        }
        expect(result).toMatchInlineSnapshot(`
Array [
  " X                      ",
  "    X                   ",
  "       X                ",
  "          X             ",
  "             X          ",
  "                        ",
  "                        ",
  "                        ",
]
`)

        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = false
            }
        }
        r = b.getRay(bishopRay.SW)
        for (let x of r) {
            test[x.file][x.rank] = true
        }
        result = []
        for (let r = 0; r < 8; r++) {
            result[r] = ''
            for (let c = 0; c < 8; c++)
                result[r] += (test[c][r]) ? ' X ' : '   '
        }
        expect(result).toMatchInlineSnapshot(`
Array [
  "                        ",
  "                        ",
  "                        ",
  "                        ",
  "                        ",
  "                        ",
  "             X          ",
  "          X             ",
]
`)

    })
})