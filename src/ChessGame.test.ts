import { ChessGame } from "./ChessGame"
import { GameResult } from "./common/GameResult"

describe('Testing ChessGame.exportPGN', () => {

  test('testing empty game', () => {
    let game = new ChessGame()
    let pgn = game.PGN
    expect(pgn).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "",
  "*",
]
`)
  })

  test('testing empty game (Header Data)', () => {
    let game = new ChessGame()
    game.gameHeaderData.date.month = 5
    let pgn = game.PGN
    expect(pgn).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.5.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "",
  "*",
]
`)
  })

  test('testing empty game (Header Data)', () => {
    let game = new ChessGame()
    game.gameHeaderData.date.day = 7
    let pgn = game.PGN
    expect(pgn).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.7\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "",
  "*",
]
`)
  })

  test('testing gpn generation (Kasparov Game)', () => {
    let game = new ChessGame()
    game.gameHeaderData.event = 'IBM Kasparov vs. Deep Blue Rematch'
    game.gameHeaderData.site = 'New York, NY USA'
    game.gameHeaderData.date.year = 1997
    game.gameHeaderData.date.month = 5
    game.gameHeaderData.date.day = 11
    game.gameHeaderData.round = '6'
    game.gameHeaderData.whitePlayer = 'Deep Blue'
    game.gameHeaderData.blackPlayer = 'Kasparov, Garry'
    game.gameHeaderData.result = GameResult.white_wins
    expect(game.chessBoard.move('e4')).toBe(true)
    expect(game.chessBoard.move('c6')).toBe(true)
    expect(game.chessBoard.move('d4')).toBe(true)
    expect(game.chessBoard.move('d5')).toBe(true)
    expect(game.chessBoard.move('Nc3')).toBe(true)
    expect(game.chessBoard.move('dxe4')).toBe(true)
    expect(game.chessBoard.move('Nxe4')).toBe(true)
    expect(game.chessBoard.move('Nd7')).toBe(true)
    expect(game.chessBoard.move('Ng5')).toBe(true)
    expect(game.chessBoard.move('Ngf6')).toBe(true)
    expect(game.chessBoard.move('Bd3')).toBe(true)
    expect(game.chessBoard.move('e6')).toBe(true)
    expect(game.chessBoard.move('N1f3')).toBe(true)
    expect(game.chessBoard.move('h6')).toBe(true)
    expect(game.chessBoard.move('Nxe6')).toBe(true)
    expect(game.chessBoard.move('Qe7')).toBe(true)
    expect(game.chessBoard.move('O-O')).toBe(true)
    expect(game.chessBoard.move('fxe6')).toBe(true)
    expect(game.chessBoard.move('Bg6+')).toBe(true)
    expect(game.chessBoard.move('Kd8')).toBe(true)
    let m = game.chessBoard.currentMove
    if (m) m.comment = 'Kasparov shakes his head'
    // comment 'Kasparov shakes his head'
    expect(game.chessBoard.move('Bf4')).toBe(true)
    expect(game.chessBoard.move('b5')).toBe(true)
    expect(game.chessBoard.move('a4')).toBe(true)
    expect(game.chessBoard.move('Bb7')).toBe(true)
    expect(game.chessBoard.move('Re1')).toBe(true)
    expect(game.chessBoard.move('Nd5')).toBe(true)
    expect(game.chessBoard.move('Bg3')).toBe(true)
    expect(game.chessBoard.move('Kc8')).toBe(true)
    expect(game.chessBoard.move('axb5')).toBe(true)
    expect(game.chessBoard.move('cxb5')).toBe(true)
    expect(game.chessBoard.move('Qd3')).toBe(true)
    expect(game.chessBoard.move('Bc6')).toBe(true)
    expect(game.chessBoard.move('Bf5')).toBe(true)
    expect(game.chessBoard.move('exf5')).toBe(true)
    expect(game.chessBoard.move('Rxe7')).toBe(true)
    expect(game.chessBoard.move('Bxe7')).toBe(true)
    expect(game.chessBoard.move('c4')).toBe(true)
    let pgn = game.PGN
    expect(pgn).toMatchInlineSnapshot(`
Array [
  "[Event \\"IBM Kasparov vs. Deep Blue Rematch\\"]",
  "[Site \\"New York, NY USA\\"]",
  "[Date \\"1997.5.11\\"]",
  "[Round \\"6\\"]",
  "[White \\"Deep Blue\\"]",
  "[Black \\"Kasparov, Garry\\"]",
  "[Result \\"1-0\\"]",
  "",
  "1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Nd7 5. Ng5 Ngf6 6. Bd3 e6 7. N1f3 h6",
  "8. Nxe6 Qe7 9. O-O fxe6 10. Bg6+ Kd8 { Kasparov shakes his head } 11. Bf4 b5",
  "12. a4 Bb7 13. Re1 Nd5 14. Bg3 Kc8 15. axb5 cxb5 16. Qd3 Bc6 17. Bf5 exf5",
  "18. Rxe7 Bxe7 19. c4 1-0",
]
`)
    expect(game.chessBoard.movesToStrings()).toMatchInlineSnapshot(`
Array [
  "e4",
  "c6",
  "d4",
  "d5",
  "Nc3",
  "dxe4",
  "Nxe4",
  "Nd7",
  "Ng5",
  "Ngf6",
  "Bd3",
  "e6",
  "N1f3",
  "h6",
  "Nxe6",
  "Qe7",
  "O-O",
  "fxe6",
  "Bg6+",
  "Kd8",
  "Bf4",
  "b5",
  "a4",
  "Bb7",
  "Re1",
  "Nd5",
  "Bg3",
  "Kc8",
  "axb5",
  "cxb5",
  "Qd3",
  "Bc6",
  "Bf5",
  "exf5",
  "Rxe7",
  "Bxe7",
  "c4",
]
`)
  })

})
