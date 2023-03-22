export type UpdateCredentialRequest = {
  userId: number;
  password: string;
};

export type UpdateCredentialResponse = {
  success: boolean;
};