import { Clock, MapPin, MessageSquare, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { ADRESSE, HORAIRES } from '@/config/legal';

const Contact = () => {
  // Bandeau court : le formulaire complet, les informations détaillées et la
  // carte vivent sur /contact. Les répliquer ici allongeait l'accueil de deux
  // écrans pour redire la même chose, et personne ne remplit un formulaire au
  // milieu d'une page d'accueil.
  return (
    <section id="contact" className="border-t border-border/60 bg-gradient-subtle py-20">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold md:text-5xl">
            Parlons de votre <span className="gradient-text">projet</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Une question sur la gestion de votre bien, votre copropriété ou la valeur de votre
            appartement ? Un interlocuteur vous répond sous 24 heures ouvrées.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <a href={`tel:${ADRESSE.telephone.replace(/[^0-9+]/g, '')}`}>
                <Phone className="mr-2 h-5 w-5" />
                {ADRESSE.telephone}
              </a>
            </Button>
            <Button size="lg" variant="outline" className="bg-background" asChild>
              <Link to="/contact">
                <MessageSquare className="mr-2 h-5 w-5" />
                Nous écrire
              </Link>
            </Button>
          </div>

          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {ADRESSE.rue}, {ADRESSE.codePostal} {ADRESSE.ville}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              {HORAIRES.semaine}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
