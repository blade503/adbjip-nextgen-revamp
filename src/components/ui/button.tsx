import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Le bouton — direction « La Plaque », 04/09/2026.
 *
 * Deux registres, et pas un de plus :
 *   `default`    l'aplat : marine sur le crème, laiton sur le marine. Les
 *                trois jetons `--bouton*` font la bascule, le composant ne
 *                sait pas sur quel fond il est.
 *   `secondary`  le cerné : un filet de 1,5 px dans la couleur du texte, fond
 *                transparent. `outline` est le même objet sous son ancien nom.
 *
 * Angle vif, capitales espacées en Figtree 600. Au survol, RIEN NE BOUGE : le
 * champ s'assombrit d'un cran (`--bouton-survol`), ou un lavis entre.
 *
 * `registre="chiffre"` : pour un NUMÉRO DE TÉLÉPHONE, composé en Archivo, sans
 * capitales ni espacement — c'est la seule exception typographique du bouton,
 * et elle est là parce qu'un numéro en capitales espacées n'existe pas.
 *
 * Le contraste des deux registres est mesuré (`node scripts/contraste.mjs`) :
 * pierre sur marine 13,8:1, encre sur laiton 8,6:1, bordure encre sur crème
 * 15,6:1, bordure pierre sur marine 13,8:1.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 rounded-none text-center font-sans font-semibold transition-[background-color,border-color,color] duration-3 ease-sortie disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-bouton text-bouton-foreground hover:bg-bouton-survol",
        secondary:
          "border-[1.5px] border-foreground bg-transparent text-foreground hover:bg-[hsl(var(--lavis)/var(--lavis-a))]",
        outline:
          "border-[1.5px] border-foreground bg-transparent text-foreground hover:bg-[hsl(var(--lavis)/var(--lavis-a))]",
        ghost: "text-foreground hover:bg-[hsl(var(--lavis)/calc(var(--lavis-a)*2))]",
        link: "text-foreground underline-offset-[6px] decoration-current decoration-1 hover:underline",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      registre: {
        capitales: "uppercase tracking-[0.08em]",
        chiffre: "tabulaire font-display normal-case tracking-normal",
      },
      size: {
        // 46 px et 52 px : les deux hauteurs des planches. Au-dessus de la
        // cible de 44 px recommandée au doigt.
        default: "min-h-[2.875rem] px-6 py-2.5 text-[0.75rem]",
        sm: "min-h-10 px-4 py-2 text-[0.6875rem]",
        lg: "min-h-[3.25rem] px-7 py-3 text-[0.8125rem]",
        icon: "h-11 w-11",
      },
    },
    compoundVariants: [
      // Un numéro en Archivo se lit un cran plus grand que des capitales de
      // même hauteur de bouton.
      { registre: "chiffre", size: "default", className: "text-[0.875rem]" },
      { registre: "chiffre", size: "lg", className: "text-[0.9375rem]" },
    ],
    defaultVariants: {
      variant: "default",
      registre: "capitales",
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
  ({ className, variant, registre, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, registre, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

// `buttonVariants` n'est plus exporté : aucun appelant, et l'export d'une
// constante à côté d'un composant casse le rafraîchissement à chaud de Vite.
export { Button }
