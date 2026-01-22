const esbuild = require("esbuild");
const path = require("path");

async function build() {
  try {
    await esbuild.build({
      entryPoints: [path.resolve(__dirname, "simulate.ts")],
      bundle: true,
      outfile: path.resolve(__dirname, "dist/index.js"),
      platform: "node",
      target: "es2015",
      format: "esm",
      tsconfig: path.resolve(__dirname, "tsconfig.json"),
      sourcemap: "inline",
    });
    console.log("Build successful");
  } catch (e) {
    console.error("Build failed", e);
    process.exit(1);
  }
}

build();
