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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
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
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'tambola-reveal': {
					'0%': {
						transform: 'scale(0) rotate(180deg)',
						opacity: '0'
					},
					'50%': {
						transform: 'scale(1.2) rotate(90deg)',
						opacity: '0.8'
					},
					'100%': {
						transform: 'scale(1) rotate(0deg)',
						opacity: '1'
					}
				},
				'tambola-glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px hsl(45 93% 65% / 0.4)',
						transform: 'scale(1)'
					},
					'50%': {
						boxShadow: '0 0 40px hsl(45 93% 65% / 0.8)',
						transform: 'scale(1.05)'
					}
				},
				'ticket-appear': {
					'0%': {
						transform: 'translateY(50px) scale(0.8)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0) scale(1)',
						opacity: '1'
					}
				},
				'cell-mark': {
					'0%': {
						transform: 'scale(0.8)',
						backgroundColor: 'hsl(var(--tambola-called))'
					},
					'50%': {
						transform: 'scale(1.1)',
						backgroundColor: 'hsl(var(--tambola-called))'
					},
					'100%': {
						transform: 'scale(1)',
						backgroundColor: 'hsl(var(--tambola-called))'
					}
				},
				'winner-celebration': {
					'0%, 100%': {
						transform: 'scale(1) rotate(0deg)',
						boxShadow: '0 0 20px hsl(120 100% 50% / 0.5)'
					},
					'25%': {
						transform: 'scale(1.05) rotate(1deg)',
						boxShadow: '0 0 30px hsl(120 100% 50% / 0.8)'
					},
					'75%': {
						transform: 'scale(1.05) rotate(-1deg)',
						boxShadow: '0 0 30px hsl(120 100% 50% / 0.8)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'bounce-in': {
					'0%': {
						transform: 'scale(0.3)',
						opacity: '0'
					},
					'50%': {
						transform: 'scale(1.05)',
						opacity: '0.8'
					},
					'70%': {
						transform: 'scale(0.9)',
						opacity: '1'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'tambola-reveal': 'tambola-reveal 0.6s ease-out forwards',
				'tambola-glow': 'tambola-glow 1s ease-in-out infinite',
				'ticket-appear': 'ticket-appear 0.8s ease-out forwards',
				'cell-mark': 'cell-mark 0.3s ease-out forwards',
				'winner-celebration': 'winner-celebration 1s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'bounce-in': 'bounce-in 0.6s ease-out forwards'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
