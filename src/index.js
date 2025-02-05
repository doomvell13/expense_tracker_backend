import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import categoryRoutes from './routes/category.routes.js';
import tagRoutes from './routes/tag.routes.js';

const app = express();

// Add cors before other middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(express.json());
dotenv.config();

console.log('JWT_SECRET:', process.env.JWT_SECRET);



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);


// Test endpoint
app.get('/test', (req, res) => {
    res.json({ message: 'Express server is working!' });
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/expense_tracker')
    .then(() => {
        console.log('Successfully connected to MongoDB.');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});