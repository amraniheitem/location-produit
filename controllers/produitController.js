const { Product } = require('../models/produit');
const { Category } = require('../models/category');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
        cb(uploadError, '/uploads/product'); 
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-'); 
        // const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage }).single('images')

const createProduct = async (req, res) => {
        try {
            console.log("print --> 1");
            let product = new Product({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured,
                images: req.file.filename
            });
    
            product = await product.save();
    
            if (!product) return res.status(500).send('The product cannot be created');
    
            res.send(product);
        } catch (error) {
            console.log("error",error)
        }
    // });
};

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured,
                images: req.file ? req.file.filename : undefined // si un nouveau fichier est envoyé
            },
            { new: true } // retourne le document mis à jour
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found for update' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
    }
};


// Obtenir tous les produits
const getProducts = async (req, res) => {
    const productList = await Product.find().populate('category');

    if (!productList) {
        res.status(500).json({ success: false });
    }
    res.send(productList);
};

// Obtenir un produit par ID
const getOneProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category'); // Populer la catégorie
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving product', error });
    }
};

const deleteProduct = async (req, res) => {
    try {
        console.log("Suppression du produit avec ID :", req.params.id);
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Erreur interne lors de la suppression :', error);
        res.status(500).json({ success: false, error: error.message });
    }
};





module.exports = {
    createProduct,
    getProducts,
    getOneProduct,
    updateProduct,
    deleteProduct
};
