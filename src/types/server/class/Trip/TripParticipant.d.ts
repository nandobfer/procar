import { Prisma } from "@prisma/client";
import { User } from "../User";
export declare const participant_include: {
    user: true;
};
type ParticipantPrisma = Prisma.TripParticipantGetPayload<{
    include: typeof participant_include;
}>;
export type ParticipantRole = "administrator" | "collaborator" | "viewer";
export interface TripParticipantForm {
    role: ParticipantRole;
    identifier: string;
    idType: "userId" | "email";
    tripId: string;
}
export type ParticipantStatus = "active" | "pending";
export declare class TripParticipant {
    id: string;
    tripId: string;
    email?: string;
    role: ParticipantRole;
    createdAt: number;
    updatedAt: number;
    status: ParticipantStatus;
    user?: User;
    userId?: string;
    static new(data: TripParticipantForm, email?: string): Promise<TripParticipant>;
    static findById(id: string): Promise<TripParticipant | null>;
    constructor(data: ParticipantPrisma);
    load(data: ParticipantPrisma): void;
    update(data: Partial<TripParticipant>): Promise<void>;
    delete(): Promise<void>;
}
export {};
