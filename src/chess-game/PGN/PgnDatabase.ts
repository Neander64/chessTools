import { clone } from "../../util/objects/clone"
import { PgnGame } from "./PgnGame"

// TODO merge games by criteria
// TODO create position index
// TODO filter for positons
// TODO split game into games per line

export class PgnDatabase {
    games: PgnGame[]
    constructor() {
        this.games = []
    }
    merge(pgnDb: PgnDatabase) {
        pgnDb.games.forEach(game => this.addGame(game))
    }
    addGame(pgnGame: PgnGame) {
        let pgnGameCopy = clone.deepCopy(pgnGame)
        this.games.push(pgnGameCopy)
    }
    deleteGame(idx: number) {
        this.games.splice(idx, 1)
    }
    sort(sortFct: ((g1: PgnGame, g2: PgnGame) => number) = PgnDatabase.pgnSortCompare) {
        this.games.sort(sortFct)
    }
    static pgnSortCompare(game1: PgnGame, game2: PgnGame): number {
        // <0 : game1 < game2
        // >0 : game1 > game2
        // 0 : game1 = game2
        // usage: this.games.sort(PgnDatabase.pgnSortCompare)

        // implements "standard" collating sequence:
        // see http://www.saremba.de/chessgml/standards/pgn/pgn-complete.htm#c19
        // The first(most important, primary key) is the Date tag.Earlier dated games appear prior to games played at a later date.This field is sorted by ascending numeric value first with the year, then the month, and finally the day of the month.Query characters used for unknown date digit values will be treated as zero digit characters for ordering comparison.
        // The second key is the Event tag.This is sorted in ascending ASCII order.
        // The third key is the Site tag.This is sorted in ascending ASCII order.
        // The fourth key is the Round tag.This is sorted in ascending numeric order based on the value of the integer used to denote the playing round.A query or hyphen used for the round is ordered before any integer value.A query character is ordered before a hyphen character.
        // The fifth key is the White tag.This is sorted in ascending ASCII order.
        // The sixth key is the Black tag.This is sorted in ascending ASCII order.
        // The seventh key is the Result tag.This is sorted in ascending ASCII order.
        // *** I'll ignore the last key, for the time beeing, as I don't have the information available in the data, yet
        // *** To me it makes more sense to use the main-line moves for sorting. yah, letz do it that way.
        // The eighth key is the movetext itself.This is sorted in ascending ASCII order with the entire text including spaces and newline characters.
        // I'll create seperate function for each key allowing user to define their prefered way of combining them.

        return PgnDatabase.pgnSortCompareDate(game1, game2) ||
            PgnDatabase.pgnSortCompareEvent(game1, game2) ||
            PgnDatabase.pgnSortCompareSite(game1, game2) ||
            PgnDatabase.pgnSortCompareRound(game1, game2) ||
            PgnDatabase.pgnSortCompareWhite(game1, game2) ||
            PgnDatabase.pgnSortCompareBlack(game1, game2) ||
            PgnDatabase.pgnSortCompareResult(game1, game2) ||
            PgnDatabase.pgnSortCompareMoves(game1, game2)
    }
    static pgnSortCompareDate(game1: PgnGame, game2: PgnGame): number {
        return game1.header.Date.compare(game2.header.Date)
    }
    static pgnSortCompareEvent(game1: PgnGame, game2: PgnGame): number {
        let event1 = game1.header.Event
        let event2 = game2.header.Event
        if (event1 < event2) return -1
        if (event1 > event2) return 1
        return 0
    }
    static pgnSortCompareSite(game1: PgnGame, game2: PgnGame): number {
        let site1 = game1.header.Site
        let site2 = game2.header.Site
        if (site1 < site2) return -1
        if (site1 > site2) return 1
        return 0
    }
    static pgnSortCompareRound(game1: PgnGame, game2: PgnGame): number {
        let round1 = game1.header.Round
        let round2 = game2.header.Round
        if (round1 < round2) return -1
        if (round1 > round2) return 1
        return 0
    }
    static pgnSortCompareWhite(game1: PgnGame, game2: PgnGame): number {
        let white1 = game1.header.White
        let white2 = game2.header.White
        if (white1 < white2) return -1
        if (white1 > white2) return 1
        return 0
    }
    static pgnSortCompareBlack(game1: PgnGame, game2: PgnGame): number {
        let black1 = game1.header.Black
        let black2 = game2.header.Black
        if (black1 < black2) return -1
        if (black1 > black2) return 1
        return 0
    }
    static pgnSortCompareResult(game1: PgnGame, game2: PgnGame): number {
        let result1 = game1.header.Result.result
        let result2 = game2.header.Result.result
        if (result1 < result2) return -1
        if (result1 > result2) return 1
        return 0
    }
    static pgnSortCompareMoves(game1: PgnGame, game2: PgnGame): number {
        let m1 = game1.mainLine
        let m2 = game2.mainLine
        if (m1 < m2) return -1
        if (m1 > m2) return 1
        return 0
    }
}
