type FontSizes =
  | 'xxxs'
  | 'xxs'
  | 'xs'
  | 'sm'
  | 'base'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl'
  | 'xxxl'
  | 'xxxxl';

const fontSize: Record<FontSizes, string> = {
  xxxs: '0.5rem',
  xxs: '0.6rem',
  xs: '0.7rem',
  sm: '0.85rem',
  base: '1rem',
  md: '1.13rem',
  lg: '1.25rem',
  xl: '1.75rem',
  xxl: '2.5rem',
  xxxl: '3.125rem',
  xxxxl: '3.75rem',
};

export type Themes = 'light' | 'dark';

const light = {
  type: 'light',
  description: '#AAA',
  valid: '#47E573',
  invalid: '#E54747',
  background: 'hsl(0 0% 100%)',
  foreground: 'hsl(222.2 84% 4.9%)',
  card: 'hsl(0 0% 100%)',
  cardForeground: 'hsl(222.2 84% 4.9%)',
  popover: 'hsl(0 0% 100%)',
  popoverForeground: 'hsl(222.2 84% 4.9%)',
  primary: '#2D3648',
  primaryHover: '#19203e',
  primaryForeground: 'hsl(210 40% 98%)',
  secondary: 'hsl(210 40% 96.1%)',
  secondaryForeground: 'hsl(222.2 47.4% 11.2%)',
  muted: 'hsl(210 40% 96.1%)',
  mutedForeground: 'hsl(215.4 16.3% 46.9%)',
  accent: 'hsl(210 40% 96.1%)',
  accentForeground: 'hsl(222.2 47.4% 11.2%)',
  destructive: 'hsl(0 84.2% 60.2%)',
  destructiveForeground: 'hsl(210 40% 98%)',
  border: 'hsl(214.3 31.8% 91.4%)',
  headerBorder: '#1A202C',
  input: 'hsl(214.3 31.8% 91.4%)',
  ring: 'hsl(221.2 83.2% 53.3%)',
  radius: '0.5rem',
};

const dark = {
  type: 'dark',
  description: '#AAA',
  valid: '#47E573',
  invalid: '#E54747',
  background: 'hsl(222.2 84% 4.9%)',
  foreground: 'hsl(210 40% 98%)',
  card: 'hsl(222.2 84% 4.9%)',
  cardForeground: 'hsl(210 40% 98%)',
  popover: 'hsl(222.2 84% 4.9%)',
  popoverForeground: 'hsl(210 40% 98%)',
  primary: '#2D3648',
  primaryHover: '#212938',
  primaryForeground: 'hsl(222.2 47.4% 11.2%)',
  secondary: 'hsl(217.2 32.6% 17.5%)',
  secondaryForeground: 'hsl(210 40% 98%)',
  muted: 'hsl(217.2 32.6% 17.5%)',
  mutedForeground: 'hsl(215 20.2% 65.1%)',
  accent: 'hsl(217.2 32.6% 17.5%)',
  accentForeground: 'hsl(210 40% 98%)',
  destructive: 'hsl(0 62.8% 30.6%)',
  destructiveForeground: 'hsl(210 40% 98%)',
  border: 'hsl(217.2 32.6% 17.5%)',
  headerBorder: '#9AA0AC',
  input: 'hsl(217.2 32.6% 17.5%)',
  ring: 'hsl(224.3 76.3% 48%)',
  radius: '0.5rem',
};

const theme = {
  fontSize,
  light,
  dark,
};

export default theme;
