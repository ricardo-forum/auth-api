import { verify_token_fn } from "@plataformaforum/node-appbuilder";
import { token_payload } from "../../3-model/TokenPayload";
import { create_token } from "../token";

describe("token service", () => {
  const default_params = {
    private_key: "oioioioioioioioioi",
    audience: "aud",
    issuer: "iss",
    expiresIn: "1 day",
  };

  const TOKEN_PAYLOAD = token_payload("rick.onodera@gmail.com", []);
  const TOKEN = create_token(
    TOKEN_PAYLOAD,
    default_params.private_key,
    default_params.audience,
    default_params.issuer,
    default_params.expiresIn
  );

  const test_key_aud_issuer = [
    {
      field: "signature",
      params: { ...default_params, private_key: "outra key" },
    },
    {
      field: "audience",
      params: { ...default_params, audience: "outra aud" },
    },
    {
      field: "issuer",
      params: { ...default_params, issuer: "outro issuer" },
    },
  ];

  test_key_aud_issuer.forEach(({ field, params }) => {
    it(`Deve validar ${field}.`, async () => {
      try {
        const payload = await verify_token_fn(
          TOKEN,
          params.private_key,
          params.audience,
          params.issuer
        );

        expect(payload).toBeFalsy();
      } catch (error) {
        expect(error).toMatch(new RegExp(field));
      }
    });
  });

  it("Deve decodificar um token.", async () => {
    const payload = await verify_token_fn(
      TOKEN,
      default_params.private_key,
      default_params.audience,
      default_params.issuer
    );

    expect(payload.email).toEqual(TOKEN_PAYLOAD.email);
    expect(payload.tags).toEqual(TOKEN_PAYLOAD.tags);
  });

  it("Deve verificar a validade do token.", async () => {
    try {
      const TOKEN = create_token(
        { ...TOKEN_PAYLOAD },
        default_params.private_key,
        default_params.audience,
        default_params.issuer,
        "-35s"
      );

      const payload = await verify_token_fn(
        TOKEN,
        default_params.private_key,
        default_params.audience,
        default_params.issuer
      );

      expect(payload).toBeFalsy();
    } catch (error) {
      expect(error).toMatch(new RegExp("expired"));
    }
  });
});
