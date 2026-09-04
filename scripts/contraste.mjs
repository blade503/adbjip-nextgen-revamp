#!/usr/bin/env node
/**
 * Contrastes de la charte, calculés.
 *
 * Aucun ratio ne s'estime dans ce projet. Ce script prend les couples réels du
 * site — tels qu'ils sont écrits dans `src/index.css` — et calcule le rapport
 * WCAG 2.1 : HSL → sRGB → luminance relative → (L1 + 0,05) / (L2 + 0,05).
 *
 * IL SAIT COMPOSER SUR UN FOND SEMI-TRANSPARENT, et c'est le seul intérêt de
 * l'avoir écrit. Le piège de cette charte n'est pas le texte sur un aplat, qui
 * est facile à vérifier à l'œil : c'est le texte sur un VOILE. Une étiquette
 * posée sur `--primary/10` n'a pas le fond de la pierre, elle a le fond du
 * mélange, et ce mélange fait perdre un demi-point de ratio. C'est exactement
 * ainsi que `--primary-ink` à 30 % de clarté est passé pour conforme (4,90:1
 * sur pierre) alors qu'il tombait à 4,61:1 là où il servait vraiment.
 *
 * Sortie non nulle si un couple échoue à son seuil : le script est utilisable
 * tel quel dans une vérification automatique.
 *
 *   node scripts/contraste.mjs           tous les couples
 *   node scripts/contraste.mjs laiton    ceux dont le nom contient « laiton »
 */

/* ------------------------------------------------------------------ */
/* Colorimétrie                                                        */

/**
 * HSL → sRGB, composantes dans [0, 1].
 * Formule de la spécification CSS Color 4, § 7.
 */
function hslVersRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}

/**
 * Luminance relative, WCAG 2.1 § « relative luminance ».
 * Le seuil est bien 0,03928 et non 0,04045 : c'est la valeur que la norme
 * WCAG écrit, et c'est elle qui fait référence en accessibilité même si la
 * spécification sRGB en donne une autre. Rester sur celle de la norme, sinon
 * les ratios ne concordent plus avec les outils d'audit.
 */
function luminance([r, g, b]) {
  const c = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
}

/** Composition alpha d'une couche sur ce qui est déjà peint (« source-over »). */
function composer(dessus, dessous, alpha) {
  return dessus.map((v, i) => v * alpha + dessous[i] * (1 - alpha));
}

function ratio(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const hex = ([r, g, b]) =>
  '#' + [r, g, b].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');

/* ------------------------------------------------------------------ */
/* Analyse des couleurs telles qu'on les écrit dans le CSS             */

/**
 * Accepte « 38 88% 55% » et « 214 34% 12% / 0.1 » — la syntaxe même du
 * fichier de jetons, pour qu'un couple se recopie sans traduction.
 */
function analyser(chaine) {
  const [couleur, alpha] = chaine.split('/').map((x) => x.trim());
  const [h, s, l] = couleur.split(/\s+/).map((x) => parseFloat(x));
  return { rgb: hslVersRgb(h, s, l), alpha: alpha === undefined ? 1 : parseFloat(alpha) };
}

/**
 * Empile des couches et rend la couleur effectivement peinte.
 * L'ordre est celui du CSS : le premier élément est le plus BAS, le dernier
 * est celui qu'on voit par-dessus. La couche du bas doit être opaque.
 */
function aplatir(couches) {
  const pile = couches.map(analyser);
  if (pile[0].alpha !== 1) {
    throw new Error('La couche du bas doit être opaque : sinon on ne sait pas sur quoi elle est posée.');
  }
  return pile.reduce((acc, c) => composer(c.rgb, acc, c.alpha), pile[0].rgb);
}

/* ------------------------------------------------------------------ */
/* Les jetons de src/index.css                                         */

const J = {
  pierre: '40 31% 94%',
  lin: '41 29% 89%',
  ivoire: '0 0% 100%',
  marine: '217 45% 16%',
  encre: '216 41% 11%',
  ardoise: '217 17% 28%',
  zinc: '214 10% 40%',
  laiton: '38 88% 55%',
  laitonGlow: '38 88% 62%',
  laitonDisplay: '38 88% 36%',
  laitonInk: '38 88% 28%',
  /* Le texte second et le texte courant SOUS `.nuit`, sur le marine. */
  zincNuit: '40 22% 78%',
  ardoiseNuit: '40 22% 85%',
  destructive: '4 68% 48%',
  destructiveInk: '4 72% 32%',
  blanc: '0 0% 100%',
};

/**
 * Les couples réels du site — direction « La Plaque », 04/09/2026. `fond` est
 * une PILE : le premier élément est l'aplat opaque, les suivants sont les
 * voiles posés dessus.
 *
 * `seuil` : 4.5 pour du texte courant (WCAG 1.4.3), 3 pour un texte ≥ 24 px ou
 * un élément dont la perception est NÉCESSAIRE pour identifier un composant ou
 * son état (1.4.11), et `null` pour le purement décoratif — que la norme exclut
 * explicitement de 1.4.11.
 *
 * Trois fonds clairs et non un : le crème de la page, le lin des bandes
 * alternées, et le blanc des cartes. Une couleur de texte admise sur l'un doit
 * l'être sur les trois — c'est le blanc qui est le plus exigeant pour l'ambre.
 */
const COUPLES = [
  // ---- La décision structurante -----------------------------------
  { nom: 'laiton / pierre — ENSEIGNE EN TEXTE SUR FOND CLAIR', pp: J.laiton, fond: [J.pierre], seuil: 4.5,
    note: 'doit échouer — c\'est pourquoi l\'ambre s\'écrit foncé sur le crème' },
  { nom: 'laiton / marine — l\'enseigne sur les blocs sombres', pp: J.laiton, fond: [J.marine], seuil: 4.5 },

  // ---- Texte sur les trois fonds clairs -----------------------------
  { nom: 'encre / pierre', pp: J.encre, fond: [J.pierre], seuil: 4.5 },
  { nom: 'encre / lin', pp: J.encre, fond: [J.lin], seuil: 4.5 },
  { nom: 'encre / blanc', pp: J.encre, fond: [J.ivoire], seuil: 4.5 },
  { nom: 'ardoise / pierre (paragraphes)', pp: J.ardoise, fond: [J.pierre], seuil: 4.5 },
  { nom: 'ardoise / lin', pp: J.ardoise, fond: [J.lin], seuil: 4.5 },
  { nom: 'zinc / pierre (texte second)', pp: J.zinc, fond: [J.pierre], seuil: 4.5 },
  { nom: 'zinc / lin', pp: J.zinc, fond: [J.lin], seuil: 4.5 },
  { nom: 'zinc / blanc', pp: J.zinc, fond: [J.ivoire], seuil: 4.5 },
  { nom: 'primary-ink / pierre (étiquettes, cotes)', pp: J.laitonInk, fond: [J.pierre], seuil: 4.5 },
  { nom: 'primary-ink / lin', pp: J.laitonInk, fond: [J.lin], seuil: 4.5 },
  { nom: 'primary-ink / blanc', pp: J.laitonInk, fond: [J.ivoire], seuil: 4.5 },
  { nom: 'primary-display / pierre (mot en couleur d\'un titre ≥ 24 px)', pp: J.laitonDisplay, fond: [J.pierre], seuil: 3 },
  { nom: 'primary-display / lin', pp: J.laitonDisplay, fond: [J.lin], seuil: 3 },
  { nom: 'primary-display / blanc', pp: J.laitonDisplay, fond: [J.ivoire], seuil: 3 },
  { nom: 'destructive-ink / pierre', pp: J.destructiveInk, fond: [J.pierre], seuil: 4.5 },

  // ---- Sur le marine (`.nuit`) ---------------------------------------
  { nom: 'pierre / marine', pp: J.pierre, fond: [J.marine], seuil: 4.5 },
  { nom: 'zinc-nuit / marine (texte second des blocs)', pp: J.zincNuit, fond: [J.marine], seuil: 4.5 },
  { nom: 'ardoise-nuit / marine (paragraphes des blocs)', pp: J.ardoiseNuit, fond: [J.marine], seuil: 4.5 },
  { nom: 'laiton-glow / marine (survol)', pp: J.laitonGlow, fond: [J.marine], seuil: 4.5 },

  // ---- Les boutons ---------------------------------------------------
  { nom: 'pierre / marine — bouton principal sur le crème', pp: J.pierre, fond: [J.marine], seuil: 4.5 },
  { nom: 'encre / laiton — bouton principal sur le marine', pp: J.encre, fond: [J.laiton], seuil: 4.5 },
  { nom: 'blanc / laiton — POURQUOI ON NE MET PAS DE BLANC', pp: J.blanc, fond: [J.laiton], seuil: 4.5,
    note: 'doit échouer' },
  { nom: 'encre / laiton-glow (bouton survolé)', pp: J.encre, fond: [J.laitonGlow], seuil: 4.5 },
  { nom: 'marine / laiton — étiquette VENTE', pp: J.marine, fond: [J.laiton], seuil: 4.5 },

  // ---- LES VOILES : là où le piège se referme ----------------------
  { nom: 'zinc / lavis encre 4,5 % sur pierre (survol)', pp: J.zinc, fond: [J.pierre, `${J.encre} / 0.045`], seuil: 4.5 },
  { nom: 'encre / lavis encre 4,5 % sur pierre (survol)', pp: J.encre, fond: [J.pierre, `${J.encre} / 0.045`], seuil: 4.5 },
  { nom: 'zinc-nuit / lavis pierre 6 % sur marine (survol)', pp: J.zincNuit, fond: [J.marine, `${J.pierre} / 0.06`], seuil: 4.5 },
  { nom: 'laiton / lavis pierre 6 % sur marine', pp: J.laiton, fond: [J.marine, `${J.pierre} / 0.06`], seuil: 4.5 },
  { nom: 'primary-ink / voile laiton 8 % sur pierre (retour d\'envoi)', pp: J.laitonInk, fond: [J.pierre, `${J.laiton} / 0.08`], seuil: 4.5 },

  // ---- Filets : non textuels ----------------------------------------
  { nom: 'trait encre 14 % / pierre', pp: `${J.encre} / 0.14`, fond: [J.pierre], seuil: null,
    note: 'séparateur de sections : décoratif, exclu de 1.4.11' },
  { nom: 'bordure de bouton secondaire (encre pleine) / pierre', pp: J.encre, fond: [J.pierre], seuil: 3,
    note: 'c\'est la bordure qui identifie le bouton : 1.4.11 s\'applique' },
  { nom: 'bordure de bouton secondaire (pierre 50 %) / marine', pp: `${J.pierre} / 0.5`, fond: [J.marine], seuil: 3 },

  // ---- L'anneau de focus : 1.4.11 s'applique ------------------------
  { nom: 'anneau de focus, couche laiton seule / pierre', pp: J.laiton, fond: [J.pierre], seuil: null,
    note: 'informatif : insuffisant seul → d\'où la couche suivante' },
  { nom: 'anneau de focus, halo marine 85 % / pierre', pp: `${J.marine} / 0.85`, fond: [J.pierre], seuil: 3,
    note: 'c\'est cette couche qui porte l\'indicateur sur fond clair' },
  { nom: 'anneau de focus, couche laiton / marine', pp: J.laiton, fond: [J.marine], seuil: 3 },
];

/* ------------------------------------------------------------------ */
/* Exécution                                                           */

const filtre = process.argv[2]?.toLowerCase();
const couples = filtre ? COUPLES.filter((c) => c.nom.toLowerCase().includes(filtre)) : COUPLES;

if (couples.length === 0) {
  console.error(`Aucun couple ne correspond à « ${filtre} ».`);
  process.exit(1);
}

let echecsInattendus = 0;
const largeur = Math.max(...couples.map((c) => c.nom.length));

console.log('\nContrastes WCAG 2.1 · direction « La Plaque » · ' + couples.length + ' couples\n');

for (const couple of couples) {
  // Un premier plan peut lui-même être semi-transparent (un liseré) : on le
  // compose alors sur son propre fond avant de mesurer.
  const fond = aplatir(couple.fond);
  const pp = analyser(couple.pp);
  const premierPlan = pp.alpha === 1 ? pp.rgb : composer(pp.rgb, fond, pp.alpha);

  const r = ratio(premierPlan, fond);
  const decoratif = couple.seuil === null;
  const passe = decoratif || r >= couple.seuil;
  const attenduEchec = /doit échouer/.test(couple.note ?? '');

  if (!passe && !attenduEchec) echecsInattendus += 1;

  const verdict = decoratif
    ? 'décoratif'
    : passe
      ? 'OK'
      : attenduEchec
        ? 'ÉCHEC attendu'
        : 'ÉCHEC';
  const seuil = decoratif ? '  —  ' : `${couple.seuil}`.padStart(3) + '  ';
  console.log(
    `  ${couple.nom.padEnd(largeur)}  ${r.toFixed(2).padStart(6)}:1  ` +
      `seuil ${seuil} ${verdict.padEnd(13)} ${hex(premierPlan)} sur ${hex(fond)}`,
  );
  if (couple.note) console.log(`  ${' '.repeat(largeur)}  └─ ${couple.note}`);
}

console.log(
  echecsInattendus === 0
    ? '\nAucun échec inattendu.\n'
    : `\n${echecsInattendus} échec(s) INATTENDU(S) — à corriger.\n`,
);
process.exit(echecsInattendus === 0 ? 0 : 1);
