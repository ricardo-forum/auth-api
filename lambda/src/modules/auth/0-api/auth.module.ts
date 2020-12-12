import { ServiceVarsDependency } from "@plataformaforum/node-appbuilder";
import { Module } from "@plataformaforum/node-appbuilder/dist/Types";
import { NextFunction, Request, Response } from "express";

export function auth_module(): Module {
  return {
    name: `auth`,
    base_url: `/`,
    endpoints: [
      {
        endpoint: "/debug1006",
        method: "GET",
        middlewares: [
          (req: Request, res: Response, next: NextFunction) => {
            const { SERVICE_NAME, STAGE } = process.env;
            const {} = ServiceVarsDependency.get_from(res);

            res.status(201).json({
              SERVICE_NAME,
              STAGE,
            });
          },
        ],
      },
    ],
  };
}
