import express from "express";
import {
  createOrderCtrl,
  getAllordersCtrl,
  getSingleOrderCtrl,
  updateOrderCtrl,
  getOrderStatsCtrl,
  deleteOrderCtrl,
} from "../controllers/orderCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";

const orderRouter = express.Router();

orderRouter.post("/", isLoggedIn, createOrderCtrl);
orderRouter.get("/", isLoggedIn, getAllordersCtrl);
orderRouter.get("/sales/stats", isLoggedIn, getOrderStatsCtrl);
orderRouter.put("/update/:id", isLoggedIn, isAdmin, updateOrderCtrl);
orderRouter.get("/:id", isLoggedIn, getSingleOrderCtrl);
orderRouter.delete("/:id", isLoggedIn, isAdmin, deleteOrderCtrl);

export default orderRouter;
