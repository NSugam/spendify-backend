const responseManager = require('../utils/responseManager');
const AppError = require('../utils/AppError');

const getCategories = async (req, res) => {
    const { type } = req.query;

    let categories = req.user.categories.filter((category) => category.isActive);
    if (type) { categories = categories.filter((category) => category.type === type); }

    categories.sort((a, b) => {
        if (a.type !== b.type) return a.type.localeCompare(b.type);
        return a.label.localeCompare(b.label);
    });

    return responseManager.success(res, 200, 'Categories fetched successfully', { categories });
};

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { type, value } = req.body;

    const category = req.user.categories.id(id);
    if (!category) throw new AppError('Category not found', 404)

    const updatedType = type || category.type;
    const updatedValue = value || category.value;

    const existingCategory = req.user.categories.find(
        (item) =>
            item._id.toString() !== id &&
            item.type === updatedType &&
            item.value === updatedValue
    );

    if (existingCategory) throw new AppError('Category already exists', 409);

    Object.assign(category, req.body);

    await req.user.save();

    return responseManager.success(
        res,
        200,
        'Category updated successfully',
        { category }
    );
};

const createCategory = async (req, res) => {
    const { label, value, icon, type } = req.body;

    const existingCategory = req.user.categories.find((category) => category.value === value && category.type === type);
    if (existingCategory) throw new AppError('Category already exists', 409);

    req.user.categories.push({ label, value, icon, type });
    await req.user.save();

    const category = req.user.categories[req.user.categories.length - 1];
    return responseManager.success(res, 201, 'Category created successfully', { category });
};

module.exports = {
    createCategory,
    getCategories,
    updateCategory
};