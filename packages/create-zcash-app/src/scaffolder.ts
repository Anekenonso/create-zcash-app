import fs from "fs";
import path from "path";
import { execSync } from "child_process";

export interface ScaffoldOptions {
  projectName: string;
  targetDir: string;
  templateName?: string;
  initGit?: boolean;
  installDeps?: boolean;
}

export interface ScaffoldResult {
  success: boolean;
  projectPath: string;
  templateUsed: string;
  error?: string;
}

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
export function resolveTemplateDir(templateName = "vite-react-ts"): string {
  const candidates = [
    // 1. Packaged distribution (inside packages/create-zcash-app/template)
    path.resolve(__dirname, "../template"),
    // 2. Monorepo sibling directory from compiled dist/
    path.resolve(__dirname, "../../templates", templateName),
    // 3. Monorepo sibling directory from src/
    path.resolve(__dirname, "../../../templates", templateName),
    // 4. Current working directory fallback
    path.resolve(process.cwd(), "templates", templateName),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.existsSync(path.join(candidate, "package.json"))) {
      return candidate;
    }
  }

  throw new Error(
    `Template "${templateName}" could not be located in any known candidate path: \n${candidates.join("\n")}`
  );
}

/**
 * Recursively copies a directory while filtering out build and dependency artifacts
 */
function copyDirectoryRecursive(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (EXCLUDED_PATTERNS.includes(entry.name)) {
      continue;
    }

    if (entry.isDirectory()) {
      copyDirectoryRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Scaffolds a new Zcash web application from the template
 */
export async function scaffoldProject(options: ScaffoldOptions): Promise<ScaffoldResult> {
  const templateName = options.templateName || "vite-react-ts";
  const resolvedTarget = path.resolve(process.cwd(), options.targetDir);

  try {
    const templateDir = resolveTemplateDir(templateName);

    // 1. Create target directory and copy template files
    copyDirectoryRecursive(templateDir, resolvedTarget);

    // 2. Patch package.json with custom project name
    const packageJsonPath = path.join(resolvedTarget, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const pkgContent = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      pkgContent.name = options.projectName;
      pkgContent.version = "0.1.0";
      fs.writeFileSync(packageJsonPath, JSON.stringify(pkgContent, null, 2) + "\n", "utf-8");
    }

    // 3. Ensure a comprehensive .gitignore exists in the new project
    const gitignorePath = path.join(resolvedTarget, ".gitignore");
    if (!fs.existsSync(gitignorePath)) {
      fs.writeFileSync(gitignorePath, DEFAULT_GITIGNORE, "utf-8");
    }

    // 4. Optionally initialize Git repository
    if (options.initGit) {
      try {
        execSync("git init", { cwd: resolvedTarget, stdio: "ignore" });
      } catch {
        // Git might not be installed or enabled in environment; non-fatal
      }
    }

    // 5. Optionally install dependencies
    if (options.installDeps) {
      const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
      execSync(`${npmCmd} install`, {
        cwd: resolvedTarget,
        stdio: "inherit",
      });
    }

    return {
      success: true,
      projectPath: resolvedTarget,
      templateUsed: templateName,
    };
  } catch (err: any) {
    return {
      success: false,
      projectPath: resolvedTarget,
      templateUsed: templateName,
      error: err?.message || String(err),
    };
  }
}
