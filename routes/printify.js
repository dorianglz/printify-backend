import { Router } from 'express';
import {
    getShops,
    getCatalog,
    createProduct,
    getProducts,
    deleteProduct
} from '../controllers/printify.controller.js';

const router = Router();

// Routes
router.get('/shops', getShops);
router.get('/catalog', getCatalog);
router.post('/products', createProduct);
router.get('/products', getProducts);
router.delete('/products/:id', deleteProduct);

export default router;