import { Prisma } from "@prisma/client";
type CustomerPrisma = Prisma.CustomerGetPayload<{}>;
export declare class Customer {
    id: string;
    name: string;
    company_name?: string;
    cnpj?: string;
    state_registration?: string;
    street?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    phone?: string;
    static list(): Promise<Customer[]>;
    static query(value: string): Promise<Customer[]>;
    constructor(data: CustomerPrisma);
}
export {};
