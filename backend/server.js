import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import Stripe from "stripe";
import express from "express";
import path from "path";
import { Server } from "socket.io";
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

dotenv.config();

const app = express();
dbConnect();

app.use(cors());

const stripe = new Stripe(process.env.STRIPE_KEY);

const endpointSecret =
  "whsec_2a222b6d6b7abb9982f25d1da9e63f4d0a78f6935259e4ff65cae8df7b5fdde5";

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

app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/products/", productsRouter);
app.use("/api/v1/categories/", categoriesRouter);
app.use("/api/v1/brands/", brandsRouter);
app.use("/api/v1/colors/", colorRouter);
app.use("/api/v1/reviews/", reviewRouter);
app.use("/api/v1/orders/", orderRouter);
app.use("/api/v1/coupons/", couponsRouter);
app.use("/api/v1/wishlist/", wishlistRouter);
app.use("/api/v1/size/", sizeRouter);

app.use(notFound);
app.use(globalErrhandler);

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const io = new Server(server);

const chatNamespace = io.of("/chat");
let users = [];
io.use(cors());
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const id = "123456";

  if (!token) {
    console.log("Authentication failed: No token provided");
    return next(new Error("Authentication failed"));
  } else if (token !== id) {
    console.log("Authentication failed: Invalid token");
    return next(new Error("Authentication failed"));
  } else {
    next();
  }
});

chatNamespace.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("login", (data) => {
    const user = {
      id: socket.id,
      name: data.nickname,
      roomNumber: data.roomNumber,
    };
    users.push(user);

    socket.join(data.roomNumber);
    chatNamespace.to(data.roomNumber).emit(
      "online",
      users.filter((u) => u.roomNumber === data.roomNumber)
    );
    console.log(`${data.nickname} joined room: ${data.roomNumber}`);
  });

  socket.on("chat message", (data) => {
    const date = new Date();
    let hours = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");
    data.date = `${hours}:${minutes}`;

    chatNamespace.to(data.roomNumber).emit("chat message", data);
  });

  socket.on("typing", (data) => {
    socket.to(data.roomNumber).emit("typing", `${data.name} is typing...`);
  });

  socket.on("disconnect", () => {
    const index = users.findIndex((u) => u.id === socket.id);
    if (index !== -1) {
      const roomNumber = users[index].roomNumber;
      users.splice(index, 1);
      chatNamespace.to(roomNumber).emit(
        "online",
        users.filter((u) => u.roomNumber === roomNumber)
      );
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () =>
  console.log(`Server is up and running on port ${PORT}`)
);
