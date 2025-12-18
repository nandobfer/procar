import { WithoutFunctions } from "../helpers";
interface Expense {
    amount: number;
    currency: string;
}
export declare class Node {
    id: string;
    tripId: string;
    description: string;
    active: boolean;
    locked: boolean;
    createdAt: number;
    updatedAt: number;
    expense?: Expense;
    location?: string;
    datetime?: number;
    notes: string[];
    parentId?: string;
    children?: Node[];
    totalExpenses: number;
    totalLocations: string[];
    constructor(data: WithoutFunctions<Node>);
    getTotalExpenses(): number;
    getTotalLocations(): string[];
}
export {};
