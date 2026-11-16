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

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  requestCounter += 1;
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/hello', (req, res) => {
  res.type('text/plain').send("Hello from Khaldoun's server!");
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send('User-agent: *\nDisallow: /api/admin');
});

app.get('/old-page', (req, res) => {
  res.redirect('/hello');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});