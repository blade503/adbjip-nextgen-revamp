import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

/* `DialogPortal` et `DialogOverlay` ne sont plus exportés : ils ne servent
   qu'à `DialogContent`, juste en dessous. Les définitions restent, l'API
   publique du module se réduit à ce que les trois appelants emploient
   réellement — Dialog, DialogContent, DialogHeader, DialogTitle. */
const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      // Le voile est de nuit, pas de noir : c'est la même matière que celui du
      // menu mobile, et la page reste reconnaissable dessous.
      "fixed inset-0 z-50 bg-nuit/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        /* La boîte de dialogue est une plaque : rayon de 2 px et non 8, filet de
           1 px, et l'ombre d'encre du système (`shadow-appui`) au lieu du
           `shadow-lg` gris du gabarit. Elle se pose sur la courbe de sortie, à la
           durée d'une petite course. Les `slide-in-from-*` restent : ils portent
           le `translate(-50%, -50%)` du centrage pendant l'animation, sans eux la
           boîte partirait du coin haut gauche. */
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-none border border-[hsl(var(--trait)/var(--trait-a))] bg-background p-6 shadow-appui duration-3 ease-sortie data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className
      )}
      {...props}
    >
      {children}
      {/* Pas de `focus:outline-none` ni d'anneau propre : le bouton reprend
          l'anneau global de `:focus-visible` (laiton + halo marine). L'anneau
          du gabarit était en laiton seul sur la pierre — 1,81:1, invisible au
          clavier, précisément le piège que la charte documente. */}
      <DialogPrimitive.Close className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-none text-muted-foreground transition-colors duration-2 ease-etat hover:bg-[hsl(var(--lavis)/calc(var(--lavis-a)*2))] hover:text-foreground disabled:pointer-events-none">
        <X aria-hidden className="h-4 w-4" />
        <span className="sr-only">Fermer</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    // Ferré à gauche à toutes les largeurs : rien n'est centré sur ce site, et
    // le gabarit centrait le titre sous `sm` seulement — deux compositions pour
    // une même boîte.
    className={cn("flex flex-col space-y-1.5 text-left", className)}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    /* Radix rend un `h2` : il reçoit donc Archivo, la largeur 108 et
       l'interlettrage des titres par la feuille de base. Ne pas le resserrer
       davantage — `tracking-tight` s'ajoutait au −0,024 em déjà posé. `pr-8`
       dégage la place du bouton de fermeture, que les trois appelants
       ajoutaient chacun à la main. */
    className={cn("pr-8 text-[clamp(1.375rem,2.6vw,1.75rem)] font-semibold", className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

/* DialogTrigger, DialogClose, DialogFooter et DialogDescription ont été
   retirés le 27/08/2026 : jamais consommés. Les trois boîtes de dialogue du
   site s'ouvrent par un état React et se ferment par le bouton intégré à
   `DialogContent`, jamais par un déclencheur Radix. Si une description
   accessible devient nécessaire, `DialogPrimitive.Description` est à une
   ligne d'ici. */

export { Dialog, DialogContent, DialogHeader, DialogTitle }
