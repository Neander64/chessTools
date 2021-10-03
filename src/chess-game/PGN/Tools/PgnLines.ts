import { clone } from "../../../util/objects/clone"
import { PgnDatabase } from "../PgnDatabase"
import { PgnGame } from "../PgnGame"
import { PgnMoveElement } from "../PgnMoveElement"

export class PgnLinesStr {
    static generateLinesForDatabase(pgnDB: PgnDatabase): string[] {
        let result: string[] = []
        for (const g of pgnDB.games) {
            result = result.concat(this.generateLinesForGame(g))
        }
        return result
    }
    static generateLinesForGame(pgnGame: PgnGame): string[] {
        return PgnLinesStr.buildLine(pgnGame.moves, '')
    }
    static buildLine(v: PgnMoveElement[], line: string): string[] {
        let result: string[] = []
        let variantLines: string[] = []
        for (const m of v) {
            if (m.variation.length > 0) {
                variantLines = variantLines.concat(PgnLinesStr.buildLine(m.variation, line))
            }
            line += PgnLinesStr.addMove(m)
        }
        result.push(line)
        result = result.concat(variantLines)
        return result
    }
    static addMove(m: PgnMoveElement): string {
        return m.move + ' '
    }
}

export class PgnLines {
    static generateLinesForDatabase(pgnDB: PgnDatabase): PgnMoveElement[][] {
        let result: PgnMoveElement[][] = []
        for (const g of pgnDB.games) {
            result = result.concat(this.generateLinesForGame(g))
        }
        return result
    }
    static generateLinesForGame(pgnGame: PgnGame): PgnMoveElement[][] {
        return PgnLines.buildLine(pgnGame.moves, [])
    }
    static buildLine(v: PgnMoveElement[], line: PgnMoveElement[]): PgnMoveElement[][] {
        let result: PgnMoveElement[][] = []
        let variantLines: PgnMoveElement[][] = []
        let beginLine: PgnMoveElement[] = []
        for (const m of line) {
            beginLine.push(m)
        }
        for (const m of v) {
            if (m.variation.length > 0) {
                variantLines = variantLines.concat(PgnLines.buildLine(m.variation, beginLine))
                let mcopy = clone.deepCopy(m)
                mcopy.variation = []
                beginLine.push(mcopy)
            }
            else
                beginLine.push(m)
        }
        result[0] = beginLine
        result = result.concat(variantLines)
        return result
    }
}

// TODO filter pgn by tag values
// TODO re-number moves
// TODO validate with board
// TODO generate adding FEN / HashKey
// TODO generate transposition table / opening tree
// TODO merge lines
// TODO split lines
// TODO sort lines
// TODO filter lines