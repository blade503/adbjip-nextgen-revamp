import logo from '@/assets/logo-jobard-immobilier.svg';

/**
 * Logo de l'agence — l'ellipse jaune, la tour Eiffel et « Jobard Immobilier ».
 *
 * REMPLACÉ LE 20/10/2026. Le précédent était une reconstruction en primitives
 * du logo « JIP » de adbjip.fr (115 × 52 px, ellipse inclinée de 27,7°, jaune
 * #F5AC1E). Celui-ci vient du client, en JPEG de 608 × 535 sur fond blanc, et a
 * été VECTORISÉ (potrace, source suréchantillonnée ×4) : net à toute taille et
 * sur écran Retina, 9,4 Ko gzip, fichier à part et donc en cache immuable au
 * lieu d'alourdir le JS d'entrée de chaque page.
 *
 * LES LETTRES ET LA TOUR SONT ÉVIDÉES, et non peintes en blanc : un seul tracé,
 * le jaune. Dans la source, le « d » de Jobard, le « r » d'Immobilier et les
 * pieds de la tour débordent de l'ellipse — blanc sur blanc, donc invisibles.
 * Peints en blanc sur le crème, ils apparaissaient rognés au bord de l'ellipse ;
 * évidés, ils prennent la couleur du fond comme ils prenaient le blanc, et
 * restent entiers. Contrepartie : posé sur un fond sombre, le logo y prendrait
 * des lettres sombres.
 *
 * C'est un tracé du fichier reçu, pas l'original vectoriel. Si le client
 * retrouve celui-ci (.ai, .eps ou .pdf), il remplace ce fichier sans discussion.
 *
 * Le jaune (#F9B320, médiane des pixels de la source) est celui de l'enseigne,
 * pas le --primary du site. Volontaire : un logo garde sa couleur, il ne suit
 * pas la charte du support.
 */
const LogoJIP = ({ className = '' }: { className?: string }) => (
  <img src={logo} alt="Jobard Immobilier" width={608} height={535} className={className} />
);

export default LogoJIP;
