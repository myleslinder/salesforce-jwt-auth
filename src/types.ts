import { SignOptions } from "jsonwebtoken";

export type AuthInstance = {
  access_token: string;
  scope: string;
  instance_url: string;
  id: string;
  token_type: string;
};

export type Config = {
  connectedAppKey: string;
  username: string;
  isSandbox: boolean;
  privateKey: string;
  jwtExpiry: SignOptions["expiresIn"];
};

// type SchemaName = "Account" | "Session" | "User" | "VerificationRequest";

//type SchemaNames = { [K in SchemaName]: string | undefined };
