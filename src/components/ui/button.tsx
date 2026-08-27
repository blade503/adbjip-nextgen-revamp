import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Le bouton est une plaque.
 *
 * Champ d'émail, liseré gravé en retrait de 3 px, capitales espacées : la même
 * géométrie que le repère de section, que les champs de formulaire et que les
 * cadres d'images. Un seul geste, répété — c'est ce qui fait tenir le site
 * ensemble, et c'est pourquoi il n'y a pas de sixième style de bouton.
 *
 * Au survol, RIEN NE BOUGE : pas de translation, pas d'ombre portée, pas de
 * halo. Le champ s'assombrit d'un cran et le liseré se réveille. Le mouvement
 * reste dans la matière, jamais dans la boîte.
 *
 * Les six variantes d'origine sont conservées sous leurs noms — onze pages s'en
 * servent — mais réduites à trois registres réels :
 *   `default`   la plaque de laiton, l'action principale ;
 *   `secondary` la plaque d'émail marine, l'action de second rang ;
 *   `outline` / `ghost` / `link`, qui ne sont plus que du texte cerné, du texte
 *   lavé et du texte souligné.
 *
 * `whitespace-nowrap` a été retiré : « Confier la gestion de mon bien » en
 * capitales débordait de l'écran sur un téléphone au lieu de passer à la ligne.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 text-center font-display font-semibold transition-[background-color,box-shadow,color] duration-3 ease-sortie disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Le liseré est en `--primary-foreground` (le marine) et non en blanc :
        // le blanc sur ce laiton ne fait que 2,04:1, le marine 7,79:1.
        // Vérifié : `node scripts/contraste.mjs laiton`.
        default:
          "grave bg-primary text-primary-foreground uppercase tracking-[0.1em] [--filet-grave:var(--primary-foreground)] hover:bg-primary-glow hover:[--filet-grave-a:0.65]",
        secondary:
          "grave bg-secondary text-secondary-foreground uppercase tracking-[0.1em] [--filet-grave:var(--secondary-foreground)] hover:[--filet-grave-a:0.7]",
        outline:
          "border border-foreground/25 bg-transparent text-foreground hover:border-foreground/45 hover:bg-[hsl(var(--lavis)/var(--lavis-a))]",
        ghost:
          "text-foreground hover:bg-[hsl(var(--lavis)/calc(var(--lavis-a)*2))]",
        link:
          "text-foreground underline-offset-[6px] decoration-[hsl(var(--laiton))] decoration-1 hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground uppercase tracking-[0.1em] hover:bg-destructive/90",
      },
      size: {
        // Plus haut que la version précédente : une plaque a besoin de chair
        // autour de ses capitales, et 40 px de haut était sous la cible de
        // 44 px recommandée au doigt.
        default: "min-h-11 rounded-[2px] px-5 py-2.5 text-[0.75rem]",
        sm: "min-h-10 rounded-[2px] px-4 py-2 text-[0.6875rem]",
        lg: "min-h-14 rounded-[2px] px-7 py-3.5 text-[0.8125rem]",
        icon: "h-11 w-11 rounded-[2px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
