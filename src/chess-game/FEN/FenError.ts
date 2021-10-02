export class FenError extends Error {
    constructor(message: any) {
        super(message)
        this.name = "FenError"
    }
}
