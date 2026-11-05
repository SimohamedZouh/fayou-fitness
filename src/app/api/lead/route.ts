import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/schema";
import { dispatchLead } from "@/lib/lead-channels";
import { checkRateLimit } from "@/lib/rate-limit";

// Runtime Node.js (défaut). `export const runtime` est interdit avec cacheComponents.

const MAX_BODY = 20_000;

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim() || "inconnue";
  return req.headers.get("x-real-ip")?.trim() || "inconnue";
}

export async function POST(req: Request) {
  if (!checkRateLimit(clientIp(req))) {
    return NextResponse.json(
      {
        ok: false,
        reason: "rate_limited",
        message: "Trop de demandes. Réessayez dans quelques minutes.",
      },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  }

  // Taille annoncée : refus avant toute lecture du corps.
  const annonce = Number(req.headers.get("content-length"));
  if (Number.isFinite(annonce) && annonce > MAX_BODY) {
    return NextResponse.json({ ok: false, reason: "too_large" }, { status: 413 });
  }

  let raw: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY) {
      return NextResponse.json({ ok: false, reason: "too_large" }, { status: 413 });
    }
    raw = JSON.parse(text);
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  // Honeypot rempli : réponse de succès silencieuse, sans aucun envoi.
  const honeypot =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>).honeypot : undefined;
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        reason: "invalid",
        // Un seul message par champ.
        errors: parsed.error.issues
          .map((i) => ({ champ: String(i.path[0] ?? ""), message: i.message }))
          .filter((e, idx, all) => all.findIndex((o) => o.champ === e.champ) === idx),
      },
      { status: 400 },
    );
  }

  const results = await dispatchLead(parsed.data);
  const configured = results.filter((r) => r.status !== "skipped");

  if (configured.length === 0) {
    console.error("[lead] aucun canal configuré (GOOGLE_SCRIPT_URL, Resend, WhatsApp).");
    return NextResponse.json({ ok: false, reason: "no_channel" }, { status: 503 });
  }
  if (!configured.some((r) => r.status === "ok")) {
    return NextResponse.json({ ok: false, reason: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
