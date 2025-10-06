declare module "pdfjs-dist/legacy/build/pdf" {
  export const version: string;

  export namespace GlobalWorkerOptions {
    let workerSrc: string;
  }

  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
  }

  export interface PDFPageProxy {
    getTextContent(): Promise<{ items: { str: string }[] }>;
  }

  export function getDocument(data: any): {
    promise: Promise<PDFDocumentProxy>;
  };
}
