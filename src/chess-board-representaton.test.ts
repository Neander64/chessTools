import { ChessBoardRepresentation, Field } from './chess-board-representation'
import { ChessBoardData } from './chess-board'
import { Piece, pieceKind } from './chess-board-pieces'
import { color } from './chess-color'
import { offsetsEnum } from './chess-board-offsets'

describe('Testing chess-board-representation', () => {

    test('testing Field implementation', () => {
        let f = new Field(0, 0)
        expect(f.isOnBoard()).toBe(true)
        expect(f.file).toBe(0)
        expect(f.rank).toBe(0)
        expect(f.notation).toBe('a8')
        let f1 = f.shift(offsetsEnum.N)
        expect(f1.isOnBoard()).toBe(false)
        expect(f1.same(f)).toBe(false)
        expect(f.same(f1)).toBe(false)

        f = new Field(5, 5)
        expect(f.notation).toBe('f3')
        f1 = f.shift(offsetsEnum.N)
        expect(f1.notation).toBe('f4')
        f1 = f.shift(offsetsEnum.W)
        expect(f1.notation).toBe('e3')
        f1 = f.shift(offsetsEnum.S)
        expect(f1.notation).toBe('f2')
        f1 = f.shift(offsetsEnum.E)
        expect(f1.notation).toBe('g3')

        f1 = f.shift(offsetsEnum.NW)
        expect(f1.notation).toBe('e4')
        f1 = f.shift(offsetsEnum.SW)
        expect(f1.notation).toBe('e2')
        f1 = f.shift(offsetsEnum.SE)
        expect(f1.notation).toBe('g2')
        f1 = f.shift(offsetsEnum.NE)
        expect(f1.notation).toBe('g4')

        f1 = f.shift(offsetsEnum.NNE)
        expect(f1.notation).toBe('g5')
        f1 = f.shift(offsetsEnum.NNW)
        expect(f1.notation).toBe('e5')
        f1 = f.shift(offsetsEnum.SSE)
        expect(f1.notation).toBe('g1')
        f1 = f.shift(offsetsEnum.SSW)
        expect(f1.notation).toBe('e1')
        f1 = f.shift(offsetsEnum.WWN)
        expect(f1.notation).toBe('d4')
        f1 = f.shift(offsetsEnum.WWS)
        expect(f1.notation).toBe('d2')
        f1 = f.shift(offsetsEnum.EEN)
        expect(f1.notation).toBe('h4')
        f1 = f.shift(offsetsEnum.EES)
        expect(f1.notation).toBe('h2')

        f1 = f.shift(offsetsEnum.N, 2)
        expect(f1.notation).toBe('f5')

    })

    test('testing validation (Rook)', () => {

        let data = new ChessBoardData()
        let cbr = new ChessBoardRepresentation(data)
        cbr.clearBoard()
        data.nextMoveBy = color.black
        let p = Piece.blackRook()
        let source = { colIdx: 4, rowIdx: 5 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackKing(), { colIdx: 0, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 0, rowIdx: 7 })
        let pob = cbr.peekFieldPieceOB(source)
        let test: boolean[][] = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = cbr.validateMove(pob, { colIdx: c, rowIdx: r }).isValid
            }
        }
        let result = []
        for (let r = 0; r < 8; r++) {
            result[r] = ''
            for (let c = 0; c < 8; c++)
                result[r] += (test[c][r]) ? ' X ' : '   '
        }
        expect(result).toMatchInlineSnapshot(`
        Array [
          "             X          ",
          "             X          ",
          "             X          ",
          "             X          ",
          "             X          ",
          " X  X  X  X     X  X  X ",
          "             X          ",
          "             X          ",
        ]
        `)

        // Blocked by own piece
        source = { colIdx: 4, rowIdx: 5 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackRook(), { colIdx: 4, rowIdx: 2 })
        cbr.setPiece(Piece.blackKing(), { colIdx: 0, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 0, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = cbr.validateMove(pob, { colIdx: c, rowIdx: r }).isValid
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
          "                        ",
          "                        ",
          "             X          ",
          "             X          ",
          " X  X  X  X     X  X  X ",
          "             X          ",
          "             X          ",
        ]
        `)

        // Blocked and can capture
        source = { colIdx: 4, rowIdx: 5 }
        cbr.clearBoard()
        p = Piece.whiteRook()
        data.nextMoveBy = color.white
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackRook(), { colIdx: 4, rowIdx: 2 })
        cbr.setPiece(Piece.blackKing(), { colIdx: 0, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 0, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = cbr.validateMove(pob, { colIdx: c, rowIdx: r }).isValid
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
          "                        ",
          "             X          ",
          "             X          ",
          "             X          ",
          " X  X  X  X     X  X  X ",
          "             X          ",
          "             X          ",
        ]
        `)
    })


    test('testing validation (Knight)', () => {
        let data = new ChessBoardData()
        let cbr = new ChessBoardRepresentation(data)
        cbr.clearBoard()
        let p = Piece.blackKnight()
        data.nextMoveBy = color.black
        let source = { colIdx: 4, rowIdx: 5 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackKing(), { colIdx: 0, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 0, rowIdx: 7 })
        let pob = cbr.peekFieldPieceOB(source)
        let test: boolean[][] = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = cbr.validateMove(pob, { colIdx: c, rowIdx: r }).isValid
            }
        }
        let result = []
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
          "          X     X       ",
          "       X           X    ",
          "                        ",
          "       X           X    ",
          "          X     X       ",
        ]
        `)

        source = { colIdx: 1, rowIdx: 6 }
        cbr.clearBoard()
        p = Piece.whiteKnight()
        data.nextMoveBy = color.white
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackKing(), { colIdx: 0, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 7, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        for (let c = 0; c < 8; c++) {
            for (let r = 0; r < 8; r++) {
                test[c][r] = cbr.validateMove(pob, { colIdx: c, rowIdx: r }).isValid
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
          "                        ",
          "                        ",
          "                        ",
          " X     X                ",
          "          X             ",
          "                        ",
          "          X             ",
        ]
        `)

        source = { colIdx: 6, rowIdx: 3 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackKing(), { colIdx: 0, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 0, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        for (let c = 0; c < 8; c++) {
            for (let r = 0; r < 8; r++) {
                test[c][r] = cbr.validateMove(pob, { colIdx: c, rowIdx: r }).isValid
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
          "                X     X ",
          "             X          ",
          "                        ",
          "             X          ",
          "                X     X ",
          "                        ",
          "                        ",
        ]
        `)
    })

    test('testing validation (Bishop)', () => {
        let data = new ChessBoardData()
        let cbr = new ChessBoardRepresentation(data)
        cbr.clearBoard()
        let p = Piece.blackBishop()
        data.nextMoveBy = color.black

        // Fields on Board test
        let test: boolean[][] = []
        for (let c = -1; c < 9; c++) {
            test[c + 1] = []
            for (let r = -1; r < 9; r++) {
                test[c + 1][r + 1] = cbr.isFieldOnBoard({ colIdx: c, rowIdx: r })
            }
        }
        let result: string[] = []
        for (let r = -1; r < 9; r++) {
            result[r + 1] = ''
            for (let c = -1; c < 9; c++)
                result[r + 1] += (test[c + 1][r + 1]) ? ' X ' : '   '
        }
        expect(result).toMatchInlineSnapshot(`
    Array [
      "                              ",
      "    X  X  X  X  X  X  X  X    ",
      "    X  X  X  X  X  X  X  X    ",
      "    X  X  X  X  X  X  X  X    ",
      "    X  X  X  X  X  X  X  X    ",
      "    X  X  X  X  X  X  X  X    ",
      "    X  X  X  X  X  X  X  X    ",
      "    X  X  X  X  X  X  X  X    ",
      "    X  X  X  X  X  X  X  X    ",
      "                              ",
    ]
    `)
        // Bishop in Corner a8
        let source = { colIdx: 0, rowIdx: 0 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackKing(), { colIdx: 7, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 0, rowIdx: 7 })
        let pob = cbr.peekFieldPieceOB(source)
        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = cbr.validateMove(pob, { colIdx: c, rowIdx: r }).isValid
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
      "    X                   ",
      "       X                ",
      "          X             ",
      "             X          ",
      "                X       ",
      "                   X    ",
      "                      X ",
    ]
    `)

        // Bishop in Corner h8
        source = { colIdx: 7, rowIdx: 0 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackKing(), { colIdx: 0, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 7, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        for (let c = 0; c < 8; c++) {
            for (let r = 0; r < 8; r++) {
                test[c][r] = cbr.validateMove(pob, { colIdx: c, rowIdx: r }).isValid
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
      "                   X    ",
      "                X       ",
      "             X          ",
      "          X             ",
      "       X                ",
      "    X                   ",
      " X                      ",
    ]
    `)

        // Bishop in Corner a1
        source = { colIdx: 0, rowIdx: 7 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackKing(), { colIdx: 0, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 7, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        for (let c = 0; c < 8; c++) {
            for (let r = 0; r < 8; r++) {
                test[c][r] = cbr.validateMove(pob, { colIdx: c, rowIdx: r }).isValid
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
      "                        ",
    ]
    `)

        // Bishop in Corner h1
        source = { colIdx: 7, rowIdx: 7 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackKing(), { colIdx: 7, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 0, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        for (let c = 0; c < 8; c++) {
            for (let r = 0; r < 8; r++) {
                test[c][r] = cbr.validateMove(pob, { colIdx: c, rowIdx: r }).isValid
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
      "          X             ",
      "             X          ",
      "                X       ",
      "                   X    ",
      "                        ",
    ]
    `)

        // Bishop in central field
        source = { colIdx: 4, rowIdx: 4 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackKing(), { colIdx: 4, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 4, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        for (let c = 0; c < 8; c++) {
            for (let r = 0; r < 8; r++) {
                test[c][r] = cbr.validateMove(pob, { colIdx: c, rowIdx: r }).isValid
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
      "    X                 X ",
      "       X           X    ",
      "          X     X       ",
      "                        ",
      "          X     X       ",
      "       X           X    ",
      "    X                 X ",
    ]
    `)

        // Bishop in central field, blocked
        source = { colIdx: 4, rowIdx: 4 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackRook(), { colIdx: 5, rowIdx: 5 })
        cbr.setPiece(Piece.blackKing(), { colIdx: 4, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 4, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        for (let c = 0; c < 8; c++) {
            for (let r = 0; r < 8; r++) {
                test[c][r] = cbr.validateMove(pob, { colIdx: c, rowIdx: r }).isValid
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
      "    X                 X ",
      "       X           X    ",
      "          X     X       ",
      "                        ",
      "          X             ",
      "       X                ",
      "    X                   ",
    ]
    `)

        // Bishop in central field, blocked, can capture
        source = { colIdx: 4, rowIdx: 4 }
        p = Piece.whiteBishop()
        data.nextMoveBy = color.white
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackRook(), { colIdx: 5, rowIdx: 5 })
        pob = cbr.peekFieldPieceOB(source)
        cbr.setPiece(Piece.blackKing(), { colIdx: 4, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 4, rowIdx: 7 })
        for (let c = 0; c < 8; c++) {
            for (let r = 0; r < 8; r++) {
                test[c][r] = cbr.validateMove(pob, { colIdx: c, rowIdx: r }).isValid
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
      "    X                 X ",
      "       X           X    ",
      "          X     X       ",
      "                        ",
      "          X     X       ",
      "       X                ",
      "    X                   ",
    ]
    `)
    })

    test('testing validation (Queen)', () => {
        let data = new ChessBoardData()
        let cbr = new ChessBoardRepresentation(data)
        let p = Piece.blackQueen()
        data.nextMoveBy = color.black
        let source = { colIdx: 4, rowIdx: 5 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackKing(), { colIdx: 0, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 0, rowIdx: 7 })
        let pob = cbr.peekFieldPieceOB(source)
        let test: boolean[][] = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = cbr.validateMove(pob, { colIdx: c, rowIdx: r }).isValid
            }
        }
        let result = []
        for (let r = 0; r < 8; r++) {
            result[r] = ''
            for (let c = 0; c < 8; c++)
                result[r] += (test[c][r]) ? ' X ' : '   '
        }
        expect(result).toMatchInlineSnapshot(`
    Array [
      "             X          ",
      " X           X          ",
      "    X        X        X ",
      "       X     X     X    ",
      "          X  X  X       ",
      " X  X  X  X     X  X  X ",
      "          X  X  X       ",
      "       X     X     X    ",
    ]
    `)
        // Blocked by own piece
        source = { colIdx: 4, rowIdx: 5 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackRook(), { colIdx: 4, rowIdx: 2 })
        cbr.setPiece(Piece.blackKing(), { colIdx: 0, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 0, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = cbr.validateMove(pob, { colIdx: c, rowIdx: r }).isValid
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
      "       X     X     X    ",
      "          X  X  X       ",
      " X  X  X  X     X  X  X ",
      "          X  X  X       ",
      "       X     X     X    ",
    ]
    `)

        // Blocked and can capture
        source = { colIdx: 4, rowIdx: 5 }
        cbr.clearBoard()
        p = Piece.whiteQueen()
        data.nextMoveBy = color.white
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackRook(), { colIdx: 4, rowIdx: 2 })
        cbr.setPiece(Piece.blackKing(), { colIdx: 0, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 0, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = cbr.validateMove(pob, { colIdx: c, rowIdx: r }).isValid
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
      "    X        X        X ",
      "       X     X     X    ",
      "          X  X  X       ",
      " X  X  X  X     X  X  X ",
      "          X  X  X       ",
      "       X     X     X    ",
    ]
    `)

    })

    test('testing validation (King)', () => {
        let data = new ChessBoardData()
        let cbr = new ChessBoardRepresentation(data)
        let p = Piece.blackKing()
        data.nextMoveBy = color.black
        let source = { colIdx: 4, rowIdx: 5 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.whiteKing(), { colIdx: 0, rowIdx: 7 })
        let pob = cbr.peekFieldPieceOB(source)
        let test: boolean[][] = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = cbr.validateMove(pob, { colIdx: c, rowIdx: r }).isValid
            }
        }
        let result = []
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
      "          X  X  X       ",
      "          X     X       ",
      "          X  X  X       ",
      "                        ",
    ]
    `)

        // Blocked by own piece
        source = { colIdx: 4, rowIdx: 5 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackRook(), { colIdx: 4, rowIdx: 6 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 0, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = cbr.validateMove(pob, { colIdx: c, rowIdx: r }).isValid
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
      "                        ",
      "                        ",
      "                        ",
      "          X  X  X       ",
      "          X     X       ",
      "          X     X       ",
      "                        ",
    ]
    `)

        // Blocked and can capture
        source = { colIdx: 4, rowIdx: 5 }
        cbr.clearBoard()
        p = Piece.whiteKing()
        data.nextMoveBy = color.white
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackRook(), { colIdx: 4, rowIdx: 4 })
        cbr.setPiece(Piece.blackKing(), { colIdx: 0, rowIdx: 0 })
        pob = cbr.peekFieldPieceOB(source)
        test = []
        for (let c = 0; c < 8; c++) {
            test[c] = []
            for (let r = 0; r < 8; r++) {
                test[c][r] = cbr.validateMove(pob, { colIdx: c, rowIdx: r }).isValid
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
  "                        ",
  "                        ",
  "                        ",
  "             X          ",
  "          X     X       ",
  "          X     X       ",
  "                        ",
]
`)
        // check castle options
        let k = Piece.whiteKing()
        data.nextMoveBy = color.white
        let t = Piece.whiteRook()
        let source_k = { colIdx: 4, rowIdx: 7 }
        let target_k = { colIdx: 6, rowIdx: 7 }
        let source_t = { colIdx: 7, rowIdx: 7 }
        cbr.clearBoard()
        cbr.setPiece(k, source_k)
        cbr.setPiece(t, source_t)
        cbr.setPiece(Piece.blackKing(), { colIdx: 4, rowIdx: 0 })
        pob = cbr.peekFieldPieceOB(source_k)
        data.castleFlags.canCastleShortWhite = true
        data.castleFlags.canCastleLongWhite = false
        data.castleFlags.canCastleShortBlack = false
        data.castleFlags.canCastleLongBlack = false
        expect(cbr.validateMove(pob, target_k).isValid).toBe(true)
        data.castleFlags.canCastleShortWhite = false
        expect(cbr.validateMove(pob, target_k).isValid).toBe(false)

        k = Piece.whiteKing()
        t = Piece.blackRook()
        source_k = { colIdx: 4, rowIdx: 7 }
        target_k = { colIdx: 6, rowIdx: 7 }
        source_t = { colIdx: 7, rowIdx: 7 }
        cbr.clearBoard()
        cbr.setPiece(k, source_k)
        cbr.setPiece(t, source_t)
        cbr.setPiece(Piece.blackKing(), { colIdx: 4, rowIdx: 0 })
        pob = cbr.peekFieldPieceOB(source_k)
        data.castleFlags.canCastleShortWhite = true
        data.castleFlags.canCastleLongWhite = true
        data.castleFlags.canCastleShortBlack = true
        data.castleFlags.canCastleLongBlack = true
        expect(cbr.validateMove(pob, target_k).isValid).toBe(false)

        k = Piece.whiteKing()
        t = Piece.whiteRook()
        source_k = { colIdx: 4, rowIdx: 7 }
        target_k = { colIdx: 2, rowIdx: 7 }
        source_t = { colIdx: 0, rowIdx: 7 }
        cbr.clearBoard()
        cbr.setPiece(k, source_k)
        cbr.setPiece(t, source_t)
        cbr.setPiece(Piece.blackKing(), { colIdx: 4, rowIdx: 0 })
        pob = cbr.peekFieldPieceOB(source_k)
        data.castleFlags.canCastleShortWhite = false
        data.castleFlags.canCastleLongWhite = true
        data.castleFlags.canCastleShortBlack = false
        data.castleFlags.canCastleLongBlack = false
        expect(cbr.validateMove(pob, target_k).isValid).toBe(true)
        data.castleFlags.canCastleLongWhite = false
        expect(cbr.validateMove(pob, target_k).isValid).toBe(false)

        // black castles
        k = Piece.blackKing()
        t = Piece.blackRook()
        source_k = { colIdx: 4, rowIdx: 0 }
        target_k = { colIdx: 6, rowIdx: 0 }
        source_t = { colIdx: 7, rowIdx: 0 }
        cbr.clearBoard()
        cbr.setPiece(k, source_k)
        cbr.setPiece(t, source_t)
        cbr.setPiece(Piece.whiteKing(), { colIdx: 4, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source_k)
        data.castleFlags.canCastleShortWhite = false
        data.castleFlags.canCastleLongWhite = false
        data.castleFlags.canCastleShortBlack = true
        data.castleFlags.canCastleLongBlack = false
        expect(cbr.validateMove(pob, target_k).isValid).toBe(true)
        data.castleFlags.canCastleShortBlack = false
        expect(cbr.validateMove(pob, target_k).isValid).toBe(false)

        source_k = { colIdx: 4, rowIdx: 0 }
        target_k = { colIdx: 2, rowIdx: 0 }
        source_t = { colIdx: 0, rowIdx: 0 }
        cbr.clearBoard()
        cbr.setPiece(k, source_k)
        cbr.setPiece(t, source_t)
        cbr.setPiece(Piece.whiteKing(), { colIdx: 4, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source_k)
        data.castleFlags.canCastleShortWhite = false
        data.castleFlags.canCastleLongWhite = false
        data.castleFlags.canCastleShortBlack = false
        data.castleFlags.canCastleLongBlack = true
        expect(cbr.validateMove(pob, target_k).isValid).toBe(true)
        data.castleFlags.canCastleLongBlack = false
        expect(cbr.validateMove(pob, target_k).isValid).toBe(false)

        // 
        k = Piece.whiteKing()
        t = Piece.blackRook()
        source_k = { colIdx: 4, rowIdx: 0 }
        target_k = { colIdx: 6, rowIdx: 0 }
        source_t = { colIdx: 7, rowIdx: 0 }
        cbr.clearBoard()
        cbr.setPiece(k, source_k)
        cbr.setPiece(t, source_t)
        cbr.setPiece(Piece.blackKing(), { colIdx: 4, rowIdx: 3 })
        data.nextMoveBy = color.black
        pob = cbr.peekFieldPieceOB(source_k)
        data.castleFlags.canCastleShortWhite = true
        data.castleFlags.canCastleLongWhite = true
        data.castleFlags.canCastleShortBlack = true
        data.castleFlags.canCastleLongBlack = true
        expect(cbr.validateMove(pob, target_k).isValid).toBe(false)

    })

    test('testing validation (Pawn)', () => {
        let data = new ChessBoardData()
        let cbr = new ChessBoardRepresentation(data)
        let p = Piece.blackPawn()
        data.nextMoveBy = color.black
        let p2 = Piece.whiteRook()
        let source = { colIdx: 0, rowIdx: 1 }
        let target = { colIdx: 0, rowIdx: 2 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackKing(), { colIdx: 4, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 4, rowIdx: 7 })
        let pob = cbr.peekFieldPieceOB(source)
        expect(cbr.validateMove(pob, target).isValid).toBe(true)

        source = { colIdx: 0, rowIdx: 1 }
        target = { colIdx: 0, rowIdx: 3 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackKing(), { colIdx: 4, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 4, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        expect(cbr.validateMove(pob, target).isValid).toBe(true)

        source = { colIdx: 0, rowIdx: 1 }
        target = { colIdx: 1, rowIdx: 2 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(p2, { colIdx: 1, rowIdx: 2 })
        cbr.setPiece(Piece.blackKing(), { colIdx: 4, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 4, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        expect(cbr.validateMove(pob, target).isValid).toBe(true)

        source = { colIdx: 1, rowIdx: 6 }
        target = { colIdx: 1, rowIdx: 7 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackKing(), { colIdx: 4, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 4, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        expect(cbr.validateMove(pob, target).isValid).toBe(false)
        expect(cbr.validateMove(pob, target, pieceKind.Pawn).isValid).toBe(false)
        expect(cbr.validateMove(pob, target, pieceKind.King).isValid).toBe(false)
        expect(cbr.validateMove(pob, target, pieceKind.Rook).isValid).toBe(true)
        expect(cbr.validateMove(pob, target, pieceKind.Bishop).isValid).toBe(true)
        expect(cbr.validateMove(pob, target, pieceKind.Knight).isValid).toBe(true)
        expect(cbr.validateMove(pob, target, pieceKind.Queen).isValid).toBe(true)

        source = { colIdx: 1, rowIdx: 6 }
        target = { colIdx: 0, rowIdx: 7 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(p2, { colIdx: 0, rowIdx: 7 })
        cbr.setPiece(Piece.blackKing(), { colIdx: 4, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 4, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        expect(cbr.validateMove(pob, target).isValid).toBe(false)
        expect(cbr.validateMove(pob, target, pieceKind.Pawn).isValid).toBe(false)
        expect(cbr.validateMove(pob, target, pieceKind.King).isValid).toBe(false)
        expect(cbr.validateMove(pob, target, pieceKind.Rook).isValid).toBe(true)
        expect(cbr.validateMove(pob, target, pieceKind.Bishop).isValid).toBe(true)
        expect(cbr.validateMove(pob, target, pieceKind.Knight).isValid).toBe(true)
        expect(cbr.validateMove(pob, target, pieceKind.Queen).isValid).toBe(true)

        source = { colIdx: 1, rowIdx: 6 }
        target = { colIdx: 2, rowIdx: 7 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(p2, { colIdx: 2, rowIdx: 7 })
        cbr.setPiece(Piece.blackKing(), { colIdx: 4, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 4, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        expect(cbr.validateMove(pob, target).isValid).toBe(false)
        expect(cbr.validateMove(pob, target, pieceKind.Pawn).isValid).toBe(false)
        expect(cbr.validateMove(pob, target, pieceKind.King).isValid).toBe(false)
        expect(cbr.validateMove(pob, target, pieceKind.Rook).isValid).toBe(true)
        expect(cbr.validateMove(pob, target, pieceKind.Bishop).isValid).toBe(true)
        expect(cbr.validateMove(pob, target, pieceKind.Knight).isValid).toBe(true)
        expect(cbr.validateMove(pob, target, pieceKind.Queen).isValid).toBe(true)

        // --- flip colors, same test
        p = Piece.whitePawn()
        p2 = Piece.blackRook()
        data.nextMoveBy = color.white

        source = { colIdx: 0, rowIdx: 6 }
        target = { colIdx: 0, rowIdx: 5 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackKing(), { colIdx: 4, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 4, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        expect(cbr.validateMove(pob, target).isValid).toBe(true)

        source = { colIdx: 0, rowIdx: 6 }
        target = { colIdx: 1, rowIdx: 5 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(p2, { colIdx: 1, rowIdx: 5 })
        cbr.setPiece(Piece.blackKing(), { colIdx: 4, rowIdx: 0 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 4, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        expect(cbr.validateMove(pob, target).isValid).toBe(true)

        source = { colIdx: 1, rowIdx: 1 }
        target = { colIdx: 1, rowIdx: 0 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackKing(), { colIdx: 7, rowIdx: 1 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 4, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        expect(cbr.validateMove(pob, target).isValid).toBe(false)
        expect(cbr.validateMove(pob, target, pieceKind.Pawn).isValid).toBe(false)
        expect(cbr.validateMove(pob, target, pieceKind.King).isValid).toBe(false)
        expect(cbr.validateMove(pob, target, pieceKind.Rook).isValid).toBe(true)
        expect(cbr.validateMove(pob, target, pieceKind.Bishop).isValid).toBe(true)
        expect(cbr.validateMove(pob, target, pieceKind.Knight).isValid).toBe(true)
        expect(cbr.validateMove(pob, target, pieceKind.Queen).isValid).toBe(true)

        source = { colIdx: 1, rowIdx: 1 }
        target = { colIdx: 0, rowIdx: 0 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(p2, { colIdx: 0, rowIdx: 0 })
        cbr.setPiece(Piece.blackKing(), { colIdx: 7, rowIdx: 1 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 4, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        expect(cbr.validateMove(pob, target).isValid).toBe(false)
        expect(cbr.validateMove(pob, target, pieceKind.Pawn).isValid).toBe(false)
        expect(cbr.validateMove(pob, target, pieceKind.King).isValid).toBe(false)
        expect(cbr.validateMove(pob, target, pieceKind.Rook).isValid).toBe(true)
        expect(cbr.validateMove(pob, target, pieceKind.Bishop).isValid).toBe(true)
        expect(cbr.validateMove(pob, target, pieceKind.Knight).isValid).toBe(true)
        expect(cbr.validateMove(pob, target, pieceKind.Queen).isValid).toBe(true)

        source = { colIdx: 1, rowIdx: 1 }
        target = { colIdx: 2, rowIdx: 0 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(p2, { colIdx: 2, rowIdx: 0 })
        cbr.setPiece(Piece.blackKing(), { colIdx: 7, rowIdx: 1 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 4, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        expect(cbr.validateMove(pob, target).isValid).toBe(false)
        expect(cbr.validateMove(pob, target, pieceKind.Pawn).isValid).toBe(false)
        expect(cbr.validateMove(pob, target, pieceKind.King).isValid).toBe(false)
        expect(cbr.validateMove(pob, target, pieceKind.Rook).isValid).toBe(true)
        expect(cbr.validateMove(pob, target, pieceKind.Bishop).isValid).toBe(true)
        expect(cbr.validateMove(pob, target, pieceKind.Knight).isValid).toBe(true)
        expect(cbr.validateMove(pob, target, pieceKind.Queen).isValid).toBe(true)

        // some additional negatives
        source = { colIdx: 1, rowIdx: 1 }
        target = { colIdx: 2, rowIdx: 3 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackKing(), { colIdx: 7, rowIdx: 1 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 4, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        expect(cbr.validateMove(pob, target).isValid).toBe(false)

        source = { colIdx: 1, rowIdx: 6 }
        target = { colIdx: 1, rowIdx: 3 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackKing(), { colIdx: 7, rowIdx: 1 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 4, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        expect(cbr.validateMove(pob, target).isValid).toBe(false)

        source = { colIdx: 1, rowIdx: 5 }
        target = { colIdx: 1, rowIdx: 0 }
        cbr.clearBoard()
        cbr.setPiece(p, source)
        cbr.setPiece(Piece.blackKing(), { colIdx: 7, rowIdx: 1 })
        cbr.setPiece(Piece.whiteKing(), { colIdx: 4, rowIdx: 7 })
        pob = cbr.peekFieldPieceOB(source)
        expect(cbr.validateMove(pob, target).isValid).toBe(false)
    })
})