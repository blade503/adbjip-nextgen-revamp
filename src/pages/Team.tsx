import { ArrowRight, Phone } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import EnTeteSection from '@/components/systeme/EnTeteSection';
import { Lien } from '@/components/systeme/Lien';
import { Calage, Voile } from '@/components/systeme/Ouverture';
import { Button } from '@/components/ui/button';
import { ADRESSE } from '@/config/legal';
import { echelonner } from '@/lib/echelon';
import florentImage from '@/assets/equipe-florent-jobard.webp';
import francisImage from '@/assets/equipe-francis-jobard.webp';
import florentImage440 from '@/assets/equipe-florent-jobard-440.webp';
import francisImage440 from '@/assets/equipe-francis-jobard-440.webp';

/**
 * L'ÉQUIPE — recomposée dans le langage de la charte.
 *
 * LES DEUX FICHES SONT REPRISES MOT POUR MOT : noms, fonctions, téléphones,
 * courriels, spécialités, descriptions. Le commentaire d'origine est conservé —
 * il documente une décision : deux autres profils avaient été inventés, avec
 * des adresses qui n'existent pas, et ils ont été retirés. À compléter par le
 * client, pas par le code.
 *
 * CE QUI A CHANGÉ EST LA FORME. Relevé avant : 29 vestiges — 6 centrages,
 * 5 `glass`, 5 rayons hors charte, 4 ombres portées, 3 pastilles d'icônes,
 * 2 `gradient-text`, 2 `hover-lift`, 2 fonds en dégradé.
 *
 *  - LES PORTRAITS PASSENT À L'ÉCHELLE. Ils étaient servis en 700 × 875 puis
 *    affichés dans une vignette de 96 × 112 px : les deux dirigeants de la
 *    maison tenaient dans un timbre-poste. Ils occupent maintenant une colonne
 *    entière, dans un cadre gravé, avec le calage à l'entrée.
 *  - la grille de deux cartes de verre → un registre de deux travées.
 *  - les trois valeurs d'entreprise en cartes centrées à pastille → un registre
 *    réglé. Trois cartes de même poids affirmaient qu'elles valent les deux
 *    fiches, ce qui n'est pas le cas.
 *  - `gradient-text` → titre entier en encre ; le laiton reste sur la plaque.
 *  - le caisson de verre de l'appel final → une bande de nuit.
 */

/** Deux largeurs : le portrait s'affiche jusqu'à ~420 px sur une colonne. */
const JEUX_PORTRAITS: Record<string, string> = {
  [florentImage]: `${florentImage440} 440w, ${florentImage} 700w`,
  [francisImage]: `${francisImage440} 440w, ${francisImage} 700w`,
};

/** La culture, libellés inchangés. Les pictogrammes ont disparu avec les cartes. */
const CULTURE = [
  {
    titre: "Esprit d'équipe",
    texte: 'Collaboration et entraide pour offrir le meilleur service à nos clients.',
  },
  {
    titre: 'Innovation',
    texte: 'Adaptation constante aux évolutions du marché et des technologies.',
  },
  {
    titre: 'Proximité',
    texte: 'Relation privilégiée et personnalisée avec chacun de nos clients.',
  },
];

const Team = () => {
  const tel = `tel:${ADRESSE.telephone.replace(/[^0-9+]/g, '')}`;

  // Uniquement les personnes réellement présentes dans l'agence — les deux
  // autres profils étaient inventés, avec des adresses e-mail qui n'existent
  // pas. À compléter par le client, pas par le code.
  const team = [
    {
      name: 'Florent Jobard',
      photo: florentImage,
      role: 'Directeur général',
      phone: '06.62.91.73.35',
      email: 'j.immo.p@orange.fr',
      specialties: ['Gestion locative', 'Négociation', 'Développement commercial'],
      description:
        "Dirige Jobard Immobilier Patrimoine, qui porte la transaction, l'achat-vente et l'estimation.",
    },
    {
      name: 'Francis Jobard',
      photo: francisImage,
      role: 'Directeur des copropriétés',
      phone: '01.42.25.78.24',
      email: 'copro@adbjip.fr',
      specialties: ['Gestion de copropriété', 'Conseil juridique', 'Assemblées générales'],
      description:
        'Préside J.I.P. et suit personnellement les copropriétés : assemblées générales, travaux, comptes.',
    },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Notre équipe — JIP, Jobard Immobilier Paris"
        description="Les interlocuteurs de l'agence JIP pour la gestion de votre bien et le syndic de votre copropriété, à Paris 8e."
        keywords="équipe jip, florent jobard, francis jobard, agence immobilière paris 8"
        canonicalUrl="https://www.adbjip.fr/equipe"
      />
      <Header />
      <main id="contenu" tabIndex={-1}>
        {/* ---- OUVERTURE ---------------------------------------------- */}
        <section className="nuit grain bg-nuit pb-16 pt-32 text-pierre">
          <div className="container mx-auto">
            <EnTeteSection
              fond="nuit"
              niveau="h1"
              plaque="Notre équipe"
              titre="Rencontrez notre équipe"
              chapeau="Des professionnels passionnés et expérimentés, unis par la même volonté d'excellence dans le service client et la gestion immobilière."
            />
          </div>
        </section>

        {/* ---- LES DEUX INTERLOCUTEURS -------------------------------
            Une travée par personne, portrait à l'échelle dans un cadre gravé.
            Les deux dirigeants tenaient auparavant dans une vignette de 96 px. */}
        <section className="bg-background py-20 lg:py-28">
          <div className="container mx-auto">
            <EnTeteSection
              plaque="Les interlocuteurs"
              titre="Qui suit votre dossier"
              chapeau="Deux personnes, deux métiers. Celle qui répond au téléphone est celle qui tient le dossier."
            />

            <div className="mt-16 space-y-16 border-t border-[hsl(var(--trait)/var(--trait-a))] pt-16">
              {team.map((membre, index) => (
                <Voile key={membre.name} delai={echelonner(index)} className="grid gap-x-12 gap-y-8 lg:grid-cols-12">
                  <div className="lg:col-span-4">
                    <Calage className="cadre aspect-[4/5] w-full max-w-[22rem]">
                      <img
                        src={membre.photo}
                        srcSet={JEUX_PORTRAITS[membre.photo]}
                        sizes="(min-width: 1024px) 22rem, 100vw"
                        alt={`${membre.name}, ${membre.role.toLowerCase()}`}
                        width={700}
                        height={875}
                        className="h-full w-full object-cover object-top"
                        loading="lazy"
                        decoding="async"
                      />
                    </Calage>
                  </div>

                  <div className="lg:col-span-8">
                    <h2 className="text-[clamp(1.5rem,2.6vw,2rem)]">{membre.name}</h2>
                    <p className="tabulaire mt-1.5 font-display text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary-ink">
                      {membre.role}
                    </p>
                    <p className="mesure mt-5 text-[1.0625rem] leading-relaxed text-muted-foreground">
                      {membre.description}
                    </p>

                    <dl className="mt-8 grid max-w-[30rem] grid-cols-1 border-t border-[hsl(var(--trait)/var(--trait-a))] sm:grid-cols-2">
                      <div className="border-b border-[hsl(var(--trait)/var(--trait-a))] py-4 sm:border-b-0 sm:pr-5">
                        <dt className="text-[0.8125rem] text-muted-foreground">Téléphone</dt>
                        <dd className="mt-1">
                          <a
                            href={`tel:${membre.phone.replace(/[^0-9+]/g, '')}`}
                            className="lien-trait tabulaire inline-flex min-h-[24px] items-center font-display text-[0.9375rem]"
                          >
                            {membre.phone}
                          </a>
                        </dd>
                      </div>
                      <div className="border-b border-[hsl(var(--trait)/var(--trait-a))] py-4 sm:border-b-0 sm:border-l sm:border-[hsl(var(--trait)/var(--trait-a))] sm:pl-5">
                        <dt className="text-[0.8125rem] text-muted-foreground">Courriel</dt>
                        <dd className="mt-1">
                          <a
                            href={`mailto:${membre.email}`}
                            className="lien-trait inline-flex min-h-[24px] items-center text-[0.9375rem]"
                          >
                            {membre.email}
                          </a>
                        </dd>
                      </div>
                    </dl>

                    {/* `min-h-[24px]` sur les deux liens : mesurés à 23 px de
                        haut, un pixel sous le minimum de cible tactile de
                        WCAG 2.2 (SC 2.5.8). Un lien de coordonnées est
                        autonome, il n'est pas exempté comme un lien de phrase. */}
                    {/* Les spécialités en plaques : ce sont des inscriptions,
                        pas des étiquettes de couleur. */}
                    <p className="mt-7 text-[0.8125rem] text-muted-foreground">Spécialités</p>
                    <p className="mt-2.5 flex flex-wrap gap-2">
                      {membre.specialties.map((s) => (
                        <span key={s} className="plaque">
                          {s}
                        </span>
                      ))}
                    </p>
                  </div>
                </Voile>
              ))}
            </div>
          </div>
        </section>

        {/* ---- LA CULTURE -------------------------------------------- */}
        <section className="bg-ivoire py-20 lg:py-28">
          <div className="container mx-auto">
            <EnTeteSection
              plaque="La maison"
              titre="Notre culture d'entreprise"
              chapeau="Une équipe soudée par des valeurs communes et l'excellence du service."
            />

            <dl className="mt-16 border-t border-[hsl(var(--trait)/var(--trait-a))]">
              {CULTURE.map((c, index) => (
                <Voile key={c.titre} delai={echelonner(index)} className="grid gap-x-10 gap-y-2 border-b border-[hsl(var(--trait)/var(--trait-a))] py-7 lg:grid-cols-[20rem_1fr]">
                  <dt className="text-[1.0625rem] font-semibold">{c.titre}</dt>
                  <dd className="mesure-large text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {c.texte}
                  </dd>
                </Voile>
              ))}
            </dl>
          </div>
        </section>

        {/* ---- LE RENDEZ-VOUS ---------------------------------------- */}
        <section className="nuit grain bg-nuit py-20 text-pierre lg:py-28">
          <div className="container mx-auto">
            <EnTeteSection
              fond="nuit"
              plaque="Nous joindre"
              titre="Une question ? Un projet ?"
              chapeau="Notre équipe est à votre disposition pour répondre à vos besoins."
            />

            <Voile delai={120} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <a href={tel}>
                  <Phone aria-hidden />
                  {ADRESSE.telephone}
                </a>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Lien to="/services/gestion-locative">
                  Découvrir nos services
                  <ArrowRight aria-hidden />
                </Lien>
              </Button>
            </Voile>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Team;
