
export const enum color {
    black = 'Black',
    white = 'White',
}

export function otherColor(color_: color) {
    switch (color_) {
        case color.black: return color.white
        case color.white: return color.black;
    }
}

export function colorStr(color_: color) {
    return color_.toString()
}
