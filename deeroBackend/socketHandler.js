import { Server } from "socket.io";
import { prisma } from "./lib/prisma.js";
import admin from "./firebase.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Track online users
  let onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // User connects and sends their user ID
    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} joined with socket ${socket.id}`);
      io.emit("user_status", { userId: userId, status: "online" });
    });

    // User joins a specific chat room
    socket.on("join_room", (conversationId) => {
      socket.join(conversationId.toString());
      console.log(`Socket ${socket.id} joined room ${conversationId}`);
    });

    // Handle sending message
    socket.on("send_message", async (data) => {
      const { conversationId, senderId, text, receiverId, messageType, mediaUrl, duration } = data;

      try {
        // 1. Save message to DB
        const newMessage = await prisma.message.create({
          data: {
            conversationId: parseInt(conversationId),
            senderId: parseInt(senderId),
            text: text || "",
            messageType: messageType || "text",
            mediaUrl: mediaUrl || null,
            duration: duration ? parseInt(duration) : null,
          }
        });

        // 2. Update conversation lastMessage
        let lastMsgText = text;
        if (messageType === 'voice') lastMsgText = "🎤 Voice Message";
        else if (messageType === 'image') lastMsgText = "🖼️ Image";
        else if (messageType === 'video') lastMsgText = "🎬 Video";
        else if (messageType === 'document') lastMsgText = "📄 Document";
        await prisma.conversation.update({
          where: { id: parseInt(conversationId) },
          data: { lastMessage: lastMsgText }
        });

        // 3. Emit message to the room (both users if online)
        io.to(conversationId.toString()).emit("receive_message", newMessage);


        // 4. Send Push Notification if receiver is offline
        const receiverSocketId = onlineUsers.get(receiverId);
        if (!receiverSocketId) {
          console.log(`Receiver ${receiverId} is offline. Sending FCM push notification...`);
          
          // Get receiver tokens from database
          const tokens = await prisma.deviceToken.findMany({
            where: { userId: parseInt(receiverId) }
          });

          if (tokens.length > 0) {
            // Get sender name for the notification
            const sender = await prisma.user.findUnique({
              where: { id: parseInt(senderId) },
              select: { fullname: true }
            });

            const senderName = sender ? sender.fullname : "New Message";
            
            let notificationText = text;
            if (messageType === 'voice') notificationText = "🎤 Sent a voice message";
            else if (messageType === 'image') notificationText = "🖼️ Sent an image";
            else if (messageType === 'video') notificationText = "🎬 Sent a video";
            else if (messageType === 'document') notificationText = "📄 Sent a document";
            
            if (notificationText.length > 50) {
              notificationText = notificationText.substring(0, 50) + "...";
            }

            const messagePayload = {
              notification: {
                title: senderName,
                body: notificationText
              },
              data: {
                type: "chat",
                conversationId: conversationId.toString()
              },
              tokens: tokens.map(t => t.token)
            };

            try {
              const response = await admin.messaging().sendEachForMulticast(messagePayload);
              console.log(`FCM sent: ${response.successCount} successes, ${response.failureCount} failures.`);
            } catch (fcmError) {
              console.error("FCM sending error:", fcmError);
            }
          } else {
            console.log(`No device token found for user ${receiverId}`);
          }
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    socket.on("mark_read", async (data) => {
      const { conversationId, userId } = data;
      try {
        await prisma.message.updateMany({
          where: {
            conversationId: parseInt(conversationId),
            senderId: { not: parseInt(userId) },
            isRead: false,
          },
          data: { isRead: true },
        });
        io.to(conversationId.toString()).emit("messages_read", { conversationId, readerId: userId });
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    });


    socket.on("disconnect", () => {
      // Remove user from onlineUsers
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          io.emit("user_status", { userId: userId, status: "offline" });
          break;
        }
      }
      console.log("🔴 User disconnected:", socket.id);
    });
  });

  return io;
};
