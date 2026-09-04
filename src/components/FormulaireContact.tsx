import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Champ, Leurre, Rangee, Retour, ZoneTexte } from '@/components/formulaire';
import { PROFILS, type CleProfil } from '@/components/systeme/Aiguillage';
import { Lien } from '@/components/systeme/Lien';
import { champsInvalides, focaliserChamp, useEnvoi } from '@/lib/formulaire';
import type { DemandeFormulaire } from '@/lib/forms';
import { cn } from '@/lib/utils';

/**
 * Formulaire de contact — planche 2h de la direction « La Plaque ».
 *
 * LE PROFIL D'ABORD, PUIS CINQ CHAMPS. Le visiteur dit qui il est en un clic
 * (bailleur, conseil syndical, vendeur) — c'est ce qui route sa demande vers la
 * bonne boîte (`contact.php` : `gerance@`, `copro@`) — puis remplit nom,
 * courriel, téléphone, le bien concerné et son message. Sept champs avant.
 *
 * LA PLANCHE EN VOULAIT QUATRE, avec « téléphone ou courriel » en un seul
 * champ. Impossible sans réécrire `contact.php`, qui exige un courriel valide
 * (`FILTER_VALIDATE_EMAIL`) et refuse la demande sinon — et qui ne se réécrit
 * pas. Le courriel reste donc obligatoire et le téléphone facultatif : cinq
 * champs, et l'astérisque dit vrai.
 *
 * PRÉ-REMPLISSAGE : `?service=` arrive de l'aiguillage et des pages métier ;
 * `?bien=` arrive d'une fiche bien (« Demander une visite ») et remplit le
 * champ du bien concerné. Les deux valeurs sont VALIDÉES ou bornées : une
 * valeur inconnue dans l'URL ne coche rien, un texte trop long est coupé.
 *
 * Le bien concerné part dans `details`, que le serveur relaie tel quel dans le
 * courriel — pas dans le message, pour que le visiteur n'ait pas à le réécrire.
 */

const CHAMPS_VIDES = {
  nom: '',
  email: '',
  telephone: '',
  bien: '',
  message: '',
  /** Champ leurre : hors écran, rempli par la plupart des robots. */
  website: '',
};

const CLES_CONNUES = new Set<string>(PROFILS.map((p) => p.cle));

/** @param idPrefix distingue les identifiants quand deux formulaires cohabitent. */
const FormulaireContact = ({ idPrefix = 'contact' }: { idPrefix?: string }) => {
  const [parametres] = useSearchParams();
  const serviceInitial = parametres.get('service') ?? '';
  const bienInitial = (parametres.get('bien') ?? '').slice(0, 160);

  const [service, setService] = useState<CleProfil | ''>(
    CLES_CONNUES.has(serviceInitial) ? (serviceInitial as CleProfil) : '',
  );
  const [champs, setChamps] = useState({ ...CHAMPS_VIDES, bien: bienInitial });
  const { envoiEnCours, retour, envoyer, signaler } = useEnvoi();

  const modifier =
    (nom: keyof typeof CHAMPS_VIDES) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setChamps((precedent) => ({ ...precedent, [nom]: event.target.value }));

  const demande = (): DemandeFormulaire => ({
    type: 'contact',
    nom: champs.nom.trim(),
    email: champs.email,
    telephone: champs.telephone,
    service,
    message: champs.message,
    website: champs.website,
    details: champs.bien.trim() ? { 'Bien ou immeuble concerné': champs.bien.trim() } : undefined,
  });

  /** Les règles du client : les mêmes que le serveur, appliquées avant lui. */
  const regles = () => [
    { nom: 'nom', valeur: champs.nom, requis: true },
    { nom: 'email', valeur: champs.email, requis: true, format: 'email' as const },
    { nom: 'message', valeur: champs.message, requis: true },
  ];

  const soumettre = async (event: React.FormEvent) => {
    event.preventDefault();

    // On contrôle AVANT le réseau : un champ oublié n'a pas à coûter un
    // aller-retour, et le visiteur doit atterrir sur le champ fautif.
    const fautifs = champsInvalides(regles());
    if (fautifs.length > 0) {
      signaler({
        ok: false,
        message:
          fautifs.length === 1
            ? 'Un champ reste à compléter, il est signalé ci-dessous.'
            : `${fautifs.length} champs restent à compléter, ils sont signalés ci-dessous.`,
        champs: fautifs,
      });
      focaliserChamp(idPrefix, fautifs[0]);
      return;
    }

    const resultat = await envoyer(demande());
    if (resultat.ok) {
      setChamps(CHAMPS_VIDES);
      return;
    }
    if (resultat.champs?.length) focaliserChamp(idPrefix, resultat.champs[0]);
  };

  return (
    <form className="relative space-y-8" onSubmit={soumettre} noValidate>
      {/* ---- Vous êtes ----------------------------------------------
          De vrais boutons radio, masqués mais présents : le clavier, les
          flèches et l'annonce du groupe viennent du navigateur. La carte
          cochée passe au marine. */}
      <fieldset>
        <legend className="etiquette-champ">Vous êtes</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {PROFILS.map((profil) => {
            const coche = service === profil.cle;
            const id = `${idPrefix}-profil-${profil.cle}`;
            return (
              <div key={profil.cle} className="relative flex">
                <input
                  type="radio"
                  id={id}
                  name={`${idPrefix}-service`}
                  value={profil.cle}
                  checked={coche}
                  onChange={() => setService(profil.cle)}
                  className="peer sr-only"
                />
                <label
                  htmlFor={id}
                  className={cn(
                    'flex w-full cursor-pointer flex-col gap-1.5 p-4 transition-colors duration-2 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-laiton',
                    coche ? 'nuit bg-marine text-pierre' : 'panneau hover:bg-lin',
                  )}
                >
                  <span className="gravure text-[0.5625rem]">{profil.libelle}</span>
                  <span className="font-serif text-[1.125rem] leading-[1.2]">{profil.phrase}</span>
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>

      <Rangee>
        <Champ
          prefixe={idPrefix} nom="nom" etiquette="Nom" requis
          type="text" autoComplete="name"
          enErreur={retour?.champs} value={champs.nom} onChange={modifier('nom')}
        />
        <Champ
          prefixe={idPrefix} nom="email" etiquette="Courriel" requis
          type="email" autoComplete="email"
          enErreur={retour?.champs} value={champs.email} onChange={modifier('email')}
        />
        <Champ
          prefixe={idPrefix} nom="telephone" etiquette="Téléphone"
          type="tel" autoComplete="tel"
          enErreur={retour?.champs} value={champs.telephone} onChange={modifier('telephone')}
        />
        <Champ
          prefixe={idPrefix} nom="bien" etiquette="Le bien ou l'immeuble concerné"
          type="text" placeholder="Adresse, arrondissement"
          enErreur={retour?.champs} value={champs.bien} onChange={modifier('bien')}
        />
      </Rangee>

      <ZoneTexte
        prefixe={idPrefix} nom="message" etiquette="Message" requis
        rows={5}
        placeholder="Ce que vous attendez de nous."
        enErreur={retour?.champs} value={champs.message} onChange={modifier('message')}
      />

      <Leurre valeur={champs.website} onChange={modifier('website')} />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={envoiEnCours} className="group w-full sm:w-auto">
          {envoiEnCours ? 'Envoi en cours…' : 'Envoyer'}
          <ArrowRight
            aria-hidden
            className="transition-transform duration-3 ease-sortie group-hover:translate-x-1"
          />
        </Button>
        {/* L'obligation d'information, À L'ENDROIT où le visiteur écrit. */}
        <p className="max-w-[26rem] text-[0.75rem] leading-relaxed text-muted-foreground">
          Vos informations servent uniquement à traiter votre demande et ne sont ni cédées ni
          revendues.{' '}
          <Lien to="/mentions-legales#donnees-personnelles" className="lien-trait">
            En savoir plus
          </Lien>
        </p>
      </div>

      <Retour retour={retour} demande={demande()} />
    </form>
  );
};

export default FormulaireContact;
