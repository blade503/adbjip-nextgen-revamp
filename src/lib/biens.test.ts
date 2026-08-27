import { describe, expect, it } from 'vitest';

import {
  NEW_WINDOW_DAYS,
  type Bien,
  eur,
  feeNote,
  isNew,
  legalLines,
  locationLabel,
  percent,
  priceDrop,
  segmentsOrdinaux,
} from '@/lib/biens';
import { classesGrille } from '@/lib/grille';

/**
 * Tests de la logique pure du portefeuille.
 *
 * PÉRIMÈTRE : les fonctions de `src/lib/`. Aucun test de composant — ce qui se
 * voit se vérifie par capture d'écran regardée. Ce qui est testé ici est ce qui
 * se calcule, et notamment ce qui a une conséquence légale : un prix sans sa
 * mention d'honoraires est une infraction, pas un défaut de mise en page.
 */

const JOUR = 24 * 60 * 60 * 1000;

/** Un bien minimal, à surcharger champ par champ selon le cas testé. */
const bien = (patch: Partial<Bien> = {}): Bien =>
  ({
    id: 'x',
    reference: 'REF',
    slug: 'ref',
    transaction: 'vente',
    propertyType: 'flat',
    propertyLabel: 'Appartement',
    title: 'Trois pièces',
    titleIsFallback: false,
    description: '',
    city: 'Paris',
    postalCode: '75008',
    district: '',
    price: null,
    priceWithoutFees: null,
    pricePerSquareMeter: null,
    feePercentage: null,
    feesChargedTo: null,
    charges: null,
    safetyDeposit: null,
    agencyRentalFee: null,
    annualCondominiumFees: null,
    condominiumParts: null,
    surface: null,
    rooms: null,
    bedrooms: null,
    floor: null,
    features: {
      elevator: false, cellar: false, balcony: false, terrace: false,
      fireplace: false, caretaker: false, separateToilet: false,
      inCondominium: false, parkingPlaces: 0,
    },
    dpe: {
      energyValue: null, energyClass: null, gesValue: null, gesClass: null,
      date: null, minEnergyConsumption: null, maxEnergyConsumption: null,
    },
    photos: [],
    publicationDate: null,
    modificationDate: null,
    ...patch,
  }) as Bien;

/* ------------------------------------------------------------------ */

describe('formatage', () => {
  it('formate un prix en euros sans décimales', () => {
    // Espace insécable étroit dans le format fr-FR : on normalise avant de
    // comparer, sinon le test dépend de la version d'ICU du système.
    expect(eur(580000).replace(/\s/g, ' ')).toBe('580 000 €');
  });

  it('n’arrondit pas un prix vers le haut', () => {
    expect(eur(14000).replace(/\s/g, ' ')).toBe('14 000 €');
  });

  it('écrit 12 et non 12,00 pour un taux entier', () => {
    expect(percent(12)).toBe('12');
  });

  it('conserve les décimales significatives d’un taux', () => {
    // Le portefeuille réel contient 5,405405…, à afficher 5,41 et pas 5,4.
    expect(percent(5.405405405405405)).toBe('5,41');
    expect(percent(2.6548672566371683)).toBe('2,65');
  });
});

describe('fenêtre de nouveauté', () => {
  const maintenant = Date.UTC(2026, 7, 27);

  it('dit nouveau ce qui est entré hier', () => {
    expect(isNew(bien({ firstSeenAt: new Date(maintenant - JOUR).toISOString() }), maintenant)).toBe(true);
  });

  it('ne dit plus nouveau au-delà de la fenêtre', () => {
    const trop = new Date(maintenant - (NEW_WINDOW_DAYS + 1) * JOUR).toISOString();
    expect(isNew(bien({ firstSeenAt: trop }), maintenant)).toBe(false);
  });

  it('inclut la veille de la borne et exclut la borne', () => {
    const veille = new Date(maintenant - (NEW_WINDOW_DAYS * JOUR - 1)).toISOString();
    const borne = new Date(maintenant - NEW_WINDOW_DAYS * JOUR).toISOString();
    expect(isNew(bien({ firstSeenAt: veille }), maintenant)).toBe(true);
    expect(isNew(bien({ firstSeenAt: borne }), maintenant)).toBe(false);
  });

  it('N’EST PAS nouveau quand l’ancienneté est inconnue', () => {
    // Le cas de quatre annonces sur cinq du portefeuille réel : ni firstSeenAt
    // ni publicationDate. Dater d’aujourd’hui les ferait toutes passer pour
    // nouvelles — c’est précisément ce que fetch-biens.mjs refuse de faire.
    expect(isNew(bien(), maintenant)).toBe(false);
  });

  it('retombe sur la date de publication si firstSeenAt manque', () => {
    expect(isNew(bien({ publicationDate: new Date(maintenant - 2 * JOUR).toISOString() }), maintenant)).toBe(true);
  });

  it('ne dit pas nouveau une date future', () => {
    // Une horloge mal réglée côté source ne doit pas produire un tag permanent.
    expect(isNew(bien({ firstSeenAt: new Date(maintenant + JOUR).toISOString() }), maintenant)).toBe(false);
  });
});

describe('baisse de prix', () => {
  it('calcule le montant et le pourcentage', () => {
    const d = priceDrop(bien({ price: 580000, previousPrice: 620000 }));
    expect(d).not.toBeNull();
    expect(d!.amount).toBe(40000);
    expect(d!.percent).toBeCloseTo(6.4516, 3);
  });

  it('ignore une hausse', () => {
    expect(priceDrop(bien({ price: 620000, previousPrice: 580000 }))).toBeNull();
  });

  it('ignore un prix inchangé', () => {
    expect(priceDrop(bien({ price: 580000, previousPrice: 580000 }))).toBeNull();
  });

  it('ignore l’absence d’historique', () => {
    expect(priceDrop(bien({ price: 580000 }))).toBeNull();
  });

  it('ignore un prix sur demande', () => {
    expect(priceDrop(bien({ price: null, previousPrice: 580000 }))).toBeNull();
  });
});

describe('mentions d’honoraires — obligation légale', () => {
  it('vente : taux TTC et partie qui le supporte', () => {
    const n = feeNote(bien({ price: 390000, feePercentage: 5.405405405405405, feesChargedTo: 'acquéreur' }));
    expect(n).toBe("Honoraires 5,41 % TTC à la charge de l'acquéreur");
  });

  it('vente : rien plutôt qu’une mention incomplète', () => {
    // Sans la partie qui les supporte, la mention n’est pas conforme : mieux
    // vaut ne rien afficher et que le manque se voie côté agence.
    expect(feeNote(bien({ price: 390000, feePercentage: 3, feesChargedTo: null }))).toBe('');
    expect(feeNote(bien({ price: 390000, feePercentage: null, feesChargedTo: 'acquéreur' }))).toBe('');
  });

  it('location : charges ET honoraires du locataire', () => {
    // Réf. G60 du portefeuille réel. Les honoraires locataire manquaient.
    const n = feeNote(bien({ transaction: 'location', price: 85, charges: 15, agencyRentalFee: 120 }));
    expect(n).toContain('de charges par mois');
    expect(n).toContain('honoraires locataire');
    expect(n.replace(/\s/g, ' ')).toContain('120 € TTC');
  });

  it('location : les honoraires seuls suffisent si les charges sont inconnues', () => {
    const n = feeNote(bien({ transaction: 'location', price: 85, agencyRentalFee: 120 }));
    expect(n.startsWith('honoraires locataire')).toBe(true);
  });

  it('mentions complètes : la vente cite le prix hors honoraires et le taux', () => {
    const l = legalLines(bien({
      price: 390000, priceWithoutFees: 370000,
      feePercentage: 5.405405405405405, feesChargedTo: 'acquéreur',
    }));
    expect(l.some((x) => x.includes('honoraires inclus'))).toBe(true);
    expect(l.some((x) => x.includes('Prix hors honoraires'))).toBe(true);
    expect(l.some((x) => x.includes("à la charge de l'acquéreur"))).toBe(true);
  });

  it('mentions complètes : la copropriété cite les lots et les charges', () => {
    const l = legalLines(bien({
      price: 390000, condominiumParts: 24, annualCondominiumFees: 1800,
      features: { ...bien().features, inCondominium: true },
    }));
    const copro = l.find((x) => x.includes('copropriété'));
    expect(copro).toContain('24 lots');
    expect(copro?.replace(/\s/g, ' ')).toContain('1 800 €');
  });

  it('mentions complètes : la location cite loyer, charges, dépôt et honoraires', () => {
    const l = legalLines(bien({
      transaction: 'location', price: 85, charges: 15,
      safetyDeposit: 85, agencyRentalFee: 120,
    }));
    expect(l.some((x) => x.includes('Loyer mensuel'))).toBe(true);
    expect(l.some((x) => x.includes('Provision mensuelle sur charges'))).toBe(true);
    expect(l.some((x) => x.includes('Dépôt de garantie'))).toBe(true);
    expect(l.some((x) => x.includes('à la charge du locataire'))).toBe(true);
  });

  it('mentions complètes : aucune ligne inventée quand tout manque', () => {
    expect(legalLines(bien())).toEqual([]);
  });
});

describe('libellé de localisation', () => {
  it('joint ville et quartier', () => {
    expect(locationLabel(bien({ city: 'Paris 16e', district: 'Auteuil-Nord' }))).toBe('Paris 16e · Auteuil-Nord');
  });

  it('ne répète pas la ville quand la source la donne aussi comme quartier', () => {
    // Le cas des petites communes : L’Houmeau / L’Houmeau.
    expect(locationLabel(bien({ city: "L'Houmeau", district: "L'Houmeau" }))).toBe("L'Houmeau");
  });
});

describe('portefeuille vide ou réduit', () => {
  it('ne réserve pas trois colonnes pour un seul bien', () => {
    // Une grille à trois colonnes qui n’en reçoit qu’un l’affiche coincé à
    // gauche avec deux tiers de vide : l’écran a l’air cassé.
    expect(classesGrille(0)).toContain('max-w');
    expect(classesGrille(1)).toContain('max-w');
    expect(classesGrille(1)).not.toContain('grid-cols-3');
  });

  it('borne la largeur à deux biens', () => {
    expect(classesGrille(2)).toContain('sm:grid-cols-2');
    expect(classesGrille(2)).toContain('max-w');
    expect(classesGrille(2)).not.toContain('lg:grid-cols-3');
  });

  it('passe à trois colonnes dès trois biens', () => {
    expect(classesGrille(3)).toContain('lg:grid-cols-3');
  });

  it('respecte un maximum de deux colonnes quand on le demande', () => {
    expect(classesGrille(5, { max: 2 })).toBe('sm:grid-cols-2');
  });
});

describe('portefeuille réellement présent sur disque', () => {
  it('accompagne chaque prix de vente affiché d’une mention d’honoraires', async () => {
    // Garde-fou sur les données réelles : si l’agence publie une vente sans
    // taux d’honoraires, le test tombe et on le voit avant le déploiement.
    const { ventes } = await import('@/lib/biens');
    const sansMention = ventes.filter((v) => v.price != null && feeNote(v) === '');
    expect(sansMention.map((v) => v.reference)).toEqual([]);
  });

  it('accompagne chaque loyer affiché d’une mention', async () => {
    const { locations } = await import('@/lib/biens');
    const sansMention = locations.filter((l) => l.price != null && feeNote(l) === '');
    expect(sansMention.map((l) => l.reference)).toEqual([]);
  });
});

describe('segmentsOrdinaux', () => {
  it('laisse un texte sans exposant en un seul segment', () => {
    expect(segmentsOrdinaux('Paris 8e arrondissement')).toEqual([
      { texte: 'Paris 8e arrondissement' },
    ]);
  });

  it('isole un exposant au milieu du texte', () => {
    // Le cas réel, relevé dans data/biens.json : « du 20ᵉ arrondissement ».
    expect(segmentsOrdinaux('du 20ᵉ arrondissement')).toEqual([
      { texte: 'du 20' },
      { texte: 'e', exposant: true },
      { texte: ' arrondissement' },
    ]);
  });

  it('fusionne des exposants consécutifs', () => {
    // « 1ᵉʳ » doit produire UN <sup> contenant « er », pas deux.
    expect(segmentsOrdinaux('1ᵉʳ étage')).toEqual([
      { texte: '1' },
      { texte: 'er', exposant: true },
      { texte: ' étage' },
    ]);
  });

  it('gère un exposant en fin de chaîne', () => {
    expect(segmentsOrdinaux('Paris 8ᵉ')).toEqual([
      { texte: 'Paris 8' },
      { texte: 'e', exposant: true },
    ]);
  });

  it('renvoie une liste vide pour une chaîne vide', () => {
    expect(segmentsOrdinaux('')).toEqual([]);
  });

  it('ne perd aucun caractère : la concaténation reconstitue le texte', () => {
    const source = 'Situé au 3ᵉ étage du 20ᵉ arrondissement, 1ᵉʳ lot.';
    const reconstitue = segmentsOrdinaux(source)
      .map((segment) => segment.texte)
      .join('');
    // Les exposants sont normalisés en lettres simples : c'est la seule
    // différence attendue entre la source et le rendu.
    expect(reconstitue).toBe(source.replace(/ᵉ/g, 'e').replace(/ʳ/g, 'r'));
  });

  it("n'introduit aucun segment superflu sur une description sans exposant", () => {
    expect(segmentsOrdinaux('Appartement 3 pièces, 62 m², balcon.')).toHaveLength(1);
  });

  it("aucune description réelle ne conserve d'exposant hors <sup>", async () => {
    // Deux tests de ce fichier portent déjà sur les données réelles. Celui-ci
    // garantit que le découpage couvre tout ce que l'agence a effectivement
    // écrit — une annonce future contenant « 1ᵉʳ » le ferait tomber si le jeu
    // de caractères traités était incomplet.
    const { ventes, locations } = await import('@/lib/biens');
    for (const bien of [...ventes, ...locations]) {
      for (const champ of [bien.title, bien.description]) {
        for (const segment of segmentsOrdinaux(champ)) {
          if (segment.exposant) continue;
          expect(segment.texte).not.toMatch(/[\u1D49\u1D57\u02B3\u1D48]/);
        }
      }
    }
  });
});
