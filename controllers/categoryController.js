const { Category } = require('../models/category');

const createCategory = async (req, res) => {
    let category = new Category({
        name: req.body.name
    });

    category = await category.save();

    if (!category)
        return res.status(400).send('The category cannot be created!');

    res.send(category);
};

const getCategories = async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        return res.status(500).json({ success: false });
    }
    res.status(200).send(categoryList);
};

const getOneCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving category', error });
    }
};


module.exports = {
    createCategory,
    getCategories,
    getOneCategory
};
