#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const path_1 = __importDefault(require("path"));
const readline_1 = __importDefault(require("readline"));
const colors_1 = require("./colors");
const validate_1 = require("./validate");
const scaffolder_1 = require("./scaffolder");
const PACKAGE_VERSION = "0.1.0";
function parseCliArgs(args) {
    const result = {
        template: "vite-react-ts",
        initGit: true,
        installDeps: false,
        dryRun: false,
        showHelp: false,
        showVersion: false,
    };
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === "--help" || arg === "-h") {
            result.showHelp = true;
        }
        else if (arg === "--version" || arg === "-v") {
            result.showVersion = true;
        }
        else if (arg === "--dry-run") {
            result.dryRun = true;
        }
        else if (arg === "--git") {
            result.initGit = true;
        }
        else if (arg === "--no-git") {
            result.initGit = false;
        }
        else if (arg === "--install") {
            result.installDeps = true;
        }
        else if (arg === "--no-install") {
            result.installDeps = false;
        }
        else if (arg === "--template" || arg === "-t") {
            if (args[i + 1] && !args[i + 1].startsWith("-")) {
                result.template = args[i + 1];
                i++;
            }
        }
        else if (!arg.startsWith("-") && !result.projectName) {
            result.projectName = arg;
        }
    }
    return result;
}
function printHelp() {
    (0, colors_1.printBanner)();
    console.log(colors_1.color.bold("Usage:"));
    console.log(`  ${colors_1.color.cyan("npx create-zcash-app")} ${colors_1.color.yellow("[project-name]")} [options]\n`);
    console.log(colors_1.color.bold("Options:"));
    console.log(`  ${colors_1.color.cyan("-t, --template <name>")}    Template to use (default: ${colors_1.color.green("vite-react-ts")})`);
    console.log(`  ${colors_1.color.cyan("--git / --no-git")}         Initialize git repository (default: ${colors_1.color.green("true")})`);
    console.log(`  ${colors_1.color.cyan("--install / --no-install")} Run npm install automatically (default: ${colors_1.color.green("false")})`);
    console.log(`  ${colors_1.color.cyan("--dry-run")}                Simulate scaffolding without writing files`);
    console.log(`  ${colors_1.color.cyan("-v, --version")}            Display version number`);
    console.log(`  ${colors_1.color.cyan("-h, --help")}               Display this help message\n`);
    console.log(colors_1.color.bold("Examples:"));
    console.log(`  ${colors_1.color.gray("$")} ${colors_1.color.cyan("npx create-zcash-app my-shielded-app")}`);
    console.log(`  ${colors_1.color.gray("$")} ${colors_1.color.cyan("npx create-zcash-app my-app --install")}\n`);
}
async function promptUser(question, defaultValue = "") {
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim() || defaultValue);
        });
    });
}
async function run() {
    const args = parseCliArgs(process.argv.slice(2));
    if (args.showVersion) {
        console.log(`create-zcash-app v${PACKAGE_VERSION}`);
        return;
    }
    if (args.showHelp) {
        printHelp();
        return;
    }
    (0, colors_1.printBanner)();
    let targetDir = args.projectName;
    // If no project name was provided on CLI, prompt interactively or fallback
    if (!targetDir) {
        if (process.stdin.isTTY) {
            targetDir = await promptUser(colors_1.color.bold(colors_1.color.cyan("? ")) + "Project name: " + colors_1.color.gray("(zcash-shielded-app) "), "zcash-shielded-app");
        }
        else {
            targetDir = "zcash-shielded-app";
        }
    }
    const projectName = path_1.default.basename(path_1.default.resolve(process.cwd(), targetDir));
    // 1. Validate project name
    const nameValidation = (0, validate_1.validateProjectName)(projectName);
    if (!nameValidation.valid) {
        console.error(colors_1.color.red(`\n✖ Invalid project name: ${nameValidation.error}`));
        process.exit(1);
    }
    // 2. Validate target directory
    const dirValidation = (0, validate_1.validateTargetDirectory)(targetDir);
    if (!dirValidation.valid) {
        console.error(colors_1.color.red(`\n✖ Invalid target directory: ${dirValidation.error}`));
        process.exit(1);
    }
    const fullTargetPath = path_1.default.resolve(process.cwd(), targetDir);
    if (args.dryRun) {
        console.log(colors_1.color.yellow("⚡ DRY RUN: Validated configuration successfully."));
        console.log(`  Project Name:     ${colors_1.color.bold(projectName)}`);
        console.log(`  Target Directory: ${colors_1.color.bold(fullTargetPath)}`);
        console.log(`  Template:         ${colors_1.color.bold(args.template)}`);
        console.log(`  Git Init:         ${args.initGit}`);
        console.log(`  Install Deps:     ${args.installDeps}`);
        return;
    }
    console.log(`Creating a new Zcash shielded web application in ${colors_1.color.green(fullTargetPath)}...\n`);
    console.log(`  ${colors_1.color.cyan("•")} Template: ${colors_1.color.bold(args.template)}`);
    console.log(`  ${colors_1.color.cyan("•")} Target:   ${colors_1.color.bold(projectName)}`);
    const startTime = Date.now();
    const result = await (0, scaffolder_1.scaffoldProject)({
        projectName,
        targetDir,
        templateName: args.template,
        initGit: args.initGit,
        installDeps: args.installDeps,
    });
    if (!result.success) {
        console.error(colors_1.color.red(`\n✖ Scaffolding failed: ${result.error}`));
        process.exit(1);
    }
    const durationMs = Date.now() - startTime;
    console.log(`\n${colors_1.color.green("✔")} Scaffolding completed in ${colors_1.color.bold(`${(durationMs / 1000).toFixed(2)}s`)}.`);
    console.log(`${colors_1.color.green("✔")} Cross-Origin Isolation headers (COOP/COEP) configured for Vite, Vercel, Netlify, and Cloudflare Pages.`);
    console.log(`${colors_1.color.green("✔")} Tip-anchored sync and Halo 2 WebAssembly proving ready.`);
    console.log(`\n${colors_1.color.bold(colors_1.color.green("🎉 Success!"))} Created ${colors_1.color.bold(projectName)} at ${fullTargetPath}\n`);
    console.log("Inside that directory, you can run:\n");
    console.log(`  ${colors_1.color.cyan("npm run dev")}`);
    console.log("    Starts the local development server with automated COOP/COEP headers.\n");
    console.log(`  ${colors_1.color.cyan("npm run build")}`);
    console.log("    Bundles the app for production with Web Worker proving assets.\n");
    console.log(`  ${colors_1.color.cyan("npm run typecheck")}`);
    console.log("    Runs strict TypeScript type checking against frozen Zcash contracts.\n");
    console.log(colors_1.color.bold("To get started:\n"));
    console.log(`  ${colors_1.color.yellow(`cd ${targetDir}`)}`);
    if (!args.installDeps) {
        console.log(`  ${colors_1.color.yellow("npm install")}`);
    }
    console.log(`  ${colors_1.color.yellow("npm run dev")}\n`);
}
if (require.main === module) {
    run().catch((err) => {
        console.error(colors_1.color.red(`Unexpected fatal error: ${err?.message || err}`));
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map