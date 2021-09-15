import { RookMovesRaw, rookRay } from './RookMovesRaw'
import { Field } from "../representation/Field"

describe('Testing chess-board-rook-moves', () => {

    test('testing rook moves', () => {
        let source = new Field(0, 0)
        let test: boolean[][] = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                let v = source.isHorizontalVertical(new Field(c, r))
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
  " X  X  X  X  X  X  X  X ",
  " X                      ",
  " X                      ",
  " X                      ",
  " X                      ",
  " X                      ",
  " X                      ",
  " X                      ",
]
`)

        source = new Field(7, 7)
        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                let v = source.isHorizontalVertical(new Field(c, r))
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
  "                      X ",
  "                      X ",
  "                      X ",
  "                      X ",
  "                      X ",
  "                      X ",
  " X  X  X  X  X  X  X  X ",
]
`)

        source = new Field(5, 5)
        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                let v = source.isHorizontalVertical(new Field(c, r))
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
  "                X       ",
  "                X       ",
  "                X       ",
  "                X       ",
  "                X       ",
  " X  X  X  X  X  X  X  X ",
  "                X       ",
  "                X       ",
]
`)


        source = new Field(5, 5)
        let b = new RookMovesRaw(source)
        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = false
            }
        }
        let r = b.getRay(rookRay.N)
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
  "                X       ",
  "                X       ",
  "                X       ",
  "                X       ",
  "                X       ",
  "                        ",
  "                        ",
  "                        ",
]
`)

        b = new RookMovesRaw(source)
        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = false
            }
        }
        r = b.getRay(rookRay.S)
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
  "                X       ",
  "                X       ",
]
`)


        b = new RookMovesRaw(source)
        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = false
            }
        }
        r = b.getRay(rookRay.E)
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
  "                   X  X ",
  "                        ",
  "                        ",
]
`)

        b = new RookMovesRaw(source)
        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = false
            }
        }
        r = b.getRay(rookRay.W)
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
  " X  X  X  X  X          ",
  "                        ",
  "                        ",
]
`)

    })
})
