import { BishopMovesRaw, isOffsetBishopLike, bishopRay } from './chess-board-bishop-moves'
import { ChessBoardRepresentation } from './chess-board-representation'
import { ChessBoardData } from './chess-board'

describe('Testing chess-board-bishop-moves', () => {

    test('testing bishop moves', () => {
        let source = { colIdx: 0, rowIdx: 0 }
        let test: boolean[][] = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                let v = isOffsetBishopLike(source, { colIdx: c, rowIdx: r })
                test[c][r] = v.valid
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

        source = { colIdx: 0, rowIdx: 7 }
        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                let v = isOffsetBishopLike(source, { colIdx: c, rowIdx: r })
                test[c][r] = v.valid
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


        source = { colIdx: 5, rowIdx: 5 }
        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                let v = isOffsetBishopLike(source, { colIdx: c, rowIdx: r })
                test[c][r] = v.valid
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

        source = { colIdx: 4, rowIdx: 5 }
        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                let v = isOffsetBishopLike(source, { colIdx: c, rowIdx: r })
                test[c][r] = v.valid
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

        source = { colIdx: 5, rowIdx: 5 }
        let data = new ChessBoardData()
        let cbr = new ChessBoardRepresentation(data)
        let b = new BishopMovesRaw(source, cbr)
        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = false
            }
        }
        let r = b.getRay(bishopRay.NE)
        for (let x of r) {
            test[x.colIdx][x.rowIdx] = true
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
        r = b.getRay(bishopRay.SE)
        for (let x of r) {
            test[x.colIdx][x.rowIdx] = true
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

        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = false
            }
        }
        r = b.getRay(bishopRay.NW)
        for (let x of r) {
            test[x.colIdx][x.rowIdx] = true
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
        r = b.getRay(bishopRay.SW)
        for (let x of r) {
            test[x.colIdx][x.rowIdx] = true
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

    })
})