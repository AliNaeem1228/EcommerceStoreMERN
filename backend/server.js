import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import Stripe from "stripe";
import express from "express";
import path from "path";
import dbConnect from "./config/dbConnect.js";
import { globalErrhandler, notFound } from "./middlewares/globalErrHandler.js";
import brandsRouter from "./routes/brandsRouter.js";
import categoriesRouter from "./routes/categoriesRouter.js";
import colorRouter from "./routes/colorRouter.js";
import orderRouter from "./routes/ordersRouter.js";
import productsRouter from "./routes/productsRoute.js";
import reviewRouter from "./routes/reviewRouter.js";
import userRoutes from "./routes/usersRoute.js";
import Order from "./model/Order.js";
import couponsRouter from "./routes/couponsRouter.js";
import wishlistRouter from "./routes/wishlistRouter.js";
import sizeRouter from "./routes/sizeRouter.js";
import { Server } from "socket.io";

dotenv.config();

const app = express();
dbConnect();

app.use(cors());

const stripe = new Stripe(process.env.STRIPE_KEY);

const endpointSecret = process.env.ENDPOINT;

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log("event");
    } catch (err) {
      console.log("err", err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { orderId } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;

      const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          totalPrice: totalAmount / 100,
          currency,
          paymentMethod,
          paymentStatus,
        },
        {
          new: true,
        }
      );
      console.log(order);
    } else {
      return;
    }
    response.send();
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.sendFile(path.join("public", "index.html"));
});

app.use("/api/users/", userRoutes);
app.use("/api/products/", productsRouter);
app.use("/api/categories/", categoriesRouter);
app.use("/api/brands/", brandsRouter);
app.use("/api/colors/", colorRouter);
app.use("/api/reviews/", reviewRouter);
app.use("/api/orders/", orderRouter);
app.use("/api/coupons/", couponsRouter);
app.use("/api/wishlist/", wishlistRouter);
app.use("/api/size/", sizeRouter);

app.use(notFound);
app.use(globalErrhandler);

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`${socket.id} joined ${room}`);
  });

  socket.on("sendMessage", (data) => {
    console.log("Message received:", data);

    socket.to(data.room).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log(`A user disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () =>
  console.log(`Server is up and running on port ${PORT}`)
);
