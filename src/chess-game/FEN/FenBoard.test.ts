import { FenBoard } from "./FenBoard"

describe('Testing class Fen & FenBoard', () => {
    test('testing FenBoard', () => {

        let fb = new FenBoard()
        let boardStr = 'rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PP1/R1BQ1RK1'
        fb.setBoard(boardStr)
        expect(fb.getBoard()).toBe(boardStr)
        expect(fb.getPiece('a1')).toBe('R')
        expect(fb.getPiece('h1')).toBe(FenBoard.EMPTY_FIELD)
        expect(fb.getPiece('a8')).toBe('r')
        expect(fb.getPiece('h8')).toBe('r')
        expect(fb.setPiece('a8', FenBoard.EMPTY_FIELD)).toBe(true)
        expect(fb.getPiece('a8')).toBe(FenBoard.EMPTY_FIELD)

        expect(fb.setPiece('a8', 'D')).toBe(false)
        expect(fb.setPiece('a8', 'Q')).toBe(true)
        expect(fb.setPiece('a0', 'Q')).toBe(false)
        expect(fb.setPiece('a9', 'Q')).toBe(false)
        expect(fb.setPiece('A8', 'Q')).toBe(false)
        expect(fb.setPiece('a8x', 'Q')).toBe(false)
        expect(fb.setPiece('a8', 'QQ')).toBe(false)

        fb.clearBoard()
        expect(fb.getPiece('a1')).toBe(FenBoard.EMPTY_FIELD)
        expect(fb.getPiece('b7')).toBe(FenBoard.EMPTY_FIELD)
        expect(fb.getPiece('b1')).toBe(FenBoard.EMPTY_FIELD)
        expect(fb.getPiece('g1')).toBe(FenBoard.EMPTY_FIELD)
        expect(fb.getPiece('h8')).toBe(FenBoard.EMPTY_FIELD)
        expect(fb.getPiece('h9')).toBe(undefined)


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