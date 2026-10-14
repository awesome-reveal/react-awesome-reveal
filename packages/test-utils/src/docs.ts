import { existsSync, readdirSync, readFileSync } from "node:fs";
import { relative } from "node:path";
import { fileURLToPath } from "node:url";

import ts from "typescript";

interface DocsOptions {
  /** The JSX options of the framework, if it uses JSX. */
  jsx?: Pick<ts.CompilerOptions, "jsx" | "jsxImportSource">;
  /** The check skips the fences that match, such as examples of another package or of a component file. */
  skipFences?: RegExp;
}

/** Checks the consumer skills in `<root>/skills` and the README against the built package types. */
export function describeDocs(root: URL, { jsx, skipFences }: DocsOptions = {}) {
  describe("docs", () => {
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

    it.each(skills)("gives the %s skill the frontmatter of the Agent Skills spec", (skill) => {
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
      // npmx.dev warns on a skill without `license` or `compatibility`.
      expect(fields.license).toBe(pkg.license);
      expect(fields.compatibility).toBeTruthy();
      expect(fields.compatibility!.length).toBeLessThanOrEqual(500);
    });

    it("type-checks the TypeScript examples against the package types", () => {
      const files = new Map<string, string>();
      const documents = [
        ...skills.map((skill) => ({ directory: `docs-check/${skill}`, text: skillText(skill) })),
        {
          directory: "docs-check/readme",
          text: readFileSync(new URL("README.md", root), "utf8"),
        },
      ];
      for (const { directory, text } of documents) {
        const fences = [...text.matchAll(/^```tsx?\r?\n([\s\S]*?)^```$/gm)]
          .map(([, code]) => code!)
          .filter((code) => !skipFences?.test(code));
        fences.forEach((code, index) =>
          files.set(fileURLToPath(new URL(`${directory}/example-${index + 1}.tsx`, root)), code),
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
        const file = diagnostic.file ? relative(fileURLToPath(root), diagnostic.file.fileName) : "";
        return `${file}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`;
      });

      expect(files.size).toBeGreaterThan(0);
      expect(errors).toEqual([]);
    }, 30_000);
  });
}
