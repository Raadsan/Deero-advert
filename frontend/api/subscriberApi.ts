import api from "./axios";

/**
 * ➕ SUBSCRIBE (CREATE)
 * POST /api/subscribers
 */
export const subscribeEmail = (data: { email: string }) => {
  return api.post("/subscribers", data);
};

/**
 * 📄 GET ALL SUBSCRIBERS
 * GET /api/subscribers
 */
export const getAllSubscribers = () => {
  return api.get("/subscribers");
};

/**
 * 📄 GET SUBSCRIBER BY ID
 * GET /api/subscribers/:id
 */
export const getSubscriberById = (id: string) => {
  return api.get(`/subscribers/${id}`);
};

/**
 * ✏️ UPDATE SUBSCRIBER
 * PATCH /api/subscribers/:id
 */
export const updateSubscriber = (
  id: string,
  data: { email?: string; isActive?: boolean }
) => {
  return api.patch(`/subscribers/${id}`, data);
};

/**
 * 🗑 DELETE / UNSUBSCRIBE
 * DELETE /api/subscribers/:id
 */
export const deleteSubscriber = (id: string) => {
  return api.delete(`/subscribers/${id}`);
};
