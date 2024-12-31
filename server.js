import express from 'express';
import cors from 'cors';
import pkg from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';

// Import des routes
import printifyRouter from './routes/printify.js';
import uploadRouter from './routes/upload.js';

dotenv.config();

const app = express();
const { json, urlencoded } = pkg;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(json({ limit: '100mb' }));
app.use(urlencoded({ extended: true, limit: '100mb' }));

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join('uploads')));

// Logger des requêtes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/printify', printifyRouter);
app.use('/api', uploadRouter);

// Route de santé
app.get('/health', (req, res) => res.status(200).json({ message: 'Server is healthy!' }));

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur rencontrée:', err);
  res.status(500).json({ error: err.message });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});