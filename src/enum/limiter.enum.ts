export enum TimeLimit {
    SECOND = 1,
    MINUTE = 60,
    HOUR = 60 * 60, // 3600
    DAY = 60 * 60 * 24, // 86,400
    WEEK = 60 * 60 * 24 * 7, // 604800
    MONTH = 60 * 60 * 24 * 30, // 18144000
    YEAR = 60 * 60 * 24 * 365, // 6622560000
}

export enum Limit {
    NORMAL = 10,
    PREMIUM = 100,
    ADMIN = 1000,
    BURSTY = 20,
    STRICT = 5,
}
