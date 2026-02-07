import { User } from "./user";


export interface Transaction {
    _id: string;
    domain?: string | any;
    domainName?: string;
    service?: string | any; // Service object with packages
    packageId?: string;
    hostingPackage?: any;
    user: string | User;
    type: "register" | "transfer" | "renew" | "payment" | "service_payment" | "hosting_payment";
    amount: number;
    status: "pending" | "completed" | "failed";
    currency: string;
    description?: string;
    paymentReferenceId?: string;
    paymentMethod?: string;
    createdAt: string;
    updatedAt: string;
}

