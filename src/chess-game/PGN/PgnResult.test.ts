import { PgnResult } from "./PgnResult"

describe('Testing PgnResult', () => {

    test('testing various inputs', () => {
        let res = new PgnResult
        res.result = '1-0'
        expect(res.result).toBe('1-0')
        res.result = '0-1'
        expect(res.result).toBe('0-1')
        res.result = '1/2-1/2'
        expect(res.result).toBe('1/2-1/2')
        res.result = '*'
        expect(res.result).toBe('*')

        expect(() => res.result = '**').toThrowErrorMatchingInlineSnapshot(`"invalid result value:**"`)
        expect(() => res.result = '1-*').toThrowErrorMatchingInlineSnapshot(`"invalid result value:1-*"`)
        expect(() => res.result = ' 1-0').toThrowErrorMatchingInlineSnapshot(`"invalid result value: 1-0"`)

    })
})
