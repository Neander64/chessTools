
export class parseResult {
    found?: boolean;
    shift?: number;
    token?: string;
    parsePos?: number;
}

export class lineParser {
    //ToDo we could provide static members to parse and scan

    private _parseLine: string = '';
    private _parsePos: number = 0;

    constructor(s: string) {
        this._parseLine = s;
        this._parsePos = 0;
    }

    get endOfString(): boolean {
        return (this._parsePos >= this._parseLine.length);
    }
    shiftPos(add: number) {
        return this._parsePos += add;
    }
    set parsePos(pos: number) {
        this._parsePos = pos;
    }
    get currentChar(): string {
        return this._parseLine[this._parsePos];
    }
    attachLine(s: string) {
        this._parseLine = s;
        this._parsePos = 0;
    }

    // some helper functions to perform the parsing
    restOfLine(shifting: boolean = true, startPos: number = -1): string {
        let parsePos = (startPos >= 0 ? startPos : this._parsePos);
        let s = this._parseLine.substring(parsePos);
        if (shifting) this._parsePos = this._parseLine.length;
        return s;
    }

    parsingChar(c: string, shifting: boolean = true, startPos: number = -1): parseResult {
        return this.parsingString(c[0], shifting, startPos);
    }

    parsingString(s: string, shifting: boolean = true, startPos: number = -1): parseResult {
        let result: parseResult = new parseResult();
        result.parsePos = (startPos >= 0 ? startPos : this._parsePos);
        result.found = (this._parseLine.substring(result.parsePos, result.parsePos + s.length) == s);
        if (result.found) {
            result.token = s;
            result.shift = s.length;
            result.parsePos += result.shift;
            if (shifting) this._parsePos = result.parsePos;
        }
        return result;
    }

    parsingCharSet(charSet: string, shifting: boolean = true, startPos: number = -1): parseResult {
        let result: parseResult = new parseResult();
        result.parsePos = (startPos >= 0 ? startPos : this._parsePos);
        let idx = charSet.indexOf(this._parseLine[result.parsePos]);
        result.found = (idx >= 0);
        if (result.found) {
            result.token = charSet[idx];
            result.shift = 1;
            result.parsePos++;
            if (shifting) this._parsePos = result.parsePos;
        }
        return result;
    }

    parsingInteger(shifting: boolean = true, startPos: number = -1): parseResult {
        const digits = '0123456789';
        return this.parsingFunc(s => (digits.indexOf(s[0]) >= 0), shifting, startPos);
        /*
        let result : parseResult = new parseResult();
        result.parsePos = (startPos >= 0 ? startPos : this._parsePos);
        let isNum = (digits.indexOf(this._parseLine[result.parsePos]) >= 0);
        result.found = isNum;
        result.shift = 0;
        do {
            result.token += this._parseLine[result.parsePos];
            result.shift++;
            result.parsePos++;
            if (shifting) this._parsePos++;
            isNum = (digits.indexOf(this._parseLine[result.parsePos]) >= 0);
        }
        while (isNum);

        return result;
        */
    }

    parsingFunc(evalChar: (s: string) => boolean, shifting: boolean = true, startPos: number = -1): parseResult {
        let result: parseResult = new parseResult();
        result.parsePos = (startPos >= 0 ? startPos : this._parsePos);
        let isValid = evalChar(this._parseLine.substring(result.parsePos));
        result.found = isValid;
        if (result.found) {
            result.token = "";
            result.shift = 0;
            do {
                result.token += this._parseLine[result.parsePos];
                result.shift++;
                result.parsePos++;
                if (shifting) this._parsePos = result.parsePos;
                //if (this.endOfString) break;
                if (this._parseLine.length - result.parsePos <= 0) break;
                isValid = evalChar(this._parseLine.substring(result.parsePos));
            }
            while (isValid);
        }
        return result;
    }

    parsingStopString(s: string, shifting: boolean = true, startPos: number = -1): parseResult {
        let result: parseResult = new parseResult();
        result.parsePos = (startPos >= 0 ? startPos : this._parsePos);
        let idx = this._parseLine.substring(result.parsePos).indexOf(s);
        result.found = (idx >= 0);
        if (result.found) {
            result.token = this._parseLine.substring(result.parsePos, result.parsePos + idx);
            result.shift = idx + s.length;
            result.parsePos += result.shift; // after Stop String
            if (shifting) this._parsePos = result.parsePos;
        }
        return result;
    }

}
