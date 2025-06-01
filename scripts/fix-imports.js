import fs from 'fs';
import path from 'path';

function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        content = content.replace(/from\s+['"]([^'"]+)\.js['"]/g, "from '$1'");
        content = content.replace(/import\s+['"]([^'"]+)\.js['"]/g, "import '$1'");

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Processado: ${filePath}`);
    } catch (error) {
        console.error(`❌ Erro ao processar ${filePath}:`, error.message);
    }
}

function processDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!['node_modules', 'dist', 'client', '.git'].includes(item)) {
                processDirectory(fullPath);
            }
        } else if (stat.isFile() && item.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

console.log('🔧 Removendo extensões .js dos imports para CommonJS...');
processDirectory('.');
console.log('✅ Concluído!');
