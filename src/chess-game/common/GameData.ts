import { GameResult } from "./GameResult"

export type gameHeaderDateType = {
    year: number
    month: number
    day: number
}
export class GameHeaderData {
    // PGN STR
    event!: string
    site!: string
    date!: gameHeaderDateType
    round!: string
    blackPlayer!: string
    whitePlayer!: string
    result!: GameResult
    // PGN addional tags (not used, yet)
    // -- Player related informaition
    //WhiteTitle
    //BlackTitle
    //WhiteElo
    //BlackElo
    //WhiteUSCF
    //BlackUSCF
    //WhiteNA
    //BlackNA
    //WhiteType
    //BlackType
    // -- Event related information
    //EventDate
    //EventSponsor
    //Section
    //Stage
    //Board
    // -- Opening information
    //Opening
    //Variation
    //SubVariation
    //ECO
    //NIC
    // -- Time and date related
    //Time
    //UTCTime
    // -- Time control
    //TimeControl
    // -- alternative starting position
    //SetUP {0,1}
    //FEN
    // -- Game conslusion
    //Termination {"abondoned","adjudication","death","emergency","normal","rules infraction","time forfeit","unterminated",...}
    // -- Miscellaneous
    //Annotator
    //Mode {"OTB","PM", "EM", "ICS", "TC"}
    //PlyCount (number of half-moves)

    constructor() {
        this.clear()
    }
    clear() {
        this.event = ''
        this.site = ''
        this.date = { year: 0, month: 0, day: 0 }
        this.round = ''
        this.blackPlayer = ''
        this.whitePlayer = ''
        this.result = GameResult.none
    }
}