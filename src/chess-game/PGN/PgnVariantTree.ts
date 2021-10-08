import { VariantCursor, VariantMove, VariantTree, VariantTreeNode } from "../common/VariantTree"
import { PgnGame } from "./PgnGame"
import { PgnMoveElement } from "./PgnMoveElement"
import { PgnMoveCursor } from "./PgnMoveCursor"


export class PgnVariantTree {

    static toPgnGameMoves(tree: VariantTree): PgnMoveElement[] {
        let moves: PgnMoveElement[] = []
        let paths = tree.getAllTerminalNodePaths()
        for (let m of paths) {
            this.addPathToPgn(m, moves)
        }
        return moves
    }
    static addPathToPgn(path: Array<VariantTreeNode>, pgnMoves: PgnMoveElement[]) {
        let pgnCur = new PgnMoveCursor(pgnMoves)
        for (let p of path) {
            if (!pgnCur.move(p.data.move)) {
                let newElem = new PgnMoveElement(p.data.move)
                // TODO newElem.annotation
                // TODO comment
                pgnCur.add(newElem)
            }
        }

    }

    static mergePgnGame(source: PgnGame, target: VariantTree) {
        let sourceTree = this.fromPgnGame(source)
        target.merge(sourceTree)
    }

    static fromPgnGame(game: PgnGame): VariantTree {
        let tree = new VariantTree()
        let cur = new VariantCursor(tree)
        this.processMoves(game.moves, cur)
        return tree
    }

    private static processMoves(moves: PgnMoveElement[], cur: VariantCursor) {
        let tmp: { pgnMove: PgnMoveElement, varMove: VariantTreeNode }[] = []
        for (let m of moves) {
            let data = new VariantMove(m.move)
            // TODO data.annotation = ...
            // TODO data.comment = ...
            tmp.push({ pgnMove: m, varMove: cur.addMove(data) })
        }
        for (let x of tmp) {
            cur.position = x.varMove
            cur.back()
            this.processMoves(x.pgnMove.variation, cur)
        }
    }

} 