import * as chessBoard from './chess-board'


describe('Testing chess-board', () => {

  test('testing FEN creation', () => {
    var cb = new chessBoard.ChessBoard()
    cb.loadFEN(cb.initialBoardFEN)
    expect(cb.getFEN()).toBe(cb.initialBoardFEN)

    let t1 = "k7/8/6P1/8/6R1/8/8/K7 w K - 4 50"
    cb.loadFEN(t1)
    expect(cb.getFEN()).toBe(t1)

    let t2 = "k7/8/6P1/8/6R1/8/8/K7 b Kq d3 4 5"
    cb.loadFEN(t2)
    expect(cb.getFEN()).toBe(t2)

  });

  test('testing 3 & 5 Repetition Rule', () => {
    var cb = new chessBoard.ChessBoard()
    cb.loadFEN(cb.initialBoardFEN)
    expect(cb.move('Nf3')).toBe(true)
    expect(cb.move('Nf6')).toBe(true)
    expect(cb.move('Ng1')).toBe(true)
    expect(cb.move('Ng8')).toBe(true)

    expect(cb.move('Nf3')).toBe(true) // #2 Rep
    expect(cb.move('Nf6')).toBe(true)
    expect(cb.move('Ng1')).toBe(true)
    expect(cb.move('Ng8')).toBe(true)

    expect(cb.data.drawPossibleThreefoldRepetion).toBe(false)
    expect(cb.move('Nf3')).toBe(true) // #3 Rep
    expect(cb.data.drawPossibleThreefoldRepetion).toBe(true)
    expect(cb.move('Nf6')).toBe(true)
    expect(cb.move('Ng1')).toBe(true)
    expect(cb.move('Ng8')).toBe(true)

    expect(cb.move('Nf3')).toBe(true) // #4 Rep
    expect(cb.move('Nf6')).toBe(true)
    expect(cb.move('Ng1')).toBe(true)
    expect(cb.move('Ng8')).toBe(true)

    expect(cb.isGameOver()).toBe(false)
    expect(cb.move('Nf3')).toBe(true) // #5 Rep -- automatic draw
    expect(cb.isGameOver()).toBe(true)
    expect(cb.data.gameResult).toBe(chessBoard.GameResult.draw)
    expect(cb.move('Nf6')).toBe(false)
    expect(cb.moves()).toMatchInlineSnapshot(`
Array [
  "Nf3",
  "Nf6",
  "Ng1",
  "Ng8",
  "Nf3",
  "Nf6",
  "Ng1",
  "Ng8",
  "Nf3",
  "Nf6",
  "Ng1",
  "Ng8",
  "Nf3",
  "Nf6",
  "Ng1",
  "Ng8",
  "Nf3",
]
`)
  });


  test('testing game over', () => {
    var cb = new chessBoard.ChessBoard()
    cb.loadFEN(cb.initialBoardFEN)
    expect(cb.isGameOver()).toBe(false)

    cb.loadFEN("k7/8/8/8/8/8/8/K7 w - - 0 50")
    expect(cb.isGameOver()).toBe(true)

    cb.loadFEN("8/8/8/7R/pkp5/Pn6/1P6/K7 b - - 0 100") // black is mate, but can capture the white king first
    expect(cb.isGameOver()).toBe(true)

    cb.loadFEN("k7/p7/8/8/8/8/P7/K7 w - - 50 100")
    expect(cb.isGameOver()).toBe(false)
    cb.loadFEN("k7/p7/8/8/8/8/P7/K7 w - - 151 200")
    expect(cb.isCheck()).toBe(false)
    expect(cb.isMate()).toBe(false)
    expect(cb.isGameOver()).toBe(true)

    // see https://en.wikipedia.org/wiki/Checkmate_pattern
    // Anastasia mate
    cb.loadFEN("8/4N1pk/8/7R/8/8/8/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Anderssen's mate
    cb.loadFEN("6kR/6P1/5K2/8/8/8/8/8 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Arabian mate
    cb.loadFEN("7k/7R/5N2/8/8/8/8/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Back-rank mate
    cb.loadFEN("3R2k1/5ppp/8/8/8/8/8/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Balestra mate
    cb.loadFEN("6k1/8/4B2Q/8/8/8/8/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Bishop and Knight
    cb.loadFEN("7k/8/5BKN/8/8/8/8/8 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Blackburn
    cb.loadFEN("5rk1/7B/8/6N1/8/8/1B6/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)
    cb.loadFEN("7k/5B2/8/6N1/8/8/1B6/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Blind swine
    cb.loadFEN("5rk1/1R2R1pp/8/8/8/8/8/K7 w - - 0 100")
    expect(cb.isCheck()).toBe(false)
    expect(cb.isMate()).toBe(false)
    expect(cb.isGameOver()).toBe(false)
    expect(cb.move('Rxg7+')).toBe(true)
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(false)
    expect(cb.isGameOver()).toBe(false)
    expect(cb.move('Kh8')).toBe(true)
    expect(cb.isCheck()).toBe(false)
    expect(cb.isMate()).toBe(false)
    expect(cb.isGameOver()).toBe(false)
    expect(cb.move('Rxh7+')).toBe(true)
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(false)
    expect(cb.isGameOver()).toBe(false)
    expect(cb.move('Kg8')).toBe(true)
    expect(cb.isCheck()).toBe(false)
    expect(cb.isMate()).toBe(false)
    expect(cb.isGameOver()).toBe(false)
    expect(cb.move('Rbg7#')).toBe(true)
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)
    expect(cb.moves()).toMatchInlineSnapshot(`
Array [
  "Rxg7+",
  "Kh8",
  "Rxh7+",
  "Kg8",
  "Rbg7#",
]
`)

    // Boden's
    cb.loadFEN("2kr4/3p4/B7/8/5B2/8/8/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Corner
    cb.loadFEN("7k/5N1p/8/8/8/8/8/K5R1 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Damiano
    cb.loadFEN("5k2/5Q2/6B1/8/8/8/8/K5R1 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)
    cb.loadFEN("5rk1/6pQ/6P1/8/8/8/8/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Double bishop
    cb.loadFEN("7k/7p/8/3B4/8/2B5/8/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)
    cb.loadFEN("5bk1/7p/8/3B4/8/2B5/8/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Double knight
    cb.loadFEN("1kn5/ppp5/4NN2/8/8/8/8/K7 w - - 0 100")
    expect(cb.isCheck()).toBe(false)
    expect(cb.isMate()).toBe(false)
    expect(cb.isGameOver()).toBe(false)
    expect(cb.move('Nd7+')).toBe(true)
    expect(cb.isCheck()).toBe(true)
    expect(cb.move('Ka8')).toBe(true)
    expect(cb.move('Nc7#')).toBe(true)
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)
    expect(cb.moves()).toMatchInlineSnapshot(`
Array [
  "Nd7+",
  "Ka8",
  "Nxc7#",
]
`)

    // Dovetail
    cb.loadFEN("8/8/1Q6/8/6pk/5q2/8/6K1 w - - 0 100")
    expect(cb.isCheck()).toBe(false)
    expect(cb.isMate()).toBe(false)
    expect(cb.isGameOver()).toBe(false)
    expect(cb.move('Qh6')).toBe(true)
    expect(cb.move('Kg3')).toBe(true)
    expect(cb.move('Qh2#')).toBe(true)
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)
    expect(cb.moves()).toMatchInlineSnapshot(`
Array [
  "Qh6+",
  "Kg3",
  "Qh2#",
]
`)

    //Epaulette
    cb.loadFEN("3rkr2/7Q/4K3/8/8/8/8/8 w - - 0 100")
    expect(cb.isCheck()).toBe(false)
    expect(cb.isMate()).toBe(false)
    expect(cb.isGameOver()).toBe(false)
    expect(cb.move('Qe7')).toBe(true)
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Greco
    cb.loadFEN("7k/6p1/8/7Q/2B5/8/8/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Hook
    cb.loadFEN("4R3/4kp2/5N2/4P3/8/8/8/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Kill box
    cb.loadFEN("8/8/R7/k7/2Q5/8/8/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // King 2 Bisphos
    cb.loadFEN("7k/8/5NNK/8/8/8/8/8 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Ladder
    cb.loadFEN("R5k1/1R6/8/8/8/8/8/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)
    cb.loadFEN("Q5k1/1R6/8/8/8/8/8/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Legal
    cb.loadFEN("3q1b2/4kB2/3p4/3NN3/8/8/8/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)
    cb.loadFEN("3q1b2/4kB2/3p4/4N1B1/8/8/8/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Lolli
    cb.loadFEN("6k1/5pQ1/5Pp1/8/8/8/8/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Max Lange
    cb.loadFEN("6Q1/5Bpk/7p/8/8/8/8/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Mayet
    cb.loadFEN("6kR/5p2/8/8/8/8/1B6/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Opera
    cb.loadFEN("3Rk3/5p2/8/6B1/8/8/8/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Pawn, David an Goliath
    cb.loadFEN("8/8/8/7R/pkp5/Pn6/1P6/1K6 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Pillsbury
    cb.loadFEN("5rk1/5p1p/5p1B/8/8/8/8/K6R w - - 0 100")
    expect(cb.isCheck()).toBe(false)
    expect(cb.isMate()).toBe(false)
    expect(cb.isGameOver()).toBe(false)
    expect(cb.move('Rg1+')).toBe(true)
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(false)
    expect(cb.isGameOver()).toBe(false)
    expect(cb.move('Kh8')).toBe(true)
    expect(cb.isCheck()).toBe(false)
    expect(cb.isMate()).toBe(false)
    expect(cb.isGameOver()).toBe(false)
    expect(cb.move('Bg7')).toBe(true)
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(false)
    expect(cb.isGameOver()).toBe(false)
    expect(cb.move('Kg8')).toBe(true)
    expect(cb.isCheck()).toBe(false)
    expect(cb.isMate()).toBe(false)
    expect(cb.isGameOver()).toBe(false)
    expect(cb.move('Bxf6#')).toBe(true)
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)
    expect(cb.moves()).toMatchInlineSnapshot(`
Array [
  "Rg1+",
  "Kh8",
  "Bg7+",
  "Kg8",
  "Bxf6#",
]
`)

    // Queen mate
    cb.loadFEN("3k4/3Q4/3K4/8/8/8/8/8 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Réti
    cb.loadFEN("1nbB4/1pk5/2p5/8/8/8/8/K2R4 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Rook, Box
    cb.loadFEN("R2k4/8/3K4/8/8/8/8/8 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Smothered
    cb.loadFEN("6rk/5Npp/8/8/8/8/8/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Suffocation
    cb.loadFEN("5rk1/4Np1p/8/8/8/2B5/8/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Swallow
    cb.loadFEN("3r1r2/4k3/R3Q3/8/8/8/8/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Triangle
    cb.loadFEN("3R4/4kp2/3Q4/8/8/8/8/K7 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)

    // Vukovic
    cb.loadFEN("4k3/4R3/4NK2/8/8/8/8/8 b - - 0 100")
    expect(cb.isCheck()).toBe(true)
    expect(cb.isMate()).toBe(true)
    expect(cb.isGameOver()).toBe(true)
  });

  test('testing piece spectrum', () => {
    var cb = new chessBoard.ChessBoard()
    cb.loadFEN(cb.initialBoardFEN)
    expect(cb.board.currentPieceSpectrum()).toMatchInlineSnapshot(`
Object {
  "black": Map {
    Piece {
      "_FEN": "r",
      "_key": 9,
    } => 2,
    Piece {
      "_FEN": "n",
      "_key": 10,
    } => 2,
    Piece {
      "_FEN": "b",
      "_key": 11,
    } => 2,
    Piece {
      "_FEN": "q",
      "_key": 12,
    } => 1,
    Piece {
      "_FEN": "k",
      "_key": 13,
    } => 1,
    Piece {
      "_FEN": "p",
      "_key": 14,
    } => 8,
  },
  "white": Map {
    Piece {
      "_FEN": "P",
      "_key": 6,
    } => 8,
    Piece {
      "_FEN": "R",
      "_key": 1,
    } => 2,
    Piece {
      "_FEN": "N",
      "_key": 2,
    } => 2,
    Piece {
      "_FEN": "B",
      "_key": 3,
    } => 2,
    Piece {
      "_FEN": "Q",
      "_key": 4,
    } => 1,
    Piece {
      "_FEN": "K",
      "_key": 5,
    } => 1,
  },
}
`)
  });

  test('testing moves', () => {
    var cb = new chessBoard.ChessBoard()
    cb.loadFEN(cb.initialBoardFEN)
    expect(cb.move('e4')).toBe(true)
    expect(cb.move('e5')).toBe(true)
    expect(cb.move('Nf3')).toBe(true)
    expect(cb.move('Nc6')).toBe(true)
    let moves1 = cb.moves()
    expect(cb.move('Bb5')).toBe(true)
    expect(cb.moves()).toMatchInlineSnapshot(`
Array [
  "e4",
  "e5",
  "Nf3",
  "Nc6",
  "Bb5",
]
`)

    expect(cb.toASCII()).toMatchInlineSnapshot(`
Array [
  " -------------------------------",
  "| r |   | b | q | k | b | n | r |",
  " -------------------------------",
  "| p | p | p | p |   | p | p | p |",
  " -------------------------------",
  "|   |   | n |   |   |   |   |   |",
  " -------------------------------",
  "|   | B |   |   | p |   |   |   |",
  " -------------------------------",
  "|   |   |   |   | P |   |   |   |",
  " -------------------------------",
  "|   |   |   |   |   | N |   |   |",
  " -------------------------------",
  "| P | P | P | P |   | P | P | P |",
  " -------------------------------",
  "| R | N | B | Q | K |   |   | R |",
  " -------------------------------",
  "next move color: Black",
  "Possible Castle White O-O:Y, O-O-O:Y",
  "Possible Castle Black O-O:Y, O-O-O:Y",
  "moves without pawn or capture: 3",
  "move number: 3",
  "Game Result: *",
]
`)
    expect(cb.attackedMoves().notation).toMatchInlineSnapshot(`
Array [
  "b8 <= [ra8,nc6,]",
  "c8 <= [ra8,qd8,]",
  "a7 <= [ra8,nc6,]",
  "b7 <= [bc8,]",
  "d7 <= [bc8,qd8,ke8,]",
  "e8 <= [qd8,]",
  "c7 <= [qd8,]",
  "e7 <= [qd8,ke8,bf8,ng8,nc6,]",
  "f6 <= [qd8,ng8,pg7,]",
  "g5 <= [qd8,]",
  "h4 <= [qd8,]",
  "f8 <= [ke8,]",
  "d8 <= [ke8,nc6,]",
  "f7 <= [ke8,]",
  "d6 <= [bf8,pc7,]",
  "c5 <= [bf8,]",
  "b4 <= [bf8,nc6,]",
  "a3 <= [bf8,]",
  "g7 <= [bf8,]",
  "h6 <= [ng8,pg7,]",
  "g8 <= [rh8,]",
  "h7 <= [rh8,]",
  "b6 <= [pa7,pc7,]",
  "c6 <= [pb7,pd7,]",
  "a6 <= [pb7,]",
  "e6 <= [pd7,pf7,]",
  "g6 <= [pf7,ph7,]",
  "d4 <= [nc6,pe5,]",
  "a5 <= [nc6,]",
  "e5 <= [nc6,]",
  "f4 <= [pe5,]",
]
`)
    cb.undoMove()
    expect(moves1).toMatchInlineSnapshot(`
Array [
  "e4",
  "e5",
  "Nf3",
  "Nc6",
]
`)
    expect(cb.move('Bb5')).toBe(true)
    expect(cb.moves()).toMatchInlineSnapshot(`
Array [
  "e4",
  "e5",
  "Nf3",
  "Nc6",
  "Bb5",
]
`)

    expect(cb.toASCII()).toMatchInlineSnapshot(`
Array [
  " -------------------------------",
  "| r |   | b | q | k | b | n | r |",
  " -------------------------------",
  "| p | p | p | p |   | p | p | p |",
  " -------------------------------",
  "|   |   | n |   |   |   |   |   |",
  " -------------------------------",
  "|   | B |   |   | p |   |   |   |",
  " -------------------------------",
  "|   |   |   |   | P |   |   |   |",
  " -------------------------------",
  "|   |   |   |   |   | N |   |   |",
  " -------------------------------",
  "| P | P | P | P |   | P | P | P |",
  " -------------------------------",
  "| R | N | B | Q | K |   |   | R |",
  " -------------------------------",
  "next move color: Black",
  "Possible Castle White O-O:Y, O-O-O:Y",
  "Possible Castle Black O-O:Y, O-O-O:Y",
  "moves without pawn or capture: 3",
  "move number: 3",
  "Game Result: *",
]
`)
    expect(cb.attackedMoves().notation).toMatchInlineSnapshot(`
Array [
  "b8 <= [ra8,nc6,]",
  "c8 <= [ra8,qd8,]",
  "a7 <= [ra8,nc6,]",
  "b7 <= [bc8,]",
  "d7 <= [bc8,qd8,ke8,]",
  "e8 <= [qd8,]",
  "c7 <= [qd8,]",
  "e7 <= [qd8,ke8,bf8,ng8,nc6,]",
  "f6 <= [qd8,ng8,pg7,]",
  "g5 <= [qd8,]",
  "h4 <= [qd8,]",
  "f8 <= [ke8,]",
  "d8 <= [ke8,nc6,]",
  "f7 <= [ke8,]",
  "d6 <= [bf8,pc7,]",
  "c5 <= [bf8,]",
  "b4 <= [bf8,nc6,]",
  "a3 <= [bf8,]",
  "g7 <= [bf8,]",
  "h6 <= [ng8,pg7,]",
  "g8 <= [rh8,]",
  "h7 <= [rh8,]",
  "b6 <= [pa7,pc7,]",
  "c6 <= [pb7,pd7,]",
  "a6 <= [pb7,]",
  "e6 <= [pd7,pf7,]",
  "g6 <= [pf7,ph7,]",
  "d4 <= [nc6,pe5,]",
  "a5 <= [nc6,]",
  "e5 <= [nc6,]",
  "f4 <= [pe5,]",
]
`)

    cb.loadFEN(cb.initialBoardFEN)
    expect(cb.move('d2d4')).toBe(true)
    expect(cb.move('Pd6')).toBe(true)
    expect(cb.move('Ngf3')).toBe(true)
    expect(cb.move('Bg4')).toBe(true)
    expect(cb.move('e3!?')).toBe(true)
    expect(cb.move('g6')).toBe(true)
    expect(cb.move('Be2')).toBe(true)
    expect(cb.move('Bg7')).toBe(true)
    expect(cb.move('c4')).toBe(true)
    expect(cb.move('Nf6')).toBe(true)
    expect(cb.move('Nc3')).toBe(true)
    expect(cb.move('O-O')).toBe(true)
    expect(cb.move('O-O')).toBe(true)
    expect(cb.move('Bf5')).toBe(true)
    expect(cb.move('d5!?')).toBe(true)
    expect(cb.move('c5')).toBe(true)
    expect(cb.move('Nd2!')).toBe(true)
    expect(cb.moves()).toMatchInlineSnapshot(`
Array [
  "d4",
  "d6",
  "Nf3",
  "Bg4",
  "e3",
  "g6",
  "Be2",
  "Bg7",
  "c4",
  "Nf6",
  "Nc3",
  "O-O",
  "O-O",
  "Bf5",
  "d5",
  "c5",
  "Nd2",
]
`)

    cb.loadFEN(cb.initialBoardFEN)
    expect(cb.move('e4')).toBe(true)
    expect(cb.move('e5')).toBe(true)
    expect(cb.move('Pf4')).toBe(true)
    let p = cb.getFEN()
    expect(cb.move('ef4')).toBe(true)
    cb.loadFEN(p)
    expect(cb.move('exf4')).toBe(true)
    cb.loadFEN(p)
    expect(cb.move('e5f4')).toBe(true)
    expect(cb.moves()).toMatchInlineSnapshot(`
Array [
  "exf4",
]
`)
    expect(cb.toASCII()).toMatchInlineSnapshot(`
Array [
  " -------------------------------",
  "| r | n | b | q | k | b | n | r |",
  " -------------------------------",
  "| p | p | p | p |   | p | p | p |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "|   |   |   |   | P | p |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "| P | P | P | P |   |   | P | P |",
  " -------------------------------",
  "| R | N | B | Q | K | B | N | R |",
  " -------------------------------",
  "next move color: White",
  "Possible Castle White O-O:Y, O-O-O:Y",
  "Possible Castle Black O-O:Y, O-O-O:Y",
  "moves without pawn or capture: 0",
  "move number: 3",
  "Game Result: *",
]
`)
    expect(cb.legalMovesNotationLong()).toMatchInlineSnapshot(`
Array [
  "e4-e5",
  "a2-a3",
  "a2-a4",
  "b2-b3",
  "b2-b4",
  "c2-c3",
  "c2-c4",
  "d2-d3",
  "d2-d4",
  "g2-g3",
  "g2-g4",
  "h2-h3",
  "h2-h4",
  "Nb1-c3",
  "Nb1-a3",
  "Qd1-e2",
  "Qd1-f3",
  "Qd1-g4",
  "Qd1-h5",
  "Ke1-f2",
  "Ke1-e2",
  "Bf1-e2",
  "Bf1-d3",
  "Bf1-c4",
  "Bf1-b5",
  "Bf1-a6",
  "Ng1-h3",
  "Ng1-f3",
  "Ng1-e2",
]
`)

    cb.loadFEN(cb.initialBoardFEN)
    expect(cb.move('e5')).toBe(false)
    expect(cb.move('e7')).toBe(false)
    expect(cb.move('e2f3')).toBe(false)
    expect(cb.move('e2f4')).toBe(false)
    expect(cb.move('e2')).toBe(false)
    expect(cb.move('e1')).toBe(false)
    expect(cb.move('a7')).toBe(false)
    expect(cb.move('e3')).toBe(true)
    expect(cb.moves()).toMatchInlineSnapshot(`
Array [
  "e3",
]
`)

    cb.loadFEN(cb.initialBoardFEN)
    expect(cb.move('Ne2')).toBe(false)
    expect(cb.move('g1e2')).toBe(false)
    expect(cb.move('g1h2')).toBe(false)
    expect(cb.move('Nc2')).toBe(false)
    expect(cb.move('Bg2')).toBe(false)
    expect(cb.move('Bfh3')).toBe(false)
    expect(cb.move('Qg2')).toBe(false)
    expect(cb.move('Th2')).toBe(false)
    expect(cb.move('Thg1')).toBe(false)
    expect(cb.move('Thxg1')).toBe(false)
    expect(cb.move('Qhxg1')).toBe(false)
    expect(cb.move('O-O')).toBe(false)
    expect(cb.move('O-O-O')).toBe(false)

  });

  test('testing Rook moves', () => {
    let cb = new chessBoard.ChessBoard();
    // moves
    cb.loadFEN("k7/8/6P1/8/6R1/8/8/K7 w K - 4 50");
    let f1 = cb.getFEN()
    expect(cb.move('g4g1')).toBe(true)
    cb.loadFEN(f1)
    expect(cb.move('Rg1')).toBe(true)
    cb.loadFEN(f1)
    expect(cb.move('R4g1')).toBe(true)
    cb.loadFEN(f1)
    expect(cb.move('Rgg1')).toBe(true)
    cb.loadFEN(f1)
    expect(cb.move('Rg4g1')).toBe(true)
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('g1'))).toBe(true);


    cb.loadFEN("k7/8/8/8/6R1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('g8'))).toBe(true);
    expect(cb.move('Rg8')).toBe(true)
    cb.loadFEN("1R6/k7/8/8/6R1/8/8/K7 w K - 4 50");
    expect(cb.move('Rg8')).toBe(false)
    expect(cb.move('R1g8')).toBe(false)
    expect(cb.move('Rgg8')).toBe(true)
    cb.loadFEN("1R6/k7/8/8/6R1/8/8/K7 w K - 4 50");
    expect(cb.move('R1g8')).toBe(false)
    expect(cb.move('Rbg8')).toBe(true)
    cb.loadFEN("1R6/k7/8/8/6R1/8/8/K7 w K - 4 50");
    expect(cb.move('Rb2g8')).toBe(false)
    expect(cb.move('Rb8g8')).toBe(true)

    cb.loadFEN("k7/8/6P1/8/6R1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('a4'))).toBe(true);
    expect(cb.move('Ra4')).toBe(true)
    cb.loadFEN("k7/8/6P1/8/6R1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('h4'))).toBe(true);
    expect(cb.move('Rh4')).toBe(true)

    // illegal
    cb.loadFEN("k7/8/6P1/8/6R1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('a1'))).toBe(false);
    expect(cb.move('g4a1')).toBe(false)

    // move blocked
    cb.loadFEN("k7/8/6P1/8/6R1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('g8'))).toBe(false);
    expect(cb.move('g4g8')).toBe(false)
    cb.loadFEN("k7/8/6P1/8/6R1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('g7'))).toBe(false);
    expect(cb.move('g4g7')).toBe(false)
    cb.loadFEN("k7/8/6P1/8/6R1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('g6'))).toBe(false);
    expect(cb.move('g4g6')).toBe(false)

    // capture
    cb.loadFEN("k7/8/6p1/8/6R1/8/8/K7 w K - 4 50");
    let f2 = cb.getFEN()
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('g6'))).toBe(true);
    expect(cb.move('g4g6?')).toBe(true)
    cb.loadFEN(f2)
    expect(cb.move('Rg6!+')).toBe(true)
    cb.loadFEN(f2)
    expect(cb.move('Rxg6?!')).toBe(true)
    cb.loadFEN(f2)
    expect(cb.move('R4xg6!!#')).toBe(true)
    cb.loadFEN(f2)
    expect(cb.move('Rgxg6!?')).toBe(true)
    cb.loadFEN(f2)
    expect(cb.move('Qgxg6')).toBe(false)
    expect(cb.move('Bgxg6')).toBe(false)
    expect(cb.move('Pgxg6')).toBe(false)

  });

  test('testing Queen moves', () => {
    var cb = new chessBoard.ChessBoard();
    // Bishop like moves
    // moves
    cb.loadFEN("k7/8/6P1/8/6Q1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('h3'))).toBe(true);
    expect(cb.move('g4h3')).toBe(true)
    cb.loadFEN("k7/8/6P1/8/6Q1/8/8/K7 w K - 4 50");
    expect(cb.move('Qh3')).toBe(true)
    cb.loadFEN("k7/8/6P1/8/6Q1/8/8/K7 w K - 4 50");
    expect(cb.move('Qgh3')).toBe(true)
    cb.loadFEN("k7/8/6P1/8/6Q1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('h5'))).toBe(true);
    expect(cb.move('Qg4h5')).toBe(true)
    cb.loadFEN("k7/8/6P1/8/6Q1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('c8'))).toBe(true);
    expect(cb.move('Qc8')).toBe(true)
    cb.loadFEN("k7/8/6P1/8/6Q1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('d1'))).toBe(true);
    expect(cb.move('Qd1')).toBe(true)

    // illegal move
    cb.loadFEN("k7/8/6P1/8/6Q1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('f1'))).toBe(false);
    expect(cb.move('Qg4f1')).toBe(false)
    expect(cb.move('Qxg4f1')).toBe(false)
    expect(cb.move('Qgf1')).toBe(false)
    expect(cb.move('Q4f1')).toBe(false)

    // move blocked
    cb.loadFEN("k7/3p4/6P1/8/6Q1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('c8'))).toBe(false);
    expect(cb.move('Qc8')).toBe(false)
    cb.loadFEN("k7/3P4/6P1/8/6Q1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('c8'))).toBe(false);
    expect(cb.move('Qc8')).toBe(false)

    // capture
    cb.loadFEN("k7/3p4/6P1/8/6Q1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('d7'))).toBe(true);
    expect(cb.move('Qxd7')).toBe(true)
    cb.loadFEN("k7/3p4/6P1/8/6Q1/8/8/K7 w K - 4 50");
    expect(cb.move('Qxg4d7')).toBe(true)
    cb.loadFEN("k7/3p4/6P1/8/6Q1/8/8/K7 w K - 4 50");
    expect(cb.move('Qg4xd7')).toBe(true)

    // Rook like moves
    // moves
    cb.loadFEN("k7/8/6P1/8/6Q1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('g1'))).toBe(true);
    expect(cb.move('Qg4g1')).toBe(true)
    cb.loadFEN("k7/8/8/8/6Q1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('g8'))).toBe(true);
    expect(cb.move('g4g8')).toBe(true)
    cb.loadFEN("k7/8/6P1/8/6Q1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('a4'))).toBe(true);
    expect(cb.move('Qg4a4')).toBe(true)
    cb.loadFEN("k7/8/6P1/8/6Q1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('h4'))).toBe(true);
    expect(cb.move('Qh4')).toBe(true)

    // illegal
    cb.loadFEN("k7/8/6P1/8/6Q1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('a1'))).toBe(false);
    expect(cb.move('g4a1')).toBe(false)
    expect(cb.move('Qg4a1')).toBe(false)

    // move blocked
    cb.loadFEN("k7/8/6P1/8/6Q1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('g8'))).toBe(false);
    expect(cb.move('Qg8')).toBe(false)
    cb.loadFEN("k7/8/6P1/8/6Q1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('g7'))).toBe(false);
    expect(cb.move('Qg7')).toBe(false)
    cb.loadFEN("k7/8/6P1/8/6Q1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('g6'))).toBe(false);
    expect(cb.move('Qg6')).toBe(false)

    // capture
    cb.loadFEN("k7/8/6p1/8/6Q1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('g6'))).toBe(true);
    expect(cb.move('Qxg6')).toBe(true)


  });

  test('testing bishop moves', () => {
    var cb = new chessBoard.ChessBoard();
    // moves
    cb.loadFEN("k7/8/6P1/8/6B1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('h3'))).toBe(true);
    expect(cb.move('Qh3')).toBe(false)
    expect(cb.move('Bh3')).toBe(true)
    cb.loadFEN("k7/8/6P1/8/6B1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('h5'))).toBe(true);
    expect(cb.move('Bh5')).toBe(true)
    cb.loadFEN("k7/8/6P1/8/6B1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('c8'))).toBe(true);
    expect(cb.move('Bc8')).toBe(true)
    cb.loadFEN("k7/8/6P1/8/6B1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('d1'))).toBe(true);
    expect(cb.move('Bd1')).toBe(true)

    // illegal move
    cb.loadFEN("k7/8/6P1/8/6B1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('f1'))).toBe(false);
    expect(cb.move('Bg4f1')).toBe(false)

    // move blocked
    cb.loadFEN("k7/3p4/6P1/8/6B1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('c8'))).toBe(false);
    expect(cb.move('Bc8')).toBe(false)
    cb.loadFEN("k7/3P4/6P1/8/6B1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('c8'))).toBe(false);
    expect(cb.move('Bc8')).toBe(false)

    // capture
    cb.loadFEN("k7/3p4/6P1/8/6B1/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('g4')), chessBoard.strToFieldIdx('d7'))).toBe(true);
    expect(cb.move('Bxd7')).toBe(true)
  });


  test('testing knight moves', () => {
    var cb = new chessBoard.ChessBoard();
    // moves
    cb.loadFEN("k7/8/8/8/7N/8/8/K7 w K - 4 50");
    expect(cb.move('Nh4g6')).toBe(false) // dead draw position

    cb.loadFEN("k7/8/8/8/7N/8/P7/K7 w K - 4 50");
    expect(cb.move('Nh4g6')).toBe(true)
    cb.loadFEN("k7/8/8/8/7N/8/P7/K7 w K - 4 50");
    expect(cb.move('Ng2')).toBe(true)
    cb.loadFEN("k7/8/8/8/7N/8/P7/K7 w K - 4 50");
    expect(cb.move('Nf3')).toBe(true)
    cb.loadFEN("k7/8/8/8/7n/8/P7/K7 b K - 4 50");
    expect(cb.move('Nf3')).toBe(true)
    cb.loadFEN("k7/8/8/8/7N/8/P7/K7 w K - 4 50");
    expect(cb.move('Nf5')).toBe(true)
    // illegal move
    cb.loadFEN("k7/8/8/8/7N/8/P7/K7 w K - 4 50");
    expect(cb.move('Nh4f4')).toBe(false)
    cb.loadFEN("k7/8/6P1/8/7N/8/P7/K7 w K - 4 50");
    expect(cb.move('Ng6')).toBe(false)
    // capture
    cb.loadFEN("k7/8/6p1/8/7N/8/8/K7 w K - 4 50");
    expect(cb.move('Ng6')).toBe(true)
    cb.loadFEN("k7/8/6p1/8/7N/8/8/K7 w K - 4 50");
    expect(cb.move('Nxg6')).toBe(true)
    cb.loadFEN("k7/8/6p1/8/7N/8/8/K7 w K - 4 50");
    expect(cb.move('Nxh4g6')).toBe(true)

    cb.loadFEN("k7/8/6P1/8/7n/8/8/K7 b K - 4 50");
    expect(cb.move('Nxh4g6')).toBe(true)

  });


  test('testing pawn moves', () => {
    var cb = new chessBoard.ChessBoard();
    // moves
    cb.loadFEN("k7/8/8/8/8/8/7P/K7 w K - 4 50");
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h2'), chessBoard.strToFieldIdx('h4'))).toBe(true);
    expect(cb.move('h4')).toBe(true)
    cb.loadFEN("k7/8/8/8/8/8/7P/K7 w K - 4 50");
    expect(cb.move('h3')).toBe(true)
    expect(cb.move('h4')).toBe(false)
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h2'), chessBoard.strToFieldIdx('h3'))).toBe(true);
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h3'), chessBoard.strToFieldIdx('h4'))).toBe(false);
    cb.loadFEN("k7/8/8/8/8/8/7P/K7 w K - 4 50");
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h2'), chessBoard.strToFieldIdx('h5'))).toBe(false);
    expect(cb.move('h5')).toBe(false)
    cb.loadFEN("k7/8/8/8/8/8/7P/K7 w K - 4 50");
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h4'), chessBoard.strToFieldIdx('h5'))).toBe(false);
    expect(cb.move('h4h5')).toBe(false)

    cb.loadFEN("k7/7p/8/8/8/8/8/K7 b K - 4 50");
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h7'), chessBoard.strToFieldIdx('h5'))).toBe(true);
    expect(cb.move('h5')).toBe(true)
    cb.loadFEN("k7/7p/8/8/8/8/8/K7 b K - 4 50");
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h7'), chessBoard.strToFieldIdx('h6'))).toBe(true);
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h6'), chessBoard.strToFieldIdx('h5'))).toBe(false);
    expect(cb.move('h6')).toBe(true)
    expect(cb.move('h5')).toBe(false)
    cb.loadFEN("k7/7p/8/8/8/8/8/K7 b K - 4 50");
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h7'), chessBoard.strToFieldIdx('h4'))).toBe(false);
    expect(cb.move('h4')).toBe(false)
    cb.loadFEN("k7/7p/8/8/8/8/8/K7 b K - 4 50");
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h4'), chessBoard.strToFieldIdx('h3'))).toBe(false);
    expect(cb.move('h3')).toBe(false)

    // blocked
    cb.loadFEN("k7/8/8/8/8/7p/7P/K7 w K - 4 50");
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h2'), chessBoard.strToFieldIdx('h3'))).toBe(false);
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h2'), chessBoard.strToFieldIdx('h4'))).toBe(false);
    expect(cb.move('h3')).toBe(false)
    expect(cb.move('h4')).toBe(false)
    cb.loadFEN("k7/8/8/8/8/p7/P7/K7 w K - 4 50");
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('a2'), chessBoard.strToFieldIdx('a3'))).toBe(false);
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('a2'), chessBoard.strToFieldIdx('a4'))).toBe(false);
    expect(cb.move('a3')).toBe(false)
    expect(cb.move('a4')).toBe(false)
    cb.loadFEN("k7/8/8/8/7p/8/7P/K7 w K - 4 50");
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h2'), chessBoard.strToFieldIdx('h3'))).toBe(true);
    expect(cb.move('h3')).toBe(true)
    cb.loadFEN("k7/8/8/8/7p/8/7P/K7 w K - 4 50");
    expect(cb.move('h4')).toBe(false)
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h2'), chessBoard.strToFieldIdx('h4'))).toBe(false);
    cb.loadFEN("k7/8/8/7p/8/8/7P/K7 w K - 4 50");
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h2'), chessBoard.strToFieldIdx('h3'))).toBe(true);
    expect(cb.move('h3')).toBe(true)
    cb.loadFEN("k7/8/8/7p/8/8/7P/K7 w K - 4 50");
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h2'), chessBoard.strToFieldIdx('h4'))).toBe(true);
    expect(cb.move('h4')).toBe(true)

    // captures
    cb.loadFEN(cb.initialBoardFEN)
    expect(cb.move('e4')).toBe(true)
    expect(cb.move('d5')).toBe(true)
    let f1 = cb.getFEN()
    expect(cb.move('e4d5')).toBe(true)
    cb.loadFEN(f1)
    expect(cb.move('ed5')).toBe(true)
    cb.loadFEN(f1)
    expect(cb.move('exd5')).toBe(true)
    cb.loadFEN(f1)
    expect(cb.move('Pexd5')).toBe(true)
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('e2'), chessBoard.strToFieldIdx('e4'))).toBe(true);
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('d7'), chessBoard.strToFieldIdx('d5'))).toBe(true);
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('e4'), chessBoard.strToFieldIdx('d5'))).toBe(true);

    // e.p.
    cb.loadFEN("k7/8/8/8/6Pp/8/8/K7 b K g3 4 50")
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h4'), chessBoard.strToFieldIdx('g3'))).toBe(true);
    expect(cb.move('g3')).toBe(true)

    cb.loadFEN("k7/8/8/8/7p/8/6P1/K7 w K - 4 50")
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('g2'), chessBoard.strToFieldIdx('g4'))).toBe(true);
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h4'), chessBoard.strToFieldIdx('g3'))).toBe(true);
    expect(cb.move('g4')).toBe(true)
    expect(cb.move('g3')).toBe(true)

    // promotion
    cb.loadFEN("k7/7P/8/8/8/8/8/K7 w K - 4 50")
    expect(cb.move('h7h8=Q')).toBe(true)
    cb.loadFEN("k7/7P/8/8/8/8/8/K7 w K - 4 50")
    expect(cb.move('h8=R')).toBe(true)
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h7'), chessBoard.strToFieldIdx('h8'), chessBoard.charToPiece('Q').piece.kind)).toBe(true);
    cb.loadFEN("k7/7P/8/8/8/8/8/K7 w K - 4 50");
    expect(cb.move('h8')).toBe(false)
    expect(cb.move('h8=P')).toBe(false)
    expect(cb.move('h8=K')).toBe(false)
    expect(cb.move('h7h8')).toBe(false)
    expect(cb.move('h7h8=P')).toBe(false)
    expect(cb.move('h7h8=K')).toBe(false)
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h7'), chessBoard.strToFieldIdx('h8'))).toBe(false);
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h7'), chessBoard.strToFieldIdx('h8'), chessBoard.charToPiece('P').piece.kind)).toBe(false);
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h7'), chessBoard.strToFieldIdx('h8'), chessBoard.charToPiece('K').piece.kind)).toBe(false);

    // promotion with capture
    cb.loadFEN("k6b/7P/8/8/8/8/8/K7 w K - 4 50");
    expect(cb.move('h7g8=Q')).toBe(false)
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h7'), chessBoard.strToFieldIdx('g8'), chessBoard.charToPiece('Q').piece.kind)).toBe(false);
    cb.loadFEN("k5b1/7P/8/8/8/8/8/K7 w K - 4 50");
    expect(cb.move('h7g8=Q')).toBe(true)
    cb.loadFEN("k5b1/7P/8/8/8/8/8/K7 w K - 4 50");
    expect(cb.move('g8=Q')).toBe(true)
    cb.loadFEN("k5b1/5P2/8/8/8/8/8/K7 w K - 4 50");
    expect(cb.move('g8=Q')).toBe(true)
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h7'), chessBoard.strToFieldIdx('g8'), chessBoard.charToPiece('Q').piece.kind)).toBe(true);
    cb.loadFEN("k5b1/7P/8/8/8/8/8/K7 w K - 4 50");
    expect(cb.move('g8')).toBe(false)
    expect(cb.move('g8=P')).toBe(false)
    expect(cb.move('g8=K')).toBe(false)
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h7'), chessBoard.strToFieldIdx('g8'), chessBoard.charToPiece('P').piece.kind)).toBe(false);
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h7'), chessBoard.strToFieldIdx('g8'), chessBoard.charToPiece('K').piece.kind)).toBe(false);
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h7'), chessBoard.strToFieldIdx('g8'))).toBe(false);

    cb.loadFEN("k5B1/7P/8/8/8/8/8/K7 w K - 4 50");
    expect(cb.move('g8=Q')).toBe(false)
    //expect(cb.performMovePawn(chessBoard.strToFieldIdx('h7'), chessBoard.strToFieldIdx('g8'), chessBoard.charToPiece('Q').piece.kind)).toBe(false);

  });

  test('testing castle moves 1', () => {
    let cb = new chessBoard.ChessBoard();
    cb.loadFEN(cb.initialBoardFEN);
    expect(cb.move('O-O')).toBe(false)
    expect(cb.move('O-O-O')).toBe(false)
    expect(cb.move('e4')).toBe(true)
    expect(cb.move('O-O')).toBe(false)
    expect(cb.move('O-O-O')).toBe(false)
    //expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.short)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.short, true)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.long)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.long, true)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.long)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.long, true)).toBe(false);
  });
  test('testing castle moves', () => {
    let cb = new chessBoard.ChessBoard();
    cb.loadFEN("4k3/8/8/8/8/8/8/4K2R w - b3 4 50");
    expect(cb.move('O-O')).toBe(false)
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(false);
    cb.loadFEN("4k3/8/8/8/8/8/8/R3K2R w K b3 4 50");
    expect(cb.move('O-O-O')).toBe(false)
    expect(cb.move('O-O')).toBe(true)
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(true);
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short)).toBe(true);
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.long, true)).toBe(false);
    cb.loadFEN("4k3/8/8/8/8/8/8/4K1BR w K b3 4 50");
    expect(cb.move('O-O')).toBe(false)
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short)).toBe(false);

    // all castles possible
    cb.loadFEN("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 4 50");
    expect(cb.move('O-O')).toBe(true)
    cb.loadFEN("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 4 50");
    expect(cb.move('O-O-O')).toBe(true)
    cb.loadFEN("r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 4 50");
    expect(cb.move('O-O')).toBe(true)
    cb.loadFEN("r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 4 50");
    expect(cb.move('O-O-O')).toBe(true)
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(true);
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.long, true)).toBe(true);
    //expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.short, true)).toBe(true);
    //expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.long, true)).toBe(true);

    // Piece in between
    cb.loadFEN("r3kb1r/8/8/8/8/8/8/R3K1BR w KQkq - 4 50");
    expect(cb.move('O-O')).toBe(false)
    cb.loadFEN("r3kb1r/8/8/8/8/8/8/R3K1BR w KQkq - 4 50");
    expect(cb.move('O-O-O')).toBe(true)
    cb.loadFEN("r3kb1r/8/8/8/8/8/8/R3K1BR b KQkq - 4 50");
    expect(cb.move('O-O')).toBe(false)
    cb.loadFEN("r3kb1r/8/8/8/8/8/8/R3K1BR b KQkq - 4 50");
    expect(cb.move('O-O-O')).toBe(true)
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.long, true)).toBe(true);
    //expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.short, true)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.short, false)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.long, true)).toBe(true);
    cb.loadFEN("rn2k2r/8/8/8/8/8/8/R2QK2R w KQkq - 4 50");
    expect(cb.move('O-O')).toBe(true)
    cb.loadFEN("rn2k2r/8/8/8/8/8/8/R2QK2R w KQkq - 4 50");
    expect(cb.move('O-O-O')).toBe(false)
    cb.loadFEN("rn2k2r/8/8/8/8/8/8/R2QK2R b KQkq - 4 50");
    expect(cb.move('O-O')).toBe(true)
    cb.loadFEN("rn2k2r/8/8/8/8/8/8/R2QK2R b KQkq - 4 50");
    expect(cb.move('O-O-O')).toBe(false)
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(true);
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.long, true)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.long)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.short, true)).toBe(true);
    //expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.long, true)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.long, false)).toBe(false);

    // check in between check
    cb.loadFEN("r3k2r/8/3Q4/8/8/3q4/8/R3K2R w K b3 4 50");
    expect(cb.move('O-O')).toBe(false)
    expect(cb.move('O-O-O')).toBe(false)
    cb.loadFEN("r3k2r/8/3Q4/8/8/3q4/8/R3K2R b K b3 4 50");
    expect(cb.move('O-O')).toBe(false)
    expect(cb.move('O-O-O')).toBe(false)
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.long, true)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.short, true)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.long, true)).toBe(false);

    // king is checked
    cb.loadFEN("r3k2r/8/4Q3/8/8/4q3/8/R3K2R w K b3 4 50");
    expect(cb.move('O-O')).toBe(false)
    expect(cb.move('O-O-O')).toBe(false)
    cb.loadFEN("r3k2r/8/4Q3/8/8/4q3/8/R3K2R b K b3 4 50");
    expect(cb.move('O-O')).toBe(false)
    expect(cb.move('O-O-O')).toBe(false)
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.long, true)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.short, true)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.black, chessBoard.castleType.long, true)).toBe(false);

  });

  /*
  test('testing AttackedFields', () => {
    let cb = new chessBoard.ChessBoard();

    cb.loadFEN("7k/8/8/2pb4/8/8/8/7K b - - 4 50");
    expect(cb.isCheck(chessBoard.color.white)).toBe(true);
    expect(cb.isCheck(chessBoard.color.black)).toBe(false);
    let a1 = cb.getAttackedFields(chessBoard.color.black);
    a1.clear();
    expect(a1).toMatchInlineSnapshot(`
AttackedFields {
  "_fields": Array [],
}
`);
    let a2 = cb.getAttackedFields(chessBoard.color.black).attackedFields();
    expect(a2).toMatchInlineSnapshot(`
Array [
  Object {
    "colIdx": 6,
    "rowIdx": 0,
  },
  Object {
    "colIdx": 6,
    "rowIdx": 1,
  },
  Object {
    "colIdx": 7,
    "rowIdx": 1,
  },
  Object {
    "colIdx": 3,
    "rowIdx": 4,
  },
  Object {
    "colIdx": 1,
    "rowIdx": 4,
  },
  Object {
    "colIdx": 4,
    "rowIdx": 4,
  },
  Object {
    "colIdx": 5,
    "rowIdx": 5,
  },
  Object {
    "colIdx": 6,
    "rowIdx": 6,
  },
  Object {
    "colIdx": 7,
    "rowIdx": 7,
  },
  Object {
    "colIdx": 2,
    "rowIdx": 2,
  },
  Object {
    "colIdx": 1,
    "rowIdx": 1,
  },
  Object {
    "colIdx": 0,
    "rowIdx": 0,
  },
  Object {
    "colIdx": 4,
    "rowIdx": 2,
  },
  Object {
    "colIdx": 5,
    "rowIdx": 1,
  },
  Object {
    "colIdx": 2,
    "rowIdx": 4,
  },
  Object {
    "colIdx": 1,
    "rowIdx": 5,
  },
  Object {
    "colIdx": 0,
    "rowIdx": 6,
  },
]
`);

    cb.loadFEN(cb.initialBoardFEN);
    let a = cb.getAttackedFields(chessBoard.color.black);
    expect(a).toMatchInlineSnapshot(`
AttackedFields {
  "_fields": Array [
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 0,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 0,
          },
        },
      ],
      "field": Object {
        "colIdx": 1,
        "rowIdx": 0,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 0,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 0,
          },
        },
      ],
      "field": Object {
        "colIdx": 0,
        "rowIdx": 1,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 1,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 1,
          },
        },
        Object {
          "field": Object {
            "colIdx": 2,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 2,
          },
        },
        Object {
          "field": Object {
            "colIdx": 3,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 3,
          },
        },
        Object {
          "field": Object {
            "colIdx": 4,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 4,
          },
        },
      ],
      "field": Object {
        "colIdx": 3,
        "rowIdx": 1,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 1,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 1,
          },
        },
        Object {
          "field": Object {
            "colIdx": 1,
            "rowIdx": 1,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 5,
          },
        },
      ],
      "field": Object {
        "colIdx": 0,
        "rowIdx": 2,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 1,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 1,
          },
        },
        Object {
          "field": Object {
            "colIdx": 1,
            "rowIdx": 1,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 5,
          },
        },
        Object {
          "field": Object {
            "colIdx": 3,
            "rowIdx": 1,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 5,
          },
        },
      ],
      "field": Object {
        "colIdx": 2,
        "rowIdx": 2,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 2,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 2,
          },
        },
      ],
      "field": Object {
        "colIdx": 1,
        "rowIdx": 1,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 3,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 3,
          },
        },
      ],
      "field": Object {
        "colIdx": 4,
        "rowIdx": 0,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 3,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 3,
          },
        },
      ],
      "field": Object {
        "colIdx": 2,
        "rowIdx": 0,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 3,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 3,
          },
        },
        Object {
          "field": Object {
            "colIdx": 4,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 4,
          },
        },
        Object {
          "field": Object {
            "colIdx": 5,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 2,
          },
        },
        Object {
          "field": Object {
            "colIdx": 6,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 1,
          },
        },
      ],
      "field": Object {
        "colIdx": 4,
        "rowIdx": 1,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 3,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 3,
          },
        },
      ],
      "field": Object {
        "colIdx": 2,
        "rowIdx": 1,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 4,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 4,
          },
        },
      ],
      "field": Object {
        "colIdx": 3,
        "rowIdx": 0,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 4,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 4,
          },
        },
      ],
      "field": Object {
        "colIdx": 5,
        "rowIdx": 0,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 4,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 4,
          },
        },
      ],
      "field": Object {
        "colIdx": 5,
        "rowIdx": 1,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 5,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 2,
          },
        },
      ],
      "field": Object {
        "colIdx": 6,
        "rowIdx": 1,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 6,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 1,
          },
        },
        Object {
          "field": Object {
            "colIdx": 4,
            "rowIdx": 1,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 5,
          },
        },
        Object {
          "field": Object {
            "colIdx": 6,
            "rowIdx": 1,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 5,
          },
        },
      ],
      "field": Object {
        "colIdx": 5,
        "rowIdx": 2,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 6,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 1,
          },
        },
        Object {
          "field": Object {
            "colIdx": 6,
            "rowIdx": 1,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 5,
          },
        },
      ],
      "field": Object {
        "colIdx": 7,
        "rowIdx": 2,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 7,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 0,
          },
        },
      ],
      "field": Object {
        "colIdx": 6,
        "rowIdx": 0,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 7,
            "rowIdx": 0,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 0,
          },
        },
      ],
      "field": Object {
        "colIdx": 7,
        "rowIdx": 1,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 0,
            "rowIdx": 1,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 5,
          },
        },
        Object {
          "field": Object {
            "colIdx": 2,
            "rowIdx": 1,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 5,
          },
        },
      ],
      "field": Object {
        "colIdx": 1,
        "rowIdx": 2,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 2,
            "rowIdx": 1,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 5,
          },
        },
        Object {
          "field": Object {
            "colIdx": 4,
            "rowIdx": 1,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 5,
          },
        },
      ],
      "field": Object {
        "colIdx": 3,
        "rowIdx": 2,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 3,
            "rowIdx": 1,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 5,
          },
        },
        Object {
          "field": Object {
            "colIdx": 5,
            "rowIdx": 1,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 5,
          },
        },
      ],
      "field": Object {
        "colIdx": 4,
        "rowIdx": 2,
      },
    },
    Object {
      "attackingPieces": Array [
        Object {
          "field": Object {
            "colIdx": 5,
            "rowIdx": 1,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 5,
          },
        },
        Object {
          "field": Object {
            "colIdx": 7,
            "rowIdx": 1,
          },
          "piece": Piece {
            "_color": "Black",
            "_kind": 5,
          },
        },
      ],
      "field": Object {
        "colIdx": 6,
        "rowIdx": 2,
      },
    },
  ],
}
`);
  });
*/
  test('testing FEN', () => {
    let cb = new chessBoard.ChessBoard();
    cb.loadFEN(cb.initialBoardFEN);
    let b1 = cb.toASCII();
    expect(b1).toMatchInlineSnapshot(`
Array [
  " -------------------------------",
  "| r | n | b | q | k | b | n | r |",
  " -------------------------------",
  "| p | p | p | p | p | p | p | p |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "| P | P | P | P | P | P | P | P |",
  " -------------------------------",
  "| R | N | B | Q | K | B | N | R |",
  " -------------------------------",
  "next move color: White",
  "Possible Castle White O-O:Y, O-O-O:Y",
  "Possible Castle Black O-O:Y, O-O-O:Y",
  "moves without pawn or capture: 0",
  "move number: 1",
  "Game Result: *",
]
`);

    cb.loadFEN("r1bqkb1r/1p1n1ppp/p1n1p3/2ppP3/3P4/2P2N2/PP2NPPP/R1BQKB1R w KQkq - 1 8");
    let b3 = cb.toASCII();
    expect(b3).toMatchInlineSnapshot(`
Array [
  " -------------------------------",
  "| r |   | b | q | k | b |   | r |",
  " -------------------------------",
  "|   | p |   | n |   | p | p | p |",
  " -------------------------------",
  "| p |   | n |   | p |   |   |   |",
  " -------------------------------",
  "|   |   | p | p | P |   |   |   |",
  " -------------------------------",
  "|   |   |   | P |   |   |   |   |",
  " -------------------------------",
  "|   |   | P |   |   | N |   |   |",
  " -------------------------------",
  "| P | P |   |   | N | P | P | P |",
  " -------------------------------",
  "| R |   | B | Q | K | B |   | R |",
  " -------------------------------",
  "next move color: White",
  "Possible Castle White O-O:Y, O-O-O:Y",
  "Possible Castle Black O-O:Y, O-O-O:Y",
  "moves without pawn or capture: 1",
  "move number: 8",
  "Game Result: *",
]
`);


    cb.loadFEN("rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PPP/R1BQ1RK1 b kq - 4 8");
    let b4 = cb.toASCII();
    expect(b4).toMatchInlineSnapshot(`
Array [
  " -------------------------------",
  "| r | n |   | q | k |   |   | r |",
  " -------------------------------",
  "|   | b | p | p | b | p | p | p |",
  " -------------------------------",
  "| p |   |   |   | p | n |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "| P | p |   | P | P |   |   |   |",
  " -------------------------------",
  "|   |   |   | B |   | N |   |   |",
  " -------------------------------",
  "|   | P | P | N |   | P | P | P |",
  " -------------------------------",
  "| R |   | B | Q |   | R | K |   |",
  " -------------------------------",
  "next move color: Black",
  "Possible Castle White O-O:N, O-O-O:N",
  "Possible Castle Black O-O:Y, O-O-O:Y",
  "moves without pawn or capture: 4",
  "move number: 8",
  "Game Result: *",
]
`);

    cb.loadFEN("rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PPP/R1BQ1RK1 b kq e3 4 8");
    let b5 = cb.toASCII();
    expect(b5).toMatchInlineSnapshot(`
Array [
  " -------------------------------",
  "| r | n |   | q | k |   |   | r |",
  " -------------------------------",
  "|   | b | p | p | b | p | p | p |",
  " -------------------------------",
  "| p |   |   |   | p | n |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "| P | p |   | P | P |   |   |   |",
  " -------------------------------",
  "|   |   |   | B |   | N |   |   |",
  " -------------------------------",
  "|   | P | P | N |   | P | P | P |",
  " -------------------------------",
  "| R |   | B | Q |   | R | K |   |",
  " -------------------------------",
  "next move color: Black",
  "Possible Castle White O-O:N, O-O-O:N",
  "Possible Castle Black O-O:Y, O-O-O:Y",
  "en passant option at e3",
  "moves without pawn or capture: 4",
  "move number: 8",
  "Game Result: *",
]
`);

  });
  // testing for illegal input

  test('testing illegal FEN', () => {
    let cb = new chessBoard.ChessBoard();
    expect(() => cb.loadFEN("")).toThrow('loadFEN(): unexpected number of FEN-token');
    expect(() => cb.loadFEN("rn1qk2r/1bpp/bppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PPP/R1BQ1RK1 w kq - 4 8")).toThrow('loadFEN(): unexpected number of rows in position');
    expect(() => cb.loadFEN("rn1qk2r/1bpppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PPP/R1BQ1RK1 w kq - 4 8")).toThrow('loadFEN(): unexpected number of columns in position');
    expect(() => cb.loadFEN("rn1qk2r/1bppbppp/p3pn2/9/Pp1PP3/3B1N2/1PPN1PPP/R1BQ1RK1 w kq - 4 8")).toThrow('loadFEN(): unexpected digit in position');
    expect(() => cb.loadFEN("rn1qk2r/1bppbppp/p3pn2/0/Pp1PP3/3B1N2/1PPN1PPP/R1BQ1RK1 w kq - 4 8")).toThrow('loadFEN(): unexpected digit in position');
    expect(() => cb.loadFEN("rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PPP/R1BQ1RK1 g kq - 4 8")).toThrow('loadFEN(): illegal player to move');
    expect(() => cb.loadFEN("rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PPP/R1BQ1RK1 w kq ee5 4 8")).toThrow('loadFEN(): en passant unexpected format');
    expect(() => cb.loadFEN("rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPK1PPP/R1BQ1RK1 b kq - 4 8")).toThrow('loadFEN(): unexpected number of white kings');
    expect(() => cb.loadFEN("rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1k2/1PPN1PPP/R1BQ1RK1 b kq - 4 8")).toThrow('loadFEN(): unexpected number of black kings');
    expect(() => cb.loadFEN("rnbqkbnp/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")).toThrow('loadFEN(): too many black pawns');
    expect(() => cb.loadFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RPBQKBNR w KQkq - 0 1")).toThrow('loadFEN(): too many white pawns');

    let b4 = cb.toASCII(); // empty board after error
    expect(b4).toMatchInlineSnapshot(`
Array [
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "|   |   |   |   |   |   |   |   |",
  " -------------------------------",
  "next move color: White",
  "Possible Castle White O-O:N, O-O-O:N",
  "Possible Castle Black O-O:N, O-O-O:N",
  "moves without pawn or capture: 0",
  "move number: 1",
  "Game Result: *",
]
`);
  })

})
