import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Le champ réglé — voir `.champ-regle` dans `src/index.css`.
 *
 * Pas de boîte : un filet en pied de champ, qui passe au laiton à la saisie.
 * C'est ce que fait un registre — il règle la ligne, il n'encadre pas le mot.
 * C'est aussi le changement qui, à lui seul, sort les formulaires de
 * l'apparence « bibliothèque de composants ».
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "champ-regle file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
