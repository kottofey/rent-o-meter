const Reset = '\x1b[0m';
export const ColorBright = '\x1b[1m';
export const ColorDim = '\x1b[2m';

export const ColorFgBlack = '\x1b[30m';
export const ColorFgRed = '\x1b[31m';
export const ColorFgGreen = '\x1b[32m';
export const ColorFgBlue = '\x1b[34m';
export const ColorFgYellow = '\x1b[33m';
export const ColorFgMagenta = '\x1b[35m';
export const ColorFgCyan = '\x1b[36m';
export const ColorFgWhite = '\x1b[37m';
export const ColorFgGray = '\x1b[90m';

export const ColorBgBlack = '\x1b[40m';
export const ColorBgRed = '\x1b[41m';
export const ColorBgGreen = '\x1b[42m';
export const ColorBgBlue = '\x1b[44m';
export const ColorBgYellow = '\x1b[43m';
export const ColorBgMagenta = '\x1b[45m';
export const ColorBgCyan = '\x1b[46m';
export const ColorBgWhite = '\x1b[47m';
export const ColorBgGray = '\x1b[100m';

console.log(ColorBgGreen, ColorFgRed, 'DB purged', Reset);
