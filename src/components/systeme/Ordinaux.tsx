import { segmentsOrdinaux } from '@/lib/biens';

/**
 * Rend un texte en gravant ses exposants ordinaux dans un `<sup>`.
 *
 * À employer sur TOUT texte libre venant de l'agence — titre et description
 * d'annonce — parce qu'on ne maîtrise pas ce qui y est saisi. `ᵉ` (U+1D49) est
 * hors du sous-ensemble latin de Google Fonts : laissé tel quel, il tombe dans
 * une police système au milieu du mot et « 20ᵉ » se lit « 20° ».
 *
 * Le découpage est fait par `segmentsOrdinaux`, une fonction pure et testée. Ce
 * composant n'insère jamais de HTML brut : il rend des nœuds React, ce qui
 * exclut toute injection depuis la source de données.
 */
const Ordinaux = ({ texte }: { texte: string }) => (
  <>
    {segmentsOrdinaux(texte).map((segment, i) =>
      segment.exposant ? <sup key={i}>{segment.texte}</sup> : segment.texte,
    )}
  </>
);

export default Ordinaux;
