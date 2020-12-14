import * as request from "supertest";
import { createApi } from "../../../../createApi";

describe("auth.module", () => {
  const api = createApi();

  it("Deve retornar 401 e mensagem de token expirado quando token recebido do auth0 ter expirado.", (done) => {
    const expired_token =
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNOWkZOU0RBbHRWclhyY2RLWThlRCJ9.eyJodHRwczovL2JpZC1uZXh0LXVpLm5vdy5zaCI6eyJuYW1lIjoicmljYXJkby5vbm9kZXJhQHNhbmRib3gucGFnc2VndXJvLmNvbS5iciIsImVtYWlsIjoicmljYXJkby5vbm9kZXJhQHNhbmRib3gucGFnc2VndXJvLmNvbS5iciJ9LCJpc3MiOiJodHRwczovL3N0YWdpbmctbmV4dC11aS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWYxNTk5YjJmM2IxNTUwMDE5MzRmZmNhIiwiYXVkIjpbImh0dHBzOi8vYmlkLW5leHQtdWkubm93LnNoIiwiaHR0cHM6Ly9zdGFnaW5nLW5leHQtdWkuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTYwNzgwODQ2NiwiZXhwIjoxNjA3ODE1NjY2LCJhenAiOiJoUDlVYjh3WkhoY2N3MFNwTWw5Y3BmU2dWaE9HbUo4cCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.Vn87pkGEN1h0jCntgcyudUCe2awQgTxYoJ0bQHPmr-fGw0wpjIafZSztrpXiD-TplEGGRK1J7GYvKuVXL2VyAT4kT3J6oiSejWcBGyEEPExr7tUraE--9xqxoF9exvzrvExaNx9LzAfdVcyd4d6LVQ0fnUOUXZIzCDj9rfqrRKhPvtVQe8KGpv5-qXlrzKIbrjZ4IMsISw2v-5ZxcT7oWHqHcOajaYt5DPrcmLdbqQXXsTAeJrKJRyUeq5UozZlT_gD8G4xxfBVJnRcncj4krfT1nGPmlWDwjSvggWSg62unDVMQI0KtR_ITrY29XBj2DhAw28kytHbUJQShDt71TQ";

    request(api)
      .post("/auth")
      .send()
      .set("Authorization", `Bearer ${expired_token}`)
      .end((err, result) => {
        expect(err).toBeFalsy();
        expect(result.status).toBe(401);
        expect(result.body.error).toMatch(/expirou/);
        done();
      });
  });

  it("Deve retornar 401 e mensagem de token invalido quando token invalido.", (done) => {
    const invalid_token =
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNOWkZOU0RBbHRWclhyY2RLWThlRCJ8.eyJodHRwczovL2JpZC1uZXh0LXVpLm5vdy5zaCI6eyJuYW1lIjoicmljYXJkby5vbm9kZXJhQHNhbmRib3gucGFnc2VndXJvLmNvbS5iciIsImVtYWlsIjoicmljYXJkby5vbm9kZXJhQHNhbmRib3gucGFnc2VndXJvLmNvbS5iciJ9LCJpc3MiOiJodHRwczovL3N0YWdpbmctbmV4dC11aS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWYxNTk5YjJmM2IxNTUwMDE5MzRmZmNhIiwiYXVkIjpbImh0dHBzOi8vYmlkLW5leHQtdWkubm93LnNoIiwiaHR0cHM6Ly9zdGFnaW5nLW5leHQtdWkuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTYwNzgwODQ2NiwiZXhwIjoxNjA3ODE1NjY2LCJhenAiOiJoUDlVYjh3WkhoY2N3MFNwTWw5Y3BmU2dWaE9HbUo4cCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.Vn87pkGEN1h0jCntgcyudUCe2awQgTxYoJ0bQHPmr-fGw0wpjIafZSztrpXiD-TplEGGRK1J7GYvKuVXL2VyAT4kT3J6oiSejWcBGyEEPExr7tUraE--9xqxoF9exvzrvExaNx9LzAfdVcyd4d6LVQ0fnUOUXZIzCDj9rfqrRKhPvtVQe8KGpv5-qXlrzKIbrjZ4IMsISw2v-5ZxcT7oWHqHcOajaYt5DPrcmLdbqQXXsTAeJrKJRyUeq5UozZlT_gD8G4xxfBVJnRcncj4krfT1nGPmlWDwjSvggWSg62unDVMQI0KtR_ITrY29XBj2DhAw28kytHbUJQShDt71TQ";

    request(api)
      .post("/auth")
      .send()
      .set("Authorization", `Bearer ${invalid_token}`)
      .end((err, result) => {
        expect(err).toBeFalsy();
        expect(result.status).toBe(401);
        expect(result.body.error).toMatch(/invalido/);
        done();
      });
  });
});
