import { PgnMoveElement } from "./PgnMoveElement"
import { PgnTags } from "./PgnTags"

export class PgnGame {
    header: PgnTags
    moves: PgnMoveElement[]
    constructor() {
        this.header = new PgnTags()
        this.moves = []
    }
}
