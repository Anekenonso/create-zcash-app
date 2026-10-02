#!/usr/bin/env node

import path from "path";
import readline from "readline";
import { color, printBanner } from "./colors";
import { validateProjectName, validateTargetDirectory } from "./validate";
import { scaffoldProject } from "./scaffolder";

const PACKAGE_VERSION = "0.1.0";

interface ParsedArgs {
  projectName?: string;
  template: string;
  initGit: boolean;
  installDeps: boolean;
  dryRun: boolean;
  showHelp: boolean;
  showVersion: boolean;
}

function parseCliArgs(args: string[]): ParsedArgs {
  const result: ParsedArgs = {
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
    } else if (arg === "--version" || arg === "-v") {
      result.showVersion = true;
    } else if (arg === "--dry-run") {
      result.dryRun = true;
    } else if (arg === "--git") {
      result.initGit = true;
    } else if (arg === "--no-git") {
      result.initGit = false;
    } else if (arg === "--install") {
      result.installDeps = true;
    } else if (arg === "--no-install") {
      result.installDeps = false;
    } else if (arg === "--template" || arg === "-t") {
      if (args[i + 1] && !args[i + 1].startsWith("-")) {
        result.template = args[i + 1];
        i++;
      }
    } else if (!arg.startsWith("-") && !result.projectName) {
      result.projectName = arg;
    }
  }

  return result;
}

function printHelp(): void {
  printBanner();
  console.log(color.bold("Usage:"));
  console.log(`  ${color.cyan("npx create-zcash-app")} ${color.yellow("[project-name]")} [options]\n`);
  console.log(color.bold("Options:"));
  console.log(`  ${color.cyan("-t, --template <name>")}    Template to use (default: ${color.green("vite-react-ts")})`);
  console.log(`  ${color.cyan("--git / --no-git")}         Initialize git repository (default: ${color.green("true")})`);
  console.log(`  ${color.cyan("--install / --no-install")} Run npm install automatically (default: ${color.green("false")})`);
  console.log(`  ${color.cyan("--dry-run")}                Simulate scaffolding without writing files`);
  console.log(`  ${color.cyan("-v, --version")}            Display version number`);
  console.log(`  ${color.cyan("-h, --help")}               Display this help message\n`);
  console.log(color.bold("Examples:"));
  console.log(`  ${color.gray("$")} ${color.cyan("npx create-zcash-app my-shielded-app")}`);
  console.log(`  ${color.gray("$")} ${color.cyan("npx create-zcash-app my-app --install")}\n`);
}

async function promptUser(question: string, defaultValue = ""): Promise<string> {
  const rl = readline.createInterface({
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

export async function run(): Promise<void> {
  const args = parseCliArgs(process.argv.slice(2));

  if (args.showVersion) {
    console.log(`create-zcash-app v${PACKAGE_VERSION}`);
    return;
  }

  if (args.showHelp) {
    printHelp();
    return;
  }

  printBanner();

  let targetDir = args.projectName;

  // If no project name was provided on CLI, prompt interactively or fallback
  if (!targetDir) {
    if (process.stdin.isTTY) {
      targetDir = await promptUser(
        color.bold(color.cyan("? ")) + "Project name: " + color.gray("(zcash-shielded-app) "),
        "zcash-shielded-app"
      );
    } else {
      targetDir = "zcash-shielded-app";
    }
  }

  const projectName = path.basename(path.resolve(process.cwd(), targetDir));

  // 1. Validate project name
  const nameValidation = validateProjectName(projectName);
  if (!nameValidation.valid) {
    console.error(color.red(`\n✖ Invalid project name: ${nameValidation.error}`));
    process.exit(1);
  }

  // 2. Validate target directory
  const dirValidation = validateTargetDirectory(targetDir);
  if (!dirValidation.valid) {
    console.error(color.red(`\n✖ Invalid target directory: ${dirValidation.error}`));
    process.exit(1);
  }

  const fullTargetPath = path.resolve(process.cwd(), targetDir);

  if (args.dryRun) {
    console.log(color.yellow("⚡ DRY RUN: Validated configuration successfully."));
    console.log(`  Project Name:     ${color.bold(projectName)}`);
    console.log(`  Target Directory: ${color.bold(fullTargetPath)}`);
    console.log(`  Template:         ${color.bold(args.template)}`);
    console.log(`  Git Init:         ${args.initGit}`);
    console.log(`  Install Deps:     ${args.installDeps}`);
    return;
  }

  console.log(`Creating a new Zcash shielded web application in ${color.green(fullTargetPath)}...\n`);
  console.log(`  ${color.cyan("•")} Template: ${color.bold(args.template)}`);
  console.log(`  ${color.cyan("•")} Target:   ${color.bold(projectName)}`);

  const startTime = Date.now();

  const result = await scaffoldProject({
    projectName,
    targetDir,
    templateName: args.template,
    initGit: args.initGit,
    installDeps: args.installDeps,
  });

  if (!result.success) {
    console.error(color.red(`\n✖ Scaffolding failed: ${result.error}`));
    process.exit(1);
  }

  const durationMs = Date.now() - startTime;

  console.log(`\n${color.green("✔")} Scaffolding completed in ${color.bold(`${(durationMs / 1000).toFixed(2)}s`)}.`);
  console.log(`${color.green("✔")} Cross-Origin Isolation headers (COOP/COEP) configured for Vite, Vercel, Netlify, and Cloudflare Pages.`);
  console.log(`${color.green("✔")} Tip-anchored sync and Halo 2 WebAssembly proving ready.`);

  console.log(`\n${color.bold(color.green("🎉 Success!"))} Created ${color.bold(projectName)} at ${fullTargetPath}\n`);
  console.log("Inside that directory, you can run:\n");
  console.log(`  ${color.cyan("npm run dev")}`);
  console.log("    Starts the local development server with automated COOP/COEP headers.\n");
  console.log(`  ${color.cyan("npm run build")}`);
  console.log("    Bundles the app for production with Web Worker proving assets.\n");
  console.log(`  ${color.cyan("npm run typecheck")}`);
  console.log("    Runs strict TypeScript type checking against frozen Zcash contracts.\n");

  console.log(color.bold("To get started:\n"));
  console.log(`  ${color.yellow(`cd ${targetDir}`)}`);
  if (!args.installDeps) {
    console.log(`  ${color.yellow("npm install")}`);
  }
  console.log(`  ${color.yellow("npm run dev")}\n`);
}

if (require.main === module) {
  run().catch((err) => {
    console.error(color.red(`Unexpected fatal error: ${err?.message || err}`));
    process.exit(1);
  });
}
