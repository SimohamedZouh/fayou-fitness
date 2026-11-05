import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/lead/route";
import { resetRateLimit } from "@/lib/rate-limit";
import { leadSchema } from "@/lib/schema";

const valide = {
  nom: "Test Client",
  telephone: "+212 6 00 00 00 00",
  projet: "home-gym",
  ville: "Casablanca",
  machines: [],
  details: "",
  honeypot: "",
};

function requete(body: string, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": "10.9.9.9", ...headers },
    body,
  });
}

beforeEach(() => {
  resetRateLimit();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("schéma lead", () => {
  it("un téléphone invalide ne produit qu'un seul message", () => {
    for (const telephone of ["abc", "12", "1".repeat(19)]) {
      const r = leadSchema.safeParse({ ...valide, telephone });
      expect(r.success).toBe(false);
      const msgs = r.error!.issues.filter((i) => i.path[0] === "telephone");
      expect(msgs).toHaveLength(1);
    }
  });
});

describe("POST /api/lead : limites", () => {
  it("refuse (413) un content-length trop grand sans lire le corps", async () => {
    const req = requete("{}", { "content-length": "50000" });
    const lire = vi.spyOn(req, "text");
    const res = await POST(req);
    expect(res.status).toBe(413);
    expect(lire).not.toHaveBeenCalled();
  });

  it("refuse (413) un corps trop grand sans content-length", async () => {
    const res = await POST(requete(JSON.stringify({ ...valide, details: "x".repeat(25_000) })));
    expect(res.status).toBe(413);
  });

  it("400 avec un seul message par champ", async () => {
    const res = await POST(requete(JSON.stringify({ ...valide, telephone: "abc" })));
    expect(res.status).toBe(400);
    const { errors } = (await res.json()) as { errors: { champ: string }[] };
    expect(errors.filter((e) => e.champ === "telephone")).toHaveLength(1);
  });
});
