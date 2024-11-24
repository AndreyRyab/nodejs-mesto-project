export type AuthContext = {
  user: {
    _id: string
  }
};

export interface ICustomError extends Error {
  statusCode: number;
}
