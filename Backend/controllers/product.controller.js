const Product = require("../models/product.model");
const Category = require("../models/category.model");
const cloudinary = require("../config/cloudinary");
const { default: mongoose } = require("mongoose");

exports.createProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    if (!req.body.sizes) {
      return res.status(400).json({ message: "Sizes are required" });
    }

    // Parse sizes (because coming from FormData)
    const sizes = JSON.parse(req.body.sizes);

    if (!Array.isArray(sizes) || sizes.length === 0) {
      return res.status(400).json({ message: "Invalid sizes format" });
    }

    // Upload image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      stream.end(req.file.buffer);
    });

    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      sizes,
      images: {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      },
      createdBy: req.user.id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name",
    );

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If sizes sent
    if (req.body.sizes) {
      product.sizes = JSON.parse(req.body.sizes);
    }

    // If new image uploaded
    if (req.file) {
      // Delete old image
      await cloudinary.uploader.destroy(product.images.public_id);

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(req.file.buffer);
      });

      product.images = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    // Update basic fields
    product.name = req.body.name ?? product.name;
    product.description = req.body.description ?? product.description;
    product.category = req.body.category ?? product.category;

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await cloudinary.uploader.destroy(product.images.public_id);

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Pagination query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // Check category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Get total count
    const totalProducts = await Product.countDocuments({
      category: categoryId,
    });

    // Get paginated products
    const products = await Product.find({ category: categoryId })
      .populate("category", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      category: categoryExists.name,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      hasNextPage: page * limit < totalProducts,
      hasPrevPage: page > 1,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRandomProducts = async (req, res) => {
  const { exclude } = req.query;

  const matchStage = exclude
    ? { $match: { _id: { $ne: new mongoose.Types.ObjectId(exclude) } } }
    : null;

  const pipeline = [];
  if (matchStage) pipeline.push(matchStage);

  pipeline.push({ $sample: { size: 4 } });

  const products = await Product.aggregate(pipeline);
  res.json(products);
};
