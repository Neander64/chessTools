import { PgnError } from "./PgnError"


export class PgnResult {
    static readonly WhiteWins = "1-0"
    static readonly BlackWins = "0-1"
    static readonly Draw = "1/2-1/2"
    static readonly Unknown = "*"
    private _result: string
    constructor() {
        this._result = PgnResult.Unknown
    }
    set result(value: string) {
        let r = PgnResult.checkResult(value)
        if (!r) throw new PgnError('invalid result value:' + value)
        this._result = r
    }
    get result() {
        return this._result
    }
    static checkResult(value: string): string | undefined {
        switch (value) {
            case PgnResult.WhiteWins:
            case PgnResult.BlackWins:
            case PgnResult.Draw:
            case PgnResult.Unknown:
                return value
            default:
                return undefined
        }
    }
}
