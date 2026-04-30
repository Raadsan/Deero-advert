import { prisma } from "../lib/prisma.js";

// Starts or gets a conversation
export const createOrGetConversation = async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = req.user.id;

    if (!participantId) {
      return res.status(400).json({ message: "Participant ID is required" });
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
    const formattedConversations = conversations.map(conv => {
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

export const uploadVoiceMessage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No audio file uploaded" });
    }

    // req.file.path contains the Cloudinary URL
    res.status(201).json({ url: req.file.path });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

