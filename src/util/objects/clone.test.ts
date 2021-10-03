import { clone } from "./clone"

describe('Testing clone class', () => {

    test('testing deepCopy ', () => {
        let arr = [1, 'abc', 4, { x: 2, y: 3, f: () => 'test' }]
        let arr_clone = clone.deepCopy(arr)
        expect(arr_clone).toMatchObject(arr)

        let obj = { x: 2, y: 3, f: () => 'test' }
        let obj_clone = clone.deepCopy(obj)
        expect(obj_clone).toMatchObject(obj)

        let d = new Date(Date.now())
        let d_clone = clone.deepCopy(d)
        expect(d_clone).toMatchObject(d)

        let n = clone.deepCopy(null)
        expect(n).toBe(null)
    })
})
