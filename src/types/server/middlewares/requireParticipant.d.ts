import { NextFunction, Request, Response } from "express";
import { TripParticipant } from "../class/Trip/TripParticipant";
export interface ParticipantRequest extends Request {
    participant?: TripParticipant | null;
}
export declare const requireParticipant: (request: ParticipantRequest, response: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
