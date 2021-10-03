import { Fen } from "../FEN/Fen"
import { PgnGame } from "./PgnGame"

describe('Testing PgnGame', () => {

    test('testing start FEN ', () => {
        let game = new PgnGame()
        expect(game.startFen).toMatchObject(new Fen(Fen.initialBoardFEN))
    })
})
