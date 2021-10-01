import { PgnTags } from "./PgnTags"

describe('Testing PgnTags', () => {

    test('testing addTag', () => {
        let tags = new PgnTags()
        tags.addTag('SetUp', '0')
        expect(tags.SetUp).toBe(0)
        tags.addTag('SetUp', '1')
        expect(tags.SetUp).toBe(1)
        expect(() => tags.addTag('SetUp', 'y')).toThrowErrorMatchingInlineSnapshot(`"Tag SetUP invalid value"`)

        tags.addTag('WhiteNA', '1344')
        expect(tags.WhiteNA).toBe('1344')
        tags.addTag('BlackNA', '1344')
        expect(tags.BlackNA).toBe('1344')

        tags.addTag('Time', '1:44')
        expect(tags.Time).toBe('1:44')
        tags.addTag('UTCTime', '1:44')
        expect(tags.UTCTime).toBe('1:44')
        tags.addTag('UTCDate', '1:44')
        expect(tags.UTCDate).toBe('1:44')

        expect(tags.toStringArray()).toMatchInlineSnapshot(`
Array [
  "[Event \\"?\\"]",
  "[Site \\"?\\"]",
  "[Date \\"????.??.??\\"]",
  "[Round \\"?\\"]",
  "[White \\"?\\"]",
  "[Black \\"?\\"]",
  "[Result \\"*\\"]",
  "[WhiteNA \\"1344\\"]",
  "[BlackNA \\"1344\\"]",
  "[Time \\"1:44\\"]",
  "[UTCTime \\"1:44\\"]",
  "[UTCDate \\"1:44\\"]",
  "[SetUp \\"1\\"]",
]
`)
    })
})
