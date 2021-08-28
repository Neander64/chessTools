import { resolve } from 'path/posix';
import { lineParser, parseResult } from './lineParser';

describe('Testing lineParser Object', () => {
  test('Initial start pos should be 0', () => {
    const testString = "ABC";
    let p = new lineParser(testString);
    expect(p.shiftPos(0)).toBe(0);

    expect(p.restOfLine(false)).toBe(testString);
    expect(p.endOfString).toBe(false);
    expect(p.restOfLine(false,1)).toBe("BC");
    expect(p.endOfString).toBe(false);
    expect(p.restOfLine(true,1)).toBe("BC");
    expect(p.endOfString).toBe(true);
    expect(p.restOfLine(true,0)).toBe(testString);
    expect(p.endOfString).toBe(true);
  });
  test('Initial endOfString() returns false', () => {
    const testString = "ABC";
    let p = new lineParser(testString);
    expect(p.endOfString).toBe(false);
  });
  test('using shiftPos() to move to the end of the string', () => {
    const testString = "ABC";
    let p = new lineParser(testString);
    p.shiftPos(testString.length);
    expect(p.endOfString).toBe(true);
    expect(p.restOfLine()).toBe('');
  });
  test('set parsePos() to move into the beginning of the string', () => {
    const testString = "ABC";
    let p = new lineParser(testString);
    p.parsePos = 0;
    expect(p.endOfString).toBe(false);
  });
});

describe('Testing lineParser.parseChar()', () => {
    const testString = "ABC";
    let p = new lineParser(testString);

    test('testing to find/not find Char', () => {
            // next is 'A'
        let r = p.parsingChar('T');
        expect(r.found).toBe(false);

        r = p.parsingChar('A');
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 1,
  "shift": 1,
  "token": "A",
}
`);
        // next is 'B'
        r = p.parsingChar('A');
        expect(r.found).toBe(false);

        r = p.parsingChar('B');
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 2,
  "shift": 1,
  "token": "B",
}
`);

    });

    test('testing to find/not find Char (using shift, startpos)', () => {
        const testString = "01234567";
        p.attachLine(testString);

        // next is '0'
        // parse with shift to '1'
        expect(p.currentChar).toBe('0');
        let r = p.parsingChar('0', true ); // parse with shift.
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 1,
  "shift": 1,
  "token": "0",
}
`);

        // next is '1'
        expect(p.currentChar).toBe('1');
        r = p.parsingChar('T', false ); // not to be found
        expect(r.found).toBe(false);

        expect(p.currentChar).toBe('1');
        r = p.parsingChar('1', false ); // to be found
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 2,
  "shift": 1,
  "token": "1",
}
`);

        expect(p.currentChar).toBe('1'); // no shift, so it stays here
        r = p.parsingChar('0', false, 0 ); // peek at [0], to be found
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 1,
  "shift": 1,
  "token": "0",
}
`);
        expect(p.currentChar).toBe('1'); // no shift, so it stays here

        // look at pos 5:'5'
        r = p.parsingChar('A', false, 5); // peek and 5
        expect(r.found).toBe(false);
        expect(p.currentChar).toBe('1'); // no shift, so it stays here

        r = p.parsingChar('5', false ); // not setting  a position, gives start again
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": false,
  "parsePos": 1,
}
`);
        expect(p.currentChar).toBe('1'); // no shift, so it stays here
        r = p.parsingChar('5', true ); // not setting  a position, gives start again
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": false,
  "parsePos": 1,
}
`);
        expect(p.currentChar).toBe('1'); // no shift, so it stays here
        r = p.parsingChar('5', true, 5 ); // not setting  a position, gives start again
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 6,
  "shift": 1,
  "token": "5",
}
`);
        expect(p.currentChar).toBe('6'); // should be shifted here

    });


});


describe('Testing lineParser.parsingString()', () => {

    test('parse w/o differnt matches', () => {
        const testString = "0123456789ABCDEFG";
        let p = new lineParser(testString);
        expect(p.currentChar).toBe('0'); // start pos

        // no match
        let r = p.parsingString("xyz");
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": false,
  "parsePos": 0,
}
`);
        expect(p.currentChar).toBe('0'); // start pos

        // match
        r = p.parsingString("0123456789A");
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 11,
  "shift": 11,
  "token": "0123456789A",
}
`);
        expect(p.currentChar).toBe('B'); // next char

        // no match
        r = p.parsingString("xyz");
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": false,
  "parsePos": 11,
}
`);
        expect(p.currentChar).toBe('B'); // next char

        // match
        r = p.parsingString("BCD");
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 14,
  "shift": 3,
  "token": "BCD",
}
`);
        expect(p.currentChar).toBe('E'); // next char

        // no match
        r = p.parsingString("EFGHSDF");
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": false,
  "parsePos": 14,
}
`);
        expect(p.currentChar).toBe('E'); // next char

        // match, but not shifted with empty string
        r = p.parsingString("");
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 14,
  "shift": 0,
  "token": "",
}
`);
        expect(p.currentChar).toBe('E'); // next char

        // match to the end
        r = p.parsingString("EFG");
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 17,
  "shift": 3,
  "token": "EFG",
}
`);
        expect(p.endOfString).toBe(true);       // EOL
        expect(p.currentChar).toBeUndefined(); // undefined
        
    });
    test('parse w/o differnt matches (using shift, startpos)', () => {
        const testString = "0123456789ABCDEFG";
        let p = new lineParser(testString);
        expect(p.currentChar).toBe('0'); // start pos

        // no match
        let r = p.parsingString("ABC",false);
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": false,
  "parsePos": 0,
}
`);
        expect(p.currentChar).toBe('0'); // start pos

        // match, no shift
        r = p.parsingString("0123456789AB",false);
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 12,
  "shift": 12,
  "token": "0123456789AB",
}
`);
        expect(p.currentChar).toBe('0'); // start pos

        // match, no shift, peek
        r = p.parsingString("56789AB",false, 5);
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 12,
  "shift": 7,
  "token": "56789AB",
}
`);
        expect(p.currentChar).toBe('0'); // start pos

        // match with shift & pos
        r = p.parsingString("0123456789AB",true,0);
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 12,
  "shift": 12,
  "token": "0123456789AB",
}
`);
        expect(p.currentChar).toBe('C'); // shifted pos

        // no match at peek
        r = p.parsingString("CDEFG",true,0);
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": false,
  "parsePos": 0,
}
`);
        expect(p.currentChar).toBe('C'); // shifted pos

        // no match (with exceeding string)
        r = p.parsingString("CDEFGHJ",true);
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": false,
  "parsePos": 12,
}
`);
        expect(p.currentChar).toBe('C'); // start pos

        // match, no shift
        r = p.parsingString("CDEFG",false);
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 17,
  "shift": 5,
  "token": "CDEFG",
}
`);
        expect(p.currentChar).toBe('C'); // start pos

        // match, shift, EOL
        r = p.parsingString("CDEFG",true);
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 17,
  "shift": 5,
  "token": "CDEFG",
}
`);
        expect(p.endOfString).toBe(true);       // EOL
        expect(p.currentChar).toBeUndefined(); // undefined

        // match, no shift
        r = p.parsingString("ABC",false,10);
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 13,
  "shift": 3,
  "token": "ABC",
}
`);

        // match, shift
        r = p.parsingString("ABC",true,10);
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 13,
  "shift": 3,
  "token": "ABC",
}
`);
        expect(p.currentChar).toBe('D'); // start pos

    });
});

describe('Testing lineParser.charSet()', () => {

    test('parse charSet w/o differnt matches', () => {
        const testString = "0123456789AB";
        const testCharSet = "xyz0123456789";
        const testCharSet2 = "ABC";
        let p = new lineParser(testString);
        expect(p.currentChar).toBe('0');

        // no-match
        let r = p.parsingCharSet(testCharSet2);
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": false,
  "parsePos": 0,
}
`);
        expect(p.currentChar).toBe('0');

        // match
        r = p.parsingCharSet(testCharSet);
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 1,
  "shift": 1,
  "token": "0",
}
`);
        expect(p.currentChar).toBe('1');

        // re-position
        p.shiftPos(10);
        expect(p.currentChar).toBe('B');

        // no-match
        r = p.parsingCharSet(testCharSet);
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": false,
  "parsePos": 11,
}
`);
        expect(p.currentChar).toBe('B');

        // match
        r = p.parsingCharSet(testCharSet2);
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 12,
  "shift": 1,
  "token": "B",
}
`);
        expect(p.endOfString).toBe(true);       // EOL
        expect(p.currentChar).toBeUndefined(); // undefined
    });

    test('parse charSet w/o differnt matches (using shift, startpos)', () => {
        const testString = "0123456789AB";
        const testCharSet = "xyz0123456789";
        const testCharSet2 = "ABC";
        let p = new lineParser(testString);
        expect(p.currentChar).toBe('0');

        // no-match
        let r = p.parsingCharSet(testCharSet2, false);
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": false,
  "parsePos": 0,
}
`);
        expect(p.currentChar).toBe('0');
        
        // match
        r = p.parsingCharSet(testCharSet, false );
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 1,
  "shift": 1,
  "token": "0",
}
`);
        expect(p.currentChar).toBe('0');

        // no match with peek
        r = p.parsingCharSet(testCharSet, false, 10 );
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": false,
  "parsePos": 10,
}
`);
        expect(p.currentChar).toBe('0');

        // match with peek
        r = p.parsingCharSet(testCharSet2, false, 10 );
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 11,
  "shift": 1,
  "token": "A",
}
`);
        expect(p.currentChar).toBe('0');

        // match with peek and shift
        r = p.parsingCharSet(testCharSet2, true, 10 );
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 11,
  "shift": 1,
  "token": "A",
}
`);
        expect(p.currentChar).toBe('B');

    });

});

describe('Testing lineParser.parsingInteger()', () => {
    test('parse parsingInteger w/o differnt matches', () => {
        const testString = "0123456789AB";
        let p = new lineParser(testString);
        expect(p.currentChar).toBe('0');

        // get full number-string
        let r = p.parsingInteger();
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 10,
  "shift": 10,
  "token": "0123456789",
}
`);
        expect(p.currentChar).toBe('A');

        // no match
        r = p.parsingInteger();
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": false,
  "parsePos": 10,
}
`);
        expect(p.currentChar).toBe('A');

        // no shift, peek
        r = p.parsingInteger( false, 2 );
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 10,
  "shift": 8,
  "token": "23456789",
}
`);
        expect(p.currentChar).toBe('A');

        // shift
        r = p.parsingInteger( true, 2 );
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 10,
  "shift": 8,
  "token": "23456789",
}
`);
        expect(p.currentChar).toBe('A');

    });
});

describe('Testing lineParser.parsingInteger()', () => {

    test('parse parsingInteger w/o differnt matches', () => {

        const testString = "0123456789AB";
        let p = new lineParser(testString);
        expect(p.currentChar).toBe('0');

        // test function always true
        let truefct =  ( s : string ) : boolean => true;
        // test function always false
        let falsefct =  ( s : string ) : boolean => false;
        let somefct =  ( s : string ) : boolean => s.indexOf("234")  == 0;

        // no match 
        let r = p.parsingFunc( falsefct );
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": false,
  "parsePos": 0,
}
`);

        expect(p.currentChar).toBe('0');
        // match 
        r = p.parsingFunc( truefct );
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 12,
  "shift": 12,
  "token": "0123456789AB",
}
`);

        // match peeking
        r = p.parsingFunc( truefct, false, 10 );
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 12,
  "shift": 2,
  "token": "AB",
}
`);

        // match peeking
        r = p.parsingFunc( truefct, true, 10 );
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 12,
  "shift": 2,
  "token": "AB",
}
`);

        // no match
        r = p.parsingFunc( somefct, false, 1 );
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": false,
  "parsePos": 1,
}
`);

        // match peeking
        r = p.parsingFunc( somefct, false, 2 );
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 3,
  "shift": 1,
  "token": "2",
}
`);

        // match peeking
        r = p.parsingFunc( somefct, true, 2 );
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 3,
  "shift": 1,
  "token": "2",
}
`);
    });
});

describe('Testing lineParser.parsingStopString()', () => {

    test('parse parsingInteger w/o differnt matches', () => {

        const testString = "012.456789AB";
        let p = new lineParser(testString);
        expect(p.currentChar).toBe('0');

        let r = p.parsingStopString(".");
        expect(p.currentChar).toBe('4');
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 4,
  "shift": 4,
  "token": "012",
}
`);
        // not found
        r = p.parsingStopString(";");
        expect(p.currentChar).toBe('4');
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": false,
  "parsePos": 4,
}
`);

        // not found
        r = p.parsingStopString(".",false,1);
        //expect(p.currentChar).toBe('4');
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 4,
  "shift": 3,
  "token": "12",
}
`);

        // found
        r = p.parsingStopString(".",true,1);
        expect(p.currentChar).toBe('4');
        expect(r).toMatchInlineSnapshot(`
parseResult {
  "found": true,
  "parsePos": 4,
  "shift": 3,
  "token": "12",
}
`);

    });
    
});
