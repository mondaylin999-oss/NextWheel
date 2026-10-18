import { inventory } from './src/inventory.js';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: '12mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'AutoMatch AI API' }));
app.get('/api/cars', (req, res) => {
  for (const [key, max] of [['maxPrice', Infinity], ['minScore', 100]]) {
    if (req.query[key] !== undefined && (typeof req.query[key] !== 'string' || !req.query[key].trim() || !Number.isFinite(Number(req.query[key])) || Number(req.query[key]) < 0 || Number(req.query[key]) > max)) {
      return res.status(400).json({ error: key + ' must be a valid non-negative number' });
    }
  }
  let results = [...inventory];
  if (req.query.make) results = results.filter(car => car.make.toLowerCase() === String(req.query.make).toLowerCase());
  if (req.query.maxPrice) results = results.filter(car => car.price <= Number(req.query.maxPrice));
  if (req.query.minScore) results = results.filter(car => car.aiScore >= Number(req.query.minScore));
  res.json({ currency: 'MMK', count: results.length, data: results });
});
app.get('/api/cars/:id', (req, res) => {
  const car = inventory.find(item => item.id === Number(req.params.id));
  if (!car) return res.status(404).json({ error: 'Vehicle not found' });
  res.json({ ...car, currency: 'MMK' });
});
app.post('/api/listings', (req, res) => {
  const { year, make, model, mileage, price } = req.body || {};
  const numeric = value => (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '')) && Number.isFinite(Number(value));
  if (!numeric(year) || !Number.isInteger(Number(year)) || Number(year) < 1886 || Number(year) > new Date().getFullYear() + 1 ||
      typeof make !== 'string' || !make.trim() || make.length > 100 || typeof model !== 'string' || !model.trim() || model.length > 100 ||
      !numeric(mileage) || !Number.isInteger(Number(mileage)) || Number(mileage) < 0 ||
      (price !== undefined && price !== null && (!numeric(price) || Number(price) <= 0))) {
    return res.status(400).json({ error: 'Provide a valid year, make, model, non-negative whole-number mileage, and optional positive price' });
  }
  const listing = { currency: 'MMK', id: Date.now(), year: Number(year), make: make.trim(), model: model.trim(), mileage: Number(mileage), price: Number(price) || null, status: 'draft', createdAt: new Date().toISOString() };
  // Demo only: no persistence. Add auth, validation, storage, and moderation for production.
  res.status(201).json({ message: 'Draft created in demo mode', data: listing });
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'API endpoint not found' }));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
}
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({ error: status === 400 ? 'Invalid JSON request' : status === 413 ? 'Request body too large' : 'Internal server error' });
});
const port = process.env.PORT || 3001;
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  app.listen(port, () => console.log(`AutoMatch AI API listening on http://localhost:${port}`));
}
export default app;
