
export class PgnError extends Error {
    constructor(message: any) {
        super(message)
        this.name = "PgnError"
    }
}
