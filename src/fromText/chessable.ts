import path from "path"
import * as os from "os"
import * as fs from "fs"
import { ChessGame } from "../chess-game/ChessGame"
import { parseChessable } from "./parseChessable"

export class chessable {
    static readonly EXT = '.txt'
    static readonly DATA_PATH = 'data'


    static convertTxt2PGNRecursive(path_: string) {
        const dirPath = path.join(process.cwd(), path_)
        let fileList = this.readFilesRecursive(dirPath)
        for (const f of fileList) {
            this.convertTxt2PGN(f)
        }
    }
    private static convertTxt2PGN(file: string): boolean {
        const ext = path.extname(file)
        if (ext == '.txt') {
            console.log('processing ', file)
            // read source file
            const gameArray = fs.readFileSync(file).toString().split("\n")

            // convert to PGN
            const game = new ChessGame()
            const ps = new parseChessable(game)
            ps.scanGameText(gameArray)
            const pgnData = game.PGN

            // write PGN file
            const newFile = path.join(path.dirname(file), path.basename(file, '.txt') + '.pgn')
            console.log(' ==> ', pgnData.length, newFile)
            let pgnFile = fs.createWriteStream(newFile, { flags: 'w' });
            //pgnFile.on("open", () => { console.log('open') });
            //pgnFile.on("close", () => { console.log('close') });
            //pgnFile.on("ready", () => { console.log('ready') });
            //pgnFile.on("error", (err) => { console.log('error', err) });
            //pgnFile.on("finish", () => { console.log('finish') });
            (async () => {
                for (let line of pgnData) {
                    if (!pgnFile.write(line + os.EOL)) {
                        console.log("buffer full")
                        await new Promise(resolve => pgnFile.once('drain', resolve))
                    }
                }
            })();
            pgnFile.end()
            return true
        }
        return false
    }

    static generateEmptyTextFiles(path_: string, fileName: string, startIdx: number, endIdx: number) {
        // create empty Textfile per chapter for the variants
        // <path_>/00i <fileName> #i
        // usage:
        //  chessable.generateEmptyTextFiles(chessable.DATA_PATH + '/Sam I 1.d4 Sidelines/06 Modern Defense/orig', 'Modern Defense', 21, 42)
        const dirPath = path.join(process.cwd(), path_)
        for (let i = startIdx; i <= endIdx; i++) {
            let newFileName = path.join(dirPath, i.toString().padStart(3, '0') + ' ' + fileName + ' #' + i + this.EXT)
            //console.log('touching: "' + fname + '"')
            this.touchFile(newFileName)
        }
    }

    // ------ could be moved to a file handling util class -----
    static readFilesRecursive(dir: string): string[] {
        let result: string[] = []
        const dirEntries = fs.readdirSync(dir)
        for (const f of dirEntries) {
            const name = path.join(dir, f)
            const isDirectory = fs.statSync(name).isDirectory()
            if (isDirectory) result = result.concat(this.readFilesRecursive(name))
            else result.push(name)
        }
        return result
    }

    static touchFile(fileName: string) { // no directories created
        const time = new Date()
        try {
            fs.utimesSync(fileName, time, time)
        }
        catch (err) {
            fs.closeSync(fs.openSync(fileName, 'w'))
        }
    }
}


