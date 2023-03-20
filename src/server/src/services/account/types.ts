export type MutateAccountRequest = {
  userId: number;
  payload: {
    [key: string]: string
  }
}

export type MutateAccountResponse = {
  success: boolean;
}