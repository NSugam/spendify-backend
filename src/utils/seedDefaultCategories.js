const defaultCategories = require('../constants/defaultCategories');

const seedDefaultCategories = () => {
    return defaultCategories.map((category) => ({
        ...category,
        isActive: true
    }));
};

module.exports = seedDefaultCategories;