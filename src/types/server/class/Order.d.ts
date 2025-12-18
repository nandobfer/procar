import { Prisma } from "@prisma/client";
import { Customer } from "./Customer";
import { Item } from "./Item";
import { WithoutFunctions } from "./helpers";
export declare const order_include: {
    customer: true;
};
type OrderPrisma = Prisma.OrderGetPayload<{
    include: typeof order_include;
}>;
export type OrderType = "budget" | "order";
export interface DeliveryDate {
    from: number;
    to: number;
}
export interface Attachment {
    id: string;
    filename: string;
    url: string;
    width: number;
    height: number;
}
export type OrderForm = Omit<WithoutFunctions<Order>, "id" | "images">;
export declare class Order {
    id: string;
    number: string;
    type: OrderType;
    order_date: number;
    observations?: string;
    payment_terms?: string;
    images: Attachment[];
    delivery_date?: DeliveryDate;
    items: Item[];
    customerId?: string;
    customer: Customer;
    static list(): Promise<Order[]>;
    static get(id: string): Promise<Order | null>;
    static getNextAvailableNumber(): Promise<number>;
    static validateNumber(number: string): Promise<boolean>;
    static query(value: string): Promise<Order[]>;
    static create(data: OrderForm): Promise<Order>;
    constructor(data: OrderPrisma);
    update(data: Partial<OrderForm>): Promise<this>;
    delete(): Promise<void>;
}
export {};
