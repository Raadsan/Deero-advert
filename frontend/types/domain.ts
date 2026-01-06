import { User } from "./user";

export interface Domain {
    _id: string;
    name: string;
    user: string | User;
    status: "available" | "registered" | "transferred" | "expired";
    registrationDate?: string;
    expiryDate?: string;
    price?: number;
    createdAt?: string;
    updatedAt?: string;
}
