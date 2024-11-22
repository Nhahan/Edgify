/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../src');
const indexFilePath = path.join(rootDir, 'index.ts');

const prependImport = "import './index.css';\n";

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if ((file.endsWith('.ts') || file.endsWith('.tsx')) && file !== 'index.ts' && !file.endsWith('.d.ts')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function makeExportPath(filePath) {
  const relativePath = path.relative(rootDir, filePath);
  const cleanedPath = relativePath.replace(/\\/g, '/').replace(/\.(ts|tsx)$/, '');
  return `export * from './${cleanedPath}';`;
}

function generateIndexFile() {
  const allFiles = getAllFiles(rootDir);
  const exportStatements = allFiles.map(makeExportPath).join('\n');

  const content = `${prependImport}${exportStatements}\n`;

  fs.writeFileSync(indexFilePath, content, 'utf-8');
  console.log(`Generated ${indexFilePath} with ${allFiles.length} exports.`);
}

generateIndexFile();
