import { WithoutFunctions } from "./helpers";
import { PDFDocument, PDFForm } from "pdf-lib";
export interface PdfField {
    name: string;
    value?: string;
    bold?: boolean;
    type?: "text" | "image" | "checkbox";
}
type PdfConstructor = Omit<WithoutFunctions<PdfHandler>, "fullpath">;
export declare class PdfHandler {
    template_path: string;
    output_dir: string;
    filename: string;
    font?: {
        regular: string;
        bold: string;
    };
    fields: PdfField[];
    fullpath: string;
    document?: PDFDocument;
    form?: PDFForm;
    constructor(data: PdfConstructor);
    init(): Promise<void>;
    fillForm(fieldsToDelete?: string[]): Promise<void>;
    flattenWithGhostscript(inputPath: string, outputPath: string): Promise<boolean>;
    save(): Promise<void>;
}
export {};
