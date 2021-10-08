import { Tree, TreeNode } from "../../util/tree/tree"

export type moveKeyType = string // == move 
export type VariantTreeNode = TreeNode<moveKeyType, VariantMove>

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
    // TODO? startPosition
    moveTree = new Tree<moveKeyType, VariantMove>()

    getCursor(): VariantCursor {
        return new VariantCursor(this)
    }
    merge(source: VariantTree, mergeData: ((sourceData: VariantMove, targetData: VariantMove) => VariantMove) = VariantTree.mergeData) {
        this.moveTree.merge(source.moveTree, mergeData)
    }
    static mergeData(sourceData: VariantMove, targetData: VariantMove): VariantMove {
        // TODO merge annotation
        // TODO merge comment
        return targetData
    }
    getAllTerminalNodeKeyPaths(): Array<moveKeyType>[] {
        return this.moveTree.getAllTerminalNodeKeyPaths()
    }
    getAllTerminalNodePaths(): Array<VariantTreeNode>[] {
        return this.moveTree.getAllTerminalNodePaths()
    }
    forEach(fct: (node: VariantTreeNode, level: number) => void) {
        this.moveTree.forEach(fct)
    }
}

export class VariantCursor {
    private _tree: VariantTree
    private current?: VariantTreeNode

    constructor(tree: VariantTree) {
        this._tree = tree
    }
    // get pos(): TreeNode<moveKeyType, VariantMove> | undefined {
    //     return this.current
    // }
    set position(p: VariantTreeNode | undefined) {
        this.current = p
    }
    get data(): VariantMove | undefined { return this.current?.data }
    addMove(data: VariantMove): VariantTreeNode {
        let moveNode: VariantTreeNode = new TreeNode<moveKeyType, VariantMove>(data.move, data)
        if (this.current)
            this.current.add(moveNode)
        else
            this._tree.moveTree.add(moveNode)
        this.current = moveNode
        return moveNode
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