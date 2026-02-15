const Category = require("../models/category.model");
const Product = require("../models/product.model");

// CREATE CATEGORY (Admin)
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Normalize name (avoid duplicate case issues)
    const normalizedName = name.trim().toLowerCase();

    const existingCategory = await Category.findOne({
      name: normalizedName,
    });

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      name: normalizedName,
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE CATEGORY (Admin)
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const normalizedName = name.trim().toLowerCase();

    const existingCategory = await Category.findOne({
      name: normalizedName,
    });

    if (existingCategory && existingCategory._id.toString() !== req.params.id) {
      return res.status(400).json({ message: "Category name already taken" });
    }

    category.name = normalizedName;
    await category.save();

    res.json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE CATEGORY (Admin)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Optional: prevent delete if products exist
    const productExists = await Product.findOne({
      category: req.params.id,
    });

    if (productExists) {
      return res.status(400).json({
        message:
          "Cannot delete category. Products are still associated with it.",
      });
    }

    await category.deleteOne();

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET CATEGORY
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      total: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
