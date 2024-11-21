import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '../src');
const indexFilePath = path.join(rootDir, 'index.ts');

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if ((file.endsWith('.ts') || file.endsWith('.tsx')) && file !== 'index.ts') {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function makeExportPath(filePath: string): string {
  const relativePath = path.relative(rootDir, filePath);
  const cleanedPath = relativePath.replace(/\\/g, '/').replace(/\.(ts|tsx)$/, '');
  return `export * from './${cleanedPath}';`;
}

function generateIndexFile(): void {
  const allFiles = getAllFiles(rootDir);
  const exportStatements = allFiles.map(makeExportPath).join('\n');

  fs.writeFileSync(indexFilePath, exportStatements, 'utf-8');
  console.log(`Generated ${indexFilePath} with ${allFiles.length} exports.`);
}

generateIndexFile();
