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

  test('testing moves', () => {
    var cb = new chessBoard.ChessBoard()
    cb.loadFEN(cb.initialBoardFEN)
    expect(cb.move('e4')).toBe(true)
    expect(cb.move('e5')).toBe(true)
    expect(cb.move('Nf3')).toBe(true)
    expect(cb.move('Nc6')).toBe(true)
    expect(cb.move('Bb5')).toBe(true)

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

    cb.loadFEN(cb.initialBoardFEN)
    expect(cb.move('e5')).toBe(false)
    expect(cb.move('e7')).toBe(false)
    expect(cb.move('e2f3')).toBe(false)
    expect(cb.move('e2f4')).toBe(false)
    expect(cb.move('e2')).toBe(false)
    expect(cb.move('e1')).toBe(false)
    expect(cb.move('a7')).toBe(false)
    expect(cb.move('e3')).toBe(true)

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
    cb.loadFEN("kR6/8/8/8/6R1/8/8/K7 w K - 4 50");
    expect(cb.move('Rg8')).toBe(false)
    expect(cb.move('R1g8')).toBe(false)
    expect(cb.move('Rgg8')).toBe(true)
    cb.loadFEN("kR6/8/8/8/6R1/8/8/K7 w K - 4 50");
    expect(cb.move('R1g8')).toBe(false)
    expect(cb.move('Rbg8')).toBe(true)
    cb.loadFEN("kR6/8/8/8/6R1/8/8/K7 w K - 4 50");
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
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('h4')), chessBoard.strToFieldIdx('g6'))).toBe(true);
    expect(cb.move('Nh4g6')).toBe(true)
    cb.loadFEN("k7/8/8/8/7N/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('h4')), chessBoard.strToFieldIdx('g2'))).toBe(true);
    expect(cb.move('Ng2')).toBe(true)
    cb.loadFEN("k7/8/8/8/7N/8/8/K7 w K - 4 50");
    expect(cb.move('Nf3')).toBe(true)
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('h4')), chessBoard.strToFieldIdx('f3'))).toBe(true);
    cb.loadFEN("k7/8/8/8/7n/8/8/K7 b K - 4 50");
    expect(cb.move('Nf3')).toBe(true)
    cb.loadFEN("k7/8/8/8/7N/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('h4')), chessBoard.strToFieldIdx('f5'))).toBe(true);
    expect(cb.move('Nf5')).toBe(true)
    // illegal move
    cb.loadFEN("k7/8/8/8/7N/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('h4')), chessBoard.strToFieldIdx('f4'))).toBe(false);
    expect(cb.move('Nh4f4')).toBe(false)
    cb.loadFEN("k7/8/6P1/8/7N/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('h4')), chessBoard.strToFieldIdx('g6'))).toBe(false);
    expect(cb.move('Ng6')).toBe(false)
    // capture
    cb.loadFEN("k7/8/6p1/8/7N/8/8/K7 w K - 4 50");
    //expect(cb.performMovePiece(cb.peekFieldPieceOB(chessBoard.strToFieldIdx('h4')), chessBoard.strToFieldIdx('g6'))).toBe(true);
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
    cb.loadFEN("7k/8/8/8/8/8/8/4K2R w - b3 4 50");
    expect(cb.move('O-O')).toBe(false)
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(false);
    cb.loadFEN("7k/8/8/8/8/8/8/R3K2R w K b3 4 50");
    expect(cb.move('O-O-O')).toBe(false)
    expect(cb.move('O-O')).toBe(true)
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(true);
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short)).toBe(true);
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.short, true)).toBe(false);
    //expect(cb.moveCastle(chessBoard.color.white, chessBoard.castleType.long, true)).toBe(false);
    cb.loadFEN("7k/8/8/8/8/8/8/4K1BR w K b3 4 50");
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
]
`);
  });



});
