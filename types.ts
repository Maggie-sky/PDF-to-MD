
export interface ConversionState {
  isProcessing: boolean;
  error: string | null;
  markdown: string | null;
  fileName: string | null;
}

export interface PDFFile {
  name: string;
  base64: string;
  size: number;
}
