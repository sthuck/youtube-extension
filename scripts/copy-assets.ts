import * as fs from 'mz/fs';
import * as path from 'path';
import {promisify} from 'util';

const copyFile = promisify(fs.copyFile);
const writeFile = promisify(fs.writeFile);
const readFile = (requestedPath: string): Promise<string> => new Promise((resolve, reject) =>
  fs.readFile(requestedPath, 'utf-8', (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  }));

const assetsDir = path.resolve(__dirname, '..', 'src', 'assets');
const distDir = path.resolve(__dirname, '..', 'dist');

const handleManifest = async () => {
  const manifestData = await readFile(path.resolve(assetsDir, 'manifest.json'));
  const manifest = JSON.parse(manifestData);
  if (process.env.Chrome_Ext_Key) {
    manifest.key = process.env.Chrome_Ext_Key;
  }
  await writeFile(path.resolve(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
}
async function main() {
  const files = await fs.readdir(assetsDir);


  const toCopy: string[] = []
  for (const fileName of files.filter(file => file !== 'manifest.json')) {
    const stat = await fs.stat(path.resolve(assetsDir, fileName));
    if (stat.isFile()) {
      toCopy.push(fileName);
    }
  }
  await Promise.all([
    ...toCopy.map(file =>
      copyFile(path.resolve(assetsDir, file), path.resolve(distDir, file))),
    handleManifest()
  ]).
    catch(console.error);

}

main().catch(console.error);
