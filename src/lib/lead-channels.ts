import type { Lead } from "@/lib/schema";
import { getProjet } from "@/data/projects";

/** Utilisé côté serveur uniquement (route /api/lead). Aucune clé n'est lue côté client. */
const TIMEOUT_MS = 8000;

export type ChannelStatus = "ok" | "skipped" | "failed";
export interface ChannelResult {
  channel: "sheets" | "email" | "whatsapp";
  status: ChannelStatus;
}

const clean = (v: string | undefined) => (v && v.trim() ? v.trim() : null);

/** Échappe le contenu utilisateur avant insertion dans l'email HTML. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Empêche l'interprétation d'une cellule comme formule dans Google Sheets. */
function sheetSafe(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

const projetLabel = (slug: string) =>
  slug === "autre" ? "Autre" : (getProjet(slug)?.nom ?? slug);

export function leadToText(lead: Lead): string {
  return [
    "Nouvelle demande de devis FAYOU Fitness",
    `Nom : ${lead.nom}`,
    `Téléphone : ${lead.telephone}`,
    `Projet : ${projetLabel(lead.projet)}`,
    `Ville : ${lead.ville}`,
    `Machines : ${lead.machines.length ? lead.machines.join(", ") : "à définir"}`,
    `Détails : ${lead.details || "-"}`,
  ].join("\n");
}

function leadToHtml(lead: Lead): string {
  const rows: [string, string][] = [
    ["Nom", lead.nom],
    ["Téléphone", lead.telephone],
    ["Projet", projetLabel(lead.projet)],
    ["Ville", lead.ville],
    ["Machines", lead.machines.length ? lead.machines.join(", ") : "à définir"],
    ["Détails", lead.details || "-"],
  ];
  const body = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;font-weight:bold;vertical-align:top">${escapeHtml(k)}</td><td style="padding:4px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join("");
  return `<h2>Nouvelle demande de devis FAYOU Fitness</h2><table>${body}</table>`;
}

async function guarded(
  channel: ChannelResult["channel"],
  run: () => Promise<Response>,
): Promise<ChannelResult> {
  try {
    const res = await run();
    if (!res.ok) {
      let detail = "";
      try {
        detail = (await res.text()).slice(0, 200);
      } catch {}
      console.error(`[lead] canal ${channel} en échec : HTTP ${res.status} ${detail}`);
      return { channel, status: "failed" };
    }
    return { channel, status: "ok" };
  } catch (err) {
    // On ne journalise que le nom de l'erreur : le message peut contenir l'URL (donc une clé).
    const name = err instanceof Error ? err.name : "Error";
    console.error(`[lead] canal ${channel} en échec : ${name}`);
    return { channel, status: "failed" };
  }
}

/**
 * Apps Script répond HTTP 200 même pour une page de connexion Google ou une erreur.
 * Succès uniquement si la réponse finale est OK ET le corps est du JSON { ok: true }.
 * Jamais d'URL dans les journaux (elle contient l'identifiant du déploiement).
 */
async function sendSheetsRequest(url: string, lead: Lead): Promise<ChannelResult> {
  try {
    const res = await fetch(url, {
      method: "POST",
      // Apps Script lit e.postData.contents quel que soit le Content-Type.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        nom: sheetSafe(lead.nom),
        tel: sheetSafe(lead.telephone),
        projet: sheetSafe(projetLabel(lead.projet)),
        ville: sheetSafe(lead.ville),
        machines: sheetSafe(lead.machines.join(", ")),
        details: sheetSafe(lead.details),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const type = res.headers.get("content-type") ?? "inconnu";
    let finalHost = "";
    try {
      finalHost = res.url ? new URL(res.url).hostname : "";
    } catch {}
    const hostInfo = finalHost === "accounts.google.com" ? " ; redirigé vers accounts.google.com" : "";

    let parsed: unknown = undefined;
    let text = "";
    try {
      text = await res.text();
      parsed = JSON.parse(text);
    } catch {}
    const ok =
      res.ok &&
      typeof parsed === "object" &&
      parsed !== null &&
      (parsed as { ok?: unknown }).ok === true;
    if (ok) return { channel: "sheets", status: "ok" };

    const looksHtml = /^\s*<(!doctype|html)/i.test(text) || type.includes("text/html");
    const reason = looksHtml
      ? "HTML/connexion requise — vérifier que l'accès est 'Tout le monde'"
      : "corps non conforme (JSON { ok: true } attendu)";
    console.error(
      `[lead] canal sheets en échec : réponse inattendue du script : ${reason} ; HTTP ${res.status} ; content-type ${type}${hostInfo}`,
    );
    return { channel: "sheets", status: "failed" };
  } catch (err) {
    const name = err instanceof Error ? err.name : "Error";
    console.error(`[lead] canal sheets en échec : ${name}`);
    return { channel: "sheets", status: "failed" };
  }
}

function sendSheets(lead: Lead): Promise<ChannelResult> | null {
  const url = clean(process.env.GOOGLE_SCRIPT_URL);
  if (!url) return null;
  return sendSheetsRequest(url, lead);
}

function sendEmail(lead: Lead): Promise<ChannelResult> | null {
  const key = clean(process.env.RESEND_API_KEY);
  const to = clean(process.env.LEAD_TO_EMAIL);
  const from = clean(process.env.LEAD_FROM_EMAIL);
  if (!key || !to || !from) return null;
  return guarded("email", () =>
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        subject: `Nouveau devis : ${lead.nom.replace(/[\r\n]+/g, " ")}`,
        html: leadToHtml(lead),
        text: leadToText(lead),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    }),
  );
}

function sendWhatsapp(lead: Lead): Promise<ChannelResult> | null {
  const to = clean(process.env.WHATSAPP_TO)?.replace(/\D/g, "");
  if (!to) return null;
  const text = leadToText(lead);

  const token = clean(process.env.WHATSAPP_TOKEN);
  const phoneId = clean(process.env.WHATSAPP_PHONE_ID);
  if (token && phoneId) {
    return guarded("whatsapp", () =>
      fetch(`https://graph.facebook.com/v21.0/${encodeURIComponent(phoneId)}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: text },
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      }),
    );
  }

  const apikey = clean(process.env.CALLMEBOT_APIKEY);
  if (apikey) {
    return guarded("whatsapp", () =>
      fetch(
        `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(to)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`,
        { method: "GET", signal: AbortSignal.timeout(TIMEOUT_MS) },
      ),
    );
  }
  return null;
}

/** Lance les canaux configurés en parallèle. Un canal non configuré est ignoré. */
export async function dispatchLead(lead: Lead): Promise<ChannelResult[]> {
  const jobs = [
    { channel: "sheets" as const, job: sendSheets(lead) },
    { channel: "email" as const, job: sendEmail(lead) },
    { channel: "whatsapp" as const, job: sendWhatsapp(lead) },
  ];
  const settled = await Promise.allSettled(jobs.map((j) => j.job ?? Promise.resolve(null)));
  return settled.map((r, i): ChannelResult => {
    const channel = jobs[i].channel;
    if (r.status === "rejected") {
      console.error(`[lead] canal ${channel} en échec (exception)`);
      return { channel, status: "failed" };
    }
    return r.value ?? { channel, status: "skipped" };
  });
}
