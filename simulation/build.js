const esbuild = require("esbuild");
const path = require("path");

async function build() {
  try {
    await esbuild.build({
      entryPoints: {
        index: path.resolve(__dirname, "simulate.ts"),
        cli: path.resolve(__dirname, "cli.ts"),
      },
      bundle: true,
      outdir: path.resolve(__dirname, "dist"),
      entryNames: "[name]",
      platform: "node",
      target: "es2015",
      format: "cjs",
      tsconfig: path.resolve(__dirname, "tsconfig.simulation.json"),
      sourcemap: "inline",
    });
    console.log("Build successful");
  } catch (e) {
    console.error("Build failed", e);
    process.exit(1);
  }
}

build();
