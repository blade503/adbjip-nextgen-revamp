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
  // Les deux extensions : le portefeuille est passé au WebP le 27/08/2026, mais
  // une préversion plus ancienne peut encore servir des JPEG.
  const photo = html.match(/src="([^"]*\/biens\/[^"]+\.(?:jpe?g|webp))"/);
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
    /**
     * ON NE LIT QUE LE GROUPE `User-agent: *`.
     *
     * Le test précédent cherchait `Disallow: /` n'importe où dans le fichier. Or
     * `robots.txt` interdit nommément trois aspirateurs commerciaux (AhrefsBot,
     * MJ12bot, DotBot) : la production faisait donc échouer ce contrôle à chaque
     * passage, en affirmant que le site était fermé à l'indexation alors qu'il
     * ne fermait la porte qu'à trois robots.
     *
     * Un faux positif qui crie n'est pas anodin : le jour de la bascule, on
     * cesse de lire les alertes qui se déclenchent toujours.
     */
    const groupes = robots.split(/^(?=User-agent:)/im);
    const etoile = groupes.find((g) => /^User-agent:\s*\*/im.test(g)) || '';
    const interdit = /^Disallow:\s*\/\s*$/im.test(etoile);
    return {
      ok: estPreprod ? interdit : !interdit,
      detail: interdit ? 'Disallow: / sur User-agent: *' : 'indexation permise',
    };
  },
);

/**
 * LES QUATRE REDIRECTIONS DE L'ANCIEN SITE, UNE PAR UNE.
 *
 * Ces URL sont indexées depuis huit ans. Chacune perdue est du référencement
 * perdu, et une redirection qui ne part pas ne se voit pas : le visiteur arrive
 * sur la coquille monopage, qui répond 200 avec un contenu sans rapport.
 *
 * LE PIÈGE `/about` A ÉTÉ SUPPRIMÉ À LA SOURCE le 27/08/2026.
 *
 * `/about` était à la fois cette URL héritée ET la page « L'agence » de la
 * refonte — prérendue, déclarée au sitemap, canonique sur `/about`, et cible du
 * lien « L'agence » de l'en-tête et du pied de page. Relevé sur la préversion :
 * la redirection masquait la page. En navigation interne React Router
 * l'affichait, mais au rechargement, en accès direct, depuis un moteur ou par un
 * lien partagé, on atterrissait sur `/contact` — et Google recevait une URL de
 * sitemap qui redirige, donc une page jamais indexée.
 *
 * Ce contrôle-ci ne le voyait pas : il VALIDAIT la redirection. Une attente
 * fausse est pire qu'une absence de contrôle.
 *
 * La page a été déplacée sur `/agence`. La redirection héritée reste, l'URL de
 * 2017 garde son intention, et le contrôle ci-dessous redevient juste. Le
 * contrôle « /agence sert bien la page » est ajouté juste après.
 *
 * `redirect: 'manual'` est indispensable : sans lui `fetch` suit la
 * redirection et on relève 200 au lieu de 301.
 */
const REDIRECTIONS = [
  ['/gerer-bien', '/services/gestion-locative'],
  ['/gerer-copropriete', '/services/gestion-copropriete'],
  ['/estimation', '/services/estimation-biens'],
  ['/about', '/contact'],
];

/**
 * La contrepartie du déplacement : `/agence` doit servir la page, sans
 * redirection. Sans ce contrôle, réintroduire une collision passerait inaperçu.
 */
await controle('/agence sert la page de l\'agence', async () => {
  const reponse = await recuperer('/agence', { redirect: 'manual' });
  if (reponse.status !== 200) {
    return { ok: false, detail: `HTTP ${reponse.status} au lieu de 200` };
  }
  const html = await reponse.text();
  return {
    ok: html.includes("L'agence"),
    detail: `HTTP 200, ${(html.length / 1024).toFixed(0)} ko`,
  };
});

for (const [ancienne, attendue] of REDIRECTIONS) {
  await controle(`301 ${ancienne} → ${attendue}`, async () => {
    const r = await fetch(`${base}${ancienne}`, { redirect: 'manual' });
    const cible = r.headers.get('location') || '';
    const chemin = cible.replace(/^https?:\/\/[^/]+/, '');
    const ok = r.status === 301 && chemin === attendue;
    return {
      ok,
      detail: ok ? '' : `HTTP ${r.status}${cible ? ` → ${chemin}` : ' — aucune redirection'}`,
    };
  });
}

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
