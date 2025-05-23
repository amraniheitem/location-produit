const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const categoryRoutes = require('./routing/CateRoute');
const productRoutes = require('./routing/ProduitRoute');
const authRoutes = require('./routing/authRoute');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);
app.use('/auth', authRoutes);

// 👉 Cette ligne permet d'accéder aux fichiers dans "uploads"
app.use('/uploads', express.static('uploads'));

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
