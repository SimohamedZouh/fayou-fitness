// FAYOU Fitness – réception des demandes de devis
// Enregistre dans Google Sheets + envoie un email + envoie une notification WhatsApp
const SHEET_ID  = "COLLER_ID_DU_GOOGLE_SHEET";   // l'identifiant dans l'URL du Sheet
const EMAIL     = "contact@exemple.ma";           // email qui reçoit les demandes
const WA_PHONE  = "+212600000000";                // numéro WhatsApp qui reçoit la notification
const WA_APIKEY = "CLE_CALLMEBOT";                // clé reçue de CallMeBot (voir étapes)

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  if (d.website) return out({ ok: true });        // anti-spam (champ piège)

  const sh = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  if (sh.getLastRow() === 0) {
    sh.appendRow(["Date", "Nom", "Téléphone", "Projet", "Ville", "Machines", "Détails"]);
  }
  sh.appendRow([new Date(), d.nom, d.tel, d.projet, d.ville, d.machines, d.details]);

  const txt = "Nouvelle demande de devis FAYOU Fitness\n" +
    "Nom : " + d.nom + "\nTéléphone : " + d.tel + "\nProjet : " + d.projet +
    "\nVille : " + d.ville + "\nMachines : " + (d.machines || "à définir") +
    "\nDétails : " + d.details;

  try { MailApp.sendEmail({ to: EMAIL, subject: "Nouveau devis – " + d.nom, body: txt }); } catch (err) {}
  try {
    UrlFetchApp.fetch("https://api.callmebot.com/whatsapp.php?phone=" + encodeURIComponent(WA_PHONE) +
      "&text=" + encodeURIComponent(txt) + "&apikey=" + WA_APIKEY);
  } catch (err) {}

  return out({ ok: true });
}

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
