import { NextFunction, Request, Response } from "express";
import { Trip } from "../class/Trip/Trip";
export interface TripRequest extends Request {
    trip?: Trip | null;
}
export declare const requireTrip: (request: TripRequest, response: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
