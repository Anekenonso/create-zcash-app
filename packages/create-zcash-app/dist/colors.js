"use strict";
/**
 * Zero-dependency ANSI terminal colors and formatting
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.color = void 0;
exports.printBanner = printBanner;
const isColorSupported = !process.env.NO_COLOR &&
    (process.env.FORCE_COLOR || process.platform === "win32" || (process.stdout.isTTY && process.env.TERM !== "dumb"));
exports.color = {
    reset: (text) => (isColorSupported ? `\x1b[0m${text}\x1b[0m` : text),
    bold: (text) => (isColorSupported ? `\x1b[1m${text}\x1b[22m` : text),
    dim: (text) => (isColorSupported ? `\x1b[2m${text}\x1b[22m` : text),
    green: (text) => (isColorSupported ? `\x1b[32m${text}\x1b[39m` : text),
    cyan: (text) => (isColorSupported ? `\x1b[36m${text}\x1b[39m` : text),
    yellow: (text) => (isColorSupported ? `\x1b[33m${text}\x1b[39m` : text),
    red: (text) => (isColorSupported ? `\x1b[31m${text}\x1b[39m` : text),
    magenta: (text) => (isColorSupported ? `\x1b[35m${text}\x1b[39m` : text),
    gray: (text) => (isColorSupported ? `\x1b[90m${text}\x1b[39m` : text),
};
function printBanner() {
    console.log("");
    console.log(exports.color.cyan("  ╭────────────────────────────────────────────────────────╮"));
    console.log(exports.color.cyan("  │                                                        │"));
    console.log(exports.color.cyan("  │   ") + exports.color.bold(exports.color.yellow("⚡ create-zcash-app")) + exports.color.cyan("                                  │"));
    console.log(exports.color.cyan("  │   ") + exports.color.dim("Zero-Config Zcash Shielded Web Application           ") + exports.color.cyan("│"));
    console.log(exports.color.cyan("  │                                                        │"));
    console.log(exports.color.cyan("  ╰────────────────────────────────────────────────────────╯"));
    console.log("");
}
//# sourceMappingURL=colors.js.map