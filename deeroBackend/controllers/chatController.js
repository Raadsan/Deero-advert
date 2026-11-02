import { prisma } from "../lib/prisma.js";
import { areUsersBlocked, getBlockedUserIds } from "../utils/chatSafety.js";

// Starts or gets a conversation
export const createOrGetConversation = async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = req.user.id;

    if (!participantId) {
      return res.status(400).json({ message: "Participant ID is required" });
    }

    if (await areUsersBlocked(userId, participantId)) {
      return res.status(403).json({ message: "You cannot message this user." });
    }

    // Check if conversation exists
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { participant1Id: userId, participant2Id: parseInt(participantId) },
          { participant1Id: parseInt(participantId), participant2Id: userId },
        ],
      },
      include: {
        participant1: { select: { id: true, fullname: true, image: true, email: true } },
        participant2: { select: { id: true, fullname: true, image: true, email: true } },
      }
    });

    if (!conversation) {
      // Create new
      conversation = await prisma.conversation.create({
        data: {
          participant1Id: userId,
          participant2Id: parseInt(participantId),
        },
        include: {
          participant1: { select: { id: true, fullname: true, image: true, email: true } },
          participant2: { select: { id: true, fullname: true, image: true, email: true } },
        }
      });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const blockedIds = await getBlockedUserIds(userId);

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { participant1Id: userId },
          { participant2Id: userId },
        ],
      },
      include: {
        participant1: { select: { id: true, fullname: true, image: true, email: true } },
        participant2: { select: { id: true, fullname: true, image: true, email: true } },
        messages: {
          where: {
            senderId: { not: userId },
            isRead: false
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Map to include unreadCount and remove messages array to keep response clean
    const formattedConversations = conversations
      .filter((conv) => {
        const otherId =
          conv.participant1Id === userId ? conv.participant2Id : conv.participant1Id;
        return !blockedIds.has(otherId);
      })
      .map(conv => {
      const { messages, ...convData } = conv;
      return {
        ...convData,
        unreadCount: messages.length
      };
    });

    res.status(200).json(formattedConversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    const messages = await prisma.message.findMany({
      where: { conversationId: parseInt(conversationId) },
      orderBy: { createdAt: 'asc' },
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    await prisma.message.updateMany({
      where: {
        conversationId: parseInt(conversationId),
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reportUser = async (req, res) => {
  try {
    const reporterId = req.user.id;
    const { reportedUserId, conversationId, reason, details } = req.body;

    if (!reportedUserId || !reason) {
      return res.status(400).json({ message: "reportedUserId and reason are required" });
    }

    if (parseInt(reportedUserId, 10) === reporterId) {
      return res.status(400).json({ message: "You cannot report yourself." });
    }

    const report = await prisma.chatReport.create({
      data: {
        reporterId,
        reportedUserId: parseInt(reportedUserId, 10),
        conversationId: conversationId ? parseInt(conversationId, 10) : null,
        reason: String(reason).slice(0, 120),
        details: details ? String(details).slice(0, 2000) : null,
      },
    });

    res.status(201).json({ message: "Report submitted. Our team will review it.", report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const blockerId = req.user.id;
    const blockedId = parseInt(req.body.blockedUserId ?? req.body.userId, 10);

    if (Number.isNaN(blockedId)) {
      return res.status(400).json({ message: "blockedUserId is required" });
    }

    if (blockedId === blockerId) {
      return res.status(400).json({ message: "You cannot block yourself." });
    }

    await prisma.userBlock.upsert({
      where: {
        blockerId_blockedId: { blockerId, blockedId },
      },
      update: {},
      create: { blockerId, blockedId },
    });

    res.status(200).json({ message: "User blocked." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const blockerId = req.user.id;
    const blockedId = parseInt(req.params.userId, 10);

    await prisma.userBlock.deleteMany({
      where: { blockerId, blockedId },
    });

    res.status(200).json({ message: "User unblocked." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlockedUsers = async (req, res) => {
  try {
    const blockerId = req.user.id;
    const blocks = await prisma.userBlock.findMany({
      where: { blockerId },
      include: {
        blocked: { select: { id: true, fullname: true, image: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(blocks.map((row) => row.blocked));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadVoiceMessage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No audio file uploaded" });
    }

    // req.file.path contains the S3 URL
    res.status(201).json({ url: req.file.path });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

