// services/domainApi.ts
import api from "./axios";

/**
 * ➕ REGISTER DOMAIN
 * POST /api/domains/register
 */
export const registerDomain = (data: {
  domainName: string;
  userId: string;
  price?: number;
}) => {
  return api.post("/domains/register", data);
};

/**
 * 🔄 TRANSFER DOMAIN
 * POST /api/domains/transfer
 */
export const transferDomain = (data: {
  domain: string;
  user: string;
  price?: number;
}) => {
  return api.post("/domains/transfer", data);
};

/**
 * 🔁 RENEW DOMAIN
 * POST /api/domains/renew
 */
export const renewDomain = (data: {
  domain: string;
  user: string;
  price?: number;
  expiryDate?: string; // optional new expiry
}) => {
  return api.post("/domains/renew", data);
};

/**
 * 📄 GET ALL DOMAINS
 * GET /api/domains
 */
export const getAllDomains = () => {
  return api.get("/domains");
};

/**
 * 📄 GET DOMAINS BY USER
 * GET /api/domains/user/:userId
 */
export const getDomainsByUser = (userId: string) => {
  return api.get(`/domains/user/${userId}`);
};


