import { get_service_vars } from "@plataformaforum/core";
import {
  AppBuilder,
  ElasticDependency,
  ServiceVarsDependency,
} from "@plataformaforum/node-appbuilder";

import * as AWS from "aws-sdk";
import { Request, Response } from "express";

import { auth_module } from "./modules/auth/0-api/auth.module";

export function createApi() {
  AWS.config.update({ region: process.env.REGION });

  return AppBuilder()
    .add_module({
      name: "config",
      to_add_to_start_of_middleware_chain: [put_service_vars_on_request],
    })
    .add_module(auth_module())

    .build({
      base_url: "/auth",
    });
}

const put_service_vars_on_request = (req: Request, res: Response, next: any) =>
  get_service_vars(
    process.env.REGION,
    process.env.STAGE,
    `${process.env.STAGE}/${process.env.SERVICE_NAME}`
  )
    .then((service_vars) => {
      ServiceVarsDependency.put_on(res, service_vars);

      next();
    })
    .catch(next);
