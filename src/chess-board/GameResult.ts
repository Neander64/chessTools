
export const enum GameResult {
    white_wins = "1-0",
    black_wins = "0-1",
    draw = "1/2-1/2",
    none = "*"
}
export function gameResult(r: GameResult): string {
    return r.toString();
    /*    switch (r) {
            case GameResult.white_wins: return "1-0"
            case GameResult.black_wins: return "0-1"
            case GameResult.draw: return "1/2-1/2"
            case GameResult.none: return "*"
        }*/
}
