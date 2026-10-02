"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTemplateDir = resolveTemplateDir;
exports.scaffoldProject = scaffoldProject;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const EXCLUDED_PATTERNS = [
    "node_modules",
    "dist",
    "build",
    "package-lock.json",
    ".turbo",
    ".DS_Store",
    "Thumbs.db",
];
const DEFAULT_GITIGNORE = `# Dependencies
node_modules/

# Production output
dist/
build/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*

# Editor & OS
.vscode/
.idea/
.DS_Store
Thumbs.db
`;
/**
 * Resolves the absolute path to the requested template directory
 */
function resolveTemplateDir(templateName = "vite-react-ts") {
    const candidates = [
        // 1. Packaged distribution (inside packages/create-zcash-app/template)
        path_1.default.resolve(__dirname, "../template"),
        // 2. Monorepo sibling directory from compiled dist/
        path_1.default.resolve(__dirname, "../../templates", templateName),
        // 3. Monorepo sibling directory from src/
        path_1.default.resolve(__dirname, "../../../templates", templateName),
        // 4. Current working directory fallback
        path_1.default.resolve(process.cwd(), "templates", templateName),
    ];
    for (const candidate of candidates) {
        if (fs_1.default.existsSync(candidate) && fs_1.default.existsSync(path_1.default.join(candidate, "package.json"))) {
            return candidate;
        }
    }
    throw new Error(`Template "${templateName}" could not be located in any known candidate path: \n${candidates.join("\n")}`);
}
/**
 * Recursively copies a directory while filtering out build and dependency artifacts
 */
function copyDirectoryRecursive(src, dest) {
    fs_1.default.mkdirSync(dest, { recursive: true });
    const entries = fs_1.default.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path_1.default.join(src, entry.name);
        const destPath = path_1.default.join(dest, entry.name);
        if (EXCLUDED_PATTERNS.includes(entry.name)) {
            continue;
        }
        if (entry.isDirectory()) {
            copyDirectoryRecursive(srcPath, destPath);
        }
        else {
            fs_1.default.copyFileSync(srcPath, destPath);
        }
    }
}
/**
 * Scaffolds a new Zcash web application from the template
 */
async function scaffoldProject(options) {
    const templateName = options.templateName || "vite-react-ts";
    const resolvedTarget = path_1.default.resolve(process.cwd(), options.targetDir);
    try {
        const templateDir = resolveTemplateDir(templateName);
        // 1. Create target directory and copy template files
        copyDirectoryRecursive(templateDir, resolvedTarget);
        // 2. Patch package.json with custom project name
        const packageJsonPath = path_1.default.join(resolvedTarget, "package.json");
        if (fs_1.default.existsSync(packageJsonPath)) {
            const pkgContent = JSON.parse(fs_1.default.readFileSync(packageJsonPath, "utf-8"));
            pkgContent.name = options.projectName;
            pkgContent.version = "0.1.0";
            fs_1.default.writeFileSync(packageJsonPath, JSON.stringify(pkgContent, null, 2) + "\n", "utf-8");
        }
        // 3. Ensure a comprehensive .gitignore exists in the new project
        const gitignorePath = path_1.default.join(resolvedTarget, ".gitignore");
        if (!fs_1.default.existsSync(gitignorePath)) {
            fs_1.default.writeFileSync(gitignorePath, DEFAULT_GITIGNORE, "utf-8");
        }
        // 4. Optionally initialize Git repository
        if (options.initGit) {
            try {
                (0, child_process_1.execSync)("git init", { cwd: resolvedTarget, stdio: "ignore" });
            }
            catch {
                // Git might not be installed or enabled in environment; non-fatal
            }
        }
        // 5. Optionally install dependencies
        if (options.installDeps) {
            const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
            (0, child_process_1.execSync)(`${npmCmd} install`, {
                cwd: resolvedTarget,
                stdio: "inherit",
            });
        }
        return {
            success: true,
            projectPath: resolvedTarget,
            templateUsed: templateName,
        };
    }
    catch (err) {
        return {
            success: false,
            projectPath: resolvedTarget,
            templateUsed: templateName,
            error: err?.message || String(err),
        };
    }
}
//# sourceMappingURL=scaffolder.js.map