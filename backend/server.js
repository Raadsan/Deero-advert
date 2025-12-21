import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import blogsRoute from "./routes/blogsRoute.js"; // <-- import blogs route
import multerErrorHandler from "./middlewares/multerErrorHandler.js";

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running...");
});

// Register routes

app.use("/api/blogs", blogsRoute); // <-- use blogs route
// Multer-specific error handler (returns 400 for unexpected fields / other multer errors)
app.use(multerErrorHandler);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
 
});
