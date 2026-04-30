import express from "express";
import { createOrGetConversation, getUserConversations, getMessages, markAsRead, uploadVoiceMessage } from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/conversation", protect, createOrGetConversation);
router.get("/conversations", protect, getUserConversations);
router.get("/messages/:conversationId", protect, getMessages);
router.put("/messages/:conversationId/read", protect, markAsRead);
router.post("/upload-voice", protect, upload.single("voice"), uploadVoiceMessage);

export default router;

