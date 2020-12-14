import {
  not_empty,
  not_empty_string,
} from "@plataformaforum/core/dist/validators";
import * as jwt from "jsonwebtoken";
import { TokenPayload } from "../3-model/TokenPayload";

const ALGORITHM = "HS256";
const EXPIRES_IN = "3d";

export const create_token = (
  payload: TokenPayload,
  secret: string,
  audience: string,
  issuer: string,
  expiresIn: string = EXPIRES_IN
): string =>
  jwt.sign(payload, secret, {
    audience: not_empty(audience, "audience"),
    issuer: not_empty_string(issuer, "issuer"),
    expiresIn,
    algorithm: ALGORITHM,
  });
