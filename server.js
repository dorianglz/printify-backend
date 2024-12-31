import express from 'express';
import cors from 'cors';
import pkg from 'body-parser';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Importer ton routeur existant
import router from './routes/printify.js';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const { json, urlencoded } = pkg;

// Middleware pour parser les JSON et les URL encodées
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// **Répertoire d'uploads et persistance des listings**
const uploadDir = path.join('uploads');
const dataFile = path.join('data.json');

// Créer les répertoires nécessaires s'ils n'existent pas
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify([]));

// Chargement des listings existants
let listings = JSON.parse(fs.readFileSync(dataFile));

// **Multer : Configuration pour les uploads**
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir), // Répertoire des fichiers
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)), // Nom unique
});
const upload = multer({ storage });

// **Servir les fichiers statiques dans le dossier "uploads"**
app.use('/uploads', express.static(uploadDir));

// **Debug Middleware pour loguer les requêtes**
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// **Routes existantes avec ton routeur Printify**
app.use('/api/printify', router);

// **Nouvelle route pour l'upload de fichiers**
app.post('/api/upload', upload.array('files'), (req, res) => {
  const files = req.files;

  files.forEach((file) => {
    const newListing = {
      id: Date.now(),
      title: file.originalname,
      description: 'Description automatique',
      tags: ['art', 'poster', 'design'],
      url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
    };

    listings.push(newListing);
  });

  // Sauvegarder les listings dans le fichier JSON
  fs.writeFileSync(dataFile, JSON.stringify(listings, null, 2));
  res.json(listings); // Retourner les listings créés
});

// **Nouvelle route pour récupérer les listings**
app.get('/api/listings', (req, res) => {
  res.json(listings);
});

// **Debug Middleware pour loguer les réponses**
app.use((req, res, next) => {
  const send = res.send;
  res.send = function (body) {
    console.log(`[${new Date().toISOString()}] Response:`, body);
    return send.call(this, body);
  };
  next();
});

// **Route de santé pour vérifier le serveur**
app.get('/health', (req, res) => {
  console.log('Health check endpoint hit.');
  res.status(200).json({ message: 'Server is healthy!' });
});

// **Gestion des erreurs globales**
app.use((err, req, res, next) => {
  console.error('Erreur rencontrée:', err);
  res.status(500).json({ error: err.message });
});

// **Gestion des erreurs non attrapées**
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

// **Démarrage du serveur**
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});