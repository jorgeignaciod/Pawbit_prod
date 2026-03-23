export type DocumentType = "RUT" | "DNI";

export interface User {
  id: string;
  name: string;
  email: string;
  country: string;
  documentType: DocumentType;
  documentNumber: string;
  avatar: string;
}
