// import express from "express";
// import { createPackage, getAllPackages, getPackageById, updatePackage, deletePackage } from "../controllers/hostingPackageController.js";

// const router = express.Router();

// // routes
// router.post("/", createPackage);
// router.get("/", getAllPackages);
// router.get("/:id", getPackageById);
// router.put("/:id", updatePackage);
// router.delete("/:id", deletePackage);

// export default router;



import express from "express";
import { createPackage } from "../controllers/hostingPackageController.js";

const router = express.Router();

router.post("/", createPackage);

export default router;
