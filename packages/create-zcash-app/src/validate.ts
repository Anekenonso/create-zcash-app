import fs from "fs";
import path from "path";

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const RESERVED_NAMES = new Set([
  "node_modules",
  "favicon.ico",
  "package.json",
  "package-lock.json",
  "dist",
  "build",
  "public",
  "src",
  "zcash",
]);

/**
 * Validates whether a project name conforms to npm package naming rules
 */
export function validateProjectName(name: string): ValidationResult {
  const trimmed = name.trim();

  if (!trimmed) {
    return { valid: false, error: "Project name cannot be empty." };
  }

  if (trimmed.length > 214) {
    return { valid: false, error: "Project name must be fewer than 214 characters." };
  }

  if (RESERVED_NAMES.has(trimmed.toLowerCase())) {
    return { valid: false, error: `"${trimmed}" is a reserved word and cannot be used as a project name.` };
  }

  if (trimmed.startsWith(".") || trimmed.startsWith("_")) {
    return { valid: false, error: "Project name cannot start with a period or underscore." };
  }

  // Regex matching npm package naming specifications
  const npmPackageRegex = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;
  if (!npmPackageRegex.test(trimmed)) {
    return {
      valid: false,
      error: "Project name can only contain lowercase letters, numbers, hyphens, and underscores.",
    };
  }

  return { valid: true };
}

/**
 * Validates whether the target directory is safe to write into
 */
export function validateTargetDirectory(targetPath: string): ValidationResult {
  const resolved = path.resolve(process.cwd(), targetPath);

  if (!fs.existsSync(resolved)) {
    return { valid: true };
  }

  const stat = fs.statSync(resolved);
  if (!stat.isDirectory()) {
    return { valid: false, error: `Target path "${targetPath}" exists and is not a directory.` };
  }

  const existingFiles = fs.readdirSync(resolved);
  const nonIgnored = existingFiles.filter((f) => f !== ".git" && f !== ".DS_Store");

  if (nonIgnored.length > 0) {
    return {
      valid: false,
      error: `Directory "${targetPath}" already exists and contains ${nonIgnored.length} files. Please specify an empty directory.`,
    };
  }

  return { valid: true };
}
