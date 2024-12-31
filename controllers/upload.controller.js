import fs from 'fs';
import path from 'path';
import multer from 'multer';

// Répertoires et fichiers
const uploadDir = path.join('uploads');
const dataFile = path.join('data.json');

// Création des répertoires si besoin
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify([]));

// Charger les listings
let listings = JSON.parse(fs.readFileSync(dataFile));

// Configuration Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

export const uploadFiles = upload.array('files');

// Créer un listing
export const createListing = (req, res) => {
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

  fs.writeFileSync(dataFile, JSON.stringify(listings, null, 2));
  res.json(listings);
};

// Récupérer les listings
export const getListings = (req, res) => {
  res.json(listings);
};

// Mettre à jour un listing
export const updateListing = (req, res) => {
  const { id } = req.params;
  const { title, description, tags } = req.body;

  const listingIndex = listings.findIndex((listing) => listing.id === parseInt(id));
  if (listingIndex === -1) {
    return res.status(404).json({ error: 'Listing non trouvé' });
  }

  listings[listingIndex] = { ...listings[listingIndex], title, description, tags };
  fs.writeFileSync(dataFile, JSON.stringify(listings, null, 2));
  res.json(listings[listingIndex]);
};

// Supprimer un listing
export const deleteListing = (req, res) => {
  const { id } = req.params;

  const listingIndex = listings.findIndex((listing) => listing.id === parseInt(id));
  if (listingIndex === -1) {
    return res.status(404).json({ error: 'Listing non trouvé' });
  }

  const filePath = path.join(uploadDir, path.basename(listings[listingIndex].url));
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  listings.splice(listingIndex, 1);
  fs.writeFileSync(dataFile, JSON.stringify(listings, null, 2));
  res.json({ message: 'Listing supprimé avec succès' });
};