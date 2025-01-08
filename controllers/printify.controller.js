import axios from 'axios';
import { PRINTIFY_API_KEY, PRINTIFY_SHOP_ID } from '../config/config.js';

const printifyAPI = axios.create({
    baseURL: 'https://api.printify.com/v1',
    headers: {
        'Authorization': `Bearer ${PRINTIFY_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Type': 'multipart/form-data',
    },
});

// Get shops
export async function getShops(req, res) {
    try {
        const response = await printifyAPI.get('/shops.json');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get catalog (blueprints)
export async function getCatalog(req, res) {
    try {
        const response = await printifyAPI.get('/catalog/blueprints.json');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Create a product
export async function createProduct(req, res) {
    try {
        console.log('Product data received:', req.body); // Log des données reçues
        const { data } = req.body;
        const shopId = PRINTIFY_SHOP_ID;
        const response = await printifyAPI.post(`/shops/${shopId}/products.json`, data, {"Content-Type": "application/json"});
        console.log('Printify API response:', response.data); // Log de la réponse si succès
        res.json(response.data);
    } catch (error) {
        console.error('Printify API error:', error.response?.data || error.message); // Log de l'erreur si échec
        res.status(500).json({ error: error.message });
    }
}

// Get products
export async function getProducts(req, res) {
    try {
        const shopId = PRINTIFY_SHOP_ID;
        const response = await printifyAPI.get(`/shops/${shopId}/products.json`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Delete a product
export async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const shopId = PRINTIFY_SHOP_ID;
        const response = await printifyAPI.delete(`/shops/${shopId}/products/${id}.json`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function duplicateProduct(req, res) {
    try {
        const { productId } = req.params; // ID du produit à dupliquer
        const shopId = PRINTIFY_SHOP_ID;

        console.log(`Duplication du produit ${productId} en cours...`);

        // Appel à l'API Printify pour dupliquer le produit
        const response = await printifyAPI.post(
            `/shops/${shopId}/products/${productId}/duplicates.json`
        );

        console.log('Produit dupliqué avec succès :', response.data);
        return res.status(200).json(response.data); // Réponse avec succès

    } catch (error) {
        console.error('Erreur lors de la duplication :', error.response?.data || error.message);

        // Gestion spécifique des erreurs pour éviter un crash
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data || error.message;

        return res.status(statusCode).json({ error: errorMessage });
    }
}
export async function updateProduct(req, res) {
    try {
        const { productId } = req.params; // ID du produit à modifier
        const shopId = PRINTIFY_SHOP_ID;
        const { title, description, tags, image } = req.body; // Données modifiées

        const updatedData = {
            title,
            description,
            tags,
            images: [{ src: image }], // URL de la nouvelle image
        };

        // Mise à jour via l'API Printify
        const response = await printifyAPI.put(
            `/shops/${shopId}/products/${productId}.json`,
            updatedData
        );

        res.json(response.data);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du produit :', error.response?.data || error.message);
        res.status(500).json({ error: error.message });
    }
}