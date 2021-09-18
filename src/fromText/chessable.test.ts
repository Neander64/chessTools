import { ChessGame } from "../ChessGame"
import { parseChessable } from "./chessable"

describe('Testing parseChessable', () => {

    test('testing parsing a game with evaluations', () => {
        let game = new ChessGame()
        let ps = new parseChessable(game)
        let data =
            [
                "1.d4!!d5??2.c4?c6N",
                "The Slav has always been one of Black's most solid choices against 1.d4, and it is the move order I recommended in my Semi-Slav course https://www.chessable.com/lifetime-repertoires-semi-slav/course/31529/. The way I advocate playing does a very good job steering the game into Semi-Slav territory, and it avoids a lot of Black's other options.",
                "3.Nc3=",
                "3.Nf3 Is quite a bit more common, but I like this move order.With 3. Nc3 and 4.e3, White avoids all kinds of Bc8 - f5 or g4 options.Black does not HAVE to go for a Semi - Slav, but his other options look pretty soft to me.A key point of understanding these positions is knowing when to take on d5.It's a pretty common move to make whenever Black touches his c8-bishop, as then the b7-pawn will become weak after a subsequent Qd1-b3. It's also generally a good move if Black plays Nb8 - d7, as the knight really belongs on c6 in all of the Exchange Slav structures.",
                "3...Nf6⩲",
                "This is the main move by far.",
                "4.e3⩱",
                "Now, I strongly believe that Black's best move here is e7-e6, transposing back into a Semi-Slav where White is forced to play e3 instead of Bg5. Since this was our plan anyway, I do not find it to be troubling.",
                "4...Bf5±",
                "This move was recommended by Boris Avrukh in his 2014 book 'The Classical Slav' for Quality Chess.It's a very enterprising idea, sacrificing a pawn for quick development and hopefully attacking chances, but I have a hard time believing in it.",
                "5.cxd5cxd56.Qb3∓",
                "Black has a hard time defending the b7 - pawn, and Avrukh's recommendation is to let it go.",
                "6...Nc6!7.Qxb7Bd78.Qb3+-Rb89.Qd1-+",
                "White got his queen back home and will remain a healthy pawn up if he can complete his development.Black should be very direct.",
                "9...e5!10.dxe5Nxe511.Be2Bd6",
                "This position has seen a fair amount of play, and Black's results have not been terrible. He has reasonably attacking chances connected with O-O, Rb8-b6, lifting a rook, and hoping for mate. I only played the White side of this position once, though I won, it was a very stressful game. I think I can cause Black some more issues than present theory can.",
                "12.Nf3O-O13.O-OQc7?!",
                "Avrukh correctly points out that this is not best.The queen is misplaced here and will be vulnerable to a knight landing on b5, and White has a very nice counter sacrifice.",
                "14.Nd4!Nc415.b3!Bxh2+16.Kh1∞",
                "Material has been equalized, but Black's coordination is horrendous, his pieces are loose, and White will easily complete his development with Bc1-b2 once the c4-knight leaves. The machines are claiming White is much better, and I won't argue with them.",
            ]
        ps.scanGameText(data)
        expect(game.chessBoard.getFEN()).toMatchInlineSnapshot(`"1r3rk1/p1qb1ppp/3b1n2/3pn3/8/2N1PN2/PP2BPPP/R1BQ1RK1 w - - 6 14"`)
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
  "1. d4!! d5?? 2. c4?",
  "c6 { The Slav has always been one of Black's most solid choices against 1.d4,",
  "and it is the move order I recommended in my Semi-Slav course",
  "https://www.chessable.com/lifetime-repertoires-semi-slav/course/31529/. The way",
  "I advocate playing does a very good job steering the game into Semi-Slav",
  "territory, and it avoids a lot of Black's other options. }",
  "3. Nc3 = { 3.Nf3 Is quite a bit more common, but I like this move order.With 3.",
  "Nc3 and 4.e3, White avoids all kinds of Bc8 - f5 or g4 options.Black does not",
  "HAVE to go for a Semi - Slav, but his other options look pretty soft to me.A",
  "key point of understanding these positions is knowing when to take on d5.It's a",
  "pretty common move to make whenever Black touches his c8-bishop, as then the",
  "b7-pawn will become weak after a subsequent Qd1-b3. It's also generally a good",
  "move if Black plays Nb8 - d7, as the knight really belongs on c6 in all of the",
  "Exchange Slav structures. } 4... Nf6 ⩲ { This is the main move by far. }",
  "4. e3 ⩱ { Now, I strongly believe that Black's best move here is e7-e6,",
  "transposing back into a Semi-Slav where White is forced to play e3 instead of",
  "Bg5. Since this was our plan anyway, I do not find it to be troubling. }",
  "5... Bf5 ± { This move was recommended by Boris Avrukh in his 2014 book 'The",
  "Classical Slav' for Quality Chess.It's a very enterprising idea, sacrificing a",
  "pawn for quick development and hopefully attacking chances, but I have a hard",
  "time believing in it. } 5. cxd5 cxd5",
  "6. Qb3 ∓ { Black has a hard time defending the b7 - pawn, and Avrukh's",
  "recommendation is to let it go. } 7... Nc6! 7. Qxb7 Bd7 8. Qb3 +- Rb8",
  "9. Qd1 -+ { White got his queen back home and will remain a healthy pawn up if",
  "he can complete his development.Black should be very direct. } 10... e5!",
  "10. dxe5 Nxe5 11. Be2",
  "Bd6 { This position has seen a fair amount of play, and Black's results have",
  "not been terrible. He has reasonably attacking chances connected with O-O,",
  "Rb8-b6, lifting a rook, and hoping for mate. I only played the White side of",
  "this position once, though I won, it was a very stressful game. I think I can",
  "cause Black some more issues than present theory can. } 12. Nf3 O-O 13. O-O",
  "Qc7?! { Material has been equalized, but Black's coordination is horrendous,",
  "his pieces are loose, and White will easily complete his development with",
  "Bc1-b2 once the c4-knight leaves. The machines are claiming White is much",
  "better, and I won't argue with them. } *",
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
  "1. d4!! d5?? 2. c4? c6 3. Nc3 = Nf6 ⩲ 4. e3 ⩱ Bf5 ± 5. cxd5 cxd5 6. Qb3 ∓ Nc6!",
  "7. Qxb7 Bd7 8. Qb3 +- Rb8 9. Qd1 -+ e5! 10. dxe5 Nxe5 11. Be2 Bd6 12. Nf3 O-O",
  "13. O-O Qc7?! *",
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
  "1. d4 $3 d5 $4 2. c4 $2 c6 3. Nc3  $10 Nf6  $14 4. e3  $15 Bf5  $16 5. cxd5 cxd5",
  "6. Qb3  $17 Nc6 $1 7. Qxb7 Bd7 8. Qb3  $18 Rb8 9. Qd1  $19 e5 $1 10. dxe5 Nxe5",
  "11. Be2 Bd6 12. Nf3 O-O 13. O-O Qc7 $6 *",
]
`)

    })
})