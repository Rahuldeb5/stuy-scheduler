export interface Period {
    name: string,
    startTime: string,
    duration: number
}

export interface Periods extends Array<Period> { }

export interface IndexArg {
    index: number
}
