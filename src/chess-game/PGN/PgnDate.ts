import { PgnError } from "./PgnError"

export class PgnDate {
    year?: number
    month?: number
    day?: number
    set(value: string) {
        this.clear()
        try {
            let values = value.split('.')
            if (values.length != 3)
                throw new PgnError('invalid Date')
            if (values[0] != '????') {
                let year = +values[0]
                if (isNaN(year) || year <= 0 || year > 9999)
                    throw new PgnError('invalid Date: Year')
                this.year = year
            }
            if (values[1] != '??') {
                let month = +values[1]
                if (isNaN(month) || month < 1 || month > 12)
                    throw new PgnError('invalid Date: Month')
                this.month = month
            }
            if (values[2] != '??') {
                let day = +values[2]
                if (isNaN(day) || day < 1 || day > 31)
                    throw new PgnError('invalid Date: Day')
                this.day = day
            }
        }
        catch (err) {
            this.clear()
            throw err
        }
    }
    get(): string {
        return (this.year ? ('' + this.year).padStart(4, '0') : '????') + '.' + (this.month ? ('' + this.month).padStart(2, '0') : '??') + '.' + (this.day ? ('' + this.day).padStart(2, '0') : '??')
    }
    clear() {
        this.year = undefined
        this.month = undefined
        this.day = undefined
    }
}
