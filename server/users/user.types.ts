export type DocumentType = "RUT" | "DNI";

export interface StoredUser {
  id: number;
  token: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  documentType: DocumentType;
  documentNumber: string;
  avatar: string;
  passwordHash: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicUser {
  id: string;
  token: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  documentType: DocumentType;
  documentNumber: string;
  avatar: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export function toPublicUser(user: StoredUser): PublicUser {
  const { passwordHash: _passwordHash, id: _internalId, token, ...rest } = user;

  return {
    id: token,
    token,
    ...rest
  };
}
