import { Pgn } from "./ChessGame-PGN"

describe('Testing PGN', () => {

    test('testing checkMove', () => {
        expect(Pgn.validateMoveSyntax('')).toBe(false)
        expect(Pgn.validateMoveSyntax('1.Nf3')).toBe(true)
        expect(Pgn.validateMoveSyntax('1...Nf7')).toBe(true)
        expect(Pgn.validateMoveSyntax('exf8=Q+')).toBe(true)
        expect(Pgn.validateMoveSyntax('exf9=Q')).toBe(false)
        expect(Pgn.validateMoveSyntax('exf8=K')).toBe(false)
        expect(Pgn.validateMoveSyntax('B1d4')).toBe(true)
        expect(Pgn.validateMoveSyntax('Nfg4+')).toBe(true)
        expect(Pgn.validateMoveSyntax('Ke1')).toBe(true)
        expect(Pgn.validateMoveSyntax('O-O')).toBe(true)
        expect(Pgn.validateMoveSyntax('33.O-O-O')).toBe(true)
        expect(Pgn.validateMoveSyntax('Rae1')).toBe(true)
        expect(Pgn.validateMoveSyntax('Ke1')).toBe(true)
        expect(Pgn.validateMoveSyntax('Qh8#')).toBe(true)
    })

    test('load PGN comments, annotations', () => {

        let data = [
            '[Event "FRG-ch International"] [Site "Dortmund"]',
            '%[Site "Dortmund"]',
            '[Date "1973.??.??"]',
            '[Round "1"]',
            '[White "Gerusel, Mathias"]',
            '[Black "Andersson, Ulf"]',
            '[Result "0-1"]',
            '[WhiteElo "2415"]',
            '[BlackElo "2535"]',
            '[ECO "E39"]',
            '',
            '1.d4 Nf6 2.c4 RR { comment 1; } e6 = 3.Nc3 == Bb4 +/= 4.Qc2 =/+ c5 ∓ 5.dxc5 ~~ N O-O <=> 6.Bf4 <= Na6 => 7.a3 Bxc3+ 8.Qxc3 Ne4 ; abc 8.Qxc3 Ne4',
            '9.Qc2 Qa5+ 10.Bd2 Nxd2 11.Qxd2 Qxd2+ 12.Kxd2 Nxc5 13.Rd1 a5 14.Kc2 Rd8 15.b3 d5',
            '16.e3 b6 17.f3 Ba6 18.Nh3 Rac8 19.Kb2 dxc4 20.Bxc4 Bxc4 21.bxc4 Nd3+ 22.Kb3 h6',
            '23.Nf4 Ne5 24.Rxd8+ Rxd8 25.Rc1 g5 26.Nh5 Kh7 27.Nf6+ Kg7 28.Ne4 f5 29.Nc3 Rd3',
            '30.Rd1 a4+ 31.Kb4 Nc6+ 32.Kb5 Rxc3 33.Kxc6 Rxc4+ 34.Kxb6 Rc3 35.Ra1 Rxe3',
            '36.Ra2 Re5 37.Rc2 Kf6 38.Rb2 h5 39.h3 h4 40.Rd2 Re3 41.Ra2 e5 42.Kb5 e4 43.Kxa4  0-1',
            '',
            '[Event "FRG-ch International"]',
            '[Site "Dortmund"]',
            '[Date "1973.??.??"]',
            '[Round "1"]',
            '[White "Marovic, Drazen"]',
            '[Black "Keres, Paul"]',
            '[Result "1/2-1/2"]',
            '[WhiteElo "2465"]',
            '[BlackElo "2600"]',
            '[ECO "D34"]',
            '',
            '1.Nf3 d5 2.c4 e6 3.d4 c5 4.cxd5 exd5 5.Nc3 Nc6 6.g3 Nf6 7.Bg2 Be7 8.O-O O-O',
            '9.dxc5 Bxc5 10.Na4 Be7 11.Be3 Re8 12.Rc1 Bg4 13.h3 Bf5 14.Nd4 Nxd4 15.Bxd4 Be4',
            '16.Nc3 Bxg2 17.Kxg2 Ne4 18.e3 Bf8 19.Qd3 a6 20.Rcd1 Qd6 21.Ne2 Rad8 22.Nf4 Rd7',
            '23.f3 Ng5 24.Rc1 Ne6 25.Nxe6 Qxe6 26.Rc3 g6 27.Rfc1 Bh6 28.Rc8 Re7 29.Rxe8+ Rxe8 { multi line',
            'continued } 30.f4 Rc8 31.Rxc8+ { comment 11 } Qxc8 32.Bc3 ( 32.Bc4 ( 32.Bc1 Kg1 33.Nf3 ) Kg1 33.Ra1 ) Bg7!! = $10 { comment 12 }   1/2-1/2',
            '',
        ]
        let pgn = Pgn.load(data)
        expect(Pgn.save(pgn)).toMatchInlineSnapshot(`
Array [
  "[Event \\"FRG-ch International\\"]",
  "[Site \\"Dortmund\\"]",
  "[Date \\"1973.??.??\\"]",
  "[Round \\"1\\"]",
  "[White \\"Gerusel, Mathias\\"]",
  "[Black \\"Andersson, Ulf\\"]",
  "[Result \\"0-1\\"]",
  "[WhiteElo \\"2415\\"]",
  "[BlackElo \\"2535\\"]",
  "[ECO \\"E39\\"]",
  "",
  "1. d4 Nf6 2. c4 RR { comment 1; } 2... e6 = 3. Nc3 == Bb4 +/= 4. Qc2 =/+ c5 ∓",
  "5. dxc5 ~~ N O-O <=> 6. Bf4 <= Na6 => 7. a3 Bxc3+ 8. Qxc3 Ne4 { abc 8.Qxc3 Ne4",
  "} 9. Qc2 Qa5+ 10. Bd2 Nxd2 11. Qxd2 Qxd2+ 12. Kxd2 Nxc5 13. Rd1 a5 14. Kc2 Rd8",
  "15. b3 d5 16. e3 b6 17. f3 Ba6 18. Nh3 Rac8 19. Kb2 dxc4 20. Bxc4 Bxc4 21. bxc4",
  "Nd3+ 22. Kb3 h6 23. Nf4 Ne5 24. Rxd8+ Rxd8 25. Rc1 g5 26. Nh5 Kh7 27. Nf6+ Kg7",
  "28. Ne4 f5 29. Nc3 Rd3 30. Rd1 a4+ 31. Kb4 Nc6+ 32. Kb5 Rxc3 33. Kxc6 Rxc4+ 34.",
  "Kxb6 Rc3 35. Ra1 Rxe3 36. Ra2 Re5 37. Rc2 Kf6 38. Rb2 h5 39. h3 h4 40. Rd2 Re3",
  "41. Ra2 e5 42. Kb5 e4 43. Kxa4 0-1",
  "",
  "[Event \\"FRG-ch International\\"]",
  "[Site \\"Dortmund\\"]",
  "[Date \\"1973.??.??\\"]",
  "[Round \\"1\\"]",
  "[White \\"Marovic, Drazen\\"]",
  "[Black \\"Keres, Paul\\"]",
  "[Result \\"1/2-1/2\\"]",
  "[WhiteElo \\"2465\\"]",
  "[BlackElo \\"2600\\"]",
  "[ECO \\"D34\\"]",
  "",
  "1. Nf3 d5 2. c4 e6 3. d4 c5 4. cxd5 exd5 5. Nc3 Nc6 6. g3 Nf6 7. Bg2 Be7 8. O-O",
  "O-O 9. dxc5 Bxc5 10. Na4 Be7 11. Be3 Re8 12. Rc1 Bg4 13. h3 Bf5 14. Nd4 Nxd4",
  "15. Bxd4 Be4 16. Nc3 Bxg2 17. Kxg2 Ne4 18. e3 Bf8 19. Qd3 a6 20. Rcd1 Qd6 21.",
  "Ne2 Rad8 22. Nf4 Rd7 23. f3 Ng5 24. Rc1 Ne6 25. Nxe6 Qxe6 26. Rc3 g6 27. Rfc1",
  "Bh6 28. Rc8 Re7 29. Rxe8+ Rxe8 { multi line continued } 30. f4 Rc8 31. Rxc8+ {",
  "comment 11 } 31... Qxc8 32. Bc3 ( 32. Bc4 ( 32. Bc1 Kg1 33. Nf3 ) 32... Kg1 33.",
  "Ra1 ) 32... Bg7!! = $10 { comment 12 } 1/2-1/2",
]
`)
        //        let pgn2 = Pgn.load(Pgn.save(pgn))
        //        expect(Pgn.save(pgn2)).toMatchObject(Pgn.save(pgn))

    })

    test('load and save PGN', () => {
        let data = [
            '[Event "Live Chess"]',
            '[Site "Chess.com"]',
            '[Date "2017.09.03"]',
            '[Round "?"]',
            '[White "player1"]',
            '[Black "player2"]',
            '[Result "1-0"]',
            '[WhiteElo "1367"]',
            '[BlackElo "1207"]',
            '[TimeControl "900+10"]',
            '[ECO "B01"]',
            '[Termination "player1 won by resignation"]',
            '[CurrentPosition "n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 b - - 0 25"]',
            '',
            '1.e4 d5 2.exd5 Qxd5 3.Nc3 { B01: Scandinavian Defense: Mieses - Kotroc Variation, 3.Nc3 } 3...Qe5+ 4.Be2 b6 { (+1.08 → +2.10) Inaccuracy.A better move was 4...Qg5. } (4...Qg5 5.Bf3 5...Nf6 6.d4 6...Qa5 7.Ne2 7...e6 8.O-O 8...Bd6 9.Bd2 ) 5.Nf3 Qe6 6.O-O g6 7.Re1 Bg7 { (+2.47 → +6.53) Mistake.The best move was 7...c6. } (7...c6 8.d4 8...Bg7 9.d5 9...Qd7 10.Bc4 10...b5 11.Bb3 11...Nh6 12.Bg5 ) 8.Bb5+ Bd7 9.Rxe6 fxe6 10.d4 Nf6 11.Bg5 c6 12.Bc4 b5 13.Bb3 a5 14.a4 Na6 15.axb5 cxb5 16.Rxa5 b4 17.Ne2 O-O 18.Qa1 Nc7 19.Ne5 Bb5 20.Ng3 { (+8.31 → +4.90) Mistake.The best move was 20. Bxe6+. } (20.Bxe6+ ) 20...h6 { (+5.15 → +8.58) Inaccuracy.A better move was 20...Rxa5. } (20...Rxa5 21.Bxe6+ 21...Nxe6 22.Qxa5 22...Be8 23.Be3 23...Bf7 24.Nxf7 24...Rxf7 25.Qxb4 ) 21.Be3 { (+8.59 → +3.64) Blunder.The best move was 21. Bc1. } (21.Bc1 21...Kh7 22.Bxe6 22...Nh5 23.Nxh5 23...Bxe5 24.dxe5 24...Be2 25.Bb3 25...Bxh5 ) 21...Nfd5 { (+3.75 → +7.39) Inaccuracy.A better move was 21...Rxa5. } (21...Rxa5 22.Qxa5 22...Ra8 23.Qxa8+ 23...Nxa8 24.Nxg6 24...Kh7 25.Nf4 25...Nc7 26.Nxe6 ) 22.c4 bxc3 23.bxc3 { (+5.90 → +2.36) Blunder.The best move was 23. Rxa8. } (23.Rxa8 23...Rxa8 24.Qb1 24...Nxe3 25.fxe3 25...cxb2 26.Qxb2 26...Be8 27.Qc3 27...Bxe5 ) 23...Nxc3 { (+2.47 → +12.81) Blunder.The best move was 23...Rxa5. } (23...Rxa5 24.Qxa5 24...Ra8 25.Qxa8+ 25...Nxa8 26.Nxg6 26...Nab6 27.Nf4 27...Bc4 28.Nxd5 ) 24.Rxa8 Nxa8 25.Qxc3  1-0'
        ]
        let pgn = Pgn.load(data)
        expect(Pgn.save(pgn)).toMatchInlineSnapshot(`
Array [
  "[Event \\"Live Chess\\"]",
  "[Site \\"Chess.com\\"]",
  "[Date \\"2017.09.03\\"]",
  "[Round \\"?\\"]",
  "[White \\"player1\\"]",
  "[Black \\"player2\\"]",
  "[Result \\"1-0\\"]",
  "[WhiteElo \\"1367\\"]",
  "[BlackElo \\"1207\\"]",
  "[ECO \\"B01\\"]",
  "[TimeControl \\"900+10\\"]",
  "[Termination \\"player1 won by resignation\\"]",
  "[CurrentPosition \\"n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 b - - 0 25\\"]",
  "",
  "1. e4 d5 2. exd5 Qxd5 3. Nc3 { B01: Scandinavian Defense: Mieses - Kotroc",
  "Variation, 3.Nc3 } 3... Qe5+ 4. Be2 b6 { (+1.08 → +2.10) Inaccuracy.A better",
  "move was 4...Qg5. } ( 4... Qg5 5. Bf3 Nf6 6. d4 Qa5 7. Ne2 e6 8. O-O Bd6 9. Bd2",
  ") 5. Nf3 Qe6 6. O-O g6 7. Re1 Bg7 { (+2.47 → +6.53) Mistake.The best move was",
  "7...c6. } ( 7... c6 8. d4 Bg7 9. d5 Qd7 10. Bc4 b5 11. Bb3 Nh6 12. Bg5 ) 8.",
  "Bb5+ Bd7 9. Rxe6 fxe6 10. d4 Nf6 11. Bg5 c6 12. Bc4 b5 13. Bb3 a5 14. a4 Na6",
  "15. axb5 cxb5 16. Rxa5 b4 17. Ne2 O-O 18. Qa1 Nc7 19. Ne5 Bb5 20. Ng3 { (+8.31",
  "→ +4.90) Mistake.The best move was 20. Bxe6+. } ( 20. Bxe6+ ) 20... h6 { (+5.15",
  "→ +8.58) Inaccuracy.A better move was 20...Rxa5. } ( 20... Rxa5 21. Bxe6+ Nxe6",
  "22. Qxa5 Be8 23. Be3 Bf7 24. Nxf7 Rxf7 25. Qxb4 ) 21. Be3 { (+8.59 → +3.64)",
  "Blunder.The best move was 21. Bc1. } ( 21. Bc1 Kh7 22. Bxe6 Nh5 23. Nxh5 Bxe5",
  "24. dxe5 Be2 25. Bb3 Bxh5 ) 21... Nfd5 { (+3.75 → +7.39) Inaccuracy.A better",
  "move was 21...Rxa5. } ( 21... Rxa5 22. Qxa5 Ra8 23. Qxa8+ Nxa8 24. Nxg6 Kh7 25.",
  "Nf4 Nc7 26. Nxe6 ) 22. c4 bxc3 23. bxc3 { (+5.90 → +2.36) Blunder.The best move",
  "was 23. Rxa8. } ( 23. Rxa8 Rxa8 24. Qb1 Nxe3 25. fxe3 cxb2 26. Qxb2 Be8 27. Qc3",
  "Bxe5 ) 23... Nxc3 { (+2.47 → +12.81) Blunder.The best move was 23...Rxa5. } (",
  "23... Rxa5 24. Qxa5 Ra8 25. Qxa8+ Nxa8 26. Nxg6 Nab6 27. Nf4 Bc4 28. Nxd5 ) 24.",
  "Rxa8 Nxa8 25. Qxc3 1-0",
]
`)
        let pgn2 = Pgn.load(Pgn.save(pgn)) // should generate (almost) the same data structure
        expect(Pgn.save(pgn2)).toMatchObject(Pgn.save(pgn)) // should generate identical PGN

    })

    test('PGN testing variants', () => {
        let data = [
            '[Event "Live Chess"]',
            '[Site "Chess.com"]',
            '[Date "2017.09.03"]',
            '[Round "?"]',
            '[White "player1"]',
            '[Black "player2"]',
            '[Result "1-0"]',
            '[WhiteElo "1367"]',
            '[BlackElo "1207"]',
            '[TimeControl "900+10"]',
            '[ECO "B01"]',
            '[Termination "player1 won by resignation"]',
            '[CurrentPosition "n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 b - - 0 25"]',
            '',
            '1.e4 d5 2.exd5 Qxd5 3.Nc3 3...Qe5+ 4.Be2 b6 (4...Qg5 5.Bf3 5...Nf6 6.d4 6...Qa5 7.Ne2 7...e6 8.O-O 8...Bd6 9.Bd2 ) 5.Nf3 Qe6 6.O-O  1-0',
        ]
        let pgn = Pgn.load(data)
        expect(Pgn.save(pgn)).toMatchInlineSnapshot(`
Array [
  "[Event \\"Live Chess\\"]",
  "[Site \\"Chess.com\\"]",
  "[Date \\"2017.09.03\\"]",
  "[Round \\"?\\"]",
  "[White \\"player1\\"]",
  "[Black \\"player2\\"]",
  "[Result \\"1-0\\"]",
  "[WhiteElo \\"1367\\"]",
  "[BlackElo \\"1207\\"]",
  "[ECO \\"B01\\"]",
  "[TimeControl \\"900+10\\"]",
  "[Termination \\"player1 won by resignation\\"]",
  "[CurrentPosition \\"n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 b - - 0 25\\"]",
  "",
  "1. e4 d5 2. exd5 Qxd5 3. Nc3 Qe5+ 4. Be2 b6 ( 4... Qg5 5. Bf3 Nf6 6. d4 Qa5 7.",
  "Ne2 e6 8. O-O Bd6 9. Bd2 ) 5. Nf3 Qe6 6. O-O 1-0",
]
`)
        let pgn2 = Pgn.load(Pgn.save(pgn)) // should generate (almost) the same data structure
        expect(Pgn.save(pgn2)).toMatchObject(Pgn.save(pgn)) // should generate identical PGN

    })

    test('PGN testing variants', () => {
        let data = [
            '1.e4 d5 2.exd5 (2.e5 e6 3. Nf3 (3. Nc3 h6 4.d4) ) Qxd5 3.Nc3 3...Qe5+ 4.Be2 b6 (4...Qg5 5.Bf3 5...Nf6 6.d4 6...Qa5 7.Ne2 7...e6 8.O-O 8...Bd6 9.Bd2 ) 5.Nf3 Qe6 6.O-O  1-0'
        ]
        let pgn = Pgn.load(data)
        expect(Pgn.save(pgn)).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"1-0\\"]",
  "",
  "1. e4 d5 2. exd5 ( 2. e5 e6 3. Nf3 ( 3. Nc3 h6 4. d4 ) ) 2... Qxd5 3. Nc3 Qe5+",
  "4. Be2 b6 ( 4... Qg5 5. Bf3 Nf6 6. d4 Qa5 7. Ne2 e6 8. O-O Bd6 9. Bd2 ) 5. Nf3",
  "Qe6 6. O-O 1-0",
]
`)
        let pgn2 = Pgn.load(Pgn.save(pgn)) // should generate (almost) the same data structure
        expect(Pgn.save(pgn2)).toMatchObject(Pgn.save(pgn)) // should generate identical PGN
    })

    test('PGN testing variants', () => {
        let data = [
            '[TimeControl "*900"]',
            '',
            '*',
        ]
        let pgn = Pgn.load(data)
        expect(Pgn.save(pgn)).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "[TimeControl \\"*900\\"]",
  "",
  " *",
]
`)

        data = [
            '[TimeControl "?"]',
            '',
            '*',
        ]
        pgn = Pgn.load(data)
        expect(Pgn.save(pgn)).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "[TimeControl \\"?\\"]",
  "",
  " *",
]
`)

        data = [
            '[TimeControl "-"]',
            '',
            '*',
        ]
        pgn = Pgn.load(data)
        expect(Pgn.save(pgn)).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "[TimeControl \\"-\\"]",
  "",
  " *",
]
`)

        data = [
            '[TimeControl "40/9000"]',
            '',
            '*',
        ]
        pgn = Pgn.load(data)
        expect(Pgn.save(pgn)).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "[TimeControl \\"40/9000\\"]",
  "",
  " *",
]
`)

        data = [
            '[TimeControl "9000"]',
            '',
            '*',
        ]
        pgn = Pgn.load(data)
        expect(Pgn.save(pgn)).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "[TimeControl \\"9000\\"]",
  "",
  " *",
]
`)

        data = [
            '[TimeControl "*180"]',
            '',
            '*',
        ]
        pgn = Pgn.load(data)
        expect(Pgn.save(pgn)).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "[TimeControl \\"*180\\"]",
  "",
  " *",
]
`)

        data = [
            '[TimeControl "4500+60"]',
            '',
            '*',
        ]
        pgn = Pgn.load(data)
        expect(Pgn.save(pgn)).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "[TimeControl \\"4500+60\\"]",
  "",
  " *",
]
`)

        data = [
            '[TimeControl "40/9000:4500+60"]',
            '',
            '*',
        ]
        pgn = Pgn.load(data)
        expect(Pgn.save(pgn)).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "[TimeControl \\"40/9000:4500+60\\"]",
  "",
  " *",
]
`)

    })
    test('PGN testing Header', () => {
        let data = [
            '[Event "Live Chess"]',
            '[Site "Chess.com"]',
            '[Date "2017.09.03"]',
            '[Round "?"]',
            '[White "player1"]',
            '[Black "player2"]',
            '[Result "1/2-1/2"]',
            '[WhiteTitle "FM"]',
            '[BlackTitle "GM"]',
            '[WhiteElo "1367"]',
            '[BlackElo "1207"]',
            '[WhiteUSCF "1367"]',
            '[BlackUSCF "1207"]',
            '[WhiteType "Computer"]',
            '[BlackType "human"]',
            '[EventData "some data"]',
            '[EventSponsor "some sponsor"]',
            '[Section "section"]',
            '[Stage "stage"]',
            '[Board "2"]',
            '[Opening "Queens Gambit"]',
            '[Variation "Slav"]',
            '[SubVariation "exchange"]',
            '[ECO "B01"]',
            '[NIC "ABC"]',
            '[Termination "player1 won by resignation"]',
            '[SetUp "1"]',
            '[FEN "n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 b - - 0 25"]',
            '[Annotator "somebody"]',
            '[Mode "mode"]',
            '[PlyCount "0"]',
            '[customTag "anything"]',
            '',
            '1/2-1/2',
        ]
        let pgn = Pgn.load(data)
        expect(Pgn.save(pgn)).toMatchInlineSnapshot(`
Array [
  "[Event \\"Live Chess\\"]",
  "[Site \\"Chess.com\\"]",
  "[Date \\"2017.09.03\\"]",
  "[Round \\"?\\"]",
  "[White \\"player1\\"]",
  "[Black \\"player2\\"]",
  "[Result \\"1/2-1/2\\"]",
  "[WhiteTitle \\"FM\\"]",
  "[BlackTitle \\"GM\\"]",
  "[WhiteElo \\"1367\\"]",
  "[BlackElo \\"1207\\"]",
  "[WhiteUSCF \\"1367\\"]",
  "[BlackUSCF \\"1207\\"]",
  "[WhiteType \\"Computer\\"]",
  "[BlackType \\"human\\"]",
  "[EventData \\"some data\\"]",
  "[EventSponsor \\"some sponsor\\"]",
  "[Section \\"section\\"]",
  "[Stage \\"stage\\"]",
  "[Board \\"2\\"]",
  "[Opening \\"Queens Gambit\\"]",
  "[Variation \\"Slav\\"]",
  "[SubVariation \\"exchange\\"]",
  "[ECO \\"B01\\"]",
  "[NIC \\"ABC\\"]",
  "[SetUp \\"1\\"]",
  "[FEN \\"n4rk1/4p1b1/4p1pp/1b2N3/3P4/1BQ1B1N1/5PPP/6K1 b - - 0 25\\"]",
  "[Termination \\"player1 won by resignation\\"]",
  "[Annotator \\"somebody\\"]",
  "[Mode \\"mode\\"]",
  "[PlyCount \\"0\\"]",
  "[customTag \\"anything\\"]",
  "",
  " 1/2-1/2",
]
`)
    })

    test('PGN testing errors', () => {
        let data = [
            '[Date "2017.09.99"]',
            '',
            '*',
        ]
        expect(() => Pgn.load(data)).toThrowError()

        data = [
            '1.e4 d5 ( 1...exxd5 ) *',
        ]
        expect(() => Pgn.load(data)).toThrowError()

        data = [
            '1. 1.e4 *',
        ]
        expect(() => Pgn.load(data)).toThrowError()

        data = [
            '1.e4 e5 { comment } } 2. Nf3  *',
        ]
        expect(() => Pgn.load(data)).toThrowError()
    })

    test('PGN testing NAG', () => {
        let data = [
            '[Event "FRG-ch International"] [Site "Dortmund"]',
            '%[Site "Dortmund"]',
            '[Date "1973.??.??"]',
            '[Round "1"]',
            '[White "Gerusel, Mathias"]',
            '[Black "Andersson, Ulf"]',
            '[Result "0-1"]',
            '[WhiteElo "2415"]',
            '[BlackElo "2535"]',
            '[ECO "E39"]',
            '',
            '1.d4 Nf6 2.c4 RR { comment 1; } e6 = 3.Nc3 == Bb4 +/= 4.Qc2 =/+ c5 ∓ 5.dxc5 ~~ N O-O <=> 6.Bf4 <= Na6 => 7.a3 Bxc3+ 8.Qxc3 Ne4 ; abc 8.Qxc3 Ne4',
            '9.Qc2 Qa5+ $10 10.Bd2 (.) Nxd2 11.Qxd2 Qxd2+ 12.Kxd2 Nxc5 13.Rd1 a5 14.Kc2 Rd8 15.b3 d5',
            '23.Nf4!! Ne5?? 24.Rxd8+!? Rxd8?! 25.Rc1 N ⇆ g5 26.Nh5 ⨁ Kh7 ⨁ 27.Nf6+ → Kg7 -> → 28.Ne4 f5 29.Nc3 Rd3',
            '30.Rd1 □ a4+ ∞ 31.Kb4 ⩲ +/= Nc6+ ⩱ =/+ 32.Kb5 ± ; +/- ; Rxc3 ∓ -/+ 33.Kxc6 Rxc4+ 34.Kxb6 Rc3 35.Ra1 Rxe3',
            '36.Ra2 Re5 37.Rc2 Kf6 38.Rb2 h5 39.h3 h4 40.Rd2 Re3 41.Ra2 e5 42.Kb5 e4 43.Kxa4  0-1',
        ]
        let pgn = Pgn.load(data)
        expect(Pgn.save(pgn, { noComments: true, useNAG: true })).toMatchInlineSnapshot(`
Array [
  "[Event \\"FRG-ch International\\"]",
  "[Site \\"Dortmund\\"]",
  "[Date \\"1973.??.??\\"]",
  "[Round \\"1\\"]",
  "[White \\"Gerusel, Mathias\\"]",
  "[Black \\"Andersson, Ulf\\"]",
  "[Result \\"0-1\\"]",
  "[WhiteElo \\"2415\\"]",
  "[BlackElo \\"2535\\"]",
  "[ECO \\"E39\\"]",
  "",
  "1. d4 Nf6 2. c4 $145 e6 = 3. Nc3 $144 Bb4 $14 4. Qc2 $15 c5 $17 5. dxc5 $11",
  "$146 O-O $133 6. Bf4 $143 Na6 => 7. a3 Bxc3+ 8. Qxc3 Ne4 9. Qc2 Qa5+ $10 10.",
  "Bd2 $22 Nxd2 11. Qxd2 Qxd2+ 12. Kxd2 Nxc5 13. Rd1 a5 14. Kc2 Rd8 15. b3 d5 16.",
  "Nf4!! Ne5?? 17. Rxd8+!? Rxd8?! 18. Rc1 $146 $132 g5 19. Nh5 $138 Kh7 $139 20.",
  "Nf6+ $40 Kg7 $41 $41 21. Ne4 f5 22. Nc3 Rd3 23. Rd1 $7 a4+ $13 24. Kb4 $14 $14",
  "Nc6+ $15 $15 25. Kb5 $16 Ra2 26. Re5 Rc2 27. Kf6 Rb2 28. h5 h3 29. h4 Rd2 30.",
  "Re3 Ra2 31. e5 Kb5 32. e4 Kxa4 0-1",
]
`)
    })
})

