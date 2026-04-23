import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma.js";

// Import Routes (Updated for Video Support)
import userRoute from "./routes/userRoute.js";
import roleRoute from "./routes/roleRoute.js";
import blogsRoute from "./routes/blogsRoute.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import AnnouncementRoute from "./routes/AnnouncementRoute.js";
import careerRoutes from "./routes/careerRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import contactRoute from "./routes/contactRoute.js";
import domainRoute from "./routes/domainRoute.js";
import domainPriceRoutes from "./routes/domainPriceRoutes.js";
import eventNewsRoutes from "./routes/eventNewsRoutes.js";
import hostingRoute from "./routes/hostingRoute.js";
import MajorClientRoute from "./routes/MajorClientRoute.js";
import menuRoutes from "./routes/menuRoutes.js";
import rolePermissionsRoutes from "./routes/rolePermissionsRoutes.js";
import serviceRoute from "./routes/serviceRoute.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import teamRoute from "./routes/teamRoute.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import videoRoute from "./routes/videoRoute.js";
import discountRoute from "./routes/discountRoute.js";
import multerErrorHandler from "./middlewares/multerErrorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Alias middleware for frontend compatibility (_id -> id)
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function (data) {
    const addAlias = (obj) => {
      if (!obj || typeof obj !== 'object' || obj instanceof Date) return obj;
      if (Array.isArray(obj)) return obj.map(addAlias);
      const newObj = { ...obj };
      if (newObj.id && !newObj._id) newObj._id = String(newObj.id);

      for (const key in newObj) {


        newObj[key] = addAlias(newObj[key]);


        if (typeof key === 'string' && key.toLowerCase().endsWith('id') && newObj[key] !== null && newObj[key] !== undefined && typeof newObj[key] !== 'object') {
          newObj[key] = String(newObj[key]);
        }
      }
      return newObj;
    };
    return originalJson.call(this, addAlias(data));
  };
  next();
});

// Root route
app.get("/", (req, res) => {
  res.send("Deero Advert Backend (MySQL/Prisma) is running!");
});

// API Routes
app.use("/api/users", userRoute);
app.use("/api/roles", roleRoute);
app.use("/api/blogs", blogsRoute);
app.use("/api/portfolios", portfolioRoutes);
app.use("/api/announcements", AnnouncementRoute);
app.use("/api/careers", careerRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/contacts", contactRoute);
app.use("/api/contact", contactRoute); // Support singular for frontend/contactApi.ts
app.use("/api/domains", domainRoute);
app.use("/api/domain-prices", domainPriceRoutes);
app.use("/api/events-news", eventNewsRoutes);
app.use("/api/hosting", hostingRoute);
app.use("/api/major-clients", MajorClientRoute);
app.use("/api/majorclients", MajorClientRoute); // Support no-dash for frontend/majorClientApi.ts
app.use("/api/menus", menuRoutes);
app.use("/api/role-permissions", rolePermissionsRoutes);
app.use("/api/rolepermissions", rolePermissionsRoutes); // Support no-dash for frontend/rolePermissionApi.ts
app.use("/api/services", serviceRoute);
app.use("/api/service", serviceRoute); // Support singular for frontend/serviceApi.ts
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/teams", teamRoute);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/videos", videoRoute);
app.use("/api/discounts", discountRoute);

// Error Handling Middleware
app.use(multerErrorHandler);

// Test database connection
async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully via Prisma");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

main();