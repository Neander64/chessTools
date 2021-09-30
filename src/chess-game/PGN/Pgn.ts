import { color, otherColor } from "../common/chess-color"
import { PgnDatabase } from "./PgnDatabase"
import { PgnError } from "./PgnError"
import { PgnGame } from "./PgnGame"
import { PgnMoveElement } from "./PgnMoveElement"
import { mapAnnotationToNAG } from "./PgnNAG"
import { PgnResult } from "./PgnResult"

type pgnParseData = {
    db: PgnDatabase
    game?: PgnGame
    isParsingTags: boolean
    currentMove?: PgnMoveElement
    parsingMultiLineComment: boolean
    variantTargetMoves: PgnMoveElement[]
    currentVariant?: PgnMoveElement
}
type pgnGenerateData = {
    noComments: boolean
    useNAG: boolean
    mainLineOnly: boolean

    activeColor: color
    moveNumber: number
    isFirstMoveAfterSomething: boolean
}

export class Pgn {
    static readonly ESCAPE = '%'
    static readonly SEMICOLON_COMMENT_CHAR = ';'
    static readonly UNKNOWN = '?'
    static readonly PGN_MAX_LINELEN = 79

    static save(pgn: PgnDatabase, options?: { noComments?: boolean, useNAG?: boolean, mainLineOnly?: boolean }): string[] {
        // 
        let _options = options || { noComments: false, useNAG: false, mainLineOnly: false }
        let result: string[] = []
        let firstGame = true
        let genData: pgnGenerateData = {
            noComments: _options.noComments || false,
            useNAG: _options.useNAG || false,
            mainLineOnly: _options.mainLineOnly || false,
            activeColor: color.white,
            moveNumber: 1,
            isFirstMoveAfterSomething: false,
        }
        for (const game of pgn.game) {
            if (!firstGame) {
                result.push('')
            } else {
                firstGame = false
            }
            result = result.concat(game.header.toStringArray())
            result.push('')

            if (game.header.FEN) {
                genData.activeColor = game.header.fen?.activeColor!
                genData.moveNumber = game.header.fen?.moveNumber!
            }
            else {
                genData.moveNumber = 1
                genData.activeColor = color.white
            }
            genData.isFirstMoveAfterSomething = true
            let lineStr = this.addMoveSeq(game.moves, genData).trim() + ' ' + game.header.Result.result
            result = result.concat(this.chopString(lineStr, this.PGN_MAX_LINELEN))
        }
        return result
    }
    private static addMoveSeq(seq: PgnMoveElement[], genData: pgnGenerateData): string {
        let result: string = ''
        let genDataSeq: pgnGenerateData = {
            noComments: genData.noComments,
            useNAG: genData.useNAG,
            mainLineOnly: genData.mainLineOnly,
            activeColor: genData.activeColor,
            moveNumber: genData.moveNumber,
            isFirstMoveAfterSomething: genData.isFirstMoveAfterSomething,
        }
        for (const move of seq) {
            genDataSeq.activeColor = genData.activeColor
            genDataSeq.moveNumber = genData.moveNumber //this.previousMoveNumber(genData.moveNumber, genData.activeColor)
            let moveToken = ''
            if (genData.activeColor == color.white) {
                moveToken += genData.moveNumber + '. ' // re-numbering, ignoring, what we have in our structure
            }
            else if (genData.isFirstMoveAfterSomething && genData.activeColor == color.black) {
                moveToken += genData.moveNumber + '... '
            }
            genData.moveNumber = this.nextMoveNumber(genData.moveNumber, genData.activeColor)
            genData.activeColor = otherColor(genData.activeColor)
            genData.isFirstMoveAfterSomething = false

            moveToken += move.move + ' '

            if (move.annotation) {
                for (const annotation of move.annotation)
                    moveToken += (genData.useNAG ? this.annotationToNAG(annotation, genDataSeq.activeColor) : annotation) + ' '
            }
            if (!genData.noComments && move.comment.length > 0) {
                moveToken += '{ '
                for (const comment of move.comment)
                    moveToken += comment.trim() + ' '
                moveToken = moveToken.trimEnd()
                moveToken += ' } '
                genData.isFirstMoveAfterSomething = true
            }
            result += moveToken

            if (!genData.mainLineOnly && move.variation.length > 0) {
                genDataSeq.isFirstMoveAfterSomething = true
                result += '( '
                result += this.addMoveSeq(move.variation, genDataSeq).trim()
                result += ' ) '
                genData.isFirstMoveAfterSomething = true
            }
        }
        return result
    }
    private static nextMoveNumber(currentMoveNumber: number, activeColor: color): number {
        if (activeColor == color.white)
            return currentMoveNumber
        else
            return currentMoveNumber + 1
    }
    // private static previousMoveNumber(currentMoveNumber: number, activeColor: color): number {
    //     if (activeColor == color.white)
    //         return currentMoveNumber - 1
    //     else
    //         return currentMoveNumber
    // }

    static chopString(str: string, maxLen: number, cutChar: string = ' '): string[] {
        // TODO move to a string module
        let result: string[] = []
        let tmpStr = str
        while (tmpStr.length > maxLen) {
            for (var i = maxLen; i >= 0; i--) {
                if (tmpStr[i] == cutChar) break
            }
            if (i == 0) i = maxLen // no cutChar found, cut hard
            result.push(tmpStr.substring(0, i))
            tmpStr = tmpStr.substring(i + 1)
        }
        if (tmpStr.length > 0) result.push(tmpStr)
        return result
    }
    static annotationToNAG(annotation: string, activeColor: color): string {
        if (!annotation.match(/^(\d{2,3})$/)) { // not a NAG already
            let m = mapAnnotationToNAG.find(e => e.annotation == annotation && (!e.activeColor || e.activeColor == activeColor))
            if (m) return m.nag
        }
        return annotation
    }

    static load(pgnData: string[]): PgnDatabase {
        // convert a given array of pgnData (like from a file) to a representation of pgn
        // TODO this could be turned into a version to handle data from a stream
        let parseData: pgnParseData = {
            db: new PgnDatabase(),
            game: undefined,
            isParsingTags: true,
            currentMove: undefined,
            parsingMultiLineComment: false,
            variantTargetMoves: [],
            currentVariant: undefined
        }
        for (let line of pgnData) {
            if (line.length == 0) continue
            if (line[0] == this.ESCAPE) continue
            if (parseData.isParsingTags) {
                // importing PGN is a bit relaxed, allowing whitespaces and multiple tags in a line
                // but I didn't implement allowing to spread a tag over multiple lines
                if (!parseData.game) parseData.game = new PgnGame()
                const headerMatches = Array.from(line.matchAll(/\[\s*(\w*)\s*\"(.*?)\"\s*\]/g))
                for (const m of headerMatches) {
                    parseData.game.header.addTag(m[1], m[2])
                }
                if (headerMatches.length == 0) {
                    parseData.isParsingTags = false
                }
            }
            if (!parseData.isParsingTags) { // parsing moves
                if (parseData.parsingMultiLineComment) {
                    const commentFinish = line.match(/(?<commentEnd>^.*?)\}(?<restBlock>.*$)/)
                    if (commentFinish?.groups) {
                        if (commentFinish.groups.commentEnd) {
                            if (commentFinish.groups.commentEnd.includes('{')) {
                                throw new PgnError('nested comments')
                            }
                            parseData.currentMove?.comment.push(commentFinish.groups.commentEnd)
                            parseData.parsingMultiLineComment = false
                            line = commentFinish.groups.restBlock // Parse rest of the line
                        }
                    }
                }
                if (!parseData.parsingMultiLineComment) {
                    let SemikolonComment = this.cutOffSemikolonComment(line)
                    if (SemikolonComment.comment) {
                        line = SemikolonComment.line
                    }
                    const commentSplit = Array.from(line.matchAll(/(?<seq>.*?)\{(?<comment>.*?)\}|(?<seq2>.*?)\{(?<commentStart>.*$)|(?<rest>.*$)/g))
                    for (const block of commentSplit) {
                        if (block.groups) {
                            if (block.groups.comment) {
                                if (block.groups.seq) {
                                    this.parseMoveSequence(block.groups.seq, parseData)
                                }
                                parseData.currentMove?.comment.push(block.groups.comment)
                            }
                            if (block.groups.commentStart) {
                                if (block.groups.seq2) {
                                    this.parseMoveSequence(block.groups.seq2, parseData)
                                }
                                parseData.currentMove?.comment.push(block.groups.commentStart)
                                parseData.parsingMultiLineComment = true
                            }
                            if (block.groups.rest) {
                                this.parseMoveSequence(block.groups.rest, parseData)
                            }
                        }
                    }
                    if (SemikolonComment.comment) {
                        parseData.currentMove?.comment.push(SemikolonComment.comment)
                    }
                }
            }
        }
        // TODO validate moves on board (optional)
        return parseData.db
    }
    private static cutOffSemikolonComment(line: string): { line: string, comment?: string } {
        let resultLine = line
        let resultComment = undefined

        let numberOfOpeningBraces = 0
        let numberOfClosingBraces = 0
        for (let i = 0; i < line.length; i++) {
            if (line[i] == '{') {
                numberOfOpeningBraces++
            }
            else if (line[i] == '}') {
                numberOfClosingBraces++
            }
            else if (line[i] == this.SEMICOLON_COMMENT_CHAR) {
                if (numberOfOpeningBraces == numberOfClosingBraces) {
                    resultLine = line.substring(0, i - 1)
                    resultComment = line.substring(i + 1)
                    break
                }
            }
        }
        return { line: resultLine, comment: resultComment }
    }
    private static parseMoveSequence(lineSegment: string, parseData: pgnParseData) {
        const moveTokens = lineSegment.split(/\s/)
        let moveNumber: number | undefined = undefined
        let closingVariantWithMove = false
        //console.log('tokens', moveTokens)
        for (let token of moveTokens) {
            if (token == '') continue
            let gameResult = PgnResult.checkResult(token)
            if (gameResult) {// is game terminator 
                //if (parseData.currentMove) parseData.game!.moves.push(parseData.currentMove)
                if (parseData.currentVariant) throw new PgnError('game terminated in variant')
                this.pushCurrentMove(parseData)
                if (parseData.game!.header.Result) parseData.game!.header.Result.result = gameResult // allow to read games without header
                if (parseData.game!.header.Result.result != gameResult) throw new PgnError('result after game differs from header (game:' + gameResult + ', header:' + parseData.game!.header.Result.result + ')')
                //parseData.game!.header.Result.result = gameResult
                parseData.db.game.push(parseData.game!)
                parseData.game = undefined
                parseData.isParsingTags = true
                parseData.currentMove = undefined
                token = ''
            }
            else if (this.isAnnotation(token)) {
                parseData.currentMove!.annotation.push(token)
                token = ''
            }
            else if (token[0] == '(') { // variant begins (allowing token to be part of the move)
                if (!parseData.currentMove) throw new PgnError('variant without move')
                this.pushCurrentMove(parseData)
                parseData.variantTargetMoves.push(parseData.currentMove)
                parseData.currentVariant = parseData.currentMove
                parseData.currentMove = undefined
                token = token.substring(1)
            }
            else if (token == ')') { // variant ends 
                if (parseData.currentMove) {
                    this.pushCurrentMove(parseData)
                }
                let tmp = parseData.variantTargetMoves.pop()
                if (!tmp) throw new PgnError('variant closing mismatch')
                this.popCurrentVariant(parseData)
                token = ''
                parseData.currentMove = undefined
            }
            else if (token[token.length - 1] == ')') { // variant ends (allowing token to be part of the move)
                token = token.substring(0, token.length - 1)
                closingVariantWithMove = true
            }
            else if (token.match(/^(\d{1,3})\.{1,3}$/)) { // Number as seperate token
                moveNumber = +token // store for the next move to be created
                token = ''
            }

            if (token.length > 0 && token != '') {
                this.pushCurrentMove(parseData)
                let numSplit = token.match(/^((?<number>\d{1,})\.{1,3})?(?<move>.*)/) // allow move number to be part of the move
                if (numSplit?.groups) {
                    if (numSplit?.groups.move) {
                        if (!this.validateMoveSyntax(numSplit.groups.move)) {
                            throw new PgnError('invalid move:' + numSplit.groups.move)
                        }
                        parseData.currentMove = new PgnMoveElement(numSplit.groups.move)
                    }
                    if (moveNumber) { // got a value from seperate number token
                        parseData.currentMove!.moveNumber = moveNumber
                        if (numSplit?.groups.move && numSplit?.groups.number) { // double number specification? (allow if not in strict mode)
                            throw new PgnError('doubled move numbers:' + numSplit.groups.move + ' and from token ' + moveNumber)
                        }
                        moveNumber = undefined
                    }
                    else if (numSplit?.groups.move && numSplit?.groups.number) { // <number>.<move>
                        parseData.currentMove!.moveNumber = +numSplit.groups.number
                    }
                    if (closingVariantWithMove) {
                        this.pushCurrentMove(parseData)
                        let tmp = parseData.variantTargetMoves.pop()
                        if (!tmp) throw new PgnError('variant closing mismatch')
                        this.popCurrentVariant(parseData)
                        parseData.currentMove = undefined
                        closingVariantWithMove = false
                    }
                }
                else
                    throw new PgnError('invalid move token:' + token)
            }
        }
    }
    private static pushCurrentMove(parseData: pgnParseData) {
        if (parseData.currentMove) {
            if (parseData.currentVariant) {
                parseData.currentVariant.variation.push(parseData.currentMove)
            }
            else {
                parseData.game!.moves.push(parseData.currentMove)
            }
        }
    }
    private static popCurrentVariant(parseData: pgnParseData) {
        if (parseData.variantTargetMoves.length == 0)
            parseData.currentVariant = undefined
        else {
            parseData.currentVariant = parseData.variantTargetMoves[parseData.variantTargetMoves.length - 1]
        }
    }
    static validateMoveSyntax(move: string): boolean {
        // syntactical validation of a move string
        return move.match(/^(\d{1,}.{1,3})?(O(-O){1,2}|[RNBQK]?[a-h]?[1-8]?[x]?[a-h][1-8](\=[RNBQ])?)[+#]?]?]?[!\?]?[!\?]?$/) != null
    }
    static isAnnotation(annotation: string): boolean {
        // identify any possible annotation value
        return annotation.match(/^(\$\d{2,3})|(==)|(\+\/=)|(=\/\+)|(=\/∞)|(<=>)|(~\/=)|(>=)|(<=)|[=⩲⩱±∓∞⨁⇆∆∇⌓→↑⟳@⨀○□]|(\+\/-)|(-\/\+)|(\+-)|(-\+)|(~~)|(\[\])|(\(\.\))|(\|\^)|(\->)|(\(\+\))|(\/\\)|(\\\/)|(RR)|(N)$/) != null
    }

}

/* // alternative piece codings
// TODO allow to determine language
// TODO allow to set a specific language


Language     Piece letters (pawn knight bishop rook queen king)
----------   --------------------------------------------------
Czech        P J S V D K
Danish       B S L T D K
Dutch        O P L T D K
English      P N B R Q K
Estonian     P R O V L K
Finnish      P R L T D K
French       P C F T D R
German       B S L T D K
Hungarian    G H F B V K
Icelandic    P R B H D K
Italian      P C A T D R
Norwegian    B S L T D K
Polish       P S G W H K
Portuguese   P C B T D R
Romanian     P C N T D R
Spanish      P C A T D R
Swedish      B S L T D K
 */
