import express from 'express';
import cors from 'cors';
import pkg from 'body-parser';
import path from 'path'; // Import pour gérer les chemins

// Import routes
import router from './routes/printify.js';

const app = express();
const { json, urlencoded } = pkg;

// Debug Middleware for Logging Requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Middleware
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Servir les fichiers statiques dans le dossier "uploads"
const uploadsPath = path.join("./uploads");
app.use('/uploads', express.static(uploadsPath));

// Test Endpoint to Ensure the Server Works
app.get('/health', (req, res) => {
  console.log('Health check endpoint hit.');
  res.status(200).json({ message: 'Server is healthy!' });
});

// Debug Middleware for Logging Responses
app.use((req, res, next) => {
  const send = res.send;
  res.send = function (body) {
    console.log(`[${new Date().toISOString()}] Response:`, body);
    return send.call(this, body);
  };
  next();
});

// Routes
app.use('/api/printify', router);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error encountered:', err);
  res.status(500).json({ error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Uncaught Exception Handler
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// Unhandled Rejection Handler
process