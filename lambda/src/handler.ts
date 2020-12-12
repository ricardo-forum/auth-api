import serverless from "serverless-http";
import { createApi } from "./createApi";

export const api = serverless(createApi());
