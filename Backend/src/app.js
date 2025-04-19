import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import paymentRoutes from "../src/routes/payment.js"

const app = express();

app.use(
  cors({
    origin: "https://bookstore-frontend-6pbo.onrender.com",
    credentials: true,
  }),
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  }),
);
app.use(
  express.json({
    limit: "16kb",
  }),
);

app.use(express.static("public"));
app.use(cookieParser());
app.use("/api/v1/payment",paymentRoutes);

import userRouter from "./routes/user.routes.js";
import bookRouter from "./routes/book.routes.js"
import cartRouter from "./routes/cart.routes.js"
import orderRouter from "./routes/order.routes.js"
// import sellerRoutes from "./routes/seller.routes.js"

// app.use("/api/v1/seller", sellerRoutes);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/books",bookRouter);
app.use("/api/v1/cart",cartRouter);
app.use("/api/v1/orders",orderRouter);
export { app };
