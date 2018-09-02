import * as fs from 'mz/fs';
import * as path from 'path';
import { promisify } from 'util';

const copyFile = promisify(fs.copyFile);
async function main() {
  const assetsDir = path.resolve(__dirname, '..', 'src', 'assets');
  const files = await fs.readdir(assetsDir);
  const distDir = path.resolve(__dirname, '..', 'dist');

  for (const file of files) {
    const stat = await fs.stat(path.resolve(assetsDir, file));
    const toCopy = []
    if (stat.isFile()) {
      toCopy.push(file);
    }
    await Promise.all(toCopy.map(file => copyFile(path.resolve(assetsDir, file), path.resolve(distDir, file)))).catch(console.error);
  }
}

main().catch(console.error);
