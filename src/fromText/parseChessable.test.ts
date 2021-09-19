import { ChessGame } from "../chess-game/ChessGame"
import { parseChessable } from "./parseChessable"

describe('Testing parseChessable', () => {

    test('testing parsing a game with evaluations', () => {
        let game = new ChessGame()
        let ps = new parseChessable(game)
        let data =
            [
                "1.d4+!!d5#??2.c4?c6N",
                "The Slav has always been one of ...",
                "3.Nc3=N",
                "3.Nf3 Is quite a bit more common",
                "3...Nf6⩲",
                "This is the main move by far.",
                "4.e3⩱",
                "Now, I strongly believe that ...",
                "4...Bf5±",
                "This move was recommended ...",
                "5.cxd5cxd56.Qb3∓",
                "Black has a hard time ...",
                "6...Nc6!7.Qxb7Bd78.Qb3+-Rb89.Qd1-+",
                "White got his queen back home ...",
                "9...e5!10.dxe5Nxe511.Be2Bd6",
                "This position has seen a fair amount..",
                "12.Nf3O-O13.O-OQc7?!",
                "Avrukh correctly points out ..",
                "14.Nd4!Nc415.b3!Bxh2+16.Kh1∞",
                "Material has been equalized...",
            ]
        ps.scanGameText(data)
        expect(game.chessBoard.getFEN()).toMatchInlineSnapshot(`"1r3rk1/p1qb1ppp/5n2/3p4/2nN4/1PN1P3/P3BPPb/R1BQ1R1K b - - 1 16"`)
        expect(game.PGN).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "",
  "1. d4!! d5?? 2. c4? c6 N { The Slav has always been one of ... }",
  "3. Nc3 = N { 3.Nf3 Is quite a bit more common }",
  "4... Nf6 ⩲ { This is the main move by far. }",
  "4. e3 ⩱ { Now, I strongly believe that ... }",
  "5... Bf5 ± { This move was recommended ... } 5. cxd5 cxd5",
  "6. Qb3 ∓ { Black has a hard time ... } 7... Nc6! 7. Qxb7 Bd7 8. Qb3 +- Rb8",
  "9. Qd1 -+ { White got his queen back home ... } 10... e5! 10. dxe5 Nxe5 11. Be2",
  "Bd6 { This position has seen a fair amount.. } 12. Nf3 O-O 13. O-O",
  "Qc7?! { Avrukh correctly points out .. } 14. Nd4! Nc4 15. b3! Bxh2+",
  "16. Kh1 ∞ { Material has been equalized... } *",
]
`)

        game.optionsPGN.noComments = true
        ps.scanGameText(data)
        expect(game.PGN).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "",
  "1. d4!! d5?? 2. c4? c6 N 3. Nc3 = N Nf6 ⩲ 4. e3 ⩱ Bf5 ± 5. cxd5 cxd5 6. Qb3 ∓",
  "Nc6! 7. Qxb7 Bd7 8. Qb3 +- Rb8 9. Qd1 -+ e5! 10. dxe5 Nxe5 11. Be2 Bd6 12. Nf3",
  "O-O 13. O-O Qc7?! 14. Nd4! Nc4 15. b3! Bxh2+ 16. Kh1 ∞ *",
]
`)

        game.optionsPGN.noComments = true
        game.optionsPGN.useNAG = true
        ps.scanGameText(data)
        expect(game.PGN).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "",
  "1. d4 $3 d5 $4 2. c4 $2 c6 N 3. Nc3  $10 N Nf6  $14 4. e3  $15 Bf5  $16 5. cxd5",
  "cxd5 6. Qb3  $17 Nc6 $1 7. Qxb7 Bd7 8. Qb3  $18 Rb8 9. Qd1  $19 e5 $1 10. dxe5",
  "Nxe5 11. Be2 Bd6 12. Nf3 O-O 13. O-O Qc7 $6 14. Nd4 $1 Nc4 15. b3 $1 Bxh2+",
  "16. Kh1  $13 *",
]
`)

    })

    test('testing parsing a game with evaluations (2)', () => {
        let game = new ChessGame()
        let ps = new parseChessable(game)
        let data =
            [
                "1.d4Nf62.c4e63.Nf3Bb4+",
                "The Bogo Indian",
                "4.Bd2",
                "4...Qe7",
                "5.e3!?",
                "5.Nc3?! I once played this move ..",
                "5...O-O6.Bd3",
                "6...Bxd2+!",
                "7.Qxd2d6",
                "8.Nc3!",
                "8.O-O? This is poor.After8...e59.Bc2e4! Since ..",
                "8...e5",
                "another comment",
                "9.Bc2!",
                "9...Bg4",
                "10.h3!Bh5?",
                "This is even worse.",
                "11.g4Bg612.O-O-O±",
            ]
        ps.scanGameText(data)
        //expect(game.chessBoard.getFEN()).toMatchInlineSnapshot(`"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"`)
        expect(game.PGN).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "",
  "1. d4 Nf6 2. c4 e6 3. Nf3 Bb4+ { The Bogo Indian } 4. Bd2 Qe7",
  "5. e3!? { 5.Nc3?! I once played this move .. } 6... O-O 6. Bd3 Bxd2+! 7. Qxd2 d6",
  "8. Nc3! { 8.O-O? This is poor.After8...e59.Bc2e4! Since .. }",
  "9... e5 { another comment } 9. Bc2! Bg4 10. h3! Bh5? { This is even worse. }",
  "11. g4 Bg6 12. O-O-O ± *",
]
`)
    })

    test('testing parsing a game (3)', () => {
        let game = new ChessGame()
        let ps = new parseChessable(game)
        let data =
            [
                "leading comment",
                "1.d 4+=N",
                "comment 0",
                "1...Nf62.c4e63.Nf3 d54.Nc3NNbd7 5.Bf4dxc46.e3Nd57.Bxc4Nxf48.exf4",
                'comment 1',
                'comment 2',
                "8...Nb69.Bb3Bd610.g3Bd7",
                "11.O-OO-O12.Qd3Bc613.Rad1",
                "13...Qf614.Ng5g6?!",
                "15.Nge4!Qf5",
                "16.d5!",
                "16...exd517.Nxd5Nxd518.Bxd5Bxd519.Qxd5Qxd520.Rxd5Rfd821.Rc1!",
                "21...Rac822.Rc3Be723.Rxd8 + Bxd824.f5!",
                "24...Kg7",
                "25.Nd6!",
                "25...Rb826.Ne8 + Kf827.fxg6!",
                "27...hxg6",
                "28.Nxc7",
                "28...Bf629.Rb3Be530.Nd5b631.Nb4Rc832.Nd3",
                "32...Bf633.h4Rc234.Kf1Ke735.Ke1Kd636.Rb4Bg737.Kd1Rc738.h5gxh539.Rb5?!",
                "39...Rd7",
                "40.Rxh5Ke741.Ke2Rc742.Rb5Rc443.Kf3Ra444.a3Rd445.Ke3Rc446.b3Rc247.a4Rc648.g4Re6+49.Kf3Rc650.Ke4Re6+51.Kf3Rc652.Nb4Rc153.Ke4Kd654.Nd3Rg155.Kf5Bc356.f4f657.Nf2Kc658.Ne4!",
                "58...a6",
                "59.Nxc3axb560.axb5+Kd661.Ne4+Ke762.Nxf6Rd163.Kg6Rd364.f5Rd665.g5Kf866.b4Rd467.Kh6Rh4+68.Nh5Rxb469.g6Rg470.f6Rg171.Nf4Re172.Nd5Rf173.Kg5Rg1+74.Kf5Rf1+75.Ke6Re1+76.Kd6Rf177.Kc6",
                "77...Ke878.g7Kd879.g8=N"
            ]
        ps.scanGameText(data)
        expect(game.chessBoard.getFEN()).toMatchInlineSnapshot(`"3k2N1/8/1pK2P2/1P1N4/8/8/8/5r2 b - - 0 79"`)
        expect(game.PGN).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "",
  "1. d4 = N { leading comment comment 0 } 2... Nf6 2. c4 e6 3. Nf3 d5 4. Nc3 N",
  "Nbd7 5. Bf4 dxc4 6. e3 Nd5 7. Bxc4 Nxf4 8. exf4 { comment 1 comment 2 } 9... Nb6",
  "9. Bb3 Bd6 10. g3 Bd7 11. O-O O-O 12. Qd3 Bc6 13. Rad1 Qf6 14. Ng5 g6?!",
  "15. Nge4! Qf5 16. d5! exd5 17. Nxd5 Nxd5 18. Bxd5 Bxd5 19. Qxd5 Qxd5 20. Rxd5",
  "Rfd8 21. Rc1! Rac8 22. Rc3 Be7 23. Rxd8+ Bxd8 24. f5! Kg7 25. Nd6! Rb8 26. Ne8+",
  "Kf8 27. fxg6! hxg6 28. Nxc7 Bf6 29. Rb3 Be5 30. Nd5 b6 31. Nb4 Rc8 32. Nd3 Bf6",
  "33. h4 Rc2 34. Kf1 Ke7 35. Ke1 Kd6 36. Rb4 Bg7 37. Kd1 Rc7 38. h5 gxh5 39. Rb5?!",
  "Rd7 40. Rxh5 Ke7 41. Ke2 Rc7 42. Rb5 Rc4 43. Kf3 Ra4 44. a3 Rd4 45. Ke3 Rc4",
  "46. b3 Rc2 47. a4 Rc6 48. g4 Re6+ 49. Kf3 Rc6 50. Ke4 Re6+ 51. Kf3 Rc6 52. Nb4",
  "Rc1 53. Ke4 Kd6 54. Nd3 Rg1 55. Kf5 Bc3 56. f4 f6 57. Nf2 Kc6 58. Ne4! a6",
  "59. Nxc3 axb5 60. axb5+ Kd6 61. Ne4+ Ke7 62. Nxf6 Rd1 63. Kg6 Rd3 64. f5 Rd6",
  "65. g5 Kf8 66. b4 Rd4 67. Kh6 Rh4+ 68. Nh5 Rxb4 69. g6 Rg4 70. f6 Rg1 71. Nf4",
  "Re1 72. Nd5 Rf1 73. Kg5 Rg1+ 74. Kf5 Rf1+ 75. Ke6 Re1+ 76. Kd6 Rf1 77. Kc6 Ke8",
  "78. g7 Kd8 79. g8=N *",
]
`)
    })
    test('testing parsing a game (4)', () => {
        let game = new ChessGame()
        let ps = new parseChessable(game)
        let data =
            [
                "leading comment",
                "1.d4",
            ]
        ps.scanGameText(data)
        //expect(game.chessBoard.getFEN()).toMatchInlineSnapshot(`"3k2N1/8/1pK2P2/1P1N4/8/8/8/5r2 b - - 0 79"`)
        expect(game.PGN).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "",
  "1. d4 { leading comment } *",
]
`)
    })
    test('testing parsing a game (5)', () => {
        let game = new ChessGame()
        let ps = new parseChessable(game)
        let data =
            [
                "leading comment",
                "1.d4d5",
            ]
        ps.scanGameText(data)
        //expect(game.chessBoard.getFEN()).toMatchInlineSnapshot(`"3k2N1/8/1pK2P2/1P1N4/8/8/8/5r2 b - - 0 79"`)
        expect(game.PGN).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "",
  "1. d4 { leading comment } 2... d5 *",
]
`)
    })
    test('testing parsing a game (6)', () => {
        let game = new ChessGame()
        let ps = new parseChessable(game)
        let data =
            [
                "leading comment",
                "leading-2",
                "1.d4d5",
                "comment",
                "2.c4",
                "comment 2",
                "2...c6",
                "comment 3",
            ]
        ps.scanGameText(data)
        //expect(game.chessBoard.getFEN()).toMatchInlineSnapshot(`"3k2N1/8/1pK2P2/1P1N4/8/8/8/5r2 b - - 0 79"`)
        expect(game.PGN).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "",
  "1. d4 { leading comment leading-2 } 2... d5 { comment } 2. c4 { comment 2 }",
  "3... c6 { comment 3 } *",
]
`)
    })
})