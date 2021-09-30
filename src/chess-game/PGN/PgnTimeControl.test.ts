import { PgnTimeControl } from "./PgnTimeControl"

describe('Testing PgnTimeControl', () => {

    test('testing various inputs for PgnTimeControlPeriod', () => {
        let tc = new PgnTimeControl
        //[TimeControl "40/7200:20/3600:900+30"]
        tc.set("40/7200:20/3600:900+30")
        expect(tc.get()).toBe("40/7200:20/3600:900+30")

        //[TimeControl "40/7200:3600"]
        tc.set("40/7200:3600")
        expect(tc.get()).toBe("40/7200:3600")

        tc.set('?')
        expect(tc.get()).toBe('?')

        tc.set('-')
        expect(tc.get()).toBe('-')

        tc.set('*30')
        expect(tc.get()).toBe('*30')

        tc.set('*30:60+5')
        expect(tc.get()).toBe('*30:60+5')
        tc.set('60+5:*30')
        expect(tc.get()).toBe('60+5:*30')

        tc.set('4000')
        expect(tc.get()).toBe('4000')
        tc.set('4000:*10') // actually, sudden death should not have a follow up token
        expect(tc.get()).toBe('4000:*10')

        tc.set('40/60:30')
        expect(tc.get()).toBe('40/60:30')
        tc.set('40+5:30')
        expect(tc.get()).toBe('40+5:30')

        //        tc.set('')
        //        expect(tc.get()).toBeUndefined()

        expect(() => tc.set('400/50a')).toThrowErrorMatchingInlineSnapshot(`"unexpected Timecontrol token: \\"400/50a\\" durationOfPeriod is NaN"`)
        expect(() => tc.set('400b/50')).toThrowErrorMatchingInlineSnapshot(`"unexpected Timecontrol token: \\"400b/50\\" numberOfMoves is NaN"`)
        expect(() => tc.set('400/5/0')).toThrowErrorMatchingInlineSnapshot(`"unexpected Timecontrol token: \\"400/5/0\\" (moves in Period)"`)
        expect(() => tc.set('900+334*')).toThrowErrorMatchingInlineSnapshot(`"unexpected Timecontrol token: \\"900+334*\\" incrementPerMove is NaN"`)
        expect(() => tc.set('900b+30')).toThrowErrorMatchingInlineSnapshot(`"unexpected Timecontrol token: \\"900b+30\\" durationOfPeriod is NaN"`)
        expect(() => tc.set('900+30+')).toThrowErrorMatchingInlineSnapshot(`"unexpected Timecontrol token: \\"900+30+\\" (increment)"`)
        expect(() => tc.set('')).toThrowErrorMatchingInlineSnapshot(`"empty string given. got:"`)
        expect(() => tc.set('≈')).toThrowErrorMatchingInlineSnapshot(`"unexpected Timecontrol token: \\"≈\\" suddenDeath is NaN"`)
        expect(() => tc.set('400*')).toThrowErrorMatchingInlineSnapshot(`"unexpected Timecontrol token: \\"400*\\" suddenDeath is NaN"`)
        expect(() => tc.set('*400a')).toThrowErrorMatchingInlineSnapshot(`"unexpected Timecontrol token: \\"*400a\\" sandclockPeriod is NaN"`)
        expect(() => tc.set('?:400')).toThrowErrorMatchingInlineSnapshot(`"timecontrol:\\"unknown\\" but further values given ?:400"`)
        expect(() => tc.set('400:?')).toThrowErrorMatchingInlineSnapshot(`"timecontrol:\\"unknown\\" but further values given 400:?"`)
        expect(() => tc.set('-:400')).toThrowErrorMatchingInlineSnapshot(`"timecontrol:\\"none\\" but further values given -:400"`)
        expect(() => tc.set('400:-')).toThrowErrorMatchingInlineSnapshot(`"timecontrol:\\"none\\" but further values given 400:-"`)
        expect(tc.get()).toBeUndefined()
    })
})
