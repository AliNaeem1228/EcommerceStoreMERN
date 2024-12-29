import asyncHandler from "express-async-handler";
import Wishlist from "../model/Wishlist.js";

export const createWishlistCtrl = asyncHandler(async (req, res) => {
  const { user, product } = req.body;

  const wishlistExists = await Wishlist.findOne({ user, product });
  if (wishlistExists) {
    throw new Error("Product already exists in your wishlist");
  }

  const createdWishlist = await Wishlist.create({ user, product });

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

export const getWishlishCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const [wishlist, totalResults] = await Promise.all([
    Wishlist.find({ user: id })
      .skip(skip)
      .limit(limit)
      .populate({ path: "product", populate: ["brand"] }),
    Wishlist.countDocuments({ user: id }),
  ]);

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

export const deleteWishlistCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;

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
