import Script from "next/script";

/**
 * Google Analytics 4, désactivé par défaut : actif uniquement si NEXT_PUBLIC_GA_ID
 * (format G-XXXXXXXXXX) est défini. Aucune dépendance supplémentaire.
 */
export default function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID?.trim();
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
