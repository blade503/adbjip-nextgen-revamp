/**
 * Logo de l'agence, reconstruit en vectoriel.
 *
 * L'original disponible en ligne (adbjip.fr/images/logo.png) fait 115 × 52
 * pixels : illisible sur un écran retina et impossible à agrandir. Cette
 * version a été relevée sur ce fichier au pixel près — ellipse inclinée de
 * 27,7°, demi-axes 30,7 × 21,8, jaune #F5AC1E — puis redessinée en primitives.
 *
 * C'est une reconstruction, pas le fichier source. Si le client retrouve
 * l'original vectoriel (.ai, .eps ou .pdf) chez le créateur du logo, il
 * remplace celui-ci sans discussion.
 *
 * Le jaune est celui de l'enseigne, plus orangé que le --primary du site.
 * Volontaire : un logo garde sa couleur, il ne suit pas la charte du support.
 */
const LogoJIP = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 115 52"
    className={className}
    role="img"
    aria-label="JIP — Jobard Immobilier Paris"
  >
    <ellipse
      cx="48.5"
      cy="24.5"
      rx="30.7"
      ry="21.8"
      transform="rotate(-27.7 48.5 24.5)"
      fill="#F5AC1E"
    />
    <g fill="#fff">
      <path d="M34 10h5v23a8 8 0 0 1-16 0v-2.5h5V33a3 3 0 0 0 6 0z" />
      <rect x="46" y="10" width="4.5" height="30" />
      <path d="M57 10h5v29h-5z" />
      <path d="M62 10a10 10 0 0 1 0 20v-5a5 5 0 0 0 0-10z" />
    </g>
  </svg>
);

export default LogoJIP;
