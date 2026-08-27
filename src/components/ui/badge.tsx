import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * L'étiquette est une petite plaque, pas une pastille.
 *
 * `rounded-full` est retiré : la gélule est le signe le plus reconnaissable
 * d'une interface montée sur gabarit, et sur les photos d'annonces elle se
 * lisait comme un badge d'application. Une plaque rectangulaire à capitales
 * espacées se lit comme une mention portée sur un document — ce qu'elle est
 * (« vente », « location », « nouveau »).
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-[1px] px-2.5 py-1 font-display text-[0.625rem] font-semibold uppercase leading-none tracking-[0.14em] transition-colors",
  {
    variants: {
      variant: {
        default:
          "grave grave-fin bg-primary text-primary-foreground [--filet-grave:var(--primary-foreground)] [--filet-grave-a:0.35]",
        secondary:
          "grave grave-fin bg-secondary text-secondary-foreground [--filet-grave:var(--secondary-foreground)] [--filet-grave-a:0.35]",
        destructive:
          "bg-destructive text-destructive-foreground",
        outline:
          "border border-foreground/25 text-foreground",
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

export { Badge, badgeVariants }
