import { Fen } from "../FEN/Fen"
import { PgnDate } from "./PgnDate"
import { PgnResult } from "./PgnResult"
import { PgnTimeControl } from "./PgnTimeControl"
import { PgnError } from "./PgnError"


export type pgnTagType = {
    name: string
    value: string
}
export class PgnTags {
    Event: string
    Site: string
    Date: PgnDate
    Round: string
    White: string
    Black: string
    Result: PgnResult

    WhiteTitle?: string
    BlackTitle?: string
    WhiteElo?: string
    BlackElo?: string
    WhiteUSCF?: string
    BlackUSCF?: string
    WhiteNA?: string
    BlackNA?: string
    WhiteType?: string
    BlackType?: string

    EventData?: string
    EventSponsor?: string
    Section?: string
    Stage?: string
    Board?: string

    Opening?: string
    Variation?: string
    SubVariation?: string
    ECO?: string
    NIC?: string

    Time?: string
    UTCTime?: string
    UTCDate?: string

    TimeControl?: PgnTimeControl
    SetUp?: number
    FEN?: string
    fen?: Fen
    Termination?: string

    Annotator?: string
    Mode?: string
    PlyCount?: string

    otherTags: pgnTagType[]

    constructor() {
        this.Event = '?'
        this.Site = '?'
        this.Date = new PgnDate()
        this.Round = '?'
        this.White = '?'
        this.Black = '?'
        this.Result = new PgnResult()
        this.otherTags = []
    }
    addTag(name: string, value: string) {
        switch (name) {
            case 'Event': this.Event = value
                break
            case 'Site': this.Site = value
                break
            case 'Date': this.Date.set(value)
                break
            case 'Round': this.Round = value
                break
            case 'White': this.White = value
                break
            case 'Black': this.Black = value
                break
            case 'Result': this.Result.result = value
                break

            case 'WhiteTitle': this.WhiteTitle = value
                break
            case 'BlackTitle': this.BlackTitle = value
                break
            case 'WhiteElo': this.WhiteElo = value
                break
            case 'BlackElo': this.BlackElo = value
                break
            case 'WhiteUSCF': this.WhiteUSCF = value
                break
            case 'BlackUSCF': this.BlackUSCF = value
                break
            case 'WhiteNA': this.WhiteNA = value
                break
            case 'BlackNA': this.BlackNA = value
                break
            case 'WhiteType': this.WhiteType = value
                break
            case 'BlackType': this.BlackType = value
                break

            case 'EventData': this.EventData = value
                break
            case 'EventSponsor': this.EventSponsor = value
                break
            case 'Section': this.Section = value
                break
            case 'Stage': this.Stage = value
                break
            case 'Board': this.Board = value
                break

            case 'Opening': this.Opening = value
                break
            case 'Variation': this.Variation = value
                break
            case 'SubVariation': this.SubVariation = value
                break
            case 'ECO': this.ECO = value
                break
            case 'NIC': this.NIC = value
                break

            case 'Time': this.Time = value
                break
            case 'UTCTime': this.UTCTime = value
                break
            case 'UTCDate': this.UTCDate = value
                break

            case 'TimeControl':
                this.TimeControl = new PgnTimeControl()
                this.TimeControl.set(value)
                break
            case 'SetUp':
                if (isNaN(+value))
                    throw new PgnError('Tag SetUP invalid value')
                this.SetUp = +value
                break
            case 'FEN':
                this.FEN = value
                this.fen = new Fen(this.FEN)
                break
            case 'Termination': this.Termination = value
                break

            case 'Annotator': this.Annotator = value
                break
            case 'Mode': this.Mode = value
                break
            case 'PlyCount': this.PlyCount = value
                break

            default:
                this.otherTags.push({ name: name, value: value })
            //throw new PgnError('Invalid Tag name')
        }
    }
    toStringArray(): string[] {
        let result: string[] = []

        result.push(`[Event "${this.Event}"]`)
        result.push(`[Site "${this.Site}"]`)
        result.push(`[Date "${this.Date.get()}"]`)
        result.push(`[Round "${this.Round}"]`)
        result.push(`[White "${this.White}"]`)
        result.push(`[Black "${this.Black}"]`)
        result.push(`[Result "${this.Result.result}"]`)

        if (this.WhiteTitle)
            result.push(`[WhiteTitle "${this.WhiteTitle}"]`)
        if (this.BlackTitle)
            result.push(`[BlackTitle "${this.BlackTitle}"]`)
        if (this.WhiteElo)
            result.push(`[WhiteElo "${this.WhiteElo}"]`)
        if (this.BlackElo)
            result.push(`[BlackElo "${this.BlackElo}"]`)
        if (this.WhiteUSCF)
            result.push(`[WhiteUSCF "${this.WhiteUSCF}"]`)
        if (this.BlackUSCF)
            result.push(`[BlackUSCF "${this.BlackUSCF}"]`)
        if (this.WhiteNA)
            result.push(`[WhiteNA "${this.WhiteNA}"]`)
        if (this.BlackNA)
            result.push(`[BlackNA "${this.BlackNA}"]`)
        if (this.WhiteType)
            result.push(`[WhiteType "${this.WhiteType}"]`)
        if (this.BlackType)
            result.push(`[BlackType "${this.BlackType}"]`)
        if (this.EventData)
            result.push(`[EventData "${this.EventData}"]`)
        if (this.EventSponsor)
            result.push(`[EventSponsor "${this.EventSponsor}"]`)
        if (this.Section)
            result.push(`[Section "${this.Section}"]`)
        if (this.Stage)
            result.push(`[Stage "${this.Stage}"]`)
        if (this.Board)
            result.push(`[Board "${this.Board}"]`)
        if (this.Opening)
            result.push(`[Opening "${this.Opening}"]`)
        if (this.Variation)
            result.push(`[Variation "${this.Variation}"]`)
        if (this.SubVariation)
            result.push(`[SubVariation "${this.SubVariation}"]`)
        if (this.ECO)
            result.push(`[ECO "${this.ECO}"]`)
        if (this.NIC)
            result.push(`[NIC "${this.NIC}"]`)
        if (this.Time)
            result.push(`[Time "${this.Time}"]`)
        if (this.UTCTime)
            result.push(`[UTCTime "${this.UTCTime}"]`)
        if (this.UTCDate)
            result.push(`[UTCDate "${this.UTCDate}"]`)
        if (this.TimeControl)
            result.push(`[TimeControl "${this.TimeControl.get()}"]`)
        if (this.SetUp)
            result.push(`[SetUp "${this.SetUp}"]`)
        if (this.FEN)
            result.push(`[FEN "${this.FEN}"]`)
        if (this.Termination)
            result.push(`[Termination "${this.Termination}"]`)
        if (this.Annotator)
            result.push(`[Annotator "${this.Annotator}"]`)
        if (this.Mode)
            result.push(`[Mode "${this.Mode}"]`)
        if (this.PlyCount)
            result.push(`[PlyCount "${this.PlyCount}"]`)
        for (let other of this.otherTags) {
            result.push(`[${other.name} "${other.value}"]`)
        }
        return result
    }
}
