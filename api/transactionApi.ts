import api from "./axios";

// ➕ CREATE TRANSACTION
export const createTransaction = (data: {
  domainId?: string;
  serviceId?: string;
  packageId?: string;
  userId: string;
  type: "register" | "transfer" | "renew" | "payment" | "service_payment";
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
