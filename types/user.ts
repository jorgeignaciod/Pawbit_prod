export type DocumentType = "RUT" | "DNI";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  documentType: DocumentType;
  documentNumber: string;
  avatar: string;
  onboardingCompleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
