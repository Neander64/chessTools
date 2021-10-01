import { StringUtil } from "./string"

describe('Testing Utilities for string', () => {

    test('testing checkMove', () => {

        expect(StringUtil.chopString('123', 5)).toMatchInlineSnapshot(`
Array [
  "123",
]
`)
        expect(StringUtil.chopString('123', 5, ' ', false)).toMatchInlineSnapshot(`
Array [
  "123",
]
`)
        expect(StringUtil.chopString('123', 5, 'x')).toMatchInlineSnapshot(`
Array [
  "123",
]
`)
        expect(StringUtil.chopString('123', 5, 'x', false)).toMatchInlineSnapshot(`
Array [
  "123",
]
`)
        expect(StringUtil.chopString('123456', 5)).toMatchInlineSnapshot(`
Array [
  "12345",
  "6",
]
`)
        expect(StringUtil.chopString('12345', 5)).toMatchInlineSnapshot(`
Array [
  "12345",
]
`)
        expect(StringUtil.chopString('1234567890123456789', 5)).toMatchInlineSnapshot(`
Array [
  "12345",
  "67890",
  "12345",
  "6789",
]
`)

        expect(StringUtil.chopString('123 4567 890123456 789', 5)).toMatchInlineSnapshot(`
Array [
  "123",
  "4567",
  "89012",
  "3456",
  "789",
]
`)
        expect(StringUtil.chopString('123 4567 890123456 789', 5, ' ', false)).toMatchInlineSnapshot(`
Array [
  "123",
  " 4567",
  " 8901",
  "23456",
  " 789",
]
`)
        expect(StringUtil.chopString('123 4567 890123456 789', 5, '45', true)).toMatchInlineSnapshot(`
Array [
  "123 ",
  "567 8",
  "90123",
  "56 78",
  "9",
]
`)
        expect(StringUtil.chopString('123 4567 890123456 789', 5, '45', false)).toMatchInlineSnapshot(`
Array [
  "123 ",
  "4567 ",
  "89012",
  "3",
  "456 7",
  "89",
]
`)

        expect(StringUtil.chopString('aa aaxaa aaaaa aaa', 5)).toMatchInlineSnapshot(`
Array [
  "aa",
  "aaxaa",
  "aaaaa",
  "aaa",
]
`)
        expect(StringUtil.chopString('aaaaaa aaaaa aaa', 5, 'x')).toMatchInlineSnapshot(`
Array [
  "aaaaa",
  "a aaa",
  "aa aa",
  "a",
]
`)

        expect(StringUtil.chopString('aaaaaa aaaaa aaa', 5, ' ', false)).toMatchInlineSnapshot(`
Array [
  "aaaaa",
  "a",
  " aaaa",
  "a aaa",
]
`)

        expect(StringUtil.chopString('aa aaxaa aaaaa aaa', 5, 'x')).toMatchInlineSnapshot(`
Array [
  "aa aa",
  "aa aa",
  "aaa a",
  "aa",
]
`)
    })
})

