import * as cb from "./chess-board"
import { pieceKeyType as piecesPieceKeyType } from "./chess-board-pieces"
import { boardFieldIdx } from './chess-board-internal-types'

export enum encodeType {
    Simple,
    BoardLike,
    //FENlike,
    FENlikeLong,
    BoardLikeBigInt,
    FENlikeBigInt,
    FENlikeLongBigInt,
}
export type pieceKeyType = number

export class EncodedPositionKey {
    // encoding board to Uint32 Array that can be used as compact key
    //   6 kinds of piece + color : 4 Bit
    // + 64 field : 7 Bit
    // max 32 pieces, i.e. 32*10 Bit = 320 Bit (max) = 40 Byte : 20 Uint16 : 10 Uint32
    // + Flags (15 bit):
    //  Castle rights 4 bit
    //  white to move 1 bit
    //  en passant possible 1 bit
    //  en passant field 7 bit
    // meaning we can store any position with 42 Byte : 21 Uint16 : 11 Uint32 )
    // this version allows re-construktion of the board from key
    // with a little space left (wasted bits on pieces and in the Flags), I think, this is a pretty good compression.
    // yet, ...

    // alternative like FEN compressed (no delimiter or space)
    //  piece: 4 Bit (max 32*4=128 Bit)
    //  empty Fields (1..8): 3 Bit (max 32*3 = 96 Bit)
    //  Flags: 15 Bit
    // totals (max 239 Bit : 30 Byte : 15 Uint16 : 8 Uint32)
    // this version doesn't allow re-construktion of the board from key (unless piece and empty field values are disjunct)

    // 3rd Version:
    // piece+emptynumber could be encoded together with 5 Bit * (max) 64 = 320+15 Bit = 42 Byte, to be re-constructable
    // I think, normally the representation is much shorter, max is rare (max is a very spread piece placement, not like a real game)
    // 

    static readonly pieceKey = { // we use the same key as in pieces, otherwise we have to map
        // 1 bit: color, 3 bits piece
        R: 0b0001,
        N: 0b0010,
        B: 0b0011,
        Q: 0b0100,
        K: 0b0101,
        P: 0b0110,

        r: 0b1001,
        n: 0b1010,
        b: 0b1011,
        q: 0b1100,
        k: 0b1101,
        p: 0b1110,

        none: 0b1111, // avoid 0
    }

    static encodeField(colIdx: number, rowIdx: number): number {
        return rowIdx * 8 + colIdx /* 0..63 */
    }
    static encodeFieldIdx(f: boardFieldIdx): number {
        return f.rowIdx * 8 + f.colIdx /* 0..63 */
    }
    static mapPieceKey(key_: piecesPieceKeyType): pieceKeyType { // insert mapping of pieceTypes to our representaton if different
        return key_
    }
    static readonly IS_WHITE_MOVE = 0b0000000000000001
    static readonly KINGSIDE_CASTLE_WHITE = 0b0000000000000010
    static readonly QUEENSIDE_CASTLE_WHITE = 0b0000000000000100
    static readonly KINGSIDE_CASTLE_BLACK = 0b0000000000001000
    static readonly QUEENSIDE_CASTLE_BLACK = 0b000000000010000
    static readonly ENPASSANT = 0b000000000100000

    static makeFlags(cbData: cb.IChessBoardData): number {
        let result = 0x0000
        if (cbData.isWhitesMove) result |= this.IS_WHITE_MOVE
        if (cbData.canCastleShortBlack) result |= this.KINGSIDE_CASTLE_BLACK
        if (cbData.canCastleLongBlack) result |= this.QUEENSIDE_CASTLE_BLACK
        if (cbData.canCastleShortWhite) result |= this.KINGSIDE_CASTLE_WHITE
        if (cbData.canCastleLongWhite) result |= this.QUEENSIDE_CASTLE_WHITE
        if (cbData.enPassantPossible) {
            result |= EncodedPositionKey.ENPASSANT
            if (typeof cbData.enPassantField !== 'undefined') {
                result |= (this.encodeFieldIdx(cbData.enPassantField) << 6)
            }
        }
        return result
    }

    // static numArrAreEqual(k1: number[], k2: number[]): boolean {
    //     // compare keys
    //     if (k1.length != k2.length) return false
    //     for (let i = 0; i < k1.length; i++)
    //         if (k1[i] != k2[i]) return false
    //     return true
    //}


    static encodeBoard(board_: cb.IChessBoardRepresentation, cbData: cb.IChessBoardData, encodeType_: encodeType): number[] | BigInt {
        let header = this.makeFlags(cbData)
        switch (encodeType_) {
            case encodeType.Simple:
                return this.encodeBoard_simple(board_, header)
            case encodeType.BoardLike:
                return this.encodeBoard_BoardLike(board_, header)
            // case encodeType.FENlike:
            //     return this.encodeBoard_FENLike(board_, header)
            case encodeType.FENlikeLong:
                return this.encodeBoard_FENLikeLong(board_, header)
            case encodeType.BoardLikeBigInt:
                return this.encodeBoard_BoardLike_BigInt(board_, header)
            case encodeType.FENlikeBigInt:
                return this.encodeBoard_FENLike_BigInt(board_, header)
            case encodeType.FENlikeLongBigInt:
                return this.encodeBoard_FENLikeLong_BigInt(board_, header)
        }
    }
    private static encodeBoard_BoardLike_BigInt(board_: cb.IChessBoardRepresentation, header: number): BigInt {
        // TODO I feel like there is an error with the first Bits comparing the result with the array values
        let result = 1n // adding 1 Bit to avoid cutting leading zeros
        for (let row = 0; row < 8; row++)
            for (let col = 0; col < 8; col++) {
                if (board_.isPiece(col, row)) {
                    let b = BigInt((this.mapPieceKey(board_.pieceKey(col, row)) << 6) | this.encodeField(row, col))
                    result = (result << 11n) | b
                }
            }
        result = (result << 15n) | BigInt(header)
        return result
    }
    private static encodeBoard_FENLike_BigInt(board_: cb.IChessBoardRepresentation, header: number): BigInt {
        let result = 1n // adding 1 Bit to avoid cutting leading zeros
        for (let row = 0; row < 8; row++) {
            let emptyCount = 0
            for (let col = 0; col < 8; col++) {
                if (board_.isPiece(col, row)) {
                    if (emptyCount > 0) {
                        result = (result << 3n) | BigInt(emptyCount)
                        emptyCount = 0
                    }
                    result = (result << 3n) | BigInt(this.mapPieceKey(board_.pieceKey(col, row)))
                }
                else emptyCount++
            }
            if (emptyCount > 0)
                result = (result << 5n) | BigInt(emptyCount)
        }
        result = (result << 15n) | BigInt(header)
        return result
    }
    private static encodeBoard_FENLikeLong_BigInt(board_: cb.IChessBoardRepresentation, header: number): BigInt {
        let result = 1n // adding 1 Bit to avoid cutting leading zeros
        for (let row = 0; row < 8; row++) {
            let emptyCount = 0
            for (let col = 0; col < 8; col++) {
                if (board_.isPiece(col, row)) {
                    if (emptyCount > 0) {
                        result = (result << 5n) | BigInt(emptyCount | 0b10000)
                        emptyCount = 0
                    }
                    result = (result << 5n) | BigInt(this.mapPieceKey(board_.pieceKey(col, row)))
                }
                else emptyCount++
            }
            if (emptyCount > 0)
                result = (result << 5n) | BigInt(emptyCount | 0b10000)
        }
        result = (result << 15n) | BigInt(header)
        return result
    }

    private static encodeBoard_simple(board_: cb.IChessBoardRepresentation, header: number): number[] {
        let result: number[] = []
        for (let row = 0; row < 8; row++)
            for (let col = 0; col < 8; col++) {
                if (board_.isPiece(col, row))
                    result.push((this.mapPieceKey(board_.pieceKey(col, row)) << 6) | this.encodeField(row, col))
            }
        result.push(header)
        return result
    }
    private static encodeBoard_BoardLike(board_: cb.IChessBoardRepresentation, header: number): number[] {
        let result: number[] = []
        for (let row = 0; row < 8; row++)
            for (let col = 0; col < 8; col++) {
                if (board_.isPiece(col, row))
                    result.push((this.mapPieceKey(board_.pieceKey(col, row)) << 6) | this.encodeField(row, col))
            }
        result = this.compress(result, 10) // 4:key + 6:field
        result.push(header)
        return result
    }
    // private static encodeBoard_FENLike(board_: Piece[][], header: number): number[] {
    //     // TODO Impementation, issue it's not fix length, requires to generalize compress
    //     throw new Error("not implemented, yet")
    //     let result: number[] = []
    //     return result
    // }
    private static encodeBoard_FENLikeLong(board_: cb.IChessBoardRepresentation, header: number): number[] {
        let result: number[] = []
        for (let row = 0; row < 8; row++) {
            let emptyCount = 0
            for (let col = 0; col < 8; col++) {
                if (board_.isPiece(col, row)) {
                    if (emptyCount > 0) {
                        result.push(emptyCount | 0b10000)
                        emptyCount = 0
                    }
                    result.push(this.mapPieceKey(board_.pieceKey(col, row)))
                }
                else emptyCount++
            }
            if (emptyCount > 0)
                result.push(emptyCount | 0b10000)
        }
        result = this.compress(result, 5) // count || piece : 5 Bit
        result.push(header)
        return result
    }


    private static compress(sourceValues: number[], bitLenSource: number): number[] {
        // TODO other precisions like set/getBigUint64()
        let result: number[] = []
        const bytesPerTarget = 4 // 2 if Uint16
        const bitLenTarget = bytesPerTarget * 8
        //assert(bitLenTarget > bitLenSource) // sorry, doesn't work that way
        const byteLenTarget = Math.ceil((sourceValues.length * bitLenSource) / bitLenTarget) * bytesPerTarget
        let dataTarget = new ArrayBuffer(byteLenTarget)
        let view = new DataView(dataTarget)
        let pos = 0
        let leftVal = 0x00
        let rightVal = 0x00
        let availableBits = bitLenTarget
        let nextTargetVal = 0x00
        let leftOverSource = 0
        let hasData = false
        for (let x of sourceValues) {
            let leftOverTarget = availableBits - bitLenSource
            if (leftOverTarget >= 0) {
                nextTargetVal |= (x << leftOverTarget)
                availableBits = leftOverTarget
                hasData = true
            }
            else {
                leftOverSource = bitLenSource - availableBits
                leftVal = x >> leftOverSource
                rightVal = x ^ (leftVal << leftOverSource)
                nextTargetVal |= leftVal
                availableBits = 0
                hasData = true
            }
            if (availableBits == 0) {
                view.setUint32(pos++ * bytesPerTarget, nextTargetVal)
                nextTargetVal = 0x00
                availableBits = bitLenTarget
                hasData = false
                if (leftOverSource > 0) {
                    availableBits = bitLenTarget - leftOverSource
                    nextTargetVal |= rightVal << availableBits
                    leftOverSource = 0
                    hasData = true
                }
            }
        }
        if (hasData) {
            view.setUint32(pos++ * bytesPerTarget, nextTargetVal)
        }
        for (let i = 0; i < byteLenTarget / bytesPerTarget; i++) {
            let v = view.getUint32(i * bytesPerTarget)
            result.push(v)
        }
        return result
    }
}
