/**
 * Zero-dependency ANSI terminal colors and formatting
 */

const isColorSupported =
  !process.env.NO_COLOR &&
  (process.env.FORCE_COLOR || process.platform === "win32" || (process.stdout.isTTY && process.env.TERM !== "dumb"));

export const color = {
  reset: (text: string) => (isColorSupported ? `\x1b[0m${text}\x1b[0m` : text),
  bold: (text: string) => (isColorSupported ? `\x1b[1m${text}\x1b[22m` : text),
  dim: (text: string) => (isColorSupported ? `\x1b[2m${text}\x1b[22m` : text),
  green: (text: string) => (isColorSupported ? `\x1b[32m${text}\x1b[39m` : text),
  cyan: (text: string) => (isColorSupported ? `\x1b[36m${text}\x1b[39m` : text),
  yellow: (text: string) => (isColorSupported ? `\x1b[33m${text}\x1b[39m` : text),
  red: (text: string) => (isColorSupported ? `\x1b[31m${text}\x1b[39m` : text),
  magenta: (text: string) => (isColorSupported ? `\x1b[35m${text}\x1b[39m` : text),
  gray: (text: string) => (isColorSupported ? `\x1b[90m${text}\x1b[39m` : text),
};

export function printBanner(): void {
  console.log("");
  console.log(color.cyan("  ╭────────────────────────────────────────────────────────╮"));
  console.log(color.cyan("  │                                                        │"));
  console.log(color.cyan("  │   ") + color.bold(color.yellow("⚡ create-zcash-app")) + color.cyan("                                  │"));
  console.log(color.cyan("  │   ") + color.dim("Zero-Config Zcash Shielded Web Application           ") + color.cyan("│"));
  console.log(color.cyan("  │                                                        │"));
  console.log(color.cyan("  ╰────────────────────────────────────────────────────────╯"));
  console.log("");
}
