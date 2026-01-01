import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import blogsRoute from "./routes/blogsRoute.js"; // <-- import blogs route
import multerErrorHandler from "./middlewares/multerErrorHandler.js";
import ServiceRoutes from "./routes/serviceRoutes.js";
import hostingRoute from "./routes/hostingRoute.js";
import achievementRoute from "./routes/achievementRoutes.js";
import TestimonialRoute from "./routes/testimonialRoutes.js";
import userRoute from "./routes/userRoute.js";
import rolepermissionRoutes from "./routes/RolePermissionRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import contactRoute from "./routes/contactRoute.js";
import eventsNewsRoutes from "./routes/eventNewsroutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import clientRoute from "./routes/majorclientRoute.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically at /uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register routes
app.use('/api/service/', ServiceRoutes)
app.use("/api/blogs", blogsRoute);
app.use("/api/hosting", hostingRoute);
app.use("/api/achievements", achievementRoute);
app.use("/api/testimonials", TestimonialRoute);
app.use("/api/users", userRoute);
app.use("/api/rolepermissions", rolepermissionRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/contact", contactRoute);
app.use("/api/events-news", eventsNewsRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/majorclients", clientRoute);
app.use(multerErrorHandler);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);

});
