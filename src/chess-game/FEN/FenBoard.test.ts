import { Field } from "../common/Field"
import { FenBoard } from "./FenBoard"

describe('Testing class Fen & FenBoard', () => {
    test('testing FenBoard', () => {

        let fb = new FenBoard()
        let boardStr = 'rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PP1/R1BQ1RK1'
        fb.setBoard(boardStr)
        expect(fb.getBoard()).toBe(boardStr)
        expect(fb.getPiece(Field.fromNotation('a1'))).toBe('R')
        expect(fb.getPiece(Field.fromNotation('h1'))).toBe(FenBoard.EMPTY_FIELD)
        expect(fb.getPiece(Field.fromNotation('a8'))).toBe('r')
        expect(fb.getPiece(Field.fromNotation('h8'))).toBe('r')
        expect(fb.setPiece(Field.fromNotation('a8'), FenBoard.EMPTY_FIELD)).toBe(true)
        expect(fb.getPiece(Field.fromNotation('a8'))).toBe(FenBoard.EMPTY_FIELD)

        expect(fb.setPiece(Field.fromNotation('a8'), 'D')).toBe(false)
        expect(fb.setPiece(Field.fromNotation('a8'), 'Q')).toBe(true)
        expect(() => fb.setPiece(Field.fromNotation('a0'), 'Q')).toThrowErrorMatchingInlineSnapshot(`"Field values not on Board, got fileIdx:0, rankIdx:8"`)
        expect(() => fb.setPiece(Field.fromNotation('a9'), 'Q')).toThrowErrorMatchingInlineSnapshot(`"Field values not on Board, got fileIdx:0, rankIdx:-1"`)
        expect(() => fb.setPiece(Field.fromNotation('A8'), 'Q')).toThrowErrorMatchingInlineSnapshot(`"Field values not on Board, got fileIdx:-32, rankIdx:0"`)
        //expect(() => fb.setPiece(Field.fromNotation('a8x'), 'Q')).toThrowErrorMatchingInlineSnapshot()
        //expect(() => fb.setPiece(Field.fromNotation('a8'), 'QQ')).toThrowErrorMatchingInlineSnapshot()

        fb.clearBoard()
        expect(fb.getPiece(Field.fromNotation('a1'))).toBe(FenBoard.EMPTY_FIELD)
        expect(fb.getPiece(Field.fromNotation('b7'))).toBe(FenBoard.EMPTY_FIELD)
        expect(fb.getPiece(Field.fromNotation('b1'))).toBe(FenBoard.EMPTY_FIELD)
        expect(fb.getPiece(Field.fromNotation('g1'))).toBe(FenBoard.EMPTY_FIELD)
        expect(fb.getPiece(Field.fromNotation('h8'))).toBe(FenBoard.EMPTY_FIELD)
        expect(() => fb.getPiece(Field.fromNotation('h9'))).toThrowErrorMatchingInlineSnapshot(`"Field values not on Board, got fileIdx:7, rankIdx:-1"`)


        expect(() => fb.setBoard('rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PP1/R1BQ1RK1/abc')).toThrowErrorMatchingInlineSnapshot(`"unexpected number of rows in position. Expected 8, got:9"`)
        expect(() => fb.setBoard('rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PP1')).toThrowErrorMatchingInlineSnapshot(`"unexpected number of rows in position. Expected 8, got:7"`)
        expect(() => fb.setBoard('rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PP1/R1BQ1RK1RRRRR')).toThrowErrorMatchingInlineSnapshot(`"unexpected number of columns in position, got:13, rowR1BQ1RK1RRRRR"`)
        expect(() => fb.setBoard('rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PP1/R2BQ1')).toThrowErrorMatchingInlineSnapshot(`"not enough pieces/columns in elements :6, row:R2BQ1"`)
        expect(() => fb.setBoard('rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PP1/R1BD1RK1')).toThrowErrorMatchingInlineSnapshot(`"invalid piece, got:D"`)
        expect(() => fb.setBoard('rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PP1/R1BQ2RK1')).toThrowErrorMatchingInlineSnapshot(`"too many pieces/columns in row:R1BQ2RK1"`)
        expect(() => fb.setBoard('rn1qk2r/1bppbppp/p3pn2/9/Pp1PP3/3B1N2/1PPN1PP1/R1BQ1RK1')).toThrowErrorMatchingInlineSnapshot(`"unexpected digit in position, got:9"`)
        expect(() => fb.setBoard('rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PP1/R2BQ3RK1')).toThrowErrorMatchingInlineSnapshot(`"too many pieces/columns in row:R2BQ3RK1"`)
        expect(() => fb.setBoard('rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPK1PPP/R1BQ1RK1')).toThrowErrorMatchingInlineSnapshot(`"nexpected number of white kings, got:2"`)
        expect(() => fb.setBoard('rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1k2/1PPN1PPP/R1BQ1RK1')).toThrowErrorMatchingInlineSnapshot(`"unexpected number of black kings, got:2"`)
    })
})