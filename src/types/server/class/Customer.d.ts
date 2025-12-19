import { Prisma } from "@prisma/client";
type CustomerPrisma = Prisma.CustomerGetPayload<{}>;
export declare class Customer {
    id: string;
    name: string;
    email?: string;
    cpf_cnpj?: string;
    rg_ie?: string;
    address?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    phone?: string;
    cep?: string;
    static list(): Promise<Customer[]>;
    static query(value: string): Promise<Customer[]>;
    constructor(data: CustomerPrisma);
}
export {};
