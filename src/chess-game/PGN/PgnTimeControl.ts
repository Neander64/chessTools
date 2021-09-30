import { PgnError } from "./PgnError"

// TODO instead of throwing exceptions allow to use a log-file (optional)
// Implementaton based on 
//  http://www.saremba.de/chessgml/standards/pgn/pgn-complete.htm
//  http://www.enpassant.dk/chess/palview/manual/pgn.htm

export type PgnTimeControlPeriod = {
    Unknown?: boolean //= "?",
    none?: boolean //= "-",

    //Formated: 40/9000 : 40 Moves in 2 1/5 hours
    numberOfMovesInPeriod?: number // '/'
    durationOfPeriod?: number // in seconds

    //Formated: 300 : sudden death (always the final Period tag)
    suddenDeath?: number // in seconds

    //Formated: 4500+60 : incremental (always the last tag)
    //durationOfPeriod
    incrementPerMove?: number // in seconds

    //Formated: *180 :Sandclock (always the last tag)
    sandclockPeriod?: number // in seconds
}

export class PgnTimeControl {
    private static readonly TC_SPLIT = ':'
    private static readonly TC_UNKNOWN = '?'
    private static readonly TC_NONE = '-'
    private static readonly TC_MOVES_IN_PERIOD = '/'
    private static readonly TC_INCREMENT = '+'
    private static readonly TC_SANDCLOCK = '*'
    _periods: PgnTimeControlPeriod[] // ':' separted in tag
    constructor() {
        this._periods = []
    }
    set(value: string) {
        this.clear()
        let tokens = value.split(PgnTimeControl.TC_SPLIT)
        try {

            for (const t of tokens) {
                if (t == '') throw new PgnError('empty string given. got:' + value)
                let period: PgnTimeControlPeriod = {}
                if (t == PgnTimeControl.TC_UNKNOWN) {
                    if (tokens.length != 1) throw new PgnError('timecontrol:"unknown" but further values given ' + value)
                    period.Unknown = true
                    this._periods.push(period)
                }
                else if (t == PgnTimeControl.TC_NONE) {
                    if (tokens.length != 1) throw new PgnError('timecontrol:"none" but further values given ' + value)
                    period.none = true
                    this._periods.push(period)
                }
                else if (t.indexOf(PgnTimeControl.TC_MOVES_IN_PERIOD) >= 0) { // number of moves in period
                    let s = t.split(/\//)
                    if (s.length != 2)
                        throw new PgnError('unexpected Timecontrol token: "' + t + '" (moves in Period)')
                    period.numberOfMovesInPeriod = +s[0]
                    period.durationOfPeriod = +s[1]
                    if (isNaN(period.numberOfMovesInPeriod))
                        throw new PgnError('unexpected Timecontrol token: "' + t + '" numberOfMoves is NaN')
                    if (isNaN(period.durationOfPeriod))
                        throw new PgnError('unexpected Timecontrol token: "' + t + '" durationOfPeriod is NaN')
                    this._periods.push(period)
                }
                else if (t.indexOf(PgnTimeControl.TC_INCREMENT) >= 0) { // period with increment
                    let s = t.split(/\+/)
                    if (s.length != 2)
                        throw new PgnError('unexpected Timecontrol token: "' + t + '" (increment)')
                    period.durationOfPeriod = +s[0]
                    period.incrementPerMove = +s[1]
                    if (isNaN(period.durationOfPeriod))
                        throw new PgnError('unexpected Timecontrol token: "' + t + '" durationOfPeriod is NaN')
                    if (isNaN(period.incrementPerMove))
                        throw new PgnError('unexpected Timecontrol token: "' + t + '" incrementPerMove is NaN')
                    this._periods.push(period)
                }
                else if (t.length > 0 && t[0] == PgnTimeControl.TC_SANDCLOCK) { // SandClock
                    period.sandclockPeriod = +t.substring(1)
                    if (isNaN(period.sandclockPeriod))
                        throw new PgnError('unexpected Timecontrol token: "' + t + '" sandclockPeriod is NaN')
                    this._periods.push(period)
                }
                else { // SuddenDeath
                    period.suddenDeath = +t
                    if (isNaN(period.suddenDeath))
                        throw new PgnError('unexpected Timecontrol token: "' + t + '" suddenDeath is NaN')
                    this._periods.push(period)
                }
            }
        }
        catch (err) {
            this.clear()
            throw err
        }
    }
    get(): string | undefined {
        let result: string = ''
        for (const t of this._periods) {
            if (t.Unknown)
                result = PgnTimeControl.TC_UNKNOWN
            else if (t.none)
                result = PgnTimeControl.TC_NONE
            else if (t.numberOfMovesInPeriod)
                result += (result == '' ? '' : ':') + t.numberOfMovesInPeriod + PgnTimeControl.TC_MOVES_IN_PERIOD + t.durationOfPeriod
            else if (t.incrementPerMove)
                result += (result == '' ? '' : ':') + t.durationOfPeriod + PgnTimeControl.TC_INCREMENT + t.incrementPerMove
            else if (t.sandclockPeriod)
                result += (result == '' ? '' : ':') + PgnTimeControl.TC_SANDCLOCK + t.sandclockPeriod
            else if (t.suddenDeath)
                result += (result == '' ? '' : ':') + t.suddenDeath
        }
        return (result == '') ? undefined : result

    }
    clear() {
        this._periods = []
    }
}
