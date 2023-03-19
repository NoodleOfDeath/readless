
export type MutateAccountRequest = {
  userId: number;
  jwt: string;
  payload: {
    [key: string]: string
  }
}

export type MutateAccountResponse = {
  success: boolean;
}