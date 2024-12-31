import { Router } from 'express';
import { getShops, getCatalog, createProduct, getProducts, deleteProduct, uploadToPrintify } from '../controllers/printify.controller.js';
import upload from '../middlewares/upload.js';

const router = Router();

// Routes
router.get('/shops', getShops);
router.get('/catalog', getCatalog);
router.post('/products', createProduct);
router.get('/products', getProducts);
router.delete('/products/:id', deleteProduct);

//router.post('/upload', upload.single('file'), uploadToPrintify);
router.post('/upload', uploadToPrintify);

export default router;