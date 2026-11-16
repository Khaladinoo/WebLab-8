import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COURSES = [
  { id: 1, title: 'Web Application Development', credits: 4 },
  { id: 2, title: 'Database Management Systems', credits: 3 },
  { id: 3, title: 'Operating Systems & Architecture', credits: 4 }
];

let requestCounter = 0;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});