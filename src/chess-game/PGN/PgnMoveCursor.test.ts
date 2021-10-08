import { Pgn } from "./Pgn"
import { PgnGame } from "./PgnGame"
import { PgnMoveCursor } from "./PgnMoveCursor"
import { PgnMoveElement } from "./PgnMoveElement"

describe('Testing PgnVariantTree', () => {

    test('testing fromPgnGame ', () => {
        let data = [
            '1.e4 e5 2.f4 exf4 3.Nf3 *',
            '1.d4 (1.e4 (1.c4 g6) e5 (2...d5 (2...g6 ) 3.exd5) 2.Nf3 Nc6 (2...Nf6 ) 3.Bb5) d5 2.c4 d6 *',
        ]
        let pgnDb = Pgn.load(data)
        let pgnCur = new PgnMoveCursor(pgnDb.games[0].moves)
        expect(pgnCur.move('d4')).toBe(false)
        expect(pgnCur.move('e4')).toBe(true)
        expect(pgnCur.currentMove!.move).toBe('e4')
        expect(pgnCur.move('e5')).toBe(true)
        expect(pgnCur.move('f4')).toBe(true)
        expect(pgnCur.move('exf4')).toBe(true)
        expect(pgnCur.line.map((x) => x.move)).toMatchObject(["e4", "e5", "f4",])

        pgnCur = new PgnMoveCursor(pgnDb.games[1].moves)
        expect(pgnCur.move('e4')).toBe(true)
        expect(pgnCur.move('e5')).toBe(true)
        expect(pgnCur.move('Nf3')).toBe(true)
        //        expect(pgnCur.move('Nc6')).toBe(true)
        //        expect(pgnCur.back()).toBe(true)
        expect(pgnCur.move('Nf6')).toBe(true)

        pgnCur.root()
        expect(pgnCur.move('e4')).toBe(true)
        expect(pgnCur.move('d5')).toBe(true)
        expect(pgnCur.move('exd5')).toBe(true)
        expect(pgnCur.line.map((x) => x.move)).toMatchObject(["e4", "d5"])
        pgnCur.add(new PgnMoveElement('Qxd5'))
        pgnCur.add(new PgnMoveElement('Nc3'))
        expect(pgnCur.line.map((x) => x.move)).toMatchObject(["e4", "d5", "exd5", "Qxd5"])
        expect(pgnCur.currentMove!.move).toBe('Nc3')

        pgnCur.root()
        expect(pgnCur.move('e4')).toBe(true)
        expect(pgnCur.move('d5')).toBe(true)
        expect(pgnCur.move('exd5')).toBe(true)
        expect(pgnCur.move('Qxd5')).toBe(true)
        expect(pgnCur.move('Nc3')).toBe(true)

        pgnCur.root()
        expect(pgnCur.move('c4')).toBe(true)
        pgnCur.add(new PgnMoveElement('c5'))
        pgnCur.add(new PgnMoveElement('Nc3'))
        pgnCur.add(new PgnMoveElement('Nf3'))
        pgnCur.root()
        expect(pgnCur.move('c5')).toBe(true)
        expect(pgnCur.move('Nc3')).toBe(true)
        expect(pgnCur.move('Nf3')).toBe(true)

        pgnCur.root()
        pgnCur.add(new PgnMoveElement('g3'))
        pgnCur.add(new PgnMoveElement('g6'))
        pgnCur.root()
        //expect(pgnCur.move('g3')).toBe(true)
        pgnCur.add(new PgnMoveElement('g3'))
        expect(pgnCur.move('g6')).toBe(true)

        pgnCur.root()
        expect(pgnCur.move('e4')).toBe(true)
        expect(pgnCur.move('g6')).toBe(true)

        pgnCur = new PgnMoveCursor(new PgnGame().moves)
        pgnCur.add(new PgnMoveElement('e4'))
        pgnCur.add(new PgnMoveElement('e5'))
        pgnCur.root()
        expect(pgnCur.move('e4')).toBe(true)
        expect(pgnCur.move('e5')).toBe(true)
    })
})
