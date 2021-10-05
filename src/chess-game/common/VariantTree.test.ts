import { VariantMove, VariantTree } from "./VariantTree"
describe('Testing VariantTree', () => {

    test('testing variantTree, variantCursor  ', () => {
        let tree = new VariantTree()
        let cur = tree.getCursor()
        expect(cur.data).toBeUndefined()
        expect(cur.back()).toBe(false)
        cur.addMove(new VariantMove('d4'))
        expect(cur.back()).toBe(true)
        expect(cur.move('e4')).toBe(false)
        cur.addMove(new VariantMove('e4'))
        expect(cur.nextMoves).toMatchObject([])
        expect(cur.back()).toBe(true)
        expect(cur.nextMoves).toMatchObject(["d4", "e4",])
        expect(cur.move('e4')).toBe(true)
        cur.addMove(new VariantMove('e5'))
        cur.addMove(new VariantMove('Nf3'))
        cur.addMove(new VariantMove('Nc7'))
        cur.addMove(new VariantMove('Bb6'))
        expect(cur.line()).toMatchInlineSnapshot(`"e4 e5 Nf3 Nc7 Bb6 "`)
        expect(cur.back()).toBe(true)
        expect(cur.nextMoves).toMatchObject(['Bb6'])
        expect(cur.data).toMatchInlineSnapshot(`
VariantMove {
  "move": "Nc7",
}
`)
        expect(cur.back()).toBe(true)
        expect(cur.line()).toMatchInlineSnapshot(`"e4 e5 Nf3 "`)
        expect(cur.move('Nc7')).toBe(true)
        expect(cur.move('Bb7')).toBe(false)
        expect(cur.line()).toMatchInlineSnapshot(`"e4 e5 Nf3 Nc7 "`)
    })
})
