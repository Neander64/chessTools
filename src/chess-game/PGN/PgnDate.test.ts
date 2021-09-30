import { PgnDate } from "./PgnDate"

describe('Testing PgnDate', () => {

    test('testing various dates', () => {
        let pgnDate = new PgnDate()

        let date = '1972.11.24'
        pgnDate.set(date)
        expect(pgnDate.get()).toBe(date)

        date = '1920.0x02.??'
        pgnDate.set(date)
        expect(pgnDate.get()).toBe('1920.02.??')

        date = '1.2.4'
        pgnDate.set(date)
        expect(pgnDate.get()).toBe('0001.02.04')

        date = '9999.2.4'
        pgnDate.set(date)
        expect(pgnDate.get()).toBe('9999.02.04')


        expect(() => pgnDate.set('1920.??.??.??')).toThrowErrorMatchingInlineSnapshot(`"invalid Date"`)
        expect(() => pgnDate.set('1920.??')).toThrowErrorMatchingInlineSnapshot(`"invalid Date"`)
        expect(() => pgnDate.set('1920.??.99')).toThrowErrorMatchingInlineSnapshot(`"invalid Date: Day"`)
        expect(() => pgnDate.set('1920.??.b')).toThrowErrorMatchingInlineSnapshot(`"invalid Date: Day"`)
        expect(() => pgnDate.set('1920.00.??')).toThrowErrorMatchingInlineSnapshot(`"invalid Date: Month"`)
        expect(() => pgnDate.set('1920.0.0')).toThrowErrorMatchingInlineSnapshot(`"invalid Date: Month"`)
        expect(() => pgnDate.set('1920.0x.??')).toThrowErrorMatchingInlineSnapshot(`"invalid Date: Month"`)
        expect(() => pgnDate.set('????.0.??')).toThrowErrorMatchingInlineSnapshot(`"invalid Date: Month"`)
        expect(() => pgnDate.set('????.13.??')).toThrowErrorMatchingInlineSnapshot(`"invalid Date: Month"`)
        expect(() => pgnDate.set('????.??.0')).toThrowErrorMatchingInlineSnapshot(`"invalid Date: Day"`)
        expect(() => pgnDate.set('????.??.32')).toThrowErrorMatchingInlineSnapshot(`"invalid Date: Day"`)
        expect(() => pgnDate.set('????.??.0')).toThrowErrorMatchingInlineSnapshot(`"invalid Date: Day"`)
        expect(() => pgnDate.set('???a.??.??')).toThrowErrorMatchingInlineSnapshot(`"invalid Date: Year"`)
        expect(() => pgnDate.set('10000.??.??')).toThrowErrorMatchingInlineSnapshot(`"invalid Date: Year"`)
        expect(() => pgnDate.set('-10.??.??')).toThrowErrorMatchingInlineSnapshot(`"invalid Date: Year"`)
        expect(() => pgnDate.set('0.??.??')).toThrowErrorMatchingInlineSnapshot(`"invalid Date: Year"`)
    })
})
