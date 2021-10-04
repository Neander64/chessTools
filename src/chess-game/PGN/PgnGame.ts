import { clone } from "../../util/objects/clone"
import { Fen } from "../FEN/Fen"
import { PgnMoveElement } from "./PgnMoveElement"
import { PgnTags } from "./PgnTags"

export class PgnGame {
    header: PgnTags
    moves: PgnMoveElement[]
    private _fen?: Fen
    constructor() {
        this.header = new PgnTags()
        this.moves = []
    }
    get startFen(): Fen {
        this._fen = this.header.fen || new Fen(Fen.initialBoardFEN)
        return this._fen
    }
    get mainLine(): string {
        return this.moves.reduce((p, a) => { return p + a.move + ' ' }, '')
    }
    mergeGame(game: PgnGame) {
        let gameCpy = clone.deepCopy(game.moves)
        this.mergeMoves(gameCpy, this.moves)
    }
    mergeMoves(source: PgnMoveElement[], target: PgnMoveElement[], sIdx: number = 0, tIdx: number = 0) {
        if (source.length <= sIdx) return
        if (target.length <= tIdx) {
            source.slice(sIdx).forEach(x => target.push(x))
            return
        }

        if (source[sIdx].move == target[tIdx].move) {
            // same main move 
            // TODO adjust values (avoid duplication)
            // annotiations
            // comments

            // merge variants
            for (let sVariation of source[sIdx].allVariations()) {
                let tVariation = target[tIdx].isMoveInAlternatives(sVariation[0].move)
                if (tVariation) {
                    // TODO adjust values (avoid duplication)
                    // annotiations
                    // comments
                    this.mergeMoves(clone.deepCopy(sVariation.slice(1)), tVariation)
                }
                else {
                    target[tIdx].appendVariation(sVariation)
                }
            }
            // proceed with next move
            this.mergeMoves(source, target, sIdx + 1, tIdx + 1)
        }
        else {
            // if target move in source variant, merge source variant with target main
            let sVariation = source[sIdx].isMoveInAlternatives(target[tIdx].move)
            if (sVariation) {
                // TODO adjust values (avoid duplication)
                // annotiations
                // comments
                sVariation[0].variation = []
                this.mergeMoves(sVariation, target, 0, tIdx)
                source[sIdx].removeAlternative(target[tIdx].move)
            }
            // append target moves as new variant
            //let sMoves = clone.deepCopy(source.slice(sIdx))
            target[tIdx].appendVariation(source.slice(sIdx))
        }
    }
}
