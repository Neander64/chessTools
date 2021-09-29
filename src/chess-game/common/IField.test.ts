import { validateFieldNotation } from "./IField"

describe('Testing IField & field-helper', () => {
    test('testing validateFieldNotation', () => {
        expect(validateFieldNotation('a1')).toBe(true)
        expect(validateFieldNotation('a8')).toBe(true)
        expect(validateFieldNotation('h1')).toBe(true)
        expect(validateFieldNotation('h8')).toBe(true)

        expect(validateFieldNotation('')).toBe(false)
        expect(validateFieldNotation('  ')).toBe(false)
        expect(validateFieldNotation(' ')).toBe(false)
        expect(validateFieldNotation('a9')).toBe(false)
        expect(validateFieldNotation('h9')).toBe(false)
        expect(validateFieldNotation('A1')).toBe(false)
        expect(validateFieldNotation('h0')).toBe(false)

    })
})
