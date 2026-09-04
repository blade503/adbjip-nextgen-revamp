import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * L'étiquette : une mention portée sur un document — « VENTE », « LOCATION »,
 * « NOUVEAU » — jamais une pastille. Angle vif, capitales espacées, aplat.
 *
 * Les couleurs sont des MATIÈRES fixes et non des jetons : une étiquette est
 * presque toujours posée sur une photo d'annonce, où elle doit rester lisible
 * sur un ciel comme sur un mur sombre, quel que soit le fond de la section.
 * Encre sur laiton 8,6:1, pierre sur marine 13,8:1 — mesurés.
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-none px-2 py-1 font-sans text-[0.625rem] font-semibold uppercase leading-none tracking-[0.14em]",
  {
    variants: {
      variant: {
        default: "bg-laiton text-encre",
        secondary: "bg-marine text-pierre",
        pierre: "bg-pierre text-encre",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-foreground text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

// `badgeVariants` n'est plus exporté : aucun appelant (voir button.tsx).
export { Badge }
