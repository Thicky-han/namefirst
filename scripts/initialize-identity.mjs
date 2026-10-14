import { generateKeyPairSync } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const configDirectory = fileURLToPath(new URL("../config/", import.meta.url));
const destination = fileURLToPath(new URL("../config/extension-identity.json", import.meta.url));

if (existsSync(destination)) {
  throw new Error("Identity already exists; refusing to replace it.");
}

// The manifest needs only a public key. The private key is not saved.
const { publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
mkdirSync(configDirectory, { recursive: true });
writeFileSync(
  destination,
  `${JSON.stringify(
    {
      name: "NameFirst",
      version: "0.0.0",
      manifestKey: publicKey.export({ type: "spki", format: "der" }).toString("base64"),
    },
    null,
    2,
  )}\n`,
  { flag: "wx" },
);
console.log("Created a stable, independent development extension identity.");
