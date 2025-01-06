import { Router } from 'express';
import {
    getShops,
    getCatalog,
    createProduct,
    getProducts,
    deleteProduct,
    duplicateProduct,
    updateProduct
} from '../controllers/printify.controller.js';

const router = Router();

// Routes
router.get('/shops', getShops);
router.get('/catalog', getCatalog);
router.post('/products', createProduct);
router.get('/products', getProducts);
router.delete('/products/:id', deleteProduct);

router.post('/products/:productId/duplicate', duplicateProduct); // Dupliquer un produit
router.put('/products/:productId', updateProduct); // Modifier un produit existant

export default router;