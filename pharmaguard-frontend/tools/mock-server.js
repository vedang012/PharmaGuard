import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = 5174;

app.use(cors());
app.use(express.json());

// Load sample response
const samplePath = join(__dirname, '..', 'src', 'mocks', 'sample_response.json');
const sampleResponse = JSON.parse(readFileSync(samplePath, 'utf-8'));

app.post('/analyze', upload.single('file'), (req, res) => {
    console.log(`[mock-server] POST /analyze — file: ${req.file?.originalname}, drug: ${req.body?.drug}`);

    // Simulate processing delay
    setTimeout(() => {
        res.json(sampleResponse);
    }, 800);
});

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', server: 'pharmaguard-mock', port: PORT });
});

app.listen(PORT, () => {
    console.log(`\n  🧬 PharmaGuard Mock Server running at http://localhost:${PORT}\n`);
});
