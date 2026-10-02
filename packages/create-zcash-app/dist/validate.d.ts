export interface ValidationResult {
    valid: boolean;
    error?: string;
}
/**
 * Validates whether a project name conforms to npm package naming rules
 */
export declare function validateProjectName(name: string): ValidationResult;
/**
 * Validates whether the target directory is safe to write into
 */
export declare function validateTargetDirectory(targetPath: string): ValidationResult;
//# sourceMappingURL=validate.d.ts.map