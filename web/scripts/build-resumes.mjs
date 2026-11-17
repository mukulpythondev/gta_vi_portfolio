import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const variants = [
  "Mukul_Rana_Software_Engineer_Resume",
  "Mukul_Rana_GenAI_Engineer_Resume",
];
const output = fileURLToPath(new URL("../public/", import.meta.url));
for (const name of variants) {
  const source = fileURLToPath(new URL(`../../docs/resumes/${name}.tex`, import.meta.url));
  const result = spawnSync(process.env.TECTONIC_PATH ?? "tectonic", ["--outdir", output, source], {
    stdio: "inherit",
  });
  if (result.error) {
    throw new Error("Could not run Tectonic. Install it or set TECTONIC_PATH to its executable.", {
      cause: result.error,
    });
  }
  if (result.status !== 0) {
    throw new Error(`LaTeX compilation failed for ${name} (exit ${result.status}, signal ${result.signal}).`);
  }
  console.log(`Generated ${name}.pdf`);
}
