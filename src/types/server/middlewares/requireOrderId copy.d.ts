import { NextFunction, Request, Response } from "express";
import { Order } from "../class/Order";
export interface OrderRequest extends Request {
    order?: Order | null;
}
export declare const requireOrderId: (request: OrderRequest, response: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
