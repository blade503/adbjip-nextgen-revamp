import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import BandeauContact from '@/components/systeme/BandeauContact';
import BarreAppel from '@/components/systeme/BarreAppel';
import EnTetePage from '@/components/systeme/EnTetePage';
import { Calage, Voile } from '@/components/systeme/Ouverture';
import { ENTITES, EQUIPE } from '@/config/legal';
import { echelonner } from '@/lib/echelon';
import Ferronnerie from '@/components/systeme/Ferronnerie';
import francisImage from '@/assets/equipe-francis-jobard.webp';
import francisImage440 from '@/assets/equipe-francis-jobard-440.webp';
import florentImage from '@/assets/equipe-florent-jobard.webp';
import florentImage440 from '@/assets/equipe-florent-jobard-440.webp';

/**
 * L'AGENCE — planche 2g de la direction « La Plaque », fusion de deux pages.
 *
 * L'ancienne page « L'équipe » (/equipe, deux fiches, trois valeurs) est
 * absorbée ici : deux interlocuteurs, c'est une agence, pas une équipe. L'URL
 * redirige (`public/.htaccess`).
 *
 * TOUT CE QUI EST AFFIRMÉ EST VÉRIFIABLE. Les deux interlocuteurs, leurs
 * sociétés, leurs SIREN et leurs dates viennent de `src/config/legal.ts`, donc
 * du registre national des entreprises — recoupé le 04/09/2026 sur
 * recherche-entreprises.api.gouv.fr : Francis Jobard, président de SAS de
 * J.I.P. ; Florent Jobard, président de SAS de Jobard Immobilier Patrimoine.
 * La planche disait « directeur général » pour le second : c'est le registre
 * qui fait foi. Les lignes directes et les courriels sont ceux de la page
 * contact du site en production.
 *
 * Les quatre engagements et les deux blocs « ce que nous faisons / ne faisons
 * pas » sont repris mot pour mot. Les paragraphes « une histoire de confiance »
 * (« professionnels passionnés… ») et les trois valeurs de la page équipe
 * (« esprit d'équipe, innovation, proximité ») n'ont pas suivi : quatre mots
 * que tous les concurrents affichent aussi. Consignés dans REPRISE.md § 14.
 *
 * « 24 h » reste en attente d'arbitrage, comme partout ailleurs.
 */

const PORTRAITS = [
  { src: francisImage, srcSet: `${francisImage440} 440w, ${francisImage} 700w` },
  { src: florentImage, srcSet: `${florentImage440} 440w, ${florentImage} 700w` },
];

/** Quatre choses que le visiteur peut vérifier en nous appelant. */
const ENGAGEMENTS = [
  {
    titre: 'Un interlocuteur unique',
    texte:
      'Le même gestionnaire suit votre dossier du premier appel à la signature. Pas de standard, pas de numéro de dossier.',
  },
  {
    titre: 'Une réponse sous 24 heures',
    texte: "Ouvrées. C'est l'engagement que nous tenons sur les appels comme sur les courriels.",
  },
  {
    titre: 'Gérance et syndic réunis',
    texte:
      "Nous gérons des immeubles et des appartements. Quand nous vendons un lot, nous connaissons déjà l'immeuble.",
  },
  {
    titre: 'Indépendante depuis 2011',
    texte:
      'Ni franchise, ni réseau : une agence de quartier, au 27 rue de Lisbonne, dirigée par ceux qui la tiennent.',
  },
];

/** Repères vérifiables au registre du commerce, rien d'autre. */
const REPERES = [
  { valeur: '2011', libelle: 'Année de création' },
  { valeur: <>Paris 8<sup>e</sup></>, libelle: '27, rue de Lisbonne' },
  { valeur: '2', libelle: 'Métiers de fond : gérance et syndic' },
  { valeur: '24 h', libelle: 'Temps de réponse ouvré' },
];

/** L'année seule d'une date écrite en clair (« 17 juin 2015 » → « 2015 »). */
const annee = (date: string) => date.match(/\d{4}/)?.[0] ?? date;

const About = () => (
  <div className="min-h-screen">
    <SEOHead
      title="L'agence — JIP, Jobard Immobilier Paris"
      description="Deux métiers sous le même toit depuis 2011 : gestion locative et syndic de copropriété, au 27 rue de Lisbonne dans le 8e arrondissement de Paris. Les deux interlocuteurs de l'agence."
      keywords="agence immobilière paris 8, jobard immobilier paris, syndic et gérance, agence indépendante, francis jobard, florent jobard"
      canonicalUrl="https://www.adbjip.fr/agence"
    />
    <Header />
    <main id="contenu" tabIndex={-1}>
      <EnTetePage
        surtitre="L'agence"
        titre={
          <>
            Les mêmes personnes, <em>depuis 2011.</em>
          </>
        }
        chapeau="Deux sociétés, une famille, un bureau. Le dossier de gérance et le dossier de syndic du même immeuble sont tenus dans la même pièce — c'est ce qui fait qu'un appel trouve une réponse au lieu d'un transfert."
        /* L'image du bureau était générée, et cela se voyait. Un dessin à la
           place : le vrai bureau du 27 rue de Lisbonne reste à photographier. */
        visuel={<Ferronnerie motif={3} className="h-full w-full" />}
      />

      {/* ---- LES DEUX INTERLOCUTEURS ------------------------------------
          Une carte par personne : le portrait à l'échelle, le métier en
          surtitre, le nom en romain, puis ce que le registre dit et ce qu'on
          peut composer. */}
      <section className="bg-pierre pb-16 lg:pb-20">
        <div className="container mx-auto grid gap-6 lg:grid-cols-2">
          {EQUIPE.map((personne, index) => {
            const entite = ENTITES[personne.entite];
            const portrait = PORTRAITS[index];
            return (
              <Voile
                key={personne.nom}
                delai={echelonner(index)}
                className="panneau grid gap-6 p-7 sm:grid-cols-[10rem_1fr] lg:p-8"
              >
                <Calage className="aspect-[3/4] w-full max-w-[10rem] bg-lin">
                  <img
                    src={portrait.src}
                    srcSet={portrait.srcSet}
                    sizes="10rem"
                    alt={`${personne.nom}, président de ${entite.raisonSociale}`}
                    width={700}
                    height={875}
                    className="h-full w-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                  />
                </Calage>
                <div>
                  <p className="gravure">{personne.metier}</p>
                  <h2 className="mt-2 text-[clamp(1.75rem,2.4vw,2rem)]">{personne.nom}</h2>
                  <p className="tabulaire mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
                    Président, {entite.raisonSociale} · SIREN {entite.siren} · depuis{' '}
                    {annee(entite.dateCreation)}
                  </p>
                  <p className="mt-4 text-[0.9375rem] leading-[1.55] text-ardoise">{personne.description}</p>
                  <p className="mt-4 text-[0.875rem] leading-[1.8]">
                    <a
                      href={`tel:${personne.telephone.replace(/[^0-9+]/g, '')}`}
                      className="tabulaire font-display font-semibold"
                    >
                      {personne.telephone}
                    </a>
                    <br />
                    <a href={`mailto:${personne.email}`} className="lien-trait text-ardoise hover:text-foreground">
                      {personne.email}
                    </a>
                  </p>
                </div>
              </Voile>
            );
          })}
        </div>
      </section>

      {/* ---- LES ENGAGEMENTS ---------------------------------------------- */}
      <section className="bg-lin py-16 lg:py-20">
        <div className="container mx-auto grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,23rem)_1fr]">
          <Voile>
            <p className="gravure">Les engagements</p>
            <h2 className="mt-4 text-[clamp(2rem,3.5vw,2.75rem)]">
              Quatre choses que vous pouvez vérifier en nous appelant
            </h2>
          </Voile>
          <dl className="grid border-t border-[hsl(var(--trait)/var(--trait-a))] sm:grid-cols-2">
            {ENGAGEMENTS.map((e, index) => (
              <Voile
                key={e.titre}
                delai={echelonner(index)}
                className="border-b border-[hsl(var(--trait)/var(--trait-a))] py-6 sm:odd:border-r sm:odd:pr-6 sm:even:pl-6 sm:[&:nth-last-child(-n+2)]:border-b-0"
              >
                <dt className="font-serif text-[1.5rem] leading-[1.1]">{e.titre}</dt>
                <dd className="mt-2 text-[0.875rem] leading-[1.5] text-ardoise">{e.texte}</dd>
              </Voile>
            ))}
          </dl>
        </div>
      </section>

      {/* ---- CE QUE NOUS FAISONS, ET PAS ------------------------------- */}
      <section className="bg-pierre py-16 lg:py-20">
        <div className="container mx-auto grid gap-x-16 gap-y-10 lg:grid-cols-2">
          <Voile>
            <p className="gravure">Ce que nous faisons</p>
            <p className="mt-4 font-serif text-[clamp(1.375rem,2vw,1.625rem)] leading-[1.35]">
              Nous gérons des appartements pour leurs propriétaires et des immeubles pour leurs
              copropriétaires : loyers, travaux, assemblées générales, comptes.
            </p>
          </Voile>
          <Voile delai={90}>
            <p className="gravure">Ce que nous ne faisons pas</p>
            <p className="mt-4 font-serif text-[clamp(1.375rem,2vw,1.625rem)] leading-[1.35]">
              Nous ne gérons pas au-delà de ce que nous pouvons suivre. Le portefeuille reste à la
              taille d'une agence où l'on connaît chaque immeuble.
            </p>
          </Voile>
        </div>
      </section>

      {/* ---- LES REPÈRES ------------------------------------------------- */}
      <section className="nuit bg-marine py-14 text-pierre lg:py-16">
        <div className="container mx-auto">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-8 lg:grid-cols-4">
            {REPERES.map(({ valeur, libelle }, index) => (
              <Voile key={libelle} delai={echelonner(index)}>
                <dt className="font-serif text-[clamp(2.5rem,4vw,3.5rem)] leading-none text-primary">{valeur}</dt>
                <dd className="mt-2.5 text-[0.8125rem] text-muted-foreground">{libelle}</dd>
              </Voile>
            ))}
          </dl>
        </div>
      </section>

      <BandeauContact
        fond="lin"
        surtitre="Nous joindre"
        titre="Parlons de votre lot, ou de votre immeuble."
        texte="Un interlocuteur vous répond et vous dit ce qu'il en pense."
        action={{ libelle: 'Nous écrire', href: '/contact' }}
        ordre="action"
      />
    </main>
    <Footer />
    <BarreAppel action={{ libelle: 'Écrire', href: '/contact' }} />
  </div>
);

export default About;
