import { User } from "./user";
import { Domain } from "./domain";

export interface Transaction {
    _id: string;
    domain: string | Domain;
    user: string | User;
    type: "register" | "transfer" | "renew" | "payment";
    amount: number;
    status: "pending" | "completed" | "failed";
    currency: string;
    description?: string;
    paymentReferenceId?: string;
    paymentMethod?: string;
    createdAt: string;
    updatedAt: string;
}
