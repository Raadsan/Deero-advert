import { User } from "./user";
import { Domain } from "./domain";

export interface Transaction {
    _id: string;
    domain?: string | Domain;
    service?: string | any; // Service object with packages
    packageId?: string;
    user: string | User;
    type: "register" | "transfer" | "renew" | "payment" | "service_payment";
    amount: number;
    status: "pending" | "completed" | "failed";
    currency: string;
    description?: string;
    paymentReferenceId?: string;
    paymentMethod?: string;
    createdAt: string;
    updatedAt: string;
}
