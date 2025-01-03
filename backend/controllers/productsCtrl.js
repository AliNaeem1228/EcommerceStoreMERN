import asyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";
import Category from "../model/Category.js";
import Product from "../model/Product.js";

export const createProductCtrl = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, description, category, sizes, colors, price, totalQty, brand } =
    req.body;
  const convertedImgs = req.files.map((file) => file?.path);

  const productExists = await Product.findOne({ name });

  if (productExists) {
    throw new Error("Product Already Exists");
  }

  const brandFound = await Brand.findOne({
    name: brand,
  });

  if (!brandFound) {
    throw new Error(
      "Brand not found, please create brand first or check brand name"
    );
  }

  const categoryFound = await Category.findOne({
    name: category,
  });
  if (!categoryFound) {
    throw new Error(
      "Category not found, please create category first or check category name"
    );
  }

  const product = await Product.create({
    name,
    description,
    category,
    sizes,
    colors,
    user: req.userAuthId,
    price,
    totalQty,
    brand,
    images: convertedImgs,
  });

  categoryFound.products.push(product._id);

  await categoryFound.save();

  brandFound.products.push(product._id);

  await brandFound.save();

  res.json({
    status: "success",
    message: "Product created successfully",
    product,
  });
});

export const getProductsCtrl = asyncHandler(async (req, res) => {
  console.log(req.query);

  let productQuery = Product.find();

  if (req.query.name) {
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  }

  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: "i" },
    });
  }

  if (req.query.category) {
    productQuery = productQuery.find({
      category: req.query.category,
    });
  }

  if (req.query.color) {
    productQuery = productQuery.find({
      colors: { $regex: req.query.color, $options: "i" },
    });
  }

  if (req.query.size) {
    productQuery = productQuery.find({
      sizes: { $regex: req.query.size, $options: "i" },
    });
  }

  if (req.query.price) {
    const priceRange = req.query.price.split("-");

    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }

  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;

  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 100;

  const startIndex = (page - 1) * limit;

  const endIndex = page * limit;

  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);

  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  const products = await productQuery.populate("reviews");
  res.json({
    status: "success",
    total,
    results: products.length,
    pagination,
    message: "Products fetched successfully",
    products,
  });
});

export const getProductCtrl = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate({
    path: "reviews",
    populate: {
      path: "user",
      select: "name",
    },
  });
  if (!product) {
    throw new Error("Prouduct not found");
  }
  res.json({
    status: "success",
    message: "Product fetched successfully",
    product,
  });
});

export const updateProductCtrl = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
    brand,
  } = req.body;

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      category,
      sizes,
      colors,
      user,
      price,
      totalQty,
      brand,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.json({
    status: "success",
    message: "Product updated successfully",
    product,
  });
});

export const deleteProductCtrl = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Product deleted successfully",
  });
});
