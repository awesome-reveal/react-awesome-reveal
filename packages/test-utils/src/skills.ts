import { existsSync, readdirSync, readFileSync } from "node:fs";
import { relative } from "node:path";
import { fileURLToPath } from "node:url";

import ts from "typescript";

interface SkillsOptions {
  /** The package keyframes entry point, such as `@awesome-reveal/react/keyframes`. */
  keyframes: string;
  /** The keyframes factories that inline calls such as `` `slide()` `` can use. */
  factories: string[];
  /** The JSX options of the framework, if it uses JSX. */
  jsx?: Pick<ts.CompilerOptions, "jsx" | "jsxImportSource">;
  /** Fences that match are not type-checked, for example examples of another package. */
  skipFences?: RegExp;
}

/** Checks the consumer skills in `<root>/skills` against the built package types. */
export function describeSkills(
  root: URL,
  { keyframes, factories, jsx, skipFences }: SkillsOptions,
) {
  describe("skills", () => {
    const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
    const skillsDir = new URL("skills/", root);
    // A missing folder fails the first test below, not the whole file.
    const skills = existsSync(skillsDir)
      ? readdirSync(skillsDir, { withFileTypes: true })
          .filter((entry) => entry.isDirectory())
          .map((entry) => entry.name)
      : [];

    function skillText(skill: string): string {
      return readFileSync(new URL(`${skill}/SKILL.md`, skillsDir), "utf8");
    }

    it("ships the skills folder, where pnpm links skills from", () => {
      expect(skills.length).toBeGreaterThan(0);
      expect(pkg.files).toContain("skills");
    });

    it.each(skills)(
      "names the %s skill after its folder, as the Agent Skills spec requires",
      (skill) => {
        const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(skillText(skill))?.[1] ?? "";
        const fields: Record<string, string> = Object.fromEntries(
          frontmatter.split(/\r?\n/).flatMap((line) => {
            const field = /^([\w-]+):\s*(.*)$/.exec(line);
            return field ? [[field[1], field[2]]] : [];
          }),
        );

        expect(fields.name).toBe(skill);
        expect(fields.description).toBeTruthy();
        expect(fields.description!.length).toBeLessThanOrEqual(1024);
      },
    );

    it("type-checks the TypeScript examples and inline factory calls against the package types", () => {
      const inlineCall = new RegExp(`\`((?:${factories.join("|")})\\([^\`]*\\))\``, "g");
      const files = new Map<string, string>();
      for (const skill of skills) {
        const text = skillText(skill);
        const fences = [...text.matchAll(/^```tsx?\r?\n([\s\S]*?)^```$/gm)]
          .map(([, code]) => code!)
          .filter((code) => !skipFences?.test(code));
        const calls = [...text.matchAll(inlineCall)].map(([, call]) => call!);
        fences.forEach((code, index) =>
          files.set(fileURLToPath(new URL(`${skill}/example-${index + 1}.tsx`, skillsDir)), code),
        );
        files.set(
          fileURLToPath(new URL(`${skill}/factory-calls.ts`, skillsDir)),
          `import { ${factories.join(", ")} } from "${keyframes}";\n` +
            `export const calls = [${[...factories, ...calls].join(", ")}];\n`,
        );
      }

      const options: ts.CompilerOptions = {
        ...jsx,
        lib: ["lib.esnext.d.ts", "lib.dom.d.ts"],
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        noEmit: true,
        skipLibCheck: true,
        strict: true,
        target: ts.ScriptTarget.ESNext,
        types: [],
      };
      const host = ts.createCompilerHost(options);
      const { fileExists, readFile, getSourceFile } = host;
      host.fileExists = (file) => files.has(file) || fileExists(file);
      host.readFile = (file) => files.get(file) ?? readFile(file);
      host.getSourceFile = (file, language, ...rest) =>
        files.has(file)
          ? ts.createSourceFile(file, files.get(file)!, language)
          : getSourceFile(file, language, ...rest);

      const program = ts.createProgram([...files.keys()], options, host);
      const errors = ts.getPreEmitDiagnostics(program).map((diagnostic) => {
        const file = diagnostic.file
          ? relative(fileURLToPath(skillsDir), diagnostic.file.fileName)
          : "";
        return `${file}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`;
      });

      expect(files.size).toBeGreaterThan(skills.length);
      expect(errors).toEqual([]);
    }, 30_000);
  });
}
