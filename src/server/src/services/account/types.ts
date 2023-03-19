
export type MutateAccountRequest = {
  userId: number;
  jwt: string;
  payload: {
    [key: string]: string | Record<string, unknown>;
  }
}

export type MutateAccountResponse = {
  success: boolean;
}