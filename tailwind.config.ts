import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	/*
	 * Plus de `safelist` : elle protégeait les cinq états d'éclairage de
	 * l'ancienne ouverture (`heure-aube` … `heure-nuit`), composés à l'exécution
	 * par un script d'`index.html`. L'ouverture éclairée a été retirée avec la
	 * direction « La Plaque » (04/09/2026), le script aussi.
	 */
	prefix: "",
	theme: {
		container: {
			center: true,
			// 1,5 rem sous md : à 2 rem, un texte de 16 px n'avait plus que
			// 279 px de mesure sur un écran de 375, et les mots se coupaient.
			// 3,5 rem dès lg : c'est la marge de 56 px des planches de la direction
			// artistique, sur une largeur de 1 280.
			padding: {
				DEFAULT: '1.5rem',
				lg: '3.5rem',
			},
			screens: {
				'2xl': '1440px'
			}
		},
		extend: {
			fontFamily: {
				// Quatre familles, quatre rôles — voir le commentaire des polices
				// dans index.html. `display` garde son nom : une quarantaine
				// d'emplois pointent dessus pour les PRIX et le TÉLÉPHONE, et
				// c'est exactement ce qu'Archivo continue de composer.
				// Les « repli » sont des @font-face de src/index.css : la fonte
				// système locale, aux métriques de la vraie fonte (size-adjust,
				// ascent/descent-override). C'est ce qui ramène le décalage de mise
				// en page à la substitution — mesuré, voir le commentaire du CSS.
				'serif': ['"Instrument Serif"', '"Instrument Serif repli"', 'Georgia', 'serif'],
				'sans': ['Figtree', '"Figtree repli"', 'system-ui', '-apple-system', 'sans-serif'],
				'mono': ['"IBM Plex Mono"', 'ui-monospace', 'Menlo', 'monospace'],
				'display': ['Archivo', '"Archivo repli"', 'Figtree', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				// Les matières, accessibles en direct. ATTENTION au modificateur
				// d'opacité : `bg-marine/95` fonctionne, `bg-marine/96` NE PRODUIT
				// RIEN. Tailwind n'accepte que les valeurs de son échelle ; hors
				// échelle, il faut la forme entre crochets — `bg-marine/[0.96]`. La
				// classe hors échelle est ignorée EN SILENCE.
				nuit: 'hsl(var(--nuit))',
				marine: 'hsl(var(--marine))',
				pierre: 'hsl(var(--pierre))',
				lin: 'hsl(var(--lin))',
				ivoire: 'hsl(var(--ivoire))',
				encre: 'hsl(var(--encre))',
				ardoise: 'hsl(var(--ardoise))',
				laiton: 'hsl(var(--laiton))',
				bouton: {
					DEFAULT: 'hsl(var(--bouton))',
					foreground: 'hsl(var(--bouton-foreground))',
					survol: 'hsl(var(--bouton-survol))',
				},
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
			// La géométrie de « La Plaque » est à angle vif : aucun rayon nulle
			// part. Les échelons existent pour que les `rounded-*` hérités des
			// pages retombent tous à zéro sans rouvrir les fichiers.
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
				// Anciens noms, réaffectés vers les ombres d'encre.
				'elegant': 'var(--shadow-elegant)',
				'card': 'var(--shadow-card)',
				'glass': 'var(--shadow-glass)',
				'float': 'var(--shadow-float)'
			},
			letterSpacing: {
				'plaque': '0.18em',
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
	plugins: [animate],
} satisfies Config;
