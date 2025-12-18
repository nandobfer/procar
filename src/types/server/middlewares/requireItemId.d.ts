import { NextFunction, Request, Response } from "express";
import { Item } from "../class/Item";
import { Order } from "../class/Order";
export interface ItemRequest extends Request {
    item?: Item | null;
    order?: Order | null;
}
export declare const requireItemId: (request: ItemRequest, response: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
