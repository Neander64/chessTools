
export class Tree<K, T> {

    next: Array<TreeNode<K, T>> = []
    add(newNode: TreeNode<K, T>) {
        newNode.prev = undefined
        this.next.push(newNode)
    }
    findByKey(key: K): TreeNode<K, T> | undefined {
        for (const n of this.next) {
            if (n.key == key) return n
        }
        return undefined
    }
    forEach(fct: (node: TreeNode<K, T>, level: number) => void) {
        for (const n of this.next) {
            n.forEach(fct, 0)
        }
    }
    merge(source: Tree<K, T>, mergeData: (dataSource: T, dataTarget: T) => T, equalKey?: (keySource: K, keyTarget: K) => boolean) {
        let tmp: Array<TreeNode<K, T>> = []
        for (const nS of source.next) {
            let found = false
            for (const nT of this.next) {
                if (((equalKey && equalKey(nS.key, nT.key)) || nS.key == nT.key)) {
                    nT.merge(nS, mergeData, equalKey)
                    found = true
                    break
                }
            }
            if (!found) {
                tmp.push(nS)
            }
        }
        for (const t of tmp) this.add(t)
    }
    get isTerminalNode(): boolean {
        return this.next.length == 0
    }
    getAllTerminalNodes(): Array<TreeNode<K, T>> {
        let result: Array<TreeNode<K, T>> = []
        this.forEach((n) => { if (n.isTerminalNode) result.push(n) })
        return result
    }
    getAllTerminalNodeKeyPaths(): Array<K>[] {
        let result: Array<K>[] = []
        let nodes = this.getAllTerminalNodes()
        for (let n of nodes) {
            result.push(n.keyPath())
        }
        return result
    }
    getAllTerminalNodePaths(): Array<TreeNode<K, T>>[] {
        let result: Array<TreeNode<K, T>>[] = []
        let nodes = this.getAllTerminalNodes()
        for (let n of nodes) {
            result.push(n.path())
        }
        return result
    }
}

export class TreeNode<K, T> {
    key: K
    data: T
    prev?: TreeNode<K, T>
    next: Array<TreeNode<K, T>> = []

    constructor(key: K, data: T, prev?: TreeNode<K, T>) {
        this.key = key
        this.data = data
        this.prev = prev
    }
    add(newNode: TreeNode<K, T>) {
        newNode.prev = this
        this.next.push(newNode)
    }
    nextHasKey(key: K): boolean {
        for (const n of this.next) {
            if (n.key == key) return true
        }
        return false
    }
    findByKey(key: K): TreeNode<K, T> | undefined {
        for (const n of this.next) {
            if (n.key == key) return n
        }
        return undefined
    }
    forEach(fct: (node: TreeNode<K, T>, level: number) => void, level: number = 0) {
        fct(this, level)
        for (const n of this.next) {
            n.forEach(fct, level + 1)
        }
    }
    merge(source: TreeNode<K, T>, mergeData: (dataSource: T, dataTarget: T) => T, equalKey?: (keySource: K, keyTarget: K) => boolean) {
        this.data = mergeData(source.data, this.data)
        let tmp: Array<TreeNode<K, T>> = []
        for (const nS of source.next) {
            let found = false
            for (const nT of this.next) {
                if (((equalKey && equalKey(nS.key, nT.key)) || nS.key == nT.key)) {
                    nT.merge(nS, mergeData, equalKey)
                    found = true
                    break
                }
            }
            if (!found) {
                tmp.push(nS)
            }
        }
        for (const t of tmp) this.add(t)
    }
    keyPath(includeMe = true): Array<K> {
        let result: Array<K> = []
        let tmp = includeMe ? this : this.prev
        while (tmp) {
            result.unshift(tmp.key)
            tmp = tmp.prev
        }
        return result
    }
    path(includeMe = true): Array<TreeNode<K, T>> {
        let result: Array<TreeNode<K, T>> = []
        let tmp = includeMe ? this : this.prev
        while (tmp) {
            result.unshift(tmp)
            tmp = tmp.prev
        }
        return result
    }
    get isTerminalNode(): boolean {
        return this.next.length == 0
    }
}