import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * `Card` est devenue le panneau du système — voir `.panneau` dans
 * `src/index.css`. Le verre dépoli et l'ombre par défaut sont retirés : vingt
 * usages dans les pages internes s'en trouvent corrigés sans les rouvrir.
 */

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Un panneau, pas une carte flottante : filet de 1 px, rayon de 2 px,
      // aucune ombre par défaut. Les ombres se demandent au cas par cas
      // (`shadow-pose`), elles ne sont plus le réglage de départ.
      "panneau text-card-foreground",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

/* Les cinq sous-composants du gabarit — CardHeader, CardTitle,
   CardDescription, CardContent, CardFooter — n'ont jamais été consommés :
   la mise en page interne des panneaux se fait à la grille, pas par
   des rembourrages de 24 px hérités. Retirés le 27/08/2026. */

export { Card }
