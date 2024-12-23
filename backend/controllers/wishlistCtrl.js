import asyncHandler from "express-async-handler";
import Wishlist from "../model/Wishlist.js";

// Create a wishlist item
export const createWishlistCtrl = asyncHandler(async (req, res) => {
  const { user, product, note } = req.body;

  // Check if the wishlist item already exists
  const wishlistExists = await Wishlist.findOne({ user, product });
  if (wishlistExists) {
    throw new Error("Product already exists in your wishlist");
  }

  // Create and save the wishlist item
  const createdWishlist = await Wishlist.create({ user, product, note });

  // Populate the response with product details
  const populatedWishlist = await createdWishlist.populate({
    path: "product",
    populate: ["brand"],
  });

  res.status(201).json({
    status: "success",
    message: "Product added to wishlist successfully",
    wishlist: populatedWishlist,
  });
});

// Get wishlist items for a user
export const getWishlishCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params; // User ID
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // Pagination
  const skip = (page - 1) * limit;

  // Fetch wishlist items and total count
  const [wishlist, totalResults] = await Promise.all([
    Wishlist.find({ user: id })
      .skip(skip)
      .limit(limit)
      .populate({ path: "product", populate: ["brand"] }),
    Wishlist.countDocuments({ user: id }),
  ]);

  // Pagination details
  const pagination = {};
  if (skip + limit < totalResults) {
    pagination.next = { page: page + 1, limit };
  }
  if (skip > 0) {
    pagination.prev = { page: page - 1, limit };
  }

  res.json({
    status: "success",
    totalResults,
    results: wishlist.length,
    pagination,
    wishlist,
  });
});

// Delete a wishlist item
export const deleteWishlistCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Delete the wishlist item
  const deletedWishlist = await Wishlist.findByIdAndDelete(id);
  if (!deletedWishlist) {
    throw new Error("Wishlist item not found");
  }

  res.json({
    status: "success",
    message: "Product removed from wishlist successfully",
    wishlist: deletedWishlist,
  });
});
