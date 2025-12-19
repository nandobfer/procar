import { Prisma } from "@prisma/client";
import { Customer } from "./Customer";
import { Item } from "./Item";
import { WithoutFunctions } from "./helpers";
import { UploadedFile } from "express-fileupload";
export declare const order_include: {
    customer: true;
};
type OrderPrisma = Prisma.OrderGetPayload<{
    include: typeof order_include;
}>;
export interface Attachment {
    id: string;
    filename: string;
    url: string;
    width: number;
    height: number;
}
export type OrderType = "budget" | "order";
export type OrderForm = Omit<WithoutFunctions<Order>, "id" | "attachments" | "type"> & {
    attachments?: Attachment[];
    type?: OrderType;
};
export declare class Order {
    id: string;
    number: string;
    order_date: number;
    validity?: number;
    discount: number;
    additional_charges: number;
    notes?: string;
    payment_terms?: string;
    type: OrderType;
    attachments: Attachment[];
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
    uploadAttachments(attachments: UploadedFile[], data: Attachment[]): Promise<this>;
    deleteAttachment(attachment_id: string): Promise<this>;
    getSubtotal(): number;
    getTotal(): number;
    exportPdf(): Promise<string>;
}
export {};
