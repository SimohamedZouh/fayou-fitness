"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "motion/react";
import { CheckCircle2, Loader2, MessageCircle, Send, TriangleAlert } from "lucide-react";
import { projets } from "@/data/projects";
import { site } from "@/data/site";
import { leadSchema, type Lead, type LeadInput } from "@/lib/schema";
import { itemsToLines, useQuoteStore } from "@/lib/quote-store";
import { whatsappLink } from "@/lib/whatsapp";

type Etat =
  | { type: "idle" }
  | { type: "success" }
  | { type: "error"; message: string; secours: boolean };

const fieldBase =
  "peer block w-full rounded-xl border border-border bg-card px-4 pb-2 pt-6 text-base text-text placeholder-transparent transition-colors focus:border-primary-text focus:outline-none focus:ring-2 focus:ring-primary-text/40 aria-[invalid=true]:border-primary-text";
const labelBase =
  "pointer-events-none absolute left-4 top-1.5 origin-left text-xs font-semibold text-text-muted transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-primary-text motion-reduce:transition-none";

function Erreur({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-sm font-semibold text-primary-text">
      {message}
    </p>
  );
}

/** Confettis légers (CSS/motion, aucune librairie), jamais affichés si mouvement réduit. */
function Confetti() {
  const reduce = useReducedMotion();
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        x: (((i * 37) % 100) - 50) * 4,
        y: -(80 + ((i * 53) % 120)),
        rotate: (i * 47) % 360,
        delay: (i % 7) * 0.02,
        plein: i % 3 !== 0,
      })),
    [],
  );
  if (reduce) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-8 flex justify-center">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
          animate={{ opacity: 0, x: p.x, y: p.y + 260, rotate: p.rotate, scale: 0.8 }}
          transition={{ duration: 1.4, delay: p.delay, ease: "easeOut" }}
          className={`absolute size-2.5 rounded-sm ${p.plein ? "bg-primary" : "border-2 border-primary-text"}`}
        />
      ))}
    </div>
  );
}

export default function LeadForm() {
  const items = useQuoteStore((s) => s.items);
  const hydrated = useQuoteStore((s) => s.hydrated);
  const clear = useQuoteStore((s) => s.clear);
  const [etat, setEtat] = useState<Etat>({ type: "idle" });
  const [envoi, setEnvoi] = useState(false);
  // null = non édité à la main : le texte suit le panier.
  const [texteManuel, setTexteManuel] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<LeadInput, unknown, Lead>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      nom: "",
      telephone: "",
      projet: "" as unknown as LeadInput["projet"],
      ville: "",
      machines: [],
      details: "",
      honeypot: "",
    },
  });

  // Pré-remplissage depuis le panier, tant que l'utilisateur n'a pas édité la liste à la main.
  useEffect(() => {
    if (!hydrated || texteManuel !== null) return;
    setValue("machines", itemsToLines(items));
  }, [items, hydrated, texteManuel, setValue]);
  const machinesTexte = texteManuel ?? (hydrated ? itemsToLines(items).join("\n") : "");

  const onSubmit = handleSubmit(async (data) => {
    setEnvoi(true);
    setEtat({ type: "idle" });
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; reason?: string } | null;
      if (res.ok && json?.ok) {
        setEtat({ type: "success" });
        clear();
        setTexteManuel(null);
        reset();
      } else if (res.status === 429) {
        setEtat({
          type: "error",
          message: "Trop de demandes envoyées. Merci de réessayer dans quelques minutes.",
          secours: true,
        });
      } else if (res.status === 400) {
        setEtat({
          type: "error",
          message: "Certaines informations sont invalides. Vérifiez le formulaire et réessayez.",
          secours: false,
        });
      } else {
        setEtat({
          type: "error",
          message:
            json?.reason === "no_channel"
              ? "L'envoi automatique n'est pas encore disponible."
              : "Votre demande n'a pas pu être envoyée.",
          secours: true,
        });
      }
    } catch {
      setEtat({
        type: "error",
        message: "Connexion impossible. Vérifiez votre réseau et réessayez.",
        secours: true,
      });
    } finally {
      setEnvoi(false);
    }
  });

  const projetNom = (slug: string) =>
    slug === "autre" ? "Autre" : (projets.find((p) => p.slug === slug)?.nom ?? slug);

  const lienSecours = () => {
    const v = getValues();
    const lignes = [
      "Bonjour FAYOU Fitness, je souhaite un devis.",
      v.nom && `Nom : ${v.nom}`,
      v.telephone && `Téléphone : ${v.telephone}`,
      v.projet && `Projet : ${projetNom(String(v.projet))}`,
      v.ville && `Ville : ${v.ville}`,
      v.machines?.length ? `Machines : ${v.machines.join(", ")}` : "",
      v.details && `Détails : ${v.details}`,
    ].filter(Boolean);
    return whatsappLink(site.whatsapp, lignes.join("\n"));
  };

  if (etat.type === "success") {
    return (
      <div
        role="status"
        className="relative space-y-3 overflow-hidden rounded-2xl border border-border bg-bg-alt p-8 text-center"
      >
        <Confetti />
        <CheckCircle2 className="mx-auto size-12 text-primary-text" aria-hidden="true" />
        <h3 className="font-display text-3xl font-extrabold uppercase italic">Demande envoyée</h3>
        <p className="text-text-muted">
          Merci ! Nous revenons vers vous très bientôt avec un devis gratuit et sans engagement.
        </p>
        <button
          type="button"
          onClick={() => setEtat({ type: "idle" })}
          className="inline-flex h-11 items-center rounded-full border-2 border-primary px-5 text-sm font-bold text-primary-text hover:bg-primary hover:text-white"
        >
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  const secoursLien = etat.type === "error" && etat.secours ? lienSecours() : null;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4" aria-label="Formulaire de demande de devis">
      <div className="relative">
        <input
          id="lead-nom"
          type="text"
          autoComplete="name"
          placeholder=" "
          aria-invalid={!!errors.nom}
          aria-describedby={errors.nom ? "lead-nom-err" : undefined}
          className={fieldBase}
          {...register("nom")}
        />
        <label htmlFor="lead-nom" className={labelBase}>
          Nom complet
        </label>
        <Erreur id="lead-nom-err" message={errors.nom?.message} />
      </div>

      <div className="relative">
        <input
          id="lead-tel"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder=" "
          aria-invalid={!!errors.telephone}
          aria-describedby={errors.telephone ? "lead-tel-err" : undefined}
          className={fieldBase}
          {...register("telephone")}
        />
        <label htmlFor="lead-tel" className={labelBase}>
          Téléphone
        </label>
        <Erreur id="lead-tel-err" message={errors.telephone?.message} />
      </div>

      <div className="relative">
        <select
          id="lead-projet"
          aria-invalid={!!errors.projet}
          aria-describedby={errors.projet ? "lead-projet-err" : undefined}
          className={`${fieldBase} appearance-none`}
          defaultValue=""
          {...register("projet")}
        >
          <option value="" disabled>
            Choisissez…
          </option>
          {projets.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.nom}
            </option>
          ))}
          <option value="autre">Autre</option>
        </select>
        <label htmlFor="lead-projet" className="pointer-events-none absolute left-4 top-1.5 text-xs font-semibold text-text-muted">
          Type de projet
        </label>
        <Erreur id="lead-projet-err" message={errors.projet?.message} />
      </div>

      <div className="relative">
        <input
          id="lead-ville"
          type="text"
          autoComplete="address-level2"
          placeholder=" "
          aria-invalid={!!errors.ville}
          aria-describedby={errors.ville ? "lead-ville-err" : undefined}
          className={fieldBase}
          {...register("ville")}
        />
        <label htmlFor="lead-ville" className={labelBase}>
          Ville
        </label>
        <Erreur id="lead-ville-err" message={errors.ville?.message} />
      </div>

      <div className="relative">
        <textarea
          id="lead-machines"
          rows={3}
          placeholder=" "
          value={machinesTexte}
          onChange={(e) => {
            setTexteManuel(e.target.value);
            setValue(
              "machines",
              e.target.value
                .split("\n")
                .map((l) => l.trim())
                .filter(Boolean),
              { shouldValidate: false },
            );
          }}
          aria-describedby="lead-machines-aide"
          className={fieldBase}
        />
        <label htmlFor="lead-machines" className={labelBase}>
          Machines souhaitées (une par ligne)
        </label>
        <p id="lead-machines-aide" className="mt-1 text-xs text-text-muted">
          Rempli automatiquement depuis votre demande de devis ; vous pouvez le modifier.
        </p>
        <Erreur id="lead-machines-err" message={errors.machines?.message} />
      </div>

      <div className="relative">
        <textarea
          id="lead-details"
          rows={4}
          placeholder=" "
          aria-invalid={!!errors.details}
          aria-describedby={errors.details ? "lead-details-err" : undefined}
          className={fieldBase}
          {...register("details")}
        />
        <label htmlFor="lead-details" className={labelBase}>
          Détails de votre projet
        </label>
        <Erreur id="lead-details-err" message={errors.details?.message} />
      </div>

      {/* Champ piège : invisible, hors tabulation, ignoré des lecteurs d'écran. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="lead-honeypot">Ne pas remplir</label>
        <input
          id="lead-honeypot"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("honeypot")}
        />
      </div>

      {etat.type === "error" && (
        <div
          role="alert"
          className="space-y-3 rounded-2xl border border-primary-text bg-bg-alt p-4"
        >
          <p className="flex items-start gap-2 font-semibold">
            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-primary-text" aria-hidden="true" />
            {etat.message}
          </p>
          {etat.secours &&
            (secoursLien ? (
              <a
                href={secoursLien}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white"
              >
                <MessageCircle className="size-5" aria-hidden="true" />
                Envoyer ma demande par WhatsApp
              </a>
            ) : (
              <p className="text-sm text-text-muted">
                Aucun numéro WhatsApp n&apos;est encore configuré sur ce site. Veuillez réessayer plus
                tard ou nous contacter directement.
              </p>
            ))}
        </div>
      )}

      <button
        type="submit"
        disabled={envoi}
        aria-busy={envoi}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 motion-reduce:hover:scale-100 sm:w-auto"
      >
        {envoi ? (
          <>
            <Loader2 className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            Envoi en cours…
          </>
        ) : (
          <>
            <Send className="size-5" aria-hidden="true" />
            Envoyer ma demande
          </>
        )}
      </button>
    </form>
  );
}
