import express from "express";
import {
  createSizeCtrl,
  deleteSizeCtrl,
  getAllSizesCtrl,
  getSingleSizeCtrl,
  updateSizeCtrl,
} from "../controllers/sizeCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";

import { isLoggedIn } from "../middlewares/isLoggedIn.js";
const sizeRouter = express.Router();

isAdmin;
sizeRouter.post("/", isLoggedIn, isAdmin, createSizeCtrl);
sizeRouter.get("/", getAllSizesCtrl);
sizeRouter.get("/:id", getSingleSizeCtrl);
sizeRouter.delete("/:id", isLoggedIn, isAdmin, deleteSizeCtrl);
sizeRouter.put("/:id", isLoggedIn, isAdmin, updateSizeCtrl);

export default sizeRouter;
