import { not_empty_string } from "@plataformaforum/core/dist/validators";

export type TokenPayload = {
  email: string;
  tags: string[];
};

export const token_payload = (email: string, tags: string[]): TokenPayload => ({
  email: not_empty_string(email, "email"),
  tags: tags || [],
});
