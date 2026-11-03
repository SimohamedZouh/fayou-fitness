// Génère les variantes du logo (clair / sombre) et les icônes à partir de public/brand/logo-original.png
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "public/brand/logo-original.png");
const out = (p) => path.join(root, p);

// Seuils : "neutre sombre" = saturation faible ET luminosité basse.
const SAT_MAX = 0.35;
const VAL_MIN_PURPLE = 0.55; // en dessous, un pixel coloré reste du bruit sombre, pas du violet
const LUM_MAX = 0.6;

async function makeDark() {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const buf = Buffer.from(data);
  for (let i = 0; i < buf.length; i += 4) {
    const r = buf[i] / 255;
    const g = buf[i + 1] / 255;
    const b = buf[i + 2] / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const lum = (max + min) / 2;
    const sat = max === 0 ? 0 : (max - min) / max;
    if ((sat < SAT_MAX && lum < LUM_MAX) || max < VAL_MIN_PURPLE) {
      buf[i] = 255;
      buf[i + 1] = 255;
      buf[i + 2] = 255;
    }
  }
  await sharp(buf, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(out("public/brand/logo-dark.webp"));
}

async function makeLight() {
  await sharp(src)
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(out("public/brand/logo-light.webp"));
}

// Monogramme "F" (zone haute du logo) pour favicon / apple-icon
const MARK = { left: 440, top: 55, width: 810, height: 480 };

async function makeIcons() {
  const mark = await sharp(src).extract(MARK).png().toBuffer();

  const fit = (size, pad) =>
    sharp(mark)
      .resize(size - pad * 2, size - pad * 2, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

  // icon.png : 512x512 fond blanc (lisible sur onglets clairs et sombres)
  await sharp({
    create: { width: 512, height: 512, channels: 4, background: "#ffffff" },
  })
    .composite([{ input: await fit(512, 40) }])
    .png()
    .toFile(out("src/app/icon.png"));

  // apple-icon.png : 180x180 fond blanc
  await sharp({
    create: { width: 180, height: 180, channels: 4, background: "#ffffff" },
  })
    .composite([{ input: await fit(180, 14) }])
    .png()
    .toFile(out("src/app/apple-icon.png"));

  // opengraph-image.png : 1200x630, logo complet sur fond blanc
  const logo = await sharp(src)
    .resize(1000, 520, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
  await sharp({
    create: { width: 1200, height: 630, channels: 4, background: "#ffffff" },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(out("src/app/opengraph-image.png"));
}

await Promise.all([makeLight(), makeDark(), makeIcons()]);
console.log("Logos et icônes générés.");
