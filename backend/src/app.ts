import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import productsRoutes from './routes/products.routes.js';
import sparesRoutes from './routes/spares.routes.js';
import contentRoutes from './routes/content.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import ordersRoutes from './routes/orders.routes.js';

const app = express();

// Middlewares - Robust CORS supporting all origins, headers & credentials
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or any web origin
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  })
);

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'SM Incubators Backend API', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/spares', sparesRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', ordersRoutes);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

export default app;
