import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser);       // Create
router.get("/", getAllUsers);        // Read all
router.get("/:id", getUserById);     // Read one
router.patch("/:id", updateUser);      // Update
router.delete("/:id", deleteUser);   // Delete

export default router;
