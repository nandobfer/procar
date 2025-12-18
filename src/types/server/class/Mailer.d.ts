import Mail from "nodemailer/lib/mailer";
export interface MailOptions {
    destination: string[];
    subject: string;
    text?: string;
    html?: string;
    attachments?: Mail.Attachment[];
    from?: string;
}
export declare class Mailer {
    private from;
    private transporter;
    sendMail(options: MailOptions): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
}
export declare const mailer: Mailer;
