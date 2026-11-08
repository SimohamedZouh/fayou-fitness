import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Breadcrumb from "@/components/Breadcrumb";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Politique de confidentialité",
  description:
    "Comment FAYOU Fitness collecte, utilise et protège vos données personnelles, conformément à la loi marocaine n° 09-08.",
  path: "/politique-de-confidentialite",
});

const MISE_A_JOUR = "8 novembre 2026";
// Numéro de contact confirmé par FAYOU (formulaires Meta et WhatsApp).
const TELEPHONE = "06 50 75 72 50";
const TELEPHONE_LIEN = "tel:0650757250";
const WHATSAPP_LIEN = "https://wa.me/212650757250";

const lien = "underline underline-offset-2 hover:text-primary-text";

function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl font-extrabold uppercase italic">{titre}</h2>
      <div className="space-y-3 text-text-muted">{children}</div>
    </section>
  );
}

function Contact() {
  return (
    <>
      <a className={lien} href={TELEPHONE_LIEN}>
        {TELEPHONE}
      </a>{" "}
      ou sur{" "}
      <a className={lien} href={WHATSAPP_LIEN} target="_blank" rel="noopener noreferrer">
        WhatsApp
      </a>
    </>
  );
}

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <PageHeader
        titre="Politique de confidentialité"
        intro={`Dernière mise à jour : ${MISE_A_JOUR}`}
      >
        <Breadcrumb
          items={[{ label: "Accueil", href: "/" }, { label: "Politique de confidentialité" }]}
        />
      </PageHeader>

      <div className="mx-auto w-full max-w-4xl space-y-10 px-4 py-14 text-lg sm:px-6">
        <p>
          {site.nom} attache une grande importance à la protection de vos données personnelles.
          Cette page explique quelles informations nous recueillons, pourquoi nous les utilisons et
          quels sont vos droits, conformément à la loi n° 09-08 relative à la protection des
          personnes physiques à l&apos;égard du traitement des données à caractère personnel.
        </p>

        <Bloc titre="1. Responsable du traitement">
          <p>
            {site.nom} : vente, installation, maintenance et aménagement de salles de sport, basée à{" "}
            {site.villes.join(" et ")} (Maroc).
          </p>
          <p>
            Contact : <Contact />.
          </p>
        </Bloc>

        <Bloc titre="2. Données que nous collectons">
          <p>Nous collectons uniquement les informations que vous nous transmettez volontairement :</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-text">Via notre site</strong> (formulaire de contact et de
              devis) : nom, numéro de téléphone ou WhatsApp, adresse e-mail, ville et description
              de votre projet.
            </li>
            <li>
              <strong className="text-text">Via nos formulaires publicitaires Facebook et
              Instagram</strong> : nom, numéro WhatsApp, adresse e-mail, ainsi que vos réponses aux
              questions du formulaire (type d&apos;espace, équipements souhaités, budget, délai,
              ville, description du projet).
            </li>
            <li>
              <strong className="text-text">Via WhatsApp, Messenger ou téléphone</strong> : les
              informations que vous partagez lors de nos échanges.
            </li>
          </ul>
          <p>
            Nous ne collectons aucune donnée sensible (santé, opinions, etc.) et nos services ne
            s&apos;adressent pas aux mineurs.
          </p>
        </Bloc>

        <Bloc titre="3. Pourquoi nous utilisons vos données">
          <ul className="list-disc space-y-2 pl-6">
            <li>Répondre à votre demande d&apos;information ou de devis ;</li>
            <li>Vous recontacter (téléphone, WhatsApp, e-mail) pour étudier votre projet ;</li>
            <li>Préparer et suivre nos offres, ventes, livraisons, installations et maintenances ;</li>
            <li>
              Vous envoyer des informations commerciales sur nos équipements, uniquement si vous
              l&apos;avez accepté. Vous pouvez demander l&apos;arrêt de ces messages à tout moment.
            </li>
          </ul>
          <p>
            Ces traitements reposent sur votre consentement et sur les mesures nécessaires à la
            préparation ou à l&apos;exécution d&apos;un devis ou d&apos;une vente.
          </p>
        </Bloc>

        <Bloc titre="4. Qui a accès à vos données">
          <p>
            Vos données sont réservées à l&apos;équipe {site.nom}. Nous ne les vendons ni ne les
            louons à des tiers. Elles peuvent être traitées par les prestataires techniques
            indispensables à notre activité :
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Meta (Facebook, Instagram, WhatsApp, Messenger) pour les formulaires et messages ;</li>
            <li>Notre hébergeur web (Vercel) pour le fonctionnement du site.</li>
          </ul>
          <p>
            Ces prestataires peuvent être situés hors du Maroc. Ils traitent les données selon leurs
            propres politiques de confidentialité et des garanties de sécurité adaptées.
          </p>
        </Bloc>

        <Bloc titre="5. Durée de conservation">
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Demandes de devis et prospects : 3 ans maximum après notre dernier échange, sauf si
              vous nous demandez de les supprimer avant.
            </li>
            <li>
              Clients : pendant toute la relation commerciale, puis le temps exigé par nos
              obligations légales et comptables.
            </li>
          </ul>
        </Bloc>

        <Bloc titre="6. Sécurité">
          <p>
            Nous prenons des mesures raisonnables pour protéger vos données contre la perte,
            l&apos;accès non autorisé ou la divulgation. L&apos;accès est limité aux personnes qui
            en ont besoin pour traiter votre demande.
          </p>
        </Bloc>

        <Bloc titre="7. Vos droits">
          <p>Conformément à la loi n° 09-08, vous disposez des droits suivants :</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Droit d&apos;être informé sur l&apos;utilisation de vos données ;</li>
            <li>Droit d&apos;accès à vos données ;</li>
            <li>Droit de rectification et de suppression ;</li>
            <li>Droit d&apos;opposition, notamment à la prospection commerciale.</li>
          </ul>
          <p>
            Pour exercer ces droits, contactez-nous au <Contact />. Nous vous répondons dans les
            meilleurs délais. Vous pouvez également adresser une réclamation à la Commission
            nationale de contrôle de la protection des données à caractère personnel (CNDP) :{" "}
            <a className={lien} href="https://www.cndp.ma" target="_blank" rel="noopener noreferrer">
              www.cndp.ma
            </a>
            .
          </p>
        </Bloc>

        <Bloc titre="8. Cookies">
          <p>
            Notre site peut utiliser des cookies techniques nécessaires à son bon fonctionnement et,
            le cas échéant, des outils de mesure d&apos;audience. Vous pouvez les bloquer ou les
            supprimer à tout moment dans les paramètres de votre navigateur.
          </p>
        </Bloc>

        <Bloc titre="9. Modifications">
          <p>
            Nous pouvons mettre à jour cette politique pour refléter l&apos;évolution de nos
            services ou de la réglementation. La date de dernière mise à jour figure en haut de
            cette page.
          </p>
        </Bloc>

        <p>
          <Link className={lien} href="/">
            ← Retour à l&apos;accueil
          </Link>
        </p>
      </div>
    </>
  );
}
