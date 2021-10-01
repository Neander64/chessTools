export class StringUtil {
    static chopString(str: string, maxLen: number, cutChar: string = ' ', skipCutChar: boolean = true): string[] {
        let result: string[] = []
        let tmpStr = str
        while (tmpStr.length > maxLen) {
            let skipCut = skipCutChar
            let idx = tmpStr.lastIndexOf(cutChar, maxLen)
            if (idx <= 0) {  // no cutChar found, cut hard
                idx = maxLen
                skipCut = false
            }
            result.push(tmpStr.substring(0, idx))
            tmpStr = tmpStr.substring(skipCut ? idx + 1 : idx)
        }
        if (tmpStr.length > 0) result.push(tmpStr)
        return result
    }
}