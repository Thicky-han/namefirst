// Original upstream material remains under MIT; NameFirst profile additions
// are under LicenseRef-NameFirst-NC-Reciprocal-1.0 (2026-10-13).
// NameFirst additions: Copyright (c) 2026 NameFirst contributors.
// 2026-10-14: NameFirst profile also builds its original local memory worker.
// 2026-10-14: NameFirst profile adds original management page assets and script.
// 2026-10-14: NameFirst profile selects its approved original NF/arrow icons.
import fs from "node:fs/promises";
import path from "node:path";
import util from "node:util";

import * as dotenv from "dotenv";
import * as esbuild from "esbuild";
import fse from "fs-extra";
import { z } from "zod";

import pkg from "../package.json" with { type: "json" };
import { getManifest, type ManifestContext } from "../src/manifest.ts";
import { getNameFirstManifest } from "../src/namefirst-manifest.ts";

type Context = ManifestContext & {
  e2e: boolean;
  namefirst: boolean;
  srcDir: string;
  destDir: string;
  additionalLicensePaths: Record<string, string>;
};

async function getStaticAssets(context: Context): Promise<string[]> {
  const { browser, srcDir } = context;
  if (context.namefirst) {
    return [
      "icons/namefirst/icon-16.png",
      "icons/namefirst/icon-32.png",
      "icons/namefirst/icon-48.png",
      "icons/namefirst/icon-128.png",
      "pages/namefirst-popup.html",
      "pages/namefirst-manager.html",
    ];
  }
  return [
    ...(await Array.fromAsync(
      fs.glob("_locales/*/messages.json", { cwd: srcDir }),
    )),
    ...(browser === "safari"
      ? ["icons/template-icon-32.png"]
      : ["icons/icon-32.png"]),
    "icons/icon-48.png",
    "icons/icon-128.png",
    "pages/options.html",
    "pages/serpinfo-options.html",
    "pages/popup.html",
    ...(browser === "safari" ? ["scripts/import-content-script.js"] : []),
  ];
}

function getScripts(context: Context): string[] {
  if (context.namefirst) {
    return [
      "scripts/namefirst-content-script.ts",
      "scripts/namefirst-popup.ts",
      "scripts/namefirst-background.ts",
      "scripts/namefirst-manager.ts",
    ];
  }
  return [
    "scripts/background.ts",
    "scripts/options.ts",
    "scripts/content-script.ts",
    "scripts/serpinfo-options.ts",
    "scripts/popup.ts",
  ];
}

function getModules(context: Context): string[] {
  if (context.namefirst) {
    return [];
  }
  return ["scripts/block-dialog.ts"];
}

function getDefine(context: Context): Record<string, string> {
  const { browser, debug, e2e } = context;
  const vars = {
    NODE_ENV: debug ? "development" : "production",
    BROWSER: browser,
    DEBUG: debug ? "true" : "false",
    E2E: e2e ? "true" : "false",
    DROPBOX_APP_KEY:
      process.env.DROPBOX_APP_KEY ??
      process.env.DROPBOX_API_KEY ??
      "<DROPBOX_APP_KEY not set>",
    DROPBOX_APP_SECRET:
      process.env.DROPBOX_APP_SECRET ??
      process.env.DROPBOX_API_SECRET ??
      "<DROPBOX_APP_SECRET not set>",
    GOOGLE_DRIVE_CLIENT_ID:
      process.env.GOOGLE_DRIVE_CLIENT_ID ??
      process.env.GOOGLE_DRIVE_API_KEY ??
      "<GOOGLE_DRIVE_CLIENT_ID not set>",
    GOOGLE_DRIVE_CLIENT_SECRET:
      process.env.GOOGLE_DRIVE_CLIENT_SECRET ??
      process.env.GOOGLE_DRIVE_API_SECRET ??
      "<GOOGLE_DRIVE_CLIENT_SECRET not set>",
    ONEDRIVE_CLIENT_ID:
      process.env.ONEDRIVE_CLIENT_ID ?? "<ONEDRIVE_CLIENT_ID not set>",
  };
  return Object.fromEntries(
    Object.entries(vars).map(([key, value]) => [
      `process.env.${key}`,
      JSON.stringify(value),
    ]),
  );
}

async function buildStaticAssets(context: Context) {
  const { srcDir, destDir } = context;
  await Promise.all(
    (await getStaticAssets(context)).map((src) =>
      fse.copy(path.join(srcDir, src), path.join(destDir, src)),
    ),
  );
}

async function buildManifestJSON(context: Context) {
  const { destDir } = context;
  await fse.outputFile(
    path.join(destDir, "manifest.json"),
    `${JSON.stringify(context.namefirst ? getNameFirstManifest(context) : getManifest(context), null, 2)}\n`,
  );
}

async function runEsbuild(
  context: Context,
  entryPoints: readonly string[],
  format: "iife" | "esm",
): Promise<string[]> {
  const { debug, srcDir, destDir } = context;
  const { metafile } = await esbuild.build({
    bundle: true,
    define: getDefine(context),
    entryPoints: entryPoints.map((file) => path.join(srcDir, file)),
    format,
    jsx: "automatic",
    jsxDev: debug,
    loader: { ".svg": "text", ".yml": "text" },
    logLevel: "silent",
    metafile: true,
    outbase: srcDir,
    outdir: destDir,
    sourcemap: debug,
  });
  return Object.keys(metafile.inputs);
}

// Returns the input paths.
async function buildScripts(context: Context): Promise<string[]> {
  const [scriptInputs, moduleInputs] = await Promise.all([
    runEsbuild(context, getScripts(context), "iife"),
    context.namefirst
      ? Promise.resolve([])
      : runEsbuild(context, getModules(context), "esm"),
  ]);
  return [...scriptInputs, ...moduleInputs];
}

// From the esbuild input paths, collects the root directory of each bundled
// npm package, keyed by package name.
function collectBundledPackages(
  inputPaths: readonly string[],
): Record<string, string> {
  const packageDirs: Record<string, string> = {};
  for (const inputPath of inputPaths) {
    const segments = path.dirname(inputPath).split("/");
    const nodeModulesIndex = segments.lastIndexOf("node_modules");
    if (nodeModulesIndex === -1) {
      continue;
    }
    const scopeOrName = segments[nodeModulesIndex + 1];
    if (scopeOrName == null) {
      continue;
    }
    const hasScope = scopeOrName.startsWith("@");
    if (hasScope && segments[nodeModulesIndex + 2] == null) {
      continue;
    }
    const nameEnd = nodeModulesIndex + (hasScope ? 3 : 2);
    const name = segments.slice(nodeModulesIndex + 1, nameEnd).join("/");
    packageDirs[name] = segments.slice(0, nameEnd).join("/");
  }
  return packageDirs;
}

async function readLicense(
  name: string,
  dir: string,
  additionalLicensePaths: Readonly<Record<string, string>>,
): Promise<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const entry = entries.find(
    (entry) => entry.isFile() && /^licen[cs]e/i.test(entry.name),
  );
  const licensePath = entry
    ? path.join(dir, entry.name)
    : additionalLicensePaths[name];
  if (licensePath == null) {
    throw new Error(`No license file found for ${name}`);
  }
  return (await fs.readFile(licensePath, "utf-8")).trim();
}

async function buildThirdPartyNotices(
  context: Context,
  inputPaths: readonly string[],
): Promise<void> {
  const { destDir, additionalLicensePaths } = context;
  const packages = Object.entries(collectBundledPackages(inputPaths)).sort(
    ([a], [b]) => (a < b ? -1 : a > b ? 1 : 0),
  );
  const notices = await Promise.all(
    packages.map(async ([name, dir]) => {
      const license = await readLicense(name, dir, additionalLicensePaths);
      return `${name}\n\n${license}\n`;
    }),
  );
  await fse.outputFile(
    path.join(destDir, "third-party-notices.txt"),
    notices.join("\n\n"),
  );
}

async function main() {
  dotenv.config({ path: [".env.local", ".env"], quiet: true });
  const { values: args } = util.parseArgs({
    options: {
      browser: { type: "string", short: "b" },
      debug: { type: "boolean", short: "d" },
      e2e: { type: "boolean" },
      "no-key": { type: "boolean" },
      namefirst: { type: "boolean" },
    },
  });
  const {
    browser,
    debug,
    e2e,
    namefirst,
    "no-key": noKey,
  } = z
    .object({
      browser: z
        .enum(["chrome", "edge", "firefox", "safari"])
        .default("chrome"),
      debug: z.boolean().default(false),
      e2e: z.boolean().default(false),
      namefirst: z.boolean().default(false),
      "no-key": z.boolean().default(false),
    })
    .parse(args);
  const context = {
    browser,
    version: pkg.version,
    debug,
    e2e,
    namefirst,
    noKey,
    srcDir: "src",
    destDir: `dist/${browser}${namefirst ? "-namefirst" : ""}${debug ? "-debug" : ""}${e2e ? "-e2e" : ""}${noKey ? "-no-key" : ""}`,
    additionalLicensePaths: { "is-mobile": "third-party/is-mobile/LICENSE" },
  };
  if (namefirst) {
    const outputRoot = path.resolve("dist");
    const destination = path.resolve(context.destDir);
    if (
      !destination.startsWith(outputRoot + path.sep) ||
      !path.basename(destination).startsWith(`${browser}-namefirst`)
    ) {
      throw new Error(
        "NameFirst build output escaped its generated directory.",
      );
    }
    // Clear this verified generated target so removed icons/assets cannot leak
    // into later builds. The default upstream build profile is unchanged.
    await fse.emptyDir(destination);
  }
  await Promise.all([
    buildStaticAssets(context),
    buildManifestJSON(context),
    buildScripts(context).then((inputPaths) =>
      buildThirdPartyNotices(context, inputPaths),
    ),
  ]);
}

await main();
