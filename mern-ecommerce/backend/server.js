require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const productRoutes = require('./routes/products');
const reviewRoutes = require('./routes/reviews');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
