import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/lead/route";
import { resetRateLimit } from "@/lib/rate-limit";

const ENV_KEYS = [
  "GOOGLE_SCRIPT_URL",
  "RESEND_API_KEY",
  "LEAD_TO_EMAIL",
  "LEAD_FROM_EMAIL",
  "WHATSAPP_TOKEN",
  "WHATSAPP_PHONE_ID",
  "WHATSAPP_TO",
  "CALLMEBOT_APIKEY",
];

const valide = {
  nom: "Test Client",
  telephone: "+212 6 00 00 00 00",
  projet: "home-gym",
  ville: "Casablanca",
  machines: ["Tapis de course x2"],
  details: "<b>Bonjour</b>",
  honeypot: "",
};

let ipCompteur = 0;
function requete(body: unknown, ip?: string) {
  return new Request("http://localhost/api/lead", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip ?? `10.0.0.${++ipCompteur}`,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  resetRateLimit();
  for (const k of ENV_KEYS) delete process.env[k];
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/lead", () => {
  it("rejette une demande invalide (400)", async () => {
    const res = await POST(requete({ ...valide, nom: "", telephone: "abc" }));
    expect(res.status).toBe(400);
    expect((await res.json()).ok).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejette un JSON illisible (400)", async () => {
    const res = await POST(requete("pas du json"));
    expect(res.status).toBe(400);
  });

  it("honeypot rempli : succès silencieux sans envoi", async () => {
    process.env.GOOGLE_SCRIPT_URL = "https://script.example/exec";
    const res = await POST(requete({ ...valide, honeypot: "spam" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("aucun canal configuré : no_channel", async () => {
    const res = await POST(requete(valide));
    const json = await res.json();
    expect(res.status).toBe(503);
    expect(json).toEqual({ ok: false, reason: "no_channel" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("un canal réussit, un autre échoue : succès", async () => {
    process.env.GOOGLE_SCRIPT_URL = "https://script.example/exec";
    process.env.RESEND_API_KEY = "re_secret";
    process.env.LEAD_TO_EMAIL = "a@example.com";
    process.env.LEAD_FROM_EMAIL = "b@example.com";
    fetchMock.mockImplementation(async (url: string) => {
      if (String(url).includes("resend")) return new Response("boom", { status: 500 });
      return new Response('{"ok":true}', { status: 200 });
    });

    const res = await POST(requete(valide));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // L'échec est journalisé sans fuite de la clé.
    const logs = vi.mocked(console.error).mock.calls.flat().join(" ");
    expect(logs).toContain("email");
    expect(logs).not.toContain("re_secret");
  });

  it("échappe le contenu utilisateur dans l'email HTML", async () => {
    process.env.RESEND_API_KEY = "re_secret";
    process.env.LEAD_TO_EMAIL = "a@example.com";
    process.env.LEAD_FROM_EMAIL = "b@example.com";
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));

    await POST(requete(valide));
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.html).toContain("&lt;b&gt;Bonjour&lt;/b&gt;");
    expect(body.html).not.toContain("<b>Bonjour</b>");
  });

  it("tous les canaux configurés échouent : 502 send_failed", async () => {
    process.env.GOOGLE_SCRIPT_URL = "https://script.example/exec";
    fetchMock.mockRejectedValue(new Error("réseau"));
    const res = await POST(requete(valide));
    expect(res.status).toBe(502);
    expect((await res.json()).reason).toBe("send_failed");
  });

  describe("canal sheets : validation de la réponse du script", () => {
    const SECRET_URL = "https://script.google.com/macros/s/SECRETID/exec";
    beforeEach(() => {
      process.env.GOOGLE_SCRIPT_URL = SECRET_URL;
    });
    const logs = () => vi.mocked(console.error).mock.calls.flat().join(" ");

    it("{ok:true} : succès", async () => {
      fetchMock.mockResolvedValue(
        new Response('{"ok":true}', { status: 200, headers: { "Content-Type": "application/json" } }),
      );
      const res = await POST(requete(valide));
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ok: true });
    });

    it("page HTML de connexion en 200 : échec, 502 send_failed, URL non fuitée", async () => {
      fetchMock.mockResolvedValue(
        new Response("<!DOCTYPE html><html>Sign in</html>", {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
      );
      const res = await POST(requete(valide));
      expect(res.status).toBe(502);
      expect((await res.json()).reason).toBe("send_failed");
      expect(logs()).toContain("Tout le monde");
      expect(logs()).not.toContain("SECRETID");
    });

    it("{ok:false} : échec", async () => {
      fetchMock.mockResolvedValue(new Response('{"ok":false}', { status: 200 }));
      const res = await POST(requete(valide));
      expect(res.status).toBe(502);
      expect(logs()).not.toContain("SECRETID");
    });

    it("corps non-JSON : échec", async () => {
      fetchMock.mockResolvedValue(new Response("OK", { status: 200 }));
      const res = await POST(requete(valide));
      expect(res.status).toBe(502);
    });
  });

  it("limite la fréquence par IP (429)", async () => {
    const ip = "203.0.113.9";
    for (let i = 0; i < 5; i++) {
      const ok = await POST(requete(valide, ip));
      expect(ok.status).not.toBe(429);
    }
    const res = await POST(requete(valide, ip));
    expect(res.status).toBe(429);
    // Une autre IP n'est pas affectée.
    const autre = await POST(requete(valide, "203.0.113.10"));
    expect(autre.status).not.toBe(429);
  });
});
