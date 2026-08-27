import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			// 1,5 rem sous md : à 2 rem, un texte de 16 px n'avait plus que
			// 279 px de mesure sur un écran de 375, et les mots se coupaient.
			padding: {
				DEFAULT: '1.5rem',
				lg: '2.5rem',
				xl: '3.5rem',
			},
			screens: {
				'2xl': '1440px'
			}
		},
		extend: {
			fontFamily: {
				// Deux voix, deux linéales. Le contraste est de LARGEUR et non
				// d'empattement : Archivo porte un axe `wdth` (100..125) qu'Inter
				// n'a pas, et les capitales élargies sont la proportion exacte
				// d'une plaque émaillée parisienne. Inter est le repli d'Archivo :
				// elle est déjà chargée, donc rien n'est rendu nu pendant l'attente.
				'display': ['Archivo', 'Inter', 'system-ui', 'sans-serif'],
				'inter': ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				// Les matières, accessibles en direct : le pied de page est
				// marine quelle que soit la portée qui l'entoure, et une plaque
				// de pierre reste de pierre au milieu de la nuit.
				// Les matières, accessibles en direct. ATTENTION au modificateur
				// d'opacité : `bg-nuit/95` fonctionne, `bg-nuit/96` NE PRODUIT
				// RIEN. Tailwind n'accepte que les valeurs de son échelle
				// d'opacité ; hors échelle, il faut la forme entre crochets —
				// `bg-nuit/[0.96]`. La classe hors échelle est ignorée EN
				// SILENCE : pas d'erreur, pas d'avertissement. C'est ainsi que
				// les quatre ouvertures de pages services se sont retrouvées
				// sans voile, texte clair sur photographie en pleine lumière.
				nuit: 'hsl(var(--nuit))',
				marine: 'hsl(var(--marine))',
				pierre: 'hsl(var(--pierre))',
				ivoire: 'hsl(var(--ivoire))',
				encre: 'hsl(var(--encre))',
				laiton: 'hsl(var(--laiton))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))',
					soft: 'hsl(var(--primary-soft))',
					display: 'hsl(var(--primary-display))',
					ink: 'hsl(var(--primary-ink))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					soft: 'hsl(var(--secondary-soft))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
					ink: 'hsl(var(--destructive-ink))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				}
			},
			// Géométrie de plaque. `2xl` et `3xl` sont redéfinis et non
			// seulement `lg` : Tailwind les code en dur à 1 rem et 1,5 rem, et
			// les pages internes en comptent une quarantaine. Les redéfinir
			// resserre tout le site sans rouvrir onze fichiers.
			borderRadius: {
				sm: 'var(--radius-sm)',
				md: 'var(--radius)',
				lg: 'var(--radius-lg)',
				xl: 'var(--radius-xl)',
				'2xl': 'var(--radius-xl)',
				'3xl': 'var(--radius-xl)',
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-glass': 'var(--gradient-glass)',
				'gradient-subtle': 'var(--gradient-subtle)'
			},
			boxShadow: {
				'pose': 'var(--shadow-pose)',
				'appui': 'var(--shadow-appui)',
				// Anciens noms, réaffectés : trente-deux usages dans les pages
				// internes, qui pointaient tous vers des halos jaunes.
				'elegant': 'var(--shadow-elegant)',
				'card': 'var(--shadow-card)',
				'glass': 'var(--shadow-glass)',
				'float': 'var(--shadow-float)'
			},
			letterSpacing: {
				'plaque': '0.16em',
			},
			// Les trois courbes du système, atteignables en classes utilitaires.
			// Elles lisent les jetons de src/index.css : une seule source.
			transitionTimingFunction: {
				'sortie': 'var(--sortie)',
				'etat': 'var(--sortie-douce)',
				'reversible': 'var(--reversible)',
				// Le rebond est retiré du système : plus rien ne dépasse sa
				// position d'arrivée. L'ancien nom reste pour ne rien casser.
				'bounce': 'var(--sortie)',
			},
			// Les six durées. `duration-3` plutôt que `duration-300` : le nombre
			// cesse d'être une valeur qu'on ajuste et redevient un cran d'échelle.
			transitionDuration: {
				'1': 'var(--d1)',
				'2': 'var(--d2)',
				'3': 'var(--d3)',
				'4': 'var(--d4)',
				'5': 'var(--d5)',
				'6': 'var(--d6)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
				'accordion-up': 'accordion-up 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
