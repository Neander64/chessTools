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
    compare(date: PgnDate): number {
        // This field is sorted by ascending numeric value
        // first with the year, then the month, and finally the day of the month.
        // Query characters used for unknown date digit values will be treated as zero digit characters for ordering comparison.
        // <0 : this < date
        // >0 : this > date
        // 0 : this = date
        let y1 = this.year || 0
        let y2 = date.year || 0
        if (y1 != y2) return (y1 - y2)
        let m1 = this.month || 0
        let m2 = date.month || 0
        if (m1 != m2) return (m1 - m2)
        let d1 = this.day || 0
        let d2 = date.day || 0
        return (d1 - d2)
    }
}
