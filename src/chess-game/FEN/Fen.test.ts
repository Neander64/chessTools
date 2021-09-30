import { color } from "../common/chess-color"
import { Fen, FenBoard } from "./Fen"

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


        expect(() => fb.setBoard('rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PP1/R1BQ1RK1/abc')).toThrowErrorMatchingInlineSnapshot(`"FenBoard.setByFEN(): unexpected number of rows in position. Expected 8, got:9"`)
        expect(() => fb.setBoard('rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PP1')).toThrowErrorMatchingInlineSnapshot(`"FenBoard.setByFEN(): unexpected number of rows in position. Expected 8, got:7"`)
        expect(() => fb.setBoard('rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PP1/R1BQ1RK1RRRRR')).toThrowErrorMatchingInlineSnapshot(`"loadFEN(): unexpected number of columns in position, got:13"`)
        expect(() => fb.setBoard('rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PP1/R1BD1RK1')).toThrowErrorMatchingInlineSnapshot(`"loadFEN(): invalid piece, got:D"`)
        expect(() => fb.setBoard('rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PP1/R1BQ2RK1')).toThrowErrorMatchingInlineSnapshot(`"loadFEN(): unexpected digit in position, got:1"`)
        expect(() => fb.setBoard('rn1qk2r/1bppbppp/p3pn2/9/Pp1PP3/3B1N2/1PPN1PP1/R1BQ1RK1')).toThrowErrorMatchingInlineSnapshot(`"loadFEN(): unexpected digit in position, got:9"`)
        expect(() => fb.setBoard('rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PP1/R2BQ3RK1')).toThrowErrorMatchingInlineSnapshot(`"loadFEN(): too many pieces/columns in row"`)
    })

    test('testing Fen', () => {
        let fen = new Fen(Fen.initialBoardFEN)
        expect(fen.fenBoard.getPiece('e1')).toBe('K')
        expect(fen.fenBoard.getPiece('d8')).toBe('q')
        expect(fen.activeColor).toBe(color.white)
        expect(fen.canCastleShortWhite).toBe(true)
        expect(fen.canCastleShortBlack).toBe(true)
        expect(fen.canCastleLongWhite).toBe(true)
        expect(fen.canCastleLongBlack).toBe(true)
        expect(fen.isEnPassantPossible()).toBe(false)
        expect(fen.plyCount).toBe(0)
        expect(fen.moveNumber).toBe(1)

        fen = new Fen()
        fen.load(Fen.initialBoardFEN)
        expect(fen.fenBoard.getPiece('e1')).toBe('K')
        expect(fen.fenBoard.getPiece('d8')).toBe('q')
        expect(fen.activeColor).toBe(color.white)
        expect(fen.canCastleShortWhite).toBe(true)
        expect(fen.canCastleShortBlack).toBe(true)
        expect(fen.canCastleLongWhite).toBe(true)
        expect(fen.canCastleLongBlack).toBe(true)
        expect(fen.isEnPassantPossible()).toBe(false)
        expect(fen.plyCount).toBe(0)
        expect(fen.moveNumber).toBe(1)

        fen.load('k7/8/6P1/8/6R1/8/8/K7 w K - 4 50')
        expect(fen.canCastleShortWhite).toBe(true)
        expect(fen.canCastleShortBlack).toBe(false)
        expect(fen.canCastleLongWhite).toBe(false)
        expect(fen.canCastleLongBlack).toBe(false)

        fen.load('n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 b - a3 1 25')
        expect(fen.activeColor).toBe(color.black)
        expect(fen.canCastleShortWhite).toBe(false)
        expect(fen.canCastleShortBlack).toBe(false)
        expect(fen.canCastleLongWhite).toBe(false)
        expect(fen.canCastleLongBlack).toBe(false)
        expect(fen.isEnPassantPossible()).toBe(true)
        expect(fen.enPassantField).toBe('a3')
        expect(fen.plyCount).toBe(1)
        expect(fen.moveNumber).toBe(25)

        fen.load('n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 w - a6 1 25')
        expect(fen.isEnPassantPossible()).toBe(true)
        expect(fen.enPassantField).toBe('a6')

        expect(() => fen.load('n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 g - a3 1 25')).toThrowErrorMatchingInlineSnapshot(`"fen.load(): illegal player to move. should be \\"w\\" or \\"b\\", got:g"`)
        expect(() => fen.load('n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 b - a3 1 25 abc')).toThrowErrorMatchingInlineSnapshot(`"fen.load(): unexpected number of FEN-token. Expected 6, got:7"`)
        expect(() => fen.load('n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 b qkKQq a3 1 25')).toThrowErrorMatchingInlineSnapshot(`"fen.load(): castle option invalid. length:5"`)
        expect(() => fen.load('n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 b a a3 1 25')).toThrowErrorMatchingInlineSnapshot(`"fen.load(): no castle option. Expected \\"-\\", got:a"`)
        expect(() => fen.load('n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 b - a9 1 25')).toThrowErrorMatchingInlineSnapshot(`"loadFEN(): en passant unexpected format. got:a9"`)
        expect(() => fen.load('n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 b - a4 1 25')).toThrowErrorMatchingInlineSnapshot(`"loadFEN(): en passant unexpected format. got:a4"`)
        expect(() => fen.load('n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 b - a3 1 2x5')).toThrowErrorMatchingInlineSnapshot(`"loadFEN(): moveNumber invalid, got:2x5"`)
        expect(() => fen.load('n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 b - a3 1d 25')).toThrowErrorMatchingInlineSnapshot(`"loadFEN(): number of half-moves NAN, got:1d"`)


    })
})