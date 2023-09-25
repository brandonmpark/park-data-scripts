/* eslint-disable no-console */
const colors = {
    reset: "\x1b[0m",
    fgRed: "\x1b[31m",
    fgGreen: "\x1b[32m",
    fgYellow: "\x1b[33m",
    fgBlue: "\x1b[34m",
    fgMagenta: "\x1b[35m",
    fgCyan: "\x1b[36m",
    fgWhite: "\x1b[37m",
    fgGray: "\x1b[90m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
    bgWhite: "\x1b[47m",
};

export const log = (message: string, { type = "p", date = false } = {}) => {
    if (date)
        console.log(colors.fgGray, new Date().toISOString(), colors.reset);

    switch (type) {
        case "h1":
            console.log(colors.fgMagenta, "=".repeat(message.length));
            console.log(message);
            console.log("=".repeat(message.length), colors.reset);
            break;
        case "h2":
            console.log(colors.fgCyan, "-".repeat(message.length));
            console.log(message);
            console.log("-".repeat(message.length), colors.reset);
            break;
        case "b":
            console.log(colors.fgYellow, message, colors.reset);
            break;
        case "p":
            console.log(message);
            break;
        default: 
            console.log(message);
            break;
    }
};

export const error = (...args: string[]) => {
    console.error(new Date().toISOString(), ...args);
};
