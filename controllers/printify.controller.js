import { createReadStream, unlinkSync } from 'fs';
import { join } from 'path';
import axios from 'axios';
import { PRINTIFY_API_KEY, uploadDir } from '../config/config.js';

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
        //console.log('Product data received:', req.body); // Log des données reçues
        const { data } = req.body;
        const shopId = PRINTIFY_SHOP_ID;
        const response = await printifyAPI.post(`/shops/${shopId}/products.json`, data);
        //console.log('Printify API response:', response.data); // Log de la réponse si succès
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


// Upload controller
export async function uploadToPrintify(req, res) {
    try {
    // Check if file exists
    if (!req.file) {
        return res.status(400).json({ error: 'File is required' });
      }
  
      // Get the file path
    //   const filePath = path.resolve(req.file.path);
  
    //   // Read the file and convert to Base64
    //   const fileBuffer = fs.readFileSync(filePath);
    //   const base64Encoded = fileBuffer.toString('base64');
  

      // Example: Send the Base64 data using axios
      const response = await printifyAPI.post('/uploads/image.json', {
        "contens": req.body.content, // Send the Base64 data
        "file_name": req.body.name, // Include original file name if needed
        // fileType: req.file.mimetype, // Include MIME type if needed
      });
  
      // Delete the temporary uploaded file
      fs.unlinkSync(filePath);
  
      // Return the response from the external API
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
}