import * as chessBoard from './chess-board'
import * as posKey from './encode-position-key'

describe('Testing chess-board', () => {
    test('encode Board', () => {
        var cb = new chessBoard.ChessBoard("rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PP1/R1BQ1RK1 b kq e3 4 8");
        cb.loadFEN(cb.initialBoardFEN);

        let b = posKey.EncodedPositionKey.encodeBoard(cb.board, cb.data, posKey.encodeType.Simple)
        expect(b).toMatchInlineSnapshot(`
Array [
  576,
  648,
  720,
  792,
  864,
  744,
  688,
  632,
  897,
  905,
  913,
  921,
  929,
  937,
  945,
  953,
  390,
  398,
  406,
  414,
  422,
  430,
  438,
  446,
  71,
  143,
  215,
  287,
  359,
  239,
  183,
  127,
  31,
]
`)

        let b2 = posKey.EncodedPositionKey.encodeBoard(cb.board, cb.data, posKey.encodeType.BoardLike)
        expect(b2).toMatchInlineSnapshot(`
Array [
  2418576195,
  416820874,
  3262701688,
  2655492584,
  2057226169,
  1637410393,
  2657721062,
  3653112264,
  4082966361,
  3472022655,
  31,
]
`)

        let b3 = posKey.EncodedPositionKey.encodeBoard(cb.board, cb.data, posKey.encodeType.FENlikeLong)
        expect(b3).toMatchInlineSnapshot(`
Array [
  1251395245,
  1232313575,
  969852465,
  2199438897,
  2355136612,
  683937792,
  31,
]
`)


        let ba1 = posKey.EncodedPositionKey.encodeBoard(cb.board, cb.data, posKey.encodeType.BoardLikeBigInt)
        expect(ba1).toMatchInlineSnapshot(`385207452132551623670602205762717500955453646675776875809031080058644461171076234947111214327064998052573970463n`)

        let ba2 = posKey.EncodedPositionKey.encodeBoard(cb.board, cb.data, posKey.encodeType.FENlikeBigInt)
        expect(ba2).toMatchInlineSnapshot(`3209871752093694082889009036673700888607n`)

        let ba3 = posKey.EncodedPositionKey.encodeBoard(cb.board, cb.data, posKey.encodeType.FENlikeLongBigInt)
        expect(ba3).toMatchInlineSnapshot(`64848143482572973979193180906923630535584174751730890735647n`)


        cb.loadFEN("8/8/1Q6/8/6pk/5q2/8/6K1 w - - 0 100")
        let b4 = posKey.EncodedPositionKey.encodeBoard(cb.board, cb.data, posKey.encodeType.Simple)
        expect(b4).toMatchInlineSnapshot(`
Array [
  266,
  948,
  892,
  813,
  375,
  1,
]
`)
        let b5 = posKey.EncodedPositionKey.encodeBoard(cb.board, cb.data, posKey.encodeType.BoardLike)
        expect(b5).toMatchInlineSnapshot(`
Array [
  1119571443,
  761118720,
  1,
]
`)
        let b6 = posKey.EncodedPositionKey.encodeBoard(cb.board, cb.data, posKey.encodeType.FENlikeLong)
        expect(b6).toMatchInlineSnapshot(`
Array [
  3324136290,
  3463272748,
  1487994880,
  1,
]
`)

        let bb1 = posKey.EncodedPositionKey.encodeBoard(cb.board, cb.data, posKey.encodeType.BoardLikeBigInt)
        expect(bb1).toMatchInlineSnapshot(`1334197141758161944577n`)

        let bb2 = posKey.EncodedPositionKey.encodeBoard(cb.board, cb.data, posKey.encodeType.FENlikeBigInt)
        expect(bb2).toMatchInlineSnapshot(`190103373653210739802113n`)

        let bb3 = posKey.EncodedPositionKey.encodeBoard(cb.board, cb.data, posKey.encodeType.FENlikeLongBigInt)
        expect(bb3).toMatchInlineSnapshot(`70273826968449668115596869633n`)


        cb.loadFEN("rn1qk2r/1bppbppp/p3pn2/8/Pp1PP3/3B1N2/1PPN1PPP/R1BQ1RK1 b kq e3 4 8");
        let bc1 = posKey.EncodedPositionKey.encodeBoard(cb.board, cb.data, posKey.encodeType.FENlikeLongBigInt)
        expect(bc1).toMatchInlineSnapshot(`74775420613447970203199142227637134569205348019333353887052549165240259480376n`)

    })

})