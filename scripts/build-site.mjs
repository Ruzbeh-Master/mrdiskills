import { copyFile, mkdir, readFile, readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(root, 'dist');

if (!output.startsWith(`${root}${path.sep}`)) {
  throw new Error('Refusing to write the deployment build outside the project.');
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const rootFiles = await readdir(root, { withFileTypes: true });
const siteFiles = rootFiles
  .filter((entry) => entry.isFile() && (/\.(html|css|js)$/i.test(entry.name) || /^(robots\.txt|sitemap\.xml)$/i.test(entry.name)))
  .map((entry) => entry.name);

for (const file of siteFiles) {
  await copyFile(path.join(root, file), path.join(output, file));
}

const assetPattern = /assets\/[^"'`\s<>?&]+/g;
const assets = new Set();

for (const file of siteFiles) {
  const source = await readFile(path.join(root, file), 'utf8');
  for (const match of source.matchAll(assetPattern)) {
    let relativeAsset = match[0];
    try {
      relativeAsset = decodeURIComponent(relativeAsset);
    } catch {
      throw new Error(`Invalid encoded asset path in ${file}: ${match[0]}`);
    }
    assets.add(relativeAsset);
  }
}

for (const relativeAsset of assets) {
  const sourceAsset = path.resolve(root, relativeAsset);
  const outputAsset = path.resolve(output, relativeAsset);
  if (!sourceAsset.startsWith(`${root}${path.sep}`) || !outputAsset.startsWith(`${output}${path.sep}`)) {
    throw new Error(`Asset path escapes the website root: ${relativeAsset}`);
  }
  try {
    if (!(await stat(sourceAsset)).isFile()) throw new Error('not a file');
  } catch {
    throw new Error(`Referenced asset is missing: ${relativeAsset}`);
  }
  await mkdir(path.dirname(outputAsset), { recursive: true });
  await copyFile(sourceAsset, outputAsset);
}

console.log(`Prepared ${siteFiles.length} website files and ${assets.size} referenced assets in dist/.`);
