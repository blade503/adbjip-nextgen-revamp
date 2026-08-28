import { describe, expect, it } from 'vitest';

import { champsInvalides, lienMailto } from './formulaire';

/**
 * La validation côté client, ajoutée le 28/08/2026. Elle existe pour deux
 * raisons mesurées : le formulaire porte `noValidate`, donc rien ne contrôlait
 * quoi que ce soit avant l'aller-retour réseau ; et « Prénom * » était annoncé
 * obligatoire alors que `contact.php` ne voit qu'un champ « nom » où prénom et
 * nom sont concaténés.
 */
describe('champsInvalides', () => {
  const complet = () => [
    { nom: 'prenom', valeur: 'Camille', requis: true },
    { nom: 'nom', valeur: 'Jobard', requis: true },
    { nom: 'email', valeur: 'camille@example.com', requis: true, format: 'email' as const },
    { nom: 'message', valeur: 'Bonjour, je cherche un syndic.', requis: true },
  ];

  it('ne signale rien quand tout est rempli', () => {
    expect(champsInvalides(complet())).toEqual([]);
  });

  it('signale un champ requis vide', () => {
    const regles = complet();
    regles[0].valeur = '';
    expect(champsInvalides(regles)).toEqual(['prenom']);
  });

  it("signale un champ qui ne contient que des espaces", () => {
    const regles = complet();
    regles[3].valeur = '   \n  ';
    expect(champsInvalides(regles)).toEqual(['message']);
  });

  it('signale tous les champs fautifs, dans l\'ordre du formulaire', () => {
    expect(
      champsInvalides([
        { nom: 'prenom', valeur: '', requis: true },
        { nom: 'nom', valeur: '', requis: true },
        { nom: 'email', valeur: 'pas-une-adresse', requis: true, format: 'email' },
        { nom: 'message', valeur: 'ok', requis: true },
      ]),
    ).toEqual(['prenom', 'nom', 'email']);
  });

  it('accepte les adresses valides que les motifs stricts rejettent souvent', () => {
    for (const valeur of [
      'prenom+etiquette@example.com',
      "o'neill@example.co.uk",
      'a@b.io',
      'contact@sous.domaine.example.museum',
    ]) {
      expect(champsInvalides([{ nom: 'email', valeur, requis: true, format: 'email' }])).toEqual([]);
    }
  });

  it('refuse ce qui ne peut pas être une adresse', () => {
    for (const valeur of ['sans-arobase', 'deux@@example.com', 'a@b', 'a@b.c', 'a b@example.com']) {
      expect(champsInvalides([{ nom: 'email', valeur, requis: true, format: 'email' }])).toEqual([
        'email',
      ]);
    }
  });

  it("ne contrôle pas la forme d'un champ facultatif laissé vide", () => {
    expect(champsInvalides([{ nom: 'email', valeur: '', format: 'email' }])).toEqual([]);
  });

  it('ne signale jamais un champ facultatif rempli correctement', () => {
    expect(champsInvalides([{ nom: 'telephone', valeur: '01 42 25 78 24' }])).toEqual([]);
  });
});

describe('lienMailto', () => {
  it("construit un mailto avec l'objet du bon formulaire", () => {
    const lien = lienMailto({
      type: 'estimation',
      nom: 'Camille Jobard',
      email: 'camille@example.com',
      message: 'Bonjour',
    });
    expect(lien).toContain('mailto:j.immo.p@orange.fr');
    expect(lien).toContain(encodeURIComponent("Demande d'estimation depuis le site"));
    expect(lien).toContain(encodeURIComponent('Camille Jobard'));
  });

  it('omet les champs vides plutôt que de les écrire à vide', () => {
    const lien = lienMailto({ type: 'contact', nom: 'A', email: 'a@b.io', message: 'x' });
    expect(decodeURIComponent(lien)).not.toContain('Téléphone :');
    expect(decodeURIComponent(lien)).not.toContain('Service :');
  });
});
