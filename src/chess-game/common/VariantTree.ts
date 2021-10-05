import { Tree, TreeNode } from "../../util/tree/tree"
type moveKeyType = string // == move for the time beeing, might change
export class VariantMove {
    move: string
    annotation?: string
    comment?: string
    //TODO? position (key, fen..?)
    constructor(move: string) {
        this.move = move
    }
}

export class VariantTree {
    // TODO startPosition
    moveTree = new Tree<moveKeyType, VariantMove>()
    getCursor(): VariantCursor {
        return new VariantCursor(this)
    }
}

export class VariantCursor {
    private _tree: VariantTree
    private current?: TreeNode<moveKeyType, VariantMove>

    constructor(tree: VariantTree) {
        this._tree = tree
    }
    get data(): VariantMove | undefined { return this.current?.data }
    addMove(data: VariantMove) {
        let moveNode = new TreeNode(data.move, data)
        if (this.current)
            this.current.add(moveNode)
        else
            this._tree.moveTree.add(moveNode)
        this.current = moveNode
    }
    move(moveKey: moveKeyType): boolean {
        if (this.current) {
            let moveNode = this.current.findByKey(moveKey)
            if (!moveNode) return false
            this.current = moveNode
        }
        else {
            let moveNode = this._tree.moveTree.findByKey(moveKey)
            if (!moveNode) return false
            this.current = moveNode
        }
        return true
    }
    get nextMoves(): moveKeyType[] {
        let result: moveKeyType[] = []
        if (this.current) {
            for (let n of this.current?.next)
                result.push(n.key)
        }
        else {
            for (let n of this._tree.moveTree.next)
                result.push(n.key)
        }
        return result
    }
    back(): boolean {
        if (this.current) {
            this.current = this.current.prev
            return true
        }
        return false
    }
    line(includeMe = true): string {
        let result = ''
        this.current?.keyPath(includeMe).forEach((k) => result += k + ' ')
        return result
    }
}