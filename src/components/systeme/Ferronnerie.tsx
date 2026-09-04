import { cn } from '@/lib/utils';

/**
 * L'ÉLÉVATION — le visuel d'ouverture, dessiné et non photographié.
 *
 * Les quatre images de banque des ouvertures (façade, clés et bail, hall aux
 * boîtes aux lettres, bureau) étaient générées, et cela se voyait : « les
 * images du hero font fausses » (client, 04/09/2026). Une agence qui vend la
 * connaissance d'un immeuble réel ne peut pas ouvrir sur un immeuble qui
 * n'existe pas.
 *
 * En attendant les photographies du 27 rue de Lisbonne — la vraie correction,
 * consignée dans REPRISE.md — l'ouverture porte un objet qui ne prétend rien :
 * l'ÉLÉVATION D'UNE FAÇADE HAUSSMANNIENNE AU TRAIT, le dessin d'architecte
 * que l'on trouve dans un dossier de copropriété. Toiture de zinc et lucarnes,
 * corniche, cinq niveaux de fenêtres, balcon filant au deuxième, soubassement
 * appareillé, porte cochère à fronton. Marine sur lin, trait de 1,25 px quelle
 * que soit l'échelle (`vector-effect`).
 *
 * Un premier essai — un garde-corps en motif répété — se lisait comme une
 * file de silhouettes ; un dessin abstrait répété n'est pas une façade. Ici
 * l'immeuble entier est dessiné une fois, et chaque page en CADRE UN DÉTAIL
 * (`motif`) : l'accueil montre l'élévation entière, la gérance le balcon du
 * deuxième, le syndic la porte cochère et le hall, l'agence les combles.
 *
 * Décoratif : `aria-hidden`, le titre voisin dit de quoi parle la page. Le
 * SVG pèse quelques kilo-octets inline et il est net à toute densité d'écran —
 * ce qu'aucune des images qu'il remplace n'était sur un écran Retina.
 */
interface ProprietesFerronnerie {
  className?: string;
  /** Le cadrage : 0 façade entière · 1 le balcon · 2 la porte · 3 les combles. */
  motif?: 0 | 1 | 2 | 3;
}

const CADRAGES = ['0 0 480 360', '110 200 260 195', '140 250 200 150', '40 22 280 210'];

/** Les six travées, largeur de fenêtre 30, pas de 75. */
const TRAVEES = [30, 105, 180, 255, 330, 405];
/** Le haut de chaque niveau de fenêtres, du cinquième au premier. */
const NIVEAUX = [86, 146, 206, 266];

const Ferronnerie = ({ className, motif = 0 }: ProprietesFerronnerie) => {
  const trait = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.25, vectorEffect: 'non-scaling-stroke' as const };
  const fin = { ...trait, strokeWidth: 0.8, opacity: 0.75 };

  return (
    <div aria-hidden className={cn('relative overflow-hidden bg-lin text-marine', className)}>
      <svg
        viewBox={CADRAGES[motif]}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        role="presentation"
      >
        {/* ---- Toiture : brisis de zinc, trois lucarnes, souches ---------- */}
        <path d="M0 74 L44 36 H436 L480 74" {...trait} />
        <path d="M60 36 V22 H72 V36 M400 36 V20 H414 V36" {...trait} />
        {[110, 226, 342].map((x) => (
          <g key={x}>
            <path d={`M${x} 60 V44 L${x + 14} 34 L${x + 28} 44 V60`} {...trait} />
            <rect x={x + 6} y={44} width={16} height={16} {...fin} />
            <path d={`M${x + 14} 44 V60`} {...fin} />
          </g>
        ))}
        {/* Filets du zinc */}
        {[46, 56, 66].map((y) => (
          <path key={y} d={`M${44 - (y - 36) * 1.16} ${y} H${436 + (y - 36) * 1.16}`} {...fin} />
        ))}

        {/* ---- Corniche et bandeaux d'étage --------------------------------- */}
        <path d="M0 74 H480 M0 80 H480" {...trait} />
        {[140, 200, 260, 320].map((y) => (
          <path key={y} d={`M0 ${y} H480`} {...fin} />
        ))}

        {/* ---- Les fenêtres : cinq niveaux, six travées -------------------- */}
        {NIVEAUX.map((y, niveau) =>
          TRAVEES.map((x) => (
            <g key={`${niveau}-${x}`}>
              {/* Le chambranle, puis les vantaux et l'imposte */}
              <rect x={x} y={y} width={30} height={46} {...trait} />
              <path d={`M${x + 15} ${y} V${y + 46} M${x} ${y + 12} H${x + 30}`} {...fin} />
              {/* L'appui, et la console sous l'appui */}
              <path d={`M${x - 4} ${y + 46} H${x + 34}`} {...trait} />
              {niveau < 3 && (
                <path d={`M${x + 2} ${y + 46} l-3 6 M${x + 28} ${y + 46} l3 6`} {...fin} />
              )}
              {/* Garde-corps individuel aux niveaux sans balcon filant */}
              {niveau !== 3 && (
                <g>
                  <path d={`M${x - 2} ${y + 46} V${y + 36} H${x + 32} V${y + 46}`} {...fin} />
                  {[4, 10, 16, 22, 28].map((dx) => (
                    <path key={dx} d={`M${x + dx} ${y + 36} V${y + 46}`} {...fin} />
                  ))}
                </g>
              )}
            </g>
          )),
        )}

        {/* ---- Le balcon filant du deuxième : dalle, consoles, ferronnerie -- */}
        <rect x={8} y={312} width={464} height={4} {...trait} />
        <path d="M8 298 H472 M8 312 V298 M472 312 V298" {...trait} />
        {Array.from({ length: 58 }, (_, i) => 12 + i * 8).map((x) => (
          <path key={x} d={`M${x} 298 V312`} {...fin} />
        ))}
        {Array.from({ length: 29 }, (_, i) => 12 + i * 16).map((x) => (
          <path key={x} d={`M${x} 305 q4 -5 8 0 q4 5 8 0`} {...fin} />
        ))}
        {TRAVEES.map((x) => (
          <path key={x} d={`M${x + 4} 316 l-4 8 M${x + 26} 316 l4 8`} {...fin} />
        ))}

        {/* ---- Le soubassement appareillé et la porte cochère à fronton ---- */}
        <path d="M0 360 H480" {...trait} />
        {[332, 344, 356].map((y) => (
          <path key={y} d={`M0 ${y} H480`} {...fin} />
        ))}
        {[60, 140, 300, 380, 440].map((x) => (
          <path key={x} d={`M${x} 320 V332 M${x + 40} 332 V344 M${x} 344 V356`} {...fin} />
        ))}
        {/* La porte cochère, sous le balcon : deux vantaux, imposte, clé de
            voûte, deux lanternes. Elle tient entre le bandeau (320) et le sol
            (360) : la première version montait jusqu'au balcon et le fronton
            traversait la dalle. */}
        <rect x={220} y={324} width={40} height={36} fill="hsl(var(--lin))" {...trait} />
        <path d="M240 324 V360 M220 334 H260 M230 334 V360 M250 334 V360" {...fin} />
        <path d="M236 320 H244 V324 H236 Z" {...trait} />
        <path d="M212 320 H268" {...trait} />
        <path d="M204 336 v-8 l3 -3 h4 l3 3 v8 z M266 336 v-8 l3 -3 h4 l3 3 v8 z" {...fin} />
        <path d="M209 336 V344 M273 336 V344" {...fin} />
      </svg>
      <span className="pointer-events-none absolute inset-0 border border-[hsl(var(--trait)/var(--trait-a))]" />
    </div>
  );
};

export default Ferronnerie;
