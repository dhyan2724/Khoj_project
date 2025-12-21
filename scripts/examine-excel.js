import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'bus routes.xlsx');
const wb = XLSX.readFile(filePath);

console.log('Sheets:', wb.SheetNames);
console.log('\n');

const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

console.log('Total rows:', data.length);
console.log('\nFirst 10 rows:');
console.log(JSON.stringify(data.slice(0, 10), null, 2));

