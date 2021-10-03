// https://javascript.plainenglish.io/deep-clone-an-object-and-preserve-its-type-with-typescript-d488c35e5574
// from https://gist.github.com/sunnyy02/2477458d4d1c08bde8cc06cd8f56702e#file-deepclone-ts
// Author: Sunny Sun
// * fixed TS errors
//      - TS2345 on Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop))
//          ==> Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop)!)
//      - TS7053 on o[prop] = this.deepCopy(source[prop])
//          ==> o[prop] = this.deepCopy((source as { [key: string]: any })[prop])
// * merged some ideas of 
// https://gist.github.com/erikvullings/ada7af09925082cbb89f40ed962d475e
// * check for null

export class clone {
    public static deepCopy<T>(source: T): T {
        if (source === null) return source
        return Array.isArray(source)
            ? source.map(item => this.deepCopy(item))
            : source instanceof Date
                ? new Date(source.getTime())
                : source && typeof source === 'object'
                    ? Object.getOwnPropertyNames(source).reduce(
                        (o, prop) => {
                            Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop)!)
                            o[prop] = this.deepCopy((source as { [key: string]: any })[prop])
                            return o
                        }, Object.create(Object.getPrototypeOf(source)))
                    : source as T
    }
}


// export class ObjectHelper {
//     /**
//      * Deep copy function for TypeScript.
//      * @param T Generic type of target/copied value.
//      * @param target Target value to be copied.
//      * @see Source project, ts-deeply https://github.com/ykdr2017/ts-deepcopy
//      * @see Code pen https://codepen.io/erikvullings/pen/ejyBYg
//      */
//     public static deepCopy<T>(target: T): T {
//         if (target === null) {
//             return target
//         }
//         if (target instanceof Date) {
//             return new Date(target.getTime()) as any
//         }
//         // First part is for array and second part is for Realm.Collection
//         // if (target instanceof Array || typeof (target as any).type === 'string') {
//         if (typeof target === 'object') {
//             if (typeof (target as { [key: string]: any })[(Symbol as any).iterator] === 'function') {
//                 const cp = [] as any[]
//                 if ((target as any as any[]).length > 0) {
//                     for (const arrayMember of target as any as any[]) {
//                         cp.push(ObjectHelper.deepCopy(arrayMember))
//                     }
//                 }
//                 return cp as any as T
//             } else {
//                 const targetKeys = Object.keys(target)
//                 const cp = {} as { [key: string]: any }
//                 if (targetKeys.length > 0) {
//                     for (const key of targetKeys) {
//                         cp[key] = ObjectHelper.deepCopy((target as { [key: string]: any })[key])
//                     }
//                 }
//                 return cp as T
//             }
//         }
//         // Means that object is atomic
//         return target
//     }
// }