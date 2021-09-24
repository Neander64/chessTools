import { Pgn } from "./ChessGame-PGN"

describe('Testing PGN', () => {

    test('testing checkMove', () => {
        expect(Pgn.checkMove('')).toBe(false)
        expect(Pgn.checkMove('1.Nf3')).toBe(true)
        expect(Pgn.checkMove('1...Nf7')).toBe(true)
        expect(Pgn.checkMove('exf8=Q+')).toBe(true)
        expect(Pgn.checkMove('exf9=Q')).toBe(false)
        expect(Pgn.checkMove('exf8=K')).toBe(false)
        expect(Pgn.checkMove('B1d4')).toBe(true)
        expect(Pgn.checkMove('Nfg4+')).toBe(true)
        expect(Pgn.checkMove('Ke1')).toBe(true)
        expect(Pgn.checkMove('O-O')).toBe(true)
        expect(Pgn.checkMove('33.O-O-O')).toBe(true)
        expect(Pgn.checkMove('Rae1')).toBe(true)
        expect(Pgn.checkMove('Ke1')).toBe(true)
        expect(Pgn.checkMove('Qh8#')).toBe(true)
    })

    test('load PGN', () => {

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
            '1.d4 Nf6 2.c4 { comment 1 } e6 3.Nc3 Bb4 4.Qc2 c5 5.dxc5 O-O 6.Bf4 Na6 7.a3 Bxc3+ 8.Qxc3 Ne4',
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
    })

})

