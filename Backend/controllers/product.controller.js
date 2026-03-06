const Product = require("../models/product.model");
const Category = require("../models/category.model");
const cloudinary = require("../config/cloudinary");
const { default: mongoose } = require("mongoose");

// Helper: Upload image to cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    stream.end(fileBuffer);
  });
};

exports.createProduct = async (req, res) => {
  try {
    const productCount = await Product.countDocuments();

    if (productCount >= 100) {
      return res.status(400).json({
        message: "Product limit reached (Maximum 100 products allowed)",
      });
    }

    const { name, description, category, sizes } = req.body;

    if (!name || !description || !category || !sizes) {
      return res.status(400).json({
        message: "Name, description, category and sizes are required",
      });
    }

    // Validate category
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Validate sizes
    const parsedSizes = JSON.parse(sizes);

    if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
      return res.status(400).json({
        message: "At least one size is required",
      });
    }

    for (let s of parsedSizes) {
      if (!s.size || !s.price || s.stock === undefined) {
        return res.status(400).json({
          message: "Each size must have size, price and stock",
        });
      }
    }

    // Validate images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "At least one product image is required",
      });
    }

    if (req.files.length > 5) {
      return res.status(400).json({
        message: "Maximum 5 images allowed",
      });
    }

    // Upload images
    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadToCloudinary(file.buffer);

        return {
          url: result.secure_url,
          public_id: result.public_id,
        };
      }),
    );

    const product = await Product.create({
      name,
      description,
      category,
      sizes: parsedSizes,
      images: uploadedImages,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: error.message });
  }
};

//admin
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//user
exports.getAllProductsUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const minPrice = parseInt(req.query.minPrice) || 0;
    const maxPrice = parseInt(req.query.maxPrice) || 100000;
    const category = req.query.category;
    const inStock = req.query.inStock === "true";

    const skip = (page - 1) * limit;

    let filter = {
      sizes: {
        $elemMatch: {
          price: { $gte: minPrice, $lte: maxPrice },
        },
      },
    };

    if (category) {
      filter.category = category;
    }

    // ✅ In Stock filter
    if (inStock) {
      filter.sizes = {
        $elemMatch: {
          price: { $gte: minPrice, $lte: maxPrice },
          stock: { $gt: 0 },
        },
      };
    }

    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("category", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      products,
    });
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

    const { name, description, category, sizes, deletedImages } = req.body;

    // Validate category
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category" });
      }
      product.category = category;
    }

    // =========================
    // Delete Selected Images
    // =========================
    if (deletedImages) {
      const parsedDeleted = JSON.parse(deletedImages);

      const imagesToDelete = product.images.filter((img) =>
        parsedDeleted.includes(img.url),
      );

      await Promise.all(
        imagesToDelete.map((img) => cloudinary.uploader.destroy(img.public_id)),
      );

      product.images = product.images.filter(
        (img) => !parsedDeleted.includes(img.url),
      );
    }

    // =========================
    // Upload New Images
    // =========================
    if (req.files && req.files.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.map(async (file) => {
          const result = await uploadToCloudinary(file.buffer);

          return {
            url: result.secure_url,
            public_id: result.public_id,
          };
        }),
      );

      product.images = [...product.images, ...uploadedImages];
    }

    // Limit images
    if (product.images.length > 5) {
      return res.status(400).json({
        message: "Maximum 5 images allowed",
      });
    }

    // =========================
    // Update Other Fields
    // =========================
    if (name) product.name = name;
    if (description) product.description = description;

    if (sizes) {
      const parsedSizes = JSON.parse(sizes);

      for (let s of parsedSizes) {
        if (!s.size || !s.price || s.stock === undefined) {
          return res.status(400).json({
            message: "Each size must have size, price and stock",
          });
        }
      }

      product.sizes = parsedSizes;
    }

    await product.save();

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete all images from Cloudinary
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map((img) => cloudinary.uploader.destroy(img.public_id)),
      );
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const minPrice = parseInt(req.query.minPrice) || 0;
    const maxPrice = parseInt(req.query.maxPrice) || 100000;

    const skip = (page - 1) * limit;

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    const filter = {
      category: categoryId,
      sizes: {
        $elemMatch: {
          price: { $gte: minPrice, $lte: maxPrice },
        },
      },
    };

    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("category", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      category: categoryExists.name,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
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

exports.validateCartItems = async (req, res) => {
  try {
    const { items } = req.body;

    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) continue;

      const size = product.sizes.find((s) => s._id.toString() === item.sizeId);

      if (!size) continue;

      validatedItems.push({
        productId: product._id,
        sizeId: size._id,
        name: product.name,
        image: product.images[0].url,
        size: size.size,
        price: size.price,
        stock: size.stock,
        requestedQty: item.quantity,
        availableQty: Math.min(item.quantity, size.stock),
      });
    }

    res.json(validatedItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.json([]);
    }

    const products = await Product.find({
      name: { $regex: q, $options: "i" }, // case insensitive
    })
      .select("name images.url")
      .limit(8);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
