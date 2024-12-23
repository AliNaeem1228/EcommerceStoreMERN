import express from "express";
import {
  createWishlistCtrl,
  getWishlishCtrl,
  deleteWishlistCtrl,
} from "../controllers/wishlistCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const wishlistRouter = express.Router();

wishlistRouter.post("/", createWishlistCtrl);
wishlistRouter.get("/:id", getWishlishCtrl);
wishlistRouter.delete("/:id/delete", deleteWishlistCtrl);
export default wishlistRouter;
