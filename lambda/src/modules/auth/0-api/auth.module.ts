import {
  ServiceVarsDependency,
  verify_token,
} from "@plataformaforum/node-appbuilder";
import { Module } from "@plataformaforum/node-appbuilder/dist/Types";
import { NextFunction, Request, Response } from "express";
import * as jwt from "express-jwt";
import { pick } from "ramda";
import { create_token } from "../1-services/token";
import { token_payload } from "../3-model/TokenPayload";
const jwksRsa = require("jwks-rsa");

const { AUTH0_AUDIENCE, AUTH0_DOMAIN, AUTH0_ISSUER } = process.env;

export function auth_module(): Module {
  return {
    name: `auth`,
    base_url: `/`,
    endpoints: [
      {
        endpoint: "/",
        method: "POST",
        middlewares: [
          check_auth0_token,
          extract_email_from_token_payload,
          send_token,
        ],
      },
      {
        endpoint: "/verify-token1006",
        method: "GET",
        middlewares: [verify_token],
      },
      {
        endpoint: "/debug1006",
        method: "GET",
        middlewares: [
          (req: Request, res: Response, next: NextFunction) => {
            const {
              TOKEN_AUDIENCE,
              TOKEN_ISSUER,
              TOKEN_SECRET,
            } = ServiceVarsDependency.get_from(res);

            res.status(201).json({
              TOKEN_AUDIENCE,
              TOKEN_ISSUER,
              TOKEN_SECRET: (TOKEN_SECRET + "").slice(0, 2) + "...",
              ...pick(
                [
                  "SERVICE_NAME",
                  "STAGE",
                  "AUTH0_AUDIENCE",
                  "AUTH0_DOMAIN",
                  "AUTH0_ISSUER",
                ],
                process.env
              ),
            });
          },
        ],
      },
    ],
  };
}

const check_auth0_token = (req: Request, res: Response, next: NextFunction) => {
  return jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),
    audience: AUTH0_AUDIENCE,
    issuer: AUTH0_ISSUER,
    algorithms: ["RS256"],
    resultProperty: "locals.user",
  })(req, res, (error) => {
    if ((error?.message + "").includes("expired")) {
      return res.status(401).json({ error: "token expirou." });
    }

    if ((error?.message + "").includes("invalid")) {
      return res.status(401).json({ error: "token invalido." });
    }

    next(error);
  });
};

const extract_email_from_token_payload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = res.locals?.user?.[AUTH0_AUDIENCE]?.email;

  if (!email) {
    return res.status(500).json({ error: "nao conseguiu extrair email." });
  }

  res.locals.email = email;
  next();
};

const send_token = (req: Request, res: Response, next: NextFunction) => {
  const {
    TOKEN_AUDIENCE,
    TOKEN_ISSUER,
    TOKEN_SECRET,
  } = ServiceVarsDependency.get_from(res);

  const email = res.locals.email;
  const token = create_token(
    token_payload(email, []),
    TOKEN_SECRET,
    TOKEN_AUDIENCE,
    TOKEN_ISSUER
  );

  return res.send(token);
};
