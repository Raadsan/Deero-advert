import api from "./axios";

// ➕ CREATE TRANSACTION
export const createTransaction = (data: {
  domainId?: string;
  domain?: {
    name: string;
    user: string;
    price: number;
    [key: string]: any;
  };
  serviceId?: string;
  packageId?: string;
  hostingPackageId?: string;
  userId: string;
  type: "register" | "transfer" | "renew" | "payment" | "service_payment" | "hosting_payment";
  amount: number;
  currency?: string;
  description?: string;
  paymentMethod?: string;
  accountNo?: string; // For Waafi payments
}) => {
  return api.post("/transactions", data);
};

// 📄 GET ALL TRANSACTIONS (ADMIN)
export const getAllTransactions = () => {
  return api.get("/transactions");
};

// 📄 GET TRANSACTION BY ID
export const getTransactionById = (id: string) => {
  return api.get(`/transactions/${id}`);
};

// 📄 GET TRANSACTIONS BY USER
export const getTransactionsByUser = (userId: string) => {
  return api.get(`/transactions/user/${userId}`);
};

// ✏️ UPDATE TRANSACTION STATUS
export const updateTransaction = (id: string, data: any) => {
  return api.patch(`/transactions/${id}`, data);
};

// 🗑 DELETE TRANSACTION
export const deleteTransaction = (id: string) => {
  return api.delete(`/transactions/${id}`);
};

// 📈 GET REVENUE ANALYTICS
export const getRevenueAnalytics = (userId?: string) => {
  const url = userId ? `/transactions/analytics/revenue?userId=${userId}` : "/transactions/analytics/revenue";
  return api.get(url);
};
