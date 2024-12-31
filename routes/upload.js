import { Router } from 'express';
import {
  uploadFiles,
  createListing,
  getListings,
  updateListing,
  deleteListing,
} from '../controllers/upload.controller.js';

const router = Router();

// Routes pour gérer les listings
router.post('/upload', uploadFiles, createListing);
router.get('/listings', getListings);
router.put('/listings/:id', updateListing);
router.delete('/listings/:id', deleteListing);

export default router;