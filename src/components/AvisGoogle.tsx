import { ExternalLink, Star } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { AVIS, NOTE_GOOGLE } from '@/config/avis';

/**
 * Avis clients repris de la fiche Google.
 *
 * Ne rend rien tant qu'aucun avis réel n'a été saisi : c'est volontaire, la
 * section ne doit jamais s'afficher avec du contenu de remplissage.
 *
 * La note globale et le lien vers l'ensemble des avis accompagnent toujours la
 * sélection — un extrait d'avis favorables présenté seul, sans la moyenne réelle
 * ni accès à la totalité, est trompeur.
 */
const AvisGoogle = () => {
  if (AVIS.length === 0) return null;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Ce qu'en disent <span className="gradient-text">nos clients</span>
          </h2>
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-muted-foreground">
            <span className="font-semibold text-foreground">
              {NOTE_GOOGLE.valeur.toString().replace('.', ',')} / 5
            </span>
            <span>
              sur Google
              {NOTE_GOOGLE.nombre ? ` · ${NOTE_GOOGLE.nombre} avis` : ''}
            </span>
            <a
              href={NOTE_GOOGLE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              Voir tous les avis
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {AVIS.map((avis) => (
            <Card key={`${avis.auteur}-${avis.date}`} className="glass-strong border-0 p-8 shadow-card">
              <div className="mb-4 flex items-center gap-1" aria-label={`${avis.note} sur 5`}>
                {Array.from({ length: avis.note }).map((_, index) => (
                  <Star key={index} className="h-5 w-5 fill-current text-primary" />
                ))}
              </div>
              <blockquote className="mb-6 italic leading-relaxed text-muted-foreground">
                « {avis.texte} »
              </blockquote>
              <div className="text-sm">
                <span className="font-semibold">{avis.auteur}</span>
                <span className="text-muted-foreground"> — avis Google, {avis.date}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AvisGoogle;
