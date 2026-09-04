import { ArrowRight } from 'lucide-react';

import { TEL } from '@/components/systeme/BoutonTelephone';
import { Lien } from '@/components/systeme/Lien';
import { Voile } from '@/components/systeme/Ouverture';
import { ADRESSE, HORAIRES } from '@/config/legal';

/**
 * LA CONVERSION — la seule demande du site.
 *
 * L'objectif est UN ENTRETIEN DE MANDAT : un propriétaire qui veut confier un
 * lot en gérance, un conseil syndical qui veut changer de syndic. C'est le
 * revenu récurrent de la maison, et le seul indicateur qui compte.
 *
 * LE TÉLÉPHONE EST L'OBJET PRINCIPAL. La clientèle d'une gérance parisienne —
 * propriétaires de 50 à 80 ans, conseils syndicaux — appelle. Le numéro est
 * donc composé à l'échelle d'un titre, en chiffres tabulaires de laiton sur le
 * marine (7,6:1), avec les horaires juste à côté : un numéro sans horaires
 * produit un appel dans le vide.
 *
 * Le pré-triage par profil ne vit plus ici : il est monté en haut de page,
 * sous l'ouverture (`Aiguillage`), là où il décide du parcours. Ce bloc ferme
 * la page sur une seule chose à faire.
 */
const Conversion = () => (
  <section id="contact" className="nuit bg-marine py-16 text-pierre lg:py-20">
    <div className="container mx-auto grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <Voile>
        <p className="gravure">Prendre rendez-vous</p>
        <h2 className="mt-3 text-[clamp(1.875rem,3.4vw,2.5rem)]">
          Parlons de votre lot,
          <br />
          ou de votre immeuble.
        </h2>
        <p className="tabulaire mt-4 text-[0.9375rem] text-muted-foreground">
          {HORAIRES.jours}, {HORAIRES.detail} · Réponse sous 24 heures ouvrées
        </p>
        <Lien
          to="/contact"
          className="lien-trait mt-5 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-pierre"
        >
          Ou nous écrire
          <ArrowRight aria-hidden className="h-3.5 w-3.5" />
        </Lien>
      </Voile>

      <Voile delai={90} className="lg:text-right">
        <a
          href={TEL}
          className="tabulaire inline-block font-display text-[clamp(2rem,4.4vw,2.75rem)] font-semibold leading-none tracking-[-0.01em] text-primary transition-colors duration-3 hover:text-primary-glow"
        >
          {ADRESSE.telephone}
        </a>
        <p className="mt-3 text-[0.875rem] text-muted-foreground">
          {ADRESSE.rue}, {ADRESSE.codePostal} {ADRESSE.ville} · {ADRESSE.metro}
        </p>
      </Voile>
    </div>
  </section>
);

export default Conversion;
