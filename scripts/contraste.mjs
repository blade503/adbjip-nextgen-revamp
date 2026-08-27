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
  nuit: '212 34% 9%',
  marine: '217 40% 15%',
  pierre: '40 26% 94%',
  ivoire: '40 30% 97%',
  encre: '214 34% 12%',
  zinc: '213 16% 66%',
  laiton: '38 88% 55%',
  laitonGlow: '38 88% 62%',
  laitonDisplay: '38 88% 36%',
  laitonInk: '38 88% 28%',
  mutedForeground: '215 14% 40%',
  destructive: '4 68% 48%',
  destructiveInk: '4 72% 32%',
  blanc: '0 0% 100%',
};

/**
 * Les couples réels du site. `fond` est une PILE : le premier élément est
 * l'aplat opaque, les suivants sont les voiles posés dessus.
 *
 * `seuil` : 4.5 pour du texte courant (WCAG 1.4.3), 3 pour un texte ≥ 24 px ou
 * un élément dont la perception est NÉCESSAIRE pour identifier un composant ou
 * son état (1.4.11), et `null` pour le purement décoratif — que la norme exclut
 * explicitement de 1.4.11.
 *
 * La distinction n'est pas un confort : la première version de ce fichier
 * mettait un seuil de 3 sur le liseré des plaques et sur les filets de
 * séparation. Les deux échouaient, et le script criait à la faute là où il n'y
 * en avait pas. Un outil qui crie à tort finit par être ignoré, ce qui est pire
 * que de ne pas l'avoir écrit.
 */
const COUPLES = [
  // ---- La décision structurante -----------------------------------
  { nom: 'laiton / pierre — ENSEIGNE EN TEXTE SUR FOND CLAIR', pp: J.laiton, fond: [J.pierre], seuil: 4.5,
    note: 'doit échouer — c\'est ce constat qui rend la coquille sombre' },
  { nom: 'laiton / nuit — la même enseigne sur le fond sombre', pp: J.laiton, fond: [J.nuit], seuil: 4.5 },
  { nom: 'laiton / marine', pp: J.laiton, fond: [J.marine], seuil: 4.5 },

  // ---- Fond clair --------------------------------------------------
  { nom: 'encre / pierre', pp: J.encre, fond: [J.pierre], seuil: 4.5 },
  { nom: 'encre / ivoire', pp: J.encre, fond: [J.ivoire], seuil: 4.5 },
  { nom: 'muted-foreground / pierre', pp: J.mutedForeground, fond: [J.pierre], seuil: 4.5 },
  { nom: 'primary-ink / pierre', pp: J.laitonInk, fond: [J.pierre], seuil: 4.5 },
  { nom: 'primary-display / pierre (titres ≥ 24 px)', pp: J.laitonDisplay, fond: [J.pierre], seuil: 3 },
  { nom: 'destructive-ink / pierre', pp: J.destructiveInk, fond: [J.pierre], seuil: 4.5 },

  // ---- Fond de nuit ------------------------------------------------
  { nom: 'pierre / nuit', pp: J.pierre, fond: [J.nuit], seuil: 4.5 },
  { nom: 'pierre / marine', pp: J.pierre, fond: [J.marine], seuil: 4.5 },
  { nom: 'zinc / nuit', pp: J.zinc, fond: [J.nuit], seuil: 4.5 },
  { nom: 'zinc / marine', pp: J.zinc, fond: [J.marine], seuil: 4.5 },
  { nom: 'laiton-glow / nuit (survol)', pp: J.laitonGlow, fond: [J.nuit], seuil: 4.5 },

  // ---- Sur aplat de laiton (boutons, étiquettes) -------------------
  { nom: 'marine / laiton — premier plan des boutons', pp: J.marine, fond: [J.laiton], seuil: 4.5 },
  { nom: 'blanc / laiton — POURQUOI ON NE MET PAS DE BLANC', pp: J.blanc, fond: [J.laiton], seuil: 4.5,
    note: 'doit échouer' },
  { nom: 'marine / laiton-glow (bouton survolé)', pp: J.marine, fond: [J.laitonGlow], seuil: 4.5 },

  // ---- LES VOILES : là où le piège se referme ----------------------
  { nom: 'primary-ink / voile laiton 10 % sur pierre', pp: J.laitonInk, fond: [J.pierre, `${J.laiton} / 0.10`], seuil: 4.5,
    note: 'le cas qui a fait descendre --primary-ink de 30 % à 28 % de clarté' },
  { nom: 'muted-foreground / voile laiton 10 % sur pierre', pp: J.mutedForeground, fond: [J.pierre, `${J.laiton} / 0.10`], seuil: 4.5 },
  { nom: 'muted-foreground / lavis encre 4,5 % sur pierre', pp: J.mutedForeground, fond: [J.pierre, `${J.encre} / 0.045`], seuil: 4.5 },
  { nom: 'encre / lavis encre 4,5 % sur pierre (survol)', pp: J.encre, fond: [J.pierre, `${J.encre} / 0.045`], seuil: 4.5 },
  { nom: 'zinc / lavis pierre 5,5 % sur nuit (survol)', pp: J.zinc, fond: [J.nuit, `${J.pierre} / 0.055`], seuil: 4.5 },
  { nom: 'laiton / lavis pierre 5,5 % sur nuit', pp: J.laiton, fond: [J.nuit, `${J.pierre} / 0.055`], seuil: 4.5 },
  { nom: 'pierre / lavis pierre 5,5 % sur nuit', pp: J.pierre, fond: [J.nuit, `${J.pierre} / 0.055`], seuil: 4.5 },

  // ---- Filets et liserés : non textuels, seuil 3:1 -----------------
  { nom: 'liseré laiton 42 % / marine', pp: `${J.laiton} / 0.42`, fond: [J.marine], seuil: null,
    note: 'décoratif : la limite qui identifie un bouton est son APLAT (laiton/nuit 8,91:1), pas le filet gravé à l\'intérieur' },
  { nom: 'trait encre 14 % / pierre', pp: `${J.encre} / 0.14`, fond: [J.pierre], seuil: null,
    note: 'séparateur de sections : décoratif, exclu de 1.4.11' },

  // ---- L'anneau de focus : 1.4.11 s'applique, lui -------------------
  // Ce qui doit atteindre 3:1 est L'INDICATEUR, pas chacune de ses couches.
  // Le laiton seul échoue sur la pierre — c'est précisément pour cela que le
  // halo marine existe. Mesurer le laiton isolément, c'est mesurer la mauvaise
  // chose et conclure à une faute qui n'en est pas une.
  { nom: 'anneau de focus, couche laiton seule / pierre', pp: J.laiton, fond: [J.pierre], seuil: null,
    note: 'informatif : 1,81:1, insuffisant seul → d\'où la couche suivante' },
  { nom: 'anneau de focus, halo marine 85 % / pierre', pp: `${J.marine} / 0.85`, fond: [J.pierre], seuil: 3,
    note: 'c\'est cette couche qui porte l\'indicateur sur fond clair' },
  { nom: 'anneau de focus, couche laiton / nuit', pp: J.laiton, fond: [J.nuit], seuil: 3,
    note: 'sur la nuit, le laiton suffit à lui seul' },
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

console.log('\nContrastes WCAG 2.1 · charte « Le hall » · ' + couples.length + ' couples\n');

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
