import { color } from "../common/chess-color"
import { Field } from "../common/Field"
import { Fen } from "./Fen"

describe('Testing class Fen & FenBoard', () => {

    test('testing Fen', () => {
        let fen = new Fen(Fen.initialBoardFEN)
        expect(fen.fenBoard.getPiece(Field.fromNotation('e1'))).toBe('K')
        expect(fen.fenBoard.getPiece(Field.fromNotation('d8'))).toBe('q')
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
        expect(fen.fenBoard.getPiece(Field.fromNotation('e1'))).toBe('K')
        expect(fen.fenBoard.getPiece(Field.fromNotation('d8'))).toBe('q')
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

        expect(() => fen.load('n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 g - a3 1 25')).toThrowErrorMatchingInlineSnapshot(`"illegal player to move. should be \\"w\\" or \\"b\\", got:g"`)
        expect(() => fen.load('n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 b - a3 1 25 abc')).toThrowErrorMatchingInlineSnapshot(`"unexpected number of FEN-token. Expected 6, got:7"`)
        expect(() => fen.load('n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 b qkKQq a3 1 25')).toThrowErrorMatchingInlineSnapshot(`"castle option invalid. length:5"`)
        expect(() => fen.load('n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 b a a3 1 25')).toThrowErrorMatchingInlineSnapshot(`"no castle option. Expected \\"-\\", got:a"`)
        expect(() => fen.load('n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 b - a9 1 25')).toThrowErrorMatchingInlineSnapshot(`"en passant unexpected format. got:a9"`)
        expect(() => fen.load('n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 b - a4 1 25')).toThrowErrorMatchingInlineSnapshot(`"en passant unexpected format. got:a4"`)
        expect(() => fen.load('n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 b - a3 1 2x5')).toThrowErrorMatchingInlineSnapshot(`"moveNumber invalid, got:2x5"`)
        expect(() => fen.load('n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 b - a3 1d 25')).toThrowErrorMatchingInlineSnapshot(`"number of half-moves NAN, got:1d"`)


    })
})