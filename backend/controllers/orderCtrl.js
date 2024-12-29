import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import Order from "../model/Order.js";
import Product from "../model/Product.js";
import User from "../model/User.js";

const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrderCtrl = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;
  console.log(req.body);

  const user = await User.findById(req.userAuthId);

  if (!user?.hasShippingAddress) {
    throw new Error("Please provide shipping address");
  }
  if (orderItems?.length <= 0) {
    throw new Error("No Order Items");
  }
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice,
  });

  const products = await Product.find({ _id: { $in: orderItems } });

  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id?.toString() === order?._id?.toString();
    });
    if (product) {
      product.totalSold += order.qty;
    }
    await product.save();
  });
  user.orders.push(order?._id);
  await user.save();

  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });
  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    shipping_options: [{ shipping_rate: "shr_1QRbGPGC2bldVM1SLQfEyg3e" }],
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
  res.send({ url: session.url });
});

export const getAllordersCtrl = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user");
  res.json({
    success: true,
    message: "All orders",
    orders,
  });
});

export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const order = await Order.findById(id);
  //send response
  res.status(200).json({
    success: true,
    message: "Single order",
    order,
  });
});

export const updateOrderCtrl = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    success: true,
    message: "Order updated",
    updatedOrder,
  });
});

export const deleteOrderCtrl = asyncHandler(async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Order deleted successfully",
  });
});

export const getOrderStatsCtrl = asyncHandler(async (req, res) => {
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimumSale: {
          $min: "$totalPrice",
        },
        totalSales: {
          $sum: "$totalPrice",
        },
        maxSale: {
          $max: "$totalPrice",
        },
        avgSale: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);

  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);
  res.status(200).json({
    success: true,
    message: "Sum of orders",
    orders,
    saleToday,
  });
});
