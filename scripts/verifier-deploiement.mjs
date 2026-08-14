#!/usr/bin/env node
/**
 * Contrôle d'un site déployé, à lancer juste après un envoi FTP.
 *
 *   node scripts/verifier-deploiement.mjs https://preprod.adbjip.fr
 *
 * Vérifie ce qui casse silencieusement sur un hébergement mutualisé : le
 * .htaccess absent parce que le client FTP ignore les fichiers cachés, PHP qui
 * ne s'exécute pas, le fichier des demandes laissé lisible par tout le monde,
 * ou les pages livrées sans leur contenu prérendu.
 *
 * Sort en 1 si un contrôle essentiel échoue, pour être utilisable en CI.
 */

const base = (process.argv[2] || 'https://preprod.adbjip.fr').replace(/\/$/, '');
const estPreprod = /preprod\./.test(base);

const vert = (t) => `\x1b[32m${t}\x1b[0m`;
const rouge = (t) => `\x1b[31m${t}\x1b[0m`;
const gris = (t) => `\x1b[90m${t}\x1b[0m`;

let echecs = 0;

async function controle(intitule, executer, { essentiel = true } = {}) {
  try {
    const { ok, detail } = await executer();
    const marque = ok ? vert('OK  ') : essentiel ? rouge('KO  ') : gris('note');
    console.log(`${marque} ${intitule}${detail ? gris(` — ${detail}`) : ''}`);
    if (!ok && essentiel) echecs += 1;
  } catch (error) {
    console.log(`${rouge('KO  ')} ${intitule}${gris(` — ${error.message}`)}`);
    if (essentiel) echecs += 1;
  }
}

const recuperer = (chemin, options) => fetch(`${base}${chemin}`, options);

console.log(`\nContrôle de ${base}\n`);

// Une URL profonde ouverte directement : c'est ce que fait un visiteur qui
// arrive depuis un mail ou un résultat de recherche. Sans le .htaccess, Apache
// répond 404 ; avec le prérendu, le contenu est là dès la première réponse.
await controle('Page d\'accueil servie', async () => {
  const r = await recuperer('/');
  return { ok: r.ok, detail: `HTTP ${r.status}` };
});

await controle('URL profonde /services/gestion-locative', async () => {
  const r = await recuperer('/services/gestion-locative');
  const html = await r.text();
  return {
    ok: r.ok && html.includes('Mandat'),
    detail: r.ok ? `${(html.length / 1024).toFixed(0)} ko` : `HTTP ${r.status} — .htaccess absent ?`,
  };
});

await controle('Contenu prérendu présent dans le HTML', async () => {
  const html = await (await recuperer('/biens')).text();
  const vide = /<div id="root">\s*<\/div>/.test(html);
  return { ok: !vide, detail: vide ? 'div racine vide, prérendu non déployé' : '' };
});

await controle('Photos des annonces', async () => {
  const html = await (await recuperer('/biens')).text();
  const photo = html.match(/src="([^"]*\/biens\/[^"]+\.jpg)"/);
  if (!photo) return { ok: false, detail: 'aucune photo référencée' };
  const r = await recuperer(photo[1]);
  return { ok: r.ok, detail: `${photo[1]} → HTTP ${r.status}` };
});

// PHP doit répondre du JSON. Si l'hébergement ne l'exécute pas, on reçoit le
// code source ou une page HTML : le formulaire échouerait en silence.
await controle('Point d\'entrée des formulaires', async () => {
  const r = await recuperer('/contact.php', { method: 'POST' });
  const type = r.headers.get('content-type') || '';
  const corps = await r.text();
  if (corps.includes('<?php')) return { ok: false, detail: 'PHP non exécuté, code source servi' };
  return {
    ok: type.includes('application/json'),
    detail: `HTTP ${r.status}, ${type || 'sans type'}`,
  };
});

await controle('Validation côté serveur', async () => {
  const r = await recuperer('/contact.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nom: '', email: 'invalide', message: '' }),
  });
  const corps = await r.json().catch(() => null);
  return {
    ok: r.status === 422 && Array.isArray(corps?.champs),
    detail: corps ? `champs signalés : ${corps.champs?.join(', ')}` : 'réponse illisible',
  };
});

// Le fichier des demandes contient des données personnelles.
await controle('Fichier des demandes inaccessible', async () => {
  const r = await recuperer('/leads.jsonl');
  return { ok: r.status === 403 || r.status === 404, detail: `HTTP ${r.status}` };
});

await controle('Redirection HTTPS', async () => {
  const r = await fetch(base.replace('https://', 'http://'), { redirect: 'manual' });
  const cible = r.headers.get('location') || '';
  return { ok: r.status >= 300 && r.status < 400 && cible.startsWith('https://'), detail: `HTTP ${r.status}` };
});

await controle(
  estPreprod ? 'Préversion interdite à l\'indexation' : 'Site ouvert à l\'indexation',
  async () => {
    const robots = await (await recuperer('/robots.txt')).text();
    const interdit = /Disallow:\s*\/\s*$/m.test(robots);
    return { ok: estPreprod ? interdit : !interdit, detail: interdit ? 'Disallow: /' : 'indexation permise' };
  },
);

await controle(
  'Fichier de vérification Search Console',
  async () => {
    const r = await recuperer('/googlea5ff7faf806fdf23.html');
    return { ok: r.ok, detail: `HTTP ${r.status}` };
  },
  { essentiel: false },
);

console.log(
  echecs === 0
    ? `\n${vert('Tout est bon.')}\n`
    : `\n${rouge(`${echecs} contrôle(s) en échec.`)}\n`,
);
process.exit(echecs === 0 ? 0 : 1);
