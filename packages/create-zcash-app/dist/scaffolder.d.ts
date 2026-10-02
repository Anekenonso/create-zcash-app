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
/**
 * Resolves the absolute path to the requested template directory
 */
export declare function resolveTemplateDir(templateName?: string): string;
/**
 * Scaffolds a new Zcash web application from the template
 */
export declare function scaffoldProject(options: ScaffoldOptions): Promise<ScaffoldResult>;
//# sourceMappingURL=scaffolder.d.ts.map