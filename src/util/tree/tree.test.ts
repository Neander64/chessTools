import { Tree, TreeNode } from "./tree"

describe('Testing Tree', () => {

  test('testing tree', () => {
    let tree = new Tree<string, string>()
    expect(tree.isTerminalNode).toBe(true)
    tree.add(new TreeNode('k1', 'data 1'))
    expect(tree.isTerminalNode).toBe(false)
    let n2 = new TreeNode('k2', 'data 2')
    expect(n2.isTerminalNode).toBe(true)
    n2.add(new TreeNode('k3', 'data 3'))
    expect(n2.isTerminalNode).toBe(false)
    n2.add(new TreeNode('k4', 'data 4'))
    n2.add(new TreeNode('k5', 'data 5'))
    tree.add(n2)
    let n2a = new TreeNode('65', 'data 6')
    n2.add(n2a)
    expect(n2a.keyPath(false)).toMatchObject(['k2'])
    expect(n2a.keyPath()).toMatchObject(['k2', '65'])

    let list: string[] = []
    tree.forEach((n, l) => list.push('' + l + ':' + n.key + ',' + n.data + ' (parent:' + n.prev?.key + ')'))
    expect(list).toMatchInlineSnapshot(`
Array [
  "0:k1,data 1 (parent:undefined)",
  "0:k2,data 2 (parent:undefined)",
  "1:k3,data 3 (parent:k2)",
  "1:k4,data 4 (parent:k2)",
  "1:k5,data 5 (parent:k2)",
  "1:65,data 6 (parent:k2)",
]
`)
    expect(tree.findByKey('k2')).toMatchObject(n2)
    expect(tree.getAllTerminalNodeKeyPaths()).toMatchInlineSnapshot(`
Array [
  Array [
    "k1",
  ],
  Array [
    "k2",
    "k3",
  ],
  Array [
    "k2",
    "k4",
  ],
  Array [
    "k2",
    "k5",
  ],
  Array [
    "k2",
    "65",
  ],
]
`)

    expect(tree.getAllTerminalNodePaths().map((x) => x.map((y) => y.key))).toMatchInlineSnapshot(`
Array [
  Array [
    "k1",
  ],
  Array [
    "k2",
    "k3",
  ],
  Array [
    "k2",
    "k4",
  ],
  Array [
    "k2",
    "k5",
  ],
  Array [
    "k2",
    "65",
  ],
]
`)

    expect(tree.getAllTerminalNodes()).toMatchInlineSnapshot(`
Array [
  TreeNode {
    "data": "data 1",
    "key": "k1",
    "next": Array [],
    "prev": undefined,
  },
  TreeNode {
    "data": "data 3",
    "key": "k3",
    "next": Array [],
    "prev": TreeNode {
      "data": "data 2",
      "key": "k2",
      "next": Array [
        [Circular],
        TreeNode {
          "data": "data 4",
          "key": "k4",
          "next": Array [],
          "prev": [Circular],
        },
        TreeNode {
          "data": "data 5",
          "key": "k5",
          "next": Array [],
          "prev": [Circular],
        },
        TreeNode {
          "data": "data 6",
          "key": "65",
          "next": Array [],
          "prev": [Circular],
        },
      ],
      "prev": undefined,
    },
  },
  TreeNode {
    "data": "data 4",
    "key": "k4",
    "next": Array [],
    "prev": TreeNode {
      "data": "data 2",
      "key": "k2",
      "next": Array [
        TreeNode {
          "data": "data 3",
          "key": "k3",
          "next": Array [],
          "prev": [Circular],
        },
        [Circular],
        TreeNode {
          "data": "data 5",
          "key": "k5",
          "next": Array [],
          "prev": [Circular],
        },
        TreeNode {
          "data": "data 6",
          "key": "65",
          "next": Array [],
          "prev": [Circular],
        },
      ],
      "prev": undefined,
    },
  },
  TreeNode {
    "data": "data 5",
    "key": "k5",
    "next": Array [],
    "prev": TreeNode {
      "data": "data 2",
      "key": "k2",
      "next": Array [
        TreeNode {
          "data": "data 3",
          "key": "k3",
          "next": Array [],
          "prev": [Circular],
        },
        TreeNode {
          "data": "data 4",
          "key": "k4",
          "next": Array [],
          "prev": [Circular],
        },
        [Circular],
        TreeNode {
          "data": "data 6",
          "key": "65",
          "next": Array [],
          "prev": [Circular],
        },
      ],
      "prev": undefined,
    },
  },
  TreeNode {
    "data": "data 6",
    "key": "65",
    "next": Array [],
    "prev": TreeNode {
      "data": "data 2",
      "key": "k2",
      "next": Array [
        TreeNode {
          "data": "data 3",
          "key": "k3",
          "next": Array [],
          "prev": [Circular],
        },
        TreeNode {
          "data": "data 4",
          "key": "k4",
          "next": Array [],
          "prev": [Circular],
        },
        TreeNode {
          "data": "data 5",
          "key": "k5",
          "next": Array [],
          "prev": [Circular],
        },
        [Circular],
      ],
      "prev": undefined,
    },
  },
]
`)

    let tree2 = new Tree<string, string>()
    tree2.add(new TreeNode('k1x', 'data 1x'))
    tree2.add(new TreeNode('k2x', 'data 2x'))
    tree2.add(new TreeNode('k1', 'data x'))
    let n3 = new TreeNode('k2', 'abc')
    n3.add(new TreeNode('k4', 'k4 add'))
    n3.add(new TreeNode('k4x', 'k4x'))
    tree2.add(n3)
    let n4 = new TreeNode('aaa', 'bbb')
    n4.add(new TreeNode('ccc', 'ddd'))
    n3.add(n4)
    expect(n4.nextHasKey('ccc')).toBe(true)
    expect(n4.nextHasKey('cccXX')).toBe(false)
    let n4x = new TreeNode('aaa', 'ccc')
    n4x.add(new TreeNode('abc', 'def'))
    expect(n4x.keyPath()).toMatchObject(["aaa"])

    n4.merge(n4x, () => 'merged')
    list = []
    tree2.forEach((n, l) => list.push('' + l + ':' + n.key + ',' + n.data + ' (parent:' + n.prev?.key + ')'))
    expect(list).toMatchInlineSnapshot(`
Array [
  "0:k1x,data 1x (parent:undefined)",
  "0:k2x,data 2x (parent:undefined)",
  "0:k1,data x (parent:undefined)",
  "0:k2,abc (parent:undefined)",
  "1:k4,k4 add (parent:k2)",
  "1:k4x,k4x (parent:k2)",
  "1:aaa,merged (parent:k2)",
  "2:ccc,ddd (parent:aaa)",
  "2:abc,def (parent:aaa)",
]
`)


    let tree3 = new Tree<string, string>()
    let n5 = new TreeNode('k2', 'data 2x')
    n5.add(new TreeNode('x1', 'xdata 1'))
    tree.add(n5)

    tree.merge(tree3, (dataSource, dataTarget) => 'merged2')
    list = []
    tree.forEach((n, l) => list.push('' + l + ':' + n.key + ',' + n.data + ' (parent:' + n.prev?.key + ')'))
    expect(list).toMatchInlineSnapshot(`
Array [
  "0:k1,data 1 (parent:undefined)",
  "0:k2,data 2 (parent:undefined)",
  "1:k3,data 3 (parent:k2)",
  "1:k4,data 4 (parent:k2)",
  "1:k5,data 5 (parent:k2)",
  "1:65,data 6 (parent:k2)",
  "0:k2,data 2x (parent:undefined)",
  "1:x1,xdata 1 (parent:k2)",
]
`)
    tree.merge(tree2, (dataSource, dataTarget) => 'merged2')
    list = []
    tree.forEach((n, l) => list.push('' + l + ':' + n.key + ',' + n.data + ' (parent:' + n.prev?.key + ')'))
    expect(list).toMatchInlineSnapshot(`
Array [
  "0:k1,merged2 (parent:undefined)",
  "0:k2,merged2 (parent:undefined)",
  "1:k3,data 3 (parent:k2)",
  "1:k4,merged2 (parent:k2)",
  "1:k5,data 5 (parent:k2)",
  "1:65,data 6 (parent:k2)",
  "1:k4x,k4x (parent:k2)",
  "1:aaa,merged (parent:k2)",
  "2:ccc,ddd (parent:aaa)",
  "2:abc,def (parent:aaa)",
  "0:k2,data 2x (parent:undefined)",
  "1:x1,xdata 1 (parent:k2)",
  "0:k1x,data 1x (parent:undefined)",
  "0:k2x,data 2x (parent:undefined)",
]
`)


  })
})
