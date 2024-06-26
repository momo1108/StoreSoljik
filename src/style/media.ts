import {
  RuleSet,
  css,
  type CSSObject,
  type Interpolation,
} from 'styled-components';

export type Breakpoints =
  | 'xxsmall'
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge';

export const breakpoints: Record<Breakpoints, string> = {
  xxsmall: '@media (max-width: 319px)',
  xsmall: '@media (max-width: 479px)',
  small: '@media (max-width: 639px)',
  medium: '@media (max-width: 1047px)',
  large: '@media (max-width: 1440px)',
  xlarge: '@media (min-width: 1441px)',
};

const media = Object.entries(breakpoints).reduce((acc, [key, value]) => {
  return {
    ...acc,
    [key]: (
      first: CSSObject | TemplateStringsArray,
      ...interpolations: Interpolation<object>[]
    ) => css`
      ${value} {
        ${css(first, ...interpolations)}
      }
    `,
  };
}, {}) as Record<
  Breakpoints,
  (
    first: CSSObject | TemplateStringsArray,
    ...interpolations: Interpolation<object>[]
  ) => RuleSet<object>
>;

export default media;
