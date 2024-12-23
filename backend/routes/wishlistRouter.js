import express from "express";
import {
  createWishlistCtrl,
  getWishlishCtrl,
  deleteWishlistCtrl,
} from "../controllers/wishlistCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const wishlistRouter = express.Router();

wishlistRouter.post("/", isLoggedIn, createWishlistCtrl);
wishlistRouter.get("/:id", isLoggedIn, getWishlishCtrl);
wishlistRouter.delete("/:id/delete", isLoggedIn, deleteWishlistCtrl);
export default wishlistRouter;
